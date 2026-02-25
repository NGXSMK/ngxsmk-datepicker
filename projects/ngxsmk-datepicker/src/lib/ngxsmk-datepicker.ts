import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
  PLATFORM_ID,
  EffectRef,
  effect,
  AfterViewInit,
  signal,
  computed,
  ViewChild,
  isDevMode,
  ApplicationRef,
  EmbeddedViewRef,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  isPlatformBrowser,
  NgClass,
  NgTemplateOutlet,
  DatePipe,
  DOCUMENT,
} from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import {
  getStartOfDay,
  getEndOfDay,
  addMonths,
  normalizeDate,
  DateInput,
  getStartOfWeek,
  getEndOfWeek,
} from './utils/date.utils';
import { formatDateWithTimezone } from './utils/timezone.utils';
import { generateRecurringDates } from './utils/recurring-dates.utils';
import {
  HolidayProvider,
  DateRange,
  DatepickerValue,
  generateMonthOptions,
  generateYearOptions,
  generateTimeOptions,
  generateWeekDays,
  getFirstDayOfWeek,
  get24Hour,
  update12HourState,
  processDateRanges,
} from './utils/calendar.utils';
import { NgxsmkDatepickerInputComponent } from './components/datepicker-input.component';
import { NgxsmkDatepickerContentComponent } from './components/datepicker-content.component';
import { createDateComparator } from './utils/performance.utils';
import {
  DatepickerHooks,
  KeyboardShortcutContext,
} from './interfaces/datepicker-hooks.interface';
import {
  DATEPICKER_CONFIG,
  DatepickerConfig,
  DEFAULT_ANIMATION_CONFIG,
  AnimationConfig,
} from './config/datepicker.config';
import { FieldSyncService, SignalFormField } from './services/field-sync.service';
import { LocaleRegistryService } from './services/locale-registry.service';
import { TranslationRegistryService } from './services/translation-registry.service';
import { TranslationService } from './services/translation.service';
import {
  DatepickerTranslations,
  PartialDatepickerTranslations,
} from './interfaces/datepicker-translations.interface';
import { FocusTrapService } from './services/focus-trap.service';
import { AriaLiveService } from './services/aria-live.service';
import { HapticFeedbackService } from './services/haptic-feedback.service';
import { CalendarGenerationService } from './services/calendar-generation.service';
import { DatepickerParsingService } from './services/datepicker-parsing.service';
import {
  TouchGestureHandlerService,
  TouchGestureState,
} from './services/touch-gesture-handler.service';
import { PopoverPositioningService } from './services/popover-positioning.service';
import { CustomDateFormatService } from './services/custom-date-format.service';
import { Subject } from 'rxjs';
import { DatepickerClasses } from './interfaces/datepicker-classes.interface';

/** Recurring date pattern configuration for disabled dates. */
export type RecurringPatternInput = {
  pattern:
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'weekdays'
  | 'weekends';
  startDate: Date;
  endDate?: Date;
  dayOfWeek?: number;
  dayOfMonth?: number;
  interval?: number;
} | null;

/**
 * Interface for Angular Material Form Field Control compatibility.
 * We define it here to avoid a direct dependency on @angular/material.
 */
interface MatFormFieldControlMock<T> {
  value: T | null;
  stateChanges: Subject<void>;
  id: string;
  placeholder: string;
  ngControl: NgControl | null;
  focused: boolean;
  empty: boolean;
  shouldLabelFloat: boolean;
  required: boolean;
  disabled: boolean;
  errorState: boolean;
  controlType?: string;
  autofilled?: boolean;
  userAriaDescribedBy?: string;
  setDescribedByIds(ids: string[]): void;
  onContainerClick(event: MouseEvent): void;
}

@Component({
  selector: 'ngxsmk-datepicker',
  standalone: true,
  imports: [
    NgClass,
    NgTemplateOutlet,
    NgxsmkDatepickerInputComponent,
    NgxsmkDatepickerContentComponent,
  ],
  providers: [
    FieldSyncService,
    CalendarGenerationService,
    DatepickerParsingService,
    TouchGestureHandlerService,
    PopoverPositioningService,
    DatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './styles/variables.css',
    './styles/datepicker.css',
    './styles/keyboard-help.css',
  ],
  host: {
    '[class.ngxsmk-inline]': 'isInlineMode',
  },
  template: `
    <div
      class="ngxsmk-datepicker-wrapper"
      [class.ngxsmk-inline-mode]="isInlineMode"
      [class.ngxsmk-calendar-open]="isCalendarOpen && !isInlineMode"
      [class.ngxsmk-append-to-body]="_shouldAppendToBody"
      [class.ngxsmk-rtl]="isRtl"
      [class.ngxsmk-native-picker]="shouldUseNativePicker()"
      [ngClass]="classes?.wrapper"
    >
      @if (!isInlineMode) {
        <ngxsmk-datepicker-input
          #datepickerInput
          [isNative]="shouldUseNativePicker()"
          [disabled]="disabled"
          [classes]="classes"
          [nativeInputType]="getNativeInputType()"
          [formattedValue]="formatValueForNativeInput(value)"
          [placeholder]="placeholder"
          [id]="inputId || _uniqueId"
          [name]="name"
          [autocomplete]="autocomplete"
          [required]="required"
          [minDateNative]="getMinDateForNativeInput()"
          [maxDateNative]="getMaxDateForNativeInput()"
          [ariaLabel]="placeholder || getTranslation(timeOnly ? 'selectTime' : 'selectDate')"
          [ariaDescribedBy]="'datepicker-help-' + _uniqueId"
          [errorState]="errorState"
          [clearAriaLabel]="_clearAriaLabel"
          [clearLabel]="_clearLabel"
          [isCalendarOpen]="isCalendarOpen"
          [allowTyping]="allowTyping"
          [typedInputValue]="typedInputValue"
          [displayValue]="displayValue"
          [showCalendarButton]="showCalendarButton"
          [calendarAriaLabel]="getTranslation(timeOnly ? 'selectTime' : 'selectDate')"
          [validationErrorMessage]="validationErrorMessage"
          (nativeInputChange)="onNativeInputChange($event)"
          (inputBlur)="onInputBlur($event)"
          (clearValue)="clearValue($event)"
          (toggleCalendar)="toggleCalendar($event)"
          (pointerDown)="onPointerDown($event)"
          (pointerUp)="onPointerUp($event)"
          (inputGroupFocus)="onInputGroupFocus()"
          (inputKeyDown)="onInputKeyDown($event)"
          (inputChange)="onInputChange($event)"
          (inputFocus)="onInputFocus($event)"
        ></ngxsmk-datepicker-input>
      }

      <ng-template #portalContent>
        <ngxsmk-datepicker-content
          #datepickerContent
          [isCalendarVisible]="isCalendarVisible"
          [isCalendarOpen]="isCalendarOpen"
          [isInlineMode]="isInlineMode"
          [shouldAppendToBody]="_shouldAppendToBody"
          [theme]="theme"
          [popoverId]="popoverId"
          [classes]="classes"
          [timeOnly]="timeOnly"
          [showTime]="showTime"
          [isMobile]="isMobileDevice()"
          [mobileModalStyle]="mobileModalStyle"
          [align]="align"
          [ariaLabel]="getCalendarAriaLabel()"
          [isCalendarOpening]="isCalendarOpening"
          [loadingMessage]="getCalendarLoadingMessage()"
          [showRanges]="showRanges"
          [rangesArray]="rangesArray"
          [mode]="mode"
          [disabled]="disabled"
          [calendarCount]="calendarCount"
          [calendarLayout]="calendarLayout"
          [syncScrollEnabled]="syncScroll.enabled ?? false"
          [calendarMonths]="renderedCalendars()"
          [weekDays]="weekDays"
          [selectedDate]="selectedDate"
          [startDate]="startDate"
          [endDate]="endDate"
          [focusedDate]="focusedDate"
          [today]="today"
          [dateTemplate]="dateTemplate"
          [calendarViewMode]="calendarViewMode"
          [monthOptions]="monthOptions()"
          [currentMonth]="currentMonth"
          [yearOptions]="yearOptions()"
          [currentYear]="currentYear"
          [isBackArrowDisabled]="isBackArrowDisabled"
          [prevMonthAriaLabel]="_prevMonthAriaLabel"
          [nextMonthAriaLabel]="_nextMonthAriaLabel"
          [yearGrid]="yearGrid"
          [currentDecade]="_currentDecade"
          [decadeGrid]="decadeGrid"
          [timelineStartDate]="timelineStartDate"
          [timelineEndDate]="timelineEndDate"
          [timelineMonths]="timelineMonths"
          [minuteInterval]="minuteInterval"
          [startTimeSlider]="startTimeSlider"
          [endTimeSlider]="endTimeSlider"
          [timeRangeMode]="timeRangeMode"
          [hourOptions]="hourOptions"
          [minuteOptions]="minuteOptions"
          [secondOptions]="secondOptions"
          [ampmOptions]="ampmOptions"
          [currentDisplayHour]="currentDisplayHour"
          [currentMinute]="currentMinute"
          [currentSecond]="currentSecond"
          [isPm]="isPm"
          [showSeconds]="showSeconds"
          [use24Hour]="use24Hour"
          [startDisplayHour]="startDisplayHour"
          [startMinute]="startMinute"
          [startSecond]="startSecond"
          [startIsPm]="startIsPm"
          [endDisplayHour]="endDisplayHour"
          [endMinute]="endMinute"
          [endSecond]="endSecond"
          [endIsPm]="endIsPm"
          [clearAriaLabel]="_clearAriaLabel"
          [clearLabel]="_clearLabel"
          [closeAriaLabel]="_closeAriaLabel"
          [closeLabel]="_closeLabel"
          [translations]="_translations"
          [boundIsDateDisabled]="boundIsDateDisabled"
          [boundIsSameDay]="boundIsSameDay"
          [boundIsHoliday]="boundIsHoliday"
          [boundIsMultipleSelected]="boundIsMultipleSelected"
          [boundIsInRange]="boundIsInRange"
          [boundIsPreviewInRange]="boundIsPreviewInRange"
          [boundGetAriaLabel]="boundGetAriaLabel"
          [boundGetDayCellCustomClasses]="boundGetDayCellCustomClasses"
          [boundGetDayCellTooltip]="boundGetDayCellTooltip"
          [boundFormatDayNumber]="boundFormatDayNumber"
          [getMonthYearLabel]="boundGetMonthYearLabel"
          [getCalendarAriaLabelForMonth]="boundGetCalendarAriaLabelForMonth"
          [isTimelineMonthSelected]="boundIsTimelineMonthSelected"
          [formatTimeSliderValue]="boundFormatTimeSliderValue"
          (backdropClick)="onBackdropInteract($event)"
          (touchStartContainer)="onBottomSheetTouchStart($event)"
          (touchMoveContainer)="onBottomSheetTouchMove($event)"
          (touchEndContainer)="onBottomSheetTouchEnd($event)"
          (rangeSelect)="selectRange($event)"
          (previousMonth)="changeMonth(-1)"
          (nextMonth)="changeMonth(1)"
          (currentMonthChange)="currentMonth = $event"
          (currentYearChange)="onYearSelectChange($event)"
          (dateClick)="onDateClick($event)"
          (dateHover)="onDateHover($event)"
          (dateFocus)="onDateFocus($event)"
          (swipeStart)="onCalendarSwipeStart($event)"
          (swipeMove)="onCalendarSwipeMove($event)"
          (swipeEnd)="onCalendarSwipeEnd($event)"
          (touchStart)="onDateCellTouchStart($event.event, $event.day)"
          (touchMove)="onDateCellTouchMove($event)"
          (touchEnd)="onDateCellTouchEnd($event.event, $event.day)"
          (viewModeChange)="calendarViewMode = $event"
          (changeYear)="changeYear($event)"
          (yearClick)="onYearClick($event)"
          (changeDecade)="changeDecade($event)"
          (decadeClick)="onDecadeClick($event)"
          (timelineZoomOut)="timelineZoomOut()"
          (timelineZoomIn)="timelineZoomIn()"
          (timelineMonthClick)="onTimelineMonthClick($event)"
          (startTimeSliderChange)="onStartTimeSliderChange($event)"
          (endTimeSliderChange)="onEndTimeSliderChange($event)"
          (currentDisplayHourChange)="currentDisplayHour = $event"
          (currentMinuteChange)="currentMinute = $event"
          (currentSecondChange)="currentSecond = $event"
          (isPmChange)="isPm = $event"
          (timeChange)="timeChange()"
          (startDisplayHourChange)="startDisplayHour = $event"
          (startMinuteChange)="startMinute = $event"
          (startSecondChange)="startSecond = $event"
          (startIsPmChange)="startIsPm = $event"
          (endDisplayHourChange)="endDisplayHour = $event"
          (endMinuteChange)="endMinute = $event"
          (endSecondChange)="endSecond = $event"
          (endIsPmChange)="endIsPm = $event"
          (timeRangeChange)="timeRangeChange()"
          (clearValue)="clearValue($event)"
          (closeCalendar)="closeCalendarWithFocusRestore()"
        ></ngxsmk-datepicker-content>
      </ng-template>

      @if (isCalendarVisible && !_shouldAppendToBody) {
        <ng-container *ngTemplateOutlet="portalContent"></ng-container>
      }
      @if (isKeyboardHelpOpen) {
        <div
          class="ngxsmk-keyboard-help-backdrop"
          (click)="toggleKeyboardHelp()"
          (keydown.enter)="toggleKeyboardHelp()"
          (keydown.space)="toggleKeyboardHelp()"
          tabindex="0"
          role="button"
          [attr.aria-label]="getTranslation('closeCalendarOverlay')"
        ></div>
        <div
          class="ngxsmk-keyboard-help-dialog"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="getTranslation('keyboardShortcuts')"
        >
          <div class="ngxsmk-keyboard-help-header">
            <h3 class="ngxsmk-keyboard-help-title">
              {{ getTranslation('keyboardShortcuts') }}
            </h3>
            <button
              type="button"
              class="ngxsmk-keyboard-help-close"
              (click)="toggleKeyboardHelp()"
              [attr.aria-label]="getTranslation('close')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <ul class="ngxsmk-keyboard-help-list">
            <li class="ngxsmk-keyboard-help-item">
              <span>Next/Prev day</span>
              <div>
                <span class="ngxsmk-keyboard-key">←</span>
                <span class="ngxsmk-keyboard-key">→</span>
              </div>
            </li>
            <li class="ngxsmk-keyboard-help-item">
              <span>Next/Prev week</span>
              <div>
                <span class="ngxsmk-keyboard-key">↑</span>
                <span class="ngxsmk-keyboard-key">↓</span>
              </div>
            </li>
            <li class="ngxsmk-keyboard-help-item">
              <span>Select date</span>
              <div>
                <span class="ngxsmk-keyboard-key">Enter</span>
                <span class="ngxsmk-keyboard-key">Space</span>
              </div>
            </li>
            <li class="ngxsmk-keyboard-help-item">
              <span>Next/Prev month</span>
              <div>
                <span class="ngxsmk-keyboard-key">PgUp</span>
                <span class="ngxsmk-keyboard-key">PgDn</span>
              </div>
            </li>
            <li class="ngxsmk-keyboard-help-item">
              <span>Next/Prev year</span>
              <div>
                <span class="ngxsmk-keyboard-key">Shift</span> +
                <span class="ngxsmk-keyboard-key">PgUp/Dn</span>
              </div>
            </li>
            <li class="ngxsmk-keyboard-help-item">
              <span>First/Last day</span>
              <div>
                <span class="ngxsmk-keyboard-key">Home</span>
                <span class="ngxsmk-keyboard-key">End</span>
              </div>
            </li>
            <li class="ngxsmk-keyboard-help-item">
              <span>Close calendar</span>
              <span class="ngxsmk-keyboard-key">Esc</span>
            </li>
            <li class="ngxsmk-keyboard-help-item">
              <span>Today</span>
              <span class="ngxsmk-keyboard-key">T</span>
            </li>
            <li class="ngxsmk-keyboard-help-item">
              <span>Yesterday</span>
              <span class="ngxsmk-keyboard-key">Y</span>
            </li>
            <li class="ngxsmk-keyboard-help-item">
              <span>Tomorrow</span>
              <span class="ngxsmk-keyboard-key">N</span>
            </li>
            <li class="ngxsmk-keyboard-help-item">
              <span>Next Week</span>
              <span class="ngxsmk-keyboard-key">W</span>
            </li>
            <li class="ngxsmk-keyboard-help-item">
              <span>Show shortcuts</span>
              <span class="ngxsmk-keyboard-key">?</span>
            </li>
          </ul>
        </div>
      }
    </div>
  `,
})
/**
 * A comprehensive, production-ready Angular datepicker component with extensive features.
 *
 * @remarks
 * ## Performance Characteristics
 *
 * - **Calendar Generation**: O(1) per month when cached, O(n) for first generation where n = days in month
 * - **Date Validation**: O(n) where n = disabledDates.length + disabledRanges.length
 * - **Range Selection**: O(1) for single date, O(n) for multiple selection where n = selectedDates.length
 * - **Change Detection**: Optimized with OnPush strategy and manual scheduling for zoneless compatibility
 * - **Memory Management**: LRU cache for calendar months (max 24 entries), comprehensive cleanup in ngOnDestroy
 *
 * ## Key Features
 *
 * - Multiple selection modes: single, range, multiple, week, month, quarter, year
 * - Full keyboard navigation and accessibility (WCAG 2.1 AA compliant)
 * - SSR and zoneless Angular compatible
 * - Signal Forms integration (Angular 21+)
 * - Custom date adapters (Native, date-fns, Luxon, Day.js)
 * - Internationalization with RTL support
 * - Time selection with timezone support
 * - Holiday provider system
 * - Custom hooks for extensibility
 * - Mobile-optimized with touch gestures
 *
 * ## Usage Example
 *
 * ```typescript
 * // Basic usage
 * <ngxsmk-datepicker
 *   [(ngModel)]="selectedDate"
 *   [mode]="'single'"
 *   [locale]="'en-US'">
 * </ngxsmk-datepicker>
 *
 * // With Reactive Forms
 * <ngxsmk-datepicker
 *   [formControl]="dateControl"
 *   [minDate]="minDate"
 *   [maxDate]="maxDate">
 * </ngxsmk-datepicker>
 *
 * // With Signal Forms (Angular 21+)
 * <ngxsmk-datepicker
 *   [field]="form.field('date')"
 *   [mode]="'range'">
 * </ngxsmk-datepicker>
 * ```
 *
 * ## Performance Optimization Tips
 *
 * 1. **Large Disabled Date Lists**: For lists >1000 dates, consider using a Set or DateRange tree
 * 2. **Multiple Instances**: The component uses a static registry for efficient instance management
 * 3. **Calendar Caching**: Months are automatically cached (LRU, max 24 entries)
 * 4. **Change Detection**: Uses OnPush strategy - call `markForCheck()` only when needed
 * 5. **Memoization**: Internal memoization optimizes date comparisons and validation
 *
 * ## Memory Management
 *
 * The component implements comprehensive cleanup:
 * - All timeouts and animation frames are tracked and cleared
 * - Event listeners are properly removed
 * - RxJS subscriptions are completed
 * - Effects are destroyed
 * - Cache is invalidated on relevant changes
 *
 * ## Browser Compatibility
 *
 * - Modern browsers (Chrome, Firefox, Safari, Edge)
 * - Mobile browsers (iOS Safari, Chrome Mobile)
 * - SSR compatible (Angular Universal)
 * - Works with and without Zone.js
 *
 * @see {@link DatepickerConfig} for global configuration options
 * @see {@link DatepickerHooks} for extension hooks
 * @see {@link HolidayProvider} for custom holiday support
 */
