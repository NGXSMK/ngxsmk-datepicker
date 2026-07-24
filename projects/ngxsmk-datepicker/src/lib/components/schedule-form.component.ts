import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DEFAULT_SCHEDULE_COLORS,
  DEFAULT_SCHEDULE_ICONS,
  ScheduleColor,
  ScheduleFieldsConfig,
  DEFAULT_SCHEDULE_FIELDS,
  ScheduleFormContext,
  ScheduleFormTemplates,
  ScheduleItem,
  SchedulePriority,
} from '../interfaces/schedule-item.interface';
import { ScheduleService, ScheduleValidationError } from '../services/schedule.service';

// ─── Colour Token Map ─────────────────────────────────────────────────────────

const COLOR_TOKEN_MAP: Record<string, string> = {
  red: 'var(--datepicker-schedule-color-red)',
  orange: 'var(--datepicker-schedule-color-orange)',
  yellow: 'var(--datepicker-schedule-color-yellow)',
  green: 'var(--datepicker-schedule-color-green)',
  teal: 'var(--datepicker-schedule-color-teal)',
  blue: 'var(--datepicker-schedule-color-blue)',
  indigo: 'var(--datepicker-schedule-color-indigo)',
  purple: 'var(--datepicker-schedule-color-purple)',
  pink: 'var(--datepicker-schedule-color-pink)',
  gray: 'var(--datepicker-schedule-color-gray)',
};

function resolveColor(color: string | undefined): string {
  if (!color) return COLOR_TOKEN_MAP['blue'] as string;
  return COLOR_TOKEN_MAP[color] ?? color;
}

/**
 * `ScheduleFormComponent`
 *
 * Inline add/edit form for a single schedule item.
 * Slides in below the target row using a CSS `max-height` animation.
 *
 * **Every form field can be:**
 * - Shown or hidden via `scheduleFields` config
 * - Replaced by a custom `TemplateRef` via `formTemplates`
 * - Extended with extra fields via `formTemplates.extraFields`
 *
 * The `ScheduleFormContext` is passed to every template so custom slots
 * can read and write the draft item without any additional inputs.
 *
 * @example
 * ```html
 * <smk-schedule-form
 *   [item]="draftItem"
 *   [fields]="{ showNotes: false, showTags: false }"
 *   [colorPresets]="['red', 'blue', '#ff6600']"
 *   (save)="onSave($event)"
 *   (cancel)="onCancel()"
 * />
 * ```
 */
