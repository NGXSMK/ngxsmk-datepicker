/**
 * date-fns Adapter Implementation
 * 
 * To use this adapter, install date-fns:
 * npm install date-fns
 * 
 * Then provide it in your app config:
 * ```typescript
 * import { provideDatepickerConfig } from 'ngxsmk-datepicker';
 * import { DateFnsAdapter } from 'ngxsmk-datepicker/adapters/date-fns-adapter';
 * 
 * provideDatepickerConfig({
 *   dateAdapter: new DateFnsAdapter()
 * })
 * ```
 */

import { DateAdapter } from './date-adapter.interface';

declare const require: (module: string) => unknown;

export class DateFnsAdapter implements DateAdapter {
  private dateFns: Record<string, unknown>;

  constructor() {
    try {
      this.dateFns = require('date-fns');
    } catch {
      throw new Error('date-fns is not installed. Please install it: npm install date-fns');
    }
  }

  parse(value: string | Date | number | unknown): Date | null {
    if (!value) return null;
    if (value instanceof Date) {
      return this.dateFns.isValid(value) ? new Date(value.getTime()) : null;
    }
    if (typeof value === 'string') {
      const parsed = this.dateFns.parseISO(value) || this.dateFns.parse(value, 'yyyy-MM-dd', new Date());
      return this.dateFns.isValid(parsed) ? parsed : null;
    }
    return null;
  }

  format(date: Date, formatStr: string = 'MMM dd, yyyy', locale?: string): string {
    if (!date || !this.dateFns.isValid(date)) return '';
    
    try {
      const localeObj = locale && locale.length > 0 ? this.getDateFnsLocale(locale) : undefined;
      return this.dateFns.format(date, formatStr, { locale: localeObj });
    } catch {
      return this.dateFns.format(date, formatStr);
    }
  }

  isValid(value: string | Date | number | unknown): boolean {
    return this.dateFns.isValid(value);
  }

  startOfDay(date: Date): Date {
    return this.dateFns.startOfDay(date);
  }

  endOfDay(date: Date): Date {
    return this.dateFns.endOfDay(date);
  }

  addMonths(date: Date, months: number): Date {
    return this.dateFns.addMonths(date, months);
  }

  addDays(date: Date, days: number): Date {
    return this.dateFns.addDays(date, days);
  }

  isSameDay(date1: Date | null, date2: Date | null): boolean {
    if (!date1 || !date2) return false;
    return this.dateFns.isSameDay(date1, date2);
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

