import { Injectable } from '@angular/core';
import { getStartOfDay } from '../utils/date.utils';
import { DatepickerValue } from '../utils/calendar.utils';
import { generateRecurringDates } from '../utils/recurring-dates.utils';

/**
 * @internal Prototype only — not used by {@link NgxsmkDatepickerComponent}.
 * Day Selection is implemented on the Datepicker Host. Do not import for app code;
 * a future Selection module will supersede this file. Kept for unit-test reference.
 */
export interface DateSelectionState {
  selectedDate: Date | null;
  startDate: Date | null;
  endDate: Date | null;
  selectedDates: Date[];
  hoveredDate: Date | null;
}

export interface DateSelectionConfig {
  mode: 'single' | 'range' | 'multiple';
  /** When true, range mode accepts start and end on the same calendar day (second click or service consumer). */
  allowSameDay?: boolean;
  showTime: boolean;
  timeOnly: boolean;
  currentDisplayHour: number;
  isPm: boolean;
  currentMinute: number;
  minuteInterval: number;
  recurringPattern?: {
    pattern: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'weekdays' | 'weekends';
    startDate: Date;
    endDate?: Date;
    dayOfWeek?: number;
    dayOfMonth?: number;
    interval?: number;
  } | null;
}

export interface DateSelectionCallbacks {
  isDateDisabled: (date: Date) => boolean;
  isCurrentMonth: (date: Date) => boolean;
  applyTimeIfNeeded: (date: Date) => Date;
  beforeDateSelect?: (date: Date, currentValue: DatepickerValue) => boolean;
  validateRange?: (start: Date, end: Date) => boolean;
  afterDateSelect?: (date: Date, newValue: DatepickerValue) => void;
  onValueEmitted?: (value: DatepickerValue) => void;
  onActionEmitted?: (action: { type: string; payload?: unknown }) => void;
  shouldAutoClose?: () => boolean;
  onCloseCalendar?: () => void;
  onCalendarGenerated?: () => void;
  onMonthYearChanged?: (month: number, year: number) => void;
  onStateChanged?: () => void;
}

