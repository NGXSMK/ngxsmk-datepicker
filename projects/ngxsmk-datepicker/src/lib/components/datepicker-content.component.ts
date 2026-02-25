import { Component, Input, Output, EventEmitter, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { CalendarHeaderComponent } from './calendar-header.component';
import { CalendarMonthViewComponent } from './calendar-month-view.component';
import { CalendarYearViewComponent } from './calendar-year-view.component';
import { TimeSelectionComponent } from './time-selection.component';
import { NgxsmkDatepickerPresetsComponent } from './datepicker-presets.component';
import { DatepickerClasses } from '../interfaces/datepicker-classes.interface';
import { DatepickerTranslations } from '../interfaces/datepicker-translations.interface';

@Component({
  selector: 'ngxsmk-datepicker-content',
  standalone: true,
  imports: [
    NgClass,
    DatePipe,
    CalendarHeaderComponent,
    CalendarMonthViewComponent,
    CalendarYearViewComponent,
    TimeSelectionComponent,
    NgxsmkDatepickerPresetsComponent,
  ],
  template: `
    @if (isCalendarVisible) {
      @if (!isInlineMode && isCalendarOpen) {
        <div
          class="ngxsmk-backdrop"
          [class.ngxsmk-backdrop-allow-modal-scroll]="shouldAppendToBody"
          [class.dark-theme]="theme === 'dark'"
          role="button"
          tabindex="0"
          [attr.aria-label]="translations?.closeCalendarOverlay ?? ''"
          (click)="backdropClick.emit($event)"
          (keydown.enter)="backdropClick.emit($event)"
          (keydown.space)="backdropClick.emit($event)"
        ></div>
      }
      <div
        #popoverContainer
        [id]="popoverId"
        class="ngxsmk-popover-container"
        [class.dark-theme]="theme === 'dark'"
        [class.ngxsmk-inline-container]="isInlineMode"
        [class.ngxsmk-popover-open]="isCalendarOpen && !isInlineMode"
        [class.ngxsmk-time-only-popover]="timeOnly"
        [class.ngxsmk-has-time-selection]="showTime || timeOnly"
        [class.ngxsmk-bottom-sheet]="
          isMobile &&
          mobileModalStyle === 'bottom-sheet' &&
          !isInlineMode
        "
        [class.ngxsmk-fullscreen]="
          isMobile &&
          mobileModalStyle === 'fullscreen' &&
          !isInlineMode
        "
        [class.ngxsmk-align-left]="align === 'left'"
        [class.ngxsmk-align-right]="align === 'right'"
        [class.ngxsmk-align-center]="align === 'center'"
        [ngClass]="classes?.popover"
        role="dialog"
        [attr.aria-label]="ariaLabel"
        [attr.aria-modal]="!isInlineMode"
        (touchstart)="touchStartContainer.emit($event)"
        (touchmove)="touchMoveContainer.emit($event)"
        (touchend)="touchEndContainer.emit($event)"
        (mousedown)="$event.stopPropagation()"
      >
        <div
          class="ngxsmk-datepicker-container"
          [ngClass]="classes?.container"
        >
          @if (isCalendarOpening) {
            <div
              class="ngxsmk-calendar-loading"
              role="status"
              aria-live="polite"
              [attr.aria-label]="loadingMessage"
            >
              <div class="ngxsmk-calendar-loading-spinner"></div>
              <span class="ngxsmk-calendar-loading-text">{{
                loadingMessage
              }}</span>
            </div>
          }
          @if (
            showRanges &&
            rangesArray.length > 0 &&
            mode === 'range' &&
            !timeOnly
          ) {
            <ngxsmk-datepicker-presets
              [ranges]="rangesArray"
              [disabled]="disabled"
              [classes]="classes"
              (rangeSelected)="rangeSelect.emit($event)"
            ></ngxsmk-datepicker-presets>
          }

          <div
            class="ngxsmk-calendar-container"
            [class.ngxsmk-time-only-mode]="timeOnly"
            [class.ngxsmk-has-multi-calendar]="calendarCount > 1"
            [class.ngxsmk-calendar-layout-horizontal]="
              calendarCount > 1 && calendarLayout === 'horizontal'
            "
            [class.ngxsmk-calendar-layout-vertical]="
              calendarCount > 1 && calendarLayout === 'vertical'
            "
            [class.ngxsmk-calendar-layout-auto]="
              calendarCount > 1 && calendarLayout === 'auto'
            "
            [ngClass]="classes?.calendar"
          >
            @if (!timeOnly) {
              @if (calendarViewMode === 'month') {
                <ngxsmk-calendar-header
                  [headerClass]="classes?.header ?? ''"
                  [navPrevClass]="classes?.navPrev ?? ''"
                  [navNextClass]="classes?.navNext ?? ''"
                  [monthOptions]="monthOptions"
                  [currentMonth]="currentMonth"
                  [yearOptions]="yearOptions"
                  [currentYear]="currentYear"
                  [disabled]="disabled"
                  [isBackArrowDisabled]="isBackArrowDisabled"
                  [prevMonthAriaLabel]="prevMonthAriaLabel"
                  [nextMonthAriaLabel]="nextMonthAriaLabel"
                  (previousMonth)="previousMonth.emit()"
                  (nextMonth)="nextMonth.emit()"
                  (currentMonthChange)="currentMonthChange.emit($event)"
                  (currentYearChange)="currentYearChange.emit($event)"
                >
                </ngxsmk-calendar-header>
                <div
                  class="ngxsmk-multi-calendar-container"
                  [class.ngxsmk-multi-calendar]="calendarCount > 1"
                  [class.ngxsmk-calendar-horizontal]="
                    calendarCount > 1 && calendarLayout === 'horizontal'
                  "
                  [class.ngxsmk-calendar-vertical]="
                    calendarCount > 1 && calendarLayout === 'vertical'
                  "
                  [class.ngxsmk-calendar-auto]="
                    calendarCount > 1 && calendarLayout === 'auto'
                  "
                  [class.ngxsmk-sync-scroll-enabled]="
                    syncScrollEnabled && calendarCount > 1
                  "
                >
                  @for (
                    calendarMonth of calendarMonths;
                    track calendarMonth.month + '-' + calendarMonth.year
                  ) {
                    <div
                      class="ngxsmk-calendar-month"
                      [class.ngxsmk-calendar-month-multi]="
                        calendarCount > 1
                      "
                    >
                      @if (calendarCount > 1) {
                        <div class="ngxsmk-calendar-month-header">
                          <span class="ngxsmk-calendar-month-title">{{
                            getMonthYearLabel(
                              calendarMonth.month,
                              calendarMonth.year
                            )
                          }}</span>
                        </div>
                      }
                      <ngxsmk-calendar-month-view
                        [days]="calendarMonth.days"
                        [weekDays]="weekDays"
                        [classes]="classes"
                        [mode]="mode"
                        [selectedDate]="selectedDate"
                        [startDate]="startDate"
                        [endDate]="endDate"
                        [focusedDate]="focusedDate"
                        [today]="today"
                        [currentMonth]="calendarMonth.month"
                        [currentYear]="calendarMonth.year"
                        [ariaLabel]="
                          getCalendarAriaLabelForMonth(
                            calendarMonth.month,
                            calendarMonth.year
                          )
                        "
                        [dateTemplate]="dateTemplate"
                        [isDateDisabled]="boundIsDateDisabled"
                        [isSameDay]="boundIsSameDay"
                        [isHoliday]="boundIsHoliday"
                        [isMultipleSelected]="boundIsMultipleSelected"
                        [isInRange]="boundIsInRange"
                        [isPreviewInRange]="boundIsPreviewInRange"
                        [getAriaLabel]="boundGetAriaLabel"
                        [getDayCellCustomClasses]="boundGetDayCellCustomClasses"
                        [getDayCellTooltip]="boundGetDayCellTooltip"
                        [formatDayNumber]="boundFormatDayNumber"
                        (dateClick)="dateClick.emit($event)"
                        (dateHover)="dateHover.emit($event)"
                        (dateFocus)="dateFocus.emit($event)"
                        (swipeStart)="swipeStart.emit($event)"
                        (swipeMove)="swipeMove.emit($event)"
                        (swipeEnd)="swipeEnd.emit($event)"
                        (touchStart)="touchStart.emit($event)"
                        (touchMove)="touchMove.emit($event)"
                        (touchEnd)="touchEnd.emit($event)"
                      >
                      </ngxsmk-calendar-month-view>
                    </div>
                  }
                </div>
              }

              @if (calendarViewMode === 'year') {
                <ngxsmk-calendar-year-view
                  viewMode="year"
                  [yearGrid]="yearGrid"
                  [currentYear]="currentYear"
                  [currentDecade]="currentDecade"
                  [today]="today"
                  [disabled]="disabled"
                  [headerClass]="classes?.header ?? ''"
                  [navPrevClass]="classes?.navPrev ?? ''"
                  [navNextClass]="classes?.navNext ?? ''"
                  [previousYearsLabel]="translations?.previousYears ?? ''"
                  [nextYearsLabel]="translations?.nextYears ?? ''"
                  (viewModeChange)="viewModeChange.emit($event)"
                  (changeYear)="changeYear.emit($event)"
                  (yearClick)="yearClick.emit($event)"
                >
                </ngxsmk-calendar-year-view>
              }

              @if (calendarViewMode === 'decade') {
                <ngxsmk-calendar-year-view
                  viewMode="decade"
                  [decadeGrid]="decadeGrid"
                  [currentDecade]="currentDecade"
                  [disabled]="disabled"
                  [headerClass]="classes?.header ?? ''"
                  [navPrevClass]="classes?.navPrev ?? ''"
                  [navNextClass]="classes?.navNext ?? ''"
                  [previousDecadeLabel]="translations?.previousDecade ?? ''"
                  [nextDecadeLabel]="translations?.nextDecade ?? ''"
                  (changeDecade)="changeDecade.emit($event)"
                  (decadeClick)="decadeClick.emit($event)"
                >
                </ngxsmk-calendar-year-view>
              }

              @if (calendarViewMode === 'timeline' && mode === 'range') {
                <div class="ngxsmk-timeline-view">
                  <div class="ngxsmk-timeline-header">
                    <div class="ngxsmk-timeline-controls">
                      <button
                        type="button"
                        class="ngxsmk-timeline-zoom-out"
                        (click)="timelineZoomOut.emit()"
                        [disabled]="disabled"
                      >
                        -
                      </button>
                      <span class="ngxsmk-timeline-range"
                        >{{ timelineStartDate | date: 'shortDate' }} -
                        {{ timelineEndDate | date: 'shortDate' }}</span
                      >
                      <button
                        type="button"
                        class="ngxsmk-timeline-zoom-in"
                        (click)="timelineZoomIn.emit()"
                        [disabled]="disabled"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div class="ngxsmk-timeline-container" #timelineContainer>
                    <div class="ngxsmk-timeline-track">
                      @for (
                        month of timelineMonths;
                        track month.getTime()
                      ) {
                        <div
                          class="ngxsmk-timeline-month"
                          [class.selected]="isTimelineMonthSelected(month)"
                          (click)="onTimelineMonthClick(month, $event)"
                          (keydown.enter)="timelineMonthClick.emit(month)"
                          (keydown.space)="onTimelineMonthSpace(month, $event)"
                          role="button"
                          tabindex="0"
                          [attr.aria-label]="month | date: 'MMMM yyyy'"
                        >
                          <div class="ngxsmk-timeline-month-label">
                            {{ month | date: 'MMM' }}
                          </div>
                          <div class="ngxsmk-timeline-month-year">
                            {{ month | date: 'yyyy' }}
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }

              @if (
                calendarViewMode === 'time-slider' &&
                mode === 'range' &&
                showTime
              ) {
                <div class="ngxsmk-time-slider-view">
                  <div class="ngxsmk-time-slider-header">
                    <div class="ngxsmk-time-slider-label">
                      {{ translations?.startTime ?? '' }}
                    </div>
                    <div class="ngxsmk-time-slider-value">
                      {{ formatTimeSliderValue(startTimeSlider) }}
                    </div>
                  </div>
                  <div class="ngxsmk-time-slider-container">
                    <input
                      #startTimeInput
                      type="range"
                      class="ngxsmk-time-slider"
                      [min]="0"
                      [max]="1440"
                      [step]="minuteInterval"
                      [value]="startTimeSlider"
                      (input)="startTimeSliderChange.emit(+startTimeInput.value)"
                      [disabled]="disabled"
                    />
                  </div>
                  <div class="ngxsmk-time-slider-header">
                    <div class="ngxsmk-time-slider-label">
                      {{ translations?.endTime ?? '' }}
                    </div>
                    <div class="ngxsmk-time-slider-value">
                      {{ formatTimeSliderValue(endTimeSlider) }}
                    </div>
                  </div>
                  <div class="ngxsmk-time-slider-container">
                    <input
                      #endTimeInput
                      type="range"
                      class="ngxsmk-time-slider"
                      [min]="0"
                      [max]="1440"
                      [step]="minuteInterval"
                      [value]="endTimeSlider"
                      (input)="endTimeSliderChange.emit(+endTimeInput.value)"
                      [disabled]="disabled"
                    />
                  </div>
                </div>
              }
            }

            @if (showTime || timeOnly) {
              @if (!timeRangeMode) {
                <ngxsmk-time-selection
                  [hourOptions]="hourOptions"
                  [minuteOptions]="minuteOptions"
                  [secondOptions]="secondOptions"
                  [ampmOptions]="ampmOptions"
                  [currentDisplayHour]="currentDisplayHour"
                  [currentMinute]="currentMinute"
                  [currentSecond]="currentSecond"
                  [isPm]="isPm"
                  [showSeconds]="showSeconds"
                  [disabled]="disabled"
                  [timeLabel]="translations?.time ?? ''"
                  [showAmpm]="!use24Hour"
                  (currentDisplayHourChange)="currentDisplayHourChange.emit($event)"
                  (currentMinuteChange)="currentMinuteChange.emit($event)"
                  (currentSecondChange)="currentSecondChange.emit($event)"
                  (isPmChange)="isPmChange.emit($event)"
                  (timeChange)="timeChange.emit()"
                >
                </ngxsmk-time-selection>
              } @else {
                <div class="ngxsmk-time-range-container">
                  <div class="ngxsmk-time-range-start">
                    <span class="ngxsmk-time-range-label">{{
                      translations?.from ?? ''
                    }}</span>
                    <ngxsmk-time-selection
                      [hourOptions]="hourOptions"
                      [minuteOptions]="minuteOptions"
                      [secondOptions]="secondOptions"
                      [ampmOptions]="ampmOptions"
                      [currentDisplayHour]="startDisplayHour"
                      [currentMinute]="startMinute"
                      [currentSecond]="startSecond"
                      [isPm]="startIsPm"
                      [showSeconds]="showSeconds"
                      [disabled]="disabled"
                      timeLabel=""
                      [showAmpm]="!use24Hour"
                      (currentDisplayHourChange)="startDisplayHourChange.emit($event)"
                      (currentMinuteChange)="startMinuteChange.emit($event)"
                      (currentSecondChange)="startSecondChange.emit($event)"
                      (isPmChange)="startIsPmChange.emit($event)"
                      (timeChange)="timeRangeChange.emit()"
                    >
                    </ngxsmk-time-selection>
                  </div>
                  <div class="ngxsmk-time-range-end">
                    <span class="ngxsmk-time-range-label">{{
                      translations?.to ?? ''
                    }}</span>
                    <ngxsmk-time-selection
                      [hourOptions]="hourOptions"
                      [minuteOptions]="minuteOptions"
                      [secondOptions]="secondOptions"
                      [ampmOptions]="ampmOptions"
                      [currentDisplayHour]="endDisplayHour"
                      [currentMinute]="endMinute"
                      [currentSecond]="endSecond"
                      [isPm]="endIsPm"
                      [showSeconds]="showSeconds"
                      [disabled]="disabled"
                      timeLabel=""
                      [showAmpm]="!use24Hour"
                      (currentDisplayHourChange)="endDisplayHourChange.emit($event)"
                      (currentMinuteChange)="endMinuteChange.emit($event)"
                      (currentSecondChange)="endSecondChange.emit($event)"
                      (isPmChange)="endIsPmChange.emit($event)"
                      (timeChange)="timeRangeChange.emit()"
                    >
                    </ngxsmk-time-selection>
                  </div>
                </div>
              }
            }

            @if (!isInlineMode) {
              <div class="ngxsmk-footer" [ngClass]="classes?.footer">
                <button
                  type="button"
                  class="ngxsmk-clear-button-footer"
                  (click)="clearValue.emit($event)"
                  [disabled]="disabled"
                  [attr.aria-label]="clearAriaLabel"
                  [ngClass]="classes?.clearBtn"
                >
                  {{ clearLabel }}
                </button>
                <button
                  type="button"
                  class="ngxsmk-close-button"
                  (click)="closeCalendar.emit()"
                  [disabled]="disabled"
                  [attr.aria-label]="closeAriaLabel"
                  [ngClass]="classes?.closeBtn"
                >
                  {{ closeLabel }}
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NgxsmkDatepickerContentComponent {
  @Input() isCalendarVisible: boolean = false;
  @Input() isCalendarOpen: boolean = false;
  @Input() isInlineMode: boolean = false;
  @Input() shouldAppendToBody: boolean = false;
  @Input() theme: string = 'light';
  @Input() popoverId: string = '';
  @Input() classes: DatepickerClasses | undefined = undefined;
  @Input() timeOnly: boolean = false;
  @Input() showTime: boolean = false;
  @Input() isMobile: boolean = false;
  @Input() mobileModalStyle: string = 'bottom-sheet';
  @Input() align: string = 'left';
  @Input() ariaLabel: string = '';
  @Input() isCalendarOpening: boolean = false;
  @Input() loadingMessage: string = '';
  @Input() showRanges: boolean = true;
  @Input() rangesArray: { key: string; value: [Date, Date] }[] = [];
  @Input() mode: 'single' | 'range' | 'multiple' | 'week' | 'month' | 'quarter' | 'year' | 'timeRange' = 'single';
  @Input() disabled: boolean = false;
  @Input() calendarCount: number = 1;
  @Input() calendarLayout: string = 'auto';
  @Input() syncScrollEnabled: boolean = false;
  @Input() calendarMonths: { month: number; year: number; days: (Date | null)[] }[] = [];
  @Input() weekDays: string[] = [];
  @Input() selectedDate: Date | null = null;
  @Input() startDate: Date | null = null;
  @Input() endDate: Date | null = null;
  @Input() focusedDate: Date | null = null;
  @Input() today: Date = new Date();
  @Input() dateTemplate: TemplateRef<unknown> | null = null;
  @Input() calendarViewMode: string = 'month';
  @Input() monthOptions: { label: string; value: number }[] = [];
  @Input() currentMonth: number = 0;
  @Input() yearOptions: { label: string; value: number }[] = [];
  @Input() currentYear: number = new Date().getFullYear();
  @Input() isBackArrowDisabled: boolean = false;
  @Input() prevMonthAriaLabel: string = '';
  @Input() nextMonthAriaLabel: string = '';
  @Input() yearGrid: number[] = [];
  @Input() currentDecade: number = 0;
  @Input() decadeGrid: number[] = [];
  @Input() timelineStartDate: Date | null = null;
  @Input() timelineEndDate: Date | null = null;
  @Input() timelineMonths: Date[] = [];
  @Input() minuteInterval: number = 1;
  @Input() startTimeSlider: number = 0;
  @Input() endTimeSlider: number = 0;
  @Input() timeRangeMode: boolean = false;
  @Input() hourOptions: { label: string; value: number }[] = [];
  @Input() minuteOptions: { label: string; value: number }[] = [];
  @Input() secondOptions: { label: string; value: number }[] = [];
  @Input() ampmOptions: { label: string; value: boolean }[] = [];
  @Input() currentDisplayHour: number = 12;
  @Input() currentMinute: number = 0;
  @Input() currentSecond: number = 0;
  @Input() isPm: boolean = false;
  @Input() showSeconds: boolean = false;
  @Input() use24Hour: boolean = false;
  @Input() startDisplayHour: number = 12;
  @Input() startMinute: number = 0;
  @Input() startSecond: number = 0;
  @Input() startIsPm: boolean = false;
  @Input() endDisplayHour: number = 12;
  @Input() endMinute: number = 0;
  @Input() endSecond: number = 0;
  @Input() endIsPm: boolean = false;
  @Input() clearAriaLabel: string = '';
  @Input() clearLabel: string = '';
  @Input() closeAriaLabel: string = '';
  @Input() closeLabel: string = '';
  @Input() translations: DatepickerTranslations | null = null;

  // Bound functions
  @Input() boundIsDateDisabled!: (date: Date | null) => boolean;
  @Input() boundIsSameDay!: (date1: Date | null, date2: Date | null) => boolean;
  @Input() boundIsHoliday!: (date: Date | null) => boolean;
  @Input() boundIsMultipleSelected!: (date: Date | null) => boolean;
  @Input() boundIsInRange!: (date: Date | null) => boolean;
  @Input() boundIsPreviewInRange!: (date: Date | null) => boolean;
  @Input() boundGetAriaLabel!: (date: Date | null) => string;
  @Input() boundGetDayCellCustomClasses!: (date: Date | null) => string | string[] | Set<string> | { [klass: string]: unknown };
  @Input() boundGetDayCellTooltip!: (date: Date | null) => string | null;
  @Input() boundFormatDayNumber!: (date: Date | null) => string;
  @Input() getMonthYearLabel!: (month: number, year: number) => string;
  @Input() getCalendarAriaLabelForMonth!: (month: number, year: number) => string;
  @Input() isTimelineMonthSelected!: (date: Date) => boolean;
  @Input() formatTimeSliderValue!: (value: number) => string;

  @Output() backdropClick = new EventEmitter<Event>();
  @Output() touchStartContainer = new EventEmitter<TouchEvent>();
  @Output() touchMoveContainer = new EventEmitter<TouchEvent>();
  @Output() touchEndContainer = new EventEmitter<TouchEvent>();
  @Output() rangeSelect = new EventEmitter<[Date, Date]>();
  @Output() previousMonth = new EventEmitter<void>();
  @Output() nextMonth = new EventEmitter<void>();
  @Output() currentMonthChange = new EventEmitter<number>();
  @Output() currentYearChange = new EventEmitter<number>();
  @Output() dateClick = new EventEmitter<Date>();
  @Output() dateHover = new EventEmitter<Date | null>();
  @Output() dateFocus = new EventEmitter<Date>();
  @Output() swipeStart = new EventEmitter<TouchEvent>();
  @Output() swipeMove = new EventEmitter<TouchEvent>();
  @Output() swipeEnd = new EventEmitter<TouchEvent>();
  @Output() touchStart = new EventEmitter<{ event: TouchEvent; day: Date | null }>();
  @Output() touchMove = new EventEmitter<TouchEvent>();
  @Output() touchEnd = new EventEmitter<{ event: TouchEvent; day: Date | null }>();
  @Output() viewModeChange = new EventEmitter<'month' | 'year' | 'decade' | 'timeline' | 'time-slider'>();
  @Output() changeYear = new EventEmitter<number>();
  @Output() yearClick = new EventEmitter<number>();
  @Output() changeDecade = new EventEmitter<number>();
  @Output() decadeClick = new EventEmitter<number>();
  @Output() timelineZoomOut = new EventEmitter<void>();
  @Output() timelineZoomIn = new EventEmitter<void>();
  @Output() timelineMonthClick = new EventEmitter<Date>();
  @Output() startTimeSliderChange = new EventEmitter<number>();
  @Output() endTimeSliderChange = new EventEmitter<number>();
  @Output() currentDisplayHourChange = new EventEmitter<number>();
  @Output() currentMinuteChange = new EventEmitter<number>();
  @Output() currentSecondChange = new EventEmitter<number>();
  @Output() isPmChange = new EventEmitter<boolean>();
  @Output() timeChange = new EventEmitter<void>();
  @Output() startDisplayHourChange = new EventEmitter<number>();
  @Output() startMinuteChange = new EventEmitter<number>();
  @Output() startSecondChange = new EventEmitter<number>();
  @Output() startIsPmChange = new EventEmitter<boolean>();
  @Output() endDisplayHourChange = new EventEmitter<number>();
  @Output() endMinuteChange = new EventEmitter<number>();
  @Output() endSecondChange = new EventEmitter<number>();
  @Output() endIsPmChange = new EventEmitter<boolean>();
  @Output() timeRangeChange = new EventEmitter<void>();
  @Output() clearValue = new EventEmitter<MouseEvent>();
  @Output() closeCalendar = new EventEmitter<void>();

  @ViewChild(CalendarHeaderComponent) header?: CalendarHeaderComponent;
  @ViewChild('popoverContainer') popoverContainer?: ElementRef<HTMLElement>;
  @ViewChild('timelineContainer') timelineContainer?: ElementRef<HTMLElement>;

  closeAllSelects(): void {
    if (this.header) {
      if (this.header.monthSelect) {
        this.header.monthSelect.isOpen = false;
      }
      if (this.header.yearSelect) {
        this.header.yearSelect.isOpen = false;
      }
    }
  }

  onTimelineMonthClick(month: Date, event: MouseEvent): void {
    event.stopPropagation();
    this.timelineMonthClick.emit(month);
  }

  onTimelineMonthSpace(month: Date, event: Event): void {
    event.preventDefault();
    this.timelineMonthClick.emit(month);
  }
}
