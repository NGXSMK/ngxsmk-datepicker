/**
 * Luxon Adapter Implementation
 *
 * To use this adapter, install luxon:
 * npm install luxon
 *
 * Then provide it in your app config:
 * ```typescript
 * import { provideDatepickerConfig } from 'ngxsmk-datepicker';
 * import { LuxonAdapter } from 'ngxsmk-datepicker/adapters';
 *
 * provideDatepickerConfig({
 *   dateAdapter: new LuxonAdapter()
 * })
 * ```
 */

import { DateAdapter } from './date-adapter.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const require: (module: string) => any;

export class LuxonAdapter implements DateAdapter {
  // Optional peer dep — typed loosely for dynamic require.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private DateTime: any;

  constructor() {
    try {
      this.DateTime = require('luxon').DateTime;
    } catch {
      throw new Error('luxon is not installed. Please install it: npm install luxon');
    }
  }

  parse(value: string | Date | number | unknown, onError?: (error: Error) => void): Date | null {
    if (!value) return null;

    try {
      if (value instanceof Date) {
        const dt = this.DateTime.fromJSDate(value);
        if (!dt.isValid) {
          onError?.(new Error(`Invalid Date object: ${value}`));
          return null;
        }
        return new Date(value.getTime());
      }

      if (typeof value === 'string') {
        const parsed = this.DateTime.fromISO(value) || this.DateTime.fromFormat(value, 'yyyy-MM-dd');
        if (!parsed.isValid) {
          onError?.(new Error(`Invalid date string: "${value}"`));
          return null;
        }
        return parsed.toJSDate() as Date;
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
      return null;
    }

    return null;
  }

  format(date: Date, formatStr: string = 'MMM dd, yyyy', locale?: string): string {
    if (!date) return '';

    try {
      const dt = this.DateTime.fromJSDate(date);
      if (!dt.isValid) return '';

      const options: Record<string, unknown> = {};
      if (locale) {
        options['locale'] = locale;
      }

      return dt.toFormat(formatStr, options) as string;
    } catch {
      return '';
    }
  }

  isValid(value: string | Date | number | unknown): boolean {
    if (value instanceof Date) {
      return this.DateTime.fromJSDate(value).isValid as boolean;
    }
    if (typeof value === 'string') {
      return (this.DateTime.fromISO(value).isValid ||
        this.DateTime.fromFormat(value, 'yyyy-MM-dd').isValid) as boolean;
    }
    return false;
  }

  startOfDay(date: Date): Date {
    return this.DateTime.fromJSDate(date).startOf('day').toJSDate() as Date;
  }

  endOfDay(date: Date): Date {
    return this.DateTime.fromJSDate(date).endOf('day').toJSDate() as Date;
  }

  addMonths(date: Date, months: number): Date {
    return this.DateTime.fromJSDate(date).plus({ months }).toJSDate() as Date;
  }

  addDays(date: Date, days: number): Date {
    return this.DateTime.fromJSDate(date).plus({ days }).toJSDate() as Date;
  }

  isSameDay(date1: Date | null, date2: Date | null): boolean {
    if (!date1 || !date2) return false;
    const dt1 = this.DateTime.fromJSDate(date1);
    const dt2 = this.DateTime.fromJSDate(date2);
    return dt1.hasSame(dt2, 'day') as boolean;
  }
}
