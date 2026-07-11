export function getStartOfDay(d: Date): Date {
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function getEndOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

export function addMonths(d: Date, months: number): Date {
  const newDate = new Date(d);
  const originalDay = d.getDate();
  newDate.setMonth(d.getMonth() + months);
  // Check for overflow (e.g., Jan 31 + 1 month -> March 3).
  // If the date changed, it means the target month didn't have enough days.
  if (newDate.getDate() !== originalDay) {
    // Set to the last day of the previous month (which is the target month)
    newDate.setDate(0);
  }
  return newDate;
}

export function subtractDays(d: Date, days: number): Date {
  const newDate = new Date(d);
  newDate.setDate(d.getDate() - days);
  return newDate;
}

export function getStartOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function getEndOfMonth(d: Date): Date {
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return getEndOfDay(lastDay);
}

/**
 * Returns the ISO 8601 week number (1-53) for the given date.
 *
 * ISO weeks start on Monday; week 1 is the week containing the year's first
 * Thursday, so early January can belong to week 52/53 of the previous year
 * and late December to week 1 of the next.
 */
export function getISOWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Shift to the Thursday of this ISO week (ISO day: Mon=1..Sun=7)
  const isoDay = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - isoDay);
  const yearStart = Date.UTC(date.getUTCFullYear(), 0, 1);
  return Math.ceil(((date.getTime() - yearStart) / 86400000 + 1) / 7);
}

export function getStartOfWeek(d: Date, firstDayOfWeek: number = 0): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day < firstDayOfWeek ? 7 : 0) + day - firstDayOfWeek;
  date.setDate(date.getDate() - diff);
  return getStartOfDay(date);
}

export function getEndOfWeek(d: Date, firstDayOfWeek: number = 0): Date {
  const startOfWeek = getStartOfWeek(d, firstDayOfWeek);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  return getEndOfDay(endOfWeek);
}

export function getStartOfQuarter(d: Date): Date {
  const quarter = Math.floor(d.getMonth() / 3);
  return new Date(d.getFullYear(), quarter * 3, 1);
}

export function getEndOfQuarter(d: Date): Date {
  const quarter = Math.floor(d.getMonth() / 3);
  return new Date(d.getFullYear(), (quarter + 1) * 3, 0);
}

export function getStartOfYear(d: Date): Date {
  return new Date(d.getFullYear(), 0, 1);
}

export function getEndOfYear(d: Date): Date {
  return new Date(d.getFullYear(), 11, 31);
}

export function isSameDay(d1: Date | null, d2: Date | null): boolean {
  if (!d1 || !d2) return false;
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

export function normalizeDate(date: DateInput | null): Date | null {
  if (date === null || date === undefined || date === '') return null;
  const d =
    date instanceof Date
      ? new Date(date.getTime())
      : new Date(
          (date as { toDate?: () => Date }).toDate
            ? (date as { toDate: () => Date }).toDate()
            : (date as Date | string | number)
        );
  if (isNaN(d.getTime())) return null;
  return d;
}

export type DateInput = Date | string | { toDate: () => Date; _isAMomentObject?: boolean; $d?: Date };
