import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import {
  DEFAULT_SCHEDULE_COLORS,
  DEFAULT_SCHEDULE_FIELDS,
  DEFAULT_SCHEDULE_ICONS,
  ScheduleChangeEvent,
  ScheduleColor,
  ScheduleFieldsConfig,
  ScheduleFormTemplates,
  ScheduleItem,
} from '../interfaces/schedule-item.interface';
import { ScheduleService } from '../services/schedule.service';
import { ScheduleItemRowComponent } from './schedule-item-row.component';
import { ScheduleFormComponent } from './schedule-form.component';

import { getStartOfDay, isSameDay } from '../utils/date.utils';

/**
 * `ScheduleEditorComponent`
 *
 * The full schedule panel rendered when `mode="schedule"` on
 * `NgxsmkDatepickerComponent`. Orchestrates:
 *
 * - CDK drag-and-drop list for manual reordering
 * - Inline add/edit form (ScheduleFormComponent)
 * - Search bar, sort dropdown, tag/category filter panel
 * - Export (JSON/CSV/ICS) and import buttons
 * - Conflict summary banner
 * - Full template slot system for every UI unit
 *
 * @example
 * ```html
 * <!-- Standalone usage -->
 * <smk-schedule-editor
 *   [scheduleItems]="items"
 *   [scheduleShowTime]="true"
 *   [scheduleColorPresets]="['red','blue','#ff6600']"
 *   (scheduleChange)="onChanged($event)"
 *   (scheduleApply)="onApply($event)"
 * />
 * ```
 */
