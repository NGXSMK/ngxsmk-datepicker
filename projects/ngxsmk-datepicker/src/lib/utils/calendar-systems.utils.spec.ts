import { getSecondaryDayLabel, formatDateInCalendarSystem } from './calendar-systems.utils';

describe('calendar-systems.utils', () => {
  // 2026-07-11 (Gregorian) = Tir 20, 1405 (Persian) = Muharram-ish 26, 1448 (Islamic variants differ)
  const sample = new Date(2026, 6, 11);

  describe('getSecondaryDayLabel', () => {
    it('returns the Persian calendar day', () => {
      expect(getSecondaryDayLabel(sample, 'persian', 'en-US')).toBe('20');
    });

    it('returns a non-empty label for all supported systems', () => {
      for (const calendar of ['islamic', 'buddhist', 'japanese', 'hebrew', 'persian'] as const) {
        expect(getSecondaryDayLabel(sample, calendar, 'en-US')).not.toBe('');
      }
    });

    it('uses the locale numbering system', () => {
      const label = getSecondaryDayLabel(sample, 'islamic', 'ar-SA');
      expect(label.length).toBeGreaterThan(0);
      // Arabic-Indic digits, not ASCII
      expect(/^[0-9]+$/.test(label)).toBeFalse();
    });

    it('buddhist day-of-month matches Gregorian (offset year only)', () => {
      expect(getSecondaryDayLabel(sample, 'buddhist', 'en-US')).toBe('11');
    });
  });

  describe('formatDateInCalendarSystem', () => {
    it('formats a full Persian date', () => {
      const label = formatDateInCalendarSystem(sample, 'persian', 'en-US');
      expect(label).toContain('1405');
      expect(label).toContain('20');
    });

    it('formats a Buddhist-era year', () => {
      expect(formatDateInCalendarSystem(sample, 'buddhist', 'en-US')).toContain('2569');
    });
  });
});
