import {
  getStartOfDay,
  getEndOfDay,
  addMonths,
  subtractDays,
  getStartOfMonth,
  getEndOfMonth,
  isSameDay,
  normalizeDate,
  type DateInput,
} from '../utils/date.utils';

/**
 * Edge Cases and Coverage Tests for Date Utilities
 * Tests boundary conditions, edge cases, and error handling
 */
describe('Date Utils - Edge Cases & Coverage', () => {
  describe('getStartOfDay - Edge Cases', () => {
    it('should handle leap year dates', () => {
      const leapDay = new Date(2024, 1, 29, 15, 30, 45); // Feb 29, 2024
      const result = getStartOfDay(leapDay);

      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(1);
      expect(result.getDate()).toBe(29);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    it('should handle year boundary dates', () => {
      const newYear = new Date(2024, 0, 1, 23, 59, 59); // Jan 1, 2024
      const result = getStartOfDay(newYear);

      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(1);
      expect(result.getHours()).toBe(0);
    });

    it('should handle DST transition dates', () => {
      // Spring forward (US): March 10, 2024, 2:00 AM → 3:00 AM
      const dstDate = new Date(2024, 2, 10, 15, 30);
      const result = getStartOfDay(dstDate);

      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
    });

    it('should handle dates with extreme time values', () => {
      const extremeTime = new Date(2024, 5, 15, 23, 59, 59, 999);
      const result = getStartOfDay(extremeTime);

      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    it('should handle dates at epoch boundary', () => {
      const epochDate = new Date(1970, 0, 1, 12, 0, 0);
      const result = getStartOfDay(epochDate);

      expect(result.getFullYear()).toBe(1970);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(1);
      expect(result.getHours()).toBe(0);
    });
  });

  describe('getEndOfDay - Edge Cases', () => {
    it('should handle leap year dates', () => {
      const leapDay = new Date(2024, 1, 29, 0, 0, 0);
      const result = getEndOfDay(leapDay);

      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(1);
      expect(result.getDate()).toBe(29);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });

    it('should handle month-end dates', () => {
      // January 31
      const monthEnd = new Date(2024, 0, 31, 12, 0, 0);
      const result = getEndOfDay(monthEnd);

      expect(result.getDate()).toBe(31);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });

    it('should handle year-end dates', () => {
      const yearEnd = new Date(2024, 11, 31, 0, 0, 0);
      const result = getEndOfDay(yearEnd);

      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(11);
      expect(result.getDate()).toBe(31);
      expect(result.getHours()).toBe(23);
    });
  });

  describe('addMonths - Edge Cases', () => {
    it('should handle adding months across year boundary', () => {
      const nov2024 = new Date(2024, 10, 15); // November 2024
      const result = addMonths(nov2024, 3); // Should be February 2025

      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(1); // February
      expect(result.getDate()).toBe(15);
    });

    it('should handle adding negative months', () => {
      const march2024 = new Date(2024, 2, 15);
      const result = addMonths(march2024, -5); // Should be October 2023

      expect(result.getFullYear()).toBe(2023);
      expect(result.getMonth()).toBe(9); // October
    });

    it('should handle month-end overflow (31 days → 30 days)', () => {
      const jan31 = new Date(2024, 0, 31); // January 31
      const result = addMonths(jan31, 1); // February doesn't have 31 days

      expect(result.getMonth()).toBe(1); // February
      // Date should adjust to last day of February
      expect(result.getDate()).toBeLessThanOrEqual(29);
    });

    it('should handle leap year transitions', () => {
      const feb29_2024 = new Date(2024, 1, 29); // Leap day
      const result = addMonths(feb29_2024, 12); // February 2025 (not leap year)

      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(1);
      // Should adjust to Feb 28 in non-leap year
      expect(result.getDate()).toBe(28);
    });

    it('should handle adding 0 months', () => {
      const date = new Date(2024, 5, 15);
      const result = addMonths(date, 0);

      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(15);
    });

    it('should handle adding large number of months', () => {
      const date = new Date(2024, 0, 1);
      const result = addMonths(date, 120); // 10 years

      expect(result.getFullYear()).toBe(2034);
      expect(result.getMonth()).toBe(0);
    });
  });

  describe('subtractDays - Edge Cases', () => {
    it('should handle subtracting across month boundary', () => {
      const march5 = new Date(2024, 2, 5);
      const result = subtractDays(march5, 10); // Should be Feb 24

      expect(result.getMonth()).toBe(1); // February
      expect(result.getDate()).toBe(24);
    });

    it('should handle subtracting across year boundary', () => {
      const jan5_2024 = new Date(2024, 0, 5);
      const result = subtractDays(jan5_2024, 10); // Should be Dec 26, 2023

      expect(result.getFullYear()).toBe(2023);
      expect(result.getMonth()).toBe(11); // December
      expect(result.getDate()).toBe(26);
    });

    it('should handle leap year in subtraction', () => {
      const march1_2024 = new Date(2024, 2, 1);
      const result = subtractDays(march1_2024, 1); // Should be Feb 29 (leap day)

      expect(result.getMonth()).toBe(1);
      expect(result.getDate()).toBe(29);
    });

    it('should handle subtracting 0 days', () => {
      const date = new Date(2024, 5, 15);
      const result = subtractDays(date, 0);

      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(15);
    });

    it('should handle subtracting large number of days', () => {
      const date = new Date(2024, 0, 1);
      const result = subtractDays(date, 365); // Should be Jan 1, 2023

      expect(result.getFullYear()).toBe(2023);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(1);
    });
  });

  describe('getStartOfMonth - Edge Cases', () => {
    it('should handle February in leap year', () => {
      const feb2024 = new Date(2024, 1, 15);
      const result = getStartOfMonth(feb2024);

      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(1);
      expect(result.getDate()).toBe(1);
      expect(result.getHours()).toBe(0);
    });

    it('should handle December (year end)', () => {
      const dec2024 = new Date(2024, 11, 31);
      const result = getStartOfMonth(dec2024);

      expect(result.getMonth()).toBe(11);
      expect(result.getDate()).toBe(1);
    });

    it('should handle month with 31 days', () => {
      const jan31 = new Date(2024, 0, 31);
      const result = getStartOfMonth(jan31);

      expect(result.getDate()).toBe(1);
    });

    it('should reset time components', () => {
      const date = new Date(2024, 5, 15, 23, 59, 59, 999);
      const result = getStartOfMonth(date);

      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  });

  describe('getEndOfMonth - Edge Cases', () => {
    it('should handle February in leap year', () => {
      const feb2024 = new Date(2024, 1, 1);
      const result = getEndOfMonth(feb2024);

      expect(result.getMonth()).toBe(1);
      expect(result.getDate()).toBe(29); // Leap year
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
    });

    it('should handle February in non-leap year', () => {
      const feb2023 = new Date(2023, 1, 1);
      const result = getEndOfMonth(feb2023);

      expect(result.getMonth()).toBe(1);
      expect(result.getDate()).toBe(28); // Non-leap year
    });

    it('should handle months with 31 days', () => {
      const jan = new Date(2024, 0, 1);
      const result = getEndOfMonth(jan);

      expect(result.getDate()).toBe(31);
    });

    it('should handle months with 30 days', () => {
      const april = new Date(2024, 3, 1);
      const result = getEndOfMonth(april);

      expect(result.getDate()).toBe(30);
    });

    it('should set time to end of day', () => {
      const date = new Date(2024, 5, 1, 0, 0, 0);
      const result = getEndOfMonth(date);

      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });
  });

  describe('isSameDay - Edge Cases', () => {
    it('should return true for same day different times', () => {
      const morning = new Date(2024, 5, 15, 8, 0, 0);
      const evening = new Date(2024, 5, 15, 20, 0, 0);

      expect(isSameDay(morning, evening)).toBe(true);
    });

    it('should return false for adjacent days', () => {
      const today = new Date(2024, 5, 15, 23, 59, 59);
      const tomorrow = new Date(2024, 5, 16, 0, 0, 0);

      expect(isSameDay(today, tomorrow)).toBe(false);
    });

    it('should handle leap day comparisons', () => {
      const leapDay2024 = new Date(2024, 1, 29);
      const leapDay2024Copy = new Date(2024, 1, 29, 23, 59);

      expect(isSameDay(leapDay2024, leapDay2024Copy)).toBe(true);
    });

    it('should handle year boundary dates', () => {
      const dec31 = new Date(2023, 11, 31);
      const jan1 = new Date(2024, 0, 1);

      expect(isSameDay(dec31, jan1)).toBe(false);
    });

    it('should handle null dates', () => {
      const date = new Date(2024, 5, 15);
      expect(isSameDay(null as unknown as Date, date)).toBe(false);
      expect(isSameDay(date, null as unknown as Date)).toBe(false);
      expect(isSameDay(null as unknown as Date, null as unknown as Date)).toBe(
        false,
      );
    });

    it('should handle undefined dates', () => {
      const date = new Date(2024, 5, 15);
      expect(isSameDay(undefined as unknown as Date, date)).toBe(false);
      expect(isSameDay(date, undefined as unknown as Date)).toBe(false);
    });
  });

  describe('normalizeDate - Edge Cases', () => {
    it('should handle Date objects', () => {
      const date = new Date(2024, 5, 15);
      const result = normalizeDate(date);

      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(5);
      expect(result?.getDate()).toBe(15);
    });

    it('should handle ISO string dates', () => {
      const isoString = '2024-06-15T12:00:00.000Z';
      const result = normalizeDate(isoString);

      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(5);
    });

    it('should handle timestamp numbers', () => {
      const timestamp = new Date(2024, 5, 15).getTime();
      const result = normalizeDate(timestamp as unknown as DateInput);

      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(5);
      expect(result?.getDate()).toBe(15);
    });

    it('should handle various date string formats', () => {
      const formats = [
        '2024-06-15',
        '2024/06/15',
        'June 15, 2024',
        '15 Jun 2024',
      ];

      formats.forEach((format) => {
        const result = normalizeDate(format);
        expect(result).toBeInstanceOf(Date);
        expect(result?.getMonth()).toBe(5); // June
      });
    });

    it('should handle null input', () => {
      const result = normalizeDate(null as unknown as DateInput);
      expect(result).toBeNull();
    });

    it('should handle undefined input', () => {
      const result = normalizeDate(undefined as unknown as DateInput);
      expect(result).toBeNull();
    });

    it('should handle invalid date strings', () => {
      const result = normalizeDate('invalid-date');
      expect(result).toBeNull();
    });

    it('should handle empty string', () => {
      const result = normalizeDate('');
      expect(result).toBeNull();
    });

    it('should handle edge case timestamps', () => {
      // Epoch
      const epoch = normalizeDate(0 as unknown as DateInput);
      expect(epoch?.getFullYear()).toBe(1970);

      // Negative timestamp
      const negative = normalizeDate(-86400000 as unknown as DateInput); // 1 day before epoch
      expect(negative).toBeInstanceOf(Date);
    });

    it('should handle dates with timezone offsets', () => {
      const isoWithOffset = '2024-06-15T12:00:00+05:00';
      const result = normalizeDate(isoWithOffset);

      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
    });

    it('should handle leap year dates in strings', () => {
      const leapDay = normalizeDate('2024-02-29');
      expect(leapDay?.getMonth()).toBe(1);
      expect(leapDay?.getDate()).toBe(29);
    });

    it('should handle year 2000 (century leap year)', () => {
      const y2k = normalizeDate('2000-02-29');
      expect(y2k?.getFullYear()).toBe(2000);
      expect(y2k?.getMonth()).toBe(1);
      expect(y2k?.getDate()).toBe(29);
    });

    it('should handle year 1900 (non-leap century)', () => {
      // 1900 was not a leap year
      const y1900 = normalizeDate('1900-02-28');
      expect(y1900?.getFullYear()).toBe(1900);
      expect(y1900?.getDate()).toBe(28);
    });
  });

  describe('Date Calculations - Complex Scenarios', () => {
    it('should handle multiple month additions across leap years', () => {
      const jan2024 = new Date(2024, 0, 31);
      const result = addMonths(jan2024, 13); // February 2025

      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(1);
    });

    it('should handle day subtraction across multiple months', () => {
      const date = new Date(2024, 3, 1); // April 1
      const result = subtractDays(date, 100);

      // Should go back to late December 2023
      expect(result.getFullYear()).toBe(2023);
    });

    it('should preserve time when adding months', () => {
      const date = new Date(2024, 0, 15, 14, 30, 45, 500);
      const result = addMonths(date, 1);

      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(30);
      expect(result.getSeconds()).toBe(45);
      expect(result.getMilliseconds()).toBe(500);
    });

    it('should preserve time when subtracting days', () => {
      const date = new Date(2024, 0, 15, 10, 20, 30);
      const result = subtractDays(date, 5);

      expect(result.getHours()).toBe(10);
      expect(result.getMinutes()).toBe(20);
      expect(result.getSeconds()).toBe(30);
    });
  });

  describe('Boundary Date Values', () => {
    it('should handle minimum safe date', () => {
      const minDate = new Date(-8640000000000000); // Min safe date
      const start = getStartOfDay(minDate);
      expect(start).toBeInstanceOf(Date);
    });

    it('should handle maximum safe date', () => {
      const maxDate = new Date(8640000000000000); // Max safe date
      const end = getEndOfDay(maxDate);
      expect(end).toBeInstanceOf(Date);
    });

    it('should handle dates near epoch', () => {
      const nearEpoch = new Date(1970, 0, 2);
      const result = subtractDays(nearEpoch, 1);
      expect(result.getFullYear()).toBe(1970);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(1);
    });
  });
});
