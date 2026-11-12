import type { DatepickerValue } from './calendar.utils';

/** Compare nullable Date instances by identity or epoch time. */
export function isNullableDateEqual(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.getTime() === b.getTime();
}

/**
 * Deep equality for datepicker values:
 * - Date → epoch compare
 * - Range → start/end nullable compare (supports partial `{ end: null }`)
 * - Array → same length + matching times (order-sensitive)
 */
export function isDatepickerValueEqual(val1: DatepickerValue, val2: DatepickerValue): boolean {
  if (val1 === val2) return true;
  if (val1 === null || val2 === null) return val1 === val2;

  if (val1 instanceof Date && val2 instanceof Date) {
    return val1.getTime() === val2.getTime();
  }

  if (
    typeof val1 === 'object' &&
    typeof val2 === 'object' &&
    'start' in val1 &&
    'end' in val1 &&
    'start' in val2 &&
    'end' in val2
  ) {
    const r1 = val1 as { start: Date | null; end: Date | null };
    const r2 = val2 as { start: Date | null; end: Date | null };
    return isNullableDateEqual(r1.start, r2.start) && isNullableDateEqual(r1.end, r2.end);
  }

  if (Array.isArray(val1) && Array.isArray(val2)) {
    if (val1.length !== val2.length) return false;
    return val1.every((d1, i) => {
      const d2 = val2[i];
      return d1?.getTime() === d2?.getTime();
    });
  }

  return false;
}
