import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { getStartOfDay, getEndOfDay, normalizeDate } from '../utils/date.utils';

export type DynamicDateInput = Date | string | null | undefined | (() => Date | string | null | undefined);

function resolveDate(input: DynamicDateInput): Date | null {
  if (typeof input === 'function') {
    const res = input();
    return res ? normalizeDate(res) : null;
  }
  return input ? normalizeDate(input) : null;
}

function isDateRangeObject(val: unknown): val is { start: Date | string | null; end: Date | string | null } {
  return typeof val === 'object' && val !== null && ('start' in val || 'end' in val);
}

/**
 * Validates that the selected date or date range is on or after the specified minimum date.
 *
 * @param minDate - The minimum date bound, as a Date, string, or function returning a Date/string.
 * @returns An Angular ValidatorFn.
 *
 * @example
 * ```typescript
 * const control = new FormControl(new Date(), ngxsmkMinDateValidator(new Date(2025, 0, 1)));
 * ```
 */
export function ngxsmkMinDateValidator(minDate: DynamicDateInput): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const min = resolveDate(minDate);
    if (!min || Number.isNaN(min.getTime())) return null;

    const minTime = getStartOfDay(min).getTime();

    // Single Date
    if (value instanceof Date || typeof value === 'string') {
      const parsed = normalizeDate(value);
      if (parsed && !Number.isNaN(parsed.getTime())) {
        if (getStartOfDay(parsed).getTime() < minTime) {
          return { ngxsmkMinDate: { min, actual: parsed } };
        }
      }
    }

    // Range Object
    if (isDateRangeObject(value)) {
      const start = value.start ? normalizeDate(value.start) : null;
      if (start && !Number.isNaN(start.getTime())) {
        if (getStartOfDay(start).getTime() < minTime) {
          return { ngxsmkMinDate: { min, actual: start } };
        }
      }
    }

    // Multiple Dates
    if (Array.isArray(value)) {
      for (const d of value) {
        const parsed = normalizeDate(d);
        if (parsed && !Number.isNaN(parsed.getTime()) && getStartOfDay(parsed).getTime() < minTime) {
          return { ngxsmkMinDate: { min, actual: parsed } };
        }
      }
    }

    return null;
  };
}

/**
 * Validates that the selected date or date range is on or before the specified maximum date.
 *
 * @param maxDate - The maximum date bound, as a Date, string, or function returning a Date/string.
 * @returns An Angular ValidatorFn.
 *
 * @example
 * ```typescript
 * const control = new FormControl(new Date(), ngxsmkMaxDateValidator(new Date(2026, 11, 31)));
 * ```
 */
export function ngxsmkMaxDateValidator(maxDate: DynamicDateInput): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const max = resolveDate(maxDate);
    if (!max || Number.isNaN(max.getTime())) return null;

    const maxTime = getEndOfDay(max).getTime();

    // Single Date
    if (value instanceof Date || typeof value === 'string') {
      const parsed = normalizeDate(value);
      if (parsed && !Number.isNaN(parsed.getTime())) {
        if (getEndOfDay(parsed).getTime() > maxTime) {
          return { ngxsmkMaxDate: { max, actual: parsed } };
        }
      }
    }

    // Range Object
    if (isDateRangeObject(value)) {
      const end = value.end ? normalizeDate(value.end) : null;
      if (end && !Number.isNaN(end.getTime())) {
        if (getEndOfDay(end).getTime() > maxTime) {
          return { ngxsmkMaxDate: { max, actual: end } };
        }
      }
    }

    // Multiple Dates
    if (Array.isArray(value)) {
      for (const d of value) {
        const parsed = normalizeDate(d);
        if (parsed && !Number.isNaN(parsed.getTime()) && getEndOfDay(parsed).getTime() > maxTime) {
          return { ngxsmkMaxDate: { max, actual: parsed } };
        }
      }
    }

    return null;
  };
}

export interface DateRangeValidatorOptions {
  /** Minimum number of days in the range (inclusive). */
  minDays?: number;
  /** Maximum number of days in the range (inclusive). */
  maxDays?: number;
  /** When true, validates that both start and end dates are selected. */
  requireBoth?: boolean;
}

