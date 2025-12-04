/**
 * Day.js Adapter Implementation
 * 
 * To use this adapter, install dayjs:
 * npm install dayjs
 * 
 * Then provide it in your app config:
 * ```typescript
 * import { provideDatepickerConfig } from 'ngxsmk-datepicker';
 * import { DayjsAdapter } from 'ngxsmk-datepicker/adapters/dayjs-adapter';
 * 
 * provideDatepickerConfig({
 *   dateAdapter: new DayjsAdapter()
 * })
 * ```
 */

import { DateAdapter } from './date-adapter.interface';

declare const require: (module: string) => unknown;

export class DayjsAdapter implements DateAdapter {
  private dayjs: Record<string, unknown>;

  constructor() {
    try {
      this.dayjs = require('dayjs');
    } catch {
      throw new Error('dayjs is not installed. Please install it: npm install dayjs');
    }
  }

  parse(value: string | Date | number | unknown): Date | null {
    if (!value) return null;
    if (value instanceof Date) {
      return this.dayjs(value).isValid() ? new Date(value.getTime()) : null;
    }
    const parsed = this.dayjs(value);
    return parsed.isValid() ? parsed.toDate() : null;
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
            return dayjsDate.locale(localeCode).format(formatStr);
          }
          return dayjsDate.format(formatStr);
        } catch {
          return dayjsDate.format(formatStr);
        }
      }
      
      return dayjsDate.format(formatStr);
    } catch {
      return '';
    }
  }

  isValid(value: string | Date | number | unknown): boolean {
    return this.dayjs(value).isValid();
  }

  startOfDay(date: Date): Date {
    return this.dayjs(date).startOf('day').toDate();
  }

  endOfDay(date: Date): Date {
    return this.dayjs(date).endOf('day').toDate();
  }

  addMonths(date: Date, months: number): Date {
    return this.dayjs(date).add(months, 'month').toDate();
  }

  addDays(date: Date, days: number): Date {
    return this.dayjs(date).add(days, 'day').toDate();
  }

  isSameDay(date1: Date | null, date2: Date | null): boolean {
    if (!date1 || !date2) return false;
    return this.dayjs(date1).isSame(this.dayjs(date2), 'day');
  }
}

