import { DatepickerValue } from './calendar.utils';

export interface ExportOptions {
  includeTime?: boolean;
  dateFormat?: string;
  timezone?: string;
  csvHeaders?: string[];
}

export function exportToJson(value: DatepickerValue, options: ExportOptions = {}): string {
  const data = serializeDateValue(value, options);
  return JSON.stringify(data, null, 2);
}

export function importFromJson(jsonString: string): DatepickerValue {
  try {
    const data = JSON.parse(jsonString);
    return deserializeDateValue(data);
  } catch (error) {
    throw new Error(`Invalid JSON format: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function exportToCsv(value: DatepickerValue, options: ExportOptions = {}): string {
  const { csvHeaders = ['Type', 'Date', 'Time'] } = options;
  const rows: string[][] = [csvHeaders];

  if (value === null || value === undefined) {
    return rows.map(row => row.join(',')).join('\n');
  }

  if (value instanceof Date) {
    const dateStr = formatDateForExport(value, options);
    const timeStr = options.includeTime ? formatTimeForExport(value) : '';
    rows.push(['Single Date', dateStr, timeStr]);
  } else if (Array.isArray(value)) {
    value.forEach(date => {
      if (date instanceof Date) {
        const dateStr = formatDateForExport(date, options);
        const timeStr = options.includeTime ? formatTimeForExport(date) : '';
        rows.push(['Multiple Date', dateStr, timeStr]);
      }
    });
  } else if (typeof value === 'object' && 'start' in value && 'end' in value) {
    const range = value as { start: Date | null; end: Date | null };
    if (range.start instanceof Date) {
      const startDateStr = formatDateForExport(range.start, options);
      const startTimeStr = options.includeTime ? formatTimeForExport(range.start) : '';
      rows.push(['Range Start', startDateStr, startTimeStr]);
    }
    if (range.end instanceof Date) {
      const endDateStr = formatDateForExport(range.end, options);
      const endTimeStr = options.includeTime ? formatTimeForExport(range.end) : '';
      rows.push(['Range End', endDateStr, endTimeStr]);
    }
  }

  return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}

export function importFromCsv(csvString: string): DatepickerValue {
  const lines = csvString.trim().split('\n');
  if (lines.length < 2) {
    return null;
  }

  const dataRows = lines.slice(1);
  const dates: Date[] = [];
  let rangeStart: Date | null = null;
  let rangeEnd: Date | null = null;

  for (const row of dataRows) {
    const cells = row.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
    if (cells.length < 2) continue;

    const type = cells[0];
    const dateStr = cells[1];
    const timeStr = cells[2] || '';

    if (!dateStr) continue;

    try {
      const date = parseDateFromString(dateStr, timeStr);

      if (type === 'Single Date' || type === 'Multiple Date') {
        dates.push(date);
      } else if (type === 'Range Start') {
        rangeStart = date;
      } else if (type === 'Range End') {
        rangeEnd = date;
      }
    } catch {
      // Silently handle parse errors
    }
  }

  if (rangeStart && rangeEnd) {
    return { start: rangeStart, end: rangeEnd };
  } else if (dates.length === 1) {
    return dates[0] || null;
  } else if (dates.length > 1) {
    return dates;
  }

  return null;
}

export function exportToIcs(value: DatepickerValue, options: ExportOptions & {
  summary?: string;
  description?: string;
  location?: string;
} = {}): string {
  const { summary = 'Date Selection', description = '', location = '' } = options;
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ngxsmk-datepicker//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  if (value === null || value === undefined) {
    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  if (value instanceof Date) {
    lines.push(...createIcsEvent(value, value, summary, description, location));
  } else if (Array.isArray(value)) {
    value.forEach((date, index) => {
      if (date instanceof Date) {
        lines.push(...createIcsEvent(
          date,
          date,
          `${summary} ${index + 1}`,
          description,
          location
        ));
      }
    });
  } else if (typeof value === 'object' && 'start' in value && 'end' in value) {
    const range = value as { start: Date | null; end: Date | null };
    if (range.start instanceof Date && range.end instanceof Date) {
      lines.push(...createIcsEvent(range.start, range.end, summary, description, location));
    }
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function importFromIcs(icsString: string): DatepickerValue {
  const lines = icsString.split(/\r?\n/);
  const events: Array<{ start: Date; end: Date }> = [];
  let currentEvent: { start?: Date; end?: Date; dtstart?: string; dtend?: string } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;

    if (line === 'BEGIN:VEVENT') {
      currentEvent = {};
    } else if (line === 'END:VEVENT' && currentEvent) {
      if (currentEvent.dtstart && currentEvent.dtend) {
        try {
          const start = parseIcsDate(currentEvent.dtstart);
          const end = parseIcsDate(currentEvent.dtend);
          events.push({ start, end });
        } catch {
          // Silently handle parse errors
        }
      }
      currentEvent = null;
    } else if (currentEvent && line.startsWith('DTSTART')) {
      currentEvent.dtstart = extractIcsValue(line);
    } else if (currentEvent && line.startsWith('DTEND')) {
      currentEvent.dtend = extractIcsValue(line);
    }
  }

  if (events.length === 0) {
    return null;
  } else if (events.length === 1) {
    const event = events[0];
    if (!event) return null;
    if (event.start.getTime() === event.end.getTime()) {
      return event.start;
    }
    return { start: event.start, end: event.end };
  } else {
    return events.map(e => e.start).filter((d): d is Date => d instanceof Date);
  }
}



function serializeDateValue(value: DatepickerValue, options: ExportOptions): unknown {
  if (value === null || value === undefined) {
    return null;
  }

  if (value instanceof Date) {
    return {
      type: 'single',
      date: formatDateForExport(value, options),
      time: options.includeTime ? formatTimeForExport(value) : undefined,
      iso: value.toISOString(),
    };
  }

  if (Array.isArray(value)) {
    return {
      type: 'multiple',
      dates: value.map(date => ({
        date: formatDateForExport(date, options),
        time: options.includeTime ? formatTimeForExport(date) : undefined,
        iso: date.toISOString(),
      })),
    };
  }

  if (typeof value === 'object' && 'start' in value && 'end' in value) {
    const range = value as { start: Date | null; end: Date | null };
    if (range.start instanceof Date && range.end instanceof Date) {
      return {
        type: 'range',
        start: {
          date: formatDateForExport(range.start, options),
          time: options.includeTime ? formatTimeForExport(range.start) : undefined,
          iso: range.start.toISOString(),
        },
        end: {
          date: formatDateForExport(range.end, options),
          time: options.includeTime ? formatTimeForExport(range.end) : undefined,
          iso: range.end.toISOString(),
        },
      };
    }
  }

  return null;
}

function deserializeDateValue(data: unknown): DatepickerValue {
  if (!data || data === null) {
    return null;
  }

  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;

    if (obj['type'] === 'single' && typeof obj['iso'] === 'string') {
      return new Date(obj['iso']);
    }

    if (obj['type'] === 'multiple' && Array.isArray(obj['dates'])) {
      return (obj['dates'] as unknown[])
        .map((d: unknown) => {
          if (typeof d === 'object' && d !== null && 'iso' in d && typeof (d as { iso: unknown }).iso === 'string') {
            return new Date((d as { iso: string }).iso);
          }
          return null;
        })
        .filter((d: Date | null) => d !== null) as Date[];
    }

    if (obj['type'] === 'range' &&
      typeof obj['start'] === 'object' && obj['start'] !== null && 'iso' in (obj['start'] as Record<string, unknown>) &&
      typeof obj['end'] === 'object' && obj['end'] !== null && 'iso' in (obj['end'] as Record<string, unknown>)) {
      const startObj = obj['start'] as Record<string, unknown>;
      const endObj = obj['end'] as Record<string, unknown>;
      if (typeof startObj['iso'] === 'string' && typeof endObj['iso'] === 'string') {
        return {
          start: new Date(startObj['iso']),
          end: new Date(endObj['iso']),
        };
      }
    }
  }

  return null;
}

function formatDateForExport(date: Date | null | undefined, options: ExportOptions): string {
  if (!date) return '';
  if (options.dateFormat) {
    return formatDate(date, options.dateFormat);
  }
  const isoString = date.toISOString();
  const datePart = isoString.split('T')[0];
  return datePart || '';
}

function formatTimeForExport(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function formatDate(date: Date, format: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('YY', String(year).slice(-2))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

function parseDateFromString(dateStr: string, timeStr: string): Date {
  if (dateStr.includes('T') || dateStr.includes(' ')) {
    return new Date(dateStr + (timeStr ? ' ' + timeStr : ''));
  }

  const dateMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    const year = dateMatch[1];
    const month = dateMatch[2];
    const day = dateMatch[3];
    if (year && month && day) {
      const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));

      if (timeStr) {
        const timeMatch = timeStr.match(/(\d{2}):(\d{2}):(\d{2})/);
        if (timeMatch) {
          const hours = timeMatch[1];
          const minutes = timeMatch[2];
          const seconds = timeMatch[3];
          if (hours && minutes && seconds) {
            date.setHours(parseInt(hours, 10), parseInt(minutes, 10), parseInt(seconds, 10));
          }
        }
      }

      return date;
    }
  }

  return new Date(dateStr + (timeStr ? ' ' + timeStr : ''));
}

function createIcsEvent(
  start: Date,
  end: Date,
  summary: string,
  description: string,
  location: string
): string[] {
  const formatIcsDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const lines = [
    'BEGIN:VEVENT',
    `UID:${Date.now()}-${Math.random().toString(36).substr(2, 9)}@ngxsmk-datepicker`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(summary)}`,
  ];

  if (description) {
    lines.push(`DESCRIPTION:${escapeIcsText(description)}`);
  }

  if (location) {
    lines.push(`LOCATION:${escapeIcsText(location)}`);
  }

  lines.push('END:VEVENT');
  return lines;
}

function parseIcsDate(icsDate: string): Date {
  const cleanDate = icsDate.replace(/Z$/, '');
  const match = cleanDate.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/);
  if (match) {
    const year = match[1];
    const month = match[2];
    const day = match[3];
    const hour = match[4];
    const minute = match[5];
    const second = match[6];
    if (year && month && day && hour && minute && second) {
      return new Date(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10),
        parseInt(hour, 10),
        parseInt(minute, 10),
        parseInt(second, 10)
      );
    }
  }
  throw new Error(`Invalid ICS date format: ${icsDate}`);
}

function extractIcsValue(line: string): string {
  const colonIndex = line.indexOf(':');
  return colonIndex >= 0 ? line.substring(colonIndex + 1) : '';
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

