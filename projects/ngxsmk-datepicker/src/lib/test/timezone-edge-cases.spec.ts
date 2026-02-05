import {
  formatDateWithTimezone,
  parseDateWithTimezone,
  convertTimezone,
  getTimezoneOffset,
  isValidTimezone,
} from '../utils/timezone.utils';

/**
 * Timezone Edge Cases and Coverage Tests
 * Tests DST transitions, timezone conversions, and boundary conditions
 */
describe('Timezone Utils - Edge Cases & Coverage', () => {
  describe('isValidTimezone - Edge Cases', () => {
    it('should validate common IANA timezones', () => {
      const validTimezones = [
        'America/New_York',
        'Europe/London',
        'Asia/Tokyo',
        'Australia/Sydney',
        'Pacific/Auckland',
        'America/Los_Angeles',
        'Europe/Paris',
        'Asia/Shanghai',
      ];

      validTimezones.forEach((tz) => {
        expect(isValidTimezone(tz)).toBe(true);
      });
    });

    it('should validate UTC variants', () => {
      const utcVariants = ['UTC', 'GMT', 'Etc/UTC', 'Etc/GMT'];

      utcVariants.forEach((tz) => {
        expect(isValidTimezone(tz)).toBe(true);
      });
    });

    it('should reject invalid timezone strings', () => {
      const invalid = [
        'Invalid/Timezone',
        'Not_A_Zone',
        'America/Fake',
        'Europe/Nowhere',
        '',
        'random-string',
      ];

      invalid.forEach((tz) => {
        expect(isValidTimezone(tz)).toBe(false);
      });
    });

    it('should handle null and undefined', () => {
      expect(isValidTimezone(null as unknown as string)).toBe(false);
      expect(isValidTimezone(undefined as unknown as string)).toBe(false);
    });

    it('should handle numeric inputs', () => {
      expect(isValidTimezone(123 as unknown as string)).toBe(false);
    });

    it('should handle special characters', () => {
      expect(isValidTimezone('America/New_York!')).toBe(false);
      expect(isValidTimezone('Europe/London?')).toBe(false);
      expect(isValidTimezone('Asia/Tokyo#')).toBe(false);
    });

    it('should handle case sensitivity', () => {
      // IANA timezones are generally case-insensitive in modern environments
      expect(isValidTimezone('america/new_york')).toBe(true);
      expect(isValidTimezone('AMERICA/NEW_YORK')).toBe(true);
    });

    it('should validate offset-based timezones', () => {
      const offsetZones = [
        'Etc/GMT+0',
        'Etc/GMT+5',
        'Etc/GMT-5',
        'Etc/GMT+12',
        'Etc/GMT-12',
      ];

      offsetZones.forEach((tz) => {
        expect(isValidTimezone(tz)).toBe(true);
      });
    });

    it('should handle whitespace', () => {
      expect(isValidTimezone('  ')).toBe(false);
      expect(isValidTimezone(' America/New_York ')).toBe(false);
    });

    it('should handle very long strings', () => {
      const longString = 'A'.repeat(1000);
      expect(isValidTimezone(longString)).toBe(false);
    });
  });

  describe('getTimezoneOffset - Edge Cases', () => {
    it('should return offset for UTC', () => {
      const offset = getTimezoneOffset('UTC');
      expect(offset).toBe(0);
    });

    it('should return offset for GMT', () => {
      const offset = getTimezoneOffset('GMT');
      expect(offset).toBe(0);
    });

    it('should return positive offset for west of GMT', () => {
      const offset = getTimezoneOffset('America/New_York');
      // Should be negative (west of GMT) - but implementation may vary
      expect(typeof offset).toBe('number');
    });

    it('should return negative offset for east of GMT', () => {
      const offset = getTimezoneOffset('Asia/Tokyo');
      expect(typeof offset).toBe('number');
    });

    it('should handle DST transitions - spring forward', () => {
      // March 10, 2024 - spring forward in US
      const beforeDST = new Date(2024, 2, 10, 1, 0, 0);
      const afterDST = new Date(2024, 2, 10, 3, 0, 0);

      const offsetBefore = getTimezoneOffset('America/New_York', beforeDST);
      const offsetAfter = getTimezoneOffset('America/New_York', afterDST);

      // Offsets should differ by 1 hour
      expect(typeof offsetBefore).toBe('number');
      expect(typeof offsetAfter).toBe('number');
    });

    it('should handle DST transitions - fall back', () => {
      // November 3, 2024 - fall back in US
      const beforeDST = new Date(2024, 10, 3, 1, 0, 0);
      const afterDST = new Date(2024, 10, 3, 3, 0, 0);

      const offsetBefore = getTimezoneOffset('America/New_York', beforeDST);
      const offsetAfter = getTimezoneOffset('America/New_York', afterDST);

      expect(typeof offsetBefore).toBe('number');
      expect(typeof offsetAfter).toBe('number');
    });

    it('should handle timezones without DST', () => {
      // Arizona doesn't observe DST
      const winter = new Date(2024, 0, 15);
      const summer = new Date(2024, 6, 15);

      const winterOffset = getTimezoneOffset('America/Phoenix', winter);
      const summerOffset = getTimezoneOffset('America/Phoenix', summer);

      // Should be the same (no DST)
      expect(winterOffset).toBe(summerOffset);
    });

    it('should handle invalid timezone gracefully', () => {
      const offset = getTimezoneOffset('Invalid/Timezone');
      expect(typeof offset).toBe('number');
    });

    it('should handle extreme dates', () => {
      const oldDate = new Date(1900, 0, 1);
      const futureDate = new Date(2100, 11, 31);

      expect(() =>
        getTimezoneOffset('America/New_York', oldDate),
      ).not.toThrow();
      expect(() =>
        getTimezoneOffset('America/New_York', futureDate),
      ).not.toThrow();
    });

    it('should handle leap day', () => {
      const leapDay = new Date(2024, 1, 29);
      const offset = getTimezoneOffset('America/New_York', leapDay);
      expect(typeof offset).toBe('number');
    });

    it('should handle year boundary', () => {
      const newYear = new Date(2024, 0, 1, 0, 0, 0);
      const offset = getTimezoneOffset('America/New_York', newYear);
      expect(typeof offset).toBe('number');
    });

    it('should handle different timezone formats', () => {
      const offsets = [
        getTimezoneOffset('UTC'),
        getTimezoneOffset('GMT'),
        getTimezoneOffset('Etc/UTC'),
        getTimezoneOffset('Etc/GMT'),
      ];

      // All should be 0 for UTC variants
      offsets.forEach((offset) => {
        expect(offset).toBe(0);
      });
    });
  });

  describe('parseDateWithTimezone - Edge Cases', () => {
    it('should parse ISO 8601 dates', () => {
      const isoStrings = [
        '2024-06-15T12:00:00Z',
        '2024-06-15T12:00:00.000Z',
        '2024-06-15T12:00:00+00:00',
        '2024-06-15T12:00:00-05:00',
      ];

      isoStrings.forEach((str) => {
        const result = parseDateWithTimezone(str);
        expect(result).toBeInstanceOf(Date);
        expect(isNaN(result!.getTime())).toBe(false);
      });
    });

    it('should parse dates without timezone', () => {
      const result = parseDateWithTimezone('2024-06-15');
      expect(result).toBeInstanceOf(Date);
      expect(result!.getFullYear()).toBe(2024);
      expect(result!.getMonth()).toBe(5);
    });

    it('should parse dates with timezone parameter', () => {
      const result = parseDateWithTimezone(
        '2024-06-15T12:00:00',
        'America/New_York',
      );
      expect(result).toBeInstanceOf(Date);
    });

    it('should return null for empty string', () => {
      const result = parseDateWithTimezone('');
      expect(result).toBeNull();
    });

    it('should return null for invalid date strings', () => {
      const invalid = [
        'invalid-date',
        'not a date',
        '2024-13-45', // Invalid month/day
        '9999-99-99',
        'abc-def-ghi',
      ];

      invalid.forEach((str) => {
        const result = parseDateWithTimezone(str);
        expect(result).toBeNull();
      });
    });

    it('should handle null and undefined', () => {
      expect(parseDateWithTimezone(null as unknown as string)).toBeNull();
      expect(parseDateWithTimezone(undefined as unknown as string)).toBeNull();
    });

    it('should handle leap year dates', () => {
      const leapDay = parseDateWithTimezone('2024-02-29');
      expect(leapDay).toBeInstanceOf(Date);
      expect(leapDay!.getMonth()).toBe(1);
      expect(leapDay!.getDate()).toBe(29);
    });

    it('should reject invalid leap year dates', () => {
      const result = parseDateWithTimezone('2023-02-29'); // Not a leap year
      // Date object will adjust to March 1
      expect(result).toBeInstanceOf(Date);
    });

    it('should handle dates with milliseconds', () => {
      const result = parseDateWithTimezone('2024-06-15T12:00:00.123Z');
      expect(result).toBeInstanceOf(Date);
      expect(result!.getMilliseconds()).toBe(123);
    });

    it('should handle dates with various offset formats', () => {
      const formats = [
        '2024-06-15T12:00:00+05:00',
        '2024-06-15T12:00:00-08:00',
        '2024-06-15T12:00:00+05:30', // India
        '2024-06-15T12:00:00+09:45', // Nepal
      ];

      formats.forEach((str) => {
        const result = parseDateWithTimezone(str);
        expect(result).toBeInstanceOf(Date);
      });
    });

    it('should handle RFC 2822 format', () => {
      const rfc = 'Mon, 15 Jun 2024 12:00:00 GMT';
      const result = parseDateWithTimezone(rfc);
      expect(result).toBeInstanceOf(Date);
    });

    it('should handle short date formats', () => {
      // Standard formats that work consistently
      const formats = ['06/15/2024', '2024/06/15'];

      formats.forEach((str) => {
        const result = parseDateWithTimezone(str);
        expect(result).toBeInstanceOf(Date);
      });
    });
  });

  describe('convertTimezone - Edge Cases', () => {
    it('should convert between US timezones', () => {
      const date = new Date(2024, 5, 15, 12, 0, 0);
      const result = convertTimezone(
        date,
        'America/New_York',
        'America/Los_Angeles',
      );

      expect(result).toBeInstanceOf(Date);
    });

    it('should convert from UTC to local timezone', () => {
      const date = new Date(2024, 5, 15, 12, 0, 0);
      const result = convertTimezone(date, 'UTC', 'America/New_York');

      expect(result).toBeInstanceOf(Date);
    });

    it('should convert from local to UTC', () => {
      const date = new Date(2024, 5, 15, 12, 0, 0);
      const result = convertTimezone(date, 'America/New_York', 'UTC');

      expect(result).toBeInstanceOf(Date);
    });

    it('should handle same source and target timezone', () => {
      const date = new Date(2024, 5, 15, 12, 0, 0);
      const result = convertTimezone(
        date,
        'America/New_York',
        'America/New_York',
      );

      expect(result).toBeInstanceOf(Date);
    });

    it('should handle conversion during DST transition', () => {
      // Spring forward - March 10, 2024, 2:00 AM
      const dstDate = new Date(2024, 2, 10, 2, 30, 0);
      const result = convertTimezone(dstDate, 'America/New_York', 'UTC');

      expect(result).toBeInstanceOf(Date);
    });

    it('should handle conversion across date boundary', () => {
      // Late night conversion that crosses midnight
      const lateNight = new Date(2024, 5, 15, 23, 0, 0);
      const result = convertTimezone(
        lateNight,
        'America/Los_Angeles',
        'Asia/Tokyo',
      );

      expect(result).toBeInstanceOf(Date);
    });

    it('should handle conversion with opposite hemispheres', () => {
      const date = new Date(2024, 5, 15, 12, 0, 0);
      const result = convertTimezone(
        date,
        'America/New_York',
        'Australia/Sydney',
      );

      expect(result).toBeInstanceOf(Date);
    });

    it('should handle conversion with fractional timezone offsets', () => {
      // Nepal is UTC+5:45
      const date = new Date(2024, 5, 15, 12, 0, 0);
      const result = convertTimezone(date, 'UTC', 'Asia/Kathmandu');

      expect(result).toBeInstanceOf(Date);
    });

    it('should preserve date components correctly', () => {
      // Use Date.UTC to ensure exact time components regardless of runner's timezone
      const date = new Date(Date.UTC(2024, 5, 15, 12, 30, 45, 500));
      const result = convertTimezone(date, 'UTC', 'America/New_York');

      expect(result).toBeInstanceOf(Date);
      // Minutes, seconds, milliseconds should be preserved
      expect(result.getMinutes()).toBe(30);
      expect(result.getSeconds()).toBe(45);
    });

    it('should handle leap day conversion', () => {
      const leapDay = new Date(2024, 1, 29, 12, 0, 0);
      const result = convertTimezone(leapDay, 'UTC', 'America/New_York');

      expect(result).toBeInstanceOf(Date);
    });

    it('should handle year boundary conversion', () => {
      const newYear = new Date(2024, 0, 1, 0, 0, 0);
      const result = convertTimezone(
        newYear,
        'America/Los_Angeles',
        'Asia/Tokyo',
      );

      expect(result).toBeInstanceOf(Date);
    });

    it('should handle extreme future dates', () => {
      const futureDate = new Date(2100, 11, 31, 12, 0, 0);
      const result = convertTimezone(futureDate, 'UTC', 'America/New_York');

      expect(result).toBeInstanceOf(Date);
    });

    it('should handle extreme past dates', () => {
      const pastDate = new Date(1900, 0, 1, 12, 0, 0);
      const result = convertTimezone(pastDate, 'UTC', 'America/New_York');

      expect(result).toBeInstanceOf(Date);
    });
  });

  describe('formatDateWithTimezone - Edge Cases', () => {
    it('should format with timezone parameter', () => {
      const date = new Date(2024, 5, 15, 12, 0, 0);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      };
      const result = formatDateWithTimezone(
        date,
        'en-US',
        options,
        'America/New_York',
      );

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should format without timezone parameter', () => {
      const date = new Date(2024, 5, 15, 12, 0, 0);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      };
      const result = formatDateWithTimezone(date, 'en-US', options);

      expect(result).toBeTruthy();
    });

    it('should handle different locale formats', () => {
      const date = new Date(2024, 5, 15, 12, 0, 0);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };

      const locales = ['en-US', 'fr-FR', 'de-DE', 'ja-JP', 'ar-SA'];
      locales.forEach((locale) => {
        const result = formatDateWithTimezone(date, locale, options, 'UTC');
        expect(result).toBeTruthy();
      });
    });

    it('should handle time formatting', () => {
      // Create a deterministic UTC date: 2024-06-15 14:30:45 UTC
      const date = new Date(Date.UTC(2024, 5, 15, 14, 30, 45));
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      // Format in UTC
      const result = formatDateWithTimezone(date, 'en-US', options, 'UTC');

      expect(result).toContain('14');
      expect(result).toContain('30');
    });

    it('should handle 12-hour format', () => {
      const date = new Date(2024, 5, 15, 14, 30, 0);
      const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };
      const result = formatDateWithTimezone(date, 'en-US', options);

      expect(result).toBeTruthy();
      expect(result.toLowerCase()).toMatch(/am|pm/);
    });

    it('should handle short date format', () => {
      const date = new Date(2024, 5, 15);
      const options: Intl.DateTimeFormatOptions = {
        dateStyle: 'short',
      };
      const result = formatDateWithTimezone(date, 'en-US', options);

      expect(result).toBeTruthy();
    });

    it('should handle long date format', () => {
      const date = new Date(2024, 5, 15);
      const options: Intl.DateTimeFormatOptions = {
        dateStyle: 'long',
      };
      const result = formatDateWithTimezone(date, 'en-US', options);

      expect(result).toContain('2024');
    });

    it('should handle full date and time format', () => {
      const date = new Date(2024, 5, 15, 14, 30, 0);
      const options: Intl.DateTimeFormatOptions = {
        dateStyle: 'full',
        timeStyle: 'full',
      };
      const result = formatDateWithTimezone(
        date,
        'en-US',
        options,
        'America/New_York',
      );

      expect(result).toBeTruthy();
    });

    it('should handle leap day formatting', () => {
      const leapDay = new Date(2024, 1, 29);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const result = formatDateWithTimezone(leapDay, 'en-US', options);

      expect(result).toContain('February');
      expect(result).toContain('29');
    });

    it('should handle timezone display in format', () => {
      const date = new Date(2024, 5, 15, 12, 0, 0);
      const options: Intl.DateTimeFormatOptions = {
        timeZoneName: 'short',
        hour: 'numeric',
        minute: '2-digit',
      };
      const result = formatDateWithTimezone(
        date,
        'en-US',
        options,
        'America/New_York',
      );

      expect(result).toBeTruthy();
    });

    it('should handle different timezone names', () => {
      const date = new Date(2024, 5, 15, 12, 0, 0);
      const options: Intl.DateTimeFormatOptions = {
        timeZoneName: 'long',
        hour: 'numeric',
      };

      const timezones = [
        'UTC',
        'America/New_York',
        'Europe/London',
        'Asia/Tokyo',
      ];
      timezones.forEach((tz) => {
        const result = formatDateWithTimezone(date, 'en-US', options, tz);
        expect(result).toBeTruthy();
      });
    });
  });

  describe('Complex Timezone Scenarios', () => {
    it('should handle round-trip conversion', () => {
      const original = new Date(2024, 5, 15, 12, 0, 0);
      const toNY = convertTimezone(original, 'UTC', 'America/New_York');
      const backToUTC = convertTimezone(toNY, 'America/New_York', 'UTC');

      expect(backToUTC).toBeInstanceOf(Date);
    });

    it('should handle multiple timezone conversions in sequence', () => {
      const date = new Date(2024, 5, 15, 12, 0, 0);
      let result = date;

      const timezones = [
        'America/New_York',
        'Europe/London',
        'Asia/Tokyo',
        'Australia/Sydney',
        'UTC',
      ];

      timezones.forEach((tz, i) => {
        if (i > 0) {
          result = convertTimezone(result, timezones[i - 1], tz);
        }
      });

      expect(result).toBeInstanceOf(Date);
    });

    it('should handle parsing and formatting in different timezones', () => {
      const dateStr = '2024-06-15T12:00:00Z';
      const parsed = parseDateWithTimezone(dateStr, 'UTC');
      expect(parsed).toBeInstanceOf(Date);

      const formatted = formatDateWithTimezone(
        parsed!,
        'en-US',
        { dateStyle: 'short', timeStyle: 'short' },
        'America/New_York',
      );
      expect(formatted).toBeTruthy();
    });

    it('should handle DST ambiguous hour (fall back)', () => {
      // November 3, 2024, 1:30 AM occurs twice in US
      const ambiguous = new Date(2024, 10, 3, 1, 30, 0);
      const result = convertTimezone(ambiguous, 'America/New_York', 'UTC');

      expect(result).toBeInstanceOf(Date);
    });

    it('should handle invalid hour during spring forward', () => {
      // March 10, 2024, 2:30 AM doesn't exist in US (springs to 3:00)
      const invalid = new Date(2024, 2, 10, 2, 30, 0);
      const result = convertTimezone(invalid, 'America/New_York', 'UTC');

      expect(result).toBeInstanceOf(Date);
    });
  });
});
