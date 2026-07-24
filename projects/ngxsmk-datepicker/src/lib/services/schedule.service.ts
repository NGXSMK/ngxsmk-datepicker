import { computed, Injectable, signal } from '@angular/core';
import {
  DEFAULT_SCHEDULE_COLORS,
  DEFAULT_SCHEDULE_ICONS,
  ScheduleChangeEvent,
  ScheduleColor,
  ScheduleItem,
  SchedulePriority,
} from '../interfaces/schedule-item.interface';
import { exportToIcs } from '../utils/export-import.utils';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Generate a UUID v4 string (with browser + Node fallback). */
function uuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/** Returns `true` if two date ranges overlap (end is exclusive). */
function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}

// ─── Validation Errors ───────────────────────────────────────────────────────

export interface ScheduleValidationError {
  field: string;
  message: string;
}

export interface ScheduleValidationResult {
  valid: boolean;
  errors: ScheduleValidationError[];
}

// ─── Service ─────────────────────────────────────────────────────────────────

/**
 * `ScheduleService` manages the reactive state for the date schedule panel.
 *
 * All state is exposed as Angular signals, making it compatible with both
 * zone-based and zoneless change detection.
 *
 * Inject this service if you need programmatic access to schedule data
 * outside the datepicker component:
 *
 * @example
 * ```typescript
 * const schedule = inject(ScheduleService);
 * schedule.add({ title: 'Launch', start: new Date() });
 * effect(() => console.log(schedule.items()));
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ScheduleService {
  // ─── Reactive State ────────────────────────────────────────────────────

  /** Full list of schedule items in the current manual order. */
  readonly items = signal<ScheduleItem[]>([]);

  /** ID of the item currently open in the edit form (or `null`). */
  readonly editingId = signal<string | null>(null);

  /** ID of the item row currently expanded (or `null`). */
  readonly expandedId = signal<string | null>(null);

  /** Current sort mode. `'manual'` preserves drag-drop order. */
  readonly sortMode = signal<'manual' | 'date' | 'priority' | 'title'>('manual');

  /** Text filter applied to title, notes, tags, and category. */
  readonly filterText = signal<string>('');

  /** Active tag filters (items must have ALL selected tags). */
  readonly filterTags = signal<string[]>([]);

  /** Active category filters (items must match one selected category). */
  readonly filterCategories = signal<string[]>([]);

  // ─── Derived State (computed) ─────────────────────────────────────────

  /** Items passing the current filter (text + tags + categories). */
  readonly filtered = computed<ScheduleItem[]>(() => {
    const text = this.filterText().toLowerCase().trim();
    const tags = this.filterTags();
    const cats = this.filterCategories();
    return this.items().filter((item) => {
      if (item.hidden) return false;
      if (text) {
        const inTitle = item.title.toLowerCase().includes(text);
        const inNotes = item.notes?.toLowerCase().includes(text) ?? false;
        const inTags = item.tags?.some((t) => t.toLowerCase().includes(text)) ?? false;
        const inCategory = item.category?.toLowerCase().includes(text) ?? false;
        if (!inTitle && !inNotes && !inTags && !inCategory) return false;
      }
      if (tags.length > 0) {
        const itemTags = item.tags ?? [];
        if (!tags.every((t) => itemTags.includes(t))) return false;
      }
      if (cats.length > 0) {
        if (!item.category || !cats.includes(item.category)) return false;
      }
      return true;
    });
  });

  /** Filtered items after applying the current sort mode. */
  readonly sorted = computed<ScheduleItem[]>(() => {
    const list = [...this.filtered()];
    switch (this.sortMode()) {
      case 'date':
        return list.sort((a, b) => a.start.getTime() - b.start.getTime());
      case 'priority': {
        const rank: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
        return list.sort((a, b) => (rank[a.priority ?? 'low'] ?? 3) - (rank[b.priority ?? 'low'] ?? 3));
      }
      case 'title':
        return list.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return list; // manual order preserved
    }
  });

  /** De-duplicated list of all tags across visible (non-hidden) items. */
  readonly allTags = computed<string[]>(() => {
    const set = new Set<string>();
    this.items().forEach((item) => item.tags?.forEach((t) => set.add(t)));
    return [...set].sort();
  });

  /** De-duplicated list of all categories across visible items. */
  readonly allCategories = computed<string[]>(() => {
    const set = new Set<string>();
    this.items().forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return [...set].sort();
  });

  /**
   * All conflicting pairs of active (non-completed, non-hidden) items
   * whose date ranges overlap.
   */
  readonly conflicts = computed<[ScheduleItem, ScheduleItem][]>(() => {
    const active = this.items().filter((i) => !i.hidden && !i.completed && i.start);
    const pairs: [ScheduleItem, ScheduleItem][] = [];
    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        const a = active[i]!;
        const b = active[j]!;
        const aEnd = a.end ?? a.start;
        const bEnd = b.end ?? b.start;
        if (rangesOverlap(a.start, aEnd, b.start, bEnd)) {
          pairs.push([a, b]);
        }
      }
    }
    return pairs;
  });

  /** `true` if any active items overlap in time. */
  readonly hasConflicts = computed(() => this.conflicts().length > 0);

  /** Total number of visible (non-hidden) items. */
  readonly visibleCount = computed(() => this.items().filter((i) => !i.hidden).length);

  /** Total number of completed items. */
  readonly completedCount = computed(() => this.items().filter((i) => i.completed).length);

  // ─── CRUD ────────────────────────────────────────────────────────────

  /**
   * Add a new schedule item. An `id` is auto-generated if not provided.
   * Returns the created item.
   */
  add(partial: Omit<ScheduleItem, 'id'> & { id?: string }): ScheduleItem {
    const item: ScheduleItem = { ...partial, id: partial.id ?? uuid() };
    this.items.update((list) => [...list, item]);
    return item;
  }

  /**
   * Update fields on an existing item by id.
   * Emits no change if the id is not found.
   */
  update(id: string, patch: Partial<Omit<ScheduleItem, 'id'>>): void {
    this.items.update((list) => list.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  /**
   * Remove an item by id.
   * Emits no change if the id is not found.
   */
  remove(id: string): void {
    this.items.update((list) => list.filter((item) => item.id !== id));
    if (this.editingId() === id) this.editingId.set(null);
    if (this.expandedId() === id) this.expandedId.set(null);
  }

  /**
   * Create a copy of an existing item with a new `id`.
   * The duplicate is appended immediately after the original.
   * Returns the new item, or `null` if the source id is not found.
   */
  duplicate(id: string): ScheduleItem | null {
    const source = this.items().find((i) => i.id === id);
    if (!source) return null;
    const copy: ScheduleItem = { ...source, id: uuid(), title: `${source.title} (copy)` };
    this.items.update((list) => {
      const idx = list.findIndex((i) => i.id === id);
      const next = [...list];
      next.splice(idx + 1, 0, copy);
      return next;
    });
    return copy;
  }

  /** Toggle the `completed` flag on an item. */
  toggleComplete(id: string): void {
    this.items.update((list) => list.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
  }

  /** Toggle the `hidden` flag on an item. */
  toggleHidden(id: string): void {
    this.items.update((list) => list.map((item) => (item.id === id ? { ...item, hidden: !item.hidden } : item)));
  }

  /** Toggle the `locked` flag on an item. */
  toggleLocked(id: string): void {
    this.items.update((list) => list.map((item) => (item.id === id ? { ...item, locked: !item.locked } : item)));
  }

  // ─── Ordering ────────────────────────────────────────────────────────

  /**
   * Move an item from `fromIndex` to `toIndex` in the manual order.
   * Locked items cannot be moved.
   */
  reorder(fromIndex: number, toIndex: number): void {
    this.items.update((list) => {
      const item = list[fromIndex];
      if (!item || item.locked) return list;
      const next = [...list];
      next.splice(fromIndex, 1);
      next.splice(toIndex, 0, item);
      return next;
    });
    this.sortMode.set('manual');
  }

  /** Sort items by start date (ascending by default). */
  sortByDate(direction: 'asc' | 'desc' = 'asc'): void {
    this.items.update((list) =>
      [...list].sort((a, b) =>
        direction === 'asc' ? a.start.getTime() - b.start.getTime() : b.start.getTime() - a.start.getTime()
      )
    );
    this.sortMode.set('date');
  }

  /** Sort items by priority (critical → high → medium → low). */
  sortByPriority(): void {
    const rank: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    this.items.update((list) =>
      [...list].sort((a, b) => (rank[a.priority ?? 'low'] ?? 3) - (rank[b.priority ?? 'low'] ?? 3))
    );
    this.sortMode.set('priority');
  }

  /** Sort items alphabetically by title. */
  sortByTitle(): void {
    this.items.update((list) => [...list].sort((a, b) => a.title.localeCompare(b.title)));
    this.sortMode.set('title');
  }

  // ─── Bulk Operations ─────────────────────────────────────────────────

  /** Replace the entire item list. Resets filter and editing state. */
  setItems(items: ScheduleItem[]): void {
    this.items.set(items.map((i) => ({ ...i, id: i.id ?? uuid() })));
    this.editingId.set(null);
    this.expandedId.set(null);
    this.clearFilters();
  }

  /** Remove all items and reset state. */
  clearAll(): void {
    this.items.set([]);
    this.editingId.set(null);
    this.expandedId.set(null);
  }

  /** Remove all items where `completed === true`. */
  removeCompleted(): void {
    this.items.update((list) => list.filter((i) => !i.completed));
  }

  /** Remove all items matching the given ids. */
  removeMany(ids: string[]): void {
    const set = new Set(ids);
    this.items.update((list) => list.filter((i) => !set.has(i.id)));
  }

  // ─── Filter Helpers ──────────────────────────────────────────────────

  /** Clear all active filters (text, tags, categories). */
  clearFilters(): void {
    this.filterText.set('');
    this.filterTags.set([]);
    this.filterCategories.set([]);
  }

  /** Toggle a tag in the active tag filter. */
  toggleTagFilter(tag: string): void {
    this.filterTags.update((tags) => (tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]));
  }

  /** Toggle a category in the active category filter. */
  toggleCategoryFilter(cat: string): void {
    this.filterCategories.update((cats) => (cats.includes(cat) ? cats.filter((c) => c !== cat) : [...cats, cat]));
  }

  // ─── Conflict Helpers ────────────────────────────────────────────────

  /**
   * Returns all items that conflict (overlap) with the given item id.
   * Returns an empty array if the item is not found or has no `end` date.
   */
  getConflictsFor(id: string): ScheduleItem[] {
    const target = this.items().find((i) => i.id === id);
    if (!target || target.hidden || target.completed) return [];
    const targetEnd = target.end ?? target.start;
    return this.items().filter((i) => {
      if (i.id === id || i.hidden || i.completed) return false;
      const iEnd = i.end ?? i.start;
      return rangesOverlap(target.start, targetEnd, i.start, iEnd);
    });
  }

  // ─── Validation ──────────────────────────────────────────────────────

  /**
   * Validate a draft item before saving.
   * Returns a `ScheduleValidationResult` with per-field error messages.
   */
  validate(
    item: Partial<ScheduleItem>,
    options?: {
      maxItems?: number;
      allowOverlap?: boolean;
      customValidator?: (item: ScheduleItem, all: ScheduleItem[]) => string | null;
    }
  ): ScheduleValidationResult {
    const errors: ScheduleValidationError[] = [];

    if (!item.title?.trim()) {
      errors.push({ field: 'title', message: 'Title is required' });
    }
    if (!item.start) {
      errors.push({ field: 'start', message: 'Start date is required' });
    }
    if (item.start && item.end && item.end < item.start) {
      errors.push({ field: 'end', message: 'End must be after start' });
    }
    if (options?.maxItems != null && this.items().length >= options.maxItems && !item.id) {
      errors.push({ field: '_global', message: `Maximum ${options.maxItems} items reached` });
    }
    if (!options?.allowOverlap && item.start) {
      const draft = item as ScheduleItem;
      const conflicts = this.getConflictsFor(draft.id ?? '').filter((c) => c.id !== draft.id);
      if (conflicts.length > 0) {
        errors.push({
          field: '_conflict',
          message: `Overlaps with: ${conflicts.map((c) => c.title).join(', ')}`,
        });
      }
    }
    if (options?.customValidator && item.title && item.start) {
      const msg = options.customValidator(item as ScheduleItem, this.items());
      if (msg) errors.push({ field: '_custom', message: msg });
    }

    return { valid: errors.length === 0, errors };
  }

  // ─── Import / Export ─────────────────────────────────────────────────

  /**
   * Export all items as an ICS calendar string.
   * Uses the shared `exportToIcs()` utility from the library.
   */
  toIcs(): string {
    try {
      const dates = this.items()
        .filter((i) => !i.hidden)
        .map((i) => i.start);
      return exportToIcs(dates, {});
    } catch {
      return '';
    }
  }

  /**
   * Export all items as a JSON string.
   * The output is a `ScheduleItem[]` serialized via `JSON.stringify`.
   * Dates are serialized as ISO strings.
   */
  toJson(): string {
    return JSON.stringify(this.items(), null, 2);
  }

  /**
   * Replace the current items from a JSON string previously produced by `toJson()`.
   * Dates are re-hydrated from ISO strings.
   */
  fromJson(json: string): void {
    try {
      const raw = JSON.parse(json) as unknown[];
      const items = (Array.isArray(raw) ? raw : []).map((r: unknown) => {
        const obj = r as Record<string, unknown>;
        const item: ScheduleItem = {
          ...(obj as Omit<ScheduleItem, 'start' | 'end' | 'id'>),
          id: (obj['id'] as string) ?? uuid(),
          title: (obj['title'] as string) ?? 'Untitled',
          start: new Date(obj['start'] as string),
        };
        if (obj['end']) item.end = new Date(obj['end'] as string);
        return item;
      }) as ScheduleItem[];
      this.setItems(items);
    } catch (e) {
      console.error('[ScheduleService] fromJson parse error:', e);
    }
  }

  /**
   * Export all visible items as a simple CSV string.
   * Columns: id, title, start, end, color, priority, tags, category, notes
   */
  toCsv(): string {
    const header = 'id,title,start,end,color,priority,tags,category,notes';
    const rows = this.items()
      .filter((i) => !i.hidden)
      .map((i) =>
        [
          i.id,
          `"${i.title.replace(/"/g, '""')}"`,
          i.start.toISOString(),
          i.end?.toISOString() ?? '',
          i.color ?? '',
          i.priority ?? '',
          (i.tags ?? []).join(';'),
          i.category ?? '',
          `"${(i.notes ?? '').replace(/"/g, '""')}"`,
        ].join(',')
      );
    return [header, ...rows].join('\n');
  }

  /**
   * Import items from a CSV string previously produced by `toCsv()`.
   * Appends to the current list (does not replace).
   */
  fromCsv(csv: string): void {
    try {
      const [_header, ...rows] = csv.split('\n').filter(Boolean);
      const newItems: ScheduleItem[] = rows.map((row) => {
        const cols = row.match(/(".*?"|[^,]+|(?<=,)(?=,))/g) ?? [];
        const clean = (s: string | undefined) => (s ?? '').replace(/^"|"$/g, '').replace(/""/g, '"');
        const item: ScheduleItem = {
          id: clean(cols[0]) || uuid(),
          title: clean(cols[1]) || 'Untitled',
          start: new Date(clean(cols[2])),
        };
        if (cols[3]) item.end = new Date(clean(cols[3]));
        const color = clean(cols[4]);
        if (color) item.color = color as ScheduleColor;
        const priority = clean(cols[5]);
        if (priority) item.priority = priority as SchedulePriority;
        const tags = clean(cols[6]);
        item.tags = tags ? tags.split(';') : [];
        const category = clean(cols[7]);
        if (category) item.category = category;
        const notes = clean(cols[8]);
        if (notes) item.notes = notes;
        return item;
      });
      this.items.update((list) => [...list, ...newItems]);
    } catch (e) {
      console.error('[ScheduleService] fromCsv parse error:', e);
    }
  }

  // ─── Utility ─────────────────────────────────────────────────────────

  /** Find an item by id. Returns `undefined` if not found. */
  findById(id: string): ScheduleItem | undefined {
    return this.items().find((i) => i.id === id);
  }

  /**
   * Build the default color presets list.
   * Override by passing `scheduleColorPresets` to the datepicker.
   */
  getDefaultColorPresets(): ScheduleColor[] {
    return [...DEFAULT_SCHEDULE_COLORS];
  }

  /**
   * Build the default icon presets list.
   * Override by passing `scheduleIconPresets` to the datepicker.
   */
  getDefaultIconPresets(): string[] {
    return [...DEFAULT_SCHEDULE_ICONS];
  }

  /**
   * Build a `ScheduleChangeEvent` for the given action.
   * Used internally by components to emit consistent change events.
   */
  buildChangeEvent(action: ScheduleChangeEvent['action'], affected: ScheduleItem[]): ScheduleChangeEvent {
    return { items: this.items(), action, affected };
  }
}