@Component({
  selector: 'smk-schedule-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, ScheduleItemRowComponent, ScheduleFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../styles/variables.css', '../styles/datepicker.css'],
  template: `
    <div class="smk-schedule-panel"
         [class.smk-schedule-panel--has-conflicts]="service.hasConflicts()"
         [class.smk-schedule-panel--full-page]="fullPage()">

      <!-- ─── Custom Header ────────────────────────────────────── -->
      @if (scheduleHeaderTemplate()) {
        <ng-container [ngTemplateOutlet]="scheduleHeaderTemplate()!" />
      } @else {
        <div class="smk-schedule-panel__header">
          <div class="smk-schedule-panel__title-group">
            <span class="smk-schedule-panel__title">{{ scheduleTitle() }}</span>
            <div class="smk-schedule-view-toggle">
              <button
                type="button"
                class="smk-schedule-view-btn"
                [class.smk-schedule-view-btn--active]="viewMode() === 'timeline'"
                (click)="setViewMode('timeline')"
                title="Timeline View"
              >Timeline</button>
              <button
                type="button"
                class="smk-schedule-view-btn"
                [class.smk-schedule-view-btn--active]="viewMode() === 'list'"
                (click)="setViewMode('list')"
                title="List View"
              >List</button>
            </div>
          </div>
          <div class="smk-schedule-panel__header-actions">
            @if (scheduleShowSearch()) {
              <div class="smk-schedule-search">
                <input
                  class="smk-schedule-search__input"
                  type="search"
                  [placeholder]="'Search...'"
                  [ngModel]="service.filterText()"
                  (ngModelChange)="service.filterText.set($event)"
                />
              </div>
            }
            @if (scheduleShowSort() && viewMode() === 'list') {
              <select
                class="smk-schedule-sort"
                [ngModel]="service.sortMode()"
                (ngModelChange)="onSortChange($event)"
              >
                <option value="manual">Manual Order</option>
                <option value="date">Sort by Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="title">Sort by Title</option>
              </select>
            }
            <button
              class="smk-schedule-panel__add-btn"
              type="button"
              [disabled]="maxReached()"
              (click)="onAddClick()"
            >+ {{ scheduleAddLabel() }}</button>
          </div>
        </div>
      }

      <!-- ─── Filter Bar ────────────────────────────────────────── -->
      @if (scheduleShowFilter()) {
        <div class="smk-schedule-filter">
          @for (tag of service.allTags(); track tag) {
            <button
              class="smk-schedule-filter__chip"
              [class.smk-schedule-filter__chip--active]="service.filterTags().includes(tag)"
              (click)="service.toggleTagFilter(tag)"
            >#{{ tag }}</button>
          }
          @for (cat of service.allCategories(); track cat) {
            <button
              class="smk-schedule-filter__chip"
              [class.smk-schedule-filter__chip--active]="service.filterCategories().includes(cat)"
              (click)="service.toggleCategoryFilter(cat)"
            >{{ cat }}</button>
          }
          @if (service.filterTags().length > 0 || service.filterCategories().length > 0) {
            <button
              class="smk-schedule-filter__clear"
              (click)="service.clearFilters()"
            >Clear Filters</button>
          }
        </div>
      }

      <!-- ─── Conflict Banner ───────────────────────────────────── -->
      @if (scheduleShowConflicts() && service.hasConflicts()) {
        <div class="smk-schedule-conflict-banner" role="alert" aria-live="polite">
          Conflict Warning: {{ service.conflicts().length }} overlap{{ service.conflicts().length !== 1 ? 's' : '' }} detected
          @for (pair of service.conflicts(); track pair[0].id + pair[1].id) {
            <span class="smk-schedule-conflict-banner__pair">
              "{{ pair[0].title }}" ↔ "{{ pair[1].title }}"
            </span>
          }
        </div>
      }

      <!-- ─── Add/Edit Form in Timeline View (at top) ───────────── -->
      @if (viewMode() === 'timeline' && (addingNew() || service.editingId())) {
        <div class="smk-schedule-form-wrapper smk-schedule-form-wrapper--timeline">
          <smk-schedule-form
            [item]="editingItem() || timelineNewItem()"
            [fields]="scheduleFields()"
            [formTemplates]="scheduleFormTemplates()"
            [colorPresets]="scheduleColorPresets()"
            [iconPresets]="scheduleIconPresets()"
            [categoryOptions]="scheduleCategoryOptions()"
            [tagSuggestions]="scheduleTagSuggestions()"
            [showTime]="scheduleShowTime()"
            [use24Hour]="scheduleUse24Hour()"
            [allowOverlap]="scheduleAllowOverlap()"
            [maxItems]="scheduleMaxItems()"
            [validateItem]="validateScheduleItem()"
            (save)="onFormSave($event)"
            (cancel)="onFormCancel()"
          />
        </div>
      }

      <!-- ─── Add Form in List View (top, when no editing) ──────── -->
      @if (viewMode() === 'list' && addingNew()) {
        <div class="smk-schedule-form-wrapper smk-schedule-form-wrapper--new">
          <smk-schedule-form
            [item]="null"
            [fields]="scheduleFields()"
            [formTemplates]="scheduleFormTemplates()"
            [colorPresets]="scheduleColorPresets()"
            [iconPresets]="scheduleIconPresets()"
            [categoryOptions]="scheduleCategoryOptions()"
            [tagSuggestions]="scheduleTagSuggestions()"
            [showTime]="scheduleShowTime()"
            [use24Hour]="scheduleUse24Hour()"
            [allowOverlap]="scheduleAllowOverlap()"
            [maxItems]="scheduleMaxItems()"
            [validateItem]="validateScheduleItem()"
            (save)="onFormSave($event)"
            (cancel)="onFormCancel()"
          />
        </div>
      }

      <!-- ─── Main View Switcher ────────────────────────────────── -->
      @if (viewMode() === 'timeline') {
        <!-- ─── Timeline / Gantt View ─── -->
        <div class="smk-timeline-workspace">
          <div class="smk-timeline-nav">
            <button type="button" class="smk-timeline-nav-btn" (click)="shiftTimeline(-7)">&lt;</button>
            <span class="smk-timeline-nav-range">{{ timelineSpannedMonths() }}</span>
            <button type="button" class="smk-timeline-nav-btn" (click)="shiftTimeline(7)">&gt;</button>
            <button type="button" class="smk-timeline-nav-btn smk-timeline-nav-btn--today" (click)="shiftTimelineToday()">Today</button>
          </div>

          <div class="smk-timeline-scroll-container">
            <div class="smk-timeline-grid">
              <!-- Header Row -->
              <div class="smk-timeline-grid-header">
                <div class="smk-timeline-grid-header-resource">Category / Resource</div>
                <div class="smk-timeline-grid-header-days">
                  @for (day of timelineDays(); track day.getTime()) {
                    <div class="smk-timeline-header-day" [class.smk-timeline-header-day--today]="isToday(day)">
                      <span class="smk-timeline-day-name">{{ getDayOfWeekName(day) }}</span>
                      <span class="smk-timeline-day-num">{{ day.getDate() }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Body Rows -->
              <div class="smk-timeline-grid-body">
                @for (category of timelineCategories(); track category) {
                  <div class="smk-timeline-grid-row">
                    <div class="smk-timeline-row-resource">{{ category }}</div>
                    
                    <div class="smk-timeline-row-columns">
                      <!-- Interactive background cells -->
                      @for (day of timelineDays(); track day.getTime()) {
                        <div 
                          class="smk-timeline-grid-cell" 
                          [class.smk-timeline-grid-cell--today]="isToday(day)"
                          (click)="onTimelineCellClick(category, day)"
                          title="Click cell to schedule item here"
                        ></div>
                      }

                      <!-- Item spans overlaid -->
                      @for (item of getItemsForCategory(category); track item.id) {
                        @if (isItemInWindow(item)) {
                          <div 
                            class="smk-timeline-item-bar"
                            [style.grid-column-start]="getColumnStart(item)"
                            [style.grid-column-end]="getColumnEnd(item)"
                            [style.--item-color]="resolveColor(item.color)"
                            [class.smk-timeline-item-bar--completed]="item.completed"
                            [class.smk-timeline-item-bar--locked]="item.locked"
                            (click)="onTimelineItemClick(item, $event)"
                            [title]="item.title"
                          >
                            @if (item.icon) {
                              <span class="smk-timeline-item-bar__icon">{{ item.icon }}</span>
                            }
                            <span class="smk-timeline-item-bar__title">{{ item.title }}</span>
                            <span class="smk-timeline-item-bar__dates">{{ formatItemBarRange(item) }}</span>
                          </div>
                        }
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      } @else {
        <!-- ─── Item List (CDK Drop) ─── -->
        @if (service.sorted().length > 0) {
          <div
            class="smk-schedule-list"
            cdkDropList
            [cdkDropListData]="service.sorted()"
            (cdkDropListDropped)="onDrop($event)"
            [attr.aria-label]="'Schedule items, ' + service.sorted().length + ' total'"
            role="list"
          >
            @for (item of service.sorted(); track item.id) {
              <div
                class="smk-schedule-list__item-wrap"
                cdkDrag
                [cdkDragDisabled]="!!(item.locked || service.sortMode() !== 'manual')"
                [attr.role]="'listitem'"
              >
                <!-- Drag preview placeholder -->
                <div class="smk-schedule-list__drag-preview" *cdkDragPlaceholder></div>
  
                <smk-schedule-item-row
                  [item]="item"
                  [isEditing]="service.editingId() === item.id"
                  [conflicts]="service.getConflictsFor(item.id)"
                  [rowTemplate]="scheduleRowTemplate()"
                  [badgeTemplate]="scheduleBadgeTemplate()"
                  [actionsTemplate]="scheduleActionsTemplate()"
                  [showDragHandle]="scheduleShowDragHandle()"
                  [showComplete]="scheduleShowComplete()"
                  [showDuplicate]="scheduleShowDuplicate()"
                  [showConflictWarning]="scheduleShowConflicts()"
                  [formatItemDate]="formatItemDate()"
                  [formatItemDuration]="formatItemDuration()"
                  (editClick)="onEditClick($event)"
                  (deleteClick)="onDeleteClick($event)"
                  (duplicateClick)="onDuplicateClick($event)"
                  (toggleComplete)="onToggleComplete($event)"
                  (toggleLock)="onToggleLock($event)"
                  (itemClick)="itemClick.emit($event)"
                />
  
                <!-- Inline Edit Form -->
                @if (service.editingId() === item.id) {
                  <div class="smk-schedule-form-wrapper">
                    <smk-schedule-form
                      [item]="item"
                      [fields]="scheduleFields()"
                      [formTemplates]="scheduleFormTemplates()"
                      [colorPresets]="scheduleColorPresets()"
                      [iconPresets]="scheduleIconPresets()"
                      [categoryOptions]="scheduleCategoryOptions()"
                      [tagSuggestions]="scheduleTagSuggestions()"
                      [showTime]="scheduleShowTime()"
                      [use24Hour]="scheduleUse24Hour()"
                      [allowOverlap]="scheduleAllowOverlap()"
                      [maxItems]="scheduleMaxItems()"
                      [validateItem]="validateScheduleItem()"
                      (save)="onFormSave($event)"
                      (cancel)="onFormCancel()"
                    />
                  </div>
                }
              </div>
            }
          </div>
        } @else if (!addingNew()) {
          <!-- ─── Empty State ─── -->
          @if (scheduleEmptyTemplate()) {
            <ng-container [ngTemplateOutlet]="scheduleEmptyTemplate()!" />
          } @else {
            <div class="smk-schedule-empty" aria-label="No schedule items">
              <div class="smk-schedule-empty__icon">📋</div>
              <p class="smk-schedule-empty__title">No items yet</p>
              <p class="smk-schedule-empty__subtitle">Click <strong>+ {{ scheduleAddLabel() }}</strong> to get started</p>
            </div>
          }
        }
      }

      <!-- ─── Footer ────────────────────────────────────────────── -->
      @if (scheduleFooterTemplate()) {
        <ng-container
          [ngTemplateOutlet]="scheduleFooterTemplate()!"
          [ngTemplateOutletContext]="{ items: service.items() }"
        />
      } @else {
        <div class="smk-schedule-panel__footer">
          <div class="smk-schedule-panel__footer-left">
            @if (scheduleShowExport()) {
              <button
                class="smk-schedule-panel__footer-btn smk-schedule-panel__footer-btn--export"
                type="button"
                (click)="onExport('json')"
                title="Export as JSON"
              >Export JSON</button>
              <button
                class="smk-schedule-panel__footer-btn smk-schedule-panel__footer-btn--export"
                type="button"
                (click)="onExport('csv')"
                title="Export as CSV"
              >Export CSV</button>
              <button
                class="smk-schedule-panel__footer-btn smk-schedule-panel__footer-btn--export"
                type="button"
                (click)="onExport('ics')"
                title="Export as ICS calendar"
              >Export ICS</button>
            }
            @if (scheduleShowImport()) {
              <label
                class="smk-schedule-panel__footer-btn smk-schedule-panel__footer-btn--import"
                title="Import from file"
              >
                Import File
                <input
                  type="file"
                  accept=".json,.csv,.ics"
                  class="smk-schedule-import-input"
                  aria-label="Import schedule"
                  (change)="onImport($event)"
                />
              </label>
            }
          </div>
          <div class="smk-schedule-panel__footer-right">
            <button
              class="smk-schedule-panel__footer-btn smk-schedule-panel__footer-btn--cancel"
              type="button"
              (click)="scheduleCancel.emit()"
            >Cancel</button>
            <button
              class="smk-schedule-panel__footer-btn smk-schedule-panel__footer-btn--apply"
              type="button"
              (click)="scheduleApply.emit(service.items())"
            >Apply Schedule</button>
          </div>
        </div>
      }
    </div>
  `,
})
export class ScheduleEditorComponent implements OnInit {
  readonly service = inject(ScheduleService);