export class NgxsmkDatepickerComponent
  implements
  OnInit,
  OnChanges,
  OnDestroy,
  AfterViewInit,
  ControlValueAccessor,
  MatFormFieldControlMock<DatepickerValue> {
  private static _idCounter = 0;
  private static _allInstances = new Set<NgxsmkDatepickerComponent>();
  public _uniqueId = `ngxsmk-datepicker-${NgxsmkDatepickerComponent._idCounter++}`;

  @Input() mode:
    | 'single'
    | 'range'
    | 'multiple'
    | 'week'
    | 'month'
    | 'quarter'
    | 'year'
    | 'timeRange' = 'single';
  @Input() calendarViewMode:
    | 'month'
    | 'year'
    | 'decade'
    | 'timeline'
    | 'time-slider' = 'month';
  @Input() isInvalidDate: (date: Date) => boolean = () => false;
  @Input() showRanges: boolean = true;
  @Input() showTime: boolean = false;
  @Input() timeOnly: boolean = false;
  @Input() timeRangeMode: boolean = false;
  @Input() showCalendarButton: boolean = false;
  @Input() minuteInterval: number = 1;
  @Input() use24Hour: boolean = false;
  @Input() secondInterval: number = 1;
  @Input() showSeconds: boolean = false;
  @Input() holidayProvider: HolidayProvider | null = null;
  @Input() disableHolidays: boolean = false;
  @Input() disabledDates: (string | Date)[] = [];
  @Input() disabledRanges: Array<{ start: Date | string; end: Date | string }> =
    [];
  @Input() recurringPattern?: RecurringPatternInput;
  @Input() dateTemplate: TemplateRef<unknown> | null = null;
  private _placeholder: string | null = null;
  @Input() set placeholder(value: string | null) {
    this._placeholder = value;
  }
  get placeholder(): string {
    if (this._placeholder !== null) {
      return this._placeholder;
    }
    return this.getTranslation(this.timeOnly ? 'selectTime' : 'selectDate');
  }
  @Input() inline: boolean | 'always' | 'auto' = false;

  private _inputId: string = '';
  @Input() set inputId(value: string) {
    this._inputId = value;
    this.scheduleChangeDetection();
  }
  get inputId(): string {
    return this._inputId;
  }

  private _name: string = '';
  @Input() set name(value: string) {
    this._name = value;
    this.scheduleChangeDetection();
  }
  get name(): string {
    return this._name;
  }

  private _autocomplete: string = 'off';
  @Input() set autocomplete(value: string) {
    this._autocomplete = value;
    this.scheduleChangeDetection();
  }
  get autocomplete(): string {
    return this._autocomplete;
  }

  @Input() translations?: PartialDatepickerTranslations;
  @Input() translationService?: TranslationService;

  @Input() clearLabel: string = '';
  @Input() closeLabel: string = '';
  @Input() prevMonthAriaLabel: string = '';
  @Input() nextMonthAriaLabel: string = '';
  @Input() clearAriaLabel: string = '';
  @Input() closeAriaLabel: string = '';
  get _clearLabel(): string {
    return this.clearLabel || this.getTranslation('clear');
  }

  get _closeLabel(): string {
    return this.closeLabel || this.getTranslation('close');
  }

  get _prevMonthAriaLabel(): string {
    return this.prevMonthAriaLabel || this.getTranslation('previousMonth');
  }

  get _nextMonthAriaLabel(): string {
    return this.nextMonthAriaLabel || this.getTranslation('nextMonth');
  }

  get _clearAriaLabel(): string {
    return this.clearAriaLabel || this.getTranslation('clearSelection');
  }

  get _closeAriaLabel(): string {
    return this.closeAriaLabel || this.getTranslation('closeCalendar');
  }
  @Input() weekStart: number | null = null;

  private _yearRange = signal<number>(10);
  @Input() set yearRange(value: number) {
    this._yearRange.set(value);
  }
  get yearRange(): number {
    return this._yearRange();
  }
  @Input() timezone?: string;
  @Input() hooks: DatepickerHooks | null = null;
  @Input() enableKeyboardShortcuts: boolean = true;
  @Input() customShortcuts: {
    [key: string]: (context: KeyboardShortcutContext) => boolean;
  } | null = null;
  @Input() autoApplyClose: boolean = false;
  @Input() displayFormat?: string;
  @Input() allowTyping: boolean = false;
  private _calendarCount: number = 1;
  @Input() set calendarCount(value: number) {
    // Clamp calendarCount to valid range (1-12) for performance
    if (value < 1) {
      if (isDevMode()) {
        console.warn(
          `[ngxsmk-datepicker] calendarCount must be at least 1. ` +
          `Received: ${value}. Setting to 1.`,
        );
      }
      this._calendarCount = 1;
    } else if (value > 12) {
      if (isDevMode()) {
        console.warn(
          `[ngxsmk-datepicker] calendarCount should not exceed 12 for performance reasons. ` +
          `Received: ${value}. Setting to 12.`,
        );
      }
      this._calendarCount = 12;
    } else {
      this._calendarCount = value;
    }
  }
  get calendarCount(): number {
    return this._calendarCount;
  }
  @Input() calendarLayout: 'horizontal' | 'vertical' | 'auto' = 'auto';
  @Input() defaultMonthOffset: number = 0;
  /**
   * Configuration for synchronous scrolling in multi-calendar mode.
   * Keeps calendars in sync by enforcing consistent month offsets across visible calendars.
   *
   * @example
   * ```typescript
   * // Keep calendars exactly 1 month apart
   * <ngxsmk-datepicker
   *   [calendarCount]="2"
   *   [syncScroll]="{ enabled: true, monthGap: 1 }">
   * </ngxsmk-datepicker>
   *
   * // Disable sync scroll (independent navigation)
   * <ngxsmk-datepicker
   *   [calendarCount]="3"
   *   [syncScroll]="{ enabled: false }">
   * </ngxsmk-datepicker>
   * ```
   */
  @Input() syncScroll: {
    enabled?: boolean;
    monthGap?: number;
  } = { enabled: false, monthGap: 1 };
  @Input() align: 'left' | 'right' | 'center' = 'left';

  @Input() useNativePicker: boolean = false;
  @Input() enableHapticFeedback: boolean = false;
  @Input() mobileModalStyle: 'bottom-sheet' | 'center' | 'fullscreen' =
    'center';
  @Input() mobileTimePickerStyle: 'wheel' | 'slider' | 'native' = 'slider';
  @Input() enablePullToRefresh: boolean = false;
  @Input() mobileTheme: 'compact' | 'comfortable' | 'spacious' = 'comfortable';
  @Input() enableVoiceInput: boolean = false;
  @Input() autoDetectMobile: boolean = true;
  @Input() disableFocusTrap: boolean = false;
  @Input() appendToBody: boolean = false;

  private appRef = inject(ApplicationRef);
  private document = inject(DOCUMENT);

  @ViewChild('portalContent', { static: true })
  portalTemplate!: TemplateRef<unknown>;
  private portalViewRef: EmbeddedViewRef<unknown> | null = null;

  get _shouldAppendToBody(): boolean {
    if (this.isInlineMode) return false;
    return (
      this.appendToBody ||
      (this.autoDetectMobile && this.isMobileDevice()) ||
      this.isInsideModal()
    );
  }

  /**
   * Detects if the datepicker is rendered inside a modal/dialog so the calendar
   * can be appended to body and positioned above the modal.
   */
  private isInsideModal(): boolean {
    if (!this.isBrowser || !this.elementRef?.nativeElement) {
      return false;
    }
    let el: HTMLElement | null = this.elementRef.nativeElement;
    const modalRoles = new Set(['dialog', 'alertdialog']);
    const modalClassPatterns = [
      'mat-dialog-container',
      'mat-mdc-dialog-container',
      'modal',
      'modal-dialog',
      'modal-content',
      'cdk-dialog-container',
      'p-dialog',
      'mdc-dialog',
      'overlay-container',
    ];
    while (el) {
      const role = el.getAttribute?.('role');
      if (role && modalRoles.has(role)) {
        return true;
      }
      const className = el.className?.toString?.() ?? '';
      if (
        typeof className === 'string' &&
        modalClassPatterns.some((p) => className.includes(p))
      ) {
        return true;
      }
      el = el.parentElement;
    }
    return false;
  }

  private _isCalendarOpen = signal<boolean>(false);
  public get isCalendarOpen(): boolean {
    return this._isCalendarOpen();
  }
  public set isCalendarOpen(value: boolean) {
    if (this._isCalendarOpen() !== value) {
      this._isCalendarOpen.set(value);
      this.stateChanges.next();
    }
    // Signal update handles change detection
  }

  private isOpeningCalendar: boolean = false;
  /** Public getter for template: true while calendar is opening/generating (loading state). */
  get isCalendarOpening(): boolean {
    return this.isOpeningCalendar;
  }
  /** Returns translated "Loading calendar..." for template and ARIA. */
  getCalendarLoadingMessage(): string {
    return (
      this.getTranslation(
        'calendarLoading' as keyof DatepickerTranslations,
      ) || 'Loading calendar...'
    );
  }
  private openCalendarTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private lastToggleTime: number = 0;
  private touchStartTime: number = 0;
  private touchStartElement: EventTarget | null = null;
  private pointerDownTime: number = 0;
  private isPointerEvent: boolean = false;
  private previousFocusElement: HTMLElement | null = null;

  private _value: DatepickerValue = null;

  @Input() set value(val: DatepickerValue) {
    if (!this._field && val !== undefined) {
      const normalizedValue = this._normalizeValue(val);
      if (!this.isValueEqual(normalizedValue, this._value)) {
        this._value = normalizedValue;
        this.initializeValue(normalizedValue);
        this.generateCalendar();
      }
    }
  }
  get value(): DatepickerValue {
    return this._value;
  }

  private _field: SignalFormField = null;
  private _fieldEffectRef: EffectRef | null = null;

  @Input() set field(field: SignalFormField) {
    this.fieldSyncService.cleanup();
    if (this._fieldEffectRef) {
      this._fieldEffectRef.destroy();
      this._fieldEffectRef = null;
    }

    this._field = field;

    if (field && (typeof field === 'object' || typeof field === 'function')) {
      this._fieldEffectRef = this.fieldSyncService.setupFieldSync(field, {
        onValueChanged: (value: DatepickerValue) => {
          this._value = value;
          this.initializeValue(value);
          this.generateCalendar();
          if (this._field === field) {
            this.scheduleChangeDetection();
          }
        },
        onDisabledChanged: (disabled: boolean) => {
          if (this.disabled !== disabled) {
            this.disabled = disabled;
            this.scheduleChangeDetection();
          }
        },
        onRequiredChanged: (required: boolean) => {
          this.required = required;
        },
        onErrorStateChanged: (hasError: boolean) => {
          this.errorState = hasError;
        },
        onSyncError: (_error: unknown) => { },
        normalizeValue: (value: unknown) => {
          return this._normalizeValue(value);
        },
        isValueEqual: (val1: DatepickerValue, val2: DatepickerValue) => {
          return this.isValueEqual(val1, val2);
        },
        onCalendarGenerated: () => { },
        onStateChanged: () => {
          this.scheduleChangeDetection();
        },
      });

      this.syncFieldValue(field);
    } else {
      this._value = null;
      this.initializeValue(null);
      this.generateCalendar();
    }
  }
  get field(): SignalFormField {
    return this._field;
  }

  private syncFieldValue(field: SignalFormField): boolean {
    const result = this.fieldSyncService.syncFieldValue(field, {
      onValueChanged: (value: DatepickerValue) => {
        this._value = value;
        this.initializeValue(value);
        this.generateCalendar();
        this.scheduleChangeDetection();
      },
      onDisabledChanged: (disabled: boolean) => {
        if (this.disabled !== disabled) {
          this.disabled = disabled;
          this.scheduleChangeDetection();
          this.stateChanges.next();
        }
      },
      onRequiredChanged: (required: boolean) => {
        this._required = required;
        this.stateChanges.next();
      },
      onErrorStateChanged: (hasError: boolean) => {
        this._errorState = hasError;
        this.stateChanges.next();
      },
      onSyncError: (_error: unknown) => { },
      normalizeValue: (value: unknown) => {
        return this._normalizeValue(value);
      },
      isValueEqual: (val1: DatepickerValue, val2: DatepickerValue) => {
        return this.isValueEqual(val1, val2);
      },
      onCalendarGenerated: () => {
        this.generateCalendar();
      },
      onStateChanged: () => {
        this.stateChanges.next();
        this.scheduleChangeDetection();
      },
    });

    return result;
  }

  private _startAtDate: Date | null = null;
  @Input() set startAt(value: DateInput | null) {
    this._startAtDate = this._normalizeDate(value);
  }

  private _locale: string = 'en-US';
  @Input() set locale(value: string) {
    if (value && value !== this._locale) {
      this._locale = value;
      this._localeSignal.set(value);
      if (this.translationRegistry) {
        this.updateRtlState();
        this.initializeTranslations();
        this.generateLocaleData();
        this.generateCalendar();
        this.scheduleChangeDetection();
      }
    } else if (value) {
      this._locale = value;
      this._localeSignal.set(value);
    }
  }
  get locale(): string {
    return this._locale;
  }

  @Input() theme: 'light' | 'dark' = 'light';
  @HostBinding('class.dark-theme') get isDarkMode() {
    return this.theme === 'dark';
  }

  private _dateFormatPattern: string | null = null;
  private customDateFormatService: CustomDateFormatService | null = null;
  @Input() set dateFormatPattern(value: string | null) {
    this._dateFormatPattern = value;
    if (value) {
      // Initialize or update the custom format service with current locale
      if (this.customDateFormatService) {
        this.customDateFormatService.setLocale(this._locale);
      } else {
        this.customDateFormatService = new CustomDateFormatService(
          this._locale,
        );
      }
    }
  }
  get dateFormatPattern(): string | null {
    return this._dateFormatPattern;
  }

  private _animationConfig: AnimationConfig | null = null;
  /**
   * Animation configuration allowing customization of animation duration, easing, and reduction.
   * Supports prefers-reduced-motion accessibility preference automatically.
   *
   * @example
   * ```typescript
   * // Disable all animations
   * <ngxsmk-datepicker [animationConfig]="{ enabled: false }"></ngxsmk-datepicker>
   *
   * // Custom animation duration and easing
   * <ngxsmk-datepicker [animationConfig]="{ duration: 300, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }"></ngxsmk-datepicker>
   *
   * // Disable specific animation properties
   * <ngxsmk-datepicker [animationConfig]="{ property: 'opacity' }"></ngxsmk-datepicker>
   * ```
   */
  @Input() set animationConfig(value: AnimationConfig | null) {
    this._animationConfig = value;
    // Merge with global config: component input takes precedence
    const mergedConfig: AnimationConfig = {
      ...this.globalConfig?.animations,
      ...this._animationConfig,
    };
    this.applyAnimationConfig(mergedConfig);
  }
  get animationConfig(): AnimationConfig | null {
    return this._animationConfig;
  }

  private _rtl: boolean | null = null;
  @Input() set rtl(value: boolean | null) {
    this._rtl = value;
    this.updateRtlState();
  }
  get rtl(): boolean | null {
    return this._rtl;
  }
  get isRtl(): boolean {
    if (this._rtl !== null) {
      return this._rtl;
    }
    if (this.isBrowser && typeof document !== 'undefined') {
      const docDir = document.documentElement.dir || document.body.dir;
      if (docDir === 'rtl' || docDir === 'ltr') {
        return docDir === 'rtl';
      }
    }
    return this.localeRegistry.isRtlLocale(this._locale);
  }
  @HostBinding('class.ngxsmk-rtl') get rtlClass() {
    return this.isRtl;
  }

  @Input() classes?: DatepickerClasses | undefined;

  private onChange = (_: DatepickerValue) => { };
  private onTouched = () => { };
  public disabled = false;
  @Input() set disabledState(isDisabled: boolean) {
    this.setDisabledState(isDisabled);
  }

  /**
   * Subject used for Material Form Field integration.
   * Emits when the component's state changes (disabled, required, error state, etc.)
   *
   * @remarks
   * This Subject is required for Angular Material's form field control interface.
   * It allows Material form fields to track state changes and update their appearance
   * accordingly (e.g., showing error states, floating labels, etc.).
   *
   * The Subject is properly cleaned up in ngOnDestroy() to prevent memory leaks.
   * It's marked as readonly to prevent external code from reassigning it.
   */
  public readonly stateChanges = new Subject<void>();
  private _focused = false;
  private _required = false;
  private _errorState = false;

  get focused(): boolean {
    return this._focused || this.isCalendarOpen;
  }

  get empty(): boolean {
    const value = this._value;
    if (!value || value === null) return true;

    if (this.mode === 'range' || this.mode === 'multiple') {
      return !Array.isArray(value) || value.length === 0;
    }

    return false;
  }

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  get required(): boolean {
    return this._required;
  }

  @Input() set required(value: boolean) {
    if (this._required !== value) {
      this._required = value;
      this.stateChanges.next();
      this.scheduleChangeDetection();
    }
  }

  get errorState(): boolean {
    return this._errorState;
  }

  @Input() set errorState(value: boolean) {
    if (this._errorState !== value) {
      this._errorState = value;
      this.stateChanges.next();
      this.scheduleChangeDetection();
    }
  }

  get controlType(): string {
    return 'ngxsmk-datepicker';
  }

  get autofilled(): boolean {
    return false;
  }

  get id(): string {
    return this._uniqueId;
  }

  get describedBy(): string {
    return this.userAriaDescribedBy || `datepicker-help-${this._uniqueId}`;
  }

  /**
   * Aria describedby ID provided by the user or the parent form field.
   * Required for Angular Material form field control interface.
   */
  @Input() userAriaDescribedBy: string = '';

  setDescribedByIds(ids: string[]): void {
    if (ids && ids.length > 0) {
      this.userAriaDescribedBy = ids.join(' ');
    } else {
      this.userAriaDescribedBy = '';
    }
    this.stateChanges.next();
  }

  onContainerClick(_event: MouseEvent): void {
    if (!this.disabled && !this.isCalendarOpen) {
      this.focusInput();
    }
  }

  @Output() valueChange = new EventEmitter<DatepickerValue>();
  @Output() action = new EventEmitter<{ type: string; payload?: unknown }>();
  /** Emitted when validation fails (e.g. invalid typed date, date before min, after max). Message is translated. */
  @Output() validationError = new EventEmitter<{
    code: string;
    message: string;
  }>();

  private _validationErrorMessage: string | null = null;

  /** User-facing validation error message when set (e.g. from typed input or min/max). */
  get validationErrorMessage(): string | null {
    return this._validationErrorMessage;
  }

  private setValidationError(code: string, message: string): void {
    this._validationErrorMessage = message;
    this.validationError.emit({ code, message });
    this.cdr.markForCheck();
  }

  private clearValidationError(): void {
    if (this._validationErrorMessage !== null) {
      this._validationErrorMessage = null;
      this.cdr.markForCheck();
    }
  }

  private _minDate: Date | null = null;
  @Input() set minDate(value: DateInput | null) {
    this._minDate = this._normalizeDate(value);
    this._updateMemoSignals();
    this._invalidateMemoCache();
    this.cdr.markForCheck();
  }
  get minDate(): DateInput | null {
    return this._minDate;
  }

  private _maxDate: Date | null = null;
  @Input() set maxDate(value: DateInput | null) {
    this._maxDate = this._normalizeDate(value);
    this._updateMemoSignals();
    this._invalidateMemoCache();
    this.cdr.markForCheck();
  }
  get maxDate(): DateInput | null {
    return this._maxDate;
  }

  private _ranges: { [key: string]: [Date, Date] } | null = null;
  @Input() set ranges(value: DateRange | null) {
    this._ranges = processDateRanges(value);
    this.updateRangesArray();
  }

  public currentDate: Date = new Date();
  public daysInMonth: (Date | null)[] = [];
  public multiCalendarMonths: Array<{
    month: number;
    year: number;
    days: (Date | null)[];
  }> = [];

  /**
   * LRU (Least Recently Used) cache for calendar month generation.
   * Caches generated month arrays to avoid recalculating the same months.
   *
   * @remarks
   * Performance characteristics:
   * - Calendar generation: O(1) per month when cached
   * - Cache lookup: O(1) average case
   * - Cache eviction: O(n) where n = cache size (only when cache is full)
   *
   * The cache automatically evicts the least recently used entry when it reaches
   * MAX_CACHE_SIZE to prevent unbounded memory growth. This is especially important
   * for applications with many datepicker instances or long-running sessions.
   */
  /**
   * Maximum number of months to cache before evicting LRU entries.
   * Now managed by CalendarGenerationService.
   */
  public weekDays: string[] = [];
  public readonly today: Date = getStartOfDay(new Date());
  public selectedDate: Date | null = null;
  public selectedDates: Date[] = [];
  public startDate: Date | null = null;
  public endDate: Date | null = null;
  public hoveredDate: Date | null = null;
  public rangesArray: { key: string; value: [Date, Date] }[] = [];

  protected touchState: TouchGestureState = {
    touchStartTime: 0,
    touchStartElement: null,
    dateCellTouchStartTime: 0,
    dateCellTouchStartDate: null,
    dateCellTouchStartX: 0,
    dateCellTouchStartY: 0,
    isDateCellTouching: false,
    lastDateCellTouchDate: null,
    dateCellTouchHandled: false,
    calendarSwipeStartX: 0,
    calendarSwipeStartY: 0,
    calendarSwipeStartTime: 0,
    isCalendarSwiping: false,
    hoveredDate: null,
  };

  private dateCellTouchHandledTime: number = 0;
  private touchHandledTimeout: ReturnType<typeof setTimeout> | null = null;
  private activeTimeouts: Set<ReturnType<typeof setTimeout>> = new Set();
  private activeAnimationFrames: Set<number> = new Set();
  private fieldSyncTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private touchListenersSetup = new WeakMap<HTMLElement, boolean>();
  private touchListenersAttached = new WeakMap<HTMLElement, boolean>();

  private bottomSheetSwipeStartY: number = 0;
  private bottomSheetSwipeCurrentY: number = 0;
  private isBottomSheetSwiping: boolean = false;
  private bottomSheetSwipeThreshold: number = 100;

  // Note: isCalendarSwiping is now in touchState
  private readonly SWIPE_THRESHOLD = 50;
  private readonly SWIPE_TIME_THRESHOLD = 300;

  private _currentMonth: number = this.currentDate.getMonth();
  public _currentYear: number = this.currentDate.getFullYear();
  public _currentDecade: number =
    Math.floor(this.currentDate.getFullYear() / 10) * 10;

  public monthOptions = computed(() =>
    generateMonthOptions(this._localeSignal(), this._currentYearSignal()),
  );
  public yearOptions = computed(() =>
    generateYearOptions(this._currentYearSignal(), this.yearRange),
  );
  public decadeOptions: { label: string; value: number }[] = [];
  public yearGrid: number[] = [];
  public hourOptions: { label: string; value: number }[] = [];
  public minuteOptions: { label: string; value: number }[] = [];
  public secondOptions: { label: string; value: number }[] = [];
  public decadeGrid: number[] = [];
  private firstDayOfWeek: number = 0;

  public currentHour: number = 0;
  public currentMinute: number = 0;
  public currentSecond: number = 0;
  public currentDisplayHour: number = 12;
  public isPm: boolean = false;

  // Time range properties (for timeRangeMode)
  public startHour: number = 0;
  public startMinute: number = 0;
  public startSecond: number = 0;
  public startDisplayHour: number = 12;
  public startIsPm: boolean = false;

  public endHour: number = 0;
  public endMinute: number = 0;
  public endSecond: number = 0;
  public endDisplayHour: number = 12;
  public endIsPm: boolean = false;

  public ampmOptions: { label: string; value: boolean }[] = [
    { label: 'AM', value: false },
    { label: 'PM', value: true },
  ];

  public timelineMonths: Date[] = [];
  public timelineStartDate: Date = new Date();
  public timelineEndDate: Date = new Date();
  private timelineZoomLevel: number = 1;
  public startTimeSlider: number = 0;
  public endTimeSlider: number = 1440;

  private readonly elementRef: ElementRef = inject(ElementRef);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly globalConfig: DatepickerConfig | null = inject(
    DATEPICKER_CONFIG,
    { optional: true },
  );
  private readonly fieldSyncService: FieldSyncService =
    inject(FieldSyncService);
  private readonly localeRegistry: LocaleRegistryService = inject(
    LocaleRegistryService,
  );
  private readonly translationRegistry: TranslationRegistryService = inject(
    TranslationRegistryService,
  );
  private readonly focusTrapService: FocusTrapService =
    inject(FocusTrapService);
  private readonly ariaLiveService: AriaLiveService = inject(AriaLiveService);
  private readonly hapticFeedbackService: HapticFeedbackService = inject(
    HapticFeedbackService,
  );
  private readonly calendarGenerationService: CalendarGenerationService =
    inject(CalendarGenerationService);
  private readonly parsingService: DatepickerParsingService = inject(
    DatepickerParsingService,
  );
  private readonly touchService: TouchGestureHandlerService = inject(
    TouchGestureHandlerService,
  );
  private readonly popoverPositioningService: PopoverPositioningService =
    inject(PopoverPositioningService);
  public readonly ngControl: NgControl | null = inject(NgControl, {
    optional: true,
    self: true,
  });
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly dateComparator = createDateComparator();

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  public typedInputValue: string = '';
  private isTyping: boolean = false;

  @ViewChild('popoverContainer', { static: false })
  popoverContainer?: ElementRef<HTMLElement>;
  public readonly popoverId = 'ngxsmk-popover-' + Math.random().toString(36).substring(2, 9);
  @ViewChild('datepickerInput', { static: false })
  datepickerInput?: NgxsmkDatepickerInputComponent;
  @ViewChild('datepickerContent', { static: false })
  datepickerContent?: NgxsmkDatepickerContentComponent;
  private focusTrapCleanup: (() => void) | null = null;

  public _translations: DatepickerTranslations | null = null;
  private _translationService: TranslationService | null = null;

  private _changeDetectionScheduled = false;

  /**
   * Schedules change detection to run in the next microtask.
   * Prevents multiple change detection cycles from being scheduled simultaneously.
   *
   * @remarks
   * This method is essential for zoneless compatibility. When Zone.js is not present,
   * Angular's automatic change detection doesn't run, so components using OnPush
   * strategy must manually trigger change detection when state changes.
   *
   * The debouncing mechanism prevents excessive change detection cycles when multiple
   * state changes occur in rapid succession (e.g., during user interactions or async
   * operations). Only one change detection cycle is scheduled per microtask queue.
   *
   * This pattern is compatible with both Zone.js and zoneless Angular applications.
   */
  private scheduleChangeDetection(): void {
    if (this._changeDetectionScheduled) {
      return;
    }
    this._changeDetectionScheduled = true;
    Promise.resolve().then(() => {
      this._changeDetectionScheduled = false;
      this.cdr.markForCheck();
    });
  }

  /**
   * Creates a tracked setTimeout that is automatically cleaned up on component destroy.
   * All timeouts created through this method are stored in activeTimeouts for proper cleanup.
   *
   * @param callback - Function to execute after delay
   * @param delay - Delay in milliseconds
   * @returns Timeout ID that can be used with clearTimeout
   */
  private trackedSetTimeout(
    callback: () => void,
    delay: number,
  ): ReturnType<typeof setTimeout> {
    const timeoutId = setTimeout(() => {
      this.activeTimeouts.delete(timeoutId);
      callback();
    }, delay);
    this.activeTimeouts.add(timeoutId);
    return timeoutId;
  }

  /**
   * Creates a tracked requestAnimationFrame that is automatically cancelled on component destroy.
   * All animation frames created through this method are stored in activeAnimationFrames for proper cleanup.
   *
   * @param callback - Function to execute on next animation frame
   * @returns Animation frame ID that can be used with cancelAnimationFrame
   */
  private trackedRequestAnimationFrame(callback: () => void): number {
    const frameId = requestAnimationFrame(() => {
      this.activeAnimationFrames.delete(frameId);
      callback();
    });
    this.activeAnimationFrames.add(frameId);
    return frameId;
  }

  /**
   * Executes a callback after two animation frames, ensuring DOM updates are complete.
   * Useful for operations that need to run after Angular's change detection and browser rendering.
   *
   * @param callback - Function to execute after double animation frame
   */
  private trackedDoubleRequestAnimationFrame(callback: () => void): void {
    this.trackedRequestAnimationFrame(() => {
      this.trackedRequestAnimationFrame(callback);
    });
  }

  /**
   * Clears all active timeouts. Used when locale or weekStart changes
   * to cancel any pending operations that might be invalidated by the change.
   */
  private clearActiveTimeouts(): void {
    if (this.activeTimeouts && this.activeTimeouts.size > 0) {
      this.activeTimeouts.forEach((timeoutId: ReturnType<typeof setTimeout>) =>
        clearTimeout(timeoutId),
      );
      this.activeTimeouts.clear();
    }
  }

  /**
   * Debounces field synchronization to prevent race conditions from rapid updates.
   * Cancels any pending sync operation before scheduling a new one.
   *
   * @param delay - Debounce delay in milliseconds (default: 100ms)
   */
  private debouncedFieldSync(delay: number = 100): void {
    if (this.fieldSyncTimeoutId) {
      clearTimeout(this.fieldSyncTimeoutId);
      this.activeTimeouts.delete(this.fieldSyncTimeoutId);
    }

    this.fieldSyncTimeoutId = this.trackedSetTimeout(() => {
      this.fieldSyncTimeoutId = null;
      if (this._field) {
        this.syncFieldValue(this._field);
      }
    }, delay);
  }

  private _currentMonthSignal = signal<number>(this.currentDate.getMonth());
  private _currentYearSignal = signal<number>(this.currentDate.getFullYear());
  private _localeSignal = signal<string>('en-US');
  private _holidayProviderSignal = signal<HolidayProvider | null>(null);
  private _disabledStateSignal = signal<{
    minDate: Date | null;
    maxDate: Date | null;
    disabledDates: (string | Date)[] | null;
    disabledRanges: Array<{ start: Date | string; end: Date | string }> | null;
  }>({
    minDate: null,
    maxDate: null,
    disabledDates: null,
    disabledRanges: null,
  });

  /**
   * Effect that automatically triggers change detection when key signals change.
   * This reduces the need for manual markForCheck() calls throughout the codebase.
   */
  private _changeDetectionEffect = effect(() => {
    // Track signal dependencies to trigger change detection
    this._isCalendarOpen();
    this._currentMonthSignal();
    this._currentYearSignal();
    this._localeSignal();
    this.monthOptions();
    this.yearOptions();

    // Schedule change detection once for all signal changes
    this.scheduleChangeDetection();
  });

  /**
   * Signal tracking which calendar month indices are currently visible in the viewport.
   * Used for lazy rendering of multi-calendar layouts to improve performance.
   */
  private _visibleCalendarIndicesSignal = signal<Set<number>>(
    new Set([0, 1, 2, 3, 4]), // Default: render first 5 months
  );

  /**
   * Computed signal for rendered calendars - only includes visible calendars + buffer.
   * This dramatically reduces DOM nodes for multi-calendar layouts.
   */
  renderedCalendars = computed(() => {
    // Track month/year signal dependencies to trigger re-computation when navigating months
    // This ensures the computed re-evaluates when changeMonth() or dropdown selection changes the month/year
    this._currentMonthSignal();
    this._currentYearSignal();

    const visibleIndices = this._visibleCalendarIndicesSignal();
    const allMonths = this.multiCalendarMonths;
    const lazyBuffer = 2; // Render 2 calendars outside viewport

    if (allMonths.length <= 1) {
      // No lazy loading for single calendar
      return allMonths;
    }

    // Find min/max visible indices
    const minVisible = Math.min(...visibleIndices);
    const maxVisible = Math.max(...visibleIndices);

    // Expand range with buffer
    const renderStart = Math.max(0, minVisible - lazyBuffer);
    const renderEnd = Math.min(allMonths.length - 1, maxVisible + lazyBuffer);

    // Return calendars in the render range
    return allMonths.slice(renderStart, renderEnd + 1);
  });

  private _cachedIsCurrentMonthMemo: ((day: Date | null) => boolean) | null =
    null;
  private _cachedIsDateDisabledMemo: ((day: Date | null) => boolean) | null =
    null;
  private _cachedIsSameDayMemo:
    | ((d1: Date | null, d2: Date | null) => boolean)
    | null = null;
  private _cachedIsHolidayMemo: ((day: Date | null) => boolean) | null = null;
  private _cachedGetHolidayLabelMemo:
    | ((day: Date | null) => string | null)
    | null = null;

  // Memoized dependencies for calendar generation with equality function for better performance
  // Helper to get dependencies for memoization
  private _memoDependencies() {
    return {
      month: this._currentMonthSignal(),
      year: this._currentYearSignal(),
      firstDayOfWeek: this.firstDayOfWeek,
      holidayProvider: this._holidayProviderSignal(),
      disabledState: this._disabledStateSignal(),
    };
  }

  private _updateMemoSignals(): void {
    this._currentMonthSignal.set(this._currentMonth);
    this._currentYearSignal.set(this._currentYear);
    this._holidayProviderSignal.set(this.holidayProvider || null);
    this._disabledStateSignal.set({
      minDate: this._minDate,
      maxDate: this._maxDate,
      disabledDates: this.disabledDates.length > 0 ? this.disabledDates : null,
      disabledRanges:
        this.disabledRanges.length > 0 ? this.disabledRanges : null,
    });
  }

  private passiveTouchListeners: Array<() => void> = [];

  get isInlineMode(): boolean {
    if (this.inline === true || this.inline === 'always') {
      return true;
    }
    if (this.inline === 'auto' && this.isBrowser) {
      try {
        const mediaQuery = globalThis.matchMedia('(min-width: 768px)');
        return mediaQuery !== null && mediaQuery.matches;
      } catch {
        return false;
      }
    }
    return false;
  }

  private clearTouchHandledFlag(): void {
    this.touchState.dateCellTouchHandled = false;
    this.dateCellTouchHandledTime = 0;
    this.touchState.isDateCellTouching = false;
    if (this.touchHandledTimeout) {
      clearTimeout(this.touchHandledTimeout);
      this.touchHandledTimeout = null;
    }
  }

  private closeMonthYearDropdowns(): void {
    this.datepickerContent?.closeAllSelects();
  }

  private setTouchHandledFlag(duration: number = 300): void {
    this.touchState.dateCellTouchHandled = true;
    this.dateCellTouchHandledTime = Date.now();

    if (this.touchHandledTimeout) {
      clearTimeout(this.touchHandledTimeout);
    }

    this.touchHandledTimeout = this.trackedSetTimeout(() => {
      this.clearTouchHandledFlag();
    }, duration);
  }

  public isMobileDevice(): boolean {
    if (!this.autoDetectMobile) {
      return false;
    }
    if (this.isBrowser) {
      try {
        const mediaQuery = globalThis.matchMedia('(max-width: 1024px)');
        const isMobileWidth = mediaQuery !== null && mediaQuery.matches;
        const hasTouchSupport =
          'ontouchstart' in globalThis ||
          ('maxTouchPoints' in navigator &&
            (navigator as Navigator & { maxTouchPoints?: number })
              .maxTouchPoints > 0);
        const hasPointerEvents = 'onpointerdown' in globalThis;
        const isMobileUserAgent =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
          );

        return (
          isMobileWidth ||
          (hasTouchSupport && isMobileWidth) ||
          (hasPointerEvents && isMobileWidth) ||
          isMobileUserAgent
        );
      } catch {
        return (
          'ontouchstart' in globalThis ||
          ('maxTouchPoints' in navigator &&
            (navigator as Navigator & { maxTouchPoints?: number })
              .maxTouchPoints > 0)
        );
      }
    }
    return false;
  }

  public shouldUseNativePicker(): boolean {
    if (
      !this.useNativePicker ||
      this.isInlineMode ||
      this.mode === 'multiple'
    ) {
      return false;
    }
    if (!this.isBrowser) {
      return false;
    }
    const isMobile = this.isMobileDevice();
    if (!isMobile) {
      return false;
    }
    try {
      const testInput = document.createElement('input');
      if (this.showTime || this.timeOnly) {
        testInput.type = 'datetime-local';
      } else {
        testInput.type = 'date';
      }
      return (
        testInput.type ===
        (this.showTime || this.timeOnly ? 'datetime-local' : 'date')
      );
    } catch {
      return false;
    }
  }

  public getNativeInputType(): string {
    if (this.showTime || this.timeOnly) {
      return 'datetime-local';
    }
    return 'date';
  }

  public formatValueForNativeInput(value: DatepickerValue): string {
    return this.parsingService.formatValueForNativeInput(
      value,
      this.mode,
      this.showTime,
      this.timeOnly,
    );
  }

  public formatDateForNativeInput(date: Date): string {
    return this.parsingService.formatDateForNativeInput(
      date,
      this.showTime,
      this.timeOnly,
    );
  }

  public getMinDateForNativeInput(): string | null {
    if (!this._minDate) {
      return null;
    }
    return this.formatDateForNativeInput(this._minDate);
  }

  public getMaxDateForNativeInput(): string | null {
    if (!this._maxDate) {
      return null;
    }
    return this.formatDateForNativeInput(this._maxDate);
  }

  public parseNativeInputValue(value: string): DatepickerValue {
    return this.parsingService.parseNativeInputValue(value, this.mode);
  }

  public onNativeInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = this.parseNativeInputValue(input.value);
    if (value === null) {
      this.emitValue(null);
    } else {
      this.emitValue(value);
    }
  }

  public onBottomSheetTouchStart(event: TouchEvent): void {
    if (
      !this.isMobileDevice() ||
      this.mobileModalStyle !== 'bottom-sheet' ||
      this.isInlineMode
    ) {
      return;
    }
    const touch = event.touches[0];
    if (touch) {
      this.bottomSheetSwipeStartY = touch.clientY;
      this.bottomSheetSwipeCurrentY = touch.clientY;
      this.isBottomSheetSwiping = false;
    }
  }

  public onBottomSheetTouchMove(event: TouchEvent): void {
    if (
      !this.isMobileDevice() ||
      this.mobileModalStyle !== 'bottom-sheet' ||
      this.isInlineMode ||
      !this.isCalendarOpen
    ) {
      return;
    }
    const touch = event.touches[0];
    if (touch && this.bottomSheetSwipeStartY > 0) {
      this.bottomSheetSwipeCurrentY = touch.clientY;
      const deltaY =
        this.bottomSheetSwipeCurrentY - this.bottomSheetSwipeStartY;

      if (deltaY > 10 && !this.isBottomSheetSwiping) {
        this.isBottomSheetSwiping = true;
      }

      if (this.isBottomSheetSwiping && deltaY > 0) {
        const popoverContainer = this.getActualPopoverContainer();
        if (popoverContainer) {
          popoverContainer.style.transform = `translateY(${deltaY}px)`;
          const opacity = Math.max(0, 1 - deltaY / 300);
          popoverContainer.style.opacity = String(opacity);
        }
      }
    }
  }

  public onBottomSheetTouchEnd(event: TouchEvent): void {
    if (
      !this.isMobileDevice() ||
      this.mobileModalStyle !== 'bottom-sheet' ||
      this.isInlineMode ||
      !this.isCalendarOpen
    ) {
      return;
    }
    const touch = event.changedTouches[0];
    if (touch && this.isBottomSheetSwiping) {
      const deltaY =
        this.bottomSheetSwipeCurrentY - this.bottomSheetSwipeStartY;

      if (deltaY > this.bottomSheetSwipeThreshold) {
        this.closeCalendarWithFocusRestore();
      }

      const popoverContainer = this.getActualPopoverContainer();
      if (popoverContainer) {
        popoverContainer.style.transform = '';
        popoverContainer.style.opacity = '';
      }

      this.bottomSheetSwipeStartY = 0;
      this.bottomSheetSwipeCurrentY = 0;
      this.isBottomSheetSwiping = false;
    }
  }

  // Bind methods for child components to preserve 'this' context
  public readonly boundIsDateDisabled = (d: Date | null) =>
    this.isDateDisabledMemo(d);
  public readonly boundIsSameDay = (d1: Date | null, d2: Date | null) =>
    this.isSameDayMemo(d1, d2);
  public readonly boundIsHoliday = (d: Date | null) => this.isHolidayMemo(d);
  public readonly boundIsMultipleSelected = (d: Date | null) =>
    this.isMultipleSelected(d);
  public readonly boundIsInRange = (d: Date | null) => this.isInRange(d);
  public readonly boundIsPreviewInRange = (d: Date | null) =>
    this.isPreviewInRange(d);
  public readonly boundGetAriaLabel = (d: Date | null) => this.getAriaLabel(d);
  public readonly boundGetDayCellCustomClasses = (d: Date | null) =>
    this.getDayCellCustomClasses(d);
  public readonly boundGetDayCellTooltip = (d: Date | null) =>
    this.getDayCellTooltip(d);
  public readonly boundFormatDayNumber = (d: Date | null) =>
    this.formatDayNumber(d);
  public readonly boundGetMonthYearLabel = (m: number, y: number) =>
    this.getMonthYearLabel(m, y);
  public readonly boundGetCalendarAriaLabelForMonth = (m: number, y: number) =>
    this.getCalendarAriaLabelForMonth(m, y);
  public readonly boundIsTimelineMonthSelected = (d: Date) =>
    this.isTimelineMonthSelected(d);
  public readonly boundFormatTimeSliderValue = (v: number) =>
    this.formatTimeSliderValue(v);

  get isCalendarVisible(): boolean {
    return this.isInlineMode || this.isCalendarOpen;
  }

  get displayValue(): string {
    if (this.hooks?.formatDisplayValue) {
      const value = this.hooks.formatDisplayValue(this._value, this.mode);
      this.syncTypedInputIfNotTyping(value ?? '');
      return value ?? '';
    }
    if (this._dateFormatPattern && this.customDateFormatService) {
      const value = this.formatWithCustomPattern();
      this.syncTypedInputIfNotTyping(value);
      return value;
    }
    if (this.displayFormat) {
      const value = this.formatWithCustomFormat();
      this.syncTypedInputIfNotTyping(value);
      return value;
    }
    if (this.timeOnly) {
      const value = this.getDisplayValueTimeOnly();
      this.syncTypedInputIfNotTyping(value);
      return value;
    }
    const value = this.getDisplayValueDateDefault();
    this.syncTypedInputIfNotTyping(value);
    return value;
  }

  private syncTypedInputIfNotTyping(value: string): void {
    if (!this.isTyping && this.allowTyping) {
      this.typedInputValue = value;
    }
  }

  private getDisplayValueTimeOnly(): string {
    const timeOpts: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
    };
    if (this.mode === 'single' && this.selectedDate) {
      return formatDateWithTimezone(
        this.selectedDate,
        this.locale,
        timeOpts,
        this.timezone,
      );
    }
    if (this.mode === 'range' && this.startDate) {
      const start = formatDateWithTimezone(
        this.startDate,
        this.locale,
        timeOpts,
        this.timezone,
      );
      if (this.endDate) {
        const end = formatDateWithTimezone(
          this.endDate,
          this.locale,
          timeOpts,
          this.timezone,
        );
        return `${start} - ${end}`;
      }
      return `${start}...`;
    }
    if (this.mode === 'multiple' && this.selectedDates.length > 0) {
      return this.getTranslation('timesSelected', undefined, {
        count: this.selectedDates.length,
      });
    }
    return '';
  }

  private getDisplayValueDateDefault(): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    };
    if (this.showTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    if (this.mode === 'single' && this.selectedDate) {
      return formatDateWithTimezone(
        this.selectedDate,
        this.locale,
        options,
        this.timezone,
      );
    }
    if (this.mode === 'range' && this.startDate) {
      const start = formatDateWithTimezone(
        this.startDate,
        this.locale,
        options,
        this.timezone,
      );
      if (this.endDate) {
        const end = formatDateWithTimezone(
          this.endDate,
          this.locale,
          options,
          this.timezone,
        );
        return `${start} - ${end}`;
      }
      return `${start}...`;
    }
    if (this.mode === 'multiple' && this.selectedDates.length > 0) {
      return this.getTranslation('datesSelected', undefined, {
        count: this.selectedDates.length,
      });
    }
    return '';
  }

  private formatWithCustomFormat(): string {
    if (!this.displayFormat) return '';
    const fromAdapter = this.formatWithAdapter();
    if (fromAdapter !== null) return fromAdapter;
    return this.formatWithParsingServiceFallback();
  }

  private formatWithAdapter(): string | null {
    const adapter = this.globalConfig?.dateAdapter;
    if (!adapter || typeof adapter.format !== 'function') return null;
    const fmt = this.displayFormat!;
    const loc = this.locale;
    if (this.mode === 'single' && this.selectedDate) {
      return adapter.format(this.selectedDate, fmt, loc);
    }
    if (this.mode === 'range' && this.startDate) {
      const start = adapter.format(this.startDate, fmt, loc);
      if (this.endDate) {
        return `${start} - ${adapter.format(this.endDate, fmt, loc)}`;
      }
      return `${start}...`;
    }
    if (this.mode === 'multiple' && this.selectedDates.length > 0) {
      return this.getTranslation('datesSelected', undefined, {
        count: this.selectedDates.length,
      });
    }
    return null;
  }

  private formatWithParsingServiceFallback(): string {
    const fmt = this.displayFormat ?? 'MM/DD/YYYY';
    const formatOne = (d: Date) =>
      this.parsingService.formatDateWithPattern(d, fmt);
    if (this.mode === 'single' && this.selectedDate) {
      return formatOne(this.selectedDate);
    }
    if (this.mode === 'range' && this.startDate) {
      if (this.endDate) {
        return `${formatOne(this.startDate)} - ${formatOne(this.endDate)}`;
      }
      return `${formatOne(this.startDate)}...`;
    }
    if (this.mode === 'multiple' && this.selectedDates.length > 0) {
      return this.getTranslation('datesSelected', undefined, {
        count: this.selectedDates.length,
      });
    }
    return '';
  }

  /**
   * Format dates using a custom date format pattern
   * Supports YYYY, MM, DD, HH, mm, ss, etc.
   */
  private formatWithCustomPattern(): string {
    if (!this._dateFormatPattern || !this.customDateFormatService) return '';

    try {
      if (this.mode === 'single' && this.selectedDate) {
        return this.customDateFormatService.format(
          this.selectedDate,
          this._dateFormatPattern,
        );
      } else if (this.mode === 'range' && this.startDate) {
        if (this.endDate) {
          const start = this.customDateFormatService.format(
            this.startDate,
            this._dateFormatPattern,
          );
          const end = this.customDateFormatService.format(
            this.endDate,
            this._dateFormatPattern,
          );
          return `${start} - ${end}`;
        } else {
          return (
            this.customDateFormatService.format(
              this.startDate,
              this._dateFormatPattern,
            ) + '...'
          );
        }
      } else if (this.mode === 'multiple' && this.selectedDates.length > 0) {
        return this.getTranslation('datesSelected', undefined, {
          count: this.selectedDates.length,
        });
      } else if (this.mode === 'timeRange') {
        // For time range mode, show formatted start and end times
        const today = new Date();
        const startDate = new Date(today);
        startDate.setHours(
          this.get24Hour(this.startDisplayHour, this.startIsPm),
          this.startMinute,
          this.startSecond,
          0,
        );

        const endDate = new Date(today);
        endDate.setHours(
          this.get24Hour(this.endDisplayHour, this.endIsPm),
          this.endMinute,
          this.endSecond,
          0,
        );

        const start = this.customDateFormatService.format(
          startDate,
          this._dateFormatPattern,
        );
        const end = this.customDateFormatService.format(
          endDate,
          this._dateFormatPattern,
        );
        return `${start} - ${end}`;
      }
    } catch {
      // Fallback to empty string if formatting fails
      return '';
    }

    return '';
  }

  get isBackArrowDisabled(): boolean {
    if (!this._minDate) return false;
    const firstDayOfCurrentMonth = new Date(
      this.currentYear,
      this.currentMonth,
      1,
    );
    return firstDayOfCurrentMonth <= this._minDate;
  }
  private _invalidateMemoCache(): void {
    this._memoDependencies();

    this._cachedIsCurrentMonthMemo = null;
    this._cachedIsDateDisabledMemo = null;
    this._cachedIsSameDayMemo = null;
    this._cachedIsHolidayMemo = null;
    this._cachedGetHolidayLabelMemo = null;
  }

  get isCurrentMonthMemo(): (day: Date | null) => boolean {
    const deps = this._memoDependencies();

    if (this._cachedIsCurrentMonthMemo) {
      const currentMonth = this._currentMonth;
      const currentYear = this._currentYear;
      if (currentMonth === deps.month && currentYear === deps.year) {
        return this._cachedIsCurrentMonthMemo;
      }
    }

    const month = deps.month;
    const year = deps.year;
    this._cachedIsCurrentMonthMemo = (day: Date | null) => {
      if (!day) return false;
      return day.getMonth() === month && day.getFullYear() === year;
    };
    return this._cachedIsCurrentMonthMemo;
  }

  /**
   * Memoized function for checking if a date is disabled.
   * Returns a cached function that checks date constraints efficiently.
   *
   * @returns A function that checks if a date is disabled
   *
   * @remarks
   * This getter implements memoization to avoid recreating the validation function
   * on every calendar render. The function is regenerated only when:
   * - Disabled state constraints change (minDate, maxDate, disabledDates, disabledRanges)
   * - Current month/year changes
   *
   * Performance: O(1) to get the memoized function, O(n) to execute where n = constraints
   * The memoization significantly improves performance when rendering calendar grids
   * with many date cells (e.g., multiple calendar months).
   */
  get isDateDisabledMemo(): (day: Date | null) => boolean {
    const deps = this._memoDependencies();
    const disabledState = deps.disabledState;

    const currentDisabledState = {
      minDate: this._minDate,
      maxDate: this._maxDate,
      disabledDates: this.disabledDates.length > 0 ? this.disabledDates : null,
      disabledRanges:
        this.disabledRanges.length > 0 ? this.disabledRanges : null,
    };

    const currentMonth = this._currentMonthSignal();
    const currentYear = this._currentYearSignal();

    const stateChanged =
      disabledState.minDate !== currentDisabledState.minDate ||
      disabledState.maxDate !== currentDisabledState.maxDate ||
      disabledState.disabledDates !== currentDisabledState.disabledDates ||
      disabledState.disabledRanges !== currentDisabledState.disabledRanges ||
      deps.month !== currentMonth ||
      deps.year !== currentYear;

    if (this._cachedIsDateDisabledMemo && !stateChanged) {
      return this._cachedIsDateDisabledMemo;
    }

    if (stateChanged) {
      this.trackedSetTimeout(() => {
        this._disabledStateSignal.set(currentDisabledState);
      }, 0);
    }

    this._cachedIsDateDisabledMemo = (day: Date | null) => {
      if (!day) return false;
      return this.isDateDisabled(day);
    };
    return this._cachedIsDateDisabledMemo;
  }

  /**
   * Memoized function for comparing if two dates are the same day.
   * Uses an optimized date comparator for efficient day-level comparisons.
   *
   * @returns A function that compares two dates for same-day equality
   *
   * @remarks
   * The date comparator normalizes times to start of day before comparison,
   * ensuring accurate day-level equality checks regardless of time components.
   *
   * Performance: O(1) - Simple date field comparisons after normalization
   */
  get isSameDayMemo(): (d1: Date | null, d2: Date | null) => boolean {
    if (this._cachedIsSameDayMemo) {
      return this._cachedIsSameDayMemo;
    }
    this._cachedIsSameDayMemo = (d1: Date | null, d2: Date | null) =>
      this.dateComparator(d1, d2);
    return this._cachedIsSameDayMemo;
  }

  /**
   * Memoized function for checking if a date is a holiday.
   * Returns a cached function that uses the current holiday provider.
   *
   * @returns A function that checks if a date is a holiday
   *
   * @remarks
   * The function is regenerated when the holidayProvider changes.
   * This ensures the memoized function always uses the current provider
   * while avoiding recreation on every calendar render.
   *
   * Performance: O(1) to get memoized function, O(1) to execute (depends on provider implementation)
   */
  get isHolidayMemo(): (day: Date | null) => boolean {
    const deps = this._memoDependencies();
    const holidayProvider = deps.holidayProvider;

    const currentProvider = this.holidayProvider || null;
    if (this._cachedIsHolidayMemo && holidayProvider === currentProvider) {
      return this._cachedIsHolidayMemo;
    }

    if (holidayProvider !== currentProvider) {
      this._holidayProviderSignal.set(currentProvider);
    }

    const provider = currentProvider;
    this._cachedIsHolidayMemo = (day: Date | null) => {
      if (!day || !provider) return false;
      const dateOnly = getStartOfDay(day);
      return provider.isHoliday(dateOnly);
    };
    return this._cachedIsHolidayMemo;
  }

  get getHolidayLabelMemo(): (day: Date | null) => string | null {
    const deps = this._memoDependencies();
    const holidayProvider = deps.holidayProvider;

    const currentProvider = this.holidayProvider || null;
    if (
      this._cachedGetHolidayLabelMemo &&
      holidayProvider === currentProvider
    ) {
      return this._cachedGetHolidayLabelMemo;
    }

    if (holidayProvider !== currentProvider) {
      this._holidayProviderSignal.set(currentProvider);
    }

    const provider = currentProvider;
    const isHolidayFn = this.isHolidayMemo;
    this._cachedGetHolidayLabelMemo = (day: Date | null) => {
      if (!day || !provider || !isHolidayFn(day)) return null;
      return provider.getHolidayLabel
        ? provider.getHolidayLabel(getStartOfDay(day))
        : 'Holiday';
    };
    return this._cachedGetHolidayLabelMemo;
  }

  /**
   * TrackBy function for calendar day cells in *ngFor loops.
   * Provides stable identity for Angular's change detection optimization.
   *
   * @param index - Array index of the day
   * @param day - The date object (or null for empty cells)
   * @returns Unique identifier for the day cell
   *
   * @remarks
   * Using timestamp ensures stable identity even when Date objects are recreated.
   * This significantly improves *ngFor performance by allowing Angular to track
   * which items have changed, moved, or been removed.
   */
  trackByDay(index: number, day: Date | null): string {
    return day ? day.getTime().toString() : `empty-${index}`;
  }

  /**
   * TrackBy function for calendar month containers in multi-calendar views.
   * Provides stable identity for efficient change detection.
   *
   * @param _index - Array index (unused, using year-month for identity)
   * @param calendarMonth - The calendar month object
   * @returns Unique identifier combining year and month
   */


  /**
   * Checks if a DOM node is contained within this datepicker instance,
   * including its input group and any portaled popover content.
   *
   * @param target - The node to check
   * @returns True if the node is inside this datepicker's DOM tree
   */
  public containsNode(target: Node | null): boolean {
    if (!this.isBrowser || !target) {
      return false;
    }

    const nativeElement = this.elementRef?.nativeElement;
    if (
      nativeElement &&
      (nativeElement === target || nativeElement.contains(target))
    ) {
      return true;
    }

    // Check portaled popover content if it exists
    if (this._shouldAppendToBody && this.portalViewRef) {
      return this.portalViewRef.rootNodes.some(
        (node: Node) =>
          node === target ||
          (node instanceof HTMLElement && node.contains(target)),
      );
    }

    // Check inline popover Container (secondary fallback)
    if (this.popoverContainer?.nativeElement) {
      const popover = this.popoverContainer.nativeElement;
      if (popover === target || popover.contains(target)) {
        return true;
      }
    }

    return false;
  }

  /** Shared logic for closing calendar when user interacts outside (click or touch). */
  private tryCloseCalendarOnOutsideInteraction(target: Node): void {
    if (this.containsNode(target)) return;
    const isInsideOtherDatepicker = Array.from(
      NgxsmkDatepickerComponent._allInstances,
    ).some((instance: NgxsmkDatepickerComponent) => {
      if (instance === this || instance.isInlineMode) return false;
      return instance.containsNode(target);
    });
    if (isInsideOtherDatepicker || !this.isCalendarOpen) return;
    const now = Date.now();
    const timeSinceToggle =
      this.lastToggleTime > 0 ? now - this.lastToggleTime : Infinity;
    const protectionTime = this.isMobileDevice() ? 1000 : 300;
    if (this.isOpeningCalendar || timeSinceToggle < protectionTime) return;
    this.isCalendarOpen = false;
    this.isOpeningCalendar = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent | TouchEvent): void {
    this.handleDocumentOutsideInteraction(event);
  }

  @HostListener('document:touchstart', ['$event'])
  onDocumentTouchStart(event: TouchEvent): void {
    this.handleDocumentOutsideInteraction(event);
  }

  private handleDocumentOutsideInteraction(event: MouseEvent | TouchEvent): void {
    if (!this.isBrowser || this.isInlineMode) return;
    const target = event.target as Node;
    if (!target) return;
    this.tryCloseCalendarOnOutsideInteraction(target);
  }

  public onTouchStart(event: TouchEvent): void {
    if (this.disabled || this.isInlineMode) {
      return;
    }
    this.touchStartTime = Date.now();
    this.touchStartElement = event.currentTarget;
  }

  public onInputGroupFocus(): void {
    if (!this._focused) {
      this._focused = true;
      this.stateChanges.next();
    }
    if (this._field && !this.disabled) {
      this.syncFieldValue(this._field);
    }
  }

  private focusInput(): void {
    if (this.datepickerInput) {
      this.datepickerInput.focus();
    } else if (this.elementRef?.nativeElement) {
      const inputGroup = this.elementRef?.nativeElement?.querySelector(
        '.ngxsmk-input-group',
      );
      if (inputGroup) {
        inputGroup.focus();
      }
    }
  }

  public onTouchEnd(event: TouchEvent): void {
    if (this.disabled || this.isInlineMode) {
      this.touchStartTime = 0;
      this.touchStartElement = null;
      return;
    }

    const now = Date.now();
    const timeSinceTouch =
      this.touchStartTime > 0 ? now - this.touchStartTime : 0;

    const touch = event.changedTouches[0];
    const isSameElement =
      touch &&
      this.touchStartElement &&
      (touch.target === this.touchStartElement ||
        ((this.touchStartElement as Node).contains &&
          (this.touchStartElement as Node).contains(touch.target as Node)));

    if (this.touchStartTime === 0 || timeSinceTouch > 800 || !isSameElement) {
      this.touchStartTime = 0;
      this.touchStartElement = null;
      return;
    }

    const timeSinceToggle =
      this.lastToggleTime > 0 ? now - this.lastToggleTime : Infinity;
    if (timeSinceToggle < 300) {
      this.touchStartTime = 0;
      this.touchStartElement = null;
      return;
    }

    if (this._field) {
      this.syncFieldValue(this._field);
    }

    event.preventDefault();
    event.stopPropagation();

    const wasOpen = this.isCalendarOpen;
    if (wasOpen) {
      this.lastToggleTime = now;
      this.touchStartTime = 0;
      this.touchStartElement = null;
      this.applyCalendarCloseState();
    } else {
      this.closeOtherCalendarInstances();
      this.applyCalendarOpenStateFromTouch(now);
    }
  }

  private closeOtherCalendarInstances(): void {
    NgxsmkDatepickerComponent._allInstances.forEach(
      (instance: NgxsmkDatepickerComponent) => {
        if (
          instance !== this &&
          instance.isCalendarOpen &&
          !instance.isInlineMode
        ) {
          instance.isCalendarOpen = false;
          instance.isOpeningCalendar = false;
          instance.updateOpeningState(false);
          instance.cdr.markForCheck();
        }
      },
    );
  }

  private applyCalendarOpenStateFromTouch(now: number): void {
    this.isOpeningCalendar = true;
    this.isCalendarOpen = true;
    this.lastToggleTime = now;
    this.closeMonthYearDropdowns();

    this.trackedSetTimeout(() => {
      this.touchStartTime = 0;
      this.touchStartElement = null;
    }, 500);

    if (
      this.defaultMonthOffset !== 0 &&
      !this._value &&
      !this._startAtDate
    ) {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + this.defaultMonthOffset);
      nextMonth.setDate(1);
      this.currentDate = nextMonth;
      this._currentMonth = nextMonth.getMonth();
      this._currentYear = nextMonth.getFullYear();
      this._invalidateMemoCache();
    }

    if (this.openCalendarTimeoutId) {
      clearTimeout(this.openCalendarTimeoutId);
    }

    this.generateCalendar();
    this.updateOpeningState(true);

    if (this.isBrowser) {
      this.trackedDoubleRequestAnimationFrame(() => {
        this.setupPassiveTouchListeners();
        this.scheduleChangeDetection();
        const timeoutDelay = this.isMobileDevice() ? 150 : 60;
        if (this.isOpeningCalendar) {
          this.trackedSetTimeout(() => {
            this.isOpeningCalendar = false;
            this.setupPassiveTouchListeners();
            this.scheduleChangeDetection();
          }, timeoutDelay);
        }
      });
    }
  }

  public onPointerDown(event: PointerEvent): void {
    if (this.disabled || this.isInlineMode || event.pointerType === 'mouse') {
      return;
    }

    const target = event.target as HTMLElement;
    if (target && target.closest('.ngxsmk-clear-button')) {
      return;
    }

    this.isPointerEvent = true;
    this.pointerDownTime = Date.now();
    this.touchStartTime = Date.now();
    this.touchStartElement = event.currentTarget as HTMLElement;
  }

  public onPointerUp(event: PointerEvent): void {
    if (
      this.disabled ||
      this.isInlineMode ||
      !this.isPointerEvent ||
      event.pointerType === 'mouse'
    ) {
      this.isPointerEvent = false;
      return;
    }

    const target = event.target as HTMLElement;
    if (target?.closest('.ngxsmk-clear-button')) {
      this.clearPointerTouchState();
      return;
    }

    const now = Date.now();
    const timeSincePointerDown =
      this.pointerDownTime > 0 ? now - this.pointerDownTime : 0;

    if (this.pointerDownTime === 0 || timeSincePointerDown > 600) {
      this.clearPointerTouchState();
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.clearPointerTouchState();

    const wasOpen = this.isCalendarOpen;
    if (wasOpen) {
      this.applyCalendarCloseState();
    } else {
      this.applyCalendarOpenStateFromPointer(now);
    }
  }

  private clearPointerTouchState(): void {
    this.isPointerEvent = false;
    this.pointerDownTime = 0;
    this.touchStartTime = 0;
    this.touchStartElement = null;
  }

  private applyCalendarCloseState(): void {
    this.isCalendarOpen = false;
    this.isOpeningCalendar = false;
    if (this.openCalendarTimeoutId) {
      clearTimeout(this.openCalendarTimeoutId);
      this.openCalendarTimeoutId = null;
    }
    this.updateOpeningState(false);
  }

  private applyCalendarOpenStateFromPointer(now: number): void {
    this.isOpeningCalendar = true;
    this.isCalendarOpen = true;
    this.lastToggleTime = now;
    this.closeMonthYearDropdowns();
    if (this.openCalendarTimeoutId) {
      clearTimeout(this.openCalendarTimeoutId);
    }
    this.updateOpeningState(true);
    if (this.isBrowser) {
      this.trackedDoubleRequestAnimationFrame(() => {
        this.setupPassiveTouchListeners();
        this.scheduleChangeDetection();
      });
      const timeoutDelay = this.isMobileDevice() ? 150 : 60;
      this.openCalendarTimeoutId = this.trackedSetTimeout(() => {
        this.isOpeningCalendar = false;
        this.setupPassiveTouchListeners();
        this.openCalendarTimeoutId = null;
        if (this._shouldAppendToBody && this.isBrowser) {
          this.positionPopoverRelativeToInput();
          this.revealBodyPopover();
        }
        this.cdr.markForCheck();
      }, timeoutDelay);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isCalendarVisible || this.disabled) return;

    const target = event.target as HTMLElement;
    const isCalendarFocused = target?.closest('.ngxsmk-days-grid') !== null;

    if (isCalendarFocused || event.key === 'Escape') {
      const handled = this.handleKeyboardNavigation(event);
      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  private handleKeyboardNavigation(event: KeyboardEvent): boolean {
    if (!this.enableKeyboardShortcuts) return false;

    const context: KeyboardShortcutContext = {
      currentDate: this.currentDate,
      selectedDate: this.selectedDate,
      startDate: this.startDate,
      endDate: this.endDate,
      selectedDates: this.selectedDates,
      mode: this.mode,
      focusedDate: this.focusedDate,
      isCalendarOpen: this.isCalendarOpen,
    };

    if (this.tryCustomShortcuts(event, context)) return true;
    if (this.tryHooksHandleShortcut(event, context)) return true;
    return this.handleShortcutKey(event);
  }

  private tryCustomShortcuts(
    event: KeyboardEvent,
    context: KeyboardShortcutContext,
  ): boolean {
    if (!this.customShortcuts) return false;
    const key = this.getShortcutKey(event);
    if (!key || !this.customShortcuts[key]) return false;
    const handled = this.customShortcuts[key](context);
    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
    return handled;
  }

  private tryHooksHandleShortcut(
    event: KeyboardEvent,
    context: KeyboardShortcutContext,
  ): boolean {
    if (!this.hooks?.handleShortcut) return false;
    const handled = this.hooks.handleShortcut(event, context);
    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
    return handled;
  }

  private handleShortcutKey(event: KeyboardEvent): boolean {
    const key = event.key;
    const nav = this.handleShortcutNavigationKeys(key, event);
    if (nav !== null) return nav;
    return this.handleShortcutLetterAndSpecialKeys(key, event);
  }

  private handleShortcutNavigationKeys(
    key: string,
    event: KeyboardEvent,
  ): boolean | null {
    const arrow = this.handleShortcutArrowKeys(key);
    if (arrow !== null) return arrow;
    const page = this.handleShortcutPageHomeEndKeys(key, event);
    if (page !== null) return page;
    if (key === 'Enter' || key === ' ') {
      if (this.focusedDate) this.onDateClick(this.focusedDate);
      return true;
    }
    if (key === 'Escape') {
      if (!this.isInlineMode) this.closeCalendarWithFocusRestore();
      return true;
    }
    return null;
  }

  private handleShortcutArrowKeys(key: string): boolean | null {
    if (key === 'ArrowLeft') {
      this.navigateDate(this.isRtl ? 1 : -1, 0);
      return true;
    }
    if (key === 'ArrowRight') {
      this.navigateDate(this.isRtl ? -1 : 1, 0);
      return true;
    }
    if (key === 'ArrowUp') {
      this.navigateDate(0, -1);
      return true;
    }
    if (key === 'ArrowDown') {
      this.navigateDate(0, 1);
      return true;
    }
    return null;
  }

  private handleShortcutPageHomeEndKeys(
    key: string,
    event: KeyboardEvent,
  ): boolean | null {
    if (key === 'PageUp') {
      if (event.shiftKey) this.currentYear = this.currentYear - 1;
      else this.changeMonth(-1);
      return true;
    }
    if (key === 'PageDown') {
      if (event.shiftKey) this.currentYear = this.currentYear + 1;
      else this.changeMonth(1);
      return true;
    }
    if (key === 'Home') {
      this.navigateToFirstDay();
      return true;
    }
    if (key === 'End') {
      this.navigateToLastDay();
      return true;
    }
    return null;
  }

  private handleShortcutLetterAndSpecialKeys(
    key: string,
    event: KeyboardEvent,
  ): boolean {
    const noMod = !event.ctrlKey && !event.metaKey;
    if ((key === 't' || key === 'T') && noMod) {
      this.selectToday();
      return true;
    }
    if ((key === 'y' || key === 'Y') && noMod) {
      this.selectYesterday();
      return true;
    }
    if ((key === 'n' || key === 'N') && noMod) {
      this.selectTomorrow();
      return true;
    }
    if ((key === 'w' || key === 'W') && noMod) {
      this.selectNextWeek();
      return true;
    }
    if (key === '?' && event.shiftKey) {
      this.toggleKeyboardHelp();
      return true;
    }
    return false;
  }

  public isKeyboardHelpOpen = false;

  public toggleKeyboardHelp(): void {
    this.isKeyboardHelpOpen = !this.isKeyboardHelpOpen;
    this.scheduleChangeDetection();
  }

  private getShortcutKey(event: KeyboardEvent): string | null {
    const parts: string[] = [];
    if (event.ctrlKey) parts.push('Ctrl');
    if (event.metaKey) parts.push('Meta');
    if (event.shiftKey) parts.push('Shift');
    if (event.altKey) parts.push('Alt');
    parts.push(event.key);
    return parts.length > 1 ? parts.join('+') : event.key;
  }

  public focusedDate: Date | null = null;

  private navigateDate(days: number, weeks: number): void {
    const baseDate = this.focusedDate || this.currentDate || new Date();
    const newDate = new Date(baseDate);
    newDate.setDate(newDate.getDate() + days + weeks * 7);

    if (this.isDateValid(newDate)) {
      this.focusedDate = newDate;
      this.currentDate = new Date(newDate);
      this.currentDate.setDate(1);
      this.generateCalendar();
    }
  }

  private navigateToFirstDay(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    if (this.isDateValid(firstDay)) {
      this.focusedDate = firstDay;
      this.generateCalendar();
    }
  }

  private navigateToLastDay(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    if (this.isDateValid(lastDay)) {
      this.focusedDate = lastDay;
      this.generateCalendar();
    }
  }

  private selectToday(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (this.isDateValid(today)) {
      this.focusedDate = today;
      this.onDateClick(today);
    }
  }

  private selectYesterday(): void {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    if (this.isDateValid(yesterday)) {
      this.focusedDate = yesterday;
      this.onDateClick(yesterday);
    }
  }

  private selectTomorrow(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    if (this.isDateValid(tomorrow)) {
      this.focusedDate = tomorrow;
      this.onDateClick(tomorrow);
    }
  }

  private selectNextWeek(): void {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(0, 0, 0, 0);
    if (this.isDateValid(nextWeek)) {
      this.focusedDate = nextWeek;
      this.currentDate = new Date(nextWeek);
      this.currentDate.setDate(1);
      this.generateCalendar();
      this.onDateClick(nextWeek);
    }
  }

  onDateFocus(day: Date | null): void {
    if (day) {
      this.focusedDate = day;
    }
  }

  private isDateValid(date: Date): boolean {
    if (this.minDate && date < this.minDate) return false;
    if (this.maxDate && date > this.maxDate) return false;
    if (this.isInvalidDate && this.isInvalidDate(date)) return false;
    if (this.isDateDisabledMemo(date)) return false;

    if (this.hooks?.validateDate) {
      if (!this.hooks.validateDate(date, this._value, this.mode)) {
        return false;
      }
    }

    return true;
  }

  getDayCellCustomClasses(day: Date | null): string[] {
    if (!day || !this.hooks?.getDayCellClasses) return [];

    const isSelected =
      (this.mode === 'single' && this.isSameDayMemo(day, this.selectedDate)) ||
      (this.mode === 'multiple' && this.isMultipleSelected(day)) ||
      (this.mode === 'range' &&
        (this.isSameDayMemo(day, this.startDate) ||
          this.isSameDayMemo(day, this.endDate)));
    const isDisabled = this.isDateDisabledMemo(day);
    const isToday = this.isSameDayMemo(day, this.today);
    const isHoliday = this.isHolidayMemo(day);

    return (
      this.hooks.getDayCellClasses(
        day,
        isSelected,
        isDisabled,
        isToday,
        isHoliday,
      ) || []
    );
  }

  getDayCellTooltip(day: Date | null): string | null {
    if (!day) return null;

    const holidayLabel = this.getHolidayLabelMemo(day);

    if (this.hooks?.getDayCellTooltip) {
      const customTooltip = this.hooks.getDayCellTooltip(day, holidayLabel);
      if (customTooltip !== null) return customTooltip;
    }

    return holidayLabel;
  }

  formatDayNumber(day: Date | null): string {
    if (!day) return '';

    if (this.hooks?.formatDayNumber) {
      return this.hooks.formatDayNumber(day);
    }

    return day.getDate().toString();
  }

  /**
   * Generates an accessible label for a date cell.
   * Provides screen readers with a descriptive label for each selectable date.
   *
   * @param day - The date to generate a label for
   * @returns Localized date label (e.g., "Monday, January 15, 2024")
   *
   * @remarks
   * The label includes weekday, month, day, and year for full context.
   * Custom formatting can be provided via the formatAriaLabel hook.
   * This ensures screen reader users have complete information about each date.
   */
  getAriaLabel(day: Date | null): string {
    if (!day) return '';

    if (this.hooks?.formatAriaLabel) {
      return this.hooks.formatAriaLabel(day);
    }

    return day.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * ControlValueAccessor implementation: Writes a new value to the form control.
   * Called by Angular Forms when the form control value changes programmatically.
   *
   * @param val - The new value from the form control
   *
   * @remarks
   * This method:
   * - Normalizes the incoming value to ensure consistent format
   * - Initializes component state from the value
   * - Updates memoized signals for change detection
   * - Regenerates calendar to reflect the new value
   * - Notifies Material Form Field of state changes
   * - Syncs with Signal Form field if field input is used
   *
   * This is part of the ControlValueAccessor interface, enabling two-way binding
   * with both Reactive Forms and Template-driven Forms.
   */
  writeValue(val: DatepickerValue): void {
    const normalizedVal =
      val !== null && val !== undefined
        ? (this._normalizeValue(val) as DatepickerValue)
        : null;
    this._value = normalizedVal;
    this.initializeValue(normalizedVal);
    this._updateMemoSignals();
    this.generateCalendar();
    this.scheduleChangeDetection();
    this.stateChanges.next();

    if (this._field) {
      this.fieldSyncService.updateFieldFromInternal(normalizedVal, this._field);
    }
  }

  /**
   * ControlValueAccessor implementation: Registers a callback for value changes.
   * Called by Angular Forms to receive notifications when the user changes the value.
   *
   * @param fn - Callback function to call when value changes
   */
  registerOnChange(fn: (value: DatepickerValue) => void): void {
    this.onChange = fn;
  }

  /**
   * ControlValueAccessor implementation: Registers a callback for touched state.
   * Called by Angular Forms to receive notifications when the user interacts with the control.
   *
   * @param fn - Callback function to call when control is touched
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.disabled !== isDisabled) {
      this.disabled = isDisabled;
      this.stateChanges.next();
    }
  }

  /**
   * Emits a value change event and updates the internal state.
   * Handles normalization, form field synchronization, and calendar auto-close behavior.
   *
   * @param val - The new datepicker value (Date, Date range, or array of dates)
   *
   * @remarks
   * This method is the central point for value updates and ensures:
   * - Value normalization for consistent internal representation
   * - Signal Form field synchronization (if field input is used)
   * - Event emission for two-way binding
   * - Touch state tracking for form validation
   * - Automatic calendar closing for single date and complete range selections
   *
   * The calendar auto-closes when:
   * - Single date mode: After any date selection
   * - Range mode: After both start and end dates are selected
   * - Not in inline mode
   * - Not in time-only mode
   */
  private emitValue(val: DatepickerValue) {
    const normalizedVal =
      val !== null && val !== undefined
        ? (this._normalizeValue(val) as DatepickerValue)
        : null;

    this._value = normalizedVal;

    if (this._field) {
      this.fieldSyncService.updateFieldFromInternal(normalizedVal, this._field);
    }

    this.valueChange.emit(normalizedVal);
    this.onChange(normalizedVal);
    this.onTouched();
    if (this._field) {
      this.fieldSyncService.markAsTouched(this._field);
    }

    if (!this.isInlineMode && val !== null && !this.timeOnly) {
      if (
        this.mode === 'single' ||
        (this.mode === 'range' && this.startDate && this.endDate)
      ) {
        this.isCalendarOpen = false;
      }
    }
    this.stateChanges.next();
  }

  /**
   * Toggles the calendar popover open/closed state.
   * Handles focus management, accessibility announcements, and prevents rapid toggling.
   *
   * @param event - Optional event that triggered the toggle (used to prevent toggle on clear button clicks)
   *
   * @remarks
   * This method implements several important behaviors:
   * - Debouncing: Prevents rapid toggling within 300ms
   * - Focus management: Stores previous focus element for restoration
   * - Accessibility: Announces calendar state changes to screen readers
   * - Touch optimization: Sets up passive touch listeners for mobile devices
   *
   * When opening:
   * - Stores the currently focused element for restoration
   * - Sets up focus trap for keyboard navigation
   * - Announces calendar opening with current month/year
   *
   * When closing:
   * - Removes focus trap
   * - Restores focus to previous element
   * - Announces calendar closing
   */
  public toggleCalendar(event?: Event): void {
    if (this.disabled || this.isInlineMode) return;
    if (event?.target && (event.target as HTMLElement).closest('.ngxsmk-clear-button')) return;

    const now = Date.now();
    if (this.lastToggleTime > 0 && now - this.lastToggleTime < 300) return;

    if (!event) {
      this.applyToggleWithNoEvent(now);
      return;
    }
    if (event.type === 'touchstart') return;
    if (event.type === 'click' && this.shouldSkipClickToggle(event)) return;

    event.stopPropagation();
    const wasOpen = this.isCalendarOpen;
    const willOpen = !wasOpen;

    if (willOpen) {
      this.closeOtherCalendarInstances();
      if (this._field) this.syncFieldValue(this._field);
      this.applyDefaultMonthForOpen();
      this.applySmartViewModeForOpen();
      this.generateCalendar();
    }

    this.isCalendarOpen = !wasOpen;
    this.lastToggleTime = Date.now();
    this.updateOpeningState(willOpen && this.isCalendarOpen);
    this.announceAfterToggle(willOpen);
  }

  private applyToggleWithNoEvent(now: number): void {
    const wasOpen = this.isCalendarOpen;
    const willOpen = !wasOpen;
    this.isCalendarOpen = willOpen;
    this.lastToggleTime = now;
    if (willOpen) {
      this.closeMonthYearDropdowns();
      this.applyDefaultMonthForOpen();
      this.applySmartViewModeForOpen();
      this.generateCalendar();
    }
    this.updateOpeningState(willOpen && this.isCalendarOpen);
    if (willOpen && this.isCalendarOpen) {
      if (this.isBrowser && document.activeElement instanceof HTMLElement) {
        this.previousFocusElement = document.activeElement;
      }
      this.closeMonthYearDropdowns();
      if (this.isBrowser) {
        this.trackedDoubleRequestAnimationFrame(() => this.setupPassiveTouchListeners());
      }
      this.trackedSetTimeout(() => {
        this.setupFocusTrap();
        if (this.isBrowser) this.setupPassiveTouchListeners();
        this.closeMonthYearDropdowns();
        this.announceCalendarOpened();
      }, 100);
    } else if (!willOpen) {
      this.removeFocusTrap();
      this.announceCalendarClosed();
    }
  }

  private shouldSkipClickToggle(event: Event): boolean {
    const target = event.target as HTMLElement;
    if (
      this.allowTyping &&
      target?.tagName === 'INPUT' &&
      target.classList.contains('ngxsmk-display-input')
    ) {
      return true;
    }
    if (target?.closest('.ngxsmk-clear-button')) return true;
    const now = Date.now();
    const touchDetectionWindow = this.isMobileDevice() ? 600 : 300;
    if (this.touchStartElement && this.touchStartTime > 0) {
      const timeSinceTouch = now - this.touchStartTime;
      const sameElement =
        this.touchStartElement === event.target ||
        ((this.touchStartElement as Node).contains &&
          (this.touchStartElement as Node).contains!(event.target as Node));
      if (
        timeSinceTouch < touchDetectionWindow &&
        sameElement &&
        (this.isOpeningCalendar || (timeSinceTouch < 500 && this.isCalendarOpen))
      ) {
        return true;
      }
    }
    if (now - this.lastToggleTime < 300) return true;
    return false;
  }

  private applyDefaultMonthForOpen(): void {
    if (
      this.defaultMonthOffset !== 0 &&
      !this._value &&
      !this._startAtDate
    ) {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + this.defaultMonthOffset);
      nextMonth.setDate(1);
      this.currentDate = nextMonth;
      this._currentMonth = nextMonth.getMonth();
      this._currentYear = nextMonth.getFullYear();
      this._invalidateMemoCache();
    } else if (this.mode === 'range' && this.startDate) {
      this.currentDate = new Date(this.startDate);
      this._currentMonth = this.startDate.getMonth();
      this._currentYear = this.startDate.getFullYear();
      this._invalidateMemoCache();
    }
  }

  private applySmartViewModeForOpen(): void {
    if (this.mode === 'year') this.calendarViewMode = 'decade';
    else if (this.mode === 'month') this.calendarViewMode = 'year';
  }

  private announceAfterToggle(willOpen: boolean): void {
    if (willOpen && this.isCalendarOpen) {
      this.trackedSetTimeout(() => {
        this.setupFocusTrap();
        if (this.isBrowser) {
          this.setupPassiveTouchListeners();
          this.positionPopoverRelativeToInput();
          if (this._shouldAppendToBody) {
            this.trackedRequestAnimationFrame(() => {
              this.trackedRequestAnimationFrame(() => {
                this.positionPopoverRelativeToInput();
                this.revealBodyPopover();
              });
            });
          }
        }
        this.announceCalendarOpened();
      }, 50);
    } else if (!willOpen) {
      this.removeFocusTrap();
      this.announceCalendarClosed();
    }
  }

  private announceCalendarOpened(): void {
    const monthName = this.currentDate.toLocaleDateString(this.locale, {
      month: 'long',
    });
    const year = String(this.currentDate.getFullYear());
    const msg =
      this.getTranslation(
        'calendarOpened' as keyof DatepickerTranslations,
        undefined,
        { month: monthName, year },
      ) || `Calendar opened for ${monthName} ${year}`;
    this.ariaLiveService.announce(msg, 'polite');
  }

  private announceCalendarClosed(): void {
    const msg =
      this.getTranslation('calendarClosed' as keyof DatepickerTranslations) ||
      'Calendar closed';
    this.ariaLiveService.announce(msg, 'polite');
  }

  public onBackdropInteract(event: Event): void {
    event.stopPropagation();

    // Protection against ghost clicks immediately after opening
    const now = Date.now();
    const timeSinceToggle = now - this.lastToggleTime;
    const protectionTime = this.isMobileDevice() ? 600 : 300;

    if (timeSinceToggle < protectionTime) {
      return;
    }

    if (event instanceof KeyboardEvent) {
      event.preventDefault();
    }

    this.closeCalendarWithFocusRestore();
    this.lastToggleTime = now;
  }
  private scrollDebounceTimer: number | null = null;
  private readonly updatePositionOnScroll = (): void => {
    if (this.isCalendarOpen && this._shouldAppendToBody && this.isBrowser) {
      if (this.scrollDebounceTimer === null) {
        this.scrollDebounceTimer = requestAnimationFrame(() => {
          this.positionPopoverRelativeToInput();
          this.scrollDebounceTimer = null;
        });
      }
    }
  };

  private updateOpeningState(isOpening: boolean): void {
    if (isOpening) {
      if (this.isBrowser && this._shouldAppendToBody) {
        window.addEventListener('scroll', this.updatePositionOnScroll, { capture: true, passive: true });
        window.addEventListener('resize', this.updatePositionOnScroll, { passive: true });
      }

      this.isOpeningCalendar = true;

      // Handle Append To Body
      if (this._shouldAppendToBody) {
        this.renderInBody();
        if (this.isBrowser) {
          this.positionPopoverRelativeToInput();
        }
      }

      if (this.openCalendarTimeoutId) {
        clearTimeout(this.openCalendarTimeoutId);
      }

      const timeoutDelay = this.isMobileDevice() ? 150 : 60;
      this.openCalendarTimeoutId = this.trackedSetTimeout(() => {
        this.isOpeningCalendar = false;
        this.openCalendarTimeoutId = null;
        if (this._shouldAppendToBody && this.isBrowser) {
          this.positionPopoverRelativeToInput();
          this.revealBodyPopover();
        }
        this.cdr.markForCheck();
      }, timeoutDelay);
    } else {
      if (this.isBrowser) {
        window.removeEventListener('scroll', this.updatePositionOnScroll, { capture: true } as EventListenerOptions);
        window.removeEventListener('resize', this.updatePositionOnScroll);
      }

      this.isOpeningCalendar = false;

      // Cleanup Append To Body
      if (this.portalViewRef) {
        this.destroyBodyView();
      }

      if (this.openCalendarTimeoutId) {
        clearTimeout(this.openCalendarTimeoutId);
        this.openCalendarTimeoutId = null;
      }
    }
  }

  private renderInBody(): void {
    if (this.portalViewRef) return; // Already rendered

    // Create the view
    this.portalViewRef = this.portalTemplate.createEmbeddedView(null);

    // Attach to application logic for change detection
    this.appRef.attachView(this.portalViewRef);

    // Hide popover and set id before appending so it never flashes in the wrong place (e.g. outside modal)
    this.portalViewRef.rootNodes.forEach((node: Node) => {
      if (node instanceof HTMLElement) {
        const popover =
          node.classList?.contains('ngxsmk-popover-container')
            ? node
            : node.querySelector?.('.ngxsmk-popover-container');
        if (popover instanceof HTMLElement) {
          popover.style.setProperty('visibility', 'hidden', 'important');
          popover.id = this.popoverId;
        }
      }
      this.document.body.appendChild(node);
    });
    this.hideBodyPopoverUntilPositioned();
    this.cdr.markForCheck();
  }

  /** Hides the body-appended popover so loading/calendar are not visible at wrong position. */
  private hideBodyPopoverUntilPositioned(): void {
    if (!this.isBrowser) return;
    const popover = this.document.getElementById(this.popoverId);
    if (popover) {
      popover.style.setProperty('visibility', 'hidden', 'important');
    }
  }

  /** Shows the body-appended popover after positioning has been applied. */
  private revealBodyPopover(): void {
    if (!this.isBrowser) return;
    const popover = this.document.getElementById(this.popoverId);
    if (popover) {
      popover.style.setProperty('visibility', 'visible', 'important');
    }
  }

  private destroyBodyView(): void {
    if (this.portalViewRef) {
      this.appRef.detachView(this.portalViewRef);
      // Remove nodes (destroy does this usually if attached to VCR, but here we appended manually so we might need to remove unless detach handles it via cleanup?
      // createEmbeddedView returns a view that is not attached to VCR unless we call insert.
      // appRef.attachView enables CD.
      // destroy() removes it from DOM if it knew where it was? No, EmbeddedViewRef.destroy() removes from DOM if it was inserted via VCR.
      // Since we manually appended, we should manually remove.
      this.portalViewRef.rootNodes.forEach((node: Node) => {
        if (node.parentNode && 'remove' in node) {
          (node as ChildNode).remove();
        }
      });

      this.portalViewRef.destroy();
      this.portalViewRef = null;
    }
  }

  private closeCalendar(): void {
    if (!this.isInlineMode) {
      this.removeFocusTrap();
      this.closeCalendarWithFocusRestore();
      const calendarClosedMsg =
        this.getTranslation('calendarClosed' as keyof DatepickerTranslations) ||
        'Calendar closed';
      this.ariaLiveService.announce(calendarClosedMsg, 'polite');
      this.cdr.markForCheck();
    }
  }

  private shouldAutoClose(): boolean {
    if (
      !this.autoApplyClose ||
      this.showTime ||
      this.timeOnly ||
      this.isInlineMode
    ) {
      return false;
    }

    if (this.mode === 'single') {
      return this.selectedDate !== null;
    } else if (this.mode === 'range') {
      return this.startDate !== null && this.endDate !== null;
    }

    return false;
  }

  /**
   * Clears the selected date value(s) and resets the component state.
   * Emits null value and closes calendar if open.
   *
   * @param event - Optional event that triggered the clear action
   *
   * @remarks
   * This method:
   * - Clears all selected dates (single, range, multiple modes)
   * - Emits null value to form controls
   * - Closes calendar if open
   * - Provides haptic feedback on mobile if enabled
   * - Resets touch gesture state
   * - Announces clearing to screen readers
   *
   * Used by the clear button and can be called programmatically.
   */
  public clearValue(event?: MouseEvent | TouchEvent): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (this.disabled) return;

    if (this.enableHapticFeedback) {
      this.hapticFeedbackService.heavy();
    }

    this.clearTouchHandledFlag();
    this.clearValidationError();

    this.selectedDate = null;
    this.selectedDates = [];
    this.startDate = null;
    this.endDate = null;
    this.hoveredDate = null;
    this.isCalendarOpen = false;

    this.emitValue(null);
    this.action.emit({ type: 'clear', payload: null });
    this.currentDate = new Date();
    this._currentMonth = this.currentDate.getMonth();
    this._currentYear = this.currentDate.getFullYear();
    this._invalidateMemoCache();
    this.generateCalendar();
  }

  get currentMonth(): number {
    return this._currentMonth;
  }

  set currentMonth(month: number) {
    if (this.disabled) return;
    if (this._currentMonth !== month) {
      this._currentMonth = month;
      this._currentMonthSignal.set(month);
      // Fix: Normalize to 1st of month to prevent Date overflow (e.g., Jan 31 -> Feb would become Mar)
      this.currentDate = new Date(this.currentDate.getFullYear(), month, 1);
      this._invalidateMemoCache();
      this.generateCalendar();
    }
  }

  get currentYear(): number {
    return this._currentYear;
  }

  set currentYear(year: number) {
    if (this.disabled) return;
    if (this._currentYear !== year) {
      this._currentYear = year;
      this._currentYearSignal.set(year);
      // Fix: Normalize to 1st of month to prevent Date overflow (e.g., Feb 29 -> non-leap year)
      this.currentDate = new Date(year, this.currentDate.getMonth(), 1);
      this._invalidateMemoCache();
      this.generateCalendar();
    }
  }

  ngOnInit(): void {
    NgxsmkDatepickerComponent._allInstances.add(this);
    this.applyGlobalConfig();
    this.applyAnimationConfig();
    this._updateMemoSignals();

    if (
      this._locale === 'en-US' &&
      this.isBrowser &&
      typeof navigator !== 'undefined' &&
      navigator.language
    ) {
      this._locale = navigator.language;
    }

    this.initializeTranslations();
    if (this.timeOnly) this.showTime = true;
    this.updateRtlState();
    this.today.setHours(0, 0, 0, 0);
    this.generateLocaleData();
    this.generateTimeOptions();
    this.generateYearGrid();
    this.generateDecadeGrid();
    if (this.calendarViewMode === 'timeline') this.generateTimeline();
    if (
      this.calendarViewMode === 'time-slider' &&
      this.mode === 'range' &&
      this.showTime
    ) {
      this.initializeTimeSliders();
    }

    this.initializeTimeFromNowIfNeeded();
    const initialValue = this.resolveInitialValue();
    if (initialValue) {
      this.initializeValue(initialValue);
      this._value = initialValue;
    } else {
      this.initializeValue(null);
    }
    this.generateCalendar();
    if (this._field && this.isBrowser) this.debouncedFieldSync();
  }

  private initializeTimeFromNowIfNeeded(): void {
    if (!(this.showTime || this.timeOnly) || this._value) return;
    const now = new Date();
    this.currentHour = now.getHours();
    this.currentMinute =
      Math.floor(now.getMinutes() / this.minuteInterval) * this.minuteInterval;
    if (this.currentMinute === 60) {
      this.currentMinute = 0;
      this.currentHour = (this.currentHour + 1) % 24;
    }
    this.update12HourState(this.currentHour);
    if (this.timeOnly && !this._value) {
      const today = new Date();
      today.setHours(this.currentHour, this.currentMinute, 0, 0);
      this.selectedDate = today;
      this.currentDate = new Date(today);
      this._currentMonth = today.getMonth();
      this._currentYear = today.getFullYear();
      this._invalidateMemoCache();
    }
  }

  private resolveInitialValue(): DatepickerValue {
    if (!this._field) return this._value ?? null;
    const fromField = this.resolveInitialValueFromField();
    return fromField ?? this._value ?? null;
  }

  private resolveInitialValueFromField(): DatepickerValue | null {
    try {
      let resolved: unknown = this._field;
      if (
        typeof resolved === 'function' &&
        !('set' in resolved) &&
        !('update' in resolved)
      ) {
        try {
          const res = (resolved as () => unknown)();
          if (res && typeof res === 'object') resolved = res;
        } catch {
          /* ignore */
        }
      }
      if (resolved && typeof resolved === 'object') {
        const rf = resolved as Record<string, unknown>;
        const fieldValue =
          typeof rf['value'] === 'function'
            ? (rf['value'] as () => unknown)()
            : rf['value'];
        return this._normalizeValue(fieldValue);
      }
    } catch {
      /* ignore */
    }
    return null;
  }

  ngAfterViewInit(): void {
    if (this.allowTyping && this.displayValue) {
      this.typedInputValue = this.displayValue;
    }

    if (this.isBrowser) {
      this.trackedDoubleRequestAnimationFrame(() => {
        this.setupPassiveTouchListeners();
        this.setupInputGroupPassiveListeners();
        this.setupLazyLoadingObserver();

        this.trackedSetTimeout(() => {
          this.setupInputGroupPassiveListeners();
        }, 100);
      });

      if (this._field) {
        this.trackedDoubleRequestAnimationFrame(() => {
          this.syncFieldValue(this._field);
        });

        this.debouncedFieldSync(100);
      }
    }
  }

  private setupInputGroupPassiveListeners(): void {
    const nativeElement = this.elementRef?.nativeElement;
    if (!nativeElement) {
      this.trackedSetTimeout(() => this.setupInputGroupPassiveListeners(), 50);
      return;
    }

    const inputGroup = nativeElement.querySelector(
      '.ngxsmk-input-group',
    ) as HTMLElement;
    if (!inputGroup) {
      this.trackedSetTimeout(() => this.setupInputGroupPassiveListeners(), 50);
      return;
    }

    if (this.touchListenersSetup.get(inputGroup)) {
      return;
    }
    this.touchListenersSetup.set(inputGroup, true);

    const touchStartHandler = (event: TouchEvent) => {
      this.onTouchStart(event);
    };
    inputGroup.addEventListener('touchstart', touchStartHandler, {
      passive: true,
    });

    const touchEndHandler = (event: TouchEvent) => {
      this.onTouchEnd(event);
    };
    inputGroup.addEventListener('touchend', touchEndHandler, { passive: true });
    this.passiveTouchListeners.push(() => {
      this.touchListenersSetup.delete(inputGroup);
      inputGroup.removeEventListener('touchstart', touchStartHandler);
      inputGroup.removeEventListener('touchend', touchEndHandler);
    });
  }

  private _touchListenersSetupTimeout: ReturnType<typeof setTimeout> | null =
    null;

  /**
   * Sets up passive touch event listeners on calendar day cells for improved mobile performance.
   * Implements retry logic to handle cases where DOM elements aren't immediately available.
   * All listeners are tracked for proper cleanup on component destroy.
   */
  private setupPassiveTouchListeners(): void {
    if (!this.isBrowser) return;

    this.passiveTouchListeners.forEach((cleanup) => cleanup());
    this.passiveTouchListeners = [];

    const nativeElement = this.elementRef?.nativeElement;
    if (!nativeElement) return;

    if (this._touchListenersSetupTimeout) {
      return;
    }

    this._touchListenersSetupTimeout = this.trackedSetTimeout(() => {
      this._touchListenersSetupTimeout = null;
      if (!this.isBrowser || !nativeElement) return;

      const dateCells = nativeElement.querySelectorAll(
        '.ngxsmk-day-cell[data-date]',
      );

      if (dateCells.length > 0) {
        this.attachTouchListenersToCells(dateCells);
      } else if (this.isCalendarOpen) {
        let retryCount = 0;
        const maxRetries = 5;
        let retryTimeoutId: ReturnType<typeof setTimeout> | null = null;

        const retry = () => {
          if (!this.isBrowser || !nativeElement || !this.isCalendarOpen) {
            if (retryTimeoutId) {
              this.activeTimeouts.delete(retryTimeoutId);
              clearTimeout(retryTimeoutId);
            }
            return;
          }

          retryCount++;
          const dateCellsRetry = nativeElement.querySelectorAll(
            '.ngxsmk-day-cell[data-date]',
          );
          if (dateCellsRetry.length > 0) {
            this.attachTouchListenersToCells(dateCellsRetry);
            retryTimeoutId = null;
          } else if (retryCount < maxRetries && this.isCalendarOpen) {
            retryTimeoutId = this.trackedSetTimeout(retry, 50);
          } else {
            retryTimeoutId = null;
          }
        };
        retryTimeoutId = this.trackedSetTimeout(retry, 50);
      }
    }, 10);
  }

  private attachTouchListenersToCells(dateCells: NodeListOf<Element>): void {
    dateCells.forEach((cellEl: Element) => {
      const cell = cellEl as HTMLElement;
      const dateTimestamp = cell.dataset['date'];
      if (!dateTimestamp) return;

      const dateValue = Number.parseInt(dateTimestamp, 10);
      if (Number.isNaN(dateValue)) return;

      const day = new Date(dateValue);
      if (!day || Number.isNaN(day.getTime())) return;

      if (this.touchListenersAttached.get(cell)) {
        return;
      }
      this.touchListenersAttached.set(cell, true);

      const touchStartHandler = (event: TouchEvent) => {
        this.onDateCellTouchStart(event, day);
      };
      cell.addEventListener('touchstart', touchStartHandler, { passive: true });

      const touchEndHandler = (event: TouchEvent) => {
        this.onDateCellTouchEnd(event, day);
      };
      cell.addEventListener('touchend', touchEndHandler, { passive: true });

      const touchMoveHandler = (event: TouchEvent) => {
        this.onDateCellTouchMove(event);
      };
      cell.addEventListener('touchmove', touchMoveHandler, { passive: true });

      this.passiveTouchListeners.push(() => {
        this.touchListenersAttached.delete(cell);
        cell.removeEventListener('touchstart', touchStartHandler);
        cell.removeEventListener('touchend', touchEndHandler);
        cell.removeEventListener('touchmove', touchMoveHandler);
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.validateInputs(changes);
    let needsChangeDetection = false;

    if (changes['timeOnly']) {
      if (this.timeOnly) {
        this.showTime = true;
        this.generateTimeOptions();
      }
      needsChangeDetection = true;
    }
    if (changes['mode']) {
      this.initializeValue(this._value);
      this.generateCalendar();
      needsChangeDetection = true;
    }
    if (changes['locale'] || changes['rtl']) {
      needsChangeDetection = this.handleChangesLocaleRtl(changes) || needsChangeDetection;
    }
    if (
      changes['weekStart'] ||
      changes['minuteInterval'] ||
      changes['holidayProvider'] ||
      changes['yearRange'] ||
      changes['timezone'] ||
      changes['use24Hour']
    ) {
      needsChangeDetection =
        this.handleChangesWeekStartAndRelated(changes) || needsChangeDetection;
    }

    if (needsChangeDetection) this.scheduleChangeDetection();
    if (changes['field']) this.handleChangesField(changes);
    if (changes['value']) this.handleChangesValue(changes);
    if (
      changes['holidayProvider'] ||
      changes['disableHolidays'] ||
      changes['disabledDates'] ||
      changes['disabledRanges']
    ) {
      this._updateMemoSignals();
      this.generateCalendar();
      this.cdr.markForCheck();
    }
    if (changes['translations'] || changes['translationService']) {
      this.initializeTranslations();
      this.scheduleChangeDetection();
    }
    if (changes['startAt']) this.handleChangesStartAt();
    if (changes['minDate']) this.handleChangesMinDate();
    if (changes['maxDate']) {
      this.generateCalendar();
      this.cdr.markForCheck();
    }
    if (changes['calendarViewMode']) this.handleChangesCalendarViewMode();
    this.handleChangesShowTimeInlineAndLayout(changes);
  }

  private handleChangesShowTimeInlineAndLayout(changes: SimpleChanges): void {
    if (changes['showTime'] || changes['showSeconds']) {
      if (this.showTime) {
        this.generateTimeOptions();
        this.update12HourState(this.currentHour);
      }
      this.cdr.markForCheck();
    }
    if (changes['inline']) {
      if (this.isInlineMode) this.generateCalendar();
      this.cdr.markForCheck();
    }
    if (
      changes['calendarLayout'] ||
      changes['calendarCount'] ||
      changes['showCalendarButton'] ||
      changes['allowTyping'] ||
      changes['align'] ||
      changes['useNativePicker'] ||
      changes['theme']
    ) {
      this.generateCalendar();
      this.cdr.markForCheck();
    }
  }

  private handleChangesLocaleRtl(changes: SimpleChanges): boolean {
    this.updateRtlState();
    if (changes['locale']) {
      this.clearActiveTimeouts();
      this.calendarGenerationService.clearCache();
      this.initializeTranslations();
      this.generateLocaleData();
      this._invalidateMemoCache();
      this.generateCalendar();
    }
    return true;
  }

  private handleChangesWeekStartAndRelated(changes: SimpleChanges): boolean {
    this.applyGlobalConfig();
    if (changes['weekStart'] || changes['yearRange']) {
      if (changes['weekStart']) {
        this.clearActiveTimeouts();
        this.calendarGenerationService.clearCache();
      }
      this.generateLocaleData();
      this._invalidateMemoCache();
      this.generateCalendar();
      if (changes['weekStart']) this.clearActiveTimeouts();
    }
    this.applyChangesMinuteAnd24Hour(changes);
    if (changes['minuteInterval']) {
      this.currentMinute =
        Math.floor(this.currentMinute / this.minuteInterval) *
        this.minuteInterval;
      this.timeChange();
      return false;
    }
    if (changes['yearRange']) this.generateDropdownOptions();
    return true;
  }

  private applyChangesMinuteAnd24Hour(changes: SimpleChanges): void {
    if (changes['minuteInterval'] || changes['use24Hour']) {
      this.generateTimeOptions();
      if (changes['use24Hour']) this.update12HourState(this.currentHour);
    }
  }

  private handleChangesField(changes: SimpleChanges): void {
    const newField = changes['field']?.currentValue;
    if (newField && typeof newField === 'object') {
      this.syncFieldValue(newField);
      if (this.isBrowser) this.debouncedFieldSync(50);
    }
  }

  private handleChangesValue(changes: SimpleChanges): void {
    if (this._field) return;
    const newValue = changes['value']?.currentValue;
    if (this.isValueEqual(newValue, this._value)) return;
    this._value = newValue;
    this.initializeValue(newValue);
    this.generateCalendar();
    this.cdr.markForCheck();
  }

  private handleChangesStartAt(): void {
    if (!this._value && this._startAtDate) {
      this.currentDate = new Date(this._startAtDate);
      this._currentMonth = this.currentDate.getMonth();
      this._currentYear = this.currentDate.getFullYear();
      this.generateCalendar();
      this.cdr.markForCheck();
    }
  }

  private handleChangesMinDate(): void {
    this.generateCalendar();
    this.cdr.markForCheck();
    if (!this._value && this._minDate) {
      const today = new Date();
      const minDateOnly = getStartOfDay(this._minDate);
      const todayOnly = getStartOfDay(today);
      if (minDateOnly.getTime() > todayOnly.getTime()) {
        this.currentDate = new Date(this._minDate);
        this._currentMonth = this.currentDate.getMonth();
        this._currentYear = this.currentDate.getFullYear();
        this.generateCalendar();
        this.cdr.markForCheck();
      }
    }
  }

  private handleChangesCalendarViewMode(): void {
    if (this.calendarViewMode === 'year') this.generateYearGrid();
    else if (this.calendarViewMode === 'decade') this.generateDecadeGrid();
    else if (this.calendarViewMode === 'timeline') this.generateTimeline();
    else if (this.calendarViewMode === 'time-slider') this.initializeTimeSliders();
    else this.generateCalendar();
    this.cdr.markForCheck();
  }

  /**
   * Validates component inputs for conflicts and invalid combinations.
   * Logs warnings in development mode when invalid configurations are detected.
   *
   * @param changes - The SimpleChanges object from ngOnChanges
   */
  private validateInputs(changes: SimpleChanges): void {
    this.validateInputsMinMaxDate(changes);
    this.validateInputsTimeOnly(changes);
    this.validateInputsIntervals(changes);
    this.validateInputsYearRange(changes);
  }

  private validateInputsMinMaxDate(changes: SimpleChanges): void {
    if (!changes['minDate'] && !changes['maxDate']) return;
    if (!this._minDate || !this._maxDate) return;
    const minStart = getStartOfDay(this._minDate);
    const maxStart = getStartOfDay(this._maxDate);
    if (minStart.getTime() <= maxStart.getTime()) return;
    if (isDevMode()) {
      console.warn(
        '[ngxsmk-datepicker] minDate is greater than maxDate. ' +
        `minDate: ${this._minDate.toISOString()}, maxDate: ${this._maxDate.toISOString()}. ` +
        'Adjusting maxDate to be at least 1 day after minDate.',
      );
    }
    const adjustedMaxDate = new Date(minStart);
    adjustedMaxDate.setDate(adjustedMaxDate.getDate() + 1);
    this._maxDate = adjustedMaxDate;
    this._updateMemoSignals();
    this._invalidateMemoCache();
  }

  private validateInputsTimeOnly(changes: SimpleChanges): void {
    if (!changes['timeOnly'] || !this.timeOnly || this.mode === 'single') return;
    if (isDevMode()) {
      console.warn(
        '[ngxsmk-datepicker] timeOnly is only supported with mode="single". ' +
        `Current mode: "${this.mode}". timeOnly will be disabled.`,
      );
    }
    this.timeOnly = false;
  }

  private validateInputsIntervals(changes: SimpleChanges): void {
    if (changes['minuteInterval'] && this.minuteInterval < 1) {
      if (isDevMode()) {
        console.warn(
          `[ngxsmk-datepicker] minuteInterval must be at least 1. Received: ${this.minuteInterval}. Setting to 1.`,
        );
      }
      this.minuteInterval = 1;
    }
    if (changes['secondInterval'] && this.secondInterval < 1) {
      if (isDevMode()) {
        console.warn(
          `[ngxsmk-datepicker] secondInterval must be at least 1. Received: ${this.secondInterval}. Setting to 1.`,
        );
      }
      this.secondInterval = 1;
    }
  }

  private validateInputsYearRange(changes: SimpleChanges): void {
    if (!changes['yearRange'] || this.yearRange >= 1) return;
    if (isDevMode()) {
      console.warn(
        `[ngxsmk-datepicker] yearRange must be at least 1. Received: ${this.yearRange}. Setting to 1.`,
      );
    }
    this.yearRange = 1;
  }

  private initializeTimeSliders(): void {
    if (this.mode === 'range' && this.showTime) {
      if (this.startDate) {
        this.startTimeSlider =
          this.startDate.getHours() * 60 + this.startDate.getMinutes();
      }
      if (this.endDate) {
        this.endTimeSlider =
          this.endDate.getHours() * 60 + this.endDate.getMinutes();
      } else {
        this.endTimeSlider = 1440;
      }
    }
  }

  private get24Hour(displayHour: number, isPm: boolean): number {
    return get24Hour(displayHour, isPm);
  }

  private update12HourState(fullHour: number): void {
    if (this.use24Hour) {
      this.currentDisplayHour = fullHour;
      this.isPm = false;
    } else {
      const state = update12HourState(fullHour);
      this.isPm = state.isPm;
      this.currentDisplayHour = state.displayHour;
    }
  }

  private applyCurrentTime(date: Date): Date {
    if (this.use24Hour) {
      this.currentHour = this.currentDisplayHour;
    } else {
      this.currentHour = this.get24Hour(this.currentDisplayHour, this.isPm);
    }
    const newDate = new Date(date);
    newDate.setHours(this.currentHour, this.currentMinute, 0, 0);
    return newDate;
  }

  private applyTimeIfNeeded(date: Date): Date {
    if (this.showTime || this.timeOnly) {
      return this.applyCurrentTime(date);
    }
    return getStartOfDay(date);
  }

  /**
   * Initializes the component's internal state from a DatepickerValue.
   * Sets up selected dates, calendar view position, and time values based on the provided value.
   *
   * @param value - The datepicker value to initialize from (Date, range, array, or null)
   *
   * @remarks
   * This method handles initialization for all selection modes:
   * - Single mode: Sets selectedDate
   * - Range mode: Sets startDate and endDate
   * - Multiple mode: Sets selectedDates array
   *
   * The method also:
   * - Determines the calendar view center date (uses value, startAt, or minDate as fallback)
   * - Extracts and sets time values if the date includes time information
   * - Normalizes all dates to ensure consistent internal representation
   *
   * Performance: O(1) for single/range, O(n) for multiple mode where n = array length
   */
  private initializeValue(value: DatepickerValue): void {
    const initialDate = this.applyValueToSelection(value);
    const viewCenterDate = this.resolveViewCenterDate(initialDate);
    if (viewCenterDate) {
      this.currentDate = new Date(viewCenterDate);
      this._currentMonth = viewCenterDate.getMonth();
      this._currentYear = viewCenterDate.getFullYear();
      this.currentHour = viewCenterDate.getHours();
      this.currentMinute = viewCenterDate.getMinutes();
      this.update12HourState(this.currentHour);
      this.currentMinute =
        Math.floor(this.currentMinute / this.minuteInterval) *
        this.minuteInterval;
    }
  }

  private applyValueToSelection(value: DatepickerValue): Date | null {
    this.selectedDate = null;
    this.startDate = null;
    this.endDate = null;
    this.selectedDates = [];
    if (!value) return null;
    if (this.mode === 'single' && value instanceof Date) {
      this.selectedDate = this._normalizeDate(value);
      return this.selectedDate;
    }
    if (
      this.mode === 'range' &&
      typeof value === 'object' &&
      'start' in value &&
      'end' in value
    ) {
      const range = value as { start: Date; end: Date };
      this.startDate = this._normalizeDate(range.start);
      this.endDate = this._normalizeDate(range.end);
      return this.startDate;
    }
    if (this.mode === 'multiple' && Array.isArray(value)) {
      this.selectedDates = (value as Date[])
        .map((d) => this._normalizeDate(d))
        .filter((d): d is Date => d !== null);
      return this.selectedDates.length > 0
        ? this.selectedDates[this.selectedDates.length - 1]!
        : null;
    }
    return null;
  }

  private resolveViewCenterDate(initialDate: Date | null): Date | null {
    let viewCenterDate = initialDate || this._startAtDate;
    if (!viewCenterDate && this._minDate) {
      const today = new Date();
      const minDateOnly = getStartOfDay(this._minDate);
      const todayOnly = getStartOfDay(today);
      if (minDateOnly.getTime() > todayOnly.getTime()) {
        viewCenterDate = this._minDate;
      }
    }
    if (
      (this.isCalendarOpen || this.isInlineMode) &&
      this.currentDate &&
      this.mode === 'range' &&
      this.startDate &&
      this.endDate
    ) {
      const isStartVisible = this.isCurrentMonth(this.startDate);
      const isEndVisible = this.isCurrentMonth(this.endDate);
      if (isStartVisible || isEndVisible) viewCenterDate = null;
    }
    return viewCenterDate;
  }

  private _normalizeDate(date: DateInput | null): Date | null {
    return normalizeDate(date);
  }

  /**
   * Normalizes various date input formats into a consistent DatepickerValue type.
   * Handles Date objects, Moment.js objects, date ranges, arrays, and strings.
   *
   * @param val - The value to normalize (can be Date, Moment, range object, array, or string)
   * @returns Normalized DatepickerValue (Date, range object, array, or null)
   *
   * @remarks
   * This method provides flexible input handling to support:
   * - Native JavaScript Date objects
   * - Moment.js objects (with timezone preservation)
   * - Date range objects: { start: Date, end: Date }
   * - Arrays of dates for multiple selection mode
   * - String dates with custom format parsing
   *
   * Invalid or unparseable values are normalized to null.
   * This ensures type safety and consistent internal state representation.
   */
  private _normalizeValue(val: unknown): DatepickerValue {
    if (val === null || val === undefined) return null;
    if (val instanceof Date) {
      return this._normalizeDate(val) as DatepickerValue;
    }
    if (this.isMomentObject(val)) {
      const momentObj = val as {
        toDate: () => Date;
        utcOffset?: () => number;
        format?: (format: string) => string;
      };
      return this._normalizeDate(this.momentToDate(momentObj)) as DatepickerValue;
    }
    if (
      typeof val === 'object' &&
      val !== null &&
      'start' in val &&
      'end' in val
    ) {
      return this._normalizeRangeValue(val as { start: unknown; end: unknown });
    }
    if (Array.isArray(val)) {
      return this._normalizeArrayValue(val);
    }
    if (typeof val === 'string' && this.displayFormat) {
      const parsed = this.parsingService.parseCustomDateString(
        val,
        this.displayFormat,
      );
      return parsed as DatepickerValue;
    }
    if (
      typeof val === 'string' ||
      (typeof val === 'object' && val !== null && 'getTime' in val)
    ) {
      const normalized = this._normalizeDate(val as DateInput);
      return normalized as DatepickerValue;
    }
    return null;
  }

  private _normalizeRangeValue(range: {
    start: unknown;
    end: unknown;
  }): DatepickerValue {
    const start = this.isMomentObject(range.start)
      ? this._normalizeDate(
        this.momentToDate(range.start as {
          toDate: () => Date;
          utcOffset?: () => number;
          format?: (format: string) => string;
        }),
      )
      : this._normalizeDate(range.start as DateInput);
    const end = this.isMomentObject(range.end)
      ? this._normalizeDate(
        this.momentToDate(range.end as {
          toDate: () => Date;
          utcOffset?: () => number;
          format?: (format: string) => string;
        }),
      )
      : this._normalizeDate(range.end as DateInput);
    if (start && end) return { start, end } as DatepickerValue;
    return null;
  }

  private _normalizeArrayValue(val: unknown[]): DatepickerValue {
    const dates = val
      .map((d) => {
        if (this.isMomentObject(d)) {
          return this._normalizeDate(
            this.momentToDate(d as {
              toDate: () => Date;
              utcOffset?: () => number;
              format?: (format: string) => string;
            }),
          );
        }
        return this._normalizeDate(d as DateInput);
      })
      .filter((d): d is Date => d !== null);
    return dates as DatepickerValue;
  }

  /**
   * Check if the provided value is a Moment.js object
   */
  private isMomentObject(val: unknown): boolean {
    if (!val || typeof val !== 'object') {
      return false;
    }
    const obj = val as Record<string, unknown>;
    return (
      typeof obj['format'] === 'function' &&
      typeof obj['toDate'] === 'function' &&
      typeof obj['isMoment'] === 'function' &&
      typeof (obj['isMoment'] as () => boolean)() === 'boolean' &&
      (obj['isMoment'] as () => boolean)() === true
    );
  }

  /**
   * Convert a Moment.js object to a Date, preserving timezone offset
   */
  private momentToDate(momentObj: {
    toDate: () => Date;
    utcOffset?: () => number;
    format?: (format: string) => string;
  }): Date {
    if (
      typeof momentObj.utcOffset === 'function' &&
      typeof momentObj.format === 'function'
    ) {
      const offset = momentObj.utcOffset();
      if (offset !== undefined && offset !== null) {
        try {
          const formatted = momentObj.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
          const date = new Date(formatted);
          if (!Number.isNaN(date.getTime())) {
            return date;
          }
        } catch { }
      }
    }
    return momentObj.toDate();
  }

  /**
   * Compares two DatepickerValue objects for equality.
   * Handles Date objects, range objects, and arrays with proper date comparison.
   *
   * @param val1 - First value to compare
   * @param val2 - Second value to compare
   * @returns true if values represent the same date(s), false otherwise
   *
   * @remarks
   * This method performs deep equality checks:
   * - For Date objects: Compares using date comparator (handles time normalization)
   * - For range objects: Compares both start and end dates
   * - For arrays: Compares lengths and all elements
   * - Handles null/undefined values correctly
   *
   * Uses the dateComparator utility for efficient date comparisons that
   * normalize times to start of day for accurate day-level equality.
   */
  private isValueEqual(val1: DatepickerValue, val2: DatepickerValue): boolean {
    if (val1 === val2) return true;
    if (val1 === null || val2 === null) return val1 === val2;

    if (val1 instanceof Date && val2 instanceof Date) {
      return val1.getTime() === val2.getTime();
    }

    if (
      typeof val1 === 'object' &&
      typeof val2 === 'object' &&
      'start' in val1 &&
      'end' in val1 &&
      'start' in val2 &&
      'end' in val2
    ) {
      const r1 = val1 as { start: Date; end: Date };
      const r2 = val2 as { start: Date; end: Date };
      return (
        r1.start.getTime() === r2.start.getTime() &&
        r1.end.getTime() === r2.end.getTime()
      );
    }

    if (Array.isArray(val1) && Array.isArray(val2)) {
      if (val1.length !== val2.length) return false;
      return val1.every((d1, i) => {
        const d2 = val2[i];
        return d1 && d2 && d1.getTime() === d2.getTime();
      });
    }

    return false;
  }

  /**
   * Parses a date string, optionally using the configured date adapter with error callback.
   * Falls back to native Date parsing if no adapter is configured.
   *
   * @param dateString - The date string to parse
   * @returns Parsed Date object or null if parsing fails
   *
   * @remarks
   * If a date adapter is configured via globalConfig, it will be used for parsing
   * with error callbacks. Otherwise, native Date parsing is used.
   * Error callbacks allow consumers to handle parsing failures gracefully.
   */

  onInputFocus(event: FocusEvent): void {
    // Prevent keyboard on mobile when calendar should open instead
    if (this.isMobileDevice() && !this.allowTyping && !this.isInlineMode) {
      (event.target as HTMLInputElement).blur();
      this.toggleCalendar(event);
      return;
    }
    if (!this._focused) {
      this._focused = true;
      this.stateChanges.next();
    }
    if (!this.allowTyping) return;
    this.isTyping = true;
    if (!this.typedInputValue || this.typedInputValue === '') {
      this.typedInputValue = this.displayValue || '';
    }
  }

  /**
   * Sanitizes user input to prevent XSS attacks.
   * Removes potentially dangerous characters while preserving valid date/time input.
   *
   * @param input - Raw user input string
   * @returns Sanitized string safe for template interpolation
   *
   * @remarks
   * This method provides basic XSS protection by removing:
   * - HTML tag delimiters (< and >)
   * - Script event handlers (onerror, onclick, etc.)
   * - JavaScript protocol (javascript:)
   * - Data URIs that could contain scripts
   *
   * Note: Angular's template interpolation provides additional protection,
   * but this sanitization adds an extra layer of defense for user-provided strings.
   * For comprehensive sanitization, Angular's DomSanitizer should be used for
   * any HTML content, but for date/time strings, this level of sanitization is sufficient.
   */
  private sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // Remove HTML tag delimiters
    let sanitized = input.replaceAll(/[<>]/g, '');

    // Remove script event handlers (onerror, onclick, onload, etc.)
    sanitized = sanitized.replaceAll(/on\w+\s*=/gi, '');

    // Remove dangerous protocols (javascript:, vbscript:, data:)
    sanitized = sanitized.replaceAll(/\b(?:javascript|vbscript|data)\s*:/gi, '');

    // Remove control characters
    // eslint-disable-next-line no-control-regex
    sanitized = sanitized.replaceAll(/[\u0000-\u001F\u007F]/g, '');

    // Remove quotes/backticks/equals to prevent attribute injection
    sanitized = sanitized.replaceAll(/[`"'=]/g, '');

    // Trim whitespace
    return sanitized.trim();
  }

  onInputChange(event: Event): void {
    if (!this.allowTyping) return;
    const input = event.target as HTMLInputElement;
    const value = this.sanitizeInput(input.value);

    if (this.displayFormat) {
      this.typedInputValue = this.applyInputMask(value, this.displayFormat);
    } else {
      this.typedInputValue = value;
    }

    if (input.value !== this.typedInputValue) {
      const cursorPosition = input.selectionStart || 0;
      input.value = this.typedInputValue;
      this.trackedSetTimeout(() => {
        input.setSelectionRange(cursorPosition, cursorPosition);
      }, 0);
    }

    this.scheduleChangeDetection();
  }

  onInputBlur(event: FocusEvent): void {
    const relatedTarget = event.relatedTarget as HTMLElement;
    const isMovingWithinComponent =
      relatedTarget && this.elementRef?.nativeElement?.contains(relatedTarget);

    if (!isMovingWithinComponent && this._focused) {
      this._focused = false;
      this.stateChanges.next();
      this.onTouched();
      if (this._field) {
        this.fieldSyncService.markAsTouched(this._field);
      }
    }

    if (!this.allowTyping) return;
    this.isTyping = false;
    const input = event.target as HTMLInputElement;
    const value = this.sanitizeInput(input.value);

    if (!value) {
      this.clearValue();
      this.typedInputValue = '';
      this.clearValidationError();
      this.scheduleChangeDetection();
      return;
    }

    const parsedDate = this.parsingService.parseTypedInput(
      value,
      this.displayFormat,
    );

    if (parsedDate && this.isValidDate(parsedDate)) {
      this.clearValidationError();
      this.applyTypedDate(parsedDate);
      this.typedInputValue = this.displayValue;
    } else {
      this.applyValidationErrorForBlur(parsedDate);
      this.typedInputValue = this.displayValue;
      this.scheduleChangeDetection();
    }
  }

  private applyValidationErrorForBlur(parsedDate: Date | null): void {
    if (parsedDate) {
      if (this._minDate && parsedDate < this._minDate) {
        const minFormatted = this.parsingService.formatDateWithPattern(
          this._minDate,
          this.displayFormat ?? 'MM/DD/YYYY',
        );
        const msg =
          this.getTranslation(
            'dateBeforeMin' as keyof DatepickerTranslations,
            undefined,
            { minDate: minFormatted },
          ) || `Date must be on or after ${minFormatted}.`;
        this.setValidationError('dateBeforeMin', msg);
      } else if (this._maxDate && parsedDate > this._maxDate) {
        const maxFormatted = this.parsingService.formatDateWithPattern(
          this._maxDate,
          this.displayFormat ?? 'MM/DD/YYYY',
        );
        const msg =
          this.getTranslation(
            'dateAfterMax' as keyof DatepickerTranslations,
            undefined,
            { maxDate: maxFormatted },
          ) || `Date must be on or before ${maxFormatted}.`;
        this.setValidationError('dateAfterMax', msg);
      } else {
        const msg =
          this.getTranslation(
            'invalidDate' as keyof DatepickerTranslations,
          ) || 'Invalid date.';
        this.setValidationError('invalidDate', msg);
      }
    } else {
      const msg =
        this.getTranslation(
          'invalidDateFormat' as keyof DatepickerTranslations,
        ) || 'Please enter a valid date.';
      this.setValidationError('invalidDateFormat', msg);
    }
  }

  onInputKeyDown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (!this.allowTyping) {
      if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
        this.toggleCalendar(keyboardEvent);
        if (keyboardEvent.key === ' ') {
          keyboardEvent.preventDefault();
        }
      }
      return;
    }

    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();
      const input = keyboardEvent.target as HTMLInputElement;
      const value = this.sanitizeInput(input.value);

      if (!value) {
        this.clearValue();
        this.typedInputValue = '';
        return;
      }

      const parsedDate = this.parsingService.parseTypedInput(
        value,
        this.displayFormat,
      );
      if (parsedDate !== null && this.isValidDate(parsedDate)) {
        this.applyTypedDate(parsedDate);
        this.typedInputValue = this.displayValue;
        input.blur();
      } else {
        this.typedInputValue = this.displayValue;
        this.scheduleChangeDetection();
      }
    } else if (keyboardEvent.key === 'Escape') {
      this.typedInputValue = this.displayValue;
      const input = keyboardEvent.target as HTMLInputElement;
      input.blur();
      this.scheduleChangeDetection();
    }
  }

  private applyInputMask(value: string, format: string): string {
    const digits = value.replaceAll(/[^\d]/g, '');
    let masked = '';
    let digitIndex = 0;
    let i = 0;

    while (i < format.length && digitIndex < digits.length) {
      if (format.substring(i, i + 4) === 'YYYY') {
        const yearDigits = digits.substring(digitIndex, digitIndex + 4);
        masked += yearDigits.padEnd(4, '0');
        digitIndex += Math.min(4, digits.length - digitIndex);
        i += 4;
      } else if (
        format.substring(i, i + 2) === 'YY' ||
        format.substring(i, i + 2) === 'MM' ||
        format.substring(i, i + 2) === 'DD' ||
        format.substring(i, i + 2) === 'HH' ||
        format.substring(i, i + 2) === 'hh' ||
        format.substring(i, i + 2) === 'mm' ||
        format.substring(i, i + 2) === 'ss'
      ) {
        const tokenDigits = digits.substring(digitIndex, digitIndex + 2);
        masked += tokenDigits.padEnd(2, '0');
        digitIndex += Math.min(2, digits.length - digitIndex);
        i += 2;
      } else {
        masked += format[i];
        i++;
      }
    }

    return masked;
  }

  private isValidDate(date: Date): boolean {
    if (!date || Number.isNaN(date.getTime())) return false;

    if (this._minDate && date < this._minDate) return false;
    if (this._maxDate && date > this._maxDate) return false;

    if (this.isDateDisabledMemo(date)) return false;

    if (this.isInvalidDate(date)) return false;

    return true;
  }

  private applyTypedDate(date: Date): void {
    if (!date || Number.isNaN(date.getTime())) return;

    if (this.showTime || this.timeOnly) {
      const now = new Date();
      date.setHours(
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds(),
      );
    } else {
      date.setHours(0, 0, 0, 0);
    }

    if (this.mode === 'single') {
      this.selectedDate = date;
      this.currentDate = new Date(date);
      this._currentMonth = date.getMonth();
      this._currentYear = date.getFullYear();
      this._currentMonthSignal.set(date.getMonth());
      this._currentYearSignal.set(date.getFullYear());
      this.emitValue(date);
      this.generateCalendar();
      this.action.emit({ type: 'dateSelected', payload: date });
    } else if (this.mode === 'range') {
      this.startDate = date;
      this.currentDate = new Date(date);
      this._currentMonth = date.getMonth();
      this._currentYear = date.getFullYear();
      this._currentMonthSignal.set(date.getMonth());
      this._currentYearSignal.set(date.getFullYear());
      this.generateCalendar();
      this.action.emit({ type: 'rangeStartSelected', payload: date });
    } else if (this.mode === 'multiple') {
      const index = this.selectedDates.findIndex((d) =>
        this.isSameDayMemo(d, date),
      );
      if (index >= 0) {
        this.selectedDates.splice(index, 1);
      } else {
        this.selectedDates.push(date);
      }
      this.generateCalendar();
      this.action.emit({
        type: 'datesSelected',
        payload: [...this.selectedDates],
      });
    }

    this.scheduleChangeDetection();

    if (this.shouldAutoClose()) {
      this.closeCalendar();
    }
  }

  private generateTimeOptions(): void {
    const result = generateTimeOptions(
      this.minuteInterval,
      this.secondInterval,
      this.showSeconds,
      this.use24Hour,
    );
    this.hourOptions = result.hourOptions;
    this.minuteOptions = result.minuteOptions;
    if (result.secondOptions) {
      this.secondOptions = result.secondOptions;
    }
  }

  private generateLocaleData(): void {
    // monthOptions is now a computed signal - no need to regenerate
    this.firstDayOfWeek =
      this.weekStart !== null && this.weekStart !== undefined
        ? this.weekStart
        : getFirstDayOfWeek(this.locale);
    this.weekDays = generateWeekDays(this.locale, this.firstDayOfWeek);
  }

  private updateRangesArray(): void {
    this.rangesArray = this._ranges
      ? Object.entries(this._ranges).map(([key, value]) => ({ key, value }))
      : [];
  }

  public selectRange(range: [Date, Date]): void {
    if (this.disabled) return;
    this.startDate = new Date(range[0]);
    this.endDate = new Date(range[1]);

    if (this.showTime) {
      this.startDate = this.applyCurrentTime(this.startDate);
      this.endDate = this.applyCurrentTime(this.endDate);
    }

    if (this.startDate && this.endDate) {
      this.emitValue({
        start: this.startDate as Date,
        end: this.endDate as Date,
      });
    }

    this.currentDate = new Date(this.startDate);
    this.initializeValue({ start: this.startDate, end: this.endDate });
    this.generateCalendar();
    this.action.emit({
      type: 'rangeSelected',
      payload: {
        start: this.startDate,
        end: this.endDate,
        key: this.rangesArray.find((r) => r.value === range)?.key,
      },
    });

    if (this.shouldAutoClose()) {
      this.closeCalendar();
    } else {
      this.scheduleChangeDetection();
    }
  }

  public isHoliday(date: Date | null): boolean {
    if (!date || !this.holidayProvider) return false;
    const dateOnly = getStartOfDay(date);
    return this.holidayProvider.isHoliday(dateOnly);
  }

  public getHolidayLabel(date: Date | null): string | null {
    if (!date || !this.holidayProvider || !this.isHoliday(date)) return null;
    return this.holidayProvider.getHolidayLabel
      ? this.holidayProvider.getHolidayLabel(getStartOfDay(date))
      : this.getTranslation('holiday');
  }

  /**
   * Checks if a date is disabled based on all configured constraints.
   *
   * @param date - The date to check
   * @returns true if the date is disabled, false if it can be selected
   *
   * @remarks
   * A date is considered disabled if it matches any of these conditions:
   * - Falls before minDate
   * - Falls after maxDate
   * - Is in the disabledDates array
   * - Falls within a disabledRanges entry
   * - Fails the isInvalidDate custom validation function
   * - Is a holiday and disableHolidays is true
   *
   * Performance: O(n) where n = disabledDates.length + disabledRanges.length
   * For large constraint lists (>1000), consider optimizing with Set or DateRange tree.
   */
  public isDateDisabled(date: Date | null): boolean {
    if (!date) return false;

    const dateOnly = getStartOfDay(date);

    if (this.disabledDates.length > 0) {
      for (const disabledDate of this.disabledDates) {
        let parsedDate: Date | null;

        if (typeof disabledDate === 'string') {
          parsedDate = this.parsingService.parseDateString(disabledDate);
        } else {
          parsedDate = getStartOfDay(disabledDate);
        }

        if (parsedDate && dateOnly.getTime() === parsedDate.getTime()) {
          return true;
        }
      }
    }

    if (this.disabledRanges.length > 0) {
      for (const range of this.disabledRanges) {
        let startDate: Date | null;
        let endDate: Date | null;

        if (typeof range.start === 'string') {
          startDate = this.parsingService.parseDateString(range.start);
        } else {
          startDate = getStartOfDay(range.start);
        }

        if (typeof range.end === 'string') {
          endDate = this.parsingService.parseDateString(range.end);
        } else {
          endDate = getStartOfDay(range.end);
        }

        if (startDate && endDate) {
          const startTime = getStartOfDay(startDate).getTime();
          const endTime = getEndOfDay(endDate).getTime();
          const dateTime = dateOnly.getTime();

          if (dateTime >= startTime && dateTime <= endTime) {
            return true;
          }
        }
      }
    }

    if (
      this.holidayProvider &&
      this.disableHolidays &&
      this.holidayProvider.isHoliday(dateOnly)
    ) {
      return true;
    }

    const effectiveMinDate =
      this._minDate ||
      (this.globalConfig?.minDate
        ? this._normalizeDate(this.globalConfig.minDate)
        : null);
    const effectiveMaxDate =
      this._maxDate ||
      (this.globalConfig?.maxDate
        ? this._normalizeDate(this.globalConfig.maxDate)
        : null);

    if (effectiveMinDate) {
      const minDateOnly = getStartOfDay(effectiveMinDate);
      if (dateOnly.getTime() < minDateOnly.getTime()) return true;
    }
    if (effectiveMaxDate) {
      const maxDateOnly = getStartOfDay(effectiveMaxDate);
      if (dateOnly.getTime() > maxDateOnly.getTime()) return true;
    }

    return this.isInvalidDate(date);
  }

  /**
   * Checks if a date is selected in multiple selection mode.
   *
   * @param d - The date to check
   * @returns true if the date is in the selectedDates array
   *
   * @remarks
   * Performance: O(n) where n = selectedDates.length
   * Uses day-level comparison (ignores time) for accurate matching.
   */
  public isMultipleSelected(d: Date | null): boolean {
    if (!d || this.mode !== 'multiple') return false;
    const dTime = getStartOfDay(d).getTime();
    return this.selectedDates.some(
      (selected) => getStartOfDay(selected).getTime() === dTime,
    );
  }

  /**
   * Handles time value changes from time selection controls.
   * Updates the selected date(s) with the new time values.
   *
   * @remarks
   * This method:
   * - Applies time changes to selected dates based on current mode
   * - Emits value changes for form integration
   * - Handles time-only mode by creating a date with current time
   * - Updates all selected dates in multiple mode
   * - Ensures startDate <= endDate in range mode
   */
  public timeChange(): void {
    if (this.disabled) return;

    if (this.timeOnly && this.mode === 'single' && !this.selectedDate) {
      const today = new Date();
      const dateWithTime = this.applyCurrentTime(today);
      this.selectedDate = dateWithTime;
      this.emitValue(dateWithTime);
      this.action.emit({
        type: 'timeChanged',
        payload: { hour: this.currentHour, minute: this.currentMinute },
      });
      this.scheduleChangeDetection();
      return;
    }

    if (this.mode === 'single' && this.selectedDate) {
      this.selectedDate = this.applyCurrentTime(this.selectedDate);
      this.emitValue(this.selectedDate);
    } else if (this.mode === 'range' && this.startDate && this.endDate) {
      this.startDate = this.applyCurrentTime(this.startDate);
      this.endDate = this.applyCurrentTime(this.endDate);
      this.emitValue({
        start: this.startDate as Date,
        end: this.endDate as Date,
      });
    } else if (this.mode === 'range' && this.startDate && !this.endDate) {
      this.startDate = this.applyCurrentTime(this.startDate);
    } else if (this.mode === 'multiple') {
      this.selectedDates = this.selectedDates.map((date) => {
        const newDate = getStartOfDay(date);
        return this.applyCurrentTime(newDate);
      });
      this.emitValue([...this.selectedDates]);
    }

    this.action.emit({
      type: 'timeChanged',
      payload: { hour: this.currentHour, minute: this.currentMinute },
    });
    this.scheduleChangeDetection();
  }

  /**
   * Handles time range changes in timeRangeMode.
   * Updates the internal time range state and emits the time range to listeners.
   * Only creates/updates time-only dates (no calendar dates).
   */
  public timeRangeChange(): void {
    if (this.disabled || !this.timeRangeMode) return;

    const today = new Date();
    const startDate = new Date(today);
    const endDate = new Date(today);

    // Set start time
    startDate.setHours(
      this.get24Hour(this.startDisplayHour, this.startIsPm),
      this.startMinute,
      this.startSecond,
      0,
    );

    // Set end time
    endDate.setHours(
      this.get24Hour(this.endDisplayHour, this.endIsPm),
      this.endMinute,
      this.endSecond,
      0,
    );

    // Emit the time range as a range object
    this.emitValue({
      start: startDate,
      end: endDate,
    });

    this.action.emit({
      type: 'timeRangeChanged',
      payload: {
        startHour: this.get24Hour(this.startDisplayHour, this.startIsPm),
        startMinute: this.startMinute,
        endHour: this.get24Hour(this.endDisplayHour, this.endIsPm),
        endMinute: this.endMinute,
      },
    });
    this.scheduleChangeDetection();
  }

  /**
   * Handles date cell click/tap events.
   * Processes date selection based on the current mode (single, range, multiple, etc.)
   * and handles touch gesture debouncing to prevent accidental double selections.
   *
   * @param day - The date that was clicked (null for empty cells)
   *
   * @remarks
   * This method implements several important behaviors:
   * - Touch gesture handling: Debounces rapid touch events to prevent double-clicks
   * - Date validation: Checks if the date is disabled before processing
   * - Hook integration: Calls beforeDateSelect hook if provided
   * - Mode-specific logic: Handles single, range, multiple, week, month, quarter, and year modes
   * - Calendar navigation: Automatically navigates to different month if date is outside current view
   * - Accessibility: Announces date selection to screen readers
   * - Auto-close: Closes calendar after selection in single mode or complete range
   *
   * Performance considerations:
   * - Touch debouncing prevents excessive event processing
   * - Date normalization happens once per selection
   * - Calendar regeneration is optimized with caching
   */
  public onDateClick(day: Date | null): void {
    if (!day || this.disabled) return;

    const now = Date.now();
    const timeSinceTouchHandled =
      this.dateCellTouchHandledTime > 0
        ? now - this.dateCellTouchHandledTime
        : Infinity;

    if (
      this.touchState.dateCellTouchHandled &&
      timeSinceTouchHandled < 250 &&
      this.touchState.isDateCellTouching
    ) {
      this.clearTouchHandledFlag();
      return;
    }

    if (
      this.touchState.dateCellTouchHandled &&
      (timeSinceTouchHandled >= 250 || !this.touchState.isDateCellTouching)
    ) {
      this.clearTouchHandledFlag();
    }

    this.touchState.isDateCellTouching = false;
    this.touchState.dateCellTouchStartTime = 0;
    this.touchState.dateCellTouchStartDate = null;
    this.touchState.lastDateCellTouchDate = null;

    if (this.isDateDisabled(day)) return;

    if (this.hooks?.beforeDateSelect) {
      if (!this.hooks.beforeDateSelect(day, this._value)) {
        return;
      }
    }

    if (this.mode === 'single') {
      if (!this.isCurrentMonth(day)) {
        this._currentMonth = day.getMonth();
        this._currentYear = day.getFullYear();
        this._currentMonthSignal.set(this._currentMonth);
        this._currentYearSignal.set(this._currentYear);
        this.currentDate = new Date(day);
        this._invalidateMemoCache();
        this.generateCalendar();
        this.scheduleChangeDetection();

        if (this.isBrowser && this.isCalendarOpen) {
          this.cdr.markForCheck();
          this.trackedDoubleRequestAnimationFrame(() => {
            this.trackedSetTimeout(() => {
              this.setupPassiveTouchListeners();
            }, 50);
          });
        }
      }

      const dateWithTime = this.applyTimeIfNeeded(day);
      this.selectedDate = dateWithTime;
      this.emitValue(dateWithTime);

      const formattedDate = formatDateWithTimezone(
        dateWithTime,
        this.locale,
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        },
        this.timezone,
      );
      const dateSelectedMsg =
        this.getTranslation(
          'dateSelected' as keyof DatepickerTranslations,
          undefined,
          { date: formattedDate },
        ) || formattedDate;
      this.ariaLiveService.announce(dateSelectedMsg, 'polite');
    } else if (this.mode === 'range') {
      if (!this.isCurrentMonth(day)) {
        this._currentMonth = day.getMonth();
        this._currentYear = day.getFullYear();
        this._currentMonthSignal.set(this._currentMonth);
        this._currentYearSignal.set(this._currentYear);
        this.currentDate = new Date(day);
        this._invalidateMemoCache();
        this.generateCalendar();
        this.scheduleChangeDetection();

        if (this.isBrowser && this.isCalendarOpen) {
          this.cdr.markForCheck();
          this.trackedDoubleRequestAnimationFrame(() => {
            this.trackedSetTimeout(() => {
              this.setupPassiveTouchListeners();
            }, 50);
          });
        }
      }

      const dayTime = getStartOfDay(day).getTime();
      const startTime = this.startDate
        ? getStartOfDay(this.startDate).getTime()
        : null;
      const endTime = this.endDate
        ? getStartOfDay(this.endDate).getTime()
        : null;

      if (this.startDate && this.endDate && dayTime === startTime!) {
        this.endDate = null;
        this.hoveredDate = null;
        this._invalidateMemoCache();
        this.emitValue({ start: this.startDate as Date, end: null });
        this.scheduleChangeDetection();
      } else if (this.startDate && this.endDate && dayTime === endTime!) {
        this.startDate = this.applyTimeIfNeeded(day);
        this.endDate = null;
        this.hoveredDate = null;
        this._invalidateMemoCache();
        this.emitValue({ start: this.startDate as Date, end: null });
        this.scheduleChangeDetection();
      } else if (
        (this.startDate &&
          this.endDate &&
          dayTime > startTime! &&
          dayTime < endTime!) ||
        !this.startDate ||
        (this.startDate && this.endDate)
      ) {
        this.startDate = this.applyTimeIfNeeded(day);
        this.endDate = null;
        this.hoveredDate = null;
        this._invalidateMemoCache();
        this.scheduleChangeDetection();
      } else if (this.startDate && !this.endDate) {
        if (dayTime < startTime!) {
          this.startDate = this.applyTimeIfNeeded(day);
          this.endDate = null;
          this.hoveredDate = null;
          this._invalidateMemoCache();
          this.scheduleChangeDetection();
        } else if (dayTime === startTime!) {
          // No action needed when dayTime equals startTime (start date clicked again, no end date selected yet)
        } else {
          const potentialEndDate = this.applyTimeIfNeeded(day);

          if (this.hooks?.validateRange) {
            if (!this.hooks.validateRange(this.startDate, potentialEndDate)) {
              this.startDate = potentialEndDate;
              this.endDate = null;
              this.hoveredDate = null;
              this._invalidateMemoCache();
              this.scheduleChangeDetection();
              return;
            }
          }

          this.endDate = potentialEndDate;
          this.hoveredDate = null;
          this._invalidateMemoCache();
          this.emitValue({
            start: this.startDate as Date,
            end: this.endDate as Date,
          });

          const startFormatted = formatDateWithTimezone(
            this.startDate,
            this.locale,
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            },
            this.timezone,
          );
          const endFormatted = formatDateWithTimezone(
            this.endDate,
            this.locale,
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            },
            this.timezone,
          );
          const rangeSelectedMsg =
            this.getTranslation(
              'rangeSelected' as keyof DatepickerTranslations,
              undefined,
              { start: startFormatted, end: endFormatted },
            ) || `${startFormatted} to ${endFormatted}`;
          this.ariaLiveService.announce(rangeSelectedMsg, 'polite');
        }
      }

      this.hoveredDate = null;
    } else if (this.mode === 'week') {
      const weekStart = getStartOfWeek(day, this.firstDayOfWeek);
      const weekEnd = getEndOfWeek(day, this.firstDayOfWeek);
      this.startDate = weekStart;
      this.endDate = weekEnd;
      this._invalidateMemoCache();
      this.emitValue({ start: weekStart, end: weekEnd });

      const startFormatted = formatDateWithTimezone(
        weekStart,
        this.locale,
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        },
        this.timezone,
      );
      const endFormatted = formatDateWithTimezone(
        weekEnd,
        this.locale,
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        },
        this.timezone,
      );
      const weekSelectedMsg = `Week selected: ${startFormatted} to ${endFormatted}`;
      this.ariaLiveService.announce(weekSelectedMsg, 'polite');
    } else if (this.mode === 'month') {
      const monthStart = new Date(day.getFullYear(), day.getMonth(), 1);
      const monthEnd = new Date(day.getFullYear(), day.getMonth() + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);
      this.startDate = monthStart;
      this.endDate = monthEnd;
      this._invalidateMemoCache();
      this.emitValue({ start: monthStart, end: monthEnd });

      const monthFormatted = formatDateWithTimezone(
        monthStart,
        this.locale,
        {
          year: 'numeric',
          month: 'long',
        },
        this.timezone,
      );
      const monthSelectedMsg = `Month selected: ${monthFormatted}`;
      this.ariaLiveService.announce(monthSelectedMsg, 'polite');
    } else if (this.mode === 'quarter') {
      const quarter = Math.floor(day.getMonth() / 3);
      const quarterStart = new Date(day.getFullYear(), quarter * 3, 1);
      const quarterEnd = new Date(day.getFullYear(), (quarter + 1) * 3, 0);
      quarterEnd.setHours(23, 59, 59, 999);
      this.startDate = quarterStart;
      this.endDate = quarterEnd;
      this._invalidateMemoCache();
      this.emitValue({ start: quarterStart, end: quarterEnd });

      const quarterFormatted = `Q${quarter + 1} ${day.getFullYear()}`;
      const quarterSelectedMsg = `Quarter selected: ${quarterFormatted}`;
      this.ariaLiveService.announce(quarterSelectedMsg, 'polite');
    } else if (this.mode === 'year') {
      const yearStart = new Date(day.getFullYear(), 0, 1);
      const yearEnd = new Date(day.getFullYear(), 11, 31);
      yearEnd.setHours(23, 59, 59, 999);
      this.startDate = yearStart;
      this.endDate = yearEnd;
      this._invalidateMemoCache();
      this.emitValue({ start: yearStart, end: yearEnd });

      const yearSelectedMsg = `Year selected: ${day.getFullYear()}`;
      this.ariaLiveService.announce(yearSelectedMsg, 'polite');
    } else if (this.mode === 'multiple') {
      if (!this.isCurrentMonth(day)) {
        this._currentMonth = day.getMonth();
        this._currentYear = day.getFullYear();
        this._currentMonthSignal.set(this._currentMonth);
        this._currentYearSignal.set(this._currentYear);
        this.currentDate = new Date(day);
        this._invalidateMemoCache();
        this.generateCalendar();
        this.scheduleChangeDetection();

        if (this.isBrowser && this.isCalendarOpen) {
          this.cdr.markForCheck();
          this.trackedDoubleRequestAnimationFrame(() => {
            this.trackedSetTimeout(() => {
              this.setupPassiveTouchListeners();
            }, 50);
          });
        }
      }

      if (this.recurringPattern) {
        const configBase: {
          pattern:
          | 'daily'
          | 'weekly'
          | 'monthly'
          | 'yearly'
          | 'weekdays'
          | 'weekends';
          startDate: Date;
          interval: number;
        } = {
          pattern: this.recurringPattern.pattern,
          startDate: this.recurringPattern.startDate,
          interval: this.recurringPattern.interval || 1,
        };

        const config: {
          pattern:
          | 'daily'
          | 'weekly'
          | 'monthly'
          | 'yearly'
          | 'weekdays'
          | 'weekends';
          startDate: Date;
          interval: number;
          endDate?: Date;
          dayOfWeek?: number;
          dayOfMonth?: number;
        } = { ...configBase };

        if (this.recurringPattern.endDate !== undefined) {
          config.endDate = this.recurringPattern.endDate;
        }
        if (this.recurringPattern.dayOfWeek !== undefined) {
          config.dayOfWeek = this.recurringPattern.dayOfWeek;
        }
        if (this.recurringPattern.dayOfMonth !== undefined) {
          config.dayOfMonth = this.recurringPattern.dayOfMonth;
        }
        const recurringDates = generateRecurringDates(config);

        const datesWithTime = recurringDates.map((d) =>
          this.applyTimeIfNeeded(d),
        );
        const uniqueDates = new Map<number, Date>();
        datesWithTime.forEach((d) => {
          uniqueDates.set(getStartOfDay(d).getTime(), d);
        });
        this.selectedDates = Array.from(uniqueDates.values()).sort(
          (a, b) => a.getTime() - b.getTime(),
        );
        this.emitValue([...this.selectedDates]);
      } else {
        const existingIndex = this.selectedDates.findIndex((d) =>
          this.isSameDay(d, day),
        );

        if (existingIndex > -1) {
          this.selectedDates.splice(existingIndex, 1);
        } else {
          const dateWithTime = this.applyTimeIfNeeded(day);
          this.selectedDates.push(dateWithTime);
          this.selectedDates.sort((a, b) => a.getTime() - b.getTime());
        }
        this.emitValue([...this.selectedDates]);
      }
    }

    let dateToSync: Date | null = null;
    if (this.mode === 'single') {
      dateToSync = this.selectedDate;
    } else if (
      this.mode === 'range' ||
      this.mode === 'week' ||
      this.mode === 'month' ||
      this.mode === 'quarter' ||
      this.mode === 'year'
    ) {
      dateToSync = this.startDate;
    } else if (this.mode === 'multiple' && this.selectedDates.length > 0) {
      dateToSync =
        this.selectedDates[this.selectedDates.length - 1] ?? null;
    }

    if (dateToSync) {
      this.update12HourState(dateToSync.getHours());
      this.currentMinute = dateToSync.getMinutes();
    }

    if (this.hooks?.afterDateSelect) {
      this.hooks.afterDateSelect(day, this._value);
    }

    this.action.emit({
      type: 'dateSelected',
      payload: {
        mode: this.mode,
        value: this._value,
        date: day,
      },
    });

    if (this.shouldAutoClose()) {
      this.closeCalendar();
    } else {
      this.scheduleChangeDetection();
    }
  }

  public onDateHover(day: Date | null): void {
    if (this.mode === 'range' && this.startDate && !this.endDate && day) {
      this.hoveredDate = day;
      this.cdr.markForCheck();
    }
  }

  public onDateCellTouchStart(event: TouchEvent, day: Date | null): void {
    this.clearTouchHandledFlag();
    this.touchService.handleDateCellTouchStart(
      event,
      day,
      this.touchState,
      {
        disabled: this.disabled,
        mode: this.mode,
        swipeThreshold: this.SWIPE_THRESHOLD,
        swipeTimeThreshold: this.SWIPE_TIME_THRESHOLD,
      },
      {
        isDateDisabled: (d) => this.isDateDisabled(d),
        onDateClick: (_) => { },
        changeMonth: (_) => { },
        onStateChanged: () => this.cdr.markForCheck(),
        onHoverChanged: (d) => {
          this.hoveredDate = d;
          this.cdr.markForCheck();
        },
      },
    );
    // Manual range hover update for start
    if (this.touchState.isDateCellTouching && this.mode === 'range' && day) {
      if (this.startDate && !this.endDate) {
        const dayTime = getStartOfDay(day).getTime();
        const startTime = getStartOfDay(this.startDate).getTime();
        if (dayTime >= startTime) {
          this.hoveredDate = day;
          this.cdr.markForCheck();
        }
      } else if (!this.startDate) {
        this.hoveredDate = null;
      }
    }
  }

  public onDateCellTouchMove(event: TouchEvent): void {
    this.touchService.handleDateCellTouchMove(
      event,
      this.touchState,
      {
        disabled: this.disabled,
        mode: this.mode,
        swipeThreshold: this.SWIPE_THRESHOLD,
        swipeTimeThreshold: this.SWIPE_TIME_THRESHOLD,
      },
      {
        isDateDisabled: (d) => this.isDateDisabled(d),
        onDateClick: (_) => { },
        changeMonth: (_) => { },
        onStateChanged: () => this.cdr.detectChanges(),
        onHoverChanged: (d) => {
          this.hoveredDate = d;
          this.cdr.detectChanges();
        },
      },
      this.startDate,
    );
  }

  public onDateCellTouchEnd(event: TouchEvent, day: Date | null): void {
    this.touchService.handleDateCellTouchEnd(
      event,
      day,
      this.touchState,
      {
        disabled: this.disabled,
        mode: this.mode,
        swipeThreshold: this.SWIPE_THRESHOLD,
        swipeTimeThreshold: this.SWIPE_TIME_THRESHOLD,
      },
      {
        isDateDisabled: (d) => this.isDateDisabled(d),
        onDateClick: (d) => {
          // We need to set handled flag for debounce
          this.setTouchHandledFlag();
          this.onDateClick(d);
        },
        changeMonth: (_) => { },
        onStateChanged: () => this.cdr.markForCheck(),
        onHoverChanged: (d) => {
          this.hoveredDate = d;
          this.cdr.markForCheck();
        },
      },
    );
  }

  public isPreviewInRange(day: Date | null): boolean {
    if (
      this.mode !== 'range' ||
      !this.startDate ||
      this.endDate ||
      !this.hoveredDate ||
      !day
    )
      return false;
    const start = getStartOfDay(this.startDate).getTime();
    const end = getStartOfDay(this.hoveredDate).getTime();
    const time = getStartOfDay(day).getTime();
    return time > Math.min(start, end) && time < Math.max(start, end);
  }

  private buildCalendarMonths(
    baseYear: number,
    baseMonth: number,
    count: number,
  ): Array<{ month: number; year: number; days: (Date | null)[] }> {
    if (this.syncScroll?.enabled && count > 1) {
      const monthGap = this.syncScroll.monthGap || 1;
      const months: Array<{
        month: number;
        year: number;
        days: (Date | null)[];
      }> = [];
      for (let i = 0; i < count; i++) {
        const offset = i * monthGap;
        let targetMonth = baseMonth + offset;
        let targetYear = baseYear;
        while (targetMonth >= 12) {
          targetMonth -= 12;
          targetYear += 1;
        }
        while (targetMonth < 0) {
          targetMonth += 12;
          targetYear -= 1;
        }
        const days = this.calendarGenerationService.generateMonthDays(
          targetYear,
          targetMonth,
          this.firstDayOfWeek,
          this._normalizeDate.bind(this),
        );
        months.push({ month: targetMonth, year: targetYear, days });
      }
      return months;
    }
    return this.calendarGenerationService.generateMultipleMonths(
      baseYear,
      baseMonth,
      count,
      this.firstDayOfWeek,
      this._normalizeDate.bind(this),
    );
  }

  /**
   * Generates the calendar view for the current month(s).
   * Uses LRU caching to optimize performance for frequently accessed months.
   *
   * @remarks
   * Performance characteristics:
   * - First generation: O(n) where n = number of days in month(s)
   * - Cached generation: O(1) lookup + O(1) cache access update
   * - Cache eviction: O(m) where m = cache size (only when cache is full)
   *
   * This method:
   * 1. Generates dropdown options for month/year selection
   * 2. Generates calendar days for each month in calendarCount
   * 3. Uses LRU cache to avoid regenerating recently accessed months
   * 4. Handles month/year rollover when displaying multiple calendars
   * 5. Updates memoized dependencies for change detection optimization
   * 6. Supports synchronous scrolling to keep calendars in sync (when enabled)
   *
   * The cache key format is `${year}-${month}` to ensure unique identification
   * of calendar months across different years.
   *
   * When syncScroll is enabled, calendars are kept synchronized:
   * - Calendar 0: currentDate month + (0 * monthGap)
   * - Calendar 1: currentDate month + (1 * monthGap)
   * - Calendar 2: currentDate month + (2 * monthGap)
   */
  public generateCalendar(): void {
    if (this.isCalendarOpen || this.isInlineMode) {
      const loadingMsg =
        this.getTranslation(
          'calendarLoading' as keyof DatepickerTranslations,
        ) || 'Loading calendar...';
      this.ariaLiveService.announce(loadingMsg, 'polite');
    }

    this.daysInMonth = [];
    this.multiCalendarMonths = [];

    const count = Math.max(1, Math.min(this.calendarCount || 1, 12));
    const baseYear = this.currentDate.getFullYear();
    const baseMonth = this.currentDate.getMonth();
    this._currentMonth = baseMonth;
    this._currentYear = baseYear;
    this.generateDropdownOptions();

    const months = this.buildCalendarMonths(baseYear, baseMonth, count);
    this.multiCalendarMonths = months;

    if (months.length > 0 && months[0]) {
      this.daysInMonth = months[0].days;
    }

    this.preloadAdjacentMonths(baseYear, baseMonth);

    this.cdr.markForCheck();

    // Announce calendar ready state for screen readers
    if (this.isCalendarOpen || this.isInlineMode) {
      const readyMsg =
        this.getTranslation('calendarReady' as keyof DatepickerTranslations) ||
        'Calendar ready';
      this.ariaLiveService.announce(readyMsg, 'polite');
    }

    this.action.emit({
      type: 'calendarGenerated',
      payload: {
        month: baseMonth,
        year: baseYear,
        days: this.daysInMonth.filter((d) => d !== null),
        multiCalendar: this.multiCalendarMonths.map((m) => ({
          month: m.month,
          year: m.year,
          days: m.days.filter((d) => d !== null),
        })),
      },
    });

    if (this.isBrowser) {
      requestAnimationFrame(() => {
        this.setupPassiveTouchListeners();
      });
    }
  }

  /**
   * Preloads adjacent months (previous and next) into the cache for smoother navigation.
   * Implements lazy loading optimization to improve performance when users navigate between months.
   *
   * @param currentYear - Current calendar year
   * @param currentMonth - Current calendar month (0-11)
   */
  private preloadAdjacentMonths(
    currentYear: number,
    currentMonth: number,
  ): void {
    this.calendarGenerationService.preloadAdjacentMonths(
      currentYear,
      currentMonth,
      this.firstDayOfWeek,
      this._normalizeDate.bind(this),
    );
  }

  private generateDropdownOptions(): void {
    // yearOptions is now a computed signal - no need to regenerate
  }

  private generateYearGrid(): void {
    this.yearGrid = this.calendarGenerationService.getYearGrid(this._currentYear);
  }

  private generateDecadeGrid(): void {
    this.decadeGrid =
      this.calendarGenerationService.getDecadeGrid(this._currentDecade);
  }

  public onYearClick(year: number): void {
    if (this.disabled) return;
    this._currentYear = year;
    this._currentYearSignal.set(year);
    this.currentDate.setFullYear(year);
    const wasInYearView = this.calendarViewMode === 'year';
    if (wasInYearView) {
      this.calendarViewMode = 'month';
    }
    this.generateYearGrid();
    this.generateCalendar();
    this.scheduleChangeDetection();

    if (wasInYearView && this.isBrowser && this.isCalendarOpen) {
      this.trackedSetTimeout(() => {
        this.setupPassiveTouchListeners();
      }, 50);
    }
  }

  public onDecadeClick(decade: number): void {
    if (this.disabled) return;
    this._currentDecade = decade;
    this._currentYear = decade;
    this._currentYearSignal.set(decade);
    this.currentDate.setFullYear(decade);
    if (this.calendarViewMode === 'decade') {
      this.calendarViewMode = 'year';
    }
    this.generateDecadeGrid();
    this.generateYearGrid();
    this.scheduleChangeDetection();
  }

  /**
   * Changes the displayed decade by the specified delta.
   * Used in decade view mode for navigating between decades.
   *
   * @param delta - Number of decades to change (positive for future, negative for past)
   *
   * @remarks
   * Each delta unit represents 10 years. The method updates the decade grid
   * to show the new range of decades available for selection.
   */
  public changeDecade(delta: number): void {
    if (this.disabled) return;
    this._currentDecade += delta * 10;
    this.generateDecadeGrid();
    this.cdr.markForCheck();
  }

  /**
   * Changes the displayed calendar year by the specified delta.
   * Updates year grid and calendar view, and announces the change to screen readers.
   *
   * @param delta - Number of years to change (positive for future, negative for past)
   *
   * @remarks
   * This method:
   * - Updates currentYear and currentDate
   * - Regenerates year grid and calendar view
   * - Announces year change to screen readers for accessibility
   * - Handles touch listener setup for mobile devices
   *
   * Performance: O(1) for year change, O(n) for grid/calendar generation
   */
  public changeYear(delta: number): void {
    if (this.disabled) return;
    this._currentYear += delta;
    this.currentDate.setFullYear(this._currentYear);
    this._invalidateMemoCache();
    this.generateYearGrid();
    this.generateCalendar();
    this.scheduleChangeDetection();

    if (
      this.isBrowser &&
      this.isCalendarOpen &&
      this.calendarViewMode === 'month'
    ) {
      this.trackedSetTimeout(() => {
        this.setupPassiveTouchListeners();
      }, 50);
    }

    const yearChangedMsg =
      this.getTranslation(
        'yearChanged' as keyof DatepickerTranslations,
        undefined,
        { year: String(this._currentYear) },
      ) || `Year ${this._currentYear}`;
    this.ariaLiveService.announce(yearChangedMsg, 'polite');
  }

  public onYearSelectChange(year: number | unknown): void {
    const yearValue = typeof year === 'number' ? year : Number(year);
    if (Number.isNaN(yearValue)) return;
    this._currentYear = yearValue;
    this._currentYearSignal.set(yearValue);
    this.currentDate.setFullYear(yearValue);
    this._invalidateMemoCache();
    this.generateYearGrid();
    this.generateCalendar();
  }

  private generateTimeline(): void {
    if (this.mode !== 'range') return;

    const result = this.calendarGenerationService.getTimelineMonths(
      this.timelineZoomLevel,
    );
    this.timelineStartDate = result.timelineStartDate;
    this.timelineEndDate = result.timelineEndDate;
    this.timelineMonths = result.timelineMonths;

    this.scheduleChangeDetection();
  }

  public timelineZoomIn(): void {
    if (this.timelineZoomLevel < 5) {
      this.timelineZoomLevel++;
      this.generateTimeline();
    }
  }

  public timelineZoomOut(): void {
    if (this.timelineZoomLevel > 1) {
      this.timelineZoomLevel--;
      this.generateTimeline();
    }
  }

  public isTimelineMonthSelected(month: Date): boolean {
    if (!this.startDate || !this.endDate) return false;
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const rangeStart = getStartOfDay(this.startDate);
    const rangeEnd = getStartOfDay(this.endDate);
    return (
      (monthStart >= rangeStart && monthStart <= rangeEnd) ||
      (monthEnd >= rangeStart && monthEnd <= rangeEnd) ||
      (monthStart <= rangeStart && monthEnd >= rangeEnd)
    );
  }

  public onTimelineMonthClick(month: Date): void {
    if (this.disabled) return;
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    if (this.startDate) {
      if (this.endDate) {
        this.startDate = monthStart;
        this.endDate = monthEnd;
        this.emitValue({ start: this.startDate, end: this.endDate });
      } else {
        if (monthStart < this.startDate) {
          this.endDate = this.startDate;
          this.startDate = monthStart;
        } else {
          this.endDate = monthEnd;
        }
        this.emitValue({ start: this.startDate, end: this.endDate });
      }
    } else {
      this.startDate = monthStart;
    }
    this.cdr.markForCheck();
  }

  public formatTimeSliderValue(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const displayHours = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${ampm}`;
  }

  public onStartTimeSliderChange(minutes: number): void {
    if (this.disabled) return;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (this.startDate) {
      this.startDate.setHours(hours, mins, 0, 0);
      if (this.endDate && this.startDate > this.endDate) {
        this.endDate.setHours(hours, mins, 0, 0);
      }
      if (this.startDate && this.endDate) {
        this.emitValue({ start: this.startDate, end: this.endDate });
      }
    }
    this.cdr.markForCheck();
  }

  public onEndTimeSliderChange(minutes: number): void {
    if (this.disabled) return;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (this.endDate) {
      this.endDate.setHours(hours, mins, 0, 0);
      if (this.startDate && this.endDate < this.startDate) {
        this.startDate.setHours(hours, mins, 0, 0);
      }
      if (this.startDate && this.endDate) {
        this.emitValue({ start: this.startDate, end: this.endDate });
      }
    }
    this.cdr.markForCheck();
  }

  public onCalendarSwipeStart(event: TouchEvent): void {
    this.touchService.handleCalendarSwipeStart(event, this.touchState);
  }

  public onCalendarSwipeMove(event: TouchEvent): void {
    this.touchService.handleCalendarSwipeMove(event, this.touchState);
  }

  public onCalendarSwipeEnd(event: TouchEvent): void {
    this.touchService.handleCalendarSwipeEnd(
      event,
      this.touchState,
      {
        disabled: this.disabled,
        mode: this.mode,
        swipeThreshold: this.SWIPE_THRESHOLD,
        swipeTimeThreshold: this.SWIPE_TIME_THRESHOLD,
      },
      {
        isDateDisabled: (d) => this.isDateDisabled(d),
        onDateClick: (_) => { },
        changeMonth: (delta) => {
          if (!this.isBackArrowDisabled || delta > 0) {
            this.changeMonth(delta);
          }
        },
        changeYear: (delta) => {
          this._currentYear += delta;
          this._currentYearSignal.set(this._currentYear);
          this.generateCalendar();
        },
        onStateChanged: () => this.cdr.markForCheck(),
        onHoverChanged: (_) => { },
      },
    );
  }

  public changeMonth(delta: number): void {
    if (this.disabled) return;

    if (delta < 0 && this.isBackArrowDisabled) return;

    this.clearTouchHandledFlag();
    this.touchState.isDateCellTouching = false;
    this.touchState.dateCellTouchStartTime = 0;
    this.touchState.dateCellTouchStartDate = null;
    this.touchState.lastDateCellTouchDate = null;

    // Calculate from the 1st of the month to avoid skipping months when current date is 31st (e.g., Jan 31 + 1m -> Mar)
    const currentMonthStart = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1,
    );
    const newDate = addMonths(currentMonthStart, delta);
    this.currentDate = newDate;
    this._currentMonth = newDate.getMonth();
    this._currentYear = newDate.getFullYear();
    this._currentMonthSignal.set(this._currentMonth);
    this._currentYearSignal.set(this._currentYear);
    this._invalidateMemoCache();
    this.generateCalendar();

    if (this.isBrowser && this.isCalendarOpen) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            this.setupPassiveTouchListeners();
          }, 50);
        });
      });
    }

    const monthName = newDate.toLocaleDateString(this.locale, {
      month: 'long',
    });
    const year = newDate.getFullYear();
    const monthChangedMsg =
      this.getTranslation(
        'monthChanged' as keyof DatepickerTranslations,
        undefined,
        { month: monthName, year: String(year) },
      ) || `${monthName} ${year}`;
    this.ariaLiveService.announce(monthChangedMsg, 'polite');

    this.action.emit({ type: 'monthChanged', payload: { delta: delta } });
  }

  public isSameDay(d1: Date | null, d2: Date | null): boolean {
    return this.dateComparator(d1, d2);
  }

  public isCurrentMonth(day: Date | null): boolean {
    if (!day) return false;
    return (
      day.getMonth() === this._currentMonth &&
      day.getFullYear() === this._currentYear
    );
  }

  public isInRange(d: Date | null): boolean {
    if (!d || !this.startDate || !this.endDate) return false;

    const dTime = getStartOfDay(d).getTime();
    const startDayTime = getStartOfDay(this.startDate).getTime();
    const endDayTime = getStartOfDay(this.endDate).getTime();

    const startTime = Math.min(startDayTime, endDayTime);
    const endTime = Math.max(startDayTime, endDayTime);

    return dTime > startTime && dTime < endTime;
  }

  private applyGlobalConfig(): void {
    if (!this.globalConfig) return;
    this.applyGlobalConfigDefaults();
    this.applyGlobalConfigLocaleAndDates();
    this.applyGlobalConfigMobile();
  }

  private applyGlobalConfigDefaults(): void {
    const g = this.globalConfig!;
    if (this.weekStart === null && g.weekStart !== undefined) {
      this.weekStart = g.weekStart;
    }
    if (this.minuteInterval === 1 && g.minuteInterval !== undefined) {
      this.minuteInterval = g.minuteInterval;
    }
    if (this.holidayProvider === null && g.holidayProvider !== undefined) {
      this.holidayProvider = g.holidayProvider;
    }
    if (this.yearRange === 10 && g.yearRange !== undefined) {
      this.yearRange = g.yearRange;
    }
  }

  private applyGlobalConfigLocaleAndDates(): void {
    const g = this.globalConfig!;
    if (this._locale === 'en-US' && g.locale) {
      this._locale = g.locale;
    }
    if (!this.timezone && g.timezone) {
      this.timezone = g.timezone;
    }
    if (!this._minDate && g.minDate !== undefined) {
      this._minDate = this._normalizeDate(g.minDate);
    }
    if (!this._maxDate && g.maxDate !== undefined) {
      this._maxDate = this._normalizeDate(g.maxDate);
    }
  }

  private applyGlobalConfigMobile(): void {
    const g = this.globalConfig!;
    if (this.autoDetectMobile === true && g.autoDetectMobile !== undefined) {
      this.autoDetectMobile = g.autoDetectMobile;
    }
    if (
      this.mobileModalStyle === 'center' &&
      g.mobileModalStyle !== undefined
    ) {
      this.mobileModalStyle = g.mobileModalStyle;
    }
  }

  /**
   * Apply animation configuration from global config
   */
  private applyAnimationConfig(config?: AnimationConfig): void {
    if (!this.isBrowser || !this.elementRef?.nativeElement) return;

    const nativeElement = this.elementRef?.nativeElement;
    if (!nativeElement) return;

    const animationConfig: AnimationConfig =
      config || this.globalConfig?.animations || DEFAULT_ANIMATION_CONFIG;

    let prefersReducedMotion = false;
    if (animationConfig.respectReducedMotion) {
      try {
        const mediaQuery = globalThis.matchMedia(
          '(prefers-reduced-motion: reduce)',
        );
        prefersReducedMotion = mediaQuery !== null && mediaQuery.matches;
      } catch {
        prefersReducedMotion = false;
      }
    }

    if (!animationConfig.enabled || prefersReducedMotion) {
      nativeElement.style.setProperty(
        '--datepicker-transition-duration',
        '0ms',
      );
      nativeElement.style.setProperty('--datepicker-transition', 'none');
      return;
    }

    const duration = `${animationConfig.duration || DEFAULT_ANIMATION_CONFIG.duration}ms`;
    const easing = animationConfig.easing || DEFAULT_ANIMATION_CONFIG.easing;
    const property =
      animationConfig.property || DEFAULT_ANIMATION_CONFIG.property;

    nativeElement.style.setProperty(
      '--datepicker-transition-duration',
      duration,
    );
    nativeElement.style.setProperty('--datepicker-transition-easing', easing);
    nativeElement.style.setProperty(
      '--datepicker-transition-property',
      property,
    );
    nativeElement.style.setProperty(
      '--datepicker-transition',
      `${property} ${duration} ${easing}`,
    );
  }

  /**
   * Initialize translations from service or registry
   */
  private initializeTranslations(): void {
    if (this.translationService) {
      this._translationService = this.translationService;
      return;
    }

    if (this.translationRegistry && this._locale) {
      const defaultTranslations = this.translationRegistry.getTranslations(
        this._locale,
      );
      if (this.translations) {
        this._translations = { ...defaultTranslations, ...this.translations };
      } else {
        this._translations = defaultTranslations;
      }
    }
  }

  /**
   * Generates an accessible label for the calendar dialog.
   * Provides screen readers with context about which month/year is being displayed.
   *
   * @returns Localized calendar label (e.g., "Calendar for January 2024")
   */
  public getCalendarAriaLabel(): string {
    if (!this.currentDate || !this.locale) return '';
    const month = this.currentDate.toLocaleDateString(this.locale, {
      month: 'long',
    });
    const year = this.currentDate.getFullYear();
    return this.getTranslation('calendarFor', undefined, {
      month,
      year: String(year),
    });
  }

  /**
   * Generates an accessible label for a specific calendar month in multi-calendar views.
   *
   * @param month - Month index (0-11)
   * @param year - Year number
   * @returns Localized calendar label for the specified month/year
   */
  public getCalendarAriaLabelForMonth(month: number, year: number): string {
    if (!this.locale) return '';
    const monthName = new Date(year, month, 1).toLocaleDateString(this.locale, {
      month: 'long',
    });
    return this.getTranslation('calendarFor', undefined, {
      month: monthName,
      year: String(year),
    });
  }

  /**
   * Sets up IntersectionObserver for lazy loading multi-calendar months.
   * Only initializes if multi-calendar is enabled (calendarCount > 1).
   *
   * @remarks
   * Uses IntersectionObserver to track which calendar month elements are visible
   * in the viewport. Updates the visible indices signal to enable/disable rendering.
   */
  private setupLazyLoadingObserver(): void {
    if (!this.isBrowser || this.calendarCount <= 1) {
      return;
    }

    try {
      // Only setup observer if not already done
      if (!('IntersectionObserver' in globalThis)) {
        return; // IntersectionObserver not supported
      }

      const multiCalendarContainer =
        this.elementRef?.nativeElement?.querySelector(
          '.ngxsmk-multi-calendar-container',
        );

      if (!multiCalendarContainer) {
        // Will retry in ngAfterViewInit
        return;
      }

      // Create observer to track calendar month visibility
      const observer = new IntersectionObserver(
        (entries) => {
          const visibleIndices = new Set<number>();

          entries.forEach((entry) => {
            const calendarMonth = entry.target as HTMLElement;
            const indexAttr = calendarMonth.dataset['calendarIndex'];

            if (indexAttr !== undefined && entry.isIntersecting) {
              const index = Number.parseInt(indexAttr, 10);
              if (!Number.isNaN(index)) {
                visibleIndices.add(index);
              }
            }
          });

          // Update signal if there are visible calendars
          if (visibleIndices.size > 0) {
            this._visibleCalendarIndicesSignal.set(visibleIndices);
          }
        },
        {
          root: multiCalendarContainer,
          threshold: 0.01, // Consider visible if even 1% is shown
        },
      );

      // Observe all calendar month elements
      const calendarMonths = multiCalendarContainer.querySelectorAll(
        '.ngxsmk-calendar-month-multi',
      );

      calendarMonths.forEach((month: Element) => {
        observer.observe(month);
      });

      // Store observer for cleanup in ngOnDestroy
      this.activeTimeouts.add(
        observer as unknown as ReturnType<typeof setTimeout>,
      );
    } catch (error) {
      if (isDevMode()) {
        console.warn(
          '[ngxsmk-datepicker] Could not setup lazy loading observer:',
          error,
        );
      }
    }
  }

  /**
   * Formats a month and year into a display label.
   *
   * @param month - Month index (0-11)
   * @param year - Year number
   * @returns Formatted string like "January 2024"
   */
  public getMonthYearLabel(month: number, year: number): string {
    if (!this.locale) return '';
    const monthName = new Date(year, month, 1).toLocaleDateString(this.locale, {
      month: 'long',
    });
    return `${monthName} ${year}`;
  }

  public isCurrentMonthForCalendar(
    day: Date | null,
    targetMonth: number,
    targetYear: number,
  ): boolean {
    if (!day) return false;
    return day.getMonth() === targetMonth && day.getFullYear() === targetYear;
  }

  public getTranslation(
    key: keyof DatepickerTranslations,
    fallbackKey?: keyof DatepickerTranslations,
    params?: Record<string, string | number>,
  ): string {
    if (this._translationService) {
      return this._translationService.translate(key, params);
    }

    if (this._translations) {
      // Use optional chaining and nullish coalescing for safer access
      let translation = this._translations[key] ?? null;
      if (!translation && fallbackKey) {
        translation = this._translations[fallbackKey] ?? null;
      }
      if (translation && params) {
        let result = translation;
        for (const [paramKey, paramValue] of Object.entries(params)) {
          result = result.replaceAll(
            new RegExp(`{{${paramKey}}}`, 'g'),
            String(paramValue),
          );
        }
        return result;
      }
      return translation || key;
    }

    if (this.translationRegistry && this._locale) {
      const registryTranslations = this.translationRegistry.getTranslations(
        this._locale,
      );
      return registryTranslations?.[key] ?? key;
    }
    return key;
  }

  /**
   * Closes the calendar and restores focus to the previously focused element.
   * This improves accessibility by returning focus to the trigger element.
   */
  public closeCalendarWithFocusRestore(): void {
    this.removeFocusTrap();
    this.isCalendarOpen = false;
    this.isOpeningCalendar = false;
    this.updateOpeningState(false);

    // Restore focus to the previously focused element
    if (this.isBrowser && this.previousFocusElement) {
      // Use setTimeout to ensure the calendar is fully closed before restoring focus
      this.trackedSetTimeout(() => {
        try {
          if (
            this.previousFocusElement &&
            document.contains(this.previousFocusElement)
          ) {
            this.previousFocusElement.focus({ preventScroll: true });
          }
        } catch (error) {
          // Element may no longer be in the DOM, ignore error
          if (isDevMode()) {
            console.warn('[ngxsmk-datepicker] Could not restore focus:', error);
          }
        }
        this.previousFocusElement = null;
      }, 0);
    }
  }

  private updateRtlState(): void {
    if (this.isBrowser && this.elementRef?.nativeElement) {
      const wrapper = this.elementRef?.nativeElement?.querySelector(
        '.ngxsmk-datepicker-wrapper',
      );
      if (wrapper) {
        if (this.isRtl) {
          wrapper.setAttribute('dir', 'rtl');
        } else {
          wrapper.removeAttribute('dir');
        }
      }
    }
  }

  /**
   * Component lifecycle hook: Cleanup all resources, subscriptions, and event listeners.
   * Ensures no memory leaks by:
   * - Removing instance from static registry
   * - Cleaning up field sync service
   * - Completing stateChanges subject
   * - Clearing all tracked timeouts and animation frames
   * - Removing touch event listeners
   * - Invalidating month cache
   */
  ngOnDestroy(): void {
    this.removeFocusTrap();
    NgxsmkDatepickerComponent._allInstances.delete(this);

    // Clean up field sync service
    this.fieldSyncService.cleanup();

    // Clear individual timeout IDs first
    if (this.openCalendarTimeoutId) {
      clearTimeout(this.openCalendarTimeoutId);
      this.openCalendarTimeoutId = null;
    }

    if (this.touchHandledTimeout) {
      clearTimeout(this.touchHandledTimeout);
      this.touchHandledTimeout = null;
    }

    if (this._touchListenersSetupTimeout) {
      clearTimeout(this._touchListenersSetupTimeout);
      this._touchListenersSetupTimeout = null;
    }

    if (this.fieldSyncTimeoutId) {
      clearTimeout(this.fieldSyncTimeoutId);
      if (this.activeTimeouts) {
        this.activeTimeouts.delete(this.fieldSyncTimeoutId);
      }
      this.fieldSyncTimeoutId = null;
    }

    // Clear all tracked timeouts and animation frames (single cleanup block)
    if (this.activeTimeouts) {
      this.activeTimeouts.forEach((timeoutId: ReturnType<typeof setTimeout>) =>
        clearTimeout(timeoutId),
      );
      this.activeTimeouts.clear();
    }

    if (this.activeAnimationFrames) {
      this.activeAnimationFrames.forEach((frameId: number) =>
        cancelAnimationFrame(frameId),
      );
      this.activeAnimationFrames.clear();
    }

    // Complete the subject last to ensure all cleanup is done first
    // Check if subject is already closed to avoid ObjectUnsubscribedError
    if (!this.stateChanges.closed) {
      this.stateChanges.complete();
    }

    if (this._fieldEffectRef) {
      this._fieldEffectRef.destroy();
      this._fieldEffectRef = null;
    }

    // Clean up change detection effect
    if (this._changeDetectionEffect) {
      this._changeDetectionEffect.destroy();
    }

    if (this.passiveTouchListeners) {
      this.passiveTouchListeners.forEach((cleanup: () => void) => cleanup());
      this.passiveTouchListeners = [];
    }

    // Clear component state using nullish coalescing for cleaner code
    this.selectedDate ??= null;
    this.selectedDates ??= [];
    this.startDate ??= null;
    this.endDate ??= null;
    this.hoveredDate ??= null;
    this._value ??= null;

    this.calendarGenerationService.clearCache();
  }

  private getActualPopoverContainer(): HTMLElement | null {
    let popover = this.popoverContainer?.nativeElement;

    if (this._shouldAppendToBody) {
      if (!this.isBrowser) return null;
      const el = this.document.getElementById(this.popoverId);
      if (el) {
        popover = el;
      }
    }

    if (!popover && this.elementRef?.nativeElement) {
      popover = this.elementRef.nativeElement.querySelector('.ngxsmk-popover-container');
    }

    return (popover as HTMLElement) || null;
  }

  private setupFocusTrap(): void {
    if (
      this.isInlineMode ||
      !this.isBrowser ||
      !this.focusTrapService ||
      this.disableFocusTrap ||
      this.isIonicEnvironment()
    ) {
      return;
    }

    this.removeFocusTrap();

    const popoverRef = this.getActualPopoverContainer();
    if (popoverRef) {
      this.focusTrapCleanup = this.focusTrapService.trapFocus(
        new ElementRef(popoverRef),
      );
    }
  }

  /**
   * Positions the popover relative to the input element dynamically.
   * - Prioritizes layout below the input.
   * - Falls back to positioning above if required.
   * - Defaults to CSS-centered positioning if space is insufficient.
   *
   * @remarks
   * This logic primarily targets mobile/tablet viewports; desktop layout (≥1024px)
   * is handled via CSS absolute positioning.
   */
  private positionPopoverRelativeToInput(): void {
    if (!this.isBrowser) {
      return;
    }

    const popover = this.getActualPopoverContainer();

    if (!popover) {
      return;
    }

    const inputGroup =
      (this.elementRef?.nativeElement?.querySelector(
        '.ngxsmk-input-group:not(.ngxsmk-native-input-group)',
      ) as HTMLElement | null) ||
      (this.elementRef?.nativeElement?.querySelector(
        '.ngxsmk-input-group',
      ) as HTMLElement | null);

    this.popoverPositioningService.positionRelativeToInput(
      popover,
      inputGroup,
      {
        isInlineMode: this.isInlineMode,
        shouldAppendToBody: this._shouldAppendToBody,
        centerOnMobile:
          this.mobileModalStyle === 'center' && this.isMobileDevice(),
      },
    );
  }

  /**
   * Determines if the component is operating within an Ionic environment.
   * This detection disables features that may conflict with Ionic's overlay system.
   */
  private isIonicEnvironment(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    try {
      // Check for Ionic global object or key Ionic DOM elements/styles
      const g = globalThis as unknown as Record<string, unknown>;
      return (
        g['Ionic'] !== undefined ||
        (typeof document !== 'undefined' &&
          !!document.querySelector('ion-app')) ||
        (typeof getComputedStyle !== 'undefined' &&
          Boolean(
            getComputedStyle(document.documentElement).getPropertyValue(
              '--ion-color-primary',
            ),
          ))
      );
    } catch {
      return false;
    }
  }

  private removeFocusTrap(): void {
    if (this.focusTrapCleanup) {
      this.focusTrapCleanup();
      this.focusTrapCleanup = null;
    }
  }
}
