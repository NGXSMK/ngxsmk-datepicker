import { DatepickerValue } from '../utils/calendar.utils';

export interface DayCellRenderHook {
  getDayCellClasses?(
    date: Date,
    isSelected: boolean,
    isDisabled: boolean,
    isToday: boolean,
    isHoliday: boolean,
  ): string[];
  getDayCellTooltip?(date: Date, holidayLabel: string | null): string | null;
  formatDayNumber?(date: Date): string;
}

export interface ValidationHook {
  validateDate?(
    date: Date,
    currentValue: DatepickerValue,
    mode:
      | 'single'
      | 'range'
      | 'multiple'
      | 'week'
      | 'month'
      | 'quarter'
      | 'year'
      | 'timeRange',
  ): boolean;
  validateRange?(startDate: Date, endDate: Date): boolean;
  getValidationError?(date: Date): string | null;
}

export interface KeyboardShortcutHook {
  handleShortcut?(
    event: KeyboardEvent,
    context: KeyboardShortcutContext,
  ): boolean;
  getShortcutHelp?(): KeyboardShortcutHelp[];
}

export interface KeyboardShortcutContext {
  currentDate: Date;
  selectedDate: Date | null;
  startDate: Date | null;
  endDate: Date | null;
  selectedDates: Date[];
  mode:
    | 'single'
    | 'range'
    | 'multiple'
    | 'week'
    | 'month'
    | 'quarter'
    | 'year'
    | 'timeRange';
  focusedDate: Date | null;
  isCalendarOpen: boolean;
}

export interface KeyboardShortcutHelp {
  key: string;
  description: string;
  modifiers?: string[];
}

export interface DateFormatHook {
  formatDisplayValue?(
    value: DatepickerValue,
    mode:
      | 'single'
      | 'range'
      | 'multiple'
      | 'week'
      | 'month'
      | 'quarter'
      | 'year'
      | 'timeRange',
  ): string;
  formatAriaLabel?(date: Date): string;
}

export interface EventHook {
  beforeDateSelect?(date: Date, currentValue: DatepickerValue): boolean;
  afterDateSelect?(date: Date, newValue: DatepickerValue): void;
  onCalendarOpen?(): void;
  onCalendarClose?(): void;
}

export interface DatepickerHooks
  extends
    DayCellRenderHook,
    ValidationHook,
    KeyboardShortcutHook,
    DateFormatHook,
    EventHook {}
