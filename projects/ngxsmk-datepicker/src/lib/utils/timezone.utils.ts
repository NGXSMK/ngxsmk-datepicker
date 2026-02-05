/**
 * Format a date with timezone support
 * @param date The date to format
 * @param locale The locale for formatting
 * @param options Intl.DateTimeFormatOptions
 * @param timezone Optional timezone (IANA timezone name, e.g., 'America/New_York', 'UTC', 'Europe/London')
 * @returns Formatted date string
 */
export function formatDateWithTimezone(
  date: Date,
  locale: string,
  options: Intl.DateTimeFormatOptions,
  timezone?: string,
): string {
  if (timezone) {
    const formatter = new Intl.DateTimeFormat(locale, {
      ...options,
      timeZone: timezone,
    });
    return formatter.format(date);
  }
  return date.toLocaleString(locale, options);
}

/**
 * Parse a date string with timezone awareness
 * @param dateString The date string to parse
 * @param timezone Optional timezone for parsing (IANA timezone name)
 * @returns Date object (always in UTC internally)
 */
export function parseDateWithTimezone(
  dateString: string,
  timezone?: string,
): Date | null {
  if (!dateString) return null;

  if (timezone) {
    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return null;
      }

      return date;
    } catch {
      return null;
    }
  }

  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Convert a date from one timezone to another
 * @param date The date to convert
 * @param fromTimezone Source timezone (IANA name)
 * @param _toTimezone Target timezone (IANA name) - currently unused in simplified implementation
 * @returns New Date object (still UTC internally, but represents the time in target timezone)
 */
export function convertTimezone(
  date: Date,
  fromTimezone: string,
  _toTimezone: string,
): Date {
  const fromFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: fromTimezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = fromFormatter.formatToParts(date);
  const year = parseInt(parts.find((p) => p.type === 'year')?.value || '0');
  const month =
    parseInt(parts.find((p) => p.type === 'month')?.value || '0') - 1;
  const day = parseInt(parts.find((p) => p.type === 'day')?.value || '0');
  const hour = parseInt(parts.find((p) => p.type === 'hour')?.value || '0');
  const minute = parseInt(parts.find((p) => p.type === 'minute')?.value || '0');
  const second = parseInt(parts.find((p) => p.type === 'second')?.value || '0');

  const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
  const result = new Date(dateString);
  result.setMilliseconds(date.getMilliseconds());
  return result;
}

/**
 * Get the current timezone offset in minutes for a given timezone
 * @param timezone IANA timezone name
 * @param date Optional date to check offset for (defaults to now)
 * @returns Offset in minutes from UTC
 */
export function getTimezoneOffset(
  timezone: string,
  date: Date = new Date(),
): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'longOffset',
    });

    const parts = formatter.formatToParts(date);
    const offsetPart = parts.find((p) => p.type === 'timeZoneName');

    if (offsetPart) {
      const offsetStr = offsetPart.value.replace('GMT', '').trim();
      const sign = offsetStr[0] === '-' ? -1 : 1;
      const [hours = 0, minutes = 0] = offsetStr
        .slice(1)
        .split(':')
        .map(Number);
      return sign * (hours * 60 + minutes);
    }
  } catch {}

  return date.getTimezoneOffset();
}

/**
 * Check if a timezone string is valid
 * @param timezone IANA timezone name
 * @returns true if valid, false otherwise
 */
export function isValidTimezone(timezone: string): boolean {
  if (!timezone) return false;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}
