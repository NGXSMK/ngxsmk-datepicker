import {
  Component,
  Input,
  TemplateRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ElementRef,
  input,
  viewChild,
  output,
} from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { CalendarHeaderComponent } from './calendar-header.component';
import { CalendarMonthViewComponent } from './calendar-month-view.component';
import { CalendarYearViewComponent } from './calendar-year-view.component';
import { TimeSelectionComponent } from './time-selection.component';
import { NgxsmkDatepickerPresetsComponent } from './datepicker-presets.component';
import { CustomSelectComponent } from './custom-select.component';
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
    CustomSelectComponent,
  ],
  template: `
    @if (isCalendarVisible()) {
      @if (!isInlineMode() && isCalendarOpen()) {
        <div
          class="ngxsmk-backdrop"
          [class.ngxsmk-backdrop-allow-modal-scroll]="shouldAppendToBody()"
          [class.dark-theme]="theme() === 'dark'"
          role="button"
          tabindex="0"
          [attr.aria-label]="translations()?.closeCalendarOverlay ?? ''"
          (click)="backdropClick.emit($event)"
          (keydown.enter)="backdropClick.emit($event)"
          (keydown.space)="backdropClick.emit($event)"
        ></div>
      }
      <div
        #popoverContainer
        [id]="popoverId()"
        class="ngxsmk-popover-container"
        [class.dark-theme]="theme() === 'dark'"
        [class.ngxsmk-inline-container]="isInlineMode()"
        [class.ngxsmk-popover-open]="isCalendarOpen() && !isInlineMode()"
        [class.ngxsmk-time-only-popover]="timeOnly()"
        [class.ngxsmk-has-time-selection]="showTime() || timeOnly()"
        [class.ngxsmk-bottom-sheet]="isMobile() && mobileModalStyle() === 'bottom-sheet' && !isInlineMode()"
        [class.ngxsmk-fullscreen]="isMobile() && mobileModalStyle() === 'fullscreen' && !isInlineMode()"
        [class.ngxsmk-align-left]="align() === 'left'"
        [class.ngxsmk-align-right]="align() === 'right'"
        [class.ngxsmk-align-center]="align() === 'center'"
        [ngClass]="classes()?.popover"
        role="dialog"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-modal]="!isInlineMode()"
        (touchstart)="touchStartContainer.emit($event)"
        (touchmove)="touchMoveContainer.emit($event)"
        (touchend)="touchEndContainer.emit($event)"
        (mousedown)="$event.stopPropagation()"
        (keydown.escape)="onPopoverEscape($event)"
      >
        <div class="ngxsmk-datepicker-container" [ngClass]="classes()?.container">
          @if (isCalendarOpening()) {
            <div class="ngxsmk-calendar-loading" role="status" aria-live="polite" [attr.aria-label]="loadingMessage()">
              <div class="ngxsmk-calendar-loading-spinner"></div>
              <span class="ngxsmk-calendar-loading-text">{{ loadingMessage() }}</span>
            </div>
          }
          @if (showRanges() && rangesArray.length > 0 && mode() === 'range' && !timeOnly()) {
            <ngxsmk-datepicker-presets
              [ranges]="rangesArray"
              [selectedRange]="selectedRange()"
              [disabled]="disabled()"
              [classes]="classes()"
              (rangeSelected)="rangeSelect.emit($event)"
            ></ngxsmk-datepicker-presets>
          }

          <div
            class="ngxsmk-calendar-container"
            [class.ngxsmk-time-only-mode]="timeOnly()"
            [class.ngxsmk-has-multi-calendar]="calendarCount() > 1"
            [class.ngxsmk-calendar-layout-horizontal]="calendarCount() > 1 && calendarLayout() === 'horizontal'"
            [class.ngxsmk-calendar-layout-vertical]="calendarCount() > 1 && calendarLayout() === 'vertical'"
            [class.ngxsmk-calendar-layout-auto]="calendarCount() > 1 && calendarLayout() === 'auto'"
            [ngClass]="classes()?.calendar"
          >
            @if (!timeOnly()) {
              @if (calendarViewMode() === 'month') {
                <ngxsmk-calendar-header
                  [headerClass]="classes()?.header ?? ''"
                  [navPrevClass]="classes()?.navPrev ?? ''"
                  [navNextClass]="classes()?.navNext ?? ''"
                  [monthOptions]="monthOptions()"
                  [currentMonth]="currentMonth()"
                  [yearOptions]="yearOptions()"
                  [currentYear]="currentYear()"
                  [disabled]="disabled()"
                  [isBackArrowDisabled]="isBackArrowDisabled()"
                  [prevMonthAriaLabel]="prevMonthAriaLabel()"
                  [nextMonthAriaLabel]="nextMonthAriaLabel()"
                  (previousMonth)="previousMonth.emit()"
                  (nextMonth)="nextMonth.emit()"
                  (currentMonthChange)="currentMonthChange.emit($event)"
                  (currentYearChange)="currentYearChange.emit($event)"
                >
                </ngxsmk-calendar-header>
                <div
                  class="ngxsmk-multi-calendar-container"
                  [class.ngxsmk-multi-calendar]="calendarCount() > 1"
                  [class.ngxsmk-calendar-horizontal]="calendarCount() > 1 && calendarLayout() === 'horizontal'"
                  [class.ngxsmk-calendar-vertical]="calendarCount() > 1 && calendarLayout() === 'vertical'"
                  [class.ngxsmk-calendar-auto]="calendarCount() > 1 && calendarLayout() === 'auto'"
                  [class.ngxsmk-sync-scroll-enabled]="syncScrollEnabled() && calendarCount() > 1"
                >
                  @for (calendarMonth of calendarMonths(); track calendarMonth.month + '-' + calendarMonth.year) {
                    <div class="ngxsmk-calendar-month" [class.ngxsmk-calendar-month-multi]="calendarCount() > 1">
                      @if (calendarCount() > 1) {
                        <div class="ngxsmk-calendar-month-header">
                          <span class="ngxsmk-calendar-month-title">{{
                            getMonthYearLabel()(calendarMonth.month, calendarMonth.year)
                          }}</span>
                        </div>
                      }
                      <ngxsmk-calendar-month-view
                        [days]="calendarMonth.days"
                        [weekDays]="weekDays()"
                        [classes]="classes()"
                        [mode]="mode()"
                        [selectedDate]="selectedDate()"
                        [startDate]="startDate()"
                        [endDate]="endDate()"
                        [focusedDate]="focusedDate()"
                        [today]="today()"
                        [currentMonth]="calendarMonth.month"
                        [currentYear]="calendarMonth.year"
                        [ariaLabel]="getCalendarAriaLabelForMonth()(calendarMonth.month, calendarMonth.year)"
                        [dateTemplate]="dateTemplate()"
                        [isDateDisabled]="boundIsDateDisabled()"
                        [isSameDay]="boundIsSameDay()"
                        [isHoliday]="boundIsHoliday()"
                        [isMultipleSelected]="boundIsMultipleSelected()"
                        [isInRange]="boundIsInRange()"
                        [isPreviewInRange]="boundIsPreviewInRange()"
                        [getAriaLabel]="boundGetAriaLabel()"
                        [getDayCellCustomClasses]="boundGetDayCellCustomClasses()"
                        [getDayCellTooltip]="boundGetDayCellTooltip()"
                        [formatDayNumber]="boundFormatDayNumber()"
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

              @if (calendarViewMode() === 'year') {
                <ngxsmk-calendar-year-view
                  viewMode="year"
                  [yearGrid]="yearGrid()"
                  [currentYear]="currentYear()"
                  [currentDecade]="currentDecade()"
                  [today]="today()"
                  [disabled]="disabled()"
                  [headerClass]="classes()?.header ?? ''"
                  [navPrevClass]="classes()?.navPrev ?? ''"
                  [navNextClass]="classes()?.navNext ?? ''"
                  [previousYearsLabel]="translations()?.previousYears ?? ''"
                  [nextYearsLabel]="translations()?.nextYears ?? ''"
                  (viewModeChange)="viewModeChange.emit($event)"
                  (changeYear)="changeYear.emit($event)"
                  (yearClick)="yearClick.emit($event)"
                >
                </ngxsmk-calendar-year-view>
              }

              @if (calendarViewMode() === 'decade') {
                <ngxsmk-calendar-year-view
                  viewMode="decade"
                  [decadeGrid]="decadeGrid()"
                  [currentDecade]="currentDecade()"
                  [disabled]="disabled()"
                  [headerClass]="classes()?.header ?? ''"
                  [navPrevClass]="classes()?.navPrev ?? ''"
                  [navNextClass]="classes()?.navNext ?? ''"
                  [previousDecadeLabel]="translations()?.previousDecade ?? ''"
                  [nextDecadeLabel]="translations()?.nextDecade ?? ''"
                  (changeDecade)="changeDecade.emit($event)"
                  (decadeClick)="decadeClick.emit($event)"
                >
                </ngxsmk-calendar-year-view>
              }

              @if (calendarViewMode() === 'timeline' && mode() === 'range') {
                <div class="ngxsmk-timeline-view">
                  <div class="ngxsmk-timeline-header">
                    <div class="ngxsmk-timeline-controls">
                      <button
                        type="button"
                        class="ngxsmk-timeline-zoom-out"
                        (click)="timelineZoomOut.emit()"
                        [disabled]="disabled()"
                      >
                        -
                      </button>
                      <span class="ngxsmk-timeline-range"
                        >{{ timelineStartDate() | date: 'shortDate' }} -
                        {{ timelineEndDate() | date: 'shortDate' }}</span
                      >
                      <button
                        type="button"
                        class="ngxsmk-timeline-zoom-in"
                        (click)="timelineZoomIn.emit()"
                        [disabled]="disabled()"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div class="ngxsmk-timeline-container" #timelineContainer>
                    <div class="ngxsmk-timeline-track">
                      @for (month of timelineMonths(); track month.getTime()) {
                        <div
                          class="ngxsmk-timeline-month"
                          [class.selected]="isTimelineMonthSelected()(month)"
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

              @if (calendarViewMode() === 'time-slider' && mode() === 'range' && showTime()) {
                <div class="ngxsmk-time-slider-view">
                  <div class="ngxsmk-time-slider-header">
                    <div class="ngxsmk-time-slider-label">
                      {{ translations()?.startTime ?? '' }}
                    </div>
                    <div class="ngxsmk-time-slider-value">
                      {{ formatTimeSliderValue()(startTimeSlider()) }}
                    </div>
                  </div>
                  <div class="ngxsmk-time-slider-container">
                    <input
                      #startTimeInput
                      type="range"
                      class="ngxsmk-time-slider"
                      [min]="0"
                      [max]="1440"
                      [step]="minuteInterval()"
                      [value]="startTimeSlider()"
                      (input)="startTimeSliderChange.emit(+startTimeInput.value)"
                      [disabled]="disabled()"
                    />
                  </div>
                  <div class="ngxsmk-time-slider-header">
                    <div class="ngxsmk-time-slider-label">
                      {{ translations()?.endTime ?? '' }}
                    </div>
                    <div class="ngxsmk-time-slider-value">
                      {{ formatTimeSliderValue()(endTimeSlider()) }}
                    </div>
                  </div>
                  <div class="ngxsmk-time-slider-container">
                    <input
                      #endTimeInput
                      type="range"
                      class="ngxsmk-time-slider"
                      [min]="0"
                      [max]="1440"
                      [step]="minuteInterval()"
                      [value]="endTimeSlider()"
                      (input)="endTimeSliderChange.emit(+endTimeInput.value)"
                      [disabled]="disabled()"
                    />
                  </div>
                </div>
              }
            }

            @if (showTime() || timeOnly()) {
              @if (!timeRangeMode()) {
                <ngxsmk-time-selection
                  [hourOptions]="hourOptions()"
                  [minuteOptions]="minuteOptions()"
                  [secondOptions]="secondOptions()"
                  [ampmOptions]="ampmOptions()"
                  [currentDisplayHour]="currentDisplayHour()"
                  [currentMinute]="currentMinute()"
                  [currentSecond]="currentSecond()"
                  [isPm]="isPm()"
                  [showSeconds]="showSeconds()"
                  [disabled]="disabled()"
                  [timeLabel]="translations()?.time ?? ''"
                  [showAmpm]="!use24Hour()"
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
                    <span class="ngxsmk-time-range-label">{{ translations()?.from ?? '' }}</span>
                    <ngxsmk-time-selection
                      [hourOptions]="hourOptions()"
                      [minuteOptions]="minuteOptions()"
                      [secondOptions]="secondOptions()"
                      [ampmOptions]="ampmOptions()"
                      [currentDisplayHour]="startDisplayHour()"
                      [currentMinute]="startMinute()"
                      [currentSecond]="startSecond()"
                      [isPm]="startIsPm()"
                      [showSeconds]="showSeconds()"
                      [disabled]="disabled()"
                      timeLabel=""
                      [showAmpm]="!use24Hour()"
                      (currentDisplayHourChange)="startDisplayHourChange.emit($event)"
                      (currentMinuteChange)="startMinuteChange.emit($event)"
                      (currentSecondChange)="startSecondChange.emit($event)"
                      (isPmChange)="startIsPmChange.emit($event)"
                      (timeChange)="timeRangeChange.emit()"
                    >
                    </ngxsmk-time-selection>
                  </div>
                  <div class="ngxsmk-time-range-end">
                    <span class="ngxsmk-time-range-label">{{ translations()?.to ?? '' }}</span>
                    <ngxsmk-time-selection
                      [hourOptions]="hourOptions()"
                      [minuteOptions]="minuteOptions()"
                      [secondOptions]="secondOptions()"
                      [ampmOptions]="ampmOptions()"
                      [currentDisplayHour]="endDisplayHour()"
                      [currentMinute]="endMinute()"
                      [currentSecond]="endSecond()"
                      [isPm]="endIsPm()"
                      [showSeconds]="showSeconds()"
                      [disabled]="disabled()"
                      timeLabel=""
                      [showAmpm]="!use24Hour()"
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

            @if (showTimezoneSelector()) {
              <div class="ngxsmk-timezone-selection">
                <span class="ngxsmk-timezone-label">{{ translations()?.timezone || 'Timezone' }}:</span>
                <ngxsmk-custom-select
                  [options]="timezoneOptions()"
                  [value]="currentTimezone()"
                  [disabled]="disabled()"
                  (valueChange)="onTimezoneChange($event)"
                ></ngxsmk-custom-select>
              </div>
            }

            @if (!isInlineMode()) {
              <div class="ngxsmk-footer" [ngClass]="classes()?.footer">
                <button
                  type="button"
                  class="ngxsmk-clear-button-footer"
                  (click)="clearValue.emit($event)"
                  [disabled]="disabled()"
                  [attr.aria-label]="clearAriaLabel()"
                  [ngClass]="classes()?.clearBtn"
                >
                  {{ clearLabel() }}
                </button>
                <button
                  type="button"
                  class="ngxsmk-close-button"
                  (click)="closeCalendar.emit()"
                  [disabled]="disabled()"
                  [attr.aria-label]="closeAriaLabel()"
                  [ngClass]="classes()?.closeBtn"
                >
                  {{ closeLabel() }}
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
  readonly isCalendarVisible = input<boolean>(false);
  readonly isCalendarOpen = input<boolean>(false);
  readonly isInlineMode = input<boolean>(false);
  readonly shouldAppendToBody = input<boolean>(false);
  readonly theme = input<string>('light');
  readonly popoverId = input<string>('');
  readonly classes = input<DatepickerClasses>();
  readonly timeOnly = input<boolean>(false);
  readonly showTime = input<boolean>(false);
  readonly isMobile = input<boolean>(false);
  readonly mobileModalStyle = input<string>('bottom-sheet');
  readonly align = input<string>('left');
  readonly ariaLabel = input<string>('');
  readonly isCalendarOpening = input<boolean>(false);
  readonly loadingMessage = input<string>('');
  readonly showRanges = input<boolean>(true);
  @Input() rangesArray: { key: string; value: [Date, Date] }[] = [];
  readonly mode = input<'single' | 'range' | 'multiple' | 'week' | 'month' | 'quarter' | 'year' | 'timeRange'>(
    'single'
  );
  readonly disabled = input<boolean>(false);
  readonly calendarCount = input<number>(1);
  readonly calendarLayout = input<string>('auto');
  readonly syncScrollEnabled = input<boolean>(false);
  readonly calendarMonths = input<
    {
      month: number;
      year: number;
      days: (Date | null)[];
    }[]
  >([]);
  readonly weekDays = input<string[]>([]);
  readonly selectedDate = input<Date | null>(null);
  readonly startDate = input<Date | null>(null);
  readonly endDate = input<Date | null>(null);
  readonly focusedDate = input<Date | null>(null);
  readonly today = input<Date>(new Date());
  readonly dateTemplate = input<TemplateRef<unknown> | null>(null);
  readonly calendarViewMode = input<string>('month');
  readonly monthOptions = input<
    {
      label: string;
      value: number;
    }[]
  >([]);
  readonly currentMonth = input<number>(0);
  readonly yearOptions = input<
    {
      label: string;
      value: number;
    }[]
  >([]);
  readonly currentYear = input<number>(new Date().getFullYear());
  readonly isBackArrowDisabled = input<boolean>(false);
  readonly prevMonthAriaLabel = input<string>('');
  readonly nextMonthAriaLabel = input<string>('');
  readonly yearGrid = input<number[]>([]);
  readonly currentDecade = input<number>(0);
  readonly decadeGrid = input<number[]>([]);
  readonly timelineStartDate = input<Date | null>(null);
  readonly timelineEndDate = input<Date | null>(null);
  readonly timelineMonths = input<Date[]>([]);
  readonly minuteInterval = input<number>(1);
  readonly startTimeSlider = input<number>(0);
  readonly endTimeSlider = input<number>(0);
  readonly timeRangeMode = input<boolean>(false);
  readonly hourOptions = input<
    {
      label: string;
      value: number;
    }[]
  >([]);
  readonly minuteOptions = input<
    {
      label: string;
      value: number;
    }[]
  >([]);
  readonly secondOptions = input<
    {
      label: string;
      value: number;
    }[]
  >([]);
  readonly ampmOptions = input<
    {
      label: string;
      value: boolean;
    }[]
  >([]);
  readonly currentDisplayHour = input<number>(12);
  readonly currentMinute = input<number>(0);
  readonly currentSecond = input<number>(0);
  readonly isPm = input<boolean>(false);
  readonly showSeconds = input<boolean>(false);
  readonly use24Hour = input<boolean>(false);
  readonly startDisplayHour = input<number>(12);
  readonly startMinute = input<number>(0);
  readonly startSecond = input<number>(0);
  readonly startIsPm = input<boolean>(false);
  readonly endDisplayHour = input<number>(12);
  readonly endMinute = input<number>(0);
  readonly endSecond = input<number>(0);
  readonly endIsPm = input<boolean>(false);
  readonly clearAriaLabel = input<string>('');
  readonly clearLabel = input<string>('');
  readonly closeAriaLabel = input<string>('');
  readonly closeLabel = input<string>('');
  readonly translations = input<DatepickerTranslations | null>(null);
  readonly selectedRange = input<[Date | null, Date | null] | null>(null);
  readonly showTimezoneSelector = input<boolean>(false);
  readonly timezoneOptions = input<
    {
      label: string;
      value: string;
    }[]
  >([]);
  readonly currentTimezone = input<string>('UTC');

  readonly timezoneChange = output<string>();

  // Bound functions
  readonly boundIsDateDisabled = input.required<(date: Date | null) => boolean>();
  readonly boundIsSameDay = input.required<(date1: Date | null, date2: Date | null) => boolean>();
  readonly boundIsHoliday = input.required<(date: Date | null) => boolean>();
  readonly boundIsMultipleSelected = input.required<(date: Date | null) => boolean>();
  readonly boundIsInRange = input.required<(date: Date | null) => boolean>();
  readonly boundIsPreviewInRange = input.required<(date: Date | null) => boolean>();
  readonly boundGetAriaLabel = input.required<(date: Date | null) => string>();
  readonly boundGetDayCellCustomClasses = input.required<
    (date: Date | null) =>
      | string
      | string[]
      | Set<string>
      | {
          [klass: string]: unknown;
        }
  >();
  readonly boundGetDayCellTooltip = input.required<(date: Date | null) => string | null>();
  readonly boundFormatDayNumber = input.required<(date: Date | null) => string>();
  readonly getMonthYearLabel = input.required<(month: number, year: number) => string>();
  readonly getCalendarAriaLabelForMonth = input.required<(month: number, year: number) => string>();
  readonly isTimelineMonthSelected = input.required<(date: Date) => boolean>();
  readonly formatTimeSliderValue = input.required<(value: number) => string>();

  readonly backdropClick = output<Event>();
  readonly touchStartContainer = output<TouchEvent>();
  readonly touchMoveContainer = output<TouchEvent>();
  readonly touchEndContainer = output<TouchEvent>();
  readonly rangeSelect = output<[Date, Date]>();
  readonly previousMonth = output<void>();
  readonly nextMonth = output<void>();
  readonly currentMonthChange = output<number>();
  readonly currentYearChange = output<number>();
  readonly dateClick = output<Date>();
  readonly dateHover = output<Date | null>();
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
  readonly viewModeChange = output<'month' | 'year' | 'decade' | 'timeline' | 'time-slider'>();
  readonly changeYear = output<number>();
  readonly yearClick = output<number>();
  readonly changeDecade = output<number>();
  readonly decadeClick = output<number>();
  readonly timelineZoomOut = output<void>();
  readonly timelineZoomIn = output<void>();
  readonly timelineMonthClick = output<Date>();
  readonly startTimeSliderChange = output<number>();
  readonly endTimeSliderChange = output<number>();
  readonly currentDisplayHourChange = output<number>();
  readonly currentMinuteChange = output<number>();
  readonly currentSecondChange = output<number>();
  readonly isPmChange = output<boolean>();
  readonly timeChange = output<void>();
  readonly startDisplayHourChange = output<number>();
  readonly startMinuteChange = output<number>();
  readonly startSecondChange = output<number>();
  readonly startIsPmChange = output<boolean>();
  readonly endDisplayHourChange = output<number>();
  readonly endMinuteChange = output<number>();
  readonly endSecondChange = output<number>();
  readonly endIsPmChange = output<boolean>();
  readonly timeRangeChange = output<void>();
  readonly clearValue = output<MouseEvent>();
  readonly closeCalendar = output<void>();
  readonly escapeKey = output<Event>();

  readonly header = viewChild(CalendarHeaderComponent);
  readonly popoverContainer = viewChild<ElementRef<HTMLElement>>('popoverContainer');
  readonly timelineContainer = viewChild<ElementRef<HTMLElement>>('timelineContainer');

  closeAllSelects(): void {
    const header = this.header();
    if (header) {
      const monthSelect = header.monthSelect();
      if (monthSelect) {
        monthSelect.isOpen = false;
      }
      const yearSelect = header.yearSelect();
      if (yearSelect) {
        yearSelect.isOpen = false;
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

  onPopoverEscape(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.escapeKey.emit(event);
    if (!this.isInlineMode()) {
      this.closeCalendar.emit();
    }
  }

  onTimezoneChange(val: unknown): void {
    if (typeof val === 'string') {
      this.timezoneChange.emit(val);
    }
  }
}
