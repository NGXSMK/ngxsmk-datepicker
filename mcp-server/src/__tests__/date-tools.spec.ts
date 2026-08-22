import {
  handleParseDate,
  handleCalculateDateRange,
  handleConvertTimezone,
  handleGetHolidays,
  handleValidateDateSelection,
} from '../tools/date-tools.js';

describe('MCP Date Tools', () => {
  describe('handleParseDate', () => {
    it('should parse "today" relative to reference date', () => {
      const res = handleParseDate({
        expression: 'today',
        referenceDate: '2026-08-22T10:00:00.000Z',
        timezone: 'UTC',
      });
      expect(res.success).toBe(true);
      expect(res.date).toBe('2026-08-22');
    });

    it('should parse "tomorrow" relative to reference date', () => {
      const res = handleParseDate({
        expression: 'tomorrow',
        referenceDate: '2026-08-22T10:00:00.000Z',
        timezone: 'UTC',
      });
      expect(res.success).toBe(true);
      expect(res.date).toBe('2026-08-23');
    });

    it('should parse "in 5 days"', () => {
      const res = handleParseDate({
        expression: 'in 5 days',
        referenceDate: '2026-08-20T00:00:00.000Z',
        timezone: 'UTC',
      });
      expect(res.success).toBe(true);
      expect(res.date).toBe('2026-08-25');
    });
  });

  describe('handleCalculateDateRange', () => {
    it('should calculate last_7_days preset', () => {
      const res = handleCalculateDateRange({
        preset: 'last_7_days',
      });
      expect(res.success).toBe(true);
      expect(res.calendarDays).toBe(7);
    });

    it('should calculate business days offset', () => {
      const res = handleCalculateDateRange({
        startDate: '2026-08-24', // Monday
        businessDaysOffset: 5,
        timezone: 'UTC',
      });
      expect(res.success).toBe(true);
      expect(res.businessDays).toBe(6); // Mon through next Mon
    });
  });

  describe('handleConvertTimezone', () => {
    it('should convert UTC to Tokyo', () => {
      const res = handleConvertTimezone({
        date: '2026-08-22T12:00:00.000Z',
        fromTimezone: 'UTC',
        toTimezone: 'Asia/Tokyo',
      });
      expect(res.success).toBe(true);
      expect(res.targetTimezone).toBe('Asia/Tokyo');
      expect(res.offsetDifferenceMinutes).toBe(540); // +9h = 540 min
    });
  });

  describe('handleGetHolidays', () => {
    it('should return national holidays for US', () => {
      const res = handleGetHolidays({
        year: 2026,
        countryCode: 'US',
      });
      expect(res.success).toBe(true);
      expect(res.holidays.length).toBeGreaterThan(0);
      expect(res.holidays.some((h) => h.name.includes("New Year's"))).toBe(true);
    });
  });

  describe('handleValidateDateSelection', () => {
    it('should validate single date within bounds', () => {
      const res = handleValidateDateSelection({
        date: '2026-08-22',
        minDate: '2026-08-01',
        maxDate: '2026-08-31',
      });
      expect(res.valid).toBe(true);
      expect(res.errors.length).toBe(0);
    });

    it('should flag date before minDate as invalid', () => {
      const res = handleValidateDateSelection({
        date: '2026-07-31',
        minDate: '2026-08-01',
      });
      expect(res.valid).toBe(false);
      expect(res.errors[0]).toContain('before minDate');
    });
  });
});
