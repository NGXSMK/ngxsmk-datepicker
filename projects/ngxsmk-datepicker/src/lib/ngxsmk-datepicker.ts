import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
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
  AfterViewInit,
  signal,
  computed,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser, CommonModule, DatePipe } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  getStartOfDay,
  getEndOfDay,
  addMonths,
  normalizeDate,
  DateInput,
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
  generateYearGrid,
  generateDecadeGrid,
} from './utils/calendar.utils';
import { CustomSelectComponent } from './components/custom-select.component';
import { createDateComparator } from './utils/performance.utils';
import {
  DatepickerHooks,
  KeyboardShortcutContext
} from './interfaces/datepicker-hooks.interface';
import { DATEPICKER_CONFIG, DatepickerConfig, DEFAULT_ANIMATION_CONFIG, AnimationConfig } from './config/datepicker.config';
import { FieldSyncService } from './services/field-sync.service';
import { LocaleRegistryService } from './services/locale-registry.service';
import { TranslationRegistryService } from './services/translation-registry.service';
import { TranslationService } from './services/translation.service';
import { DatepickerTranslations, PartialDatepickerTranslations } from './interfaces/datepicker-translations.interface';
import { FocusTrapService } from './services/focus-trap.service';
import { AriaLiveService } from './services/aria-live.service';

type SignalFormField = ({
  value?: DatepickerValue | (() => DatepickerValue) | { (): DatepickerValue };
  disabled?: boolean | (() => boolean) | { (): boolean };
  setValue?: (value: DatepickerValue) => void;
  updateValue?: (updater: () => DatepickerValue) => void;
} & {
  [key: string]: unknown;
}) | null | undefined;

@Component({
  selector: 'ngxsmk-datepicker',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomSelectComponent, DatePipe, ReactiveFormsModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgxsmkDatepickerComponent),
    multi: true
  }, FieldSyncService, FocusTrapService, AriaLiveService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./styles/variables.css', './styles/datepicker.css'],
  template: `
    <div class="ngxsmk-datepicker-wrapper" [class.ngxsmk-inline-mode]="isInlineMode" [class.ngxsmk-calendar-open]="isCalendarOpen && !isInlineMode" [class.ngxsmk-rtl]="isRtl" [ngClass]="classes?.wrapper">
      @if (!isInlineMode) {
        <div class="ngxsmk-input-group" (click)="toggleCalendar($event)" (pointerdown)="onPointerDown($event)" (pointerup)="onPointerUp($event)" (focus)="onInputGroupFocus()" (keydown.enter)="toggleCalendar($event)" (keydown.space)="toggleCalendar($event); $event.preventDefault()" [class.disabled]="disabled" role="button" [attr.aria-disabled]="disabled" aria-haspopup="dialog" [attr.aria-expanded]="isCalendarOpen" tabindex="0" [ngClass]="classes?.inputGroup">
          <input type="text" 
                 #dateInput
                 [value]="allowTyping ? (typedInputValue || displayValue) : displayValue" 
                 [placeholder]="placeholder" 
                 [readonly]="!allowTyping"
                 [disabled]="disabled"
                 [attr.aria-label]="placeholder || getTranslation(timeOnly ? 'selectTime' : 'selectDate')"
                 [attr.aria-describedby]="'datepicker-help-' + _uniqueId"
                 class="ngxsmk-display-input"
                 [ngClass]="classes?.input"
                 (keydown.enter)="onInputKeyDown($any($event))"
                 (keydown.space)="onInputKeyDown($any($event))"
                 (keydown.escape)="onInputKeyDown($any($event))"
                 (input)="onInputChange($event)"
                 (blur)="onInputBlur($event)"
                 (focus)="onInputFocus($event)">
          <button type="button" class="ngxsmk-clear-button" (click)="clearValue($event); $event.stopPropagation()" (touchstart)="$event.stopPropagation()" (touchend)="$event.stopPropagation()" (pointerdown)="$event.stopPropagation()" (pointerup)="$event.stopPropagation()" [disabled]="disabled" *ngIf="displayValue" [attr.aria-label]="_clearAriaLabel" [title]="_clearLabel" [ngClass]="classes?.clearBtn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"/></svg>
          </button>
          <button type="button" class="ngxsmk-calendar-button" (click)="toggleCalendar($event); $event.stopPropagation()" [disabled]="disabled" *ngIf="showCalendarButton" [attr.aria-label]="getTranslation(timeOnly ? 'selectTime' : 'selectDate')" [title]="getTranslation(timeOnly ? 'selectTime' : 'selectDate')" [ngClass]="classes?.calendarBtn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M96 80H416c26.51 0 48 21.49 48 48V416c0 26.51-21.49 48-48 48H96c-26.51 0-48-21.49-48-48V128c0-26.51 21.49-48 48-48zM160 32v64M352 32v64M464 192H48M200 256h112M200 320h112M200 384h112M152 256h.01M152 320h.01M152 384h.01"/></svg>
          </button>
        </div>
      }

      @if (isCalendarVisible) {
        @if (!isInlineMode && isCalendarOpen) {
          <div
            class="ngxsmk-backdrop"
            role="button"
            tabindex="0"
            [attr.aria-label]="getTranslation('closeCalendarOverlay')"
            (click)="onBackdropInteract($event)"
            (keydown.enter)="onBackdropInteract($event)"
            (keydown.space)="onBackdropInteract($event)"
          ></div>
        }
        <div #popoverContainer class="ngxsmk-popover-container" [class.ngxsmk-inline-container]="isInlineMode" [class.ngxsmk-popover-open]="isCalendarOpen && !isInlineMode" [class.ngxsmk-time-only-popover]="timeOnly" [class.ngxsmk-has-time-selection]="showTime || timeOnly" [ngClass]="classes?.popover" role="dialog" [attr.aria-label]="getCalendarAriaLabel()" [attr.aria-modal]="!isInlineMode">
          <div class="ngxsmk-datepicker-container" [ngClass]="classes?.container">
            @if (showRanges && rangesArray.length > 0 && mode === 'range' && !timeOnly) {
              <div class="ngxsmk-ranges-container">
                <ul>
                  @for (range of rangesArray; track trackByRange($index, range)) {
                    <li (click)="selectRange(range.value)" (keydown.enter)="selectRange(range.value)" (keydown.space)="selectRange(range.value); $event.preventDefault()" [class.disabled]="disabled" [attr.tabindex]="disabled ? -1 : 0" role="button" [attr.aria-disabled]="disabled">{{ range.key }}</li>
                  }
                </ul>
              </div>
            }
            <div class="ngxsmk-calendar-container" 
                 [class.ngxsmk-time-only-mode]="timeOnly"
                 [class.ngxsmk-has-multi-calendar]="calendarCount > 1"
                 [class.ngxsmk-calendar-layout-horizontal]="calendarCount > 1 && calendarLayout === 'horizontal'"
                 [class.ngxsmk-calendar-layout-vertical]="calendarCount > 1 && calendarLayout === 'vertical'"
                 [class.ngxsmk-calendar-layout-auto]="calendarCount > 1 && calendarLayout === 'auto'"
                 [ngClass]="classes?.calendar">
              @if (!timeOnly) {
                @if (calendarViewMode === 'month') {
                <div class="ngxsmk-header" [ngClass]="classes?.header">
                  <div class="ngxsmk-month-year-selects">
                    <ngxsmk-custom-select #monthSelect class="month-select" [options]="monthOptions"
                                      [(value)]="currentMonth" [disabled]="disabled"></ngxsmk-custom-select>
                      <ngxsmk-custom-select #yearSelect class="year-select" [options]="yearOptions" [(value)]="currentYear" [disabled]="disabled" (valueChange)="onYearSelectChange($any($event))"></ngxsmk-custom-select>
                  </div>
                  <div class="ngxsmk-nav-buttons">
                    <button type="button" class="ngxsmk-nav-button" (click)="changeMonth(-1)" [disabled]="disabled || isBackArrowDisabled" [attr.aria-label]="_prevMonthAriaLabel" [title]="_prevMonthAriaLabel" [ngClass]="classes?.navPrev">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                              d="M328 112L184 256l144 144"/>
                      </svg>
                    </button>
                    <button type="button" class="ngxsmk-nav-button" (click)="changeMonth(1)" [disabled]="disabled" [attr.aria-label]="_nextMonthAriaLabel" [title]="_nextMonthAriaLabel" [ngClass]="classes?.navNext">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                              d="M184 112l144 144-144 144"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="ngxsmk-multi-calendar-container" 
                     [class.ngxsmk-multi-calendar]="calendarCount > 1"
                     [class.ngxsmk-calendar-horizontal]="calendarCount > 1 && calendarLayout === 'horizontal'"
                     [class.ngxsmk-calendar-vertical]="calendarCount > 1 && calendarLayout === 'vertical'"
                     [class.ngxsmk-calendar-auto]="calendarCount > 1 && calendarLayout === 'auto'">
                  @for (calendarMonth of multiCalendarMonths; track trackByCalendarMonth($index, calendarMonth)) {
                    <div class="ngxsmk-calendar-month" [class.ngxsmk-calendar-month-multi]="calendarCount > 1">
                      @if (calendarCount > 1) {
                        <div class="ngxsmk-calendar-month-header">
                          <span class="ngxsmk-calendar-month-title">{{ getMonthYearLabel(calendarMonth.month, calendarMonth.year) }}</span>
                        </div>
                      }
                  <div class="ngxsmk-days-grid-wrapper" 
                       (touchstart)="onCalendarSwipeStart($event)"
                       (touchmove)="onCalendarSwipeMove($event)"
                       (touchend)="onCalendarSwipeEnd($event)">
                        <div class="ngxsmk-days-grid" role="grid" [attr.aria-label]="getCalendarAriaLabelForMonth(calendarMonth.month, calendarMonth.year)">
                    @for (day of weekDays; track day) {
                      <div class="ngxsmk-day-name">{{ day }}</div>
                    }
                          @for (day of calendarMonth.days; track trackByDay($index, day)) {
                      <div class="ngxsmk-day-cell" [ngClass]="classes?.dayCell"
                                [class.empty]="!isCurrentMonthForCalendar(day, calendarMonth.month, calendarMonth.year)" [class.disabled]="isDateDisabledMemo(day)" 
                          [class.today]="isSameDayMemo(day, today)"
                          [class.holiday]="isHolidayMemo(day)"
                          [class.selected]="mode === 'single' && isSameDayMemo(day, selectedDate)"
                          [class.multiple-selected]="mode === 'multiple' && isMultipleSelected(day)"
                          [class.start-date]="mode === 'range' && isSameDayMemo(day, startDate)"
                          [class.end-date]="mode === 'range' && isSameDayMemo(day, endDate)"
                          [class.in-range]="mode === 'range' && isInRange(day)"
                          [class.preview-range]="isPreviewInRange(day)"
                          [class.focused]="day && focusedDate && isSameDayMemo(day, focusedDate)"
                          [attr.tabindex]="day && !isDateDisabledMemo(day) ? 0 : -1"
                          [attr.role]="day ? 'gridcell' : null"
                          [attr.aria-selected]="day && (mode === 'single' && isSameDayMemo(day, selectedDate)) ? 'true' : null"
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
                    </div>
                  }
                </div>
                }
                
                @if (calendarViewMode === 'year') {
                  <div class="ngxsmk-header" [ngClass]="classes?.header">
                    <div class="ngxsmk-year-display">
                      <button type="button" class="ngxsmk-view-toggle" (click)="calendarViewMode = 'decade'" [disabled]="disabled">
                        {{ _currentDecade }} - {{ _currentDecade + 9 }}
                      </button>
                    </div>
                    <div class="ngxsmk-nav-buttons">
                      <button type="button" class="ngxsmk-nav-button" (click)="changeYear(-12)" [disabled]="disabled" [attr.aria-label]="getTranslation('previousYears')" [ngClass]="classes?.navPrev">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                                d="M328 112L184 256l144 144"/>
                        </svg>
                      </button>
                      <button type="button" class="ngxsmk-nav-button" (click)="changeYear(12)" [disabled]="disabled" [attr.aria-label]="getTranslation('nextYears')" [ngClass]="classes?.navNext">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                                d="M184 112l144 144-144 144"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="ngxsmk-year-grid">
                    @for (year of yearGrid; track $index) {
                      <button type="button" 
                              class="ngxsmk-year-cell"
                              [class.selected]="year === _currentYear"
                              [class.today]="year === today.getFullYear()"
                              [disabled]="disabled"
                              (click)="onYearClick(year)"
                              (keydown.enter)="onYearClick(year)"
                              [attr.aria-label]="getTranslation('selectYear', undefined, { year: year })">
                        {{ year }}
                      </button>
                    }
                  </div>
                }
                
                @if (calendarViewMode === 'decade') {
                  <div class="ngxsmk-header" [ngClass]="classes?.header">
                    <div class="ngxsmk-decade-display">
                      {{ _currentDecade }} - {{ _currentDecade + 99 }}
                    </div>
                    <div class="ngxsmk-nav-buttons">
                      <button type="button" class="ngxsmk-nav-button" (click)="changeDecade(-1)" [disabled]="disabled" [attr.aria-label]="getTranslation('previousDecade')" [ngClass]="classes?.navPrev">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                                d="M328 112L184 256l144 144"/>
                        </svg>
                      </button>
                      <button type="button" class="ngxsmk-nav-button" (click)="changeDecade(1)" [disabled]="disabled" [attr.aria-label]="getTranslation('nextDecade')" [ngClass]="classes?.navNext">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                                d="M184 112l144 144-144 144"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="ngxsmk-decade-grid">
                    @for (decade of decadeGrid; track $index) {
                      <button type="button" 
                              class="ngxsmk-decade-cell"
                              [class.selected]="decade === _currentDecade"
                              [disabled]="disabled"
                              (click)="onDecadeClick(decade)"
                              (keydown.enter)="onDecadeClick(decade)"
                              [attr.aria-label]="getTranslation('selectDecade', undefined, { start: decade, end: decade + 9 })">
                        {{ decade }} - {{ decade + 9 }}
                      </button>
                    }
                  </div>
                }
                
                @if (calendarViewMode === 'timeline' && mode === 'range') {
                  <div class="ngxsmk-timeline-view">
                    <div class="ngxsmk-timeline-header">
                      <div class="ngxsmk-timeline-controls">
                        <button type="button" class="ngxsmk-timeline-zoom-out" (click)="timelineZoomOut()" [disabled]="disabled">-</button>
                        <span class="ngxsmk-timeline-range">{{ timelineStartDate | date:'shortDate' }} - {{ timelineEndDate | date:'shortDate' }}</span>
                        <button type="button" class="ngxsmk-timeline-zoom-in" (click)="timelineZoomIn()" [disabled]="disabled">+</button>
                      </div>
                    </div>
                    <div class="ngxsmk-timeline-container" #timelineContainer>
                      <div class="ngxsmk-timeline-track">
                        @for (month of timelineMonths; track month.getTime()) {
                          <div class="ngxsmk-timeline-month" 
                               [class.selected]="isTimelineMonthSelected(month)"
                               (click)="onTimelineMonthClick(month)"
                               (keydown.enter)="onTimelineMonthClick(month)"
                               (keydown.space)="onTimelineMonthClick(month); $event.preventDefault()"
                               role="button"
                               tabindex="0"
                               [attr.aria-label]="month | date:'MMMM yyyy'">
                            <div class="ngxsmk-timeline-month-label">{{ month | date:'MMM' }}</div>
                            <div class="ngxsmk-timeline-month-year">{{ month | date:'yyyy' }}</div>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                }
                
                @if (calendarViewMode === 'time-slider' && mode === 'range' && showTime) {
                  <div class="ngxsmk-time-slider-view">
                    <div class="ngxsmk-time-slider-header">
                      <div class="ngxsmk-time-slider-label">{{ getTranslation('startTime') }}</div>
                      <div class="ngxsmk-time-slider-value">{{ formatTimeSliderValue(startTimeSlider) }}</div>
                    </div>
                    <div class="ngxsmk-time-slider-container">
                      <input type="range" 
                             class="ngxsmk-time-slider"
                             [min]="0"
                             [max]="1440"
                             [step]="minuteInterval"
                             [(ngModel)]="startTimeSlider"
                             (ngModelChange)="onStartTimeSliderChange($event)"
                             [disabled]="disabled">
                    </div>
                    <div class="ngxsmk-time-slider-header">
                      <div class="ngxsmk-time-slider-label">{{ getTranslation('endTime') }}</div>
                      <div class="ngxsmk-time-slider-value">{{ formatTimeSliderValue(endTimeSlider) }}</div>
                    </div>
                    <div class="ngxsmk-time-slider-container">
                      <input type="range" 
                             class="ngxsmk-time-slider"
                             [min]="0"
                             [max]="1440"
                             [step]="minuteInterval"
                             [(ngModel)]="endTimeSlider"
                             (ngModelChange)="onEndTimeSliderChange($event)"
                             [disabled]="disabled">
                    </div>
                  </div>
                }
              }

              @if (showTime || timeOnly) {
                <div class="ngxsmk-time-selection">
                  <span class="ngxsmk-time-label">{{ getTranslation('time') }}</span>
                  <ngxsmk-custom-select
                    class="hour-select"
                    [options]="hourOptions"
                    [(value)]="currentDisplayHour"
                    (valueChange)="timeChange()"
                    [disabled]="disabled"
                  ></ngxsmk-custom-select>
                  <span class="ngxsmk-time-separator">:</span>
                  <ngxsmk-custom-select
                    class="minute-select"
                    [options]="minuteOptions"
                    [(value)]="currentMinute"
                    (valueChange)="timeChange()"
                    [disabled]="disabled"
                  ></ngxsmk-custom-select>
                  <ngxsmk-custom-select
                    class="ampm-select"
                    [options]="ampmOptions"
                    [(value)]="isPm"
                    (valueChange)="timeChange()"
                    [disabled]="disabled"
                  ></ngxsmk-custom-select>
                </div>
              }
              
              <div class="ngxsmk-footer" *ngIf="!isInlineMode" [ngClass]="classes?.footer">
                <button type="button" class="ngxsmk-clear-button-footer" (click)="clearValue($event)" [disabled]="disabled" [attr.aria-label]="_clearAriaLabel" [ngClass]="classes?.clearBtn">
                  {{ _clearLabel }}
                </button>
                <button type="button" class="ngxsmk-close-button" (click)="isCalendarOpen = false" [disabled]="disabled" [attr.aria-label]="_closeAriaLabel" [ngClass]="classes?.closeBtn">
                  {{ _closeLabel }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
      <div class="ngxsmk-aria-live-region" aria-live="polite" aria-atomic="true" style="position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;"></div>
    </div>
  `,
})
export class NgxsmkDatepickerComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit, ControlValueAccessor {
  private static _idCounter = 0;
  private static _allInstances = new Set<NgxsmkDatepickerComponent>();
  public _uniqueId = `ngxsmk-datepicker-${NgxsmkDatepickerComponent._idCounter++}`;

