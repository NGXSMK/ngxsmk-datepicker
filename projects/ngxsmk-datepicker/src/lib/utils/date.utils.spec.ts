import { getStartOfDay, getEndOfDay, addMonths, subtractDays, getStartOfMonth, getEndOfMonth, getStartOfWeek, getEndOfWeek, getStartOfQuarter, getEndOfQuarter, getStartOfYear, getEndOfYear, isSameDay, normalizeDate } from './date.utils';

describe('Date Utils', () => {
  describe('getStartOfDay', () => {
    it('should return date with time set to 00:00:00.000', () => {
      const date = new Date(2025, 5, 15, 14, 30, 45, 123);
      const result = getStartOfDay(date);
      
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(15);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    it('should handle edge case of midnight', () => {
      const date = new Date(2025, 5, 15, 0, 0, 0, 0);
      const result = getStartOfDay(date);
      
      expect(result.getTime()).toBe(date.getTime());
    });
  });

  describe('getEndOfDay', () => {
    it('should return date with time set to 23:59:59.999', () => {
      const date = new Date(2025, 5, 15, 14, 30, 45, 123);
      const result = getEndOfDay(date);
      
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(15);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });
  });

  describe('addMonths', () => {
    it('should add months correctly', () => {
      const date = new Date(2025, 5, 15);
      const result = addMonths(date, 2);
      
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(7);
      expect(result.getDate()).toBe(15);
    });

    it('should handle year rollover', () => {
      const date = new Date(2025, 11, 15);
      const result = addMonths(date, 2);
      
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(1);
    });

    it('should handle negative months', () => {
      const date = new Date(2025, 5, 15);
      const result = addMonths(date, -2);
      
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(3);
    });
  });

  describe('subtractDays', () => {
    it('should subtract days correctly', () => {
      const date = new Date(2025, 5, 15);
      const result = subtractDays(date, 5);
      
      expect(result.getDate()).toBe(10);
    });

    it('should handle month rollover', () => {
      const date = new Date(2025, 5, 3);
      const result = subtractDays(date, 5);
      
      expect(result.getMonth()).toBe(4);
      expect(result.getDate()).toBe(29);
    });
  });

  describe('getStartOfMonth', () => {
    it('should return first day of month', () => {
      const date = new Date(2025, 5, 15);
      const result = getStartOfMonth(date);
      
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(1);
    });
  });

  describe('getEndOfMonth', () => {
    it('should return last day of month', () => {
      const date = new Date(2025, 5, 15);
      const result = getEndOfMonth(date);
      
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(30);
    });

    it('should handle February in leap year', () => {
      const date = new Date(2024, 1, 15);
      const result = getEndOfMonth(date);
      
      expect(result.getDate()).toBe(29);
    });

    it('should handle February in non-leap year', () => {
      const date = new Date(2025, 1, 15);
      const result = getEndOfMonth(date);
      
      expect(result.getDate()).toBe(28);
    });
  });

  describe('getStartOfWeek', () => {
    it('should return start of week (Sunday)', () => {
      const date = new Date(2025, 5, 15); // Sunday, June 15, 2025
      const result = getStartOfWeek(date, 0);
      
      expect(result.getDay()).toBe(0); // Sunday
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
    });

    it('should return start of week (Monday)', () => {
      const date = new Date(2025, 5, 15); // Sunday, June 15, 2025
      const result = getStartOfWeek(date, 1);
      
      expect(result.getDay()).toBe(1); // Monday
    });
  });

  describe('getEndOfWeek', () => {
    it('should return end of week (Saturday)', () => {
      const date = new Date(2025, 5, 15); // Sunday, June 15, 2025
      const result = getEndOfWeek(date, 0);
      
      expect(result.getDay()).toBe(6); // Saturday
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
    });
  });

  describe('getStartOfQuarter', () => {
    it('should return start of Q1', () => {
      const date = new Date(2025, 1, 15); // February (Q1)
      const result = getStartOfQuarter(date);
      
      expect(result.getMonth()).toBe(0); // January
      expect(result.getDate()).toBe(1);
    });

    it('should return start of Q2', () => {
      const date = new Date(2025, 5, 15); // June (Q2)
      const result = getStartOfQuarter(date);
      
      expect(result.getMonth()).toBe(3); // April
      expect(result.getDate()).toBe(1);
    });

    it('should return start of Q3', () => {
      const date = new Date(2025, 7, 15); // August (Q3)
      const result = getStartOfQuarter(date);
      
      expect(result.getMonth()).toBe(6); // July
      expect(result.getDate()).toBe(1);
    });

    it('should return start of Q4', () => {
      const date = new Date(2025, 10, 15); // November (Q4)
      const result = getStartOfQuarter(date);
      
      expect(result.getMonth()).toBe(9); // October
      expect(result.getDate()).toBe(1);
    });
  });

  describe('getEndOfQuarter', () => {
    it('should return end of Q1', () => {
      const date = new Date(2025, 1, 15); // February (Q1)
      const result = getEndOfQuarter(date);
      
      expect(result.getMonth()).toBe(2); // March
      expect(result.getDate()).toBe(31);
    });

    it('should return end of Q2', () => {
      const date = new Date(2025, 5, 15); // June (Q2)
      const result = getEndOfQuarter(date);
      
      expect(result.getMonth()).toBe(5); // June
      expect(result.getDate()).toBe(30);
    });
  });

  describe('getStartOfYear', () => {
    it('should return January 1st', () => {
      const date = new Date(2025, 5, 15);
      const result = getStartOfYear(date);
      
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getDate()).toBe(1);
    });
  });

  describe('getEndOfYear', () => {
    it('should return December 31st', () => {
      const date = new Date(2025, 5, 15);
      const result = getEndOfYear(date);
      
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(11); // December
      expect(result.getDate()).toBe(31);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const date1 = new Date(2025, 5, 15, 10, 30);
      const date2 = new Date(2025, 5, 15, 14, 45);
      
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different days', () => {
      const date1 = new Date(2025, 5, 15);
      const date2 = new Date(2025, 5, 16);
      
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('should return false for null dates', () => {
      expect(isSameDay(null, new Date())).toBe(false);
      expect(isSameDay(new Date(), null)).toBe(false);
      expect(isSameDay(null, null)).toBe(false);
    });
  });

  describe('normalizeDate', () => {
    it('should return Date object as is', () => {
      const date = new Date(2025, 5, 15);
      const result = normalizeDate(date);
      
      expect(result).toEqual(date);
    });

    it('should parse string date', () => {
      const dateString = '2025-06-15';
      const result = normalizeDate(dateString);
      
      expect(result).toBeInstanceOf(Date);
      expect(result!.getFullYear()).toBe(2025);
    });

    it('should return null for null input', () => {
      expect(normalizeDate(null)).toBeNull();
    });

    it('should handle invalid date strings', () => {
      const result = normalizeDate('invalid-date');
      expect(result).toBeNull();
    });
  });
});

