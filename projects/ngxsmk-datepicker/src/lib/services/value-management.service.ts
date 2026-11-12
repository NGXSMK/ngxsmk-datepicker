import { Injectable } from '@angular/core';
import { DateInput, normalizeDate } from '../utils/date.utils';
import { DatepickerValue } from '../utils/calendar.utils';

@Injectable()
export class ValueManagementService {
  normalizeDate(date: DateInput | null): Date | null {
    return normalizeDate(date);
  }

  isMomentObject(val: unknown): boolean {
    if (!val || typeof val !== 'object') {
      return false;
    }
    const obj = val as Record<string, unknown>;
    return (
      typeof obj['format'] === 'function' &&
      typeof obj['toDate'] === 'function' &&
      typeof obj['isMoment'] === 'function' &&
      typeof obj['isMoment']() === 'boolean' &&
      obj['isMoment']() === true
    );
  }

  /**
   * Normalize various value types to DatepickerValue
   */
  normalizeValue(
    val: unknown,
    displayFormat?: string,
    parseCustomDateString?: (dateString: string, format: string) => Date | null
  ): DatepickerValue {
    if (val === null || val === undefined) {
      return null;
    }

    if (val instanceof Date) {
      return this.normalizeDate(val) as DatepickerValue;
    } else if (this.isMomentObject(val)) {
      return this.normalizeDate((val as { toDate: () => Date }).toDate()) as DatepickerValue;
    } else if (typeof val === 'object' && val !== null && 'start' in val && 'end' in val) {
      const rangeVal = val as { start: DateInput; end: DateInput };
      const start = this.normalizeDate(rangeVal.start);
      const end = this.normalizeDate(rangeVal.end);
      if (start && end) {
        return { start, end } as DatepickerValue;
      }
      return null;
    } else if (Array.isArray(val)) {
      return val.map((d) => this.normalizeDate(d)).filter((d): d is Date => d !== null) as DatepickerValue;
    } else if (typeof val === 'string' && displayFormat && parseCustomDateString) {
      const parsedDate = parseCustomDateString(val, displayFormat);
      return parsedDate as DatepickerValue;
    } else if (
      typeof val === 'string' ||
      val instanceof Date ||
      (typeof val === 'object' && val !== null && 'getTime' in val)
    ) {
      const normalized = this.normalizeDate(val as DateInput);
      return normalized as DatepickerValue;
    } else {
      return null;
    }
  }

  private isNullableDateEqual(a: Date | null | undefined, b: Date | null | undefined): boolean {
    if (a === b) return true;
    if (!a || !b) return false;
    return a.getTime() === b.getTime();
  }

  isValueEqual(val1: DatepickerValue, val2: DatepickerValue): boolean {
    if (val1 === val2) return true;
    if (val1 === null || val2 === null) return val1 === val2;

    if (val1 instanceof Date && val2 instanceof Date) {
      return val1.getTime() === val2.getTime();
    }

    if (
      typeof val1 === 'object' &&
      val1 !== null &&
      typeof val2 === 'object' &&
      val2 !== null &&
      'start' in val1 &&
      'end' in val1 &&
      'start' in val2 &&
      'end' in val2
    ) {
      const range1 = val1 as { start: Date | null; end: Date | null };
      const range2 = val2 as { start: Date | null; end: Date | null };
      return (
        this.isNullableDateEqual(range1.start, range2.start) && this.isNullableDateEqual(range1.end, range2.end)
      );
    }

    if (Array.isArray(val1) && Array.isArray(val2)) {
      if (val1.length !== val2.length) return false;
      const sorted1 = [...val1].sort((a, b) => a.getTime() - b.getTime());
      const sorted2 = [...val2].sort((a, b) => a.getTime() - b.getTime());
      return sorted1.every((d, i) => d.getTime() === sorted2[i]!.getTime());
    }

    return false;
  }
}
