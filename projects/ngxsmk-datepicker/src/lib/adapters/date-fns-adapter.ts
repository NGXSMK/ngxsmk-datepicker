/**
 * date-fns Adapter Implementation
 *
 * To use this adapter, install date-fns:
 * npm install date-fns
 *
 * Then provide it in your app config:
 * ```typescript
 * import { provideDatepickerConfig } from 'ngxsmk-datepicker';
 * import { DateFnsAdapter } from 'ngxsmk-datepicker/adapters';
 *
 * provideDatepickerConfig({
 *   dateAdapter: new DateFnsAdapter()
 * })
 * ```
 */

import { DateAdapter } from './date-adapter.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const require: (module: string) => any;

export class DateFnsAdapter implements DateAdapter {
  // Optional peer dep — typed loosely for dynamic require.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private dateFns: any;

  constructor() {
    try {
      this.dateFns = require('date-fns');
    } catch {
      throw new Error('date-fns is not installed. Please install it: npm install date-fns');
    }
  }

  parse(value: string | Date | number | unknown, onError?: (error: Error) => void): Date | null {
    if (!value) return null;

    try {
      if (value instanceof Date) {
        if (!this.dateFns.isValid(value)) {
          onError?.(new Error(`Invalid Date object: ${value}`));
          return null;
        }
        return new Date(value.getTime());
      }

      if (typeof value === 'string') {
        const parsed = this.dateFns.parseISO(value) || this.dateFns.parse(value, 'yyyy-MM-dd', new Date());
        if (!this.dateFns.isValid(parsed)) {
          onError?.(new Error(`Invalid date string: "${value}"`));
          return null;
        }
        return parsed as Date;
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
      return null;
    }

    return null;
  }

  format(date: Date, formatStr: string = 'MMM dd, yyyy', locale?: string): string {
    if (!date || !this.dateFns.isValid(date)) return '';

    try {
      const localeObj = locale && locale.length > 0 ? this.getDateFnsLocale(locale) : undefined;
      return this.dateFns.format(date, formatStr, { locale: localeObj }) as string;
    } catch {
      return this.dateFns.format(date, formatStr) as string;
    }
  }

  isValid(value: string | Date | number | unknown): boolean {
    return this.dateFns.isValid(value) as boolean;
  }

  startOfDay(date: Date): Date {
    return this.dateFns.startOfDay(date) as Date;
  }

  endOfDay(date: Date): Date {
    return this.dateFns.endOfDay(date) as Date;
  }

  addMonths(date: Date, months: number): Date {
    return this.dateFns.addMonths(date, months) as Date;
  }

  addDays(date: Date, days: number): Date {
    return this.dateFns.addDays(date, days) as Date;
  }

  isSameDay(date1: Date | null, date2: Date | null): boolean {
    if (!date1 || !date2) return false;
    return this.dateFns.isSameDay(date1, date2) as boolean;
  }

  private getDateFnsLocale(locale: string): unknown {
    if (!locale || locale.length === 0) {
      return undefined;
    }
    try {
      const parts = locale.split('-');
      const firstPart = parts[0];
      if (!firstPart || firstPart.length === 0) {
        return undefined;
      }
      const localeCode = firstPart.toLowerCase();
      return require(`date-fns/locale/${localeCode}/index.js`).default;
    } catch {
      return undefined;
    }
  }
}
