import type { CalendarSystem } from '../services/locale-registry.service';

/**
 * Utilities for rendering dates in non-Gregorian calendar systems via
 * `Intl.DateTimeFormat`'s `-u-ca-` locale extension.
 *
 * The datepicker grid itself remains Gregorian; these helpers power the
 * `secondaryCalendar` feature that annotates each day cell with its date in
 * another calendar system (e.g. Hijri or Jalali), the same approach used by
 * Windows and Google Calendar.
 */

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(locale: string, calendar: CalendarSystem, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat | null {
  const key = `${locale}|${calendar}|${JSON.stringify(options)}`;
  const cached = formatterCache.get(key);
  if (cached) return cached;
  try {
    const formatter = new Intl.DateTimeFormat(locale, { ...options, calendar });
    formatterCache.set(key, formatter);
    return formatter;
  } catch {
    return null;
  }
}

/**
 * Day-of-month of `date` in the given calendar system, using the locale's
 * numbering system (e.g. `'20'` for 2026-07-11 in the Persian calendar).
 * Returns '' when the environment does not support the calendar.
 */
export function getSecondaryDayLabel(date: Date, calendar: CalendarSystem, locale: string = 'en-US'): string {
  const formatter = getFormatter(locale, calendar, { day: 'numeric' });
  if (!formatter) return '';
  try {
    return formatter.format(date);
  } catch {
    return '';
  }
}

/**
 * Full date of `date` in the given calendar system (e.g. `'Tir 20, 1405 AP'`).
 * Useful for tooltips and ARIA descriptions. Returns '' when unsupported.
 */
export function formatDateInCalendarSystem(date: Date, calendar: CalendarSystem, locale: string = 'en-US'): string {
  const formatter = getFormatter(locale, calendar, { year: 'numeric', month: 'long', day: 'numeric' });
  if (!formatter) return '';
  try {
    return formatter.format(date);
  } catch {
    return '';
  }
}
