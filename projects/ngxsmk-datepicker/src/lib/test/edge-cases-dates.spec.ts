import { TestBed } from '@angular/core/testing';
import { DateValidationService } from '../services/date-validation.service';
import { NativeDateAdapter } from '../adapters/date-adapter.interface';
import { getStartOfDay, getEndOfDay } from '../utils/date.utils';

/**
 * Edge case tests for date operations
 * Tests extreme values, boundary conditions, and unusual scenarios
 */
describe('Date Edge Cases', () => {
  let validationService: DateValidationService;
  let adapter: NativeDateAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateValidationService]
    });
    validationService = TestBed.inject(DateValidationService);
    adapter = new NativeDateAdapter();
  });

  describe('Extreme Date Ranges', () => {
    it('should handle year 0', () => {
      const date = new Date(0, 0, 1);
      date.setFullYear(0);
      
      expect(() => {
        const isValid = validationService.isDateValid(date, {});
        // Year 0 is valid in JavaScript Date
        expect(typeof isValid).toBe('boolean');
      }).not.toThrow();
    });

    it('should handle year 1', () => {
      const date = new Date(1, 0, 1);
      expect(() => {
        const isValid = validationService.isDateValid(date, {});
        expect(typeof isValid).toBe('boolean');
      }).not.toThrow();
    });

    it('should handle year 100', () => {
      const date = new Date(100, 0, 1);
      expect(() => {
        const isValid = validationService.isDateValid(date, {});
        expect(typeof isValid).toBe('boolean');
      }).not.toThrow();
    });

    it('should handle year 1900', () => {
      const date = new Date(1900, 0, 1);
      expect(() => {
        const isValid = validationService.isDateValid(date, {});
        expect(typeof isValid).toBe('boolean');
      }).not.toThrow();
    });

    it('should handle year 2000', () => {
      const date = new Date(2000, 0, 1);
      expect(() => {
        const isValid = validationService.isDateValid(date, {});
        expect(isValid).toBe(true);
      }).not.toThrow();
    });

    it('should handle year 2100', () => {
      const date = new Date(2100, 0, 1);
      expect(() => {
        const isValid = validationService.isDateValid(date, {});
        expect(typeof isValid).toBe('boolean');
      }).not.toThrow();
    });

    it('should handle year 9999', () => {
      const date = new Date(9999, 11, 31);
      expect(() => {
        const isValid = validationService.isDateValid(date, {});
        expect(typeof isValid).toBe('boolean');
      }).not.toThrow();
    });

    it('should handle leap year February 29', () => {
      const leapYear = new Date(2024, 1, 29); // Feb 29, 2024
      expect(() => {
        const isValid = validationService.isDateValid(leapYear, {});
        expect(isValid).toBe(true);
      }).not.toThrow();
    });

    it('should handle non-leap year February 29 (invalid)', () => {
      const nonLeapYear = new Date(2023, 1, 29); // Feb 29, 2023 (invalid)
      // JavaScript Date will roll over to March 1
      expect(() => {
        const isValid = validationService.isDateValid(nonLeapYear, {});
        expect(typeof isValid).toBe('boolean');
      }).not.toThrow();
    });
  });

  describe('Boundary Conditions', () => {
    it('should handle January 1', () => {
      const date = new Date(2024, 0, 1);
      expect(() => {
        const isValid = validationService.isDateValid(date, {});
        expect(isValid).toBe(true);
      }).not.toThrow();
    });

    it('should handle December 31', () => {
      const date = new Date(2024, 11, 31);
      expect(() => {
        const isValid = validationService.isDateValid(date, {});
        expect(isValid).toBe(true);
      }).not.toThrow();
    });

    it('should handle month 0 (January)', () => {
      const date = new Date(2024, 0, 15);
      expect(() => {
        const isValid = validationService.isDateValid(date, {});
        expect(isValid).toBe(true);
      }).not.toThrow();
    });

    it('should handle month 11 (December)', () => {
      const date = new Date(2024, 11, 15);
      expect(() => {
        const isValid = validationService.isDateValid(date, {});
        expect(isValid).toBe(true);
      }).not.toThrow();
    });

    it('should handle day 1', () => {
      const date = new Date(2024, 5, 1);
      expect(() => {
        const isValid = validationService.isDateValid(date, {});
        expect(isValid).toBe(true);
      }).not.toThrow();
    });

    it('should handle last day of month', () => {
      const date = new Date(2024, 0, 31); // Jan 31
      expect(() => {
        const isValid = validationService.isDateValid(date, {});
        expect(isValid).toBe(true);
      }).not.toThrow();
    });
  });

  describe('Invalid Input Combinations', () => {
    it('should handle minDate > maxDate', () => {
      const date = new Date(2024, 5, 15);
      const minDate = new Date(2024, 5, 20);
      const maxDate = new Date(2024, 5, 10);
      
      expect(() => {
        const isValid = validationService.isDateValid(date, { minDate, maxDate });
        // Should handle invalid constraint combination
        expect(typeof isValid).toBe('boolean');
      }).not.toThrow();
    });

    it('should handle minDate equal to maxDate', () => {
      const date = new Date(2024, 5, 15);
      const minDate = new Date(2024, 5, 15);
      const maxDate = new Date(2024, 5, 15);
      
      expect(() => {
        const isValid = validationService.isDateValid(date, { minDate, maxDate });
        expect(isValid).toBe(true);
      }).not.toThrow();
    });

    it('should handle date exactly at minDate', () => {
      const date = new Date(2024, 5, 15);
      const minDate = new Date(2024, 5, 15);
      
      expect(() => {
        const isValid = validationService.isDateValid(date, { minDate });
        expect(isValid).toBe(true);
      }).not.toThrow();
    });

    it('should handle date exactly at maxDate', () => {
      const date = new Date(2024, 5, 15);
      const maxDate = new Date(2024, 5, 15);
      
      expect(() => {
        const isValid = validationService.isDateValid(date, { maxDate });
        expect(isValid).toBe(true);
      }).not.toThrow();
    });

    it('should handle date 1 millisecond before minDate', () => {
      const minDate = new Date(2024, 5, 15, 0, 0, 0, 0);
      const date = new Date(minDate.getTime() - 1);
      
      expect(() => {
        const isValid = validationService.isDateValid(date, { minDate });
        expect(isValid).toBe(false);
      }).not.toThrow();
    });

    it('should handle date 1 millisecond after maxDate', () => {
      const maxDate = new Date(2024, 5, 15, 23, 59, 59, 999);
      const date = new Date(maxDate.getTime() + 1);
      
      expect(() => {
        const isValid = validationService.isDateValid(date, { maxDate });
        expect(isValid).toBe(false);
      }).not.toThrow();
    });
  });

  describe('Time Edge Cases', () => {
    it('should handle start of day (00:00:00.000)', () => {
      const date = new Date(2024, 5, 15, 0, 0, 0, 0);
      const startOfDay = getStartOfDay(date);
      
      expect(startOfDay.getHours()).toBe(0);
      expect(startOfDay.getMinutes()).toBe(0);
      expect(startOfDay.getSeconds()).toBe(0);
      expect(startOfDay.getMilliseconds()).toBe(0);
    });

    it('should handle end of day (23:59:59.999)', () => {
      const date = new Date(2024, 5, 15, 23, 59, 59, 999);
      const endOfDay = getEndOfDay(date);
      
      expect(endOfDay.getHours()).toBe(23);
      expect(endOfDay.getMinutes()).toBe(59);
      expect(endOfDay.getSeconds()).toBe(59);
      expect(endOfDay.getMilliseconds()).toBe(999);
    });

    it('should handle midnight (00:00:00)', () => {
      const date = new Date(2024, 5, 15, 0, 0, 0);
      expect(() => {
        const isValid = validationService.isDateValid(date, {});
        expect(isValid).toBe(true);
      }).not.toThrow();
    });

    it('should handle 23:59:59', () => {
      const date = new Date(2024, 5, 15, 23, 59, 59);
      expect(() => {
        const isValid = validationService.isDateValid(date, {});
        expect(isValid).toBe(true);
      }).not.toThrow();
    });
  });

  describe('Date Adapter Edge Cases', () => {
    it('should handle adding 0 months', () => {
      const date = new Date(2024, 5, 15);
      const result = adapter.addMonths(date, 0);
      
      expect(result.getTime()).toBe(date.getTime());
    });

    it('should handle adding 0 days', () => {
      const date = new Date(2024, 5, 15);
      const result = adapter.addDays(date, 0);
      
      expect(result.getTime()).toBe(date.getTime());
    });

    it('should handle adding negative months', () => {
      const date = new Date(2024, 5, 15);
      const result = adapter.addMonths(date, -6);
      
      expect(result.getFullYear()).toBe(2023);
      expect(result.getMonth()).toBe(11); // December
    });

    it('should handle adding negative days', () => {
      const date = new Date(2024, 5, 15);
      const result = adapter.addDays(date, -30);
      
      expect(result.getMonth()).toBe(4); // May
    });

    it('should handle month rollover when adding months', () => {
      const date = new Date(2024, 11, 15); // December
      const result = adapter.addMonths(date, 2);
      
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(1); // February
    });

    it('should handle year rollover when adding days', () => {
      const date = new Date(2024, 11, 31); // Dec 31
      const result = adapter.addDays(date, 1);
      
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getDate()).toBe(1);
    });

    it('should handle isSameDay with null dates', () => {
      expect(adapter.isSameDay(null, null)).toBe(false);
      expect(adapter.isSameDay(new Date(2024, 5, 15), null)).toBe(false);
      expect(adapter.isSameDay(null, new Date(2024, 5, 15))).toBe(false);
    });

    it('should handle isSameDay with same date different times', () => {
      const date1 = new Date(2024, 5, 15, 10, 30, 45);
      const date2 = new Date(2024, 5, 15, 20, 15, 30);
      
      expect(adapter.isSameDay(date1, date2)).toBe(true);
    });
  });

  describe('Timezone Edge Cases', () => {
    it('should handle UTC dates', () => {
      const date = new Date('2024-01-15T00:00:00Z');
      expect(() => {
        const isValid = validationService.isDateValid(date, {});
        expect(isValid).toBe(true);
      }).not.toThrow();
    });

    it('should handle dates with timezone offset', () => {
      const date = new Date('2024-01-15T00:00:00+05:30');
      expect(() => {
        const isValid = validationService.isDateValid(date, {});
        expect(isValid).toBe(true);
      }).not.toThrow();
    });

    it('should handle dates at DST transition', () => {
      // DST transition dates vary by timezone
      // Test that the date is still valid
      const date = new Date(2024, 2, 10); // March 10, 2024 (DST start in US)
      expect(() => {
        const isValid = validationService.isDateValid(date, {});
        expect(isValid).toBe(true);
      }).not.toThrow();
    });
  });

  describe('Invalid Date Scenarios', () => {
    it('should handle Date object with invalid time', () => {
      const invalidDate = new Date('invalid');
      expect(() => {
        const isValid = validationService.isDateValid(invalidDate, {});
        expect(isValid).toBe(false);
      }).not.toThrow();
    });

    it('should handle date with year overflow', () => {
      // JavaScript Date handles year overflow
      const date = new Date(2024, 5, 15);
      date.setFullYear(10000); // Year 10000
      
      expect(() => {
        const isValid = validationService.isDateValid(date, {});
        expect(typeof isValid).toBe('boolean');
      }).not.toThrow();
    });

    it('should handle date with month overflow', () => {
      const date = new Date(2024, 5, 15);
      date.setMonth(12); // Month 12 (January of next year)
      
      expect(() => {
        const isValid = validationService.isDateValid(date, {});
        expect(isValid).toBe(true);
      }).not.toThrow();
    });

    it('should handle date with day overflow', () => {
      const date = new Date(2024, 0, 31); // Jan 31
      date.setDate(32); // Day 32 (Feb 1)
      
      expect(() => {
        const isValid = validationService.isDateValid(date, {});
        expect(isValid).toBe(true);
      }).not.toThrow();
    });
  });
});

