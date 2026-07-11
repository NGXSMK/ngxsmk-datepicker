/**
 * Service for custom date formatting patterns.
 * Supports custom patterns beyond standard Angular DatePipe formats.
 *
 * @remarks
 * Supports the following pattern tokens:
 * - YYYY: 4-digit year (e.g., 2025)
 * - YY: 2-digit year (e.g., 25)
 * - MMMM: Full month name (e.g., January)
 * - MMM: Abbreviated month name (e.g., Jan)
 * - MM: 2-digit month (e.g., 01)
 * - M: 1 or 2-digit month (e.g., 1)
 * - DDDD: Full weekday name (e.g., Monday)
 * - DDD: Abbreviated weekday name (e.g., Mon)
 * - DD: 2-digit day (e.g., 05)
 * - D: 1 or 2-digit day (e.g., 5)
 * - HH: 2-digit hour (24-hour format, e.g., 14)
 * - H: 1 or 2-digit hour (24-hour format, e.g., 14)
 * - hh: 2-digit hour (12-hour format, e.g., 02)
 * - h: 1 or 2-digit hour (12-hour format, e.g., 2)
 * - mm: 2-digit minutes (e.g., 05)
 * - m: 1 or 2-digit minutes (e.g., 5)
 * - ss: 2-digit seconds (e.g., 09)
 * - s: 1 or 2-digit seconds (e.g., 9)
 * - A/a: AM/PM or am/pm
 */
export class CustomDateFormatService {
  private readonly monthNames: Map<string, string[]> = new Map();
  private readonly weekdayNames: Map<string, string[]> = new Map();

  constructor(private locale: string = 'en-US') {
    this.initializeLocaleData();
  }

  /**
   * Set the locale for formatting
   */
  setLocale(locale: string): void {
    this.locale = locale;
    // Clear cached data so it's regenerated with new locale
    this.monthNames.clear();
    this.weekdayNames.clear();
    this.initializeLocaleData();
  }

  /**
   * Format a date using a custom pattern
   *
   * @param date - The date to format
   * @param pattern - The custom format pattern
   * @returns Formatted date string
   */
  format(date: Date, pattern: string): string {
    if (!date) {
      return '';
    }

    const year = date.getFullYear();
    const month = date.getMonth();
    const dayOfMonth = date.getDate();
    const dayOfWeek = date.getDay();
    const hours24 = date.getHours();
    const hours12 = hours24 % 12 || 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const isAM = hours24 < 12;

    const monthNames = this.getMonthNames();
    const weekdayNames = this.getWeekdayNames();

    const replacements: Record<string, string> = {
      YYYY: year.toString(),
      YY: year.toString().slice(-2),
      MMMM: monthNames.full[month] || '',
      MMM: monthNames.abbreviated[month] || '',
      MM: (month + 1).toString().padStart(2, '0'),
      M: (month + 1).toString(),
      DDDD: weekdayNames.full[dayOfWeek] || '',
      DDD: weekdayNames.abbreviated[dayOfWeek] || '',
      DD: dayOfMonth.toString().padStart(2, '0'),
      D: dayOfMonth.toString(),
      HH: hours24.toString().padStart(2, '0'),
      H: hours24.toString(),
      hh: hours12.toString().padStart(2, '0'),
      h: hours12.toString(),
      mm: minutes.toString().padStart(2, '0'),
      m: minutes.toString(),
      ss: seconds.toString().padStart(2, '0'),
      s: seconds.toString(),
      A: isAM ? 'AM' : 'PM',
      a: isAM ? 'am' : 'pm',
    };

    const regex = /YYYY|YY|MMMM|MMM|MM|M|DDDD|DDD|DD|D|HH|H|hh|h|mm|m|ss|s|[Aa]/g;
    return pattern.replaceAll(regex, (match) => replacements[match] || match);
  }

  /**
   * Parse a formatted date string back to a Date object
   * Note: This is a best-effort implementation and may not work for all patterns
   *
   * @param dateString - The date string to parse
   * @param pattern - The format pattern used
   * @returns Parsed Date object, or null if parsing fails
   */
  parse(dateString: string, _pattern: string): Date | null {
    try {
      // For now, use basic date parsing as full pattern parsing is complex
      // This can be enhanced in the future to support full pattern parsing
      const date = new Date(dateString);
      return Number.isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  }

  private getMonthNames(): { full: string[]; abbreviated: string[] } {
    if (!this.monthNames.has(this.locale)) {
      const months = Array.from({ length: 12 }).map((_, i) => {
        const date = new Date(2000, i, 1);
        return {
          full: date.toLocaleDateString(this.locale, { month: 'long' }),
          abbreviated: date.toLocaleDateString(this.locale, { month: 'short' }),
        };
      });

      this.monthNames.set(this.locale, [...months.map((m) => m.full), ...months.map((m) => m.abbreviated)]);
    }

    const monthData = this.monthNames.get(this.locale) || [];
    return {
      full: monthData.slice(0, 12),
      abbreviated: monthData.slice(12),
    };
  }

  private initializeLocaleData(): void {
    // Ensure month and weekday names are cached
    this.getMonthNames();
    this.getWeekdayNames();
  }

  private getWeekdayNames(): { full: string[]; abbreviated: string[] } {
    if (!this.weekdayNames.has(this.locale)) {
      const weekdays = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(2000, 0, 2 + i); // Jan 2, 2000 was a Sunday
        return {
          full: date.toLocaleDateString(this.locale, { weekday: 'long' }),
          abbreviated: date.toLocaleDateString(this.locale, {
            weekday: 'short',
          }),
        };
      });

      this.weekdayNames.set(this.locale, [...weekdays.map((w) => w.full), ...weekdays.map((w) => w.abbreviated)]);
    }

    const weekdayData = this.weekdayNames.get(this.locale) || [];
    return {
      full: weekdayData.slice(0, 7),
      abbreviated: weekdayData.slice(7),
    };
  }
}
