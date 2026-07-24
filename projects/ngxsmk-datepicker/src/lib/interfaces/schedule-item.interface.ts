/**
 * Schedule Feature Interfaces & Types
 *
 * Provides the complete type surface for the `mode="schedule"` date schedule panel.
 * Every field on ScheduleItem is optional except `id`, `title`, and `start`, giving
 * consumers full control over which units of data they use.
 */

// ─── Color Tokens ────────────────────────────────────────────────────────────

/**
 * Built-in schedule color preset tokens.
 * Each token maps to a corresponding CSS custom property:
 * `--datepicker-schedule-color-{token}`.
 * Pass any CSS color string instead for a fully custom color.
 */
export type ScheduleColor =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink'
  | 'gray'
  | 'custom';

// ─── Priority ────────────────────────────────────────────────────────────────

/** Priority level for a schedule item. */
export type SchedulePriority = 'low' | 'medium' | 'high' | 'critical';

// ─── Recurrence ──────────────────────────────────────────────────────────────

/**
 * Optional recurrence rule attached to a schedule item.
 * Consumers handle expansion of recurring instances; the library
 * only stores and surfaces the rule.
 */
export interface ScheduleRecurrence {
  /** Base recurrence cadence. */
  pattern: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'weekdays' | 'weekends' | 'custom';
  /** Repeat every N units (default: 1). */
  interval?: number;
  /** Hard stop date for recurrence. */
  endDate?: Date;
  /** Maximum number of occurrences. */
  occurrences?: number;
  /** 0 = Sunday … 6 = Saturday — used with `weekly`. */
  dayOfWeek?: number;
  /** 1–31 — used with `monthly`. */
  dayOfMonth?: number;
  /** Used with `yearly`. */
  monthAndDay?: { month: number; day: number };
  /** Human-readable RRULE for custom patterns (e.g. from an ICS import). */
  rrule?: string;
}

// ─── Core Item ───────────────────────────────────────────────────────────────

/**
 * A single schedule item.
 *
 * Only `id`, `title`, and `start` are required. All other fields are optional,
 * giving consumers fine-grained control over which data units they use.
 *
 * @example
 * ```typescript
 * const item: ScheduleItem = {
 *   id: crypto.randomUUID(),
 *   title: 'Product Launch',
 *   start: new Date('2025-06-10'),
 *   end:   new Date('2025-06-12'),
 *   color: 'green',
 *   priority: 'high',
 *   tags: ['marketing', 'release'],
 * };
 * ```
 */
export interface ScheduleItem {
  // ─── Core (always required) ─────────────────────────────────────────────
  /** Unique identifier — auto-generated UUID when created via ScheduleService. */
  id: string;
  /** Display title of the item. Required; minimum 1 character. */
  title: string;
  /** Start date (and optional time) of the item. */
  start: Date;

  // ─── Date & Time ────────────────────────────────────────────────────────
  /** End date. If omitted, the item is treated as a single-day/point event. */
  end?: Date;
  /** When true, time-of-day is ignored and the item spans full days. */
  allDay?: boolean;
  /**
   * IANA timezone identifier (e.g. `'America/New_York'`).
   * Falls back to `scheduleTimezone` input, then `defaultTimezone` config.
   */
  timezone?: string;

  // ─── Appearance ─────────────────────────────────────────────────────────
  /**
   * Color preset token or any CSS color string.
   *
   * Token example: `'green'` → resolves to `var(--datepicker-schedule-color-green)`.
   * Custom example: `'#e11d48'` or `'hsl(340, 82%, 52%)'`.
   */
  color?: ScheduleColor | string;
  /**
   * Explicit background color for the item row / color swatch.
   * Overrides the color derived from `color`.
   */
  backgroundColor?: string;
  /**
   * Explicit text color for the item row.
   * Overrides the color derived from `color`.
   */
  textColor?: string;
  /** Explicit border/accent color. Overrides `color`-derived border. */
  borderColor?: string;
  /**
   * Emoji or icon ligature shown as a leading icon on the row.
   *
   * @example `'🚀'`, `'📅'`, `'✅'`
   */
  icon?: string;
  /**
   * Short badge text overlaid on the item (e.g. `'NEW'`, `'LIVE'`).
   * Rendered in a pill next to the title.
   */
  badgeText?: string;

  // ─── Classification ─────────────────────────────────────────────────────
  /**
   * Grouping category. Surfaces in the filter panel and can drive
   * per-category colour coding in custom row templates.
   */
  category?: string;
  /** Free-form tags for filtering and search. */
  tags?: string[];
  /** Priority level. Drives sort order and badge colour. */
  priority?: SchedulePriority;
  /** Free-form notes / description. Shown in the inline edit form. */
  notes?: string;
  /** Optional deep-link URL associated with the item. */
  url?: string;

  // ─── Recurrence ─────────────────────────────────────────────────────────
  /**
   * Optional recurrence rule.
   * When set, a recurrence indicator is shown on the row.
   */
  recurrence?: ScheduleRecurrence;

  // ─── State Flags ────────────────────────────────────────────────────────
  /**
   * When `true`, the item is visually marked as completed (strikethrough)
   * and excluded from conflict detection.
   */
  completed?: boolean;
  /**
   * When `true`, the item cannot be edited, deleted, or reordered via the UI.
   * The consumer may still mutate it programmatically via ScheduleService.
   */
  locked?: boolean;
  /**
   * Soft-hide the item without deleting it.
   * Hidden items are excluded from the list but preserved in the data.
   */
  hidden?: boolean;

