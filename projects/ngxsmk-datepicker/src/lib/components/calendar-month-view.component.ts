import { Component, Input, ChangeDetectionStrategy, TemplateRef, input, output } from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { DatepickerClasses } from '../interfaces/datepicker-classes.interface';

@Component({
  selector: 'ngxsmk-calendar-month-view',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="ngxsmk-days-grid-wrapper"
      (touchstart)="swipeStart.emit($event)"
      (touchmove)="swipeMove.emit($event)"
      (touchend)="swipeEnd.emit($event)"
    >
      <div class="ngxsmk-days-grid" role="grid" [attr.aria-label]="ariaLabel()">
        @for (day of weekDays(); track $index) {
          <div class="ngxsmk-day-name">{{ day }}</div>
        }
        @for (day of days(); track day ? day.getTime() : $index) {
          <div
            class="ngxsmk-day-cell"
            [ngClass]="classes()?.dayCell"
            [class.empty]="!isCurrentMonth(day)"
            [class.disabled]="isDateDisabled()(day)"
            [class.today]="isSameDay()(day, today())"
            [class.holiday]="isHoliday()(day)"
            [class.selected]="mode() === 'single' && isSameDay()(day, selectedDate())"
            [class.multiple-selected]="mode() === 'multiple' && isMultipleSelected()(day)"
            [class.start-date]="isRangeType() && isSameDay()(day, startDate())"
            [class.end-date]="isRangeType() && isSameDay()(day, endDate())"
            [class.in-range]="isRangeType() && isInRange()(day)"
            [class.preview-range]="isPreviewInRange()(day)"
            [class.focused]="day && focusedDate() && isSameDay()(day, focusedDate())"
            [attr.tabindex]="day && !isDateDisabled()(day) ? 0 : -1"
            [attr.role]="day ? 'gridcell' : null"
            [attr.aria-selected]="day && mode() === 'single' && isSameDay()(day, selectedDate()) ? 'true' : null"
            [attr.aria-label]="day ? getAriaLabel()(day) : null"
            [ngClass]="getDayCellCustomClasses()(day)"
            [attr.title]="day ? getDayCellTooltip()(day) : null"
            [attr.data-date]="day ? day.getTime() : null"
            (click)="onDateClick(day)"
            (mousedown)="onDateMouseDown(day)"
            (mouseup)="onDateMouseUp()"
            (touchstart)="onDateCellTouchStart($event, day)"
            (touchend)="onDateCellTouchEnd($event, day)"
            (touchmove)="onDateCellTouchMove($event)"
            (keydown.enter)="onDateClick(day)"
            (keydown.space)="onDateClick(day); $event.preventDefault()"
            (mouseenter)="onDateHover(day)"
            (focus)="onDateFocus(day)"
          >
            @if (day) {
              @if (dayTemplate) {
                <ng-container
                  *ngTemplateOutlet="
                    dayTemplate;
                    context: {
                      $implicit: day,
                      date: day,
                      selected:
                        (mode() === 'single' && isSameDay()(day, selectedDate())) ||
                        (mode() === 'multiple' && isMultipleSelected()(day)) ||
                        (isRangeType() && (isSameDay()(day, startDate()) || isSameDay()(day, endDate()))),
                      disabled: isDateDisabled()(day),
                      today: isSameDay()(day, today()),
                      holiday: isHoliday()(day),
                      inRange: isRangeType() && isInRange()(day),
                      startDate: isRangeType() && isSameDay()(day, startDate()),
                      endDate: isRangeType() && isSameDay()(day, endDate()),
                    }
                  "
                ></ng-container>
              } @else if (dateTemplate) {
                <ng-container
                  *ngTemplateOutlet="
                    dateTemplate;
                    context: {
                      $implicit: day,
                      date: day,
                      selected:
                        (mode() === 'single' && isSameDay()(day, selectedDate())) ||
                        (mode() === 'multiple' && isMultipleSelected()(day)) ||
                        (isRangeType() && (isSameDay()(day, startDate()) || isSameDay()(day, endDate()))),
                      disabled: isDateDisabled()(day),
                      today: isSameDay()(day, today()),
                      holiday: isHoliday()(day),
                      inRange: isRangeType() && isInRange()(day),
                      startDate: isRangeType() && isSameDay()(day, startDate()),
                      endDate: isRangeType() && isSameDay()(day, endDate()),
                    }
                  "
                ></ng-container>
              } @else {
                <div class="ngxsmk-day-number">{{ formatDayNumber()(day) }}</div>
              }
            }
          </div>
        }
      </div>
    </div>
  `,
})
/**
 * Presentational component that renders the grid of days for a single month.
 *
 * @remarks
 * This component is "dumb" or stateless; it receives all necessary data (days, selection state,
 * styling classes) from the parent `NgxsmkDatepickerComponent` and emits events for user interactions.
 *
 * Key responsibilities:
 * - Rendering the 7x6 day grid
 * - Applying appropriate CSS classes for selection, ranges, today, etc.
 * - Handling touch and mouse events for dates
 * - Delegating complex logic (isDateDisabled, etc.) back to the parent via bound functions
 */
export class CalendarMonthViewComponent {
  readonly days = input<(Date | null)[]>([]);
  readonly weekDays = input<string[]>([]);
  readonly classes = input<DatepickerClasses>();
  @Input() dateTemplate: TemplateRef<unknown> | null = null;
  @Input() dayTemplate: TemplateRef<unknown> | null = null;
  readonly mode = input<'single' | 'range' | 'multiple' | 'week' | 'month' | 'quarter' | 'year' | 'timeRange'>(
    'single'
  );
  readonly selectedDate = input<Date | null>(null);
  readonly startDate = input<Date | null>(null);
  readonly endDate = input<Date | null>(null);
  readonly focusedDate = input<Date | null>(null);
  readonly today = input<Date>(new Date());
  readonly currentMonth = input<number>(0);
  readonly currentYear = input<number>(0);
  readonly ariaLabel = input<string>('');

  // Function inputs for logic checks
  readonly isDateDisabled = input<(date: Date | null) => boolean>(() => false);
  readonly isSameDay = input<(date1: Date | null, date2: Date | null) => boolean>(() => false);
  readonly isHoliday = input<(date: Date | null) => boolean>(() => false);
  readonly isMultipleSelected = input<(date: Date | null) => boolean>(() => false);
  readonly isInRange = input<(date: Date | null) => boolean>(() => false);
  readonly isPreviewInRange = input<(date: Date | null) => boolean>(() => false);
  readonly getAriaLabel = input<(date: Date | null) => string>(() => '');
  readonly getDayCellCustomClasses = input<
    (date: Date | null) =>
      | string
      | string[]
      | Set<string>
      | {
          [klass: string]: unknown;
        }
  >(() => ({}));
  readonly getDayCellTooltip = input<(date: Date | null) => string | null>(() => '');
  readonly formatDayNumber = input<(date: Date | null) => string | null>((d) => (d ? d.getDate().toString() : ''));

  readonly dateClick = output<Date>();
  readonly dateMouseDown = output<Date>();
  readonly dateMouseUp = output<void>();
  readonly dateHover = output<Date>();
  readonly dateFocus = output<Date>();
  readonly swipeStart = output<TouchEvent>();
  readonly swipeMove = output<TouchEvent>();
  readonly swipeEnd = output<TouchEvent>();

  readonly touchStart = output<{
    event: TouchEvent;
    day: Date | null;
  }>();
  readonly touchMove = output<TouchEvent>();
  readonly touchEnd = output<{
    event: TouchEvent;
    day: Date | null;
  }>();

  isRangeType(): boolean {
    return ['range', 'week', 'month', 'quarter', 'year', 'timeRange'].includes(this.mode());
  }

  trackByDay(index: number, day: Date | null): number {
    return day ? day.getTime() : index;
  }

  isCurrentMonth(date: Date | null): boolean {
    return !!date && date.getMonth() === this.currentMonth() && date.getFullYear() === this.currentYear();
  }

  onDateClick(day: Date | null) {
    if (day && !this.isDateDisabled()(day)) {
      this.dateClick.emit(day);
    }
  }

  onDateHover(day: Date | null) {
    if (day) {
      this.dateHover.emit(day);
    }
  }

  onDateFocus(day: Date | null) {
    if (day) {
      this.dateFocus.emit(day);
    }
  }

  onDateMouseDown(day: Date | null) {
    if (day && !this.isDateDisabled()(day)) {
      this.dateMouseDown.emit(day);
    }
  }

  onDateMouseUp() {
    this.dateMouseUp.emit();
  }

  onDateCellTouchStart(event: TouchEvent, day: Date | null) {
    this.touchStart.emit({ event, day });
  }

  onDateCellTouchEnd(event: TouchEvent, day: Date | null) {
    this.touchEnd.emit({ event, day });
  }

  onDateCellTouchMove(event: TouchEvent) {
    this.touchMove.emit(event);
  }
}
