import { parseDateWithTimezone, convertTimezone, getTimezoneOffset, formatDateWithTimezone } from './timezone.utils';

describe('Timezone Utils', () => {
  describe('parseDateWithTimezone', () => {
    it('should parse date string', () => {
      const dateString = '2025-06-15';
      const result = parseDateWithTimezone(dateString);

      expect(result).toBeInstanceOf(Date);
      expect(result!.getFullYear()).toBe(2025);
    });

    it('should return null for invalid date string', () => {
      const result = parseDateWithTimezone('invalid');
      expect(result).toBeNull();
    });

    it('should handle timezone parameter', () => {
      const dateString = '2025-06-15T12:00:00';
      const result = parseDateWithTimezone(dateString, 'America/New_York');

      expect(result).toBeInstanceOf(Date);
    });

    it('should interpret wall-clock strings in the provided timezone', () => {
      const result = parseDateWithTimezone('2025-06-15T12:00:00', 'America/New_York');
      expect(result).toBeInstanceOf(Date);

      const nyFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      const parts = nyFormatter.formatToParts(result!);
      expect(parts.find((p) => p.type === 'hour')?.value).toBe('12');
      expect(parts.find((p) => p.type === 'minute')?.value).toBe('00');
    });
  });

  describe('convertTimezone', () => {
    it('should convert timezone', () => {
      const date = new Date('2025-06-15T12:00:00Z');
      const result = convertTimezone(date, 'UTC', 'America/New_York');

      expect(result).toBeInstanceOf(Date);
    });

    it('should preserve wall-clock time in the target timezone', () => {
      const date = new Date('2025-06-15T12:00:00Z');
      const result = convertTimezone(date, 'UTC', 'America/New_York');

      const nyFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      const parts = nyFormatter.formatToParts(result);
      const hour = parts.find((p) => p.type === 'hour')?.value;
      const minute = parts.find((p) => p.type === 'minute')?.value;

      expect(hour).toBe('12');
      expect(minute).toBe('00');
    });
  });

  describe('getTimezoneOffset', () => {
    it('should get timezone offset', () => {
      const date = new Date('2025-06-15T12:00:00Z');
      const offset = getTimezoneOffset('America/New_York', date);

      expect(typeof offset).toBe('number');
    });

    it('should handle UTC timezone', () => {
      const date = new Date('2025-06-15T12:00:00Z');
      const offset = getTimezoneOffset('UTC', date);

      expect(offset).toBe(0);
    });
  });

  describe('formatDateWithTimezone', () => {
    it('should format date with timezone', () => {
      const date = new Date('2025-06-15T12:00:00Z');
      const formatted = formatDateWithTimezone(
        date,
        'en-US',
        { year: 'numeric', month: '2-digit', day: '2-digit' },
        'America/New_York'
      );

      expect(typeof formatted).toBe('string');
      expect(formatted).toContain('2025');
    });

    it('should handle custom format', () => {
      const date = new Date('2025-06-15T12:00:00Z');
      const formatted = formatDateWithTimezone(
        date,
        'en-US',
        { year: 'numeric', month: '2-digit', day: '2-digit' },
        'America/New_York'
      );

      expect(formatted).toContain('2025');
      expect(formatted).toContain('06');
      expect(formatted).toContain('15');
    });
  });
});