  // ─── Consumer Bag ───────────────────────────────────────────────────────
  /**
   * Arbitrary consumer-supplied data. Passed through to all template
   * contexts so custom row/form templates can access application data
   * without sub-classing ScheduleItem.
   */
  metadata?: Record<string, unknown>;
}

// ─── Change Event ────────────────────────────────────────────────────────────

/**
 * Emitted by the `scheduleChange` output on every mutation.
 * Includes the full updated list plus a diff of which items changed.
 */
export interface ScheduleChangeEvent {
  /** Complete updated list after the operation. */
  items: ScheduleItem[];
  /** The kind of operation that triggered the change. */
  action: 'add' | 'update' | 'delete' | 'reorder' | 'import' | 'clear';
  /** The specific items that were added, changed, or removed. */
  affected: ScheduleItem[];
}

// ─── Field Config ────────────────────────────────────────────────────────────

/**
 * Controls which fields are shown in the inline add/edit form.
 * All fields default to `true` unless noted otherwise.
 *
 * Pass a `Partial<ScheduleFieldsConfig>` to show only the fields you need:
 *
 * @example
 * ```html
 * <ngxsmk-datepicker
 *   mode="schedule"
 *   [scheduleFields]="{ showNotes: false, showTags: false, showRecurrence: false }"
 * />
 * ```
 */
export interface ScheduleFieldsConfig {
  showTitle:       boolean; // default: true
  showCategory:    boolean; // default: true
  showColor:       boolean; // default: true
  showIcon:        boolean; // default: true
  showStart:       boolean; // default: true
  showEnd:         boolean; // default: true
  showAllDay:      boolean; // default: true
  showNotes:       boolean; // default: true
  showTags:        boolean; // default: true
  showPriority:    boolean; // default: true
  showUrl:         boolean; // default: true
  showRecurrence:  boolean; // default: false
  showBadgeText:   boolean; // default: false
  showTimezone:    boolean; // default: false
}

/** Default field visibility — all fields on, optional ones off. */
export const DEFAULT_SCHEDULE_FIELDS: ScheduleFieldsConfig = {
  showTitle:      true,
  showCategory:   true,
  showColor:      true,
  showIcon:       true,
  showStart:      true,
  showEnd:        true,
  showAllDay:     true,
  showNotes:      true,
  showTags:       true,
  showPriority:   true,
  showUrl:        true,
  showRecurrence: false,
  showBadgeText:  false,
  showTimezone:   false,
};

// ─── Template Context ─────────────────────────────────────────────────────────

/**
 * Context object passed to all per-field form template overrides.
 * Exposes the current draft item, a field updater, and validation helpers.
 *
 * @example
 * ```html
 * <ng-template #myTitleField let-ctx>
 *   <input [value]="ctx.item.title"
 *          (input)="ctx.updateField('title', $event.target.value)" />
 *   <span *ngIf="ctx.hasError('title')">{{ ctx.getError('title') }}</span>
 * </ng-template>
 * ```
 */
export interface ScheduleFormContext {
  /** Current draft state of the item being added/edited. */
  item: Partial<ScheduleItem>;
  /** Patch a single field on the draft item. */
  updateField: (key: keyof ScheduleItem, value: unknown) => void;
  /** `true` when creating a new item, `false` when editing existing. */
  isNew: boolean;
  /** Returns `true` if the named field has a validation error. */
  hasError: (field: string) => boolean;
  /** Returns the validation error message for the named field, or `null`. */
  getError: (field: string) => string | null;
  /** Programmatically trigger form save. */
  save: () => void;
  /** Programmatically trigger form cancel. */
  cancel: () => void;
}

// ─── Form Template Slots ──────────────────────────────────────────────────────

/**
 * Optional per-field template overrides for the inline form.
 * Pass a partial object — only the keys you supply will be overridden;
 * unspecified fields use the built-in form field.
 */
export interface ScheduleFormTemplates {
  titleField?:     import('@angular/core').TemplateRef<ScheduleFormContext>;
  categoryField?:  import('@angular/core').TemplateRef<ScheduleFormContext>;
  colorField?:     import('@angular/core').TemplateRef<ScheduleFormContext>;
  iconField?:      import('@angular/core').TemplateRef<ScheduleFormContext>;
  startField?:     import('@angular/core').TemplateRef<ScheduleFormContext>;
  endField?:       import('@angular/core').TemplateRef<ScheduleFormContext>;
  allDayField?:    import('@angular/core').TemplateRef<ScheduleFormContext>;
  notesField?:     import('@angular/core').TemplateRef<ScheduleFormContext>;
  tagsField?:      import('@angular/core').TemplateRef<ScheduleFormContext>;
  priorityField?:  import('@angular/core').TemplateRef<ScheduleFormContext>;
  urlField?:       import('@angular/core').TemplateRef<ScheduleFormContext>;
  extraFields?:    import('@angular/core').TemplateRef<ScheduleFormContext>;
  footer?:         import('@angular/core').TemplateRef<ScheduleFormContext>;
}

// ─── Default Color Presets ────────────────────────────────────────────────────

/** Built-in color preset list used when `scheduleColorPresets` is not provided. */
export const DEFAULT_SCHEDULE_COLORS: ScheduleColor[] = [
  'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'indigo', 'purple', 'pink', 'gray',
];

/** Built-in icon preset list used when `scheduleIconPresets` is not provided. */
export const DEFAULT_SCHEDULE_ICONS: string[] = [
  '📅', '🚀', '🎯', '📣', '🎉', '✅', '🔴', '⭐', '🔥', '💡',
  '📌', '🏷️', '📝', '🤝', '💼', '🌍', '🎨', '⚡', '🧩', '🔔',
];
