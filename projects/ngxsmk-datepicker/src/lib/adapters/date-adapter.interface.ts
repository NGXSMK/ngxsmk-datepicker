/**
 * Date Adapter Interface
 * 
 * Allows consumers to swap formatting/parsing logic with external date libraries
 * like date-fns, dayjs, or Luxon.
 */
export interface DateAdapter {
  /**
   * Parse a date from a string or value
   * @param value - The value to parse (string, Date, or library-specific type)
   * @param onError - Optional callback for error handling. Called when parsing fails.
   * @returns A Date object or null if parsing fails
   */
  parse(value: string | Date | number | unknown, onError?: (error: Error) => void): Date | null;

  /**
   * Format a date to a string
   * @param date - The date to format
   * @param format - Format string (library-specific)
   * @param locale - Locale string (e.g., 'en-US')
   * @returns Formatted date string
   */
  format(date: Date, format?: string, locale?: string): string;

  /**
   * Check if a value is a valid date
   * @param value - The value to check
   * @returns True if the value is a valid date
   */
  isValid(value: string | Date | number | unknown): boolean;

  /**
   * Get the start of day for a date
   * @param date - The date
   * @returns Date at start of day
   */
  startOfDay(date: Date): Date;

  /**
   * Get the end of day for a date
   * @param date - The date
   * @returns Date at end of day
   */
  endOfDay(date: Date): Date;

  /**
   * Add months to a date
   * @param date - The date
   * @param months - Number of months to add
   * @returns New date with months added
   */
  addMonths(date: Date, months: number): Date;

  /**
   * Add days to a date
   * @param date - The date
   * @param days - Number of days to add
   * @returns New date with days added
   */
  addDays(date: Date, days: number): Date;

  /**
   * Check if two dates are the same day
   * @param date1 - First date
   * @param date2 - Second date
   * @returns True if dates are the same day
   */
  isSameDay(date1: Date | null, date2: Date | null): boolean;
}

/**
 * Default Date Adapter using native JavaScript Date
 */
export class NativeDateAdapter implements DateAdapter {
  parse(value: string | Date | number | unknown, onError?: (error: Error) => void): Date | null {
    if (!value) return null;
    
    try {
      if (value instanceof Date) {
        if (isNaN(value.getTime())) {
          onError?.(new Error(`Invalid Date object: ${value}`));
          return null;
        }
        return new Date(value.getTime());
      }
      
      if (typeof value === 'string') {
        const parsed = new Date(value);
        if (isNaN(parsed.getTime())) {
          onError?.(new Error(`Invalid date string: "${value}"`));
          return null;
        }
        return parsed;
      }
      
      if (typeof value === 'number') {
        const parsed = new Date(value);
        if (isNaN(parsed.getTime())) {
          onError?.(new Error(`Invalid date timestamp: ${value}`));
          return null;
        }
        return parsed;
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
      return null;
    }
    
    return null;
  }

  format(date: Date, _format?: string, locale?: string): string {
    if (!date || isNaN(date.getTime())) return '';
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    };
    
    return new Intl.DateTimeFormat(locale || 'en-US', options).format(date);
  }

  isValid(value: string | Date | number | unknown): boolean {
    if (!value) return false;
    if (value instanceof Date) {
      return !isNaN(value.getTime());
    }
    return false;
  }

  startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  }

  endOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  }

  addMonths(date: Date, months: number): Date {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + months);
    return newDate;
  }

  addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
  }

  isSameDay(date1: Date | null, date2: Date | null): boolean {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}

