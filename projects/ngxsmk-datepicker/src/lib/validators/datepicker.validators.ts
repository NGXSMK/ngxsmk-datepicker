import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { getStartOfDay, normalizeDate } from '../utils/date.utils';
import { Constraints, EMPTY_CONSTRAINTS_SOURCES } from '../constraints/constraints';

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

function daysInControlValue(value: unknown): Date[] {
  if (value instanceof Date || typeof value === 'string') {
    const parsed = normalizeDate(value);
    return parsed && !Number.isNaN(parsed.getTime()) ? [parsed] : [];
  }
  if (isDateRangeObject(value)) {
    const days: Date[] = [];
    if (value.start) {
      const start = normalizeDate(value.start);
      if (start && !Number.isNaN(start.getTime())) days.push(start);
    }
    if (value.end) {
      const end = normalizeDate(value.end);
      if (end && !Number.isNaN(end.getTime())) days.push(end);
    }
    return days;
  }
  if (Array.isArray(value)) {
    const days: Date[] = [];
    for (const item of value) {
      const parsed = normalizeDate(item);
      if (parsed && !Number.isNaN(parsed.getTime())) days.push(parsed);
    }
    return days;
  }
  return [];
}

/**
 * Validates that the selected date or date range is on or after the specified minimum date.
 *
 * Thin adapter over Constraints — public name and error keys unchanged.
 */
export function ngxsmkMinDateValidator(minDate: DynamicDateInput): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const min = resolveDate(minDate);
    if (!min || Number.isNaN(min.getTime())) return null;

    const snap = Constraints.build({
      ...EMPTY_CONSTRAINTS_SOURCES,
      minDate: min,
    });

    // Range: only start is checked against min (parity with prior validator)
    if (isDateRangeObject(value)) {
      const start = value.start ? normalizeDate(value.start) : null;
      if (start && !Number.isNaN(start.getTime())) {
        const verdict = snap.evaluate(start);
        if (!verdict.allowed && verdict.denial.code === 'min') {
          return { ngxsmkMinDate: { min: verdict.denial.min, actual: start } };
        }
      }
      return null;
    }

    for (const day of daysInControlValue(value)) {
      const verdict = snap.evaluate(day);
      if (!verdict.allowed && verdict.denial.code === 'min') {
        return { ngxsmkMinDate: { min: verdict.denial.min, actual: day } };
      }
    }
    return null;
  };
}

/**
 * Validates that the selected date or date range is on or before the specified maximum date.
 *
 * Thin adapter over Constraints — public name and error keys unchanged.
 */
export function ngxsmkMaxDateValidator(maxDate: DynamicDateInput): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const max = resolveDate(maxDate);
    if (!max || Number.isNaN(max.getTime())) return null;

    const snap = Constraints.build({
      ...EMPTY_CONSTRAINTS_SOURCES,
      maxDate: max,
    });

    // Range: only end is checked against max (parity with prior validator)
    if (isDateRangeObject(value)) {
      const end = value.end ? normalizeDate(value.end) : null;
      if (end && !Number.isNaN(end.getTime())) {
        const verdict = snap.evaluate(end);
        if (!verdict.allowed && verdict.denial.code === 'max') {
          return { ngxsmkMaxDate: { max: verdict.denial.max, actual: end } };
        }
      }
      return null;
    }

    for (const day of daysInControlValue(value)) {
      const verdict = snap.evaluate(day);
      if (!verdict.allowed && verdict.denial.code === 'max') {
        return { ngxsmkMaxDate: { max: verdict.denial.max, actual: day } };
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
 * Not part of allowed-day Constraints — duration rules stay here.
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
 * Thin adapter over Constraints — public name and error keys unchanged.
 */
export function ngxsmkBlockedDatesValidator(blocked: (Date | string)[] | ((date: Date) => boolean)): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const snap = Constraints.build({
      ...EMPTY_CONSTRAINTS_SOURCES,
      disabledDates: Array.isArray(blocked) ? blocked : [],
      isInvalidDate: typeof blocked === 'function' ? blocked : null,
    });

    if (value instanceof Date || typeof value === 'string') {
      const parsed = normalizeDate(value);
      if (parsed && !Number.isNaN(parsed.getTime())) {
        const verdict = snap.evaluate(parsed);
        if (!verdict.allowed) {
          return { ngxsmkDateBlocked: { date: parsed } };
        }
      }
      return null;
    }

    if (isDateRangeObject(value)) {
      const start = value.start ? normalizeDate(value.start) : null;
      const end = value.end ? normalizeDate(value.end) : null;

      if (start && end) {
        const hits = snap.scan({ start, end });
        if (hits.length > 0) {
          return { ngxsmkRangeContainsBlocked: { blockedDates: hits.map((h) => h.day) } };
        }
      } else if (start) {
        const verdict = snap.evaluate(start);
        if (!verdict.allowed) {
          return { ngxsmkDateBlocked: { date: start } };
        }
      }
      return null;
    }

    if (Array.isArray(value)) {
      const blockedFound: Date[] = [];
      for (const item of value) {
        const parsed = normalizeDate(item);
        if (parsed && !Number.isNaN(parsed.getTime()) && !snap.isAllowed(parsed)) {
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
