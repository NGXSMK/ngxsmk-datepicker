import { Injectable, isDevMode } from '@angular/core';
import { HolidayProvider } from '../utils/calendar.utils';
import { Constraints, EMPTY_CONSTRAINTS_SOURCES } from '../constraints/constraints';

export interface ValidationConstraints {
  minDate?: Date | null;
  maxDate?: Date | null;
  disabledDates?: (string | Date)[];
  disabledRanges?: Array<{ start: Date | string; end: Date | string }>;
  isInvalidDate?: (date: Date) => boolean;
  holidayProvider?: HolidayProvider | null;
  disableHolidays?: boolean;
}

/**
 * @deprecated Use {@link Constraints.build} / Constraints Snapshot instead.
 * Kept as a SemVer-stable façade that delegates to Constraints.
 */
@Injectable()
export class DateValidationService {
  /**
   * Check if a date is valid according to all constraints
   * @deprecated Prefer Constraints.build(...).isAllowed(date)
   */
  isDateValid(date: Date | null, constraints: ValidationConstraints): boolean {
    if (!date || isNaN(date.getTime())) {
      return false;
    }
    return this.snapshot(constraints).isAllowed(date);
  }

  /**
   * Check if a date is disabled
   * @deprecated Prefer Constraints.build(...).isAllowed(date) (note: null is allowed/not disabled on the Host)
   */
  isDateDisabled(date: Date | null, constraints: ValidationConstraints): boolean {
    if (!date) {
      return true;
    }
    return !this.snapshot(constraints).isAllowed(date);
  }

  /**
   * Check if a date is a holiday
   * @deprecated Call HolidayProvider directly or use Constraints denials
   */
  isHoliday(date: Date | null, holidayProvider?: HolidayProvider | null): boolean {
    if (!date || !holidayProvider) {
      return false;
    }

    try {
      return holidayProvider.isHoliday(date);
    } catch (error) {
      if (isDevMode()) {
        console.warn('[ngxsmk-datepicker] Error in holidayProvider.isHoliday:', error);
      }
      return false;
    }
  }

  /**
   * Get holiday label for a date
   * @deprecated Call HolidayProvider.getHolidayLabel directly
   */
  getHolidayLabel(date: Date | null, holidayProvider?: HolidayProvider | null): string | null {
    if (!date || !holidayProvider || !holidayProvider.getHolidayLabel) {
      return null;
    }

    try {
      return holidayProvider.getHolidayLabel(date);
    } catch (error) {
      if (isDevMode()) {
        console.warn('[ngxsmk-datepicker] Error in holidayProvider.getHolidayLabel:', error);
      }
      return null;
    }
  }

  private snapshot(constraints: ValidationConstraints) {
    return Constraints.build({
      ...EMPTY_CONSTRAINTS_SOURCES,
      minDate: constraints.minDate ?? null,
      maxDate: constraints.maxDate ?? null,
      disabledDates: constraints.disabledDates ?? [],
      disabledRanges: constraints.disabledRanges ?? [],
      disableHolidays: !!constraints.disableHolidays,
      holidayProvider: constraints.holidayProvider ?? null,
      isInvalidDate: constraints.isInvalidDate ?? null,
    });
  }
}
