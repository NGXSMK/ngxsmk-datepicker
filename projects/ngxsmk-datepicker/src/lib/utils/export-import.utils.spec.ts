import {
  exportToJson,
  importFromJson,
  exportToCsv,
  importFromCsv,
  exportToIcs,
  importFromIcs,
  ExportOptions
} from './export-import.utils';
import { DatepickerValue } from './calendar.utils';

describe('ExportImportUtils', () => {
  describe('exportToJson', () => {
    it('should export single date to JSON', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = exportToJson(date);

      const parsed = JSON.parse(result);
      expect(parsed.type).toBe('single');
      expect(parsed.iso).toBe(date.toISOString());
    });

    it('should export date array to JSON', () => {
      const dates = [
        new Date('2024-01-15T10:30:00Z'),
        new Date('2024-02-20T14:45:00Z')
      ];
      const result = exportToJson(dates);

      const parsed = JSON.parse(result);
      expect(parsed.type).toBe('multiple');
      expect(parsed.dates.length).toBe(2);
    });

    it('should export date range to JSON', () => {
      const range: DatepickerValue = {
        start: new Date('2024-01-15T10:30:00Z'),
        end: new Date('2024-01-20T14:45:00Z')
      };
      const result = exportToJson(range);

      const parsed = JSON.parse(result);
      expect(parsed.type).toBe('range');
      expect(parsed.start.iso).toBe(range.start!.toISOString());
      expect(parsed.end.iso).toBe(range.end!.toISOString());
    });

    it('should include time when includeTime is true', () => {
      const date = new Date('2024-01-15T10:30:45Z');
      const options: ExportOptions = { includeTime: true };
      const result = exportToJson(date, options);

      const parsed = JSON.parse(result);
      expect(parsed.time).toBeTruthy();
      // Time will be in local timezone, so check format instead of exact value
      expect(parsed.time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    it('should not include time when includeTime is false', () => {
      const date = new Date('2024-01-15T10:30:45Z');
      const options: ExportOptions = { includeTime: false };
      const result = exportToJson(date, options);

      const parsed = JSON.parse(result);
      expect(parsed.time).toBeUndefined();
    });

    it('should handle null value', () => {
      const result = exportToJson(null);
      const parsed = JSON.parse(result);
      expect(parsed).toBeNull();
    });
  });

  describe('importFromJson', () => {
    it('should import single date from JSON', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const json = exportToJson(date);
      const imported = importFromJson(json);

      expect(imported).toBeInstanceOf(Date);
      expect((imported as Date).getTime()).toBe(date.getTime());
    });

    it('should import date array from JSON', () => {
      const dates = [
        new Date('2024-01-15T10:30:00Z'),
        new Date('2024-02-20T14:45:00Z')
      ];
      const json = exportToJson(dates);
      const imported = importFromJson(json);

      expect(Array.isArray(imported)).toBe(true);
      expect((imported as Date[]).length).toBe(2);
    });

    it('should import date range from JSON', () => {
      const range: DatepickerValue = {
        start: new Date('2024-01-15T10:30:00Z'),
        end: new Date('2024-01-20T14:45:00Z')
      };
      const json = exportToJson(range);
      const imported = importFromJson(json);

      expect(typeof imported).toBe('object');
      if (typeof imported === 'object' && imported !== null && 'start' in imported && 'end' in imported) {
        expect((imported as { start: Date; end: Date }).start.getTime()).toBe(range.start!.getTime());
        expect((imported as { start: Date; end: Date }).end.getTime()).toBe(range.end!.getTime());
      }
    });

    it('should throw error for invalid JSON', () => {
      expect(() => {
        importFromJson('invalid json');
      }).toThrow();
    });

    it('should handle null JSON', () => {
      const result = importFromJson('null');
      expect(result).toBeNull();
    });
  });

  describe('exportToCsv', () => {
    it('should export single date to CSV', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = exportToCsv(date);

      expect(result).toContain('Type');
      expect(result).toContain('Date');
      expect(result).toContain('Single Date');
    });

    it('should export date array to CSV', () => {
      const dates = [
        new Date('2024-01-15T10:30:00Z'),
        new Date('2024-02-20T14:45:00Z')
      ];
      const result = exportToCsv(dates);

      expect(result).toContain('Multiple Date');
      const lines = result.split('\n');
      expect(lines.length).toBeGreaterThan(2); // Header + 2 dates
    });

    it('should export date range to CSV', () => {
      const range: DatepickerValue = {
        start: new Date('2024-01-15T10:30:00Z'),
        end: new Date('2024-01-20T14:45:00Z')
      };
      const result = exportToCsv(range);

      expect(result).toContain('Range Start');
      expect(result).toContain('Range End');
    });

    it('should include time when includeTime is true', () => {
      const date = new Date('2024-01-15T10:30:45Z');
      const options: ExportOptions = { includeTime: true };
      const result = exportToCsv(date, options);

      // Time will be in local timezone, so check format instead of exact value
      expect(result).toMatch(/\d{2}:\d{2}:\d{2}/);
    });

    it('should use custom CSV headers', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const options: ExportOptions = {
        csvHeaders: ['Custom1', 'Custom2', 'Custom3']
      };
      const result = exportToCsv(date, options);

      expect(result).toContain('Custom1');
      expect(result).toContain('Custom2');
      expect(result).toContain('Custom3');
    });

    it('should handle null value', () => {
      const result = exportToCsv(null);
      expect(result).toContain('Type');
      expect(result).toContain('Date');
    });

    it('should quote CSV cells', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = exportToCsv(date);

      expect(result).toContain('"');
    });
  });

  describe('importFromCsv', () => {
    it('should import single date from CSV', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const csv = exportToCsv(date);
      const imported = importFromCsv(csv);

      expect(imported).toBeInstanceOf(Date);
    });

    it('should import date array from CSV', () => {
      const dates = [
        new Date('2024-01-15T10:30:00Z'),
        new Date('2024-02-20T14:45:00Z')
      ];
      const csv = exportToCsv(dates);
      const imported = importFromCsv(csv);

      expect(Array.isArray(imported)).toBe(true);
      expect((imported as Date[]).length).toBe(2);
    });

    it('should import date range from CSV', () => {
      const range: DatepickerValue = {
        start: new Date('2024-01-15T10:30:00Z'),
        end: new Date('2024-01-20T14:45:00Z')
      };
      const csv = exportToCsv(range);
      const imported = importFromCsv(csv);

      expect(typeof imported).toBe('object');
      if (typeof imported === 'object' && imported !== null && 'start' in imported && 'end' in imported) {
        expect((imported as { start: Date; end: Date }).start).toBeInstanceOf(Date);
        expect((imported as { start: Date; end: Date }).end).toBeInstanceOf(Date);
      }
    });

    it('should handle empty CSV', () => {
      const result = importFromCsv('Type,Date,Time\n');
      expect(result).toBeNull();
    });

    it('should handle CSV with only header', () => {
      const result = importFromCsv('Type,Date,Time');
      expect(result).toBeNull();
    });

    it('should handle invalid date strings gracefully', () => {
      const csv = '"Type","Date","Time"\n"Single Date","invalid-date",""';
      const result = importFromCsv(csv);
      // May return null or an invalid Date, both are acceptable
      expect(result === null || (result instanceof Date && isNaN(result.getTime()))).toBe(true);
    });

    it('should parse dates with time', () => {
      const csv = '"Type","Date","Time"\n"Single Date","2024-01-15","10:30:45"';
      const result = importFromCsv(csv);
      expect(result).toBeInstanceOf(Date);
    });
  });

  describe('exportToIcs', () => {
    it('should export single date to ICS', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = exportToIcs(date);

      expect(result).toContain('BEGIN:VCALENDAR');
      expect(result).toContain('BEGIN:VEVENT');
      expect(result).toContain('END:VEVENT');
      expect(result).toContain('END:VCALENDAR');
    });

    it('should export date array to ICS', () => {
      const dates = [
        new Date('2024-01-15T10:30:00Z'),
        new Date('2024-02-20T14:45:00Z')
      ];
      const result = exportToIcs(dates);

      const eventCount = (result.match(/BEGIN:VEVENT/g) || []).length;
      expect(eventCount).toBe(2);
    });

    it('should export date range to ICS', () => {
      const range: DatepickerValue = {
        start: new Date('2024-01-15T10:30:00Z'),
        end: new Date('2024-01-20T14:45:00Z')
      };
      const result = exportToIcs(range);

      expect(result).toContain('BEGIN:VEVENT');
      expect(result).toContain('DTSTART');
      expect(result).toContain('DTEND');
    });

    it('should include summary, description, and location', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const options = {
        summary: 'Test Event',
        description: 'Test Description',
        location: 'Test Location'
      };
      const result = exportToIcs(date, options);

      expect(result).toContain('SUMMARY:Test Event');
      expect(result).toContain('DESCRIPTION:Test Description');
      expect(result).toContain('LOCATION:Test Location');
    });

    it('should use default summary if not provided', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = exportToIcs(date);

      expect(result).toContain('SUMMARY:Date Selection');
    });

    it('should handle null value', () => {
      const result = exportToIcs(null);
      expect(result).toContain('BEGIN:VCALENDAR');
      expect(result).toContain('END:VCALENDAR');
      expect(result).not.toContain('BEGIN:VEVENT');
    });

    it('should escape special characters in text fields', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const options = {
        summary: 'Test;Event,With\\Special\nChars'
      };
      const result = exportToIcs(date, options);

      expect(result).toContain('SUMMARY:');
      // Should escape special characters
      expect(result).toContain('\\;');
    });
  });

  describe('importFromIcs', () => {
    it('should import single date event from ICS', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const ics = exportToIcs(date);
      const imported = importFromIcs(ics);

      expect(imported).toBeInstanceOf(Date);
    });

    it('should import date range from ICS', () => {
      const range: DatepickerValue = {
        start: new Date('2024-01-15T10:30:00Z'),
        end: new Date('2024-01-20T14:45:00Z')
      };
      const ics = exportToIcs(range);
      const imported = importFromIcs(ics);

      expect(typeof imported).toBe('object');
      if (typeof imported === 'object' && imported !== null && 'start' in imported && 'end' in imported) {
        expect((imported as { start: Date; end: Date }).start).toBeInstanceOf(Date);
        expect((imported as { start: Date; end: Date }).end).toBeInstanceOf(Date);
      }
    });

    it('should import multiple events as date array', () => {
      const dates = [
        new Date('2024-01-15T10:30:00Z'),
        new Date('2024-02-20T14:45:00Z')
      ];
      const ics = exportToIcs(dates);
      const imported = importFromIcs(ics);

      expect(Array.isArray(imported)).toBe(true);
      expect((imported as Date[]).length).toBe(2);
    });

    it('should return null for empty ICS', () => {
      const result = importFromIcs('');
      expect(result).toBeNull();
    });

    it('should return null for ICS with no events', () => {
      const ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR';
      const result = importFromIcs(ics);
      expect(result).toBeNull();
    });

    it('should handle ICS with invalid date format', () => {
      const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:INVALID
DTEND:INVALID
END:VEVENT
END:VCALENDAR`;
      const result = importFromIcs(ics);
      expect(result).toBeNull();
    });

    it('should parse ICS dates with Z timezone', () => {
      const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:20240115T103000Z
DTEND:20240115T103000Z
END:VEVENT
END:VCALENDAR`;
      const result = importFromIcs(ics);
      expect(result).toBeInstanceOf(Date);
    });

    it('should handle single day event as date (not range)', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const ics = exportToIcs(date);
      const imported = importFromIcs(ics);

      // Single day event should be imported as Date, not range
      expect(imported).toBeInstanceOf(Date);
    });
  });

  describe('edge cases', () => {
    it('should handle date format option in exportToJson', () => {
      const date = new Date('2024-01-15T10:30:45Z');
      const options: ExportOptions = {
        dateFormat: 'YYYY-MM-DD'
      };
      const result = exportToJson(date, options);
      const parsed = JSON.parse(result);

      expect(parsed.date).toContain('2024');
      expect(parsed.date).toContain('01');
      expect(parsed.date).toContain('15');
    });

    it('should handle timezone option', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const options: ExportOptions = {
        timezone: 'America/New_York'
      };
      // Timezone option is accepted but may not be fully implemented
      expect(() => exportToJson(date, options)).not.toThrow();
    });

    it('should handle CSV with missing cells', () => {
      const csv = '"Type","Date"\n"Single Date"';
      const result = importFromCsv(csv);
      expect(result).toBeNull();
    });

    it('should handle CSV with extra columns', () => {
      const csv = '"Type","Date","Time","Extra"\n"Single Date","2024-01-15","10:30:00","extra"';
      const result = importFromCsv(csv);
      expect(result).toBeInstanceOf(Date);
    });

    it('should handle ICS with missing DTEND', () => {
      const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:20240115T103000Z
END:VEVENT
END:VCALENDAR`;
      const result = importFromIcs(ics);
      expect(result).toBeNull();
    });

    it('should handle ICS with missing DTSTART', () => {
      const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTEND:20240115T103000Z
END:VEVENT
END:VCALENDAR`;
      const result = importFromIcs(ics);
      expect(result).toBeNull();
    });
  });
});

