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
  timezone?: string;

  // ─── Schedule Mode ──────────────────────────────────────────────────────────
  schedule?: {
    // Panel
    panelTitle?: string; // "Date Schedule"
    addItem?: string; // "+ Add Item"
    searchPlaceholder?: string; // "Search items…"
    sortLabel?: string; // "Sort by"
    filterLabel?: string; // "Filter"
    exportLabel?: string; // "Export"
    importLabel?: string; // "Import"
    applyLabel?: string; // "Apply Schedule"
    cancelLabel?: string; // "Cancel"
    // Form headings
    formTitleNew?: string; // "New Item"
    formTitleEdit?: string; // "Edit Item"
    // Field labels
    fieldTitle?: string; // "Title"
    fieldCategory?: string; // "Category"
    fieldColor?: string; // "Color"
    fieldIcon?: string; // "Icon"
    fieldStart?: string; // "Start"
    fieldEnd?: string; // "End"
    fieldAllDay?: string; // "All day"
    fieldNotes?: string; // "Notes"
    fieldTags?: string; // "Tags"
    fieldPriority?: string; // "Priority"
    fieldUrl?: string; // "URL"
    fieldRecurrence?: string; // "Repeat"
    fieldBadge?: string; // "Badge Text"
    fieldTimezone?: string; // "Timezone"
    saveLabel?: string; // "Save"
    addTagPlaceholder?: string; // "Add tag…"
    // Validation errors
    errorTitleRequired?: string; // "Title is required"
    errorStartRequired?: string; // "Start date is required"
    errorEndBeforeStart?: string; // "End must be after start"
    errorMaxItems?: string; // "Maximum {n} items reached"
    errorConflict?: string; // "Overlaps with: {titles}"
    // Item actions
    editLabel?: string; // "Edit"
    deleteLabel?: string; // "Delete"
    duplicateLabel?: string; // "Duplicate"
    markCompleteLabel?: string; // "Mark complete"
    markIncompleteLabel?: string; // "Mark incomplete"
    lockLabel?: string; // "Lock item"
    unlockLabel?: string; // "Unlock item"
    hideLabel?: string; // "Hide item"
    // Empty state
    emptyTitle?: string; // "No items yet"
    emptySubtitle?: string; // "Click + Add Item to get started"
    // Sort options
    sortManual?: string; // "Manual order"
    sortDate?: string; // "By date"
    sortPriority?: string; // "By priority"
    sortTitle?: string; // "By title"
    // Priority level labels
    priorityLow?: string; // "Low"
    priorityMedium?: string; // "Medium"
    priorityHigh?: string; // "High"
    priorityCritical?: string; // "Critical"
    // Recurrence options
    recurrenceNone?: string; // "Does not repeat"
    recurrenceDaily?: string; // "Daily"
    recurrenceWeekdays?: string; // "Every weekday (Mon–Fri)"
    recurrenceWeekends?: string; // "Every weekend"
    recurrenceWeekly?: string; // "Weekly"
    recurrenceMonthly?: string; // "Monthly"
    recurrenceYearly?: string; // "Yearly"
    // Conflict banner
    conflictSingle?: string; // "1 conflict detected"
    conflictMultiple?: string; // "{n} conflicts detected"
    // Duration
    durationDay?: string; // "day"
    durationDays?: string; // "days"
    // Filter
    clearFilters?: string; // "✕ Clear"
  };
}

/**
 * Partial translations - allows overriding only specific keys
 */
export type PartialDatepickerTranslations = Partial<DatepickerTranslations>;