@Injectable()
/** @internal See file-level note — not wired into the Datepicker Host. */
export class DateSelectionService {
  selectDate(
    day: Date | null,
    state: DateSelectionState,
    config: DateSelectionConfig,
    callbacks: DateSelectionCallbacks
  ): void {
    if (!day || callbacks.isDateDisabled(day)) return;

    const dateToToggle = getStartOfDay(day);

    if (callbacks.beforeDateSelect) {
      if (!callbacks.beforeDateSelect(day, null as DatepickerValue)) {
        return;
      }
    }

    if (config.mode === 'single') {
      if (!callbacks.isCurrentMonth(day)) {
        callbacks.onMonthYearChanged?.(day.getMonth(), day.getFullYear());
        callbacks.onCalendarGenerated?.();
      }

      const dateWithTime = callbacks.applyTimeIfNeeded(day);
      state.selectedDate = dateWithTime;
      const value: DatepickerValue = dateWithTime;
      callbacks.onValueEmitted?.(value);
    } else if (config.mode === 'range') {
      if (!callbacks.isCurrentMonth(day)) {
        callbacks.onMonthYearChanged?.(day.getMonth(), day.getFullYear());
        callbacks.onCalendarGenerated?.();
      }

      const dayTime = getStartOfDay(day).getTime();
      const startTime = state.startDate ? getStartOfDay(state.startDate).getTime() : null;

      if (!state.startDate || (state.startDate && state.endDate)) {
        state.startDate = callbacks.applyTimeIfNeeded(day);
        state.endDate = null;
        state.hoveredDate = null;
      } else if (state.startDate && !state.endDate) {
        if (dayTime < startTime!) {
          state.startDate = callbacks.applyTimeIfNeeded(day);
          state.endDate = null;
          state.hoveredDate = null;
        } else if (dayTime === startTime!) {
          if (config.allowSameDay && state.startDate) {
            const sameEnd = new Date(state.startDate);
            if (callbacks.validateRange && !callbacks.validateRange(state.startDate, sameEnd)) {
              callbacks.onStateChanged?.();
              return;
            }
            state.endDate = sameEnd;
            state.hoveredDate = null;
            callbacks.onValueEmitted?.({ start: state.startDate, end: state.endDate });
            callbacks.onStateChanged?.();
          }
        } else {
          const potentialEndDate = callbacks.applyTimeIfNeeded(day);

          if (callbacks.validateRange) {
            if (!callbacks.validateRange(state.startDate, potentialEndDate)) {
              state.startDate = potentialEndDate;
              state.endDate = null;
              state.hoveredDate = null;
              callbacks.onStateChanged?.();
              return;
            }
          }

          state.endDate = potentialEndDate;
          state.hoveredDate = null;
          const value: DatepickerValue = { start: state.startDate, end: state.endDate };
          callbacks.onValueEmitted?.(value);
          callbacks.onStateChanged?.();
        }
      }

      state.hoveredDate = null;
    } else if (config.mode === 'multiple') {
      if (!callbacks.isCurrentMonth(day)) {
        callbacks.onMonthYearChanged?.(day.getMonth(), day.getFullYear());
        callbacks.onCalendarGenerated?.();
      }

      if (config.recurringPattern) {
        const recurringConfig: {
          pattern: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'weekdays' | 'weekends';
          startDate: Date;
          endDate?: Date;
          dayOfWeek?: number;
          dayOfMonth?: number;
          interval?: number;
        } = {
          pattern: config.recurringPattern.pattern,
          startDate: config.recurringPattern.startDate,
          interval: config.recurringPattern.interval || 1,
        };
        if (config.recurringPattern.endDate !== undefined) {
          recurringConfig.endDate = config.recurringPattern.endDate;
        }
        if (config.recurringPattern.dayOfWeek !== undefined) {
          recurringConfig.dayOfWeek = config.recurringPattern.dayOfWeek;
        }
        if (config.recurringPattern.dayOfMonth !== undefined) {
          recurringConfig.dayOfMonth = config.recurringPattern.dayOfMonth;
        }
        const recurringDates = generateRecurringDates(recurringConfig);

        const datesWithTime = recurringDates.map((d) => callbacks.applyTimeIfNeeded(d));
        const uniqueDates = new Map<number, Date>();
        datesWithTime.forEach((d) => {
          uniqueDates.set(getStartOfDay(d).getTime(), d);
        });
        state.selectedDates = Array.from(uniqueDates.values()).sort((a, b) => a.getTime() - b.getTime());
        callbacks.onValueEmitted?.([...state.selectedDates]);
      } else {
        const existingIndex = state.selectedDates.findIndex((d) => {
          const dTime = getStartOfDay(d).getTime();
          const toggleTime = dateToToggle.getTime();
          return dTime === toggleTime;
        });

        if (existingIndex > -1) {
          state.selectedDates.splice(existingIndex, 1);
        } else {
          const dateWithTime = callbacks.applyTimeIfNeeded(dateToToggle);
          state.selectedDates.push(dateWithTime);
          state.selectedDates.sort((a, b) => a.getTime() - b.getTime());
        }
        callbacks.onValueEmitted?.([...state.selectedDates]);
      }
    }

    const dateToSync =
      config.mode === 'single'
        ? state.selectedDate
        : config.mode === 'range'
          ? state.startDate
          : config.mode === 'multiple' && state.selectedDates.length > 0
            ? state.selectedDates[state.selectedDates.length - 1]
            : null;

    if (dateToSync && callbacks.afterDateSelect) {
      // We need the new value, but we'll pass null for now
      // The component should provide this
      callbacks.afterDateSelect(day, null as DatepickerValue);
    }

    if (callbacks.onActionEmitted) {
      callbacks.onActionEmitted({
        type: 'dateSelected',
        payload: {
          mode: config.mode,
          value: null as DatepickerValue,
          date: day,
        },
      });
    }

    if (callbacks.shouldAutoClose?.()) {
      callbacks.onCloseCalendar?.();
    }

    callbacks.onStateChanged?.();
  }

  selectRange(
    range: [Date, Date],
    state: DateSelectionState,
    config: DateSelectionConfig,
    callbacks: DateSelectionCallbacks
  ): void {
    if (config.mode !== 'range') return;

    const [start, end] = range;
    state.startDate = callbacks.applyTimeIfNeeded(start);
    state.endDate = callbacks.applyTimeIfNeeded(end);
    state.hoveredDate = null;

    const value: DatepickerValue = { start: state.startDate, end: state.endDate };
    callbacks.onValueEmitted?.(value);

    if (callbacks.shouldAutoClose?.()) {
      callbacks.onCloseCalendar?.();
    }

    callbacks.onStateChanged?.();
  }

  clearSelection(state: DateSelectionState): void {
    state.selectedDate = null;
    state.startDate = null;
    state.endDate = null;
    state.selectedDates = [];
    state.hoveredDate = null;
  }
}
