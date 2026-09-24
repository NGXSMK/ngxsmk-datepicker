/**
 * Day.js Adapter Implementation
 *
 * To use this adapter, install dayjs:
 * npm install dayjs
 *
 * Then provide it in your app config:
 * ```typescript
 * import { provideDatepickerConfig } from 'ngxsmk-datepicker';
 * import { DayjsAdapter } from 'ngxsmk-datepicker/adapters';
 *
 * provideDatepickerConfig({
 *   dateAdapter: new DayjsAdapter()
 * })
 * ```
 */

import { DateAdapter } from './date-adapter.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const require: (module: string) => any;

export class DayjsAdapter implements DateAdapter {
  // Optional peer dep — typed loosely for dynamic require.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private dayjs: any;

  constructor() {
    try {
      this.dayjs = require('dayjs');
    } catch {
      throw new Error('dayjs is not installed. Please install it: npm install dayjs');
    }
  }

  parse(value: string | Date | number | unknown, onError?: (error: Error) => void): Date | null {
    if (!value) return null;

    try {
      if (value instanceof Date) {
        const dayjsDate = this.dayjs(value);
        if (!dayjsDate.isValid()) {
          onError?.(new Error(`Invalid Date object: ${value}`));
          return null;
        }
        return new Date(value.getTime());
      }

      const parsed = this.dayjs(value);
      if (!parsed.isValid()) {
        onError?.(new Error(`Invalid date value: ${String(value)}`));
        return null;
      }
      return parsed.toDate() as Date;
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
      return null;
    }
  }

  format(date: Date, formatStr: string = 'MMM DD, YYYY', locale?: string): string {
    if (!date) return '';

    try {
      const dayjsDate = this.dayjs(date);
      if (!dayjsDate.isValid()) return '';

      if (locale && locale.length > 0) {
        try {
          const parts = locale.split('-');
          const firstPart = parts[0];
          if (firstPart && firstPart.length > 0) {
            const localeCode = firstPart.toLowerCase();
            require(`dayjs/locale/${localeCode}`);
            return dayjsDate.locale(localeCode).format(formatStr) as string;
          }
          return dayjsDate.format(formatStr) as string;
        } catch {
          return dayjsDate.format(formatStr) as string;
        }
      }

      return dayjsDate.format(formatStr) as string;
    } catch {
      return '';
    }
  }

  isValid(value: string | Date | number | unknown): boolean {
    return this.dayjs(value).isValid() as boolean;
  }

  startOfDay(date: Date): Date {
    return this.dayjs(date).startOf('day').toDate() as Date;
  }

  endOfDay(date: Date): Date {
    return this.dayjs(date).endOf('day').toDate() as Date;
  }

  addMonths(date: Date, months: number): Date {
    return this.dayjs(date).add(months, 'month').toDate() as Date;
  }

  addDays(date: Date, days: number): Date {
    return this.dayjs(date).add(days, 'day').toDate() as Date;
  }

  isSameDay(date1: Date | null, date2: Date | null): boolean {
    if (!date1 || !date2) return false;
    return this.dayjs(date1).isSame(this.dayjs(date2), 'day') as boolean;
  }
}
