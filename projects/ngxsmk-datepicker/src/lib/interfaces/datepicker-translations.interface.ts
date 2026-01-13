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
  rangeSelected: string; // "Range selected: {start} to {end}"
  monthChanged: string; // "Changed to {month} {year}"
  yearChanged: string; // "Changed to year {year}"
  calendarLoading: string; // "Loading calendar..."
  calendarReady: string; // "Calendar ready"
  keyboardShortcuts: string;
}

/**
 * Partial translations - allows overriding only specific keys
 */
export type PartialDatepickerTranslations = Partial<DatepickerTranslations>;