  @Input() mode: 'single' | 'range' | 'multiple' = 'single';
  @Input() calendarViewMode: 'month' | 'year' | 'decade' | 'timeline' | 'time-slider' = 'month';
  @Input() isInvalidDate: (date: Date) => boolean = () => false;
  @Input() showRanges: boolean = true;
  @Input() showTime: boolean = false;
  @Input() timeOnly: boolean = false;
  @Input() showCalendarButton: boolean = false;
  @Input() minuteInterval: number = 1;
  @Input() holidayProvider: HolidayProvider | null = null;
  @Input() disableHolidays: boolean = false;
  @Input() disabledDates: (string | Date)[] = [];
  @Input() disabledRanges: Array<{ start: Date | string; end: Date | string }> = [];
  @Input() recurringPattern?: { pattern: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'weekdays' | 'weekends'; startDate: Date; endDate?: Date; dayOfWeek?: number; dayOfMonth?: number; interval?: number } | null;
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
  @Input() yearRange: number = 10;
  @Input() timezone?: string;
  @Input() hooks: DatepickerHooks | null = null;
  @Input() enableKeyboardShortcuts: boolean = true;
  @Input() customShortcuts: { [key: string]: (context: KeyboardShortcutContext) => boolean } | null = null;
  @Input() autoApplyClose: boolean = false;
  @Input() displayFormat?: string;
  @Input() allowTyping: boolean = false;
  @Input() calendarCount: number = 1;
  @Input() calendarLayout: 'horizontal' | 'vertical' | 'auto' = 'auto';
  @Input() defaultMonthOffset: number = 0;

  private _isCalendarOpen = signal<boolean>(false);
  public get isCalendarOpen(): boolean {
    return this._isCalendarOpen();
  }
  public set isCalendarOpen(value: boolean) {
    this._isCalendarOpen.set(value);
    this.scheduleChangeDetection();
  }

  private isOpeningCalendar: boolean = false;
  private openCalendarTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private lastToggleTime: number = 0;
  private touchStartTime: number = 0;
  private touchStartElement: EventTarget | null = null;
  private pointerDownTime: number = 0;
  private isPointerEvent: boolean = false;

  public _internalValue: DatepickerValue = null;

  private _value: DatepickerValue = null;
  @Input() set value(val: DatepickerValue) {
    this._value = val;
    if (!this._field && val !== undefined) {
      const normalizedValue = this._normalizeValue(val);
      if (!this.isValueEqual(normalizedValue, this._internalValue)) {
        this._internalValue = normalizedValue;
        this.initializeValue(normalizedValue);
        this.generateCalendar();
      }
    }
  }
  get value(): DatepickerValue {
    return this._internalValue;
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

    if (field && typeof field === 'object') {
      this.syncFieldValue(field);

      this._fieldEffectRef = this.fieldSyncService.setupFieldSync(
        field,
        {
          onValueChanged: (value: DatepickerValue) => {
            this._internalValue = value;
            this.initializeValue(value);
            this.generateCalendar();
            setTimeout(() => {
              if (this._field === field) {
                this.scheduleChangeDetection();
              }
            }, 0);
          },
          onDisabledChanged: (disabled: boolean) => {
            if (this.disabled !== disabled) {
              this.disabled = disabled;
              this.scheduleChangeDetection();
            }
          },
          onSyncError: (error: unknown) => {
            console.warn('[NgxsmkDatepicker] Field sync error:', error);
          },
          normalizeValue: (value: unknown) => {
            return this._normalizeValue(value);
          },
          isValueEqual: (val1: DatepickerValue, val2: DatepickerValue) => {
            return this.isValueEqual(val1, val2);
          },
          onCalendarGenerated: () => {
          },
          onStateChanged: () => {
            this.scheduleChangeDetection();
          }
        }
      );
    }
  }
  get field(): SignalFormField {
    return this._field;
  }

  private syncFieldValue(field: SignalFormField): boolean {
    return this.fieldSyncService.syncFieldValue(field, {
      onValueChanged: (value: DatepickerValue) => {
        this._internalValue = value;
        this.initializeValue(value);
        this.generateCalendar();
        if (this.isBrowser) {
          setTimeout(() => {
            this.scheduleChangeDetection();
          }, 0);
        }
      },
      onDisabledChanged: (disabled: boolean) => {
        this.disabled = disabled;
      },
      onSyncError: (error: unknown) => {
        console.warn('[NgxsmkDatepicker] Field sync error:', error);
      },
      normalizeValue: (value: unknown) => {
        return this._normalizeValue(value);
      },
      isValueEqual: (val1: DatepickerValue, val2: DatepickerValue) => {
        return this.isValueEqual(val1, val2);
      },
      onCalendarGenerated: () => {
      },
      onStateChanged: () => {
        this.scheduleChangeDetection();
      }
    });
  }

  private _startAtDate: Date | null = null;
  @Input() set startAt(value: DateInput | null) { this._startAtDate = this._normalizeDate(value); }

  private _locale: string = 'en-US';
  @Input() set locale(value: string) {
    if (value && value !== this._locale) {
      this._locale = value;
      if (this.translationRegistry) {
        this.updateRtlState();
        this.initializeTranslations();
        this.generateLocaleData();
        this.generateCalendar();
        this.scheduleChangeDetection();
      }
    } else if (value) {
      this._locale = value;
    }
  }
  get locale(): string { return this._locale; }

  @Input() theme: 'light' | 'dark' = 'light';
  @HostBinding('class.dark-theme') get isDarkMode() { return this.theme === 'dark'; }

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
  @HostBinding('class.ngxsmk-rtl') get rtlClass() { return this.isRtl; }

  @Input() classes?: {
    wrapper?: string;
    inputGroup?: string;
    input?: string;
    clearBtn?: string;
    calendarBtn?: string;
    popover?: string;
    container?: string;
    calendar?: string;
    header?: string;
    navPrev?: string;
    navNext?: string;
    dayCell?: string;
    footer?: string;
    closeBtn?: string;
  };

  private onChange = (_: DatepickerValue) => { };
  private onTouched = () => { };
  public disabled = false;
  @Input() set disabledState(isDisabled: boolean) { this.disabled = isDisabled; }

  @Output() valueChange = new EventEmitter<DatepickerValue>();
  @Output() action = new EventEmitter<{ type: string; payload?: unknown }>();

  private _minDate: Date | null = null;
  @Input() set minDate(value: DateInput | null) {
    this._minDate = this._normalizeDate(value);
    this._updateMemoSignals();
  }

  private _maxDate: Date | null = null;
  @Input() set maxDate(value: DateInput | null) {
    this._maxDate = this._normalizeDate(value);
    this._updateMemoSignals();
  }

  private _ranges: { [key: string]: [Date, Date] } | null = null;
  @Input() set ranges(value: DateRange | null) {
    this._ranges = processDateRanges(value);
    this.updateRangesArray();
  }

  public currentDate: Date = new Date();
  public daysInMonth: (Date | null)[] = [];
  public multiCalendarMonths: Array<{month: number; year: number; days: (Date | null)[]}> = [];
  public weekDays: string[] = [];
  public readonly today: Date = getStartOfDay(new Date());
  public selectedDate: Date | null = null;
  public selectedDates: Date[] = [];
  public startDate: Date | null = null;
  public endDate: Date | null = null;
  public hoveredDate: Date | null = null;
  public rangesArray: { key: string; value: [Date, Date] }[] = [];

  private dateCellTouchStartTime: number = 0;
  private dateCellTouchStartDate: Date | null = null;
  private dateCellTouchStartX: number = 0;
  private dateCellTouchStartY: number = 0;
  private isDateCellTouching: boolean = false;
  private lastDateCellTouchDate: Date | null = null;
  private dateCellTouchHandled: boolean = false;
  private dateCellTouchHandledTime: number = 0;
  private touchHandledTimeout: ReturnType<typeof setTimeout> | null = null;

  private calendarSwipeStartX: number = 0;
  private calendarSwipeStartY: number = 0;
  private calendarSwipeStartTime: number = 0;
  private isCalendarSwiping: boolean = false;
  private readonly SWIPE_THRESHOLD = 50;
  private readonly SWIPE_TIME_THRESHOLD = 300;

  private _currentMonth: number = this.currentDate.getMonth();
  public _currentYear: number = this.currentDate.getFullYear();
  public _currentDecade: number = Math.floor(this.currentDate.getFullYear() / 10) * 10;

  public monthOptions: { label: string; value: number }[] = [];
  public yearOptions: { label: string; value: number }[] = [];
  public decadeOptions: { label: string; value: number }[] = [];
  public yearGrid: number[] = [];
  public decadeGrid: number[] = [];
  private firstDayOfWeek: number = 0;

  public currentHour: number = 0;
  public currentMinute: number = 0;
  public currentDisplayHour: number = 12;
  public isPm: boolean = false;

