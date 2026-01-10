import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ngxsmk-calendar-month-view',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ngxsmk-days-grid-wrapper" 
         (touchstart)="swipeStart.emit($event)"
         (touchmove)="swipeMove.emit($event)"
         (touchend)="swipeEnd.emit($event)">
      <div class="ngxsmk-days-grid" role="grid" [attr.aria-label]="ariaLabel">
        @for (day of weekDays; track day) {
          <div class="ngxsmk-day-name">{{ day }}</div>
        }
        @for (day of days; track trackByDay($index, day)) {
          <div class="ngxsmk-day-cell" [ngClass]="classes?.dayCell"
               [class.empty]="!isCurrentMonth(day)" 
               [class.disabled]="isDateDisabled(day)" 
               [class.today]="isSameDay(day, today)"
               [class.holiday]="isHoliday(day)"
               [class.selected]="mode === 'single' && isSameDay(day, selectedDate)"
               [class.multiple-selected]="mode === 'multiple' && isMultipleSelected(day)"
               [class.start-date]="mode === 'range' && isSameDay(day, startDate)"
               [class.end-date]="mode === 'range' && isSameDay(day, endDate)"
               [class.in-range]="mode === 'range' && isInRange(day)"
               [class.preview-range]="isPreviewInRange(day)"
               [class.focused]="day && focusedDate && isSameDay(day, focusedDate)"
               [attr.tabindex]="day && !isDateDisabled(day) ? 0 : -1"
               [attr.role]="day ? 'gridcell' : null"
               [attr.aria-selected]="day && (mode === 'single' && isSameDay(day, selectedDate)) ? 'true' : null"
               [attr.aria-label]="day ? getAriaLabel(day) : null"
               [ngClass]="getDayCellCustomClasses(day)"
               [attr.title]="day ? getDayCellTooltip(day) : null"
               [attr.data-date]="day ? day.getTime() : null"
               (click)="onDateClick(day)" 
               (touchstart)="onDateCellTouchStart($event, day)"
               (touchend)="onDateCellTouchEnd($event, day)"
               (touchmove)="onDateCellTouchMove($event)"
               (keydown.enter)="onDateClick(day)"
               (keydown.space)="onDateClick(day); $event.preventDefault()"
               (mouseenter)="onDateHover(day)"
               (focus)="onDateFocus(day)">
            @if (day) {
              <div class="ngxsmk-day-number">{{ formatDayNumber(day) }}</div>
            }
          </div>
        }
      </div>
    </div>
  `
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
  @Input() days: (Date | null)[] = [];
  @Input() weekDays: string[] = [];
  @Input() classes: any;
  @Input() mode: 'single' | 'range' | 'multiple' | 'week' | 'month' | 'quarter' | 'year' = 'single';
  @Input() selectedDate: Date | null = null;
  @Input() startDate: Date | null = null;
  @Input() endDate: Date | null = null;
  @Input() focusedDate: Date | null = null;
  @Input() today: Date = new Date();
  @Input() currentMonth: number = 0;
  @Input() currentYear: number = 0;
  @Input() ariaLabel: string = '';

  // Function inputs for logic checks
  @Input() isDateDisabled: (date: Date | null) => boolean = () => false;
  @Input() isSameDay: (date1: Date | null, date2: Date | null) => boolean = () => false;
  @Input() isHoliday: (date: Date | null) => boolean = () => false;
  @Input() isMultipleSelected: (date: Date | null) => boolean = () => false;
  @Input() isInRange: (date: Date | null) => boolean = () => false;
  @Input() isPreviewInRange: (date: Date | null) => boolean = () => false;
  @Input() getAriaLabel: (date: Date | null) => string = () => '';
  @Input() getDayCellCustomClasses: (date: Date | null) => any = () => ({});
  @Input() getDayCellTooltip: (date: Date | null) => string | null = () => '';
  @Input() formatDayNumber: (date: Date | null) => string | null = (d) => d ? d.getDate().toString() : '';

  @Output() dateClick = new EventEmitter<Date>();
  @Output() dateHover = new EventEmitter<Date>();
  @Output() dateFocus = new EventEmitter<Date>();
  @Output() swipeStart = new EventEmitter<TouchEvent>();
  @Output() swipeMove = new EventEmitter<TouchEvent>();
  @Output() swipeEnd = new EventEmitter<TouchEvent>();

  @Output() touchStart = new EventEmitter<{ event: TouchEvent, day: Date | null }>();
  @Output() touchMove = new EventEmitter<TouchEvent>();
  @Output() touchEnd = new EventEmitter<{ event: TouchEvent, day: Date | null }>();

  trackByDay(index: number, day: Date | null): number {
    return day ? day.getTime() : index;
  }

  isCurrentMonth(date: Date | null): boolean {
    return !!date && date.getMonth() === this.currentMonth && date.getFullYear() === this.currentYear;
  }

  onDateClick(day: Date | null) {
    if (day && !this.isDateDisabled(day)) {
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
