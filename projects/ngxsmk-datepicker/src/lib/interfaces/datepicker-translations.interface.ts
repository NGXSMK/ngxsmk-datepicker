/**
 * Complete translations interface for the datepicker component
 */
export interface DatepickerTranslations {
  // Main actions
  selectDate: string;
  selectTime: string;
  clear: string;
  close: string;
  today: string;
  selectEndDate: string;
  /** Optional: "Select start date" for range summary UX */
  selectStartDate?: string;
  /** Optional: short "Start" label in range summary */
  startLabel?: string;
  /** Optional: short "End" label in range summary */
  endLabel?: string;
  /** Optional: format hint, e.g. "Format: {{format}}" */
  formatHint?: string;
  day: string;
  days: string;

  // Navigation
  previousMonth: string;
  nextMonth: string;
  previousYear: string;
  nextYear: string;
  previousYears: string;
  nextYears: string;
  previousDecade: string;
  nextDecade: string;

  // ARIA labels
  clearSelection: string;
  closeCalendar: string;
  closeCalendarOverlay: string;
  calendarFor: string; // "Calendar for {month} {year}"
  selectYear: string; // "Select year {year}"
  selectDecade: string; // "Select decade {start} - {end}"

  // Multiple selection
  datesSelected: string; // "{count} dates selected"
  timesSelected: string; // "{count} times selected"

  // Time selection
  time: string;
  startTime: string;
  endTime: string;
  from: string; // For time range selection
  to: string; // For time range selection

  // Holiday
  holiday: string;

  // View modes
  month: string;
  year: string;
  decade: string;
  timeline: string;
  timeSlider: string;

  // ARIA live announcements
  calendarOpened: string; // "Calendar opened for {month} {year}"
  calendarClosed: string;
  dateSelected: string; // "Date selected: {date}"
  startDateSelected?: string; // "Start date set to {date}. Select end date."
  rangeSelected: string; // "Range selected: {start} to {end}"
  monthChanged: string; // "Changed to {month} {year}"
  yearChanged: string; // "Changed to year {year}"
  calendarLoading: string; // "Loading calendar..."
  calendarReady: string; // "Calendar ready"
  keyboardShortcuts: string;

  // Validation / error messages (user-facing)
  invalidDateFormat: string; // "Please enter a valid date."
  dateBeforeMin: string; // "Date must be on or after {minDate}."
  dateAfterMax: string; // "Date must be on or before {maxDate}."
  invalidDate: string; // "Invalid date."
  /** Optional: unavailable day reasons for tooltips / aria */
  dateUnavailable?: string;
  dateUnavailableMin?: string;
  dateUnavailableMax?: string;
  dateUnavailableHoliday?: string;
  dateUnavailableBlocked?: string;
  timezone?: string;
}

/**
 * Partial translations - allows overriding only specific keys
 */
export type PartialDatepickerTranslations = Partial<DatepickerTranslations>;