  // ─── Data Input ──────────────────────────────────────────────────

  /** Initial items to load into the schedule. Supports two-way binding. */
  readonly scheduleItems = input<ScheduleItem[]>([]);
  readonly fullPage = input<boolean>(false);

  // ─── Panel Configuration ─────────────────────────────────────────

  /** Panel heading text. */
  readonly scheduleTitle     = input<string>('Date Schedule');
  /** Label for the add-item button. */
  readonly scheduleAddLabel  = input<string>('Add Item');

  // ─── Form Passthrough ────────────────────────────────────────────

  readonly scheduleFields            = input<ScheduleFieldsConfig>(DEFAULT_SCHEDULE_FIELDS);
  readonly scheduleFormTemplates     = input<ScheduleFormTemplates | null>(null);
  readonly scheduleShowTime          = input<boolean>(false);
  readonly scheduleUse24Hour         = input<boolean>(false);
  readonly scheduleColorPresets      = input<(ScheduleColor | string)[]>([...DEFAULT_SCHEDULE_COLORS]);
  readonly scheduleIconPresets       = input<string[]>([...DEFAULT_SCHEDULE_ICONS]);
  readonly scheduleCategoryOptions   = input<string[]>([]);
  readonly scheduleTagSuggestions    = input<string[]>([]);
  readonly scheduleAllowOverlap      = input<boolean>(true);
  readonly scheduleMaxItems          = input<number | null>(null);

