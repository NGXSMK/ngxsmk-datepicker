import { Injectable } from '@angular/core';
import { HolidayProvider } from '../utils/calendar.utils';
import { getStartOfDay, getEndOfDay } from '../utils/date.utils';

export interface ValidationConstraints {
  minDate?: Date | null;
  maxDate?: Date | null;
  disabledDates?: (string | Date)[];
  disabledRanges?: Array<{ start: Date | string; end: Date | string }>;
  isInvalidDate?: (date: Date) => boolean;
  holidayProvider?: HolidayProvider | null;
  disableHolidays?: boolean;
}

@Injectable()
export class DateValidationService {
  /**
   * Check if a date is valid according to all constraints
   */
  isDateValid(date: Date | null, constraints: ValidationConstraints): boolean {
    if (!date || isNaN(date.getTime())) {
      return false;
    }

    const dayStart = getStartOfDay(date);

    // Check min/max date constraints
    if (constraints.minDate) {
      const minStart = getStartOfDay(constraints.minDate);
      if (dayStart < minStart) {
        return false;
      }
    }

    if (constraints.maxDate) {
      const maxStart = getStartOfDay(constraints.maxDate);
      if (dayStart > maxStart) {
        return false;
      }
    }

    // Check disabled dates
    if (constraints.disabledDates && constraints.disabledDates.length > 0) {
      const isDisabled = constraints.disabledDates.some(disabledDate => {
        const disabled = disabledDate instanceof Date
          ? disabledDate
          : new Date(disabledDate);
        return this.isSameDay(dayStart, disabled);
      });

      if (isDisabled) {
        return false;
      }
    }

    // Check disabled ranges
    if (constraints.disabledRanges && constraints.disabledRanges.length > 0) {
      const isInDisabledRange = constraints.disabledRanges.some(range => {
        const start = range.start instanceof Date ? range.start : new Date(range.start);
        const end = range.end instanceof Date ? range.end : new Date(range.end);
        const rangeStart = getStartOfDay(start);
        const rangeEnd = getEndOfDay(end);
        return dayStart >= rangeStart && dayStart <= rangeEnd;
      });

      if (isInDisabledRange) {
        return false;
      }
    }

    // Check custom validation function
    if (constraints.isInvalidDate && constraints.isInvalidDate(date)) {
      return false;
    }

    // Check holidays
    if (constraints.disableHolidays && constraints.holidayProvider) {
      if (constraints.holidayProvider.isHoliday(date)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if a date is disabled
   */
  isDateDisabled(date: Date | null, constraints: ValidationConstraints): boolean {
    if (!date) {
      return true;
    }

    return !this.isDateValid(date, constraints);
  }

  /**
   * Check if a date is a holiday
   */
  isHoliday(date: Date | null, holidayProvider?: HolidayProvider | null): boolean {
    if (!date || !holidayProvider) {
      return false;
    }

    return holidayProvider.isHoliday(date);
  }

  /**
   * Get holiday label for a date
   */
  getHolidayLabel(date: Date | null, holidayProvider?: HolidayProvider | null): string | null {
    if (!date || !holidayProvider || !holidayProvider.getHolidayLabel) {
      return null;
    }

    return holidayProvider.getHolidayLabel(date);
  }

  /**
   * Helper to check if two dates are the same day
   */
  private isSameDay(d1: Date, d2: Date): boolean {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

}

