# API Reference Documentation

Complete API reference for ngxsmk-datepicker with JSDoc examples for improved IDE IntelliSense.

**Version**: 2.1.8+  
**Last Updated**: February 23, 2026

---

## Table of Contents

1. [Component API](#component-api)
   - [Inputs](#inputs)
   - [Outputs](#outputs)
   - [Methods](#public-methods)
2. [Services API](#services-api)
3. [Utilities API](#utilities-api)
4. [Interfaces & Types](#interfaces--types)
5. [JSDoc Examples](#jsdoc-examples)

---

## Component API

### Inputs

#### Core Configuration

##### `mode`

```typescript
/**
 * Selection mode for the datepicker
 * @input mode
 * @type {'single' | 'multiple' | 'range'}
 * @default 'single'
 * @description
 * - 'single': Select a single date
 * - 'multiple': Select multiple dates
 * - 'range': Select a date range (start and end dates)
 *
 * @example
 * // Single date selection
 * <ngxsmk-datepicker [mode]="'single'"></ngxsmk-datepicker>
 *
 * // Multiple date selection
 * <ngxsmk-datepicker [mode]="'multiple'"></ngxsmk-datepicker>
 *
 * // Range selection
 * <ngxsmk-datepicker [mode]="'range'"></ngxsmk-datepicker>
 */
@Input() mode: 'single' | 'multiple' | 'range' = 'single';
```

##### `inline`

```typescript
/**
 * Display mode for the calendar
 * @input inline
 * @type {boolean | 'always' | 'auto'}
 * @default false
 * @description
 * - false: Calendar appears in a dropdown/popover
 * - true or 'always': Calendar is always visible inline
 * - 'auto': Automatically chooses based on viewport size
 *
 * @example
 * // Inline calendar (always visible)
 * <ngxsmk-datepicker [inline]="true"></ngxsmk-datepicker>
 *
 * // Dropdown calendar
 * <ngxsmk-datepicker [inline]="false"></ngxsmk-datepicker>
 *
 * // Responsive: inline on mobile, dropdown on desktop
 * <ngxsmk-datepicker [inline]="'auto'"></ngxsmk-datepicker>
 */
@Input() inline: boolean | 'always' | 'auto' = false;
```

##### `disabled`

```typescript
/**
 * Disables the datepicker
 * @input disabled
 * @type {boolean}
 * @default false
 * @description
 * When disabled, the datepicker cannot be interacted with.
 * The input field and calendar are both disabled.
 *
 * @example
 * // Disable the datepicker
 * <ngxsmk-datepicker [disabled]="true"></ngxsmk-datepicker>
 *
 * // Conditional disable
 * <ngxsmk-datepicker [disabled]="isFormProcessing"></ngxsmk-datepicker>
 */
@Input() disabled: boolean = false;
```

##### `readonly`

```typescript
/**
 * Makes the datepicker read-only
 * @input readonly
 * @type {boolean}
 * @default false
 * @description
 * When readonly, the datepicker displays selected values but
 * does not allow modification. The calendar cannot be opened.
 *
 * @example
 * // Read-only datepicker
 * <ngxsmk-datepicker [readonly]="true"></ngxsmk-datepicker>
 *
 * // Conditional readonly based on permissions
 * <ngxsmk-datepicker [readonly]="!hasEditPermission"></ngxsmk-datepicker>
 */
@Input() readonly: boolean = false;
```

#### Date Configuration

##### `minDate`

```typescript
/**
 * Minimum selectable date
 * @input minDate
 * @type {Date | string | null}
 * @default null
 * @description
 * Dates before this date will be disabled.
 * Can be a Date object or ISO string.
 *
 * @example
 * // Set minimum date to today
 * <ngxsmk-datepicker [minDate]="new Date()"></ngxsmk-datepicker>
 *
 * // Set minimum date to specific date
 * <ngxsmk-datepicker [minDate]="'2024-01-01'"></ngxsmk-datepicker>
 *
 * // Dynamic minimum date
 * <ngxsmk-datepicker [minDate]="startDate"></ngxsmk-datepicker>
 */
@Input() minDate: Date | string | null = null;
```

##### `maxDate`

```typescript
/**
 * Maximum selectable date
 * @input maxDate
 * @type {Date | string | null}
 * @default null
 * @description
 * Dates after this date will be disabled.
 * Can be a Date object or ISO string.
 *
 * @example
 * // Set maximum date to today
 * <ngxsmk-datepicker [maxDate]="new Date()"></ngxsmk-datepicker>
 *
 * // Set maximum date to end of year
 * <ngxsmk-datepicker [maxDate]="'2024-12-31'"></ngxsmk-datepicker>
 *
 * // Dynamic maximum date
 * <ngxsmk-datepicker [maxDate]="endDate"></ngxsmk-datepicker>
 */
@Input() maxDate: Date | string | null = null;
```

##### `disabledDates`

```typescript
/**
 * Array of specific dates to disable
 * @input disabledDates
 * @type {Array<Date | string>}
 * @default []
 * @description
 * Individual dates that should be disabled for selection.
 * Can contain Date objects or ISO strings.
 *
 * @example
 * // Disable specific dates
 * <ngxsmk-datepicker
 *   [disabledDates]="[
 *     new Date(2024, 0, 1),  // Jan 1, 2024
 *     '2024-12-25'            // Dec 25, 2024
 *   ]"
 * ></ngxsmk-datepicker>
 *
 * // Disable weekends
 * <ngxsmk-datepicker [disabledDates]="weekendDates"></ngxsmk-datepicker>
 */
@Input() disabledDates: Array<Date | string> = [];
```

##### `disabledRanges`

```typescript
/**
 * Array of date ranges to disable
 * @input disabledRanges
 * @type {Array<{start: Date | string, end: Date | string}>}
 * @default []
 * @description
 * Date ranges that should be disabled for selection.
 * Useful for blocking out vacation periods, holidays, etc.
 *
 * @example
 * // Disable holiday periods
 * <ngxsmk-datepicker
 *   [disabledRanges]="[
 *     { start: '2024-12-20', end: '2024-12-31' },
 *     { start: '2024-07-01', end: '2024-07-15' }
 *   ]"
 * ></ngxsmk-datepicker>
 *
 * // Disable past dates using range
 * <ngxsmk-datepicker
 *   [disabledRanges]="[{
 *     start: new Date(1900, 0, 1),
 *     end: new Date()
 *   }]"
 * ></ngxsmk-datepicker>
 */
@Input() disabledRanges: Array<{start: Date | string, end: Date | string}> = [];
```

#### Time Configuration

##### `showTime`

```typescript
/**
 * Enable time selection
 * @input showTime
 * @type {boolean}
 * @default false
 * @description
 * When enabled, displays time selection controls alongside the calendar.
 * Supports hours, minutes, and optionally seconds.
 *
 * @example
 * // Enable time selection
 * <ngxsmk-datepicker [showTime]="true"></ngxsmk-datepicker>
 *
 * // Date and time with 24-hour format
 * <ngxsmk-datepicker
 *   [showTime]="true"
 *   [use24Hour]="true"
 * ></ngxsmk-datepicker>
 */
@Input() showTime: boolean = false;
```

##### `timeOnly`

```typescript
/**
 * Show only time selection (no calendar)
 * @input timeOnly
 * @type {boolean}
 * @default false
 * @description
 * When enabled, hides the calendar and only shows time selection.
 * Useful for time-picker-only scenarios.
 *
 * @example
 * // Time picker only
 * <ngxsmk-datepicker
 *   [timeOnly]="true"
 *   [showTime]="true"
 * ></ngxsmk-datepicker>
 *
 * // 24-hour time picker
 * <ngxsmk-datepicker
 *   [timeOnly]="true"
 *   [showTime]="true"
 *   [use24Hour]="true"
 * ></ngxsmk-datepicker>
 */
@Input() timeOnly: boolean = false;
```

##### `timeRangeMode`

```typescript
/**
 * Enable time range selection
 * @input timeRangeMode
 * @type {boolean}
 * @default false
 * @description
 * Enables selection of time ranges with separate "from" and "to" time pickers.
 * Useful for appointment scheduling, shift planning, etc.
 *
 * @example
 * // Time range picker
 * <ngxsmk-datepicker
 *   [timeRangeMode]="true"
 *   [showTime]="true"
 * ></ngxsmk-datepicker>
 *
 * // Time range with seconds
 * <ngxsmk-datepicker
 *   [timeRangeMode]="true"
 *   [showTime]="true"
 *   [showSeconds]="true"
 * ></ngxsmk-datepicker>
 */
@Input() timeRangeMode: boolean = false;
```

##### `showSeconds`

```typescript
/**
 * Show seconds in time selection
 * @input showSeconds
 * @type {boolean}
 * @default false
 * @description
 * When enabled, adds seconds selection to the time picker.
 * Requires showTime to be enabled.
 *
 * @example
 * // Time picker with seconds
 * <ngxsmk-datepicker
 *   [showTime]="true"
 *   [showSeconds]="true"
 * ></ngxsmk-datepicker>
 *
 * // Seconds with custom interval
 * <ngxsmk-datepicker
 *   [showTime]="true"
 *   [showSeconds]="true"
 *   [secondInterval]="5"
 * ></ngxsmk-datepicker>
 */
@Input() showSeconds: boolean = false;
```

##### `minuteInterval`

```typescript
/**
 * Interval for minute selection
 * @input minuteInterval
 * @type {number}
 * @default 1
 * @description
 * Step interval for minute selection. For example, 15 would show
 * minutes in 15-minute increments (0, 15, 30, 45).
 *
 * @example
 * // 15-minute intervals
 * <ngxsmk-datepicker
 *   [showTime]="true"
 *   [minuteInterval]="15"
 * ></ngxsmk-datepicker>
 *
 * // 30-minute intervals
 * <ngxsmk-datepicker
 *   [showTime]="true"
 *   [minuteInterval]="30"
 * ></ngxsmk-datepicker>
 */
@Input() minuteInterval: number = 1;
```

##### `secondInterval`

```typescript
/**
 * Interval for second selection
 * @input secondInterval
 * @type {number}
 * @default 1
 * @description
 * Step interval for second selection. For example, 5 would show
 * seconds in 5-second increments (0, 5, 10, ..., 55).
 *
 * @example
 * // 5-second intervals
 * <ngxsmk-datepicker
 *   [showTime]="true"
 *   [showSeconds]="true"
 *   [secondInterval]="5"
 * ></ngxsmk-datepicker>
 *
 * // 10-second intervals
 * <ngxsmk-datepicker
 *   [showTime]="true"
 *   [showSeconds]="true"
 *   [secondInterval]="10"
 * ></ngxsmk-datepicker>
 */
@Input() secondInterval: number = 1;
```

##### `use24Hour`

```typescript
/**
 * Use 24-hour time format
 * @input use24Hour
 * @type {boolean}
 * @default false
 * @description
 * When enabled, displays time in 24-hour format (00:00 - 23:59).
 * When disabled, uses 12-hour format with AM/PM.
 *
 * @example
 * // 24-hour format
 * <ngxsmk-datepicker
 *   [showTime]="true"
 *   [use24Hour]="true"
 * ></ngxsmk-datepicker>
 *
 * // 12-hour format with AM/PM (default)
 * <ngxsmk-datepicker
 *   [showTime]="true"
 *   [use24Hour]="false"
 * ></ngxsmk-datepicker>
 */
@Input() use24Hour: boolean = false;
```

#### Display Configuration

##### `placeholder`

```typescript
/**
 * Placeholder text for the input field
 * @input placeholder
 * @type {string | null}
 * @default null
 * @description
 * Text to display in the input field when no date is selected.
 * Also used as aria-label if no explicit label is provided.
 *
 * @example
 * // Custom placeholder
 * <ngxsmk-datepicker
 *   [placeholder]="'Select a date'"
 * ></ngxsmk-datepicker>
 *
 * // Localized placeholder
 * <ngxsmk-datepicker
 *   [placeholder]="'Datum wählen'"
 *   [locale]="'de-DE'"
 * ></ngxsmk-datepicker>
 */
@Input() placeholder: string | null = null;
```

##### `displayFormat`

```typescript
/**
 * Format string for displaying selected dates
 * @input displayFormat
 * @type {string}
 * @default 'mediumDate'
 * @description
 * Angular DatePipe format string or custom format pattern.
 * Supports all Angular DatePipe formats plus custom patterns.
 *
 * @example
 * // Angular DatePipe formats
 * <ngxsmk-datepicker [displayFormat]="'shortDate'"></ngxsmk-datepicker>
 * <ngxsmk-datepicker [displayFormat]="'mediumDate'"></ngxsmk-datepicker>
 * <ngxsmk-datepicker [displayFormat]="'longDate'"></ngxsmk-datepicker>
 *
 * // Custom format patterns
 * <ngxsmk-datepicker [displayFormat]="'yyyy-MM-dd'"></ngxsmk-datepicker>
 * <ngxsmk-datepicker [displayFormat]="'dd/MM/yyyy'"></ngxsmk-datepicker>
 * <ngxsmk-datepicker [displayFormat]="'MMM d, y'"></ngxsmk-datepicker>
 *
 * // With time
 * <ngxsmk-datepicker
 *   [showTime]="true"
 *   [displayFormat]="'yyyy-MM-dd HH:mm:ss'"
 * ></ngxsmk-datepicker>
 */
@Input() displayFormat: string = 'mediumDate';
```

##### `locale`

```typescript
/**
 * Locale for date formatting and translations
 * @input locale
 * @type {string}
 * @default 'en-US'
 * @description
 * BCP 47 language tag (e.g., 'en-US', 'de-DE', 'fr-FR').
 * Affects date formatting, month/day names, and week start day.
 *
 * @example
 * // US English (default)
 * <ngxsmk-datepicker [locale]="'en-US'"></ngxsmk-datepicker>
 *
 * // German
 * <ngxsmk-datepicker [locale]="'de-DE'"></ngxsmk-datepicker>
 *
 * // French
 * <ngxsmk-datepicker [locale]="'fr-FR'"></ngxsmk-datepicker>
 *
 * // Japanese
 * <ngxsmk-datepicker [locale]="'ja-JP'"></ngxsmk-datepicker>
 */
@Input() locale: string = 'en-US';
```

##### `showWeekNumbers`

```typescript
/**
 * Display week numbers in the calendar
 * @input showWeekNumbers
 * @type {boolean}
 * @default false
 * @description
 * When enabled, shows ISO week numbers in the leftmost column
 * of the calendar. Useful for business planning and scheduling.
 *
 * @example
 * // Show week numbers
 * <ngxsmk-datepicker [showWeekNumbers]="true"></ngxsmk-datepicker>
 *
 * // With custom week calculation
 * <ngxsmk-datepicker
 *   [showWeekNumbers]="true"
 *   [firstDayOfWeek]="1"
 * ></ngxsmk-datepicker>
 */
@Input() showWeekNumbers: boolean = false;
```

##### `enableGoogleCalendar`

```typescript
/**
 * Enable seamless Google Calendar integration and sync
 * @input enableGoogleCalendar
 * @type {boolean}
 * @default false
 * @description
 * Setting true enables features to sync and display
 * Google Calendar events directly in the datepicker.
 *
 * @example
 * <ngxsmk-datepicker [enableGoogleCalendar]="true"></ngxsmk-datepicker>
 */
@Input() enableGoogleCalendar: boolean = false;
```

##### `googleClientId`

```typescript
/**
 * Google API OAuth 2.0 Web Client ID
 * @input googleClientId
 * @type {string | null}
 * @default null
 * @description
 * Define a specific Google Client ID for the calendar integration.
 *
 * @example
 * <ngxsmk-datepicker [googleClientId]="'my-client-id'"></ngxsmk-datepicker>
 */
@Input() googleClientId: string | null = null;
```

##### `calendarCount`

```typescript
/**
 * Number of calendars to display side-by-side
 * @input calendarCount
 * @type {number}
 * @default 1
 * @description
 * Displays multiple months side-by-side. Useful for range selection
 * or viewing multiple months at once. Maximum recommended: 12.
 *
 * @example
 * // Single calendar (default)
 * <ngxsmk-datepicker [calendarCount]="1"></ngxsmk-datepicker>
 *
 * // Two months side-by-side
 * <ngxsmk-datepicker [calendarCount]="2"></ngxsmk-datepicker>
 *
 * // Three months (good for range selection)
 * <ngxsmk-datepicker
 *   [mode]="'range'"
 *   [calendarCount]="3"
 * ></ngxsmk-datepicker>
 */
@Input() calendarCount: number = 1;
```

##### `syncScroll`

```typescript
/**
 * Enable synchronized scrolling for multi-calendar layouts
 * @input syncScroll
 * @type {boolean}
 * @default false
 * @description
 * When enabled with multiple calendars, navigating changes all
 * calendars simultaneously with configurable month gaps.
 *
 * @example
 * // Synchronized scrolling with 2 calendars
 * <ngxsmk-datepicker
 *   [calendarCount]="2"
 *   [syncScroll]="true"
 * ></ngxsmk-datepicker>
 *
 * // With custom month gap
 * <ngxsmk-datepicker
 *   [calendarCount]="2"
 *   [syncScroll]="true"
 *   [monthGap]="2"
 * ></ngxsmk-datepicker>
 */
@Input() syncScroll: boolean = false;
```

#### Animation Configuration

##### `animationConfig`

```typescript
/**
 * Animation configuration
 * @input animationConfig
 * @type {AnimationConfig}
 * @default { duration: 200, easing: 'ease-in-out', enabled: true }
 * @description
 * Customize animation behavior for calendar transitions.
 * Automatically respects user's prefers-reduced-motion setting.
 *
 * @example
 * // Custom animation duration
 * <ngxsmk-datepicker
 *   [animationConfig]="{
 *     duration: 300,
 *     easing: 'ease-in-out',
 *     enabled: true
 *   }"
 * ></ngxsmk-datepicker>
 *
 * // Disable animations
 * <ngxsmk-datepicker
 *   [animationConfig]="{ enabled: false }"
 * ></ngxsmk-datepicker>
 *
 * // Fast animations
 * <ngxsmk-datepicker
 *   [animationConfig]="{
 *     duration: 100,
 *     easing: 'ease-out',
 *     enabled: true
 *   }"
 * ></ngxsmk-datepicker>
 */
@Input() animationConfig: AnimationConfig = DEFAULT_ANIMATION_CONFIG;
```

### Outputs

##### `dateChange`

```typescript
/**
 * Emitted when the selected date(s) change
 * @output dateChange
 * @type {EventEmitter<Date | Date[] | null>}
 * @description
 * Emits the new selected date value. Type depends on mode:
 * - 'single': Date | null
 * - 'multiple': Date[]
 * - 'range': [Date, Date] | null
 *
 * @example
 * // Single date selection
 * <ngxsmk-datepicker
 *   (dateChange)="onDateChange($event)"
 * ></ngxsmk-datepicker>
 *
 * // Handle in component
 * onDateChange(date: Date | null) {
 *   console.log('Selected:', date);
 * }
 *
 * // Range selection
 * <ngxsmk-datepicker
 *   [mode]="'range'"
 *   (dateChange)="onRangeChange($event)"
 * ></ngxsmk-datepicker>
 *
 * onRangeChange(range: [Date, Date] | null) {
 *   if (range) {
 *     console.log('Start:', range[0], 'End:', range[1]);
 *   }
 * }
 */
@Output() dateChange = new EventEmitter<Date | Date[] | null>();
```

##### `googleSyncClick`

```typescript
/**
 * Emitted when the user clicks the Google Calendar sync button
 * @output googleSyncClick
 * @type {EventEmitter<void>}
 * @description
 * Emitted when the user clicks the Google Calendar sync button in the calendar header.
 * Use this to trigger the Google OAuth flow if manual handling is needed,
 * or just for analytics tracking.
 *
 * @example
 * <ngxsmk-datepicker
 *   (googleSyncClick)="onSyncClick()"
 * ></ngxsmk-datepicker>
 *
 * onSyncClick() {
 *   console.log('Google Sync button clicked');
 * }
 */
@Output() googleSyncClick = new EventEmitter<void>();
```

##### `calendarOpen`

```typescript
/**
 * Emitted when the calendar opens
 * @output calendarOpen
 * @type {EventEmitter<void>}
 * @description
 * Emitted when the calendar dropdown/popover opens.
 * Not emitted for inline mode.
 *
 * @example
 * <ngxsmk-datepicker
 *   (calendarOpen)="onCalendarOpen()"
 * ></ngxsmk-datepicker>
 *
 * onCalendarOpen() {
 *   console.log('Calendar opened');
 *   // Load dynamic data, trigger analytics, etc.
 * }
 */
@Output() calendarOpen = new EventEmitter<void>();
```

##### `calendarClose`

```typescript
/**
 * Emitted when the calendar closes
 * @output calendarClose
 * @type {EventEmitter<void>}
 * @description
 * Emitted when the calendar dropdown/popover closes.
 * Not emitted for inline mode.
 *
 * @example
 * <ngxsmk-datepicker
 *   (calendarClose)="onCalendarClose()"
 * ></ngxsmk-datepicker>
 *
 * onCalendarClose() {
 *   console.log('Calendar closed');
 *   // Save state, trigger validation, etc.
 * }
 */
@Output() calendarClose = new EventEmitter<void>();
```

### Public Methods

##### `openCalendar()`

```typescript
/**
 * Programmatically open the calendar
 * @method openCalendar
 * @returns {void}
 * @description
 * Opens the calendar dropdown/popover. Has no effect if inline mode
 * is enabled or the datepicker is disabled/readonly.
 *
 * @example
 * // Component template
 * <ngxsmk-datepicker #datepicker></ngxsmk-datepicker>
 * <button (click)="datepicker.openCalendar()">Open</button>
 *
 * // Component class
 * @ViewChild('datepicker') datepicker!: NgxsmkDatepickerComponent;
 *
 * openDatepicker() {
 *   this.datepicker.openCalendar();
 * }
 */
public openCalendar(): void;
```

##### `closeCalendar()`

```typescript
/**
 * Programmatically close the calendar
 * @method closeCalendar
 * @returns {void}
 * @description
 * Closes the calendar dropdown/popover. Has no effect if inline mode
 * is enabled.
 *
 * @example
 * // Component template
 * <ngxsmk-datepicker #datepicker></ngxsmk-datepicker>
 * <button (click)="datepicker.closeCalendar()">Close</button>
 *
 * // Component class
 * @ViewChild('datepicker') datepicker!: NgxsmkDatepickerComponent;
 *
 * closeDatepicker() {
 *   this.datepicker.closeCalendar();
 * }
 */
public closeCalendar(): void;
```

##### `clearValue()`

```typescript
/**
 * Clear the selected date value
 * @method clearValue
 * @param {Event} [event] - Optional DOM event
 * @returns {void}
 * @description
 * Clears the current selection and resets the datepicker to its
 * initial state. Emits dateChange with null value.
 *
 * @example
 * // Template
 * <ngxsmk-datepicker #datepicker></ngxsmk-datepicker>
 * <button (click)="datepicker.clearValue()">Clear</button>
 *
 * // Component class
 * @ViewChild('datepicker') datepicker!: NgxsmkDatepickerComponent;
 *
 * clearDatepicker() {
 *   this.datepicker.clearValue();
 *   console.log('Datepicker cleared');
 * }
 */
public clearValue(event?: Event): void;
```

---

## Services API

### CalendarGenerationService

```typescript
/**
 * Service for calendar generation logic
 * @service CalendarGenerationService
 * @description
 * Handles all calendar-related calculations including month views,
 * year grids, decade grids, and week day headers.
 *
 * @example
 * import { CalendarGenerationService } from 'ngxsmk-datepicker';
 *
 * constructor(private calendarService: CalendarGenerationService) {}
 *
 * generateMonthCalendar() {
 *   const calendar = this.calendarService.generateCalendar(
 *     2024,
 *     5,  // June
 *     0   // Sunday first
 *   );
 *   console.log(calendar); // Array of weeks with date objects
 * }
 */
```

### DatepickerParsingService

```typescript
/**
 * Service for date parsing and formatting
 * @service DatepickerParsingService
 * @description
 * Handles input parsing, date formatting, and value transformation.
 * Supports multiple input formats and custom format patterns.
 *
 * @example
 * import { DatepickerParsingService } from 'ngxsmk-datepicker';
 *
 * constructor(private parsingService: DatepickerParsingService) {}
 *
 * parseUserInput(input: string) {
 *   const date = this.parsingService.parseInput(input);
 *   if (date) {
 *     console.log('Parsed date:', date);
 *   }
 * }
 *
 * formatForDisplay(date: Date) {
 *   return this.parsingService.formatDate(date, 'MMM d, y');
 * }
 */
```

### CustomDateFormatService

```typescript
/**
 * Service for custom date formatting
 * @service CustomDateFormatService
 * @description
 * Provides custom date format patterns beyond Angular DatePipe.
 * Supports tokens like YYYY, MM, DD, HH, mm, ss.
 *
 * @example
 * import { CustomDateFormatService } from 'ngxsmk-datepicker';
 *
 * constructor(private formatService: CustomDateFormatService) {}
 *
 * formatDate() {
 *   const date = new Date(2024, 5, 15, 14, 30, 45);
 *
 *   // Custom format with tokens
 *   const formatted = this.formatService.format(
 *     date,
 *     'YYYY-MM-DD HH:mm:ss',
 *     'en-US'
 *   );
 *   console.log(formatted); // "2024-06-15 14:30:45"
 * }
 */
```

---

## Utilities API

### Date Utilities

```typescript
/**
 * Normalize a date input to a Date object
 * @function normalizeDate
 * @param {DateInput} input - Date, string, or number
 * @returns {Date | null} Normalized Date object or null if invalid
 * @description
 * Converts various date input formats to a Date object.
 * Returns null for invalid inputs.
 *
 * @example
 * import { normalizeDate } from 'ngxsmk-datepicker/utils';
 *
 * // From Date object
 * const date1 = normalizeDate(new Date());
 *
 * // From ISO string
 * const date2 = normalizeDate('2024-06-15');
 *
 * // From timestamp
 * const date3 = normalizeDate(1718409600000);
 *
 * // Invalid input
 * const date4 = normalizeDate('invalid'); // null
 */
export function normalizeDate(input: DateInput): Date | null;
```

### Timezone Utilities

```typescript
/**
 * Format a date with timezone support
 * @function formatDateWithTimezone
 * @param {Date} date - The date to format
 * @param {string} locale - Locale for formatting
 * @param {Intl.DateTimeFormatOptions} options - Format options
 * @param {string} [timezone] - IANA timezone name
 * @returns {string} Formatted date string
 * @description
 * Formats a date with specific timezone and locale settings.
 *
 * @example
 * import { formatDateWithTimezone } from 'ngxsmk-datepicker/utils';
 *
 * const date = new Date(2024, 5, 15, 14, 30);
 *
 * // Format in specific timezone
 * const formatted = formatDateWithTimezone(
 *   date,
 *   'en-US',
 *   { dateStyle: 'full', timeStyle: 'short' },
 *   'America/New_York'
 * );
 */
export function formatDateWithTimezone(date: Date, locale: string, options: Intl.DateTimeFormatOptions, timezone?: string): string;
```

---

## Interfaces & Types

### AnimationConfig

```typescript
/**
 * Animation configuration interface
 * @interface AnimationConfig
 * @description
 * Configuration for datepicker animations.
 *
 * @example
 * const animConfig: AnimationConfig = {
 *   duration: 300,
 *   easing: 'ease-in-out',
 *   enabled: true
 * };
 */
export interface AnimationConfig {
  /** Animation duration in milliseconds */
  duration?: number;

  /** CSS easing function */
  easing?: string;

  /** Whether animations are enabled */
  enabled?: boolean;
}
```

### DatepickerTranslations

```typescript
/**
 * Translation strings interface
 * @interface DatepickerTranslations
 * @description
 * All translatable strings used in the datepicker.
 *
 * @example
 * const translations: PartialDatepickerTranslations = {
 *   selectDate: 'Datum wählen',
 *   selectTime: 'Zeit wählen',
 *   today: 'Heute',
 *   clear: 'Löschen'
 * };
 *
 * <ngxsmk-datepicker [translations]="translations"></ngxsmk-datepicker>
 */
export interface DatepickerTranslations {
  selectDate: string;
  selectTime: string;
  today: string;
  clear: string;
  // ... more translation keys
}
```

---

## JSDoc Examples

### Complete Component Example

```typescript
import { Component } from "@angular/core";
import { NgxsmkDatepickerComponent } from "ngxsmk-datepicker";

/**
 * Example component demonstrating ngxsmk-datepicker usage
 * @component ExampleComponent
 * @description
 * Shows various datepicker configurations and use cases.
 */
@Component({
  selector: "app-example",
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <!-- Basic datepicker -->
    <ngxsmk-datepicker [(ngModel)]="selectedDate" [placeholder]="'Select a date'" (dateChange)="onDateChange($event)"></ngxsmk-datepicker>

    <!-- Range datepicker with time -->
    <ngxsmk-datepicker [mode]="'range'" [showTime]="true" [minDate]="minDate" [maxDate]="maxDate" (dateChange)="onRangeChange($event)"></ngxsmk-datepicker>

    <!-- Multi-calendar with sync scroll -->
    <ngxsmk-datepicker [calendarCount]="2" [syncScroll]="true" [inline]="true"></ngxsmk-datepicker>
  `,
})
export class ExampleComponent {
  selectedDate: Date | null = null;
  minDate = new Date();
  maxDate = new Date(2025, 11, 31);

  /**
   * Handle date change event
   * @param date - Selected date
   */
  onDateChange(date: Date | null) {
    console.log("Selected date:", date);
  }

  /**
   * Handle range change event
   * @param range - Selected date range
   */
  onRangeChange(range: [Date, Date] | null) {
    if (range) {
      console.log("Range:", range[0], "to", range[1]);
    }
  }
}
```

---

**For more examples and detailed usage, see the [README](README.md) and [Integration Guide](docs/INTEGRATION.md).**