  // ─── Feature Toggles ─────────────────────────────────────────────

  readonly scheduleShowDragHandle    = input<boolean>(true);
  readonly scheduleShowComplete      = input<boolean>(true);
  readonly scheduleShowDuplicate     = input<boolean>(true);
  readonly scheduleShowExport        = input<boolean>(true);
  readonly scheduleShowImport        = input<boolean>(true);
  readonly scheduleShowSearch        = input<boolean>(true);
  readonly scheduleShowSort          = input<boolean>(true);
  readonly scheduleShowFilter        = input<boolean>(true);
  readonly scheduleShowConflicts     = input<boolean>(true);

  // ─── Template Slots ──────────────────────────────────────────────

  readonly scheduleRowTemplate       = input<TemplateRef<{ $implicit: ScheduleItem }> | null>(null);
  readonly scheduleBadgeTemplate     = input<TemplateRef<{ $implicit: ScheduleItem }> | null>(null);
  readonly scheduleActionsTemplate   = input<TemplateRef<{ $implicit: ScheduleItem }> | null>(null);
  readonly scheduleEmptyTemplate     = input<TemplateRef<void> | null>(null);
  readonly scheduleHeaderTemplate    = input<TemplateRef<void> | null>(null);
  readonly scheduleFooterTemplate    = input<TemplateRef<{ items: ScheduleItem[] }> | null>(null);

