import {
  generateMonthOptions,
  generateYearOptions,
  generateTimeOptions,
  generateWeekDays,
  getFirstDayOfWeek,
  get24Hour,
  update12HourState,
  processDateRanges,
  generateYearGrid,
  generateDecadeGrid
} from './calendar.utils';
import { DateInput } from './date.utils';

describe('Calendar Utils', () => {
  describe('generateMonthOptions', () => {
    it('should generate 12 month options', () => {
      const options = generateMonthOptions('en-US', 2025);

      expect(options.length).toBe(12);
      expect(options[0].value).toBe(0);
      expect(options[11].value).toBe(11);
    });

    it('should generate localized month names', () => {
      const options = generateMonthOptions('en-US', 2025);

      expect(options[0].label).toContain('Jan');
      expect(options[5].label).toContain('Jun');
    });
  });

  describe('generateYearOptions', () => {
    it('should generate year options with correct range', () => {
      const currentYear = new Date().getFullYear();
      const options = generateYearOptions(currentYear, 10);

      expect(options.length).toBe(21);
      expect(options[0].value).toBe(currentYear - 10);
      expect(options[10].value).toBe(currentYear);
      expect(options[20].value).toBe(currentYear + 10);
    });
  });

  describe('generateTimeOptions', () => {
    it('should generate hour options for 12-hour format', () => {
      const options = generateTimeOptions();

      expect(options.hourOptions.length).toBe(12);
      expect(options.hourOptions[0].value).toBe(1);
      expect(options.hourOptions[11].value).toBe(12);
    });

    it('should generate minute options with default interval', () => {
      const options = generateTimeOptions();

      expect(options.minuteOptions.length).toBeGreaterThan(0);
      expect(options.minuteOptions[0].value).toBe(0);
    });

    it('should generate minute options with interval', () => {
      const options = generateTimeOptions(15);

      expect(options.minuteOptions.length).toBe(4);
      expect(options.minuteOptions[0].value).toBe(0);
      expect(options.minuteOptions[1].value).toBe(15);
      expect(options.minuteOptions[2].value).toBe(30);
      expect(options.minuteOptions[3].value).toBe(45);
    });
  });

  describe('generateWeekDays', () => {
    it('should generate 7 week day names', () => {
      const days = generateWeekDays('en-US', 0);

      expect(days.length).toBe(7);
    });

    it('should start with Sunday when weekStart is 0', () => {
      const days = generateWeekDays('en-US', 0);

      expect(days[0]).toContain('Sun');
    });

    it('should start with Monday when weekStart is 1', () => {
      const days = generateWeekDays('en-US', 1);

      expect(days[0]).toContain('Mon');
    });
  });

  describe('getFirstDayOfWeek', () => {
    it('should return 0 for en-US locale', () => {
      expect(getFirstDayOfWeek('en-US')).toBe(0);
    });

    it('should return 1 for en-GB locale', () => {
      expect(getFirstDayOfWeek('en-GB')).toBe(1);
    });

    it('should fallback to locale mapping when Intl.Locale is not available', () => {
      const originalIntl = (globalThis as unknown as Record<string, unknown>)['Intl'];
      const originalLocale = (globalThis as unknown as Record<string, Record<string, unknown>>)['Intl']?.['Locale'];

      // Mock Intl without Locale constructor
      (globalThis as unknown as Record<string, unknown>)['Intl'] = {
        ...(originalIntl as object),
        Locale: undefined
      };

      // Should still work with fallback
      expect(getFirstDayOfWeek('en-US')).toBe(0);
      expect(getFirstDayOfWeek('en-GB')).toBe(1);
      expect(getFirstDayOfWeek('de-DE')).toBe(1);
      expect(getFirstDayOfWeek('fr-FR')).toBe(1);

      // Restore
      if (originalLocale) {
        (globalThis as unknown as Record<string, unknown>)['Intl'] = originalIntl;
      } else {
        delete (globalThis as unknown as Record<string, Record<string, unknown>>)['Intl']['Locale'];
      }
    });

    it('should handle Intl.Locale when available', () => {
      // This test verifies the function works with Intl.Locale when it exists
      // The actual behavior depends on browser support
      const result = getFirstDayOfWeek('en-US');
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(7);
    });

    it('should handle unknown locales with fallback', () => {
      const originalIntl = (globalThis as unknown as Record<string, unknown>)['Intl'];
      const originalLocale = (globalThis as unknown as Record<string, Record<string, unknown>>)['Intl']?.['Locale'];

      // Mock Intl without Locale constructor
      (globalThis as unknown as Record<string, unknown>)['Intl'] = {
        ...(originalIntl as object),
        Locale: undefined
      };

      // Unknown locale should default to Sunday (0) or use fallback logic
      const result = getFirstDayOfWeek('xx-XX');
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(7);

      // Restore
      if (originalLocale) {
        (globalThis as unknown as Record<string, unknown>)['Intl'] = originalIntl;
      } else {
        delete (globalThis as unknown as Record<string, Record<string, unknown>>)['Intl']['Locale'];
      }
    });
  });

  describe('get24Hour', () => {
    it('should convert 12-hour AM to 24-hour', () => {
      expect(get24Hour(1, false)).toBe(1);
      expect(get24Hour(12, false)).toBe(0);
      expect(get24Hour(11, false)).toBe(11);
    });

    it('should convert 12-hour PM to 24-hour', () => {
      expect(get24Hour(1, true)).toBe(13);
      expect(get24Hour(12, true)).toBe(12);
      expect(get24Hour(11, true)).toBe(23);
    });
  });

  describe('update12HourState', () => {
    it('should update display hour and PM state', () => {
      const state = update12HourState(14);

      expect(state.displayHour).toBe(2);
      expect(state.isPm).toBe(true);
    });

    it('should handle midnight', () => {
      const state = update12HourState(0);

      expect(state.displayHour).toBe(12);
      expect(state.isPm).toBe(false);
    });

    it('should handle noon', () => {
      const state = update12HourState(12);

      expect(state.displayHour).toBe(12);
      expect(state.isPm).toBe(true);
    });
  });

  describe('processDateRanges', () => {
    it('should process date ranges object', () => {
      const ranges = {
        'Today': [new Date(2025, 5, 15), new Date(2025, 5, 15)] as [DateInput, DateInput],
        'This Week': [new Date(2025, 5, 10), new Date(2025, 5, 16)] as [DateInput, DateInput]
      };

      const result = processDateRanges(ranges);

      expect(result).not.toBeNull();
      if (result) {
        expect(Object.keys(result).length).toBe(2);
        expect(result['Today']).toBeDefined();
        expect(result['This Week']).toBeDefined();
        expect(result['Today'][0]).toBeInstanceOf(Date);
        expect(result['Today'][1]).toBeInstanceOf(Date);
      }
    });
  });

  describe('generateYearGrid', () => {
    it('should generate year grid with 12 years', () => {
      const grid = generateYearGrid(2025);

      expect(grid.length).toBe(12);
      expect(grid[0]).toBe(2019);
      expect(grid[11]).toBe(2030);
    });
  });

  describe('generateDecadeGrid', () => {
    it('should generate decade grid', () => {
      const grid = generateDecadeGrid(2025);

      expect(grid.length).toBe(12);
      expect(grid[0]).toBe(2015);
      expect(grid[11]).toBe(2025 + (11 * 10) - 10);
    });
  });
});