  public hourOptions: { label: string; value: number }[] = [];
  public minuteOptions: { label: string; value: number }[] = [];
  public ampmOptions: { label: string; value: boolean }[] = [
    { label: 'AM', value: false },
    { label: 'PM', value: true }
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
  private readonly globalConfig: DatepickerConfig | null = inject(DATEPICKER_CONFIG, { optional: true });
  private readonly fieldSyncService: FieldSyncService = inject(FieldSyncService);
  private readonly localeRegistry: LocaleRegistryService = inject(LocaleRegistryService);
  private readonly translationRegistry: TranslationRegistryService = inject(TranslationRegistryService);
  private readonly focusTrapService: FocusTrapService = inject(FocusTrapService);
  private readonly ariaLiveService: AriaLiveService = inject(AriaLiveService);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly dateComparator = createDateComparator();

  public typedInputValue: string = '';
  private isTyping: boolean = false;

  @ViewChild('popoverContainer', { static: false }) popoverContainer?: ElementRef<HTMLElement>;
  @ViewChild('dateInput', { static: false }) dateInput?: ElementRef<HTMLInputElement>;
  @ViewChild('monthSelect', { static: false }) monthSelect?: CustomSelectComponent;
  @ViewChild('yearSelect', { static: false }) yearSelect?: CustomSelectComponent;
  private focusTrapCleanup: (() => void) | null = null;

  private _translations: DatepickerTranslations | null = null;
  private _translationService: TranslationService | null = null;

  private _changeDetectionScheduled = false;

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

  private _currentMonthSignal = signal<number>(this.currentDate.getMonth());
  private _currentYearSignal = signal<number>(this.currentDate.getFullYear());
  private _holidayProviderSignal = signal<HolidayProvider | null>(null);
  private _disabledStateSignal = signal<{ minDate: Date | null; maxDate: Date | null; disabledDates: (string | Date)[] | null; disabledRanges: Array<{ start: Date | string; end: Date | string }> | null }>({
    minDate: null,
    maxDate: null,
    disabledDates: null,
    disabledRanges: null
  });

  private _cachedIsCurrentMonthMemo: ((day: Date | null) => boolean) | null = null;
  private _cachedIsDateDisabledMemo: ((day: Date | null) => boolean) | null = null;
  private _cachedIsSameDayMemo: ((d1: Date | null, d2: Date | null) => boolean) | null = null;
  private _cachedIsHolidayMemo: ((day: Date | null) => boolean) | null = null;
  private _cachedGetHolidayLabelMemo: ((day: Date | null) => string | null) | null = null;

  private _memoDependencies = computed(() => ({
    month: this._currentMonthSignal(),
    year: this._currentYearSignal(),
    holidayProvider: this._holidayProviderSignal(),
    disabledState: this._disabledStateSignal()
  }));

  private _updateMemoSignals(): void {
    this._currentMonthSignal.set(this._currentMonth);
    this._currentYearSignal.set(this._currentYear);
    this._holidayProviderSignal.set(this.holidayProvider || null);
    this._disabledStateSignal.set({
      minDate: this._minDate,
      maxDate: this._maxDate,
      disabledDates: this.disabledDates.length > 0 ? this.disabledDates : null,
      disabledRanges: this.disabledRanges.length > 0 ? this.disabledRanges : null
    });
  }

  private passiveTouchListeners: Array<() => void> = [];

  get isInlineMode(): boolean {
    if (this.inline === true || this.inline === 'always') {
      return true;
    }
    if (this.inline === 'auto' && this.isBrowser) {
      try {
        return window.matchMedia('(min-width: 768px)').matches;
      } catch {
        return false;
      }
    }
    return false;
  }

  private clearTouchHandledFlag(): void {
    this.dateCellTouchHandled = false;
    this.dateCellTouchHandledTime = 0;
    this.isDateCellTouching = false;
    if (this.touchHandledTimeout) {
      clearTimeout(this.touchHandledTimeout);
      this.touchHandledTimeout = null;
    }
  }

  private closeMonthYearDropdowns(): void {
    if (this.monthSelect && this.monthSelect.isOpen) {
      this.monthSelect.isOpen = false;
    }
    if (this.yearSelect && this.yearSelect.isOpen) {
      this.yearSelect.isOpen = false;
    }
  }

  private setTouchHandledFlag(duration: number = 300): void {
    this.dateCellTouchHandled = true;
    this.dateCellTouchHandledTime = Date.now();
    
    if (this.touchHandledTimeout) {
      clearTimeout(this.touchHandledTimeout);
    }
    
    this.touchHandledTimeout = setTimeout(() => {
      this.clearTouchHandledFlag();
    }, duration);
  }

  private isMobileDevice(): boolean {
    if (this.isBrowser) {
      try {
        const isMobileWidth = window.matchMedia('(max-width: 1024px)').matches;
        const hasTouchSupport = 'ontouchstart' in window || (navigator as any).maxTouchPoints > 0;
        const hasPointerEvents = 'onpointerdown' in window;
        const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        return isMobileWidth || (hasTouchSupport && isMobileWidth) || (hasPointerEvents && isMobileWidth) || isMobileUserAgent;
      } catch {
        return 'ontouchstart' in window || (navigator as any).maxTouchPoints > 0;
      }
    }
    return false;
  }

  get isCalendarVisible(): boolean {
    return this.isInlineMode || this.isCalendarOpen;
  }

  get displayValue(): string {
    if (this.hooks?.formatDisplayValue) {
      const value = this.hooks.formatDisplayValue(this._internalValue, this.mode);
      if (!this.isTyping && this.allowTyping) {
        this.typedInputValue = value || '';
      }
      return value;
    }

    if (this.displayFormat) {
      const value = this.formatWithCustomFormat();
      if (!this.isTyping && this.allowTyping) {
        this.typedInputValue = value || '';
      }
      return value;
    }

    if (this.timeOnly) {
      let timeResult = '';
      if (this.mode === 'single' && this.selectedDate) {
        const options: Intl.DateTimeFormatOptions = {
          hour: '2-digit',
          minute: '2-digit'
        };
        timeResult = formatDateWithTimezone(this.selectedDate, this.locale, options, this.timezone);
      } else if (this.mode === 'range' && this.startDate) {
        if (this.endDate) {
          const startOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
          const endOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
          const start = formatDateWithTimezone(this.startDate, this.locale, startOptions, this.timezone);
          const end = formatDateWithTimezone(this.endDate, this.locale, endOptions, this.timezone);
          timeResult = `${start} - ${end}`;
        } else {
          const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
          const start = formatDateWithTimezone(this.startDate, this.locale, options, this.timezone);
          timeResult = `${start}...`;
        }
      } else if (this.mode === 'multiple' && this.selectedDates.length > 0) {
        timeResult = this.getTranslation('timesSelected', undefined, { count: this.selectedDates.length });
      }
      
      if (!this.isTyping && this.allowTyping) {
        this.typedInputValue = timeResult;
      }
      
      return timeResult;
    }

    let result = '';
    if (this.mode === 'single' && this.selectedDate) {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      };

      if (this.showTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
      }

      result = formatDateWithTimezone(this.selectedDate, this.locale, options, this.timezone);
    } else if (this.mode === 'range' && this.startDate) {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      };
      if (this.endDate) {
        const start = formatDateWithTimezone(this.startDate, this.locale, options, this.timezone);
        const end = formatDateWithTimezone(this.endDate, this.locale, options, this.timezone);
        result = `${start} - ${end}`;
      } else {
        const start = formatDateWithTimezone(this.startDate, this.locale, options, this.timezone);
        result = `${start}...`;
      }
    } else if (this.mode === 'multiple' && this.selectedDates.length > 0) {
      result = this.getTranslation('datesSelected', undefined, { count: this.selectedDates.length });
    }
    
    if (!this.isTyping && this.allowTyping) {
      this.typedInputValue = result;
    }
    