  // ─── Formatter Hooks ─────────────────────────────────────────────

  readonly formatItemDate            = input<((item: ScheduleItem) => string) | null>(null);
  readonly formatItemDuration        = input<((item: ScheduleItem) => string) | null>(null);

  // ─── Lifecycle Hooks ─────────────────────────────────────────────

  /** Return `false` to cancel add. Called before the add form opens. */
  readonly onBeforeAdd               = input<((item: ScheduleItem) => boolean) | null>(null);
  /** Return `false` to cancel edit. Called before the edit form opens. */
  readonly onBeforeEdit              = input<((item: ScheduleItem) => boolean) | null>(null);
  /** Return `false` to cancel delete. Called before the item is removed. */
  readonly onBeforeDelete            = input<((item: ScheduleItem) => boolean) | null>(null);
  /** Return `false` to cancel reorder. Called before the drop is applied. */
  readonly onBeforeReorder           = input<((from: number, to: number, items: ScheduleItem[]) => boolean) | null>(null);
  /** Custom validation per item. Return an error string or `null`. */
  readonly validateScheduleItem      = input<((item: ScheduleItem, all: ScheduleItem[]) => string | null) | null>(null);

  // ─── Outputs ─────────────────────────────────────────────────────

  /** Emitted on every mutation (add, edit, delete, reorder, import). */
  readonly scheduleChange  = output<ScheduleChangeEvent>();
  /** Emitted when the user clicks "Apply Schedule". */
  readonly scheduleApply   = output<ScheduleItem[]>();
  /** Emitted when the user clicks "Cancel". */
  readonly scheduleCancel  = output<void>();

  readonly itemAdd         = output<ScheduleItem>();
  readonly itemEdit        = output<ScheduleItem>();
  readonly itemDelete      = output<ScheduleItem>();
  readonly itemDuplicate   = output<ScheduleItem>();
  readonly itemReorder     = output<{ from: number; to: number; items: ScheduleItem[] }>();
  readonly itemClick       = output<ScheduleItem>();

  // ─── Internal State ──────────────────────────────────────────────

  readonly addingNew = signal(false);
  readonly timelineNewItem = signal<ScheduleItem | null>(null);

  readonly editingItem = computed(() => {
    const id = this.service.editingId();
    if (!id) return null;
    return this.service.items().find((item) => item.id === id) || null;
  });

  // ─── Timeline State & Logic ──────────────────────────────────────

  readonly viewMode = signal<'list' | 'timeline'>('timeline');
  readonly timelineStart = signal<Date>(getStartOfDay(new Date()));
  readonly timelineDaysCount = 21; // 3 weeks view

  readonly timelineDays = computed(() => {
    const days = [];
    const start = this.timelineStart();
    for (let i = 0; i < this.timelineDaysCount; i++) {
      const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      days.push(d);
    }
    return days;
  });

  readonly timelineSpannedMonths = computed(() => {
    const days = this.timelineDays();
    if (days.length === 0) return '';
    const first = days[0]!;
    const last = days[days.length - 1]!;
    const format = (date: Date) => date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const m1 = format(first);
    const m2 = format(last);
    return m1 === m2 ? m1 : `${m1}  /  ${m2}`;
  });

