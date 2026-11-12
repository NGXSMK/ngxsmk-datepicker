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
  timezone?: string
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

interface ZonedDateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
}

function getZonedParts(date: Date, timeZone: string): ZonedDateParts {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes): number =>
    parseInt(parts.find((p) => p.type === type)?.value || '0', 10);

  // Intl may emit hour "24" for midnight in some engines
  let hour = read('hour');
  if (hour === 24) hour = 0;

  return {
    year: read('year'),
    month: read('month') - 1,
    day: read('day'),
    hour,
    minute: read('minute'),
    second: read('second'),
    millisecond: date.getMilliseconds(),
  };
}

/**
 * Build a Date for the given wall-clock time as observed in `timeZone`.
 */
function wallTimeInTimezoneToUtc(parts: ZonedDateParts, timeZone: string): Date {
  const utcGuess = Date.UTC(
    parts.year,
    parts.month,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    parts.millisecond
  );

  // Refine once using the timezone offset at the guessed instant.
  const asInZone = getZonedParts(new Date(utcGuess), timeZone);
  const asInZoneAsUtc = Date.UTC(
    asInZone.year,
    asInZone.month,
    asInZone.day,
    asInZone.hour,
    asInZone.minute,
    asInZone.second,
    asInZone.millisecond
  );
  const offset = asInZoneAsUtc - utcGuess;
  return new Date(utcGuess - offset);
}

function parseWallClockString(dateString: string): ZonedDateParts | null {
  const match = dateString
    .trim()
    .match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?)?(?:Z|[+-]\d{2}:?\d{2})?$/);

  if (!match) return null;

  const [, year, month, day, hour, minute, second, millisecond] = match;
  if (!year || !month || !day) return null;

  return {
    year: parseInt(year, 10),
    month: parseInt(month, 10) - 1,
    day: parseInt(day, 10),
    hour: parseInt(hour || '0', 10),
    minute: parseInt(minute || '0', 10),
    second: parseInt(second || '0', 10),
    millisecond: parseInt((millisecond || '0').padEnd(3, '0'), 10),
  };
}

/**
 * Parse a date string with timezone awareness
 * @param dateString The date string to parse
 * @param timezone Optional timezone for parsing (IANA timezone name)
 * @returns Date object (UTC instant corresponding to the wall time in `timezone` when provided)
 */
export function parseDateWithTimezone(dateString: string, timezone?: string): Date | null {
  if (!dateString) return null;

  if (timezone) {
    try {
      const wall = parseWallClockString(dateString);
      if (wall) {
        const result = wallTimeInTimezoneToUtc(wall, timezone);
        return isNaN(result.getTime()) ? null : result;
      }

      // Fallback for free-form strings: parse then shift wall-clock into timezone.
      const parsed = new Date(dateString);
      if (isNaN(parsed.getTime())) return null;
      const localAsWall: ZonedDateParts = {
        year: parsed.getFullYear(),
        month: parsed.getMonth(),
        day: parsed.getDate(),
        hour: parsed.getHours(),
        minute: parsed.getMinutes(),
        second: parsed.getSeconds(),
        millisecond: parsed.getMilliseconds(),
      };
      return wallTimeInTimezoneToUtc(localAsWall, timezone);
    } catch {
      return null;
    }
  }

  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

function resolveTimezone(timezone: string | undefined | null, fallback: string): string {
  if (timezone && isValidTimezone(timezone)) {
    return timezone;
  }
  return fallback;
}

/**
 * Convert a date from one timezone to another by preserving wall-clock time.
 * @param date The date to convert
 * @param fromTimezone Source timezone (IANA name)
 * @param toTimezone Target timezone (IANA name). Empty/invalid falls back to the runtime local zone.
 * @returns New Date whose instant displays the same wall-clock in `toTimezone`
 */
export function convertTimezone(date: Date, fromTimezone: string, toTimezone: string): Date {
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const fromZone = resolveTimezone(fromTimezone, localZone);
  const toZone = resolveTimezone(toTimezone, localZone);
  const fromParts = getZonedParts(date, fromZone);
  return wallTimeInTimezoneToUtc(fromParts, toZone);
}

/**
 * Get the current timezone offset in minutes for a given timezone
 * @param timezone IANA timezone name
 * @param date Optional date to check offset for (defaults to now)
 * @returns Offset in minutes from UTC
 */
export function getTimezoneOffset(timezone: string, date: Date = new Date()): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'longOffset',
    });

    const parts = formatter.formatToParts(date);
    const offsetPart = parts.find((p) => p.type === 'timeZoneName');

    if (offsetPart) {
      const offsetStr = offsetPart.value.replace('GMT', '').trim();
      if (!offsetStr || offsetStr === 'GMT') return 0;
      const sign = offsetStr[0] === '-' ? -1 : 1;
      const [hours = 0, minutes = 0] = offsetStr.replace(/^[+-]/, '').split(':').map(Number);
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