@Component({
  selector: 'smk-schedule-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="smk-schedule-form"
      [class.smk-schedule-form--new]="isNew()"
      role="form"
      [attr.aria-label]="isNew() ? 'Add schedule item' : 'Edit schedule item'"
    >
      <!-- ─── Title Field ─────────────────────────────────────── -->
      @if (fields().showTitle) {
        @if (formTemplates()?.titleField) {
          <ng-container
            [ngTemplateOutlet]="formTemplates()!.titleField!"
            [ngTemplateOutletContext]="templateContext()"
          />
        } @else {
          <div class="smk-schedule-form__field" [class.smk-schedule-form__field--error]="hasError('title')">
            <label class="smk-schedule-form__label" for="smk-sched-title">Title *</label>
            <input
              id="smk-sched-title"
              class="smk-schedule-form__input"
              type="text"
              placeholder="Item title…"
              [value]="draft().title ?? ''"
              (input)="updateField('title', $any($event.target).value)"
              maxlength="120"
              autocomplete="off"
            />
            @if (hasError('title')) {
              <span class="smk-schedule-form__error">{{ getError('title') }}</span>
            }
          </div>
        }
      }

      <!-- ─── Category Field ─────────────────────────────────── -->
      @if (fields().showCategory) {
        @if (formTemplates()?.categoryField) {
          <ng-container
            [ngTemplateOutlet]="formTemplates()!.categoryField!"
            [ngTemplateOutletContext]="templateContext()"
          />
        } @else {
          <div class="smk-schedule-form__field">
            <label class="smk-schedule-form__label" for="smk-sched-category">Category</label>
            @if (categoryOptions().length > 0) {
              <select
                id="smk-sched-category"
                class="smk-schedule-form__select"
                [value]="draft().category ?? ''"
                (change)="updateField('category', $any($event.target).value || undefined)"
              >
                <option value="">None</option>
                @for (cat of categoryOptions(); track cat) {
                  <option [value]="cat">{{ cat }}</option>
                }
              </select>
            } @else {
              <input
                id="smk-sched-category"
                class="smk-schedule-form__input"
                type="text"
                placeholder="e.g. Marketing"
                [value]="draft().category ?? ''"
                (input)="updateField('category', $any($event.target).value || undefined)"
              />
            }
          </div>
        }
      }

      <!-- ─── Color Field ────────────────────────────────────── -->
      @if (fields().showColor) {
        @if (formTemplates()?.colorField) {
          <ng-container
            [ngTemplateOutlet]="formTemplates()!.colorField!"
            [ngTemplateOutletContext]="templateContext()"
          />
        } @else {
          <div class="smk-schedule-form__field">
            <span class="smk-schedule-form__label">Color</span>
            <div class="smk-schedule-color-picker" role="group" aria-label="Color options">
              @for (color of colorPresets(); track color) {
                <button
                  class="smk-schedule-color-picker__swatch"
                  type="button"
                  [style.background-color]="resolveColor(color)"
                  [class.smk-schedule-color-picker__swatch--active]="draft().color === color"
                  [attr.aria-label]="color"
                  [attr.aria-pressed]="draft().color === color"
                  [title]="color"
                  (click)="updateField('color', color)"
                ></button>
              }
              <!-- Custom hex input -->
              <div class="smk-schedule-color-picker__custom">
                <input
                  type="color"
                  class="smk-schedule-color-picker__hex"
                  [value]="customHexValue()"
                  (input)="onCustomColor($any($event.target).value)"
                  title="Custom color"
                  aria-label="Custom color"
                />
              </div>
            </div>
          </div>
        }
      }

      <!-- ─── Icon Field ─────────────────────────────────────── -->
      @if (fields().showIcon) {
        @if (formTemplates()?.iconField) {
          <ng-container
            [ngTemplateOutlet]="formTemplates()!.iconField!"
            [ngTemplateOutletContext]="templateContext()"
          />
        } @else {
          <div class="smk-schedule-form__field">
            <span class="smk-schedule-form__label">Icon</span>
            <div class="smk-schedule-icon-picker" role="group" aria-label="Icon options">
              @for (icon of iconPresets(); track icon) {
                <button
                  class="smk-schedule-icon-picker__btn"
                  type="button"
                  [class.smk-schedule-icon-picker__btn--active]="draft().icon === icon"
                  [attr.aria-label]="icon"
                  [attr.aria-pressed]="draft().icon === icon"
                  (click)="updateField('icon', draft().icon === icon ? undefined : icon)"
                >
                  {{ icon }}
                </button>
              }
              <input
                class="smk-schedule-icon-picker__custom"
                type="text"
                placeholder="✍"
                maxlength="2"
                [value]="customIconValue()"
                (input)="onCustomIcon($any($event.target).value)"
                title="Custom icon/emoji"
                aria-label="Custom icon or emoji"
              />
            </div>
          </div>
        }
      }

      <!-- ─── All Day Toggle ─────────────────────────────────── -->
      @if (fields().showAllDay) {
        @if (formTemplates()?.allDayField) {
          <ng-container
            [ngTemplateOutlet]="formTemplates()!.allDayField!"
            [ngTemplateOutletContext]="templateContext()"
          />
        } @else {
          <div class="smk-schedule-form__field smk-schedule-form__field--inline">
            <label class="smk-schedule-form__label" for="smk-sched-allday">All day</label>
            <button
              id="smk-sched-allday"
              class="smk-schedule-toggle"
              type="button"
              role="switch"
              [attr.aria-checked]="draft().allDay ?? false"
              [class.smk-schedule-toggle--on]="draft().allDay"
              (click)="updateField('allDay', !(draft().allDay ?? false))"
            >
              <span class="smk-schedule-toggle__thumb"></span>
            </button>
          </div>
        }
      }

      <!-- ─── Start Field ────────────────────────────────────── -->
      @if (fields().showStart) {
        @if (formTemplates()?.startField) {
          <ng-container
            [ngTemplateOutlet]="formTemplates()!.startField!"
            [ngTemplateOutletContext]="templateContext()"
          />
        } @else {
          <div class="smk-schedule-form__field" [class.smk-schedule-form__field--error]="hasError('start')">
            <label class="smk-schedule-form__label" for="smk-sched-start">Start *</label>
            <input
              id="smk-sched-start"
              class="smk-schedule-form__input"
              [type]="draft().allDay || !showTime() ? 'date' : 'datetime-local'"
              [value]="formatDateInput(draft().start)"
              (change)="onDateChange('start', $any($event.target).value)"
            />
            @if (hasError('start')) {
              <span class="smk-schedule-form__error">{{ getError('start') }}</span>
            }
          </div>
        }
      }

      <!-- ─── End Field ──────────────────────────────────────── -->
      @if (fields().showEnd) {
        @if (formTemplates()?.endField) {
          <ng-container [ngTemplateOutlet]="formTemplates()!.endField!" [ngTemplateOutletContext]="templateContext()" />
        } @else {
          <div class="smk-schedule-form__field" [class.smk-schedule-form__field--error]="hasError('end')">
            <label class="smk-schedule-form__label" for="smk-sched-end">End</label>
            <input
              id="smk-sched-end"
              class="smk-schedule-form__input"
              [type]="draft().allDay || !showTime() ? 'date' : 'datetime-local'"
              [value]="formatDateInput(draft().end)"
              [min]="formatDateInput(draft().start)"
              (change)="onDateChange('end', $any($event.target).value)"
            />
            @if (hasError('end')) {
              <span class="smk-schedule-form__error">{{ getError('end') }}</span>
            }
          </div>
        }
      }

      <!-- ─── Timezone Field ─────────────────────────────────── -->
      @if (fields().showTimezone) {
        @if (formTemplates()?.startField) {
          <ng-container
            [ngTemplateOutlet]="formTemplates()!.startField!"
            [ngTemplateOutletContext]="templateContext()"
          />
        } @else {
          <div class="smk-schedule-form__field">
            <label class="smk-schedule-form__label" for="smk-sched-tz">Timezone</label>
            <input
              id="smk-sched-tz"
              class="smk-schedule-form__input"
              type="text"
              placeholder="e.g. America/New_York"
              [value]="draft().timezone ?? ''"
              (input)="updateField('timezone', $any($event.target).value || undefined)"
            />
          </div>
        }
      }

      <!-- ─── Priority Field ─────────────────────────────────── -->
      @if (fields().showPriority) {
        @if (formTemplates()?.priorityField) {
          <ng-container
            [ngTemplateOutlet]="formTemplates()!.priorityField!"
            [ngTemplateOutletContext]="templateContext()"
          />
        } @else {
          <div class="smk-schedule-form__field">
            <span class="smk-schedule-form__label">Priority</span>
            <div class="smk-schedule-priority-picker" role="group" aria-label="Priority level">
              @for (level of priorityLevels; track level.value) {
                <button
                  class="smk-schedule-priority-picker__btn"
                  type="button"
                  [class]="'smk-schedule-priority-picker__btn--' + level.value"
                  [class.smk-schedule-priority-picker__btn--active]="draft().priority === level.value"
                  [attr.aria-pressed]="draft().priority === level.value"
                  [attr.aria-label]="level.label"
                  (click)="updateField('priority', draft().priority === level.value ? undefined : level.value)"
                >
                  {{ level.label }}
                </button>
              }
            </div>
          </div>
        }
      }

      <!-- ─── Tags Field ─────────────────────────────────────── -->
      @if (fields().showTags) {
        @if (formTemplates()?.tagsField) {
          <ng-container
            [ngTemplateOutlet]="formTemplates()!.tagsField!"
            [ngTemplateOutletContext]="templateContext()"
          />
        } @else {
          <div class="smk-schedule-form__field">
            <label class="smk-schedule-form__label" for="smk-sched-tags">Tags</label>
            <div class="smk-schedule-tags-input">
              @for (tag of draft().tags ?? []; track tag) {
                <span class="smk-schedule-tag">
                  {{ tag }}
                  <button
                    type="button"
                    class="smk-schedule-tag__remove"
                    [attr.aria-label]="'Remove tag ' + tag"
                    (click)="removeTag(tag)"
                  >
                    ×
                  </button>
                </span>
              }
              <input
                id="smk-sched-tags"
                class="smk-schedule-tags-input__field"
                type="text"
                placeholder="Add tag…"
                [value]="tagInput()"
                (input)="tagInput.set($any($event.target).value)"
                (keydown.enter)="addTag($event)"
                (keydown.comma)="addTag($event)"
                list="smk-sched-tag-suggestions"
              />
              @if (tagSuggestions().length > 0) {
                <datalist id="smk-sched-tag-suggestions">
                  @for (s of tagSuggestions(); track s) {
                    <option [value]="s"></option>
                  }
                </datalist>
              }
            </div>
          </div>
        }
      }

      <!-- ─── Notes Field ────────────────────────────────────── -->
      @if (fields().showNotes) {
        @if (formTemplates()?.notesField) {
          <ng-container
            [ngTemplateOutlet]="formTemplates()!.notesField!"
            [ngTemplateOutletContext]="templateContext()"
          />
        } @else {
          <div class="smk-schedule-form__field">
            <label class="smk-schedule-form__label" for="smk-sched-notes">Notes</label>
            <textarea
              id="smk-sched-notes"
              class="smk-schedule-form__textarea"
              rows="2"
              placeholder="Optional notes…"
              [value]="draft().notes ?? ''"
              (input)="updateField('notes', $any($event.target).value || undefined)"
            ></textarea>
          </div>
        }
      }

      <!-- ─── URL Field ──────────────────────────────────────── -->
      @if (fields().showUrl) {
        @if (formTemplates()?.urlField) {
          <ng-container [ngTemplateOutlet]="formTemplates()!.urlField!" [ngTemplateOutletContext]="templateContext()" />
        } @else {
          <div class="smk-schedule-form__field">
            <label class="smk-schedule-form__label" for="smk-sched-url">URL</label>
            <input
              id="smk-sched-url"
              class="smk-schedule-form__input"
              type="url"
              placeholder="https://…"
              [value]="draft().url ?? ''"
              (input)="updateField('url', $any($event.target).value || undefined)"
            />
          </div>
        }
      }

      <!-- ─── Badge Text Field ───────────────────────────────── -->
      @if (fields().showBadgeText) {
        <div class="smk-schedule-form__field">
          <label class="smk-schedule-form__label" for="smk-sched-badge">Badge Text</label>
          <input
            id="smk-sched-badge"
            class="smk-schedule-form__input"
            type="text"
            placeholder="e.g. NEW"
            maxlength="8"
            [value]="draft().badgeText ?? ''"
            (input)="updateField('badgeText', $any($event.target).value || undefined)"
          />
        </div>
      }

      <!-- ─── Recurrence Field ───────────────────────────────── -->
      @if (fields().showRecurrence) {
        <div class="smk-schedule-form__field">
          <label class="smk-schedule-form__label" for="smk-sched-recurrence">Repeat</label>
          <select
            id="smk-sched-recurrence"
            class="smk-schedule-form__select"
            [value]="draft().recurrence?.pattern ?? ''"
            (change)="onRecurrenceChange($any($event.target).value)"
          >
            <option value="">Does not repeat</option>
            <option value="daily">Daily</option>
            <option value="weekdays">Every weekday (Mon–Fri)</option>
            <option value="weekends">Every weekend</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      }

      <!-- ─── Extra Fields Slot (consumer-supplied) ──────────── -->
      @if (formTemplates()?.extraFields) {
        <ng-container
          [ngTemplateOutlet]="formTemplates()!.extraFields!"
          [ngTemplateOutletContext]="templateContext()"
        />
      }

      <!-- ─── Global Error ───────────────────────────────────── -->
      @if (hasError('_global') || hasError('_conflict') || hasError('_custom')) {
        <div class="smk-schedule-form__global-error" role="alert">
          {{ getError('_global') || getError('_conflict') || getError('_custom') }}
        </div>
      }

      <!-- ─── Footer ─────────────────────────────────────────── -->
      @if (formTemplates()?.footer) {
        <ng-container [ngTemplateOutlet]="formTemplates()!.footer!" [ngTemplateOutletContext]="templateContext()" />
      } @else {
        <div class="smk-schedule-form__footer">
          <button class="smk-schedule-form__btn smk-schedule-form__btn--cancel" type="button" (click)="onCancel()">
            Cancel
          </button>
          <button
            class="smk-schedule-form__btn smk-schedule-form__btn--save"
            type="button"
            [disabled]="!canSave()"
            (click)="onSave()"
          >
            {{ isNew() ? 'Add Item' : 'Save' }} →
          </button>
        </div>
      }
    </div>
  `,
})
export class ScheduleFormComponent implements OnInit {
  private readonly scheduleService = inject(ScheduleService);

  // ─── Inputs ───────────────────────────────────────────────────────

  /**
   * The item to edit. Pass `null` or omit to open the form in "Add" mode.
   * All fields will be initialized from this item if provided.
   */
  readonly item = input<ScheduleItem | null>(null);

  /** Controls which fields are rendered. Merged with DEFAULT_SCHEDULE_FIELDS. */
  readonly fields = input<ScheduleFieldsConfig>(DEFAULT_SCHEDULE_FIELDS);

  /** Template overrides for individual form fields and the footer. */
  readonly formTemplates = input<ScheduleFormTemplates | null>(null);

  /** Color swatches shown in the color picker. Defaults to all 10 presets. */
  readonly colorPresets = input<(ScheduleColor | string)[]>([...DEFAULT_SCHEDULE_COLORS]);

  /** Emoji/icon buttons shown in the icon picker. */
  readonly iconPresets = input<string[]>([...DEFAULT_SCHEDULE_ICONS]);

  /** Options shown in the category dropdown/autocomplete. */
  readonly categoryOptions = input<string[]>([]);

  /** Tag suggestions shown in the tag input datalist. */
  readonly tagSuggestions = input<string[]>([]);

  /** Show time inputs alongside the date inputs. */
  readonly showTime = input<boolean>(false);

  /** Use 24-hour time format. Only relevant when `showTime` is true. */
  readonly use24Hour = input<boolean>(false);

  /** IANA locale string for date formatting. */
  readonly locale = input<string>('en-US');

  /** Minimum selectable date for start/end pickers. */
  readonly minDate = input<Date | null>(null);

  /** Maximum selectable date for start/end pickers. */
  readonly maxDate = input<Date | null>(null);

  /**
   * Allow overlapping dates? If `false`, a conflict error is shown when
   * the user picks dates that overlap with another item.
   */
  readonly allowOverlap = input<boolean>(true);

  /** Maximum number of items allowed. Shown as an error when exceeded on Add. */
  readonly maxItems = input<number | null>(null);

  /**
   * Custom per-item validator. Return an error string or `null`.
   * Runs after all built-in validation passes.
   */
  readonly validateItem = input<((item: ScheduleItem, all: ScheduleItem[]) => string | null) | null>(null);

  // ─── Outputs ──────────────────────────────────────────────────────

  /** Emitted when the user clicks Save and validation passes. */
  readonly save = output<ScheduleItem>();

  /** Emitted when the user clicks Cancel. */
  // eslint-disable-next-line @angular-eslint/no-output-native
  readonly cancel = output<void>();

  // ─── Internal State ───────────────────────────────────────────────

  /** Mutable draft of the item being edited. */
  readonly draft = signal<Partial<ScheduleItem>>({});

  /** Validation errors keyed by field name. */
  private readonly errors = signal<Record<string, string>>({});

  /** Controlled value for the tag text input. */
  readonly tagInput = signal<string>('');

  readonly isNew = computed(() => !this.item()?.id);

  readonly canSave = computed(() => {
    const d = this.draft();
    return !!(d.title?.trim() && d.start);
  });

  readonly customHexValue = computed(() => {
    const c = this.draft().color;
    return c && c.startsWith('#') ? c : '#3b82f6';
  });

  readonly customIconValue = computed(() => {
    const icon = this.draft().icon ?? '';
    return this.iconPresets().includes(icon) ? '' : icon;
  });

  readonly templateContext = computed(
    (): ScheduleFormContext => ({
      item: this.draft(),
      updateField: (key, value) => this.updateField(key, value),
      isNew: this.isNew(),
      hasError: (field) => this.hasError(field),
      getError: (field) => this.getError(field),
      save: () => this.onSave(),
      cancel: () => this.onCancel(),
    })
  );

  // ─── Priority Levels ──────────────────────────────────────────────

  readonly priorityLevels: { value: SchedulePriority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  // ─── Lifecycle ────────────────────────────────────────────────────

  ngOnInit(): void {
    const existing = this.item();
    if (existing) {
      this.draft.set({ ...existing });
    } else {
      this.draft.set({
        allDay: false,
        color: 'blue',
      });
    }
  }

  // ─── Field Helpers ────────────────────────────────────────────────

  updateField(key: keyof ScheduleItem, value: unknown): void {
    this.draft.update((d) => ({ ...d, [key]: value }));
    // Clear field error on change
    this.errors.update((e) => {
      const next = { ...e };
      delete next[key as string];
      return next;
    });
  }

  hasError(field: string): boolean {
    return !!this.errors()[field];
  }

  getError(field: string): string | null {
    return this.errors()[field] ?? null;
  }

  formatDateInput(date: Date | undefined): string {
    if (!date) return '';
    try {
      if (this.draft().allDay || !this.showTime()) {
        return date.toISOString().split('T')[0] as string;
      }
      return date.toISOString().slice(0, 16);
    } catch {
      return '';
    }
  }

  onDateChange(field: 'start' | 'end', value: string): void {
    if (!value) {
      if (field === 'end') this.updateField('end', undefined);
      return;
    }
    this.updateField(field, new Date(value));
  }

  onCustomColor(hex: string): void {
    this.updateField('color', hex);
  }

  onCustomIcon(value: string): void {
    const trimmed = value.trim();
    this.updateField('icon', trimmed || undefined);
  }

  onRecurrenceChange(pattern: string): void {
    if (!pattern) {
      this.updateField('recurrence', undefined);
    } else {
      this.updateField('recurrence', {
        pattern: pattern as ScheduleItem['recurrence'] extends { pattern: infer P } ? P : never,
        interval: 1,
      });
    }
  }

  addTag(e: Event): void {
    e.preventDefault();
    const val = this.tagInput().trim().replace(/,$/, '');
    if (!val) return;
    const existing = this.draft().tags ?? [];
    if (!existing.includes(val)) {
      this.updateField('tags', [...existing, val]);
    }
    this.tagInput.set('');
    (e.target as HTMLInputElement).value = '';
  }

  removeTag(tag: string): void {
    this.updateField(
      'tags',
      (this.draft().tags ?? []).filter((t) => t !== tag)
    );
  }

  resolveColor(color: string): string {
    return resolveColor(color);
  }

  // ─── Save / Cancel ────────────────────────────────────────────────

  onSave(): void {
    const opts: Parameters<typeof this.scheduleService.validate>[1] = {};
    const maxItems = this.maxItems();
    if (maxItems != null) opts.maxItems = maxItems;
    opts.allowOverlap = this.allowOverlap();
    const validator = this.validateItem();
    if (validator) opts.customValidator = validator;
    const result = this.scheduleService.validate(this.draft(), opts);

    if (!result.valid) {
      const map: Record<string, string> = {};
      result.errors.forEach((e: ScheduleValidationError) => {
        map[e.field] = e.message;
      });
      this.errors.set(map);
      return;
    }

    this.errors.set({});
    this.save.emit(this.draft() as ScheduleItem);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