  readonly timelineCategories = computed(() => {
    const opts = this.scheduleCategoryOptions();
    if (opts.length > 0) return opts;
    const items = this.service.items();
    const cats = new Set<string>();
    items.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return cats.size > 0 ? Array.from(cats) : ['Unassigned'];
  });

  setViewMode(mode: 'list' | 'timeline') {
    this.viewMode.set(mode);
  }

  shiftTimeline(days: number) {
    const current = this.timelineStart();
    this.timelineStart.set(new Date(current.getTime() + days * 24 * 60 * 60 * 1000));
  }

  shiftTimelineToday() {
    this.timelineStart.set(getStartOfDay(new Date()));
  }

  isToday(day: Date): boolean {
    return isSameDay(day, new Date());
  }

  getDayOfWeekName(day: Date): string {
    return day.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2);
  }

  getItemsForCategory(category: string): ScheduleItem[] {
    const allFiltered = this.service.filtered();
    return allFiltered.filter((item) => {
      const cat = item.category || 'Unassigned';
      return cat === category;
    });
  }

  getColumnStart(item: ScheduleItem): number {
    const days = this.timelineDays();
    const start = getStartOfDay(item.start).getTime();
    for (let i = 0; i < days.length; i++) {
      if (days[i]!.getTime() === start) return i + 1;
    }
    if (start < days[0]!.getTime()) return 1;
    return days.length + 1;
  }

  getColumnEnd(item: ScheduleItem): number {
    const days = this.timelineDays();
    const end = getStartOfDay(item.end || item.start).getTime();
    for (let i = 0; i < days.length; i++) {
      if (days[i]!.getTime() === end) return i + 2;
    }
    if (end > days[days.length - 1]!.getTime()) return days.length + 2;
    return 1;
  }

  isItemInWindow(item: ScheduleItem): boolean {
    const days = this.timelineDays();
    const firstDay = days[0]!.getTime();
    const lastDay = days[days.length - 1]!.getTime();
    const itemStart = getStartOfDay(item.start).getTime();
    const itemEnd = getStartOfDay(item.end || item.start).getTime();
    return !(itemEnd < firstDay || itemStart > lastDay);
  }

  onTimelineCellClick(category: string, day: Date) {
    this.service.editingId.set(null);
    this.timelineNewItem.set({
      id: '',
      title: '',
      start: day,
      end: day,
      category: category === 'Unassigned' ? '' : category,
      color: 'blue',
      priority: 'medium',
    });
    this.addingNew.set(true);
  }

  onTimelineItemClick(item: ScheduleItem, event: MouseEvent) {
    event.stopPropagation();
    this.timelineNewItem.set(null);
    this.service.editingId.set(item.id);
    this.itemEdit.emit(item);
  }

  formatItemBarRange(item: ScheduleItem): string {
    const start = item.start;
    const end = item.end;
    const format = (date: Date) => date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    if (!end || isSameDay(start, end)) return format(start);
    return `${format(start)} - ${format(end)}`;
  }

  resolveColor(color: string | undefined): string {
    if (!color) return 'var(--datepicker-schedule-color-blue)';
    const COLOR_TOKEN_MAP: Record<string, string> = {
      red:    'var(--datepicker-schedule-color-red)',
      orange: 'var(--datepicker-schedule-color-orange)',
      yellow: 'var(--datepicker-schedule-color-yellow)',
      green:  'var(--datepicker-schedule-color-green)',
      teal:   'var(--datepicker-schedule-color-teal)',
      blue:   'var(--datepicker-schedule-color-blue)',
      indigo: 'var(--datepicker-schedule-color-indigo)',
      purple: 'var(--datepicker-schedule-color-purple)',
      pink:   'var(--datepicker-schedule-color-pink)',
      gray:   'var(--datepicker-schedule-color-gray)',
    };
    return COLOR_TOKEN_MAP[color] ?? color;
  }

  readonly maxReached = computed(() => {
    const max = this.scheduleMaxItems();
    return max != null && this.service.items().length >= max;
  });

  // ─── Lifecycle ───────────────────────────────────────────────────

  ngOnInit(): void {
    // Seed the service with the initial items from the host
    if (this.scheduleItems().length > 0) {
      this.service.setItems(this.scheduleItems());
    }
  }

  // ─── Sort ────────────────────────────────────────────────────────

  onSortChange(mode: string): void {
    switch (mode) {
      case 'date':     this.service.sortByDate(); break;
      case 'priority': this.service.sortByPriority(); break;
      case 'title':    this.service.sortByTitle(); break;
      default:         this.service.sortMode.set('manual');
    }
  }

  // ─── Drag & Drop ─────────────────────────────────────────────────

  onDrop(event: CdkDragDrop<ScheduleItem[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    const gate = this.onBeforeReorder();
    if (gate && !gate(event.previousIndex, event.currentIndex, this.service.items())) return;

    this.service.reorder(event.previousIndex, event.currentIndex);
    this.itemReorder.emit({
      from: event.previousIndex,
      to:   event.currentIndex,
      items: this.service.items(),
    });
    this.emit('reorder', []);
  }

  // ─── Add ─────────────────────────────────────────────────────────

  onAddClick(): void {
    // Gate hook
    const gate = this.onBeforeAdd();
    if (gate) {
      const dummy: ScheduleItem = {
        id: '', title: '', start: new Date(),
      };
      if (!gate(dummy)) return;
    }
    this.service.editingId.set(null);
    this.addingNew.set(true);
  }

  // ─── Edit ────────────────────────────────────────────────────────

  onEditClick(item: ScheduleItem): void {
    const gate = this.onBeforeEdit();
    if (gate && !gate(item)) return;

    this.addingNew.set(false);
    const isAlreadyOpen = this.service.editingId() === item.id;
    this.service.editingId.set(isAlreadyOpen ? null : item.id);
    if (!isAlreadyOpen) this.itemEdit.emit(item);
  }

  // ─── Delete ──────────────────────────────────────────────────────

  onDeleteClick(item: ScheduleItem): void {
    const gate = this.onBeforeDelete();
    if (gate && !gate(item)) return;

    this.service.remove(item.id);
    this.itemDelete.emit(item);
    this.emit('delete', [item]);
  }

  // ─── Duplicate ───────────────────────────────────────────────────

  onDuplicateClick(item: ScheduleItem): void {
    const copy = this.service.duplicate(item.id);
    if (copy) {
      this.itemDuplicate.emit(copy);
      this.emit('add', [copy]);
    }
  }

  // ─── Toggle ──────────────────────────────────────────────────────

  onToggleComplete(item: ScheduleItem): void {
    this.service.toggleComplete(item.id);
    this.emit('update', [this.service.findById(item.id)!]);
  }

  onToggleLock(item: ScheduleItem): void {
    this.service.toggleLocked(item.id);
    this.emit('update', [this.service.findById(item.id)!]);
  }

  // ─── Form Save/Cancel ────────────────────────────────────────────

  onFormSave(item: ScheduleItem): void {
    if (this.addingNew()) {
      const added = this.service.add(item);
      this.addingNew.set(false);
      this.itemAdd.emit(added);
      this.emit('add', [added]);
    } else {
      this.service.update(item.id, item);
      this.service.editingId.set(null);
      const updated = this.service.findById(item.id)!;
      this.emit('update', [updated]);
    }
  }

  onFormCancel(): void {
    this.addingNew.set(false);
    this.service.editingId.set(null);
  }

  // ─── Export / Import ─────────────────────────────────────────────

  onExport(format: 'json' | 'csv' | 'ics'): void {
    let content = '';
    let filename = '';
    let mime = '';

    switch (format) {
      case 'json':
        content  = this.service.toJson();
        filename = 'schedule.json';
        mime     = 'application/json';
        break;
      case 'csv':
        content  = this.service.toCsv();
        filename = 'schedule.csv';
        mime     = 'text/csv';
        break;
      case 'ics':
        content  = this.service.toIcs();
        filename = 'schedule.ics';
        mime     = 'text/calendar';
        break;
    }

    if (!content) return;
    const blob = new Blob([content], { type: mime });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  onImport(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const name = file.name.toLowerCase();
      if (name.endsWith('.json')) {
        this.service.fromJson(text);
      } else if (name.endsWith('.csv')) {
        this.service.fromCsv(text);
      }
      this.emit('import', this.service.items());
    };
    reader.readAsText(file);
    // Reset input so the same file can be re-imported
    (event.target as HTMLInputElement).value = '';
  }

  // ─── Private ─────────────────────────────────────────────────────

  private emit(action: ScheduleChangeEvent['action'], affected: ScheduleItem[]): void {
    this.scheduleChange.emit(this.service.buildChangeEvent(action, affected));
  }
}