    return result;
  }

  private formatWithCustomFormat(): string {
    if (!this.displayFormat) return '';

    const adapter = this.globalConfig?.dateAdapter;

    if (adapter && typeof adapter.format === 'function') {
      if (this.mode === 'single' && this.selectedDate) {
        return adapter.format(this.selectedDate, this.displayFormat, this.locale);
      } else if (this.mode === 'range' && this.startDate) {
        if (this.endDate) {
          const start = adapter.format(this.startDate, this.displayFormat, this.locale);
          const end = adapter.format(this.endDate, this.displayFormat, this.locale);
          return `${start} - ${end}`;
        } else {
          return adapter.format(this.startDate, this.displayFormat, this.locale) + '...';
        }
      } else if (this.mode === 'multiple' && this.selectedDates.length > 0) {
        return this.getTranslation('datesSelected', undefined, { count: this.selectedDates.length });
      }
    }

    if (this.mode === 'single' && this.selectedDate) {
      return this.formatDateSimple(this.selectedDate, this.displayFormat);
    } else if (this.mode === 'range' && this.startDate) {
      if (this.endDate) {
        const start = this.formatDateSimple(this.startDate, this.displayFormat);
        const end = this.formatDateSimple(this.endDate, this.displayFormat);
        return `${start} - ${end}`;
      } else {
        return this.formatDateSimple(this.startDate, this.displayFormat) + '...';
      }
    } else if (this.mode === 'multiple' && this.selectedDates.length > 0) {
      return this.getTranslation('datesSelected', undefined, { count: this.selectedDates.length });
    }

    return '';
  }

  private formatDateSimple(date: Date, format: string): string {
    if (!date || isNaN(date.getTime())) return '';

    const pad = (n: number, len: number = 2) => n.toString().padStart(len, '0');

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;

    return format
      .replace(/YYYY/g, year.toString())
      .replace(/YY/g, year.toString().slice(-2))
      .replace(/MM/g, pad(month))
      .replace(/M/g, month.toString())
      .replace(/DD/g, pad(day))
      .replace(/D/g, day.toString())
      .replace(/hh/g, pad(hours12))
      .replace(/h/g, hours12.toString())
      .replace(/HH/g, pad(hours))
      .replace(/H/g, hours.toString())
      .replace(/mm/g, pad(minutes))
      .replace(/m/g, minutes.toString())
      .replace(/ss/g, pad(seconds))
      .replace(/s/g, seconds.toString())
      .replace(/a/g, ampm.toLowerCase())
      .replace(/A/g, ampm);
  }

  get isBackArrowDisabled(): boolean {
    if (!this._minDate) return false;
    const firstDayOfCurrentMonth = new Date(this.currentYear, this.currentMonth, 1);
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

  get isDateDisabledMemo(): (day: Date | null) => boolean {
    const deps = this._memoDependencies();
    const disabledState = deps.disabledState;

    const currentDisabledState = {
      minDate: this._minDate,
      maxDate: this._maxDate,
      disabledDates: this.disabledDates.length > 0 ? this.disabledDates : null,
      disabledRanges: this.disabledRanges.length > 0 ? this.disabledRanges : null
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
      setTimeout(() => {
        this._disabledStateSignal.set(currentDisabledState);
      }, 0);
    }

    this._cachedIsDateDisabledMemo = (day: Date | null) => {
      if (!day) return false;
      return this.isDateDisabled(day);
    };
    return this._cachedIsDateDisabledMemo;
  }

  get isSameDayMemo(): (d1: Date | null, d2: Date | null) => boolean {
    if (this._cachedIsSameDayMemo) {
      return this._cachedIsSameDayMemo;
    }
    this._cachedIsSameDayMemo = (d1: Date | null, d2: Date | null) => this.dateComparator(d1, d2);
    return this._cachedIsSameDayMemo;
  }

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
    if (this._cachedGetHolidayLabelMemo && holidayProvider === currentProvider) {
      return this._cachedGetHolidayLabelMemo;
    }

    if (holidayProvider !== currentProvider) {
      this._holidayProviderSignal.set(currentProvider);
    }

    const provider = currentProvider;
    const isHolidayFn = this.isHolidayMemo;
    this._cachedGetHolidayLabelMemo = (day: Date | null) => {
      if (!day || !provider || !isHolidayFn(day)) return null;
      return provider.getHolidayLabel ? provider.getHolidayLabel(getStartOfDay(day)) : 'Holiday';
    };
    return this._cachedGetHolidayLabelMemo;
  }

  trackByDay(index: number, day: Date | null): string {
    return day ? day.getTime().toString() : `empty-${index}`;
  }

  trackByCalendarMonth(_index: number, calendarMonth: {month: number; year: number; days: (Date | null)[]}): string {
    return `${calendarMonth.year}-${calendarMonth.month}`;
  }

  trackByRange(_index: number, range: { key: string; value: [Date, Date] }): string {
    return range.key;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent | TouchEvent): void {
    if (!this.isBrowser || this.isInlineMode) {
      return;
    }

    const target = event.target as Node;
    const nativeElement = this.elementRef.nativeElement;

    if (!target || !nativeElement) {
      return;
    }

    const isInsideInputGroup = nativeElement.contains(target);

    let isInsidePopover = false;
    if (this.isBrowser && nativeElement) {
      const popoverContainer = (nativeElement as HTMLElement).querySelector('.ngxsmk-popover-container');
      if (popoverContainer && (popoverContainer === target || popoverContainer.contains(target))) {
        isInsidePopover = true;
      }
    }

    if (isInsideInputGroup || isInsidePopover) {
      return;
    }

    const isInsideOtherDatepicker = Array.from(NgxsmkDatepickerComponent._allInstances).some((instance: NgxsmkDatepickerComponent) => {
      if (instance === this || instance.isInlineMode) {
        return false;
      }
      const otherElement = instance.elementRef.nativeElement;
      if (otherElement && (otherElement === target || otherElement.contains(target))) {
        const otherPopover = (otherElement as HTMLElement).querySelector('.ngxsmk-popover-container');
        if (otherPopover && (otherPopover === target || otherPopover.contains(target))) {
          return true;
        }
      }
      return false;
    });

    if (isInsideOtherDatepicker) {
      return;
    }

    if (!this.isCalendarOpen) {
      return;
    }

    const now = Date.now();
    const timeSinceToggle = this.lastToggleTime > 0 ? now - this.lastToggleTime : Infinity;

    const protectionTime = this.isMobileDevice() ? 1000 : 300;

    if (this.isOpeningCalendar || timeSinceToggle < protectionTime) {
      return;
    }
    this.isCalendarOpen = false;
    this.isOpeningCalendar = false;
  }

  @HostListener('document:touchstart', ['$event'])
  onDocumentTouchStart(event: TouchEvent): void {
    if (!this.isBrowser || this.isInlineMode) {
      return;
    }

    const target = event.target as Node;
    const nativeElement = this.elementRef.nativeElement;

    if (!target || !nativeElement) {
      return;
    }

    const isInsideInputGroup = nativeElement.contains(target);

    let isInsidePopover = false;
    if (this.isBrowser && nativeElement) {
      const popoverContainer = (nativeElement as HTMLElement).querySelector('.ngxsmk-popover-container');
      if (popoverContainer && (popoverContainer === target || popoverContainer.contains(target))) {
        isInsidePopover = true;
      }
    }

    if (isInsideInputGroup || isInsidePopover) {
      return;
    }

    const isInsideOtherDatepicker = Array.from(NgxsmkDatepickerComponent._allInstances).some((instance: NgxsmkDatepickerComponent) => {
      if (instance === this || instance.isInlineMode) {
        return false;
      }
      const otherElement = instance.elementRef.nativeElement;
      if (otherElement && (otherElement === target || otherElement.contains(target))) {
        const otherPopover = (otherElement as HTMLElement).querySelector('.ngxsmk-popover-container');
        if (otherPopover && (otherPopover === target || otherPopover.contains(target))) {
          return true;
        }
      }
      return false;
    });

    if (isInsideOtherDatepicker) {
      return;
    }

    if (!this.isCalendarOpen) {
      return;
    }

    const now = Date.now();
    const timeSinceToggle = this.lastToggleTime > 0 ? now - this.lastToggleTime : Infinity;
    const protectionTime = this.isMobileDevice() ? 1000 : 300;

    if (this.isOpeningCalendar || timeSinceToggle < protectionTime) {
      return;
    }

    this.isCalendarOpen = false;
    this.isOpeningCalendar = false;
  }

  public onTouchStart(event: TouchEvent): void {
    if (this.disabled || this.isInlineMode) {
      return;
    }
    this.touchStartTime = Date.now();
    this.touchStartElement = event.currentTarget;
  }

  public onInputGroupFocus(): void {
    if (this._field && !this.disabled) {
      this.syncFieldValue(this._field);
    }
  }

  public onTouchEnd(event: TouchEvent): void {
    if (this.disabled || this.isInlineMode) {
      this.touchStartTime = 0;
      this.touchStartElement = null;
      return;
    }

    const now = Date.now();
    const timeSinceTouch = this.touchStartTime > 0 ? now - this.touchStartTime : 0;

    const touch = event.changedTouches[0];
    const isSameElement = touch && this.touchStartElement &&
      (touch.target === this.touchStartElement ||
        (this.touchStartElement as Node).contains &&
        (this.touchStartElement as Node).contains(touch.target as Node));

    if (this.touchStartTime === 0 || timeSinceTouch > 800 || !isSameElement) {
      this.touchStartTime = 0;
      this.touchStartElement = null;
      return;
    }

    const timeSinceToggle = this.lastToggleTime > 0 ? now - this.lastToggleTime : Infinity;
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

    if (!wasOpen) {
      NgxsmkDatepickerComponent._allInstances.forEach((instance: NgxsmkDatepickerComponent) => {
        if (instance !== this && instance.isCalendarOpen && !instance.isInlineMode) {
          instance.isCalendarOpen = false;
          instance.isOpeningCalendar = false;
          instance.updateOpeningState(false);
          instance.cdr.markForCheck();
        }
      });

      this.isOpeningCalendar = true;
      this.isCalendarOpen = true;
      this.lastToggleTime = now;
      
      // Close any open month/year dropdowns when calendar opens (especially important for mobile)
      this.closeMonthYearDropdowns();

      setTimeout(() => {
        this.touchStartTime = 0;
        this.touchStartElement = null;
      }, 500);

      if (this.defaultMonthOffset !== 0 && !this._internalValue && !this._startAtDate) {
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
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.setupPassiveTouchListeners();
            this.scheduleChangeDetection();
            const timeoutDelay = this.isMobileDevice() ? 800 : 300;
            if (this.isOpeningCalendar) {
              setTimeout(() => {
                this.isOpeningCalendar = false;
                this.setupPassiveTouchListeners();
                this.scheduleChangeDetection();
              }, timeoutDelay);
            }
          });
        });
      }
    } else {
      this.isCalendarOpen = false;
      this.isOpeningCalendar = false;
      this.lastToggleTime = now;

      this.touchStartTime = 0;
      this.touchStartElement = null;

      if (this.openCalendarTimeoutId) {
        clearTimeout(this.openCalendarTimeoutId);
        this.openCalendarTimeoutId = null;
      }

      this.updateOpeningState(false);
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
    this.touchStartElement = event.currentTarget;
  }

  public onPointerUp(event: PointerEvent): void {
    if (this.disabled || this.isInlineMode || !this.isPointerEvent || event.pointerType === 'mouse') {
      this.isPointerEvent = false;
      return;
    }

    const target = event.target as HTMLElement;
    if (target && target.closest('.ngxsmk-clear-button')) {
      this.isPointerEvent = false;
      this.pointerDownTime = 0;
      this.touchStartTime = 0;
      this.touchStartElement = null;
      return;
    }

    const now = Date.now();
    const timeSincePointerDown = this.pointerDownTime > 0 ? now - this.pointerDownTime : 0;

    if (this.pointerDownTime === 0 || timeSincePointerDown > 600) {
      this.isPointerEvent = false;
      this.pointerDownTime = 0;
      this.touchStartTime = 0;
      this.touchStartElement = null;
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const wasOpen = this.isCalendarOpen;
    this.isPointerEvent = false;
    this.pointerDownTime = 0;
    this.touchStartTime = 0;
    this.touchStartElement = null;

    if (!wasOpen) {
      this.isOpeningCalendar = true;
      this.isCalendarOpen = true;
      this.lastToggleTime = now;
      
      this.closeMonthYearDropdowns();

      if (this.openCalendarTimeoutId) {
        clearTimeout(this.openCalendarTimeoutId);
      }

      this.updateOpeningState(true);

      if (this.isBrowser) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.setupPassiveTouchListeners();
            this.scheduleChangeDetection();
          });
        });

        const timeoutDelay = this.isMobileDevice() ? 800 : 350;
        this.openCalendarTimeoutId = setTimeout(() => {
          this.isOpeningCalendar = false;
          this.setupPassiveTouchListeners();
          this.openCalendarTimeoutId = null;
          this.cdr.markForCheck();
        }, timeoutDelay);
      }
    } else {
      this.isCalendarOpen = false;
      this.isOpeningCalendar = false;

      if (this.openCalendarTimeoutId) {
        clearTimeout(this.openCalendarTimeoutId);
        this.openCalendarTimeoutId = null;
      }

      this.updateOpeningState(false);
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
    if (!this.enableKeyboardShortcuts) {
      return false;
    }

    const context: KeyboardShortcutContext = {
      currentDate: this.currentDate,
      selectedDate: this.selectedDate,
      startDate: this.startDate,
      endDate: this.endDate,
      selectedDates: this.selectedDates,
      mode: this.mode,
      focusedDate: this.focusedDate,
      isCalendarOpen: this.isCalendarOpen
    };

    if (this.customShortcuts) {
      const key = this.getShortcutKey(event);
      if (key && this.customShortcuts[key]) {
        const handled = this.customShortcuts[key](context);
        if (handled) {
          event.preventDefault();
          event.stopPropagation();
          return true;
        }
      }
    }

    if (this.hooks?.handleShortcut) {
      const handled = this.hooks.handleShortcut(event, context);
      if (handled) {
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
    }
    switch (event.key) {
      case 'ArrowLeft':
        this.navigateDate(this.isRtl ? 1 : -1, 0);
        return true;
      case 'ArrowRight':
        this.navigateDate(this.isRtl ? -1 : 1, 0);
        return true;
      case 'ArrowUp':
        this.navigateDate(0, -1);
        return true;
      case 'ArrowDown':
        this.navigateDate(0, 1);
        return true;
      case 'PageUp':
        if (event.shiftKey) {
          this.currentYear = this.currentYear - 1;
        } else {
          this.changeMonth(-1);
        }
        return true;
      case 'PageDown':
        if (event.shiftKey) {
          this.currentYear = this.currentYear + 1;
        } else {
          this.changeMonth(1);
        }
        return true;
      case 'Home':
        this.navigateToFirstDay();
        return true;
      case 'End':
        this.navigateToLastDay();
        return true;
      case 'Enter':
      case ' ':
        if (this.focusedDate) {
          this.onDateClick(this.focusedDate);
        }
        return true;
      case 'Escape':
        if (!this.isInlineMode) {
          this.isCalendarOpen = false;
        }
        return true;
      case 't':
      case 'T':
        if (!event.ctrlKey && !event.metaKey) {
          this.selectToday();
          return true;
        }
        return false;
      case 'y':
      case 'Y':
        if (!event.ctrlKey && !event.metaKey) {
          this.selectYesterday();
          return true;
        }
        return false;
      case 'n':
      case 'N':
        if (!event.ctrlKey && !event.metaKey) {
          this.selectTomorrow();
          return true;
        }
        return false;
      case 'w':
      case 'W':
        if (!event.ctrlKey && !event.metaKey) {
          this.selectNextWeek();
          return true;
        }
        return false;
      default:
        return false;
    }
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
    newDate.setDate(newDate.getDate() + days + (weeks * 7));

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
      if (!this.hooks.validateDate(date, this._internalValue, this.mode)) {
        return false;
      }
    }

    return true;
  }

  getDayCellCustomClasses(day: Date | null): string[] {
    if (!day || !this.hooks?.getDayCellClasses) return [];

    const isSelected = this.mode === 'single' && this.isSameDayMemo(day, this.selectedDate) ||
      this.mode === 'multiple' && this.isMultipleSelected(day) ||
      this.mode === 'range' && (this.isSameDayMemo(day, this.startDate) || this.isSameDayMemo(day, this.endDate));
    const isDisabled = this.isDateDisabledMemo(day);
    const isToday = this.isSameDayMemo(day, this.today);
    const isHoliday = this.isHolidayMemo(day);

    return this.hooks.getDayCellClasses(day, isSelected, isDisabled, isToday, isHoliday) || [];
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

  getAriaLabel(day: Date | null): string {
    if (!day) return '';

    if (this.hooks?.formatAriaLabel) {
      return this.hooks.formatAriaLabel(day);
    }

    return day.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }


  writeValue(val: DatepickerValue): void {
    const normalizedVal = val !== null && val !== undefined
      ? this._normalizeValue(val) as DatepickerValue
      : null;
    this._internalValue = normalizedVal;
    this.initializeValue(normalizedVal);
    this.generateCalendar();
  }

  registerOnChange(fn: (value: DatepickerValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private emitValue(val: DatepickerValue) {
    const normalizedVal = val !== null && val !== undefined
      ? (this._normalizeValue(val) as DatepickerValue)
      : null;

    this._internalValue = normalizedVal;

    if (this._field) {
      this.fieldSyncService.updateFieldFromInternal(normalizedVal, this._field);
    }

    this.valueChange.emit(normalizedVal);
    this.onChange(normalizedVal);
    this.onTouched();

    if (!this.isInlineMode && val !== null && !this.timeOnly) {
      if (this.mode === 'single' || (this.mode === 'range' && this.startDate && this.endDate)) {
        this.isCalendarOpen = false;
      }
    }
  }

  public toggleCalendar(event?: Event): void {
    if (this.disabled || this.isInlineMode) return;

    // Don't open calendar if click/touch originated from clear button
    if (event && event.target) {
      const target = event.target as HTMLElement;
      const isClearButton = target.closest('.ngxsmk-clear-button');
      if (isClearButton) {
        return;
      }
    }

    const now = Date.now();
    const timeSinceToggle = this.lastToggleTime > 0 ? now - this.lastToggleTime : Infinity;
    if (timeSinceToggle < 300) {
      return;
    }

    if (!event) {
      const wasOpen = this.isCalendarOpen;
      const willOpen = !wasOpen;
      this.isCalendarOpen = !wasOpen;
      this.lastToggleTime = now;
      if (willOpen) {
        this.closeMonthYearDropdowns();
        if (this.defaultMonthOffset !== 0 && !this._internalValue && !this._startAtDate) {
          const nextMonth = new Date();
          nextMonth.setMonth(nextMonth.getMonth() + this.defaultMonthOffset);
          nextMonth.setDate(1);
          this.currentDate = nextMonth;
          this._currentMonth = nextMonth.getMonth();
          this._currentYear = nextMonth.getFullYear();
          this._invalidateMemoCache();
        }
        this.generateCalendar();
      }
      this.updateOpeningState(willOpen && this.isCalendarOpen);
      
      if (willOpen && this.isCalendarOpen) {
        this.closeMonthYearDropdowns();
        
        if (this.isBrowser) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              this.setupPassiveTouchListeners();
            });
          });
        }
        
        setTimeout(() => {
          this.setupFocusTrap();
          if (this.isBrowser) {
            this.setupPassiveTouchListeners();
          }
          this.closeMonthYearDropdowns();
          const monthName = this.currentDate.toLocaleDateString(this.locale, { month: 'long' });
          const year = String(this.currentDate.getFullYear());
          const calendarOpenedMsg = this.getTranslation('calendarOpened' as keyof DatepickerTranslations, undefined, {
            month: monthName,
            year: year
          }) || `Calendar opened for ${monthName} ${year}`;
          this.ariaLiveService.announce(calendarOpenedMsg, 'polite');
        }, 100);
      } else if (!willOpen) {
        this.removeFocusTrap();
        const calendarClosedMsg = this.getTranslation('calendarClosed' as keyof DatepickerTranslations) || 'Calendar closed';
        this.ariaLiveService.announce(calendarClosedMsg, 'polite');
      }
      
      return;
    }

    if (event.type === 'touchstart') {
      return;
    }

    if (event.type === 'click') {
      const target = event.target as HTMLElement;
      if (this.allowTyping && target && target.tagName === 'INPUT' && target.classList.contains('ngxsmk-display-input')) {
        return;
      }
      if (target && target.closest('.ngxsmk-clear-button')) {
        return;
      }

      const now = Date.now();

      const touchDetectionWindow = this.isMobileDevice() ? 600 : 300;
      if (this.touchStartElement && this.touchStartTime > 0) {
        const timeSinceTouch = now - this.touchStartTime;
        if (timeSinceTouch < touchDetectionWindow && (this.touchStartElement === event.target ||
          (event.target as Node) && this.touchStartElement &&
          (this.touchStartElement as Node).contains &&
          (this.touchStartElement as Node).contains(event.target as Node))) {
          if (this.isOpeningCalendar || (timeSinceTouch < 500 && this.isCalendarOpen)) {
            return;
          }
        }
      }
      if (now - this.lastToggleTime < 300) {
        return;
      }

      this.lastToggleTime = now;
    }

    event.stopPropagation();

    const wasOpen = this.isCalendarOpen;
    const willOpen = !wasOpen;

    if (willOpen) {
      NgxsmkDatepickerComponent._allInstances.forEach((instance: NgxsmkDatepickerComponent) => {
        if (instance !== this && instance.isCalendarOpen && !instance.isInlineMode) {
          instance.isCalendarOpen = false;
          instance.isOpeningCalendar = false;
          instance.updateOpeningState(false);
          instance.cdr.markForCheck();
        }
      });

      if (this._field) {
        this.syncFieldValue(this._field);
      }

      if (this.defaultMonthOffset !== 0 && !this._internalValue && !this._startAtDate) {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + this.defaultMonthOffset);
        nextMonth.setDate(1);
        this.currentDate = nextMonth;
        this._currentMonth = nextMonth.getMonth();
        this._currentYear = nextMonth.getFullYear();
        this._invalidateMemoCache();
      }

      this.generateCalendar();
    }

    this.isCalendarOpen = !wasOpen;
    this.updateOpeningState(willOpen && this.isCalendarOpen);
    
    if (willOpen && this.isCalendarOpen) {
      setTimeout(() => {
        this.setupFocusTrap();
        // Setup touch listeners when calendar opens for mobile support
        if (this.isBrowser) {
          this.setupPassiveTouchListeners();
        }
        const monthName = this.currentDate.toLocaleDateString(this.locale, { month: 'long' });
        const year = String(this.currentDate.getFullYear());
        const calendarOpenedMsg = this.getTranslation('calendarOpened' as keyof DatepickerTranslations, undefined, {
          month: monthName,
          year: year
        }) || `Calendar opened for ${monthName} ${year}`;
        this.ariaLiveService.announce(calendarOpenedMsg, 'polite');
      }, 100);
    } else if (!willOpen) {
      this.removeFocusTrap();
      const calendarClosedMsg = this.getTranslation('calendarClosed' as keyof DatepickerTranslations) || 'Calendar closed';
      this.ariaLiveService.announce(calendarClosedMsg, 'polite');
    }
  }

  public onBackdropInteract(event: Event): void {
    event.stopPropagation();
    if (event instanceof KeyboardEvent) {
      event.preventDefault();
    }

    this.isCalendarOpen = false;
    this.isOpeningCalendar = false;
    this.updateOpeningState(false);
    this.lastToggleTime = Date.now();
  }

  private updateOpeningState(isOpening: boolean): void {
    if (isOpening) {
      this.isOpeningCalendar = true;

      if (this.openCalendarTimeoutId) {
        clearTimeout(this.openCalendarTimeoutId);
      }

      const timeoutDelay = this.isMobileDevice() ? 800 : 200;
      this.openCalendarTimeoutId = setTimeout(() => {
        this.isOpeningCalendar = false;
        this.openCalendarTimeoutId = null;
        this.cdr.markForCheck();
      }, timeoutDelay);
    } else {
      this.isOpeningCalendar = false;
      if (this.openCalendarTimeoutId) {
        clearTimeout(this.openCalendarTimeoutId);
        this.openCalendarTimeoutId = null;
      }
    }
  }

  private closeCalendar(): void {
    if (!this.isInlineMode) {
      this.removeFocusTrap();
      this.isCalendarOpen = false;
      const calendarClosedMsg = this.getTranslation('calendarClosed' as keyof DatepickerTranslations) || 'Calendar closed';
      this.ariaLiveService.announce(calendarClosedMsg, 'polite');
      this.cdr.markForCheck();
    }
  }

  private shouldAutoClose(): boolean {
    if (!this.autoApplyClose || this.showTime || this.timeOnly || this.isInlineMode) {
      return false;
    }

    if (this.mode === 'single') {
      return this.selectedDate !== null;
    } else if (this.mode === 'range') {
      return this.startDate !== null && this.endDate !== null;
    }

    return false;
  }

  public clearValue(event?: MouseEvent | TouchEvent): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (this.disabled) return;

    // Clear touch state to prevent interference
    this.clearTouchHandledFlag();

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

  get currentMonth(): number { return this._currentMonth; }

  set currentMonth(month: number) {
    if (this.disabled) return;
    if (this._currentMonth !== month) {
      this._currentMonth = month;
      this._currentMonthSignal.set(month);
      this.currentDate.setMonth(month);
      this._invalidateMemoCache();
      this.generateCalendar();
    }
  }

  get currentYear(): number { return this._currentYear; }

  set currentYear(year: number) {
    if (this.disabled) return;
    if (this._currentYear !== year) {
      this._currentYear = year;
      this._currentYearSignal.set(year);
      this.currentDate.setFullYear(year);
      this._invalidateMemoCache();
      this.generateCalendar();
    }
  }

  ngOnInit(): void {
    NgxsmkDatepickerComponent._allInstances.add(this);

    this.applyGlobalConfig();
    this.applyAnimationConfig();

    this._updateMemoSignals();

    if (this._locale === 'en-US' && this.isBrowser && typeof navigator !== 'undefined' && navigator.language) {
      this._locale = navigator.language;
    }

    this.initializeTranslations();

    if (this.timeOnly) {
      this.showTime = true;
    }

    this.updateRtlState();
    this.today.setHours(0, 0, 0, 0);
    this.generateLocaleData();
    this.generateTimeOptions();
    this.generateYearGrid();
    this.generateDecadeGrid();
    if (this.calendarViewMode === 'timeline') {
      this.generateTimeline();
    }
    if (this.calendarViewMode === 'time-slider' && this.mode === 'range' && this.showTime) {
      this.initializeTimeSliders();
    }

    if ((this.showTime || this.timeOnly) && !this._internalValue) {
      const now = new Date();
      this.currentHour = now.getHours();
      this.currentMinute = Math.floor(now.getMinutes() / this.minuteInterval) * this.minuteInterval;

      if (this.currentMinute === 60) {
        this.currentMinute = 0;
        this.currentHour = (this.currentHour + 1) % 24;
      }
      this.update12HourState(this.currentHour);

      if (this.timeOnly && !this._internalValue) {
        const today = new Date();
        today.setHours(this.currentHour, this.currentMinute, 0, 0);
        this.selectedDate = today;
        this.currentDate = new Date(today);
        this._currentMonth = today.getMonth();
        this._currentYear = today.getFullYear();
        this._invalidateMemoCache();
      }
    }

    let initialValue: DatepickerValue = null;
    if (this._field) {
      try {
        const fieldValue = typeof this._field.value === 'function' ? this._field.value() : this._field.value;
        initialValue = this._normalizeValue(fieldValue);
      } catch (error) {
        console.warn('[NgxsmkDatepicker] Error reading initial field value:', error);
        initialValue = null;
      }
    } else if (this._value !== null) {
      initialValue = this._value;
    } else if (this._internalValue !== null) {
      initialValue = this._internalValue;
    }

    if (initialValue) {
      this.initializeValue(initialValue);
      this._internalValue = initialValue;
    } else {
      this.initializeValue(null);
    }
    this.generateCalendar();

    if (this._field && this.isBrowser) {
      setTimeout(() => {
        if (this._field) {
          this.syncFieldValue(this._field);
        }
      }, 50);

      setTimeout(() => {
        if (this._field) {
          this.syncFieldValue(this._field);
        }
      }, 200);

      setTimeout(() => {
        if (this._field) {
          this.syncFieldValue(this._field);
        }
      }, 500);

      setTimeout(() => {
        if (this._field) {
          this.syncFieldValue(this._field);
        }
      }, 1000);
    }
  }

  ngAfterViewInit(): void {
    if (this.allowTyping && this.displayValue) {
      this.typedInputValue = this.displayValue;
    }
    
    if (this.isBrowser) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.setupPassiveTouchListeners();
          this.setupInputGroupPassiveListeners();

          setTimeout(() => {
            this.setupInputGroupPassiveListeners();
          }, 100);
        });
      });

      if (this._field) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.syncFieldValue(this._field);
          });
        });

        setTimeout(() => {
          if (this._field) {
            this.syncFieldValue(this._field);
          }
        }, 100);

        setTimeout(() => {
          if (this._field) {
            this.syncFieldValue(this._field);
          }
        }, 300);

        setTimeout(() => {
          if (this._field) {
            this.syncFieldValue(this._field);
          }
        }, 700);
      }
    }
  }

  private setupInputGroupPassiveListeners(): void {
    const nativeElement = this.elementRef.nativeElement;
    if (!nativeElement) {
      setTimeout(() => this.setupInputGroupPassiveListeners(), 50);
      return;
    }

    const inputGroup = nativeElement.querySelector('.ngxsmk-input-group') as HTMLElement;
    if (!inputGroup) {
      setTimeout(() => this.setupInputGroupPassiveListeners(), 50);
      return;
    }

    if ((inputGroup as any).__ngxsmk_touch_listeners_setup) {
      return;
    }
    (inputGroup as any).__ngxsmk_touch_listeners_setup = true;

    const touchStartHandler = (event: TouchEvent) => {
      this.onTouchStart(event);
    };
    inputGroup.addEventListener('touchstart', touchStartHandler, { passive: true });

    const touchEndHandler = (event: TouchEvent) => {
      this.onTouchEnd(event);
    };
    inputGroup.addEventListener('touchend', touchEndHandler, { passive: false });
    this.passiveTouchListeners.push(() => {
      (inputGroup as any).__ngxsmk_touch_listeners_setup = false;
      inputGroup.removeEventListener('touchstart', touchStartHandler);
      inputGroup.removeEventListener('touchend', touchEndHandler);
    });
  }

  private setupPassiveTouchListeners(): void {
    this.passiveTouchListeners.forEach(cleanup => cleanup());
    this.passiveTouchListeners = [];

    if (!this.isBrowser) return;

    const nativeElement = this.elementRef.nativeElement;
    if (!nativeElement) return;

    this.cdr.detectChanges();
    this.cdr.markForCheck();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const dateCells = nativeElement.querySelectorAll('.ngxsmk-day-cell[data-date]');

        if (dateCells.length === 0 && this.isCalendarOpen) {
          let retryCount = 0;
          const maxRetries = 5;
          const retry = () => {
            retryCount++;
            const dateCellsRetry = nativeElement.querySelectorAll('.ngxsmk-day-cell[data-date]');
            if (dateCellsRetry.length === 0 && retryCount < maxRetries && this.isCalendarOpen) {
              setTimeout(retry, 50 * retryCount);
              return;
            }
            if (dateCellsRetry.length > 0) {
              this.attachTouchListenersToCells(dateCellsRetry);
            }
          };
          setTimeout(retry, 50);
          return;
        }
        
        if (dateCells.length > 0) {
          this.attachTouchListenersToCells(dateCells);
        }
      });
    });
  }
  
  private attachTouchListenersToCells(dateCells: NodeListOf<Element>): void {
    dateCells.forEach((cellEl: Element) => {
      const cell = cellEl as HTMLElement;
        const dateTimestamp = cell.getAttribute('data-date');
        if (!dateTimestamp) return;

        const dateValue = parseInt(dateTimestamp, 10);
        if (isNaN(dateValue)) return;

        const day = new Date(dateValue);
        if (!day || isNaN(day.getTime())) return;

        if ((cell as any).__ngxsmk_touch_listeners_attached) {
          return;
        }
        (cell as any).__ngxsmk_touch_listeners_attached = true;

        const touchStartHandler = (event: TouchEvent) => {
          this.onDateCellTouchStart(event, day);
        };
        cell.addEventListener('touchstart', touchStartHandler, { passive: true });

        const touchEndHandler = (event: TouchEvent) => {
          this.onDateCellTouchEnd(event, day);
        };
        cell.addEventListener('touchend', touchEndHandler, { passive: false });

        const touchMoveHandler = (event: TouchEvent) => {
          this.onDateCellTouchMove(event);
        };
        cell.addEventListener('touchmove', touchMoveHandler, { passive: false });

      this.passiveTouchListeners.push(() => {
        (cell as any).__ngxsmk_touch_listeners_attached = false;
        cell.removeEventListener('touchstart', touchStartHandler);
        cell.removeEventListener('touchend', touchEndHandler);
        cell.removeEventListener('touchmove', touchMoveHandler);
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    let needsChangeDetection = false;

    if (changes['timeOnly']) {
      if (this.timeOnly) {
        this.showTime = true;
        this.generateTimeOptions();
      }
      needsChangeDetection = true;
    }

    if (changes['locale'] || changes['rtl']) {
      this.updateRtlState();
      if (changes['locale']) {
        this.initializeTranslations();
        this.generateLocaleData();
        this.generateCalendar();
        needsChangeDetection = false;
      } else {
        needsChangeDetection = true;
      }
    }

    if (changes['weekStart'] || changes['minuteInterval'] || changes['holidayProvider'] || changes['yearRange'] || changes['timezone']) {
      this.applyGlobalConfig();
      if (changes['weekStart'] || changes['yearRange']) {
        this.generateLocaleData();
        this.generateCalendar();
        needsChangeDetection = false;
      } else {
        needsChangeDetection = true;
      }
      if (changes['minuteInterval']) {
        this.generateTimeOptions();
      }
    }

    if (changes['minuteInterval']) {
      this.generateTimeOptions();
      this.currentMinute = Math.floor(this.currentMinute / this.minuteInterval) * this.minuteInterval;
      this.timeChange();
      needsChangeDetection = false; // Already handled
    }
    if (changes['yearRange']) {
      this.generateDropdownOptions();
      needsChangeDetection = true;
    }

    if (needsChangeDetection) {
      this.scheduleChangeDetection();
    }

    if (changes['field']) {
      const newField = changes['field'].currentValue;
      if (newField && typeof newField === 'object') {
        this.syncFieldValue(newField);

        if (this.isBrowser) {
          setTimeout(() => {
            if (this._field === newField) {
              this.syncFieldValue(newField);
            }
          }, 50);

          setTimeout(() => {
            if (this._field === newField) {
              this.syncFieldValue(newField);
            }
          }, 150);

          setTimeout(() => {
            if (this._field === newField) {
              this.syncFieldValue(newField);
            }
          }, 300);

          setTimeout(() => {
            if (this._field === newField) {
              this.syncFieldValue(newField);
            }
          }, 600);
        }
      }
    }

    if (changes['value']) {
      if (!this._field) {
        const newValue = changes['value'].currentValue;
        if (!this.isValueEqual(newValue, this._internalValue)) {
          this._internalValue = newValue;
          this.initializeValue(newValue);
          this.generateCalendar();
          this.cdr.markForCheck();
        }
      }
    }

    if (changes['holidayProvider'] || changes['disableHolidays'] || changes['disabledDates'] || changes['disabledRanges']) {
      this._updateMemoSignals();
      this.generateCalendar();
      this.cdr.markForCheck();
    }

    if (changes['translations'] || changes['translationService']) {
      this.initializeTranslations();
      this.scheduleChangeDetection();
    }

    if (changes['startAt']) {
      if (!this._internalValue && this._startAtDate) {
        this.currentDate = new Date(this._startAtDate);
        this._currentMonth = this.currentDate.getMonth();
        this._currentYear = this.currentDate.getFullYear();
        this.generateCalendar();
        this.cdr.markForCheck();
      }
    }

    if (changes['minDate']) {
      this.generateCalendar();
      this.cdr.markForCheck();

      if (!this._internalValue && this._minDate) {
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

    if (changes['maxDate']) {
      this.generateCalendar();
      this.cdr.markForCheck();
    }

    if (changes['calendarViewMode']) {
      if (this.calendarViewMode === 'year') {
        this.generateYearGrid();
      } else if (this.calendarViewMode === 'decade') {
        this.generateDecadeGrid();
      } else if (this.calendarViewMode === 'timeline') {
        this.generateTimeline();
      } else if (this.calendarViewMode === 'time-slider') {
        this.initializeTimeSliders();
      } else {
        this.generateCalendar();
      }
      this.cdr.markForCheck();
    }
  }

  private initializeTimeSliders(): void {
    if (this.mode === 'range' && this.showTime) {
      if (this.startDate) {
        this.startTimeSlider = this.startDate.getHours() * 60 + this.startDate.getMinutes();
      }
      if (this.endDate) {
        this.endTimeSlider = this.endDate.getHours() * 60 + this.endDate.getMinutes();
      } else {
        this.endTimeSlider = 1440;
      }
    }
  }

  private get24Hour(displayHour: number, isPm: boolean): number {
    return get24Hour(displayHour, isPm);
  }

  private update12HourState(fullHour: number): void {
    const state = update12HourState(fullHour);
    this.isPm = state.isPm;
    this.currentDisplayHour = state.displayHour;
  }

  private applyCurrentTime(date: Date): Date {
    this.currentHour = this.get24Hour(this.currentDisplayHour, this.isPm);
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

  private initializeValue(value: DatepickerValue): void {
    let initialDate: Date | null = null;

    this.selectedDate = null;
    this.startDate = null;
    this.endDate = null;
    this.selectedDates = [];

    if (value) {
      if (this.mode === 'single' && value instanceof Date) {
        this.selectedDate = this._normalizeDate(value);
        initialDate = this.selectedDate;
      } else if (this.mode === 'range' && typeof value === 'object' && 'start' in value && 'end' in value) {
        this.startDate = this._normalizeDate((value as { start: Date, end: Date }).start);
        this.endDate = this._normalizeDate((value as { start: Date, end: Date }).end);
        initialDate = this.startDate;
      } else if (this.mode === 'multiple' && Array.isArray(value)) {
        this.selectedDates = (value as Date[]).map(d => this._normalizeDate(d)).filter((d): d is Date => d !== null);
        initialDate = this.selectedDates.length > 0 ? this.selectedDates[this.selectedDates.length - 1]! : null;
      }
    }

    let viewCenterDate = initialDate || this._startAtDate;

    if (!viewCenterDate && this._minDate) {
      const today = new Date();
      const minDateOnly = getStartOfDay(this._minDate);
      const todayOnly = getStartOfDay(today);

      if (minDateOnly.getTime() > todayOnly.getTime()) {
        viewCenterDate = this._minDate;
      }
    }

    if (!viewCenterDate) {
      viewCenterDate = new Date();
    }

    if (viewCenterDate) {
      this.currentDate = new Date(viewCenterDate);
      this._currentMonth = viewCenterDate.getMonth();
      this._currentYear = viewCenterDate.getFullYear();
      this.currentHour = viewCenterDate.getHours();
      this.currentMinute = viewCenterDate.getMinutes();
      this.update12HourState(this.currentHour);
      this.currentMinute = Math.floor(this.currentMinute / this.minuteInterval) * this.minuteInterval;
    }
  }

  private _normalizeDate(date: DateInput | null): Date | null {
    return normalizeDate(date);
  }

  private _normalizeValue(val: unknown): DatepickerValue {
    if (val === null || val === undefined) {
      return null;
    }

    if (val instanceof Date) {
      return this._normalizeDate(val) as DatepickerValue;
    } else if (this.isMomentObject(val)) {
      const momentObj = val as { toDate: () => Date; utcOffset?: () => number; format?: (format: string) => string };
      return this._normalizeDate(this.momentToDate(momentObj)) as DatepickerValue;
    } else if (typeof val === 'object' && val !== null && 'start' in val && 'end' in val) {
      const rangeVal = val as { start: unknown; end: unknown };
      let start: Date | null;
      let end: Date | null;
      
      if (this.isMomentObject(rangeVal.start)) {
        const momentStart = rangeVal.start as { toDate: () => Date; utcOffset?: () => number; format?: (format: string) => string };
        start = this._normalizeDate(this.momentToDate(momentStart));
      } else {
        start = this._normalizeDate(rangeVal.start as DateInput);
      }
      
      if (this.isMomentObject(rangeVal.end)) {
        const momentEnd = rangeVal.end as { toDate: () => Date; utcOffset?: () => number; format?: (format: string) => string };
        end = this._normalizeDate(this.momentToDate(momentEnd));
      } else {
        end = this._normalizeDate(rangeVal.end as DateInput);
      }
      
      if (start && end) {
        return { start, end } as DatepickerValue;
      }
      return null;
    } else if (Array.isArray(val)) {
      return val.map(d => {
        if (this.isMomentObject(d)) {
          const momentObj = d as { toDate: () => Date; utcOffset?: () => number; format?: (format: string) => string };
          return this._normalizeDate(this.momentToDate(momentObj));
        }
        return this._normalizeDate(d as DateInput);
      }).filter((d): d is Date => d !== null) as DatepickerValue;
    } else if (typeof val === 'string' && this.displayFormat) {
      const parsedDate = this.parseCustomDateString(val, this.displayFormat);
      return parsedDate as DatepickerValue;
    } else if (typeof val === 'string' || (typeof val === 'object' && val !== null && 'getTime' in val)) {
      const normalized = this._normalizeDate(val as DateInput);
      return normalized as DatepickerValue;
    } else {
      return null;
    }
  }

  /**
   * Check if the provided value is a Moment.js object
   */
  private isMomentObject(val: unknown): boolean {
    if (!val || typeof val !== 'object') {
      return false;
    }
    const obj = val as Record<string, unknown>;
    return typeof obj['format'] === 'function' &&
      typeof obj['toDate'] === 'function' &&
      typeof obj['isMoment'] === 'function' &&
      typeof (obj['isMoment'] as () => boolean)() === 'boolean' &&
      (obj['isMoment'] as () => boolean)() === true;
  }

  /**
   * Convert a Moment.js object to a Date, preserving timezone offset
   */
  private momentToDate(momentObj: { toDate: () => Date; utcOffset?: () => number; format?: (format: string) => string }): Date {
    if (typeof momentObj.utcOffset === 'function' && typeof momentObj.format === 'function') {
      const offset = momentObj.utcOffset();
      if (offset !== undefined && offset !== null) {
        try {
          const formatted = momentObj.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
          const date = new Date(formatted);
          if (!isNaN(date.getTime())) {
            return date;
          }
        } catch {
        }
      }
    }
    return momentObj.toDate();
  }

  private isValueEqual(val1: DatepickerValue, val2: DatepickerValue): boolean {
    if (val1 === val2) return true;
    if (val1 === null || val2 === null) return val1 === val2;

    if (val1 instanceof Date && val2 instanceof Date) {
      return val1.getTime() === val2.getTime();
    }

    if (typeof val1 === 'object' && typeof val2 === 'object' &&
      'start' in val1 && 'end' in val1 && 'start' in val2 && 'end' in val2) {
      const r1 = val1 as { start: Date, end: Date };
      const r2 = val2 as { start: Date, end: Date };
      return r1.start.getTime() === r2.start.getTime() &&
        r1.end.getTime() === r2.end.getTime();
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

  private parseDateString(dateString: string): Date | null {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return null;
      }
      return getStartOfDay(date);
    } catch {
      return null;
    }
  }

  /**
   * Parse a date string using the custom display format
   * Supports common format tokens: YYYY, YY, MM, M, DD, D, hh, h, HH, H, mm, m, ss, s, a, A
   */
  private parseCustomDateString(dateString: string, format: string): Date | null {
    if (!dateString || !format) return null;

    try {
      const formatTokens: { [key: string]: { regex: RegExp; extractor: (match: RegExpMatchArray) => number } } = {
        'YYYY': {
          regex: /(\d{4})/,
          extractor: (match) => parseInt(match[1] || '0', 10)
        },
        'YY': {
          regex: /(\d{2})/,
          extractor: (match) => 2000 + parseInt(match[1] || '0', 10)
        },
        'MM': {
          regex: /(\d{2})/,
          extractor: (match) => parseInt(match[1] || '0', 10) - 1
        },
        'M': {
          regex: /(\d{1,2})/,
          extractor: (match) => parseInt(match[1] || '0', 10) - 1
        },
        'DD': {
          regex: /(\d{2})/,
          extractor: (match) => parseInt(match[1] || '0', 10)
        },
        'D': {
          regex: /(\d{1,2})/,
          extractor: (match) => parseInt(match[1] || '0', 10)
        },
        'hh': {
          regex: /(\d{2})/,
          extractor: (match) => parseInt(match[1] || '0', 10)
        },
        'h': {
          regex: /(\d{1,2})/,
          extractor: (match) => parseInt(match[1] || '0', 10)
        },
        'HH': {
          regex: /(\d{2})/,
          extractor: (match) => parseInt(match[1] || '0', 10)
        },
        'H': {
          regex: /(\d{1,2})/,
          extractor: (match) => parseInt(match[1] || '0', 10)
        },
        'mm': {
          regex: /(\d{2})/,
          extractor: (match) => parseInt(match[1] || '0', 10)
        },
        'm': {
          regex: /(\d{1,2})/,
          extractor: (match) => parseInt(match[1] || '0', 10)
        },
        'ss': {
          regex: /(\d{2})/,
          extractor: (match) => parseInt(match[1] || '0', 10)
        },
        's': {
          regex: /(\d{1,2})/,
          extractor: (match) => parseInt(match[1] || '0', 10)
        },
        'a': {
          regex: /(am|pm)/i,
          extractor: (match) => (match[1] || '').toLowerCase() === 'pm' ? 1 : 0
        },
        'A': {
          regex: /(AM|PM)/,
          extractor: (match) => (match[1] || '') === 'PM' ? 1 : 0
        }
      };

      const dateParts: { [key: string]: number } = {};
      let remainingFormat = format;
      let remainingString = dateString;

      const sortedTokens = Object.keys(formatTokens).sort((a, b) => b.length - a.length);

      for (const token of sortedTokens) {
        if (remainingFormat.includes(token)) {
          const tokenInfo = formatTokens[token];
          if (!tokenInfo) continue;

          const match = remainingString.match(tokenInfo.regex);

          if (match) {
            dateParts[token] = tokenInfo.extractor(match);
            const matchIndex = remainingString.indexOf(match[0]);
            remainingString = remainingString.substring(0, matchIndex) + remainingString.substring(matchIndex + match[0].length);
            remainingFormat = remainingFormat.replace(token, '');
          }
        }
      }

      const now = new Date();
      const year = dateParts['YYYY'] !== undefined ? dateParts['YYYY'] : now.getFullYear();
      const month = dateParts['MM'] !== undefined ? dateParts['MM'] : (dateParts['M'] !== undefined ? dateParts['M'] : now.getMonth());
      const day = dateParts['DD'] !== undefined ? dateParts['DD'] : (dateParts['D'] !== undefined ? dateParts['D'] : now.getDate());

      let hours = 0;
      let minutes = 0;
      let seconds = 0;

      if (dateParts['hh'] !== undefined || dateParts['h'] !== undefined) {
        const hour12 = dateParts['hh'] !== undefined ? dateParts['hh'] : (dateParts['h'] !== undefined ? dateParts['h'] : 0);
        const isPm = dateParts['a'] !== undefined ? dateParts['a'] : (dateParts['A'] !== undefined ? dateParts['A'] : 0);
        hours = (hour12 % 12) + (isPm ? 12 : 0);
      } else if (dateParts['HH'] !== undefined || dateParts['H'] !== undefined) {
        hours = dateParts['HH'] !== undefined ? dateParts['HH'] : (dateParts['H'] !== undefined ? dateParts['H'] : 0);
      }

      minutes = dateParts['mm'] !== undefined ? dateParts['mm'] : (dateParts['m'] !== undefined ? dateParts['m'] : 0);
      seconds = dateParts['ss'] !== undefined ? dateParts['ss'] : (dateParts['s'] !== undefined ? dateParts['s'] : 0);

      const date = new Date(year, month, day, hours, minutes, seconds);

      if (isNaN(date.getTime())) {
        return null;
      }

      return date;
    } catch (error) {
      console.warn('Failed to parse custom date string:', dateString, 'with format:', format, error);
      return null;
    }
  }

  onInputFocus(_event: FocusEvent): void {
    if (!this.allowTyping) return;
    this.isTyping = true;
    if (!this.typedInputValue || this.typedInputValue === '') {
      this.typedInputValue = this.displayValue || '';
    }
  }

  onInputChange(event: Event): void {
    if (!this.allowTyping) return;
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    if (this.displayFormat) {
      this.typedInputValue = this.applyInputMask(value, this.displayFormat);
    } else {
      this.typedInputValue = value;
    }
    
    if (input.value !== this.typedInputValue) {
      const cursorPosition = input.selectionStart || 0;
      input.value = this.typedInputValue;
      setTimeout(() => {
        input.setSelectionRange(cursorPosition, cursorPosition);
      }, 0);
    }
    
    this.scheduleChangeDetection();
  }

  onInputBlur(event: FocusEvent): void {
    if (!this.allowTyping) return;
    this.isTyping = false;
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    
    if (!value) {
      this.clearValue();
      this.typedInputValue = '';
      this.scheduleChangeDetection();
      return;
    }
    
    const parsedDate = this.parseTypedInput(value);
    
    if (parsedDate && this.isValidDate(parsedDate)) {
      this.applyTypedDate(parsedDate);
      this.typedInputValue = this.displayValue;
    } else {
      this.typedInputValue = this.displayValue;
      this.scheduleChangeDetection();
    }
  }

  onInputKeyDown(event: KeyboardEvent): void {
    if (!this.allowTyping) {
      if (event.key === 'Enter' || event.key === ' ') {
        this.toggleCalendar(event);
        if (event.key === ' ') {
          event.preventDefault();
        }
      }
      return;
    }
    
    if (event.key === 'Enter') {
      event.preventDefault();
      const input = event.target as HTMLInputElement;
      const value = input.value.trim();
      
      if (!value) {
        this.clearValue();
        this.typedInputValue = '';
        return;
      }
      
      const parsedDate = this.parseTypedInput(value);
      if (parsedDate !== null && this.isValidDate(parsedDate)) {
        this.applyTypedDate(parsedDate);
        this.typedInputValue = this.displayValue;
        input.blur();
      } else {
        this.typedInputValue = this.displayValue;
        this.scheduleChangeDetection();
      }
    } else if (event.key === 'Escape') {
      this.typedInputValue = this.displayValue;
      const input = event.target as HTMLInputElement;
      input.blur();
      this.scheduleChangeDetection();
    }
  }

  private applyInputMask(value: string, format: string): string {
    const digits = value.replace(/[^\d]/g, '');
    let masked = '';
    let digitIndex = 0;
    let i = 0;
    
    while (i < format.length && digitIndex < digits.length) {
      if (format.substring(i, i + 4) === 'YYYY') {
        const yearDigits = digits.substring(digitIndex, digitIndex + 4);
        masked += yearDigits.padEnd(4, '0');
        digitIndex += Math.min(4, digits.length - digitIndex);
        i += 4;
      } else if (format.substring(i, i + 2) === 'YY' || format.substring(i, i + 2) === 'MM' || 
                 format.substring(i, i + 2) === 'DD' || format.substring(i, i + 2) === 'HH' || 
                 format.substring(i, i + 2) === 'hh' || format.substring(i, i + 2) === 'mm' || 
                 format.substring(i, i + 2) === 'ss') {
        const tokenDigits = digits.substring(digitIndex, digitIndex + 2);
        masked += tokenDigits.padEnd(2, '0');
        digitIndex += Math.min(2, digits.length - digitIndex);
        i += 2;
      } else if (format[i] === 'Y' || format[i] === 'M' || format[i] === 'D' || 
                 format[i] === 'H' || format[i] === 'h' || format[i] === 'm' || format[i] === 's') {
        masked += digits[digitIndex] || '';
        digitIndex++;
        i++;
      } else {
        masked += format[i];
        i++;
      }
    }
    
    return masked;
  }

  private parseTypedInput(value: string): Date | null {
    if (!value || !value.trim()) return null;
    
    if (this.displayFormat) {
      return this.parseCustomDateString(value, this.displayFormat);
    }
    
    const isoDate = new Date(value);
    if (!isNaN(isoDate.getTime())) {
      return isoDate;
    }
    
    const formats = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
      /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/,
    ];
    
    for (const format of formats) {
      const match = value.match(format);
      if (match && match[1] && match[2] && match[3]) {
        const date1 = new Date(parseInt(match[3]), parseInt(match[1]) - 1, parseInt(match[2]));
        const date2 = new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
        
        if (!isNaN(date1.getTime()) && date1.getMonth() === parseInt(match[1]) - 1) {
          return date1;
        }
        if (!isNaN(date2.getTime()) && date2.getMonth() === parseInt(match[2]) - 1) {
          return date2;
        }
      }
    }
    
    return null;
  }

  private isValidDate(date: Date): boolean {
    if (!date || isNaN(date.getTime())) return false;
    
    if (this._minDate && date < this._minDate) return false;
    if (this._maxDate && date > this._maxDate) return false;
    
    if (this.isDateDisabledMemo(date)) return false;
    
    if (this.isInvalidDate(date)) return false;
    
    return true;
  }

  private applyTypedDate(date: Date): void {
    if (!date || isNaN(date.getTime())) return;
    
    if (this.showTime || this.timeOnly) {
      const now = new Date();
      date.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
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
      const index = this.selectedDates.findIndex(d => this.isSameDayMemo(d, date));
      if (index >= 0) {
        this.selectedDates.splice(index, 1);
      } else {
        this.selectedDates.push(date);
      }
      this.generateCalendar();
      this.action.emit({ type: 'datesSelected', payload: [...this.selectedDates] });
    }
    
    this.scheduleChangeDetection();
    
    if (this.shouldAutoClose()) {
      this.closeCalendar();
    }
  }

  private generateTimeOptions(): void {
    const { hourOptions, minuteOptions } = generateTimeOptions(this.minuteInterval);
    this.hourOptions = hourOptions;
    this.minuteOptions = minuteOptions;
  }

  private generateLocaleData(): void {
    const year = new Date().getFullYear();
    this.monthOptions = generateMonthOptions(this.locale, year);
    this.firstDayOfWeek = this.weekStart !== null && this.weekStart !== undefined
      ? this.weekStart
      : getFirstDayOfWeek(this.locale);
    this.weekDays = generateWeekDays(this.locale, this.firstDayOfWeek);
  }

  private updateRangesArray(): void {
    this.rangesArray = this._ranges ? Object.entries(this._ranges).map(([key, value]) => ({ key, value })) : [];
  }

  public selectRange(range: [Date, Date]): void {
    if (this.disabled) return;
    this.startDate = this.applyCurrentTime(range[0]);
    this.endDate = this.applyCurrentTime(range[1]);

    if (this.startDate && this.endDate) {
      this.emitValue({ start: this.startDate as Date, end: this.endDate as Date });
    }

    this.currentDate = new Date(this.startDate);
    this.initializeValue({ start: this.startDate, end: this.endDate });
    this.generateCalendar();
    this.action.emit({ type: 'rangeSelected', payload: { start: this.startDate, end: this.endDate, key: this.rangesArray.find(r => r.value === range)?.key } });

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
    return this.holidayProvider.getHolidayLabel ? this.holidayProvider.getHolidayLabel(getStartOfDay(date)) : this.getTranslation('holiday');
  }

  public isDateDisabled(date: Date | null): boolean {
    if (!date) return false;

    const dateOnly = getStartOfDay(date);

    if (this.disabledDates.length > 0) {
      for (const disabledDate of this.disabledDates) {
        let parsedDate: Date | null;

        if (typeof disabledDate === 'string') {
          parsedDate = this.parseDateString(disabledDate);
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
          startDate = this.parseDateString(range.start);
        } else {
          startDate = getStartOfDay(range.start);
        }

        if (typeof range.end === 'string') {
          endDate = this.parseDateString(range.end);
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

    if (this.holidayProvider && this.disableHolidays && this.holidayProvider.isHoliday(dateOnly)) {
      return true;
    }

    const effectiveMinDate = this._minDate || (this.globalConfig?.minDate ? this._normalizeDate(this.globalConfig.minDate) : null);
    const effectiveMaxDate = this._maxDate || (this.globalConfig?.maxDate ? this._normalizeDate(this.globalConfig.maxDate) : null);

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

  public isMultipleSelected(d: Date | null): boolean {
    if (!d || this.mode !== 'multiple') return false;
    const dTime = getStartOfDay(d).getTime();
    return this.selectedDates.some(selected => getStartOfDay(selected).getTime() === dTime);
  }

  public timeChange(): void {
    if (this.disabled) return;

    if (this.timeOnly && this.mode === 'single' && !this.selectedDate) {
      const today = new Date();
      const dateWithTime = this.applyCurrentTime(today);
      this.selectedDate = dateWithTime;
      this.emitValue(dateWithTime);
      this.action.emit({ type: 'timeChanged', payload: { hour: this.currentHour, minute: this.currentMinute } });
      this.scheduleChangeDetection();
      return;
    }

    if (this.mode === 'single' && this.selectedDate) {
      this.selectedDate = this.applyCurrentTime(this.selectedDate);
      this.emitValue(this.selectedDate);
    } else if (this.mode === 'range' && this.startDate && this.endDate) {
      this.startDate = this.applyCurrentTime(this.startDate);
      this.endDate = this.applyCurrentTime(this.endDate);
      this.emitValue({ start: this.startDate as Date, end: this.endDate as Date });
    } else if (this.mode === 'range' && this.startDate && !this.endDate) {
      this.startDate = this.applyCurrentTime(this.startDate);
    } else if (this.mode === 'multiple') {
      this.selectedDates = this.selectedDates.map(date => {
        const newDate = getStartOfDay(date);
        return this.applyCurrentTime(newDate);
      });
      this.emitValue([...this.selectedDates]);
    }

    this.action.emit({ type: 'timeChanged', payload: { hour: this.currentHour, minute: this.currentMinute } });
    this.scheduleChangeDetection();
  }

  public onDateClick(day: Date | null): void {
    if (!day || this.disabled) return;

    const now = Date.now();
    const timeSinceTouchHandled = this.dateCellTouchHandledTime > 0 ? now - this.dateCellTouchHandledTime : Infinity;
    
    if (this.dateCellTouchHandled && timeSinceTouchHandled < 250 && this.isDateCellTouching) {
      this.clearTouchHandledFlag();
      return;
    }
    
    if (this.dateCellTouchHandled && (timeSinceTouchHandled >= 250 || !this.isDateCellTouching)) {
      this.clearTouchHandledFlag();
    }

    this.isDateCellTouching = false;
    this.dateCellTouchStartTime = 0;
    this.dateCellTouchStartDate = null;
    this.lastDateCellTouchDate = null;

    if (this.isDateDisabled(day)) return;

    const dateToToggle = getStartOfDay(day);

    if (this.hooks?.beforeDateSelect) {
      if (!this.hooks.beforeDateSelect(day, this._internalValue)) {
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
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setTimeout(() => {
                this.setupPassiveTouchListeners();
              }, 50);
            });
          });
        }
      }

      const dateWithTime = this.applyTimeIfNeeded(day);
      this.selectedDate = dateWithTime;
      this.emitValue(dateWithTime);
      
      const formattedDate = formatDateWithTimezone(dateWithTime, this.locale, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }, this.timezone);
      const dateSelectedMsg = this.getTranslation('dateSelected' as keyof DatepickerTranslations, undefined, { date: formattedDate }) || formattedDate;
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
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setTimeout(() => {
                this.setupPassiveTouchListeners();
              }, 50);
            });
          });
        }
      }

      const dayTime = getStartOfDay(day).getTime();
      const startTime = this.startDate ? getStartOfDay(this.startDate).getTime() : null;

      if (!this.startDate || (this.startDate && this.endDate)) {
        this.startDate = this.applyTimeIfNeeded(day);
        this.endDate = null;
        this.hoveredDate = null;
        this._invalidateMemoCache();
        this.scheduleChangeDetection();
      }
      else if (this.startDate && !this.endDate) {
        if (dayTime < startTime!) {
          this.startDate = this.applyTimeIfNeeded(day);
          this.endDate = null;
          this.hoveredDate = null;
          this._invalidateMemoCache();
          this.scheduleChangeDetection();
        }
        else if (dayTime === startTime!) {
          // User clicked the same day as start date - no action needed
        }
        else {
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
          this.emitValue({ start: this.startDate as Date, end: this.endDate as Date });
          
          const startFormatted = formatDateWithTimezone(this.startDate, this.locale, { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }, this.timezone);
          const endFormatted = formatDateWithTimezone(this.endDate, this.locale, { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }, this.timezone);
          const rangeSelectedMsg = this.getTranslation('rangeSelected' as keyof DatepickerTranslations, undefined, { start: startFormatted, end: endFormatted }) || `${startFormatted} to ${endFormatted}`;
          this.ariaLiveService.announce(rangeSelectedMsg, 'polite');
        }
      }

      this.hoveredDate = null;
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
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setTimeout(() => {
                this.setupPassiveTouchListeners();
              }, 50);
            });
          });
        }
      }

      if (this.recurringPattern) {
        const configBase: {
          pattern: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'weekdays' | 'weekends';
          startDate: Date;
          interval: number;
        } = {
          pattern: this.recurringPattern.pattern,
          startDate: this.recurringPattern.startDate,
          interval: this.recurringPattern.interval || 1
        };

        const config: {
          pattern: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'weekdays' | 'weekends';
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

        const datesWithTime = recurringDates.map(d => this.applyTimeIfNeeded(d));
        const uniqueDates = new Map<number, Date>();
        datesWithTime.forEach(d => {
          uniqueDates.set(getStartOfDay(d).getTime(), d);
        });
        this.selectedDates = Array.from(uniqueDates.values()).sort((a, b) => a.getTime() - b.getTime());
        this.emitValue([...this.selectedDates]);
      } else {
        const existingIndex = this.selectedDates.findIndex(d => this.isSameDay(d, dateToToggle));

        if (existingIndex > -1) {
          this.selectedDates.splice(existingIndex, 1);
        } else {
          const dateWithTime = this.applyTimeIfNeeded(dateToToggle);
          this.selectedDates.push(dateWithTime);
          this.selectedDates.sort((a, b) => a.getTime() - b.getTime());
        }
        this.emitValue([...this.selectedDates]);
      }
    }

    const dateToSync = this.mode === 'single' ? this.selectedDate :
      this.mode === 'range' ? this.startDate :
        this.mode === 'multiple' && this.selectedDates.length > 0 ? this.selectedDates[this.selectedDates.length - 1] : null;

    if (dateToSync) {
      this.update12HourState(dateToSync.getHours());
      this.currentMinute = dateToSync.getMinutes();
    }

    if (this.hooks?.afterDateSelect) {
      this.hooks.afterDateSelect(day, this._internalValue);
    }

    this.action.emit({
      type: 'dateSelected',
      payload: {
        mode: this.mode,
        value: this._internalValue,
        date: day
      }
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
    if (this.disabled || !day || this.isDateDisabled(day)) {
      return;
    }

    const hasValidTouch = event.touches && event.touches.length > 0;
    
    event.stopPropagation();

    this.clearTouchHandledFlag();
    this.isDateCellTouching = true;

    const touch = event.touches[0];
    if (touch && hasValidTouch) {
      this.dateCellTouchStartTime = Date.now();
      this.dateCellTouchStartDate = day;
      this.dateCellTouchStartX = touch.clientX;
      this.dateCellTouchStartY = touch.clientY;
      this.lastDateCellTouchDate = day;

      if (this.mode === 'range' && this.startDate && !this.endDate) {
        const dayTime = getStartOfDay(day).getTime();
        const startTime = getStartOfDay(this.startDate).getTime();
        if (dayTime >= startTime) {
          this.hoveredDate = day;
          this.cdr.markForCheck();
        } else {
          this.hoveredDate = null;
          this.cdr.markForCheck();
        }
      } else if (this.mode === 'range' && !this.startDate) {
        this.hoveredDate = null;
      }
    } else {
      this.isDateCellTouching = false;
      this.dateCellTouchStartDate = null;
      this.dateCellTouchStartTime = 0;
    }
  }

  public onDateCellTouchMove(event: TouchEvent): void {
    if (this.disabled || !this.isDateCellTouching || !this.dateCellTouchStartDate) {
      return;
    }

    if (this.mode === 'range' && this.startDate && !this.endDate) {
      const touch = event.touches[0];
      if (touch) {
        const deltaX = Math.abs(touch.clientX - this.dateCellTouchStartX);
        const deltaY = Math.abs(touch.clientY - this.dateCellTouchStartY);
        const isSignificantMove = deltaX > 5 || deltaY > 5;

        if (isSignificantMove) {
          event.preventDefault();
        }

        try {
          const elementFromPoint = document.elementFromPoint(touch.clientX, touch.clientY);
          if (elementFromPoint) {
            const dateCell = elementFromPoint.closest('.ngxsmk-day-cell') as HTMLElement;
            if (dateCell && !dateCell.classList.contains('empty') && !dateCell.classList.contains('disabled')) {
              const dateTimestamp = dateCell.getAttribute('data-date');
              if (dateTimestamp) {
                const dateValue = parseInt(dateTimestamp, 10);
                if (!isNaN(dateValue)) {
                  const day = new Date(dateValue);
                  if (day && !isNaN(day.getTime()) && !this.isDateDisabled(day)) {
                    const dayTime = getStartOfDay(day).getTime();
                    const startTime = getStartOfDay(this.startDate).getTime();

                    if (dayTime >= startTime) {
                      this.hoveredDate = day;
                      this.lastDateCellTouchDate = day;
                      this.cdr.detectChanges();
                    } else {
                      this.hoveredDate = null;
                      this.cdr.detectChanges();
                    }
                  }
                }
              }
            }
          }
        } catch (error) {
          console.warn('[NgxsmkDatepicker] Error in date cell touch move handler:', error);
        }
      }
    }
  }

  public onDateCellTouchEnd(event: TouchEvent, day: Date | null): void {
    if (this.disabled) {
      this.isDateCellTouching = false;
      this.dateCellTouchStartTime = 0;
      this.dateCellTouchStartDate = null;
      this.lastDateCellTouchDate = null;
      return;
    }

    const hasValidTouch = event.changedTouches && event.changedTouches.length > 0;
    
    if (!this.isDateCellTouching || !this.dateCellTouchStartDate || !hasValidTouch) {
      this.setTouchHandledFlag(200);
      if (day && !this.isDateDisabled(day)) {
        this.onDateClick(day);
      }
      this.isDateCellTouching = false;
      this.dateCellTouchStartTime = 0;
      this.dateCellTouchStartDate = null;
      this.lastDateCellTouchDate = null;
      return;
    }

    // If touch state isn't properly initialized, use the day parameter as fallback
    // This handles cases where touchstart might have been missed or state was reset
    const finalDay = this.isDateCellTouching && this.dateCellTouchStartDate 
      ? (this.lastDateCellTouchDate || this.dateCellTouchStartDate)
      : day;

    if (!finalDay || this.isDateDisabled(finalDay)) {
      this.isDateCellTouching = false;
      this.dateCellTouchStartTime = 0;
      this.dateCellTouchStartDate = null;
      this.lastDateCellTouchDate = null;
      return;
    }

    const now = Date.now();
    const touchDuration = this.dateCellTouchStartTime > 0 ? now - this.dateCellTouchStartTime : 0;
    const touch = event.changedTouches[0];

    let endDay: Date | null = day || this.dateCellTouchStartDate;
    if (touch) {
      try {
        const elementFromPoint = document.elementFromPoint(touch.clientX, touch.clientY);
        if (elementFromPoint) {
          const dateCell = elementFromPoint.closest('.ngxsmk-day-cell') as HTMLElement;
          if (dateCell) {
            const dateTimestamp = dateCell.getAttribute('data-date');
            if (dateTimestamp) {
              const dateValue = parseInt(dateTimestamp, 10);
              if (!isNaN(dateValue)) {
                const parsedDay = new Date(dateValue);
                if (parsedDay && !isNaN(parsedDay.getTime())) {
                  endDay = parsedDay;
                }
              }
            }
          }
        }
      } catch (error) {
        console.warn('[NgxsmkDatepicker] Error determining touch end date:', error);
        endDay = day || this.dateCellTouchStartDate;
      }
    }

    const finalDayFromTouch = this.lastDateCellTouchDate || endDay || this.dateCellTouchStartDate;

    if (!finalDayFromTouch || this.isDateDisabled(finalDayFromTouch)) {
      this.isDateCellTouching = false;
      this.dateCellTouchStartTime = 0;
      this.dateCellTouchStartDate = null;
      this.lastDateCellTouchDate = null;
      return;
    }

    if (touch) {
      const deltaX = Math.abs(touch.clientX - this.dateCellTouchStartX);
      const deltaY = Math.abs(touch.clientY - this.dateCellTouchStartY);
      const isTap = touchDuration < 500 && deltaX < 20 && deltaY < 20;

      event.preventDefault();
      event.stopPropagation();

      this.setTouchHandledFlag(500);

      const dateToSelect = isTap ? (this.dateCellTouchStartDate || finalDayFromTouch) : finalDayFromTouch;

      this.onDateClick(dateToSelect);

      this.isDateCellTouching = false;
      this.dateCellTouchStartTime = 0;
      this.dateCellTouchStartDate = null;
      this.lastDateCellTouchDate = null;
    } else {
      this.setTouchHandledFlag(300);
      this.onDateClick(day || this.dateCellTouchStartDate);
      this.isDateCellTouching = false;
      this.dateCellTouchStartTime = 0;
      this.dateCellTouchStartDate = null;
      this.lastDateCellTouchDate = null;
    }

    if (this.mode === 'range') {
      setTimeout(() => {
        this.hoveredDate = null;
        this.cdr.markForCheck();
      }, 300);
    }
  }

  public isPreviewInRange(day: Date | null): boolean {
    if (this.mode !== 'range' || !this.startDate || this.endDate || !this.hoveredDate || !day) return false;
    const start = getStartOfDay(this.startDate).getTime();
    const end = getStartOfDay(this.hoveredDate).getTime();
    const time = getStartOfDay(day).getTime();
    return time > Math.min(start, end) && time < Math.max(start, end);
  }

  public generateCalendar(): void {
    this.daysInMonth = [];
    this.multiCalendarMonths = [];
    
    const count = Math.max(1, Math.min(this.calendarCount || 1, 12));
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this._currentMonth = month;
    this._currentYear = year;
    this.generateDropdownOptions();

    for (let calIndex = 0; calIndex < count; calIndex++) {
      const calMonth = (month + calIndex) % 12;
      const calYear = year + Math.floor((month + calIndex) / 12);
      const days: (Date | null)[] = [];
      
      const firstDayOfMonth = new Date(calYear, calMonth, 1);
      const lastDayOfMonth = new Date(calYear, calMonth + 1, 0);
    const startDayOfWeek = firstDayOfMonth.getDay();
    const emptyCellCount = (startDayOfWeek - this.firstDayOfWeek + 7) % 7;

      const previousMonth = calMonth === 0 ? 11 : calMonth - 1;
      const previousYear = calMonth === 0 ? calYear - 1 : calYear;
    const lastDayOfPreviousMonth = new Date(previousYear, previousMonth + 1, 0);

    for (let i = 0; i < emptyCellCount; i++) {
      const dayNumber = lastDayOfPreviousMonth.getDate() - emptyCellCount + i + 1;
        days.push(this._normalizeDate(new Date(previousYear, previousMonth, dayNumber)));
    }
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        days.push(this._normalizeDate(new Date(calYear, calMonth, i)));
      }

      this.multiCalendarMonths.push({
        month: calMonth,
        year: calYear,
        days: days
      });

      if (calIndex === 0) {
        this.daysInMonth = days;
      }
    }

    this.cdr.markForCheck();

    this.action.emit({
      type: 'calendarGenerated',
      payload: {
        month: month,
        year: year,
        days: this.daysInMonth.filter(d => d !== null),
        multiCalendar: this.multiCalendarMonths.map(m => ({
          month: m.month,
          year: m.year,
          days: m.days.filter(d => d !== null)
        }))
      }
    });

    if (this.isBrowser) {
      requestAnimationFrame(() => {
        this.setupPassiveTouchListeners();
      });
    }
  }

  private generateDropdownOptions(): void {
    this.yearOptions = generateYearOptions(this._currentYear, this.yearRange);
  }

  private generateYearGrid(): void {
    this.yearGrid = generateYearGrid(this._currentYear);
  }

  private generateDecadeGrid(): void {
    this.decadeGrid = generateDecadeGrid(this._currentDecade);
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
    
    // Reattach touch listeners after calendar regeneration for mobile support
    // Wait for Angular change detection to complete and DOM to be ready
    if (wasInYearView && this.isBrowser && this.isCalendarOpen) {
      setTimeout(() => {
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

  public changeDecade(delta: number): void {
    if (this.disabled) return;
    this._currentDecade += delta * 10;
    this.generateDecadeGrid();
    this.cdr.markForCheck();
  }

  public changeYear(delta: number): void {
    if (this.disabled) return;
    this._currentYear += delta;
    this.currentDate.setFullYear(this._currentYear);
    this._invalidateMemoCache();
    this.generateYearGrid();
    this.generateCalendar();
    this.scheduleChangeDetection();
    
    if (this.isBrowser && this.isCalendarOpen && this.calendarViewMode === 'month') {
      setTimeout(() => {
        this.setupPassiveTouchListeners();
      }, 50);
    }
    
    const yearChangedMsg = this.getTranslation('yearChanged' as keyof DatepickerTranslations, undefined, { year: String(this._currentYear) }) || `Year ${this._currentYear}`;
    this.ariaLiveService.announce(yearChangedMsg, 'polite');
  }

  public onYearSelectChange(year: number | unknown): void {
    const yearValue = typeof year === 'number' ? year : Number(year);
    if (isNaN(yearValue)) return;
    this._currentYear = yearValue;
    this._currentYearSignal.set(yearValue);
    this.currentDate.setFullYear(yearValue);
    this._invalidateMemoCache();
    this.generateYearGrid();
    this.generateCalendar();
  }

  private generateTimeline(): void {
    if (this.mode !== 'range') return;

    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 6 * this.timelineZoomLevel);
    const endDate = new Date(today);
    endDate.setMonth(today.getMonth() + 6 * this.timelineZoomLevel);

    this.timelineStartDate = startDate;
    this.timelineEndDate = endDate;

    this.timelineMonths = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      this.timelineMonths.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }

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
    return (monthStart >= rangeStart && monthStart <= rangeEnd) ||
      (monthEnd >= rangeStart && monthEnd <= rangeEnd) ||
      (monthStart <= rangeStart && monthEnd >= rangeEnd);
  }

  public onTimelineMonthClick(month: Date): void {
    if (this.disabled) return;
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    if (!this.startDate) {
      this.startDate = monthStart;
    } else if (!this.endDate) {
      if (monthStart < this.startDate) {
        this.endDate = this.startDate;
        this.startDate = monthStart;
      } else {
        this.endDate = monthEnd;
      }
      this.emitValue({ start: this.startDate, end: this.endDate });
    } else {
      this.startDate = monthStart;
      this.endDate = monthEnd;
      this.emitValue({ start: this.startDate, end: this.endDate });
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
    if (this.disabled || !event.touches[0]) return;
    const touch = event.touches[0];
    this.calendarSwipeStartX = touch.clientX;
    this.calendarSwipeStartY = touch.clientY;
    this.calendarSwipeStartTime = Date.now();
    this.isCalendarSwiping = false;
  }

  public onCalendarSwipeMove(event: TouchEvent): void {
    if (this.disabled || !this.calendarSwipeStartTime || !event.touches[0]) return;
    const touch = event.touches[0];
    const deltaX = Math.abs(touch.clientX - this.calendarSwipeStartX);
    const deltaY = Math.abs(touch.clientY - this.calendarSwipeStartY);

    if (deltaX > deltaY && deltaX > 10) {
      this.isCalendarSwiping = true;
      event.preventDefault();
    }
  }

  public onCalendarSwipeEnd(event: TouchEvent): void {
    if (this.disabled || !this.calendarSwipeStartTime) {
      this.resetSwipeState();
      return;
    }

    const touch = event.changedTouches[0];
    if (!touch) {
      this.resetSwipeState();
      return;
    }

    const deltaX = touch.clientX - this.calendarSwipeStartX;
    const deltaY = Math.abs(touch.clientY - this.calendarSwipeStartY);
    const deltaTime = Date.now() - this.calendarSwipeStartTime;
    const absDeltaX = Math.abs(deltaX);

    if (this.isCalendarSwiping &&
      absDeltaX > this.SWIPE_THRESHOLD &&
      absDeltaX > deltaY &&
      deltaTime < this.SWIPE_TIME_THRESHOLD) {

      if (deltaX < 0) {
        if (!this.isBackArrowDisabled) {
          this.changeMonth(1);
        }
      } else {
        this.changeMonth(-1);
      }
    }

    this.resetSwipeState();
  }

  private resetSwipeState(): void {
    this.calendarSwipeStartX = 0;
    this.calendarSwipeStartY = 0;
    this.calendarSwipeStartTime = 0;
    this.isCalendarSwiping = false;
  }

  public changeMonth(delta: number): void {
    if (this.disabled) return;

    if (delta < 0 && this.isBackArrowDisabled) return;

    this.clearTouchHandledFlag();
    this.isDateCellTouching = false;
    this.dateCellTouchStartTime = 0;
    this.dateCellTouchStartDate = null;
    this.lastDateCellTouchDate = null;

    const newDate = addMonths(this.currentDate, delta);
    this.currentDate = newDate;
    this._currentMonth = newDate.getMonth();
    this._currentYear = newDate.getFullYear();
    this._currentMonthSignal.set(this._currentMonth);
    this._currentYearSignal.set(this._currentYear);
    this._invalidateMemoCache();
    this.generateCalendar();
    this.cdr.markForCheck();
    this.scheduleChangeDetection();
    
    if (this.isBrowser && this.isCalendarOpen) {
      // Use multiple strategies to ensure DOM is ready
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            this.setupPassiveTouchListeners();
          }, 50);
        });
      });
    }
    
    const monthName = newDate.toLocaleDateString(this.locale, { month: 'long' });
    const year = newDate.getFullYear();
    const monthChangedMsg = this.getTranslation('monthChanged' as keyof DatepickerTranslations, undefined, { month: monthName, year: String(year) }) || `${monthName} ${year}`;
    this.ariaLiveService.announce(monthChangedMsg, 'polite');

    this.action.emit({ type: 'monthChanged', payload: { delta: delta } });
  }

  public isSameDay(d1: Date | null, d2: Date | null): boolean {
    return this.dateComparator(d1, d2);
  }

  public isCurrentMonth(day: Date | null): boolean {
    if (!day) return false;
    return day.getMonth() === this._currentMonth && day.getFullYear() === this._currentYear;
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

    if (this.weekStart === null && this.globalConfig.weekStart !== undefined) {
      this.weekStart = this.globalConfig.weekStart;
    }

    if (this.minuteInterval === 1 && this.globalConfig.minuteInterval !== undefined) {
      this.minuteInterval = this.globalConfig.minuteInterval;
    }

    if (this.holidayProvider === null && this.globalConfig.holidayProvider !== undefined) {
      this.holidayProvider = this.globalConfig.holidayProvider;
    }

    if (this.yearRange === 10 && this.globalConfig.yearRange !== undefined) {
      this.yearRange = this.globalConfig.yearRange;
    }

    if (this._locale === 'en-US' && this.globalConfig.locale) {
      this._locale = this.globalConfig.locale;
    }

    if (!this.timezone && this.globalConfig.timezone) {
      this.timezone = this.globalConfig.timezone;
    }

    if (!this._minDate && this.globalConfig.minDate !== undefined) {
      this._minDate = this._normalizeDate(this.globalConfig.minDate);
    }

    if (!this._maxDate && this.globalConfig.maxDate !== undefined) {
      this._maxDate = this._normalizeDate(this.globalConfig.maxDate);
    }
  }

  /**
   * Apply animation configuration from global config
   */
  private applyAnimationConfig(): void {
    if (!this.isBrowser) return;

    const animationConfig: AnimationConfig = this.globalConfig?.animations || DEFAULT_ANIMATION_CONFIG;

    // Check for reduced motion preference
    const prefersReducedMotion = animationConfig.respectReducedMotion &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!animationConfig.enabled || prefersReducedMotion) {
      this.elementRef.nativeElement.style.setProperty('--datepicker-transition-duration', '0ms');
      this.elementRef.nativeElement.style.setProperty('--datepicker-transition', 'none');
      return;
    }

    const duration = `${animationConfig.duration || DEFAULT_ANIMATION_CONFIG.duration}ms`;
    const easing = animationConfig.easing || DEFAULT_ANIMATION_CONFIG.easing;
    const property = animationConfig.property || DEFAULT_ANIMATION_CONFIG.property;

    this.elementRef.nativeElement.style.setProperty('--datepicker-transition-duration', duration);
    this.elementRef.nativeElement.style.setProperty('--datepicker-transition-easing', easing);
    this.elementRef.nativeElement.style.setProperty('--datepicker-transition-property', property);
    this.elementRef.nativeElement.style.setProperty(
      '--datepicker-transition',
      `${property} ${duration} ${easing}`
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

    const defaultTranslations = this.translationRegistry.getTranslations(this._locale);
    if (this.translations) {
      this._translations = { ...defaultTranslations, ...this.translations };
    } else {
      this._translations = defaultTranslations;
    }
  }

  getCalendarAriaLabel(): string {
    const month = this.currentDate.toLocaleDateString(this.locale, { month: 'long' });
    const year = this.currentDate.getFullYear();
    return this.getTranslation('calendarFor', undefined, { month, year: String(year) });
  }

  getCalendarAriaLabelForMonth(month: number, year: number): string {
    const monthName = new Date(year, month, 1).toLocaleDateString(this.locale, { month: 'long' });
    return this.getTranslation('calendarFor', undefined, { month: monthName, year: String(year) });
  }

  getMonthYearLabel(month: number, year: number): string {
    const monthName = new Date(year, month, 1).toLocaleDateString(this.locale, { month: 'long' });
    return `${monthName} ${year}`;
  }

  isCurrentMonthForCalendar(day: Date | null, targetMonth: number, targetYear: number): boolean {
    if (!day) return false;
    return day.getMonth() === targetMonth && day.getFullYear() === targetYear;
  }

  getTranslation(key: keyof DatepickerTranslations, fallbackKey?: keyof DatepickerTranslations, params?: Record<string, string | number>): string {
    if (this._translationService) {
      return this._translationService.translate(key, params);
    }

    if (this._translations) {
      let translation = this._translations[key];
      if (!translation && fallbackKey) {
        translation = this._translations[fallbackKey];
      }
      if (translation && params) {
        let result = translation;
        for (const [paramKey, paramValue] of Object.entries(params)) {
          result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
        }
        return result;
      }
      return translation || key;
    }

    const registryTranslations = this.translationRegistry.getTranslations(this._locale);
    return registryTranslations[key] || key;
  }

  private updateRtlState(): void {
    if (this.isBrowser) {
      const wrapper = this.elementRef.nativeElement.querySelector('.ngxsmk-datepicker-wrapper');
      if (wrapper) {
        if (this.isRtl) {
          wrapper.setAttribute('dir', 'rtl');
        } else {
          wrapper.removeAttribute('dir');
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.removeFocusTrap();
    NgxsmkDatepickerComponent._allInstances.delete(this);

    this.fieldSyncService.cleanup();

    if (this._fieldEffectRef) {
      this._fieldEffectRef.destroy();
      this._fieldEffectRef = null;
    }

    this.passiveTouchListeners.forEach(cleanup => cleanup());
    this.passiveTouchListeners = [];

    this.selectedDate = null;
    this.selectedDates = [];
    this.startDate = null;
    this.endDate = null;
    this.hoveredDate = null;
    this._internalValue = null;

    if (this.openCalendarTimeoutId) {
      clearTimeout(this.openCalendarTimeoutId);
      this.openCalendarTimeoutId = null;
    }
  }

  private setupFocusTrap(): void {
    if (this.isInlineMode || !this.isBrowser) {
      return;
    }

    this.removeFocusTrap();

    if (this.popoverContainer?.nativeElement) {
      this.focusTrapCleanup = this.focusTrapService.trapFocus(this.popoverContainer);
    }
  }

  private removeFocusTrap(): void {
    if (this.focusTrapCleanup) {
      this.focusTrapCleanup();
      this.focusTrapCleanup = null;
    }
  }
}