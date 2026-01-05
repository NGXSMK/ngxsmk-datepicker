import { NativeDateAdapter } from './date-adapter.interface';

describe('NativeDateAdapter', () => {
  let adapter: NativeDateAdapter;

  beforeEach(() => {
    adapter = new NativeDateAdapter();
  });

  it('should be created', () => {
    expect(adapter).toBeTruthy();
  });

  describe('parse', () => {
    it('should parse valid date string', () => {
      const result = adapter.parse('2024-01-15');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getDate()).toBe(15);
    });

    it('should parse valid Date object', () => {
      const date = new Date('2024-01-15');
      const result = adapter.parse(date);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getTime()).toBe(date.getTime());
    });

    it('should parse valid timestamp number', () => {
      const timestamp = new Date('2024-01-15').getTime();
      const result = adapter.parse(timestamp);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getTime()).toBe(timestamp);
    });

    it('should return null for null input', () => {
      expect(adapter.parse(null)).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(adapter.parse(undefined)).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(adapter.parse('')).toBeNull();
    });

    it('should return null for invalid date string', () => {
      const result = adapter.parse('invalid-date');
      expect(result).toBeNull();
    });

    it('should return null for invalid Date object', () => {
      const invalidDate = new Date('invalid');
      const result = adapter.parse(invalidDate);
      expect(result).toBeNull();
    });

    it('should call onError callback for invalid date string', () => {
      const onError = jasmine.createSpy('onError');
      adapter.parse('invalid-date', onError);
      expect(onError).toHaveBeenCalled();
      expect(onError.calls.mostRecent().args[0].message).toContain('Invalid date string');
    });

    it('should call onError callback for invalid Date object', () => {
      const invalidDate = new Date('invalid');
      const onError = jasmine.createSpy('onError');
      adapter.parse(invalidDate, onError);
      expect(onError).toHaveBeenCalled();
      expect(onError.calls.mostRecent().args[0].message).toContain('Invalid Date object');
    });

    it('should call onError callback for invalid timestamp', () => {
      const onError = jasmine.createSpy('onError');
      // NaN is falsy, so it returns null early without calling onError
      // Test with Infinity which is truthy but creates an invalid date
      const result = adapter.parse(Infinity, onError);
      expect(result).toBeNull();
      // Infinity creates an invalid date, so error callback should be called
      expect(onError).toHaveBeenCalled();
      expect(onError.calls.mostRecent().args[0].message).toContain('Invalid date timestamp');
    });

    it('should return null for NaN without calling onError', () => {
      const onError = jasmine.createSpy('onError');
      // NaN is falsy (!NaN === true), so it returns null early
      const result = adapter.parse(NaN, onError);
      expect(result).toBeNull();
      // onError should not be called because NaN is caught by the !value check
      expect(onError).not.toHaveBeenCalled();
    });

    it('should handle parse errors gracefully', () => {
      const onError = jasmine.createSpy('onError');
      // Create a value that will cause an error
      const result = adapter.parse({} as any, onError);
      expect(result).toBeNull();
    });

    it('should return null for unsupported types', () => {
      expect(adapter.parse(true as any)).toBeNull();
      expect(adapter.parse([] as any)).toBeNull();
      expect(adapter.parse({} as any)).toBeNull();
    });
  });

  describe('format', () => {
    it('should format valid date', () => {
      const date = new Date('2024-01-15');
      const result = adapter.format(date);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should format date with locale', () => {
      const date = new Date('2024-01-15');
      const result = adapter.format(date, undefined, 'en-US');
      expect(result).toBeTruthy();
    });

    it('should return empty string for null date', () => {
      expect(adapter.format(null as any)).toBe('');
    });

    it('should return empty string for invalid date', () => {
      const invalidDate = new Date('invalid');
      expect(adapter.format(invalidDate)).toBe('');
    });

    it('should return empty string for undefined date', () => {
      expect(adapter.format(undefined as any)).toBe('');
    });
  });

  describe('isValid', () => {
    it('should return true for valid Date object', () => {
      const date = new Date('2024-01-15');
      expect(adapter.isValid(date)).toBe(true);
    });

    it('should return false for invalid Date object', () => {
      const invalidDate = new Date('invalid');
      expect(adapter.isValid(invalidDate)).toBe(false);
    });

    it('should return false for null', () => {
      expect(adapter.isValid(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(adapter.isValid(undefined)).toBe(false);
    });

    it('should return false for string', () => {
      expect(adapter.isValid('2024-01-15')).toBe(false);
    });

    it('should return false for number', () => {
      expect(adapter.isValid(1234567890)).toBe(false);
    });
  });

  describe('startOfDay', () => {
    it('should return date at start of day', () => {
      const date = new Date('2024-01-15T14:30:45');
      const result = adapter.startOfDay(date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(15);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  });

  describe('endOfDay', () => {
    it('should return date at end of day', () => {
      const date = new Date('2024-01-15T14:30:45');
      const result = adapter.endOfDay(date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(15);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });
  });

  describe('addMonths', () => {
    it('should add months to date', () => {
      const date = new Date('2024-01-15');
      const result = adapter.addMonths(date, 2);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2); // March (0-indexed)
      expect(result.getDate()).toBe(15);
    });

    it('should handle year rollover when adding months', () => {
      const date = new Date('2024-11-15');
      const result = adapter.addMonths(date, 2);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(0); // January
    });

    it('should subtract months with negative value', () => {
      const date = new Date('2024-03-15');
      const result = adapter.addMonths(date, -2);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0); // January
    });
  });

  describe('addDays', () => {
    it('should add days to date', () => {
      const date = new Date('2024-01-15');
      const result = adapter.addDays(date, 5);
      expect(result.getDate()).toBe(20);
    });

    it('should handle month rollover when adding days', () => {
      const date = new Date('2024-01-30');
      const result = adapter.addDays(date, 5);
      expect(result.getMonth()).toBe(1); // February
      expect(result.getDate()).toBe(4);
    });

    it('should subtract days with negative value', () => {
      const date = new Date('2024-01-15');
      const result = adapter.addDays(date, -5);
      expect(result.getDate()).toBe(10);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const date1 = new Date('2024-01-15T10:00:00');
      const date2 = new Date('2024-01-15T20:00:00');
      expect(adapter.isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different days', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-01-16');
      expect(adapter.isSameDay(date1, date2)).toBe(false);
    });

    it('should return false for different months', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-02-15');
      expect(adapter.isSameDay(date1, date2)).toBe(false);
    });

    it('should return false for different years', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2025-01-15');
      expect(adapter.isSameDay(date1, date2)).toBe(false);
    });

    it('should return false for null first date', () => {
      const date2 = new Date('2024-01-15');
      expect(adapter.isSameDay(null, date2)).toBe(false);
    });

    it('should return false for null second date', () => {
      const date1 = new Date('2024-01-15');
      expect(adapter.isSameDay(date1, null)).toBe(false);
    });

    it('should return false for both null dates', () => {
      expect(adapter.isSameDay(null, null)).toBe(false);
    });
  });
});

