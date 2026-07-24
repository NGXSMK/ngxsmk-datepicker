import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleItem } from '../interfaces/schedule-item.interface';

// ─── Color Map ────────────────────────────────────────────────────────────────

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

function durationLabel(item: ScheduleItem, formatFn?: (i: ScheduleItem) => string): string {
  if (formatFn) return formatFn(item);
  if (!item.end) return '1d';
  const ms = item.end.getTime() - item.start.getTime();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24)) + 1;
  return days === 1 ? '1d' : `${days}d`;
}

const PRIORITY_ICON: Record<string, string> = {
  low: '▽',
  medium: '◆',
  high: '▲',
  critical: '⚠',
};

/**
 * `ScheduleItemRowComponent`
 *
 * Renders a single schedule item as a list row with a drag handle,
 * colour indicator, title, date badge, duration, and action buttons.
 *
 * Every visual segment can be replaced with a custom `TemplateRef`:
 * - `rowTemplate`     — replace the entire row
 * - `badgeTemplate`   — replace the date/duration badge
 * - `actionsTemplate` — replace the action button group
 *
 * @example
 * ```html
 * <smk-schedule-item-row
 *   [item]="myItem"
 *   [conflicts]="conflictsForItem"
 *   (editClick)="onEdit($event)"
 *   (deleteClick)="onDelete($event)"
 * />
 * ```
 */