/**
 * Validates range constraints (minimum duration, maximum duration, and complete range requirements).
 *
 * @param options - Configuration options for range validation.
 * @returns An Angular ValidatorFn.
 *
 * @example
 * ```typescript
 * const control = new FormControl(null, ngxsmkDateRangeValidator({ minDays: 2, maxDays: 14, requireBoth: true }));
 * ```
 */
export function ngxsmkDateRangeValidator(options: DateRangeValidatorOptions = {}): ValidatorFn {
  const { minDays, maxDays, requireBoth = false } = options;

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    if (!isDateRangeObject(value)) return null;

    const start = value.start ? normalizeDate(value.start) : null;
    const end = value.end ? normalizeDate(value.end) : null;

    if (requireBoth && (!start || !end)) {
      return { ngxsmkRangeIncomplete: true };
    }

    if (start && end && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
      const startTime = getStartOfDay(start).getTime();
      const endTime = getStartOfDay(end).getTime();

      if (endTime < startTime) {
        return { ngxsmkRangeInvalid: { message: 'End date must be after start date' } };
      }

      const diffDays = Math.round((endTime - startTime) / (1000 * 60 * 60 * 24)) + 1;

      if (typeof minDays === 'number' && diffDays < minDays) {
        return { ngxsmkRangeTooShort: { minDays, actualDays: diffDays } };
      }

      if (typeof maxDays === 'number' && diffDays > maxDays) {
        return { ngxsmkRangeTooLong: { maxDays, actualDays: diffDays } };
      }
    }

    return null;
  };
}

/**
 * Validates that the selected date (or dates within a range/multiple selection) does not fall on a blocked or disabled date.
 *
 * @param blocked - Array of blocked dates/strings, or a predicate function returning true if date is blocked.
 * @returns An Angular ValidatorFn.
 *
 * @example
 * ```typescript
 * const control = new FormControl(null, ngxsmkBlockedDatesValidator([new Date(2026, 11, 25)]));
 * ```
 */
export function ngxsmkBlockedDatesValidator(
  blocked: (Date | string)[] | ((date: Date) => boolean)
): ValidatorFn {
  let isBlockedFn: (d: Date) => boolean;

  if (typeof blocked === 'function') {
    isBlockedFn = blocked;
  } else {
    const blockedSet = new Set<number>();
    for (const item of blocked) {
      const d = normalizeDate(item);
      if (d && !Number.isNaN(d.getTime())) {
        blockedSet.add(getStartOfDay(d).getTime());
      }
    }
    isBlockedFn = (d: Date) => blockedSet.has(getStartOfDay(d).getTime());
  }

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    // Single Date
    if (value instanceof Date || typeof value === 'string') {
      const parsed = normalizeDate(value);
      if (parsed && !Number.isNaN(parsed.getTime()) && isBlockedFn(parsed)) {
        return { ngxsmkDateBlocked: { date: parsed } };
      }
    }

    // Range Object
    if (isDateRangeObject(value)) {
      const start = value.start ? normalizeDate(value.start) : null;
      const end = value.end ? normalizeDate(value.end) : null;

      if (start && end) {
        const curr = new Date(getStartOfDay(start));
        const endDay = getStartOfDay(end);
        const blockedFound: Date[] = [];

        while (curr.getTime() <= endDay.getTime()) {
          if (isBlockedFn(curr)) {
            blockedFound.push(new Date(curr));
          }
          curr.setDate(curr.getDate() + 1);
        }

        if (blockedFound.length > 0) {
          return { ngxsmkRangeContainsBlocked: { blockedDates: blockedFound } };
        }
      } else if (start && isBlockedFn(start)) {
        return { ngxsmkDateBlocked: { date: start } };
      }
    }

    // Multiple Dates
    if (Array.isArray(value)) {
      const blockedFound: Date[] = [];
      for (const d of value) {
        const parsed = normalizeDate(d);
        if (parsed && !Number.isNaN(parsed.getTime()) && isBlockedFn(parsed)) {
          blockedFound.push(parsed);
        }
      }
      if (blockedFound.length > 0) {
        return { ngxsmkDatesBlocked: { blockedDates: blockedFound } };
      }
    }

    return null;
  };
}