@Component({
  selector: 'smk-schedule-item-row',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (rowTemplate()) {
      <ng-container [ngTemplateOutlet]="rowTemplate()!" [ngTemplateOutletContext]="{ $implicit: item() }" />
    } @else {
      <div
        class="smk-schedule-item"
        [class.smk-schedule-item--editing]="isEditing()"
        [class.smk-schedule-item--completed]="item().completed"
        [class.smk-schedule-item--locked]="item().locked"
        [class.smk-schedule-item--conflict]="conflicts().length > 0 && showConflictWarning()"
        [style.--item-color]="resolvedColor()"
        [attr.data-item-id]="item().id"
        [attr.aria-label]="item().title"
        (click)="onRowClick()"
        (keydown.enter)="onRowClick()"
        (keydown.space)="onRowClick(); $event.preventDefault()"
        tabindex="0"
        role="button"
      >
        <!-- Drag Handle -->
        @if (showDragHandle() && !item().locked) {
          <span class="smk-schedule-item__drag" cdkDragHandle aria-hidden="true" title="Drag to reorder">⠿</span>
        } @else {
          <span class="smk-schedule-item__drag smk-schedule-item__drag--placeholder"></span>
        }

        <!-- Color Dot / Icon -->
        <span
          class="smk-schedule-item__color-dot"
          [style.background]="resolvedColor()"
          [attr.aria-label]="'Color: ' + (item().color ?? 'default')"
        >
          @if (item().icon) {
            <span class="smk-schedule-item__icon">{{ item().icon }}</span>
          }
        </span>

        <!-- Title + Meta -->
        <span class="smk-schedule-item__body">
          <span class="smk-schedule-item__title-row">
            <span class="smk-schedule-item__title">{{ item().title }}</span>

            @if (item().badgeText) {
              <span class="smk-schedule-item__badge-pill">{{ item().badgeText }}</span>
            }

            @if (item().locked) {
              <span class="smk-schedule-item__lock-icon" title="Locked" aria-label="Locked">🔒</span>
            }

            @if (item().recurrence) {
              <span class="smk-schedule-item__recurrence-icon" title="Recurring" aria-label="Recurring">🔁</span>
            }
          </span>

          <span class="smk-schedule-item__meta-row">
            @if (showCategory() && item().category) {
              <span class="smk-schedule-item__category">{{ item().category }}</span>
            }

            @if (showPriority() && item().priority) {
              <span
                class="smk-schedule-item__priority smk-schedule-item__priority--pill"
                [class]="'smk-schedule-item__priority--' + item().priority"
                [title]="item().priority"
              >
                <span class="smk-schedule-item__priority-dot" aria-hidden="true"></span>
                <span class="smk-schedule-item__priority-label">{{ item().priority }}</span>
              </span>
            }

            @if (showTags() && item().tags?.length) {
              <span class="smk-schedule-item__tags">
                @for (tag of item().tags!.slice(0, 2); track tag) {
                  <span class="smk-schedule-item__tag">{{ tag }}</span>
                }
                @if ((item().tags?.length ?? 0) > 2) {
                  <span class="smk-schedule-item__tag smk-schedule-item__tag--more">
                    +{{ (item().tags?.length ?? 0) - 2 }}
                  </span>
                }
              </span>
            }
          </span>
        </span>

        <!-- Date Badge -->
        @if (badgeTemplate()) {
          <ng-container [ngTemplateOutlet]="badgeTemplate()!" [ngTemplateOutletContext]="{ $implicit: item() }" />
        } @else {
          <span class="smk-schedule-item__date-badge">
            @if (showDuration()) {
              <span class="smk-schedule-item__duration">{{ duration() }}</span>
            }
            <span class="smk-schedule-item__date">{{ dateLabel() }}</span>
          </span>
        }

        <!-- Conflict Warning -->
        @if (conflicts().length > 0 && showConflictWarning()) {
          <span
            class="smk-schedule-item__conflict"
            [title]="conflictTitle()"
            aria-label="Date conflict"
            >⚡</span
          >
        }

        <!-- Actions -->
        @if (actionsTemplate()) {
          <ng-container [ngTemplateOutlet]="actionsTemplate()!" [ngTemplateOutletContext]="{ $implicit: item() }" />
        } @else {
          <span class="smk-schedule-item__actions">
            @if (showComplete()) {
              <button
                class="smk-schedule-item__action smk-schedule-item__action--complete"
                type="button"
                [title]="item().completed ? 'Mark incomplete' : 'Mark complete'"
                [attr.aria-label]="item().completed ? 'Mark incomplete' : 'Mark complete'"
                [class.smk-schedule-item__action--active]="item().completed"
                (click)="onToggleComplete($event)"
              >
                {{ item().completed ? '✓' : '○' }}
              </button>
            }

            @if (!item().locked) {
              <button
                class="smk-schedule-item__action smk-schedule-item__action--edit"
                type="button"
                title="Edit"
                aria-label="Edit item"
                (click)="onEdit($event)"
              >
                ✏️
              </button>

              @if (showDuplicate()) {
                <button
                  class="smk-schedule-item__action smk-schedule-item__action--duplicate"
                  type="button"
                  title="Duplicate"
                  aria-label="Duplicate item"
                  (click)="onDuplicate($event)"
                >
                  ⎘
                </button>
              }

              <button
                class="smk-schedule-item__action smk-schedule-item__action--delete"
                type="button"
                title="Delete"
                aria-label="Delete item"
                (click)="onDelete($event)"
              >
                🗑️
              </button>
            } @else {
              <button
                class="smk-schedule-item__action smk-schedule-item__action--unlock"
                type="button"
                title="Locked — click to unlock"
                aria-label="Unlock item"
                (click)="onToggleLock($event)"
              >
                🔒
              </button>
            }
          </span>
        }
      </div>
    }
  `,
})
export class ScheduleItemRowComponent {
  // ─── Signal Inputs ─────────────────────────────────────────────────

  /** The schedule item to display. Required. */
  readonly item = input.required<ScheduleItem>();

  /** Whether this row's edit form is currently open. */
  readonly isEditing = input<boolean>(false);

  /** Items that overlap with this item's date range. */
  readonly conflicts = input<ScheduleItem[]>([]);

  /** Template to replace the entire row. Receives `{ $implicit: ScheduleItem }`. */
  readonly rowTemplate = input<TemplateRef<{ $implicit: ScheduleItem }> | null>(null);

  /** Template to replace only the date/duration badge. */
  readonly badgeTemplate = input<TemplateRef<{ $implicit: ScheduleItem }> | null>(null);

  /** Template to replace the action button group. */
  readonly actionsTemplate = input<TemplateRef<{ $implicit: ScheduleItem }> | null>(null);

  // ─── Feature Toggles ────────────────────────────────────────────────

  /** Show the drag handle (hidden for locked items). Default: `true`. */
  readonly showDragHandle = input<boolean>(true);

  /** Show the complete/incomplete toggle button. Default: `true`. */
  readonly showComplete = input<boolean>(true);

  /** Show the duplicate button. Default: `true`. */
  readonly showDuplicate = input<boolean>(true);

  /** Show the priority icon in the meta row. Default: `true`. */
  readonly showPriority = input<boolean>(true);

  /** Show the duration label in the badge. Default: `true`. */
  readonly showDuration = input<boolean>(true);

  /** Show tag chips in the meta row. Default: `true`. */
  readonly showTags = input<boolean>(true);

  /** Show the category chip in the meta row. Default: `true`. */
  readonly showCategory = input<boolean>(true);

  /** Show the conflict warning icon. Default: `true`. */
  readonly showConflictWarning = input<boolean>(true);

  /**
   * Custom date label formatter. Receives the item and returns a string.
   * If not provided, a default `MMM D – MMM D` format is used.
   */
  readonly formatItemDate = input<((item: ScheduleItem) => string) | null>(null);

  /**
   * Custom duration formatter. Receives the item and returns a string like `"3d"`.
   * If not provided, the built-in day-count formula is used.
   */
  readonly formatItemDuration = input<((item: ScheduleItem) => string) | null>(null);

  // ─── Outputs ────────────────────────────────────────────────────────

  /** Emitted when the Edit button (✏️) is clicked. */
  readonly editClick = output<ScheduleItem>();

  /** Emitted when the Delete button (🗑️) is clicked. */
  readonly deleteClick = output<ScheduleItem>();

  /** Emitted when the Duplicate button is clicked. */
  readonly duplicateClick = output<ScheduleItem>();

  /** Emitted when the complete toggle is clicked. */
  readonly toggleComplete = output<ScheduleItem>();

  /** Emitted when the lock/unlock button is clicked. */
  readonly toggleLock = output<ScheduleItem>();

  /** Emitted when the row body is clicked (not an action button). */
  readonly itemClick = output<ScheduleItem>();

  // ─── Computed ───────────────────────────────────────────────────────

  readonly resolvedColor = computed(() => resolveColor(this.item().color));

  readonly priorityIcon = computed(() => PRIORITY_ICON[this.item().priority ?? ''] ?? '');

  readonly duration = computed(() => durationLabel(this.item(), this.formatItemDuration() ?? undefined));

  readonly dateLabel = computed(() => {
    const item = this.item();
    const fn = this.formatItemDate();
    if (fn) return fn(item);
    const fmt = (d: Date) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return item.end ? `${fmt(item.start)} – ${fmt(item.end)}` : fmt(item.start);
  });

  readonly conflictTitle = computed(() => {
    const titles = this.conflicts().map((c) => c.title);
    return 'Overlaps with: ' + titles.join(', ');
  });

  // ─── Handlers ───────────────────────────────────────────────────────

  onEdit(e: Event): void {
    e.stopPropagation();
    this.editClick.emit(this.item());
  }

  onDelete(e: Event): void {
    e.stopPropagation();
    this.deleteClick.emit(this.item());
  }

  onDuplicate(e: Event): void {
    e.stopPropagation();
    this.duplicateClick.emit(this.item());
  }

  onToggleComplete(e: Event): void {
    e.stopPropagation();
    this.toggleComplete.emit(this.item());
  }

  onToggleLock(e: Event): void {
    e.stopPropagation();
    this.toggleLock.emit(this.item());
  }

  onRowClick(): void {
    this.itemClick.emit(this.item());
  }
}
