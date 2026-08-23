import { DateTime } from 'luxon';
import { z } from 'zod';

export const parseDateSchema = z.object({
  expression: z.string().describe('Natural language date expression, e.g. "tomorrow", "next Monday", "in 5 days", "2026-09-15"'),
  referenceDate: z.string().optional().describe('Optional reference date in ISO format. Defaults to now.'),
  timezone: z.string().optional().describe('Optional IANA timezone, e.g. "America/New_York", "Europe/London", "Asia/Colombo"'),
});

export const calculateDateRangeSchema = z.object({
  preset: z.enum([
    'today',
    'yesterday',
    'last_7_days',
    'last_30_days',
    'this_week',
    'last_week',
    'this_month',
    'last_month',
    'this_quarter',
    'last_quarter',
    'this_year',
  ]).optional().describe('Standard date range preset'),
  startDate: z.string().optional().describe('Custom start date in ISO format'),
  daysOffset: z.number().optional().describe('Offset in calendar days from start date'),
  businessDaysOffset: z.number().optional().describe('Offset in business/working days (Mon-Fri)'),
  timezone: z.string().optional().describe('Optional IANA timezone'),
});

export const convertTimezoneSchema = z.object({
  date: z.string().describe('ISO date-time string to convert'),
  fromTimezone: z.string().optional().describe('Source IANA timezone (defaults to system/UTC)'),
  toTimezone: z.string().describe('Target IANA timezone, e.g. "Europe/Berlin", "Asia/Tokyo"'),
});

export const getHolidaysSchema = z.object({
  year: z.number().int().describe('Calendar year (e.g. 2026)'),
  countryCode: z.string().length(2).describe('2-letter ISO country code (e.g. US, GB, DE, FR, CA, AU, LK)'),
});

export const validateDateSelectionSchema = z.object({
  date: z.union([
    z.string().describe('Single ISO date string'),
    z.object({
      start: z.string().describe('Start ISO date string'),
      end: z.string().describe('End ISO date string'),
    }),
  ]),
  minDate: z.string().optional().describe('Minimum permitted ISO date'),
  maxDate: z.string().optional().describe('Maximum permitted ISO date'),
  disabledDates: z.array(z.string()).optional().describe('List of blocked/disabled ISO date strings'),
  excludeWeekends: z.boolean().optional().describe('Whether weekend dates (Saturday/Sunday) are invalid'),
});

/**
 * Parses natural language or formatted date string using Luxon.
 */
export function handleParseDate(params: z.infer<typeof parseDateSchema>) {
  const zone = params.timezone || 'UTC';
  const ref = params.referenceDate
    ? DateTime.fromISO(params.referenceDate, { zone })
    : DateTime.now().setZone(zone);

  const expr = params.expression.trim().toLowerCase();
  let result: DateTime = ref;

  if (expr === 'today' || expr === 'now') {
    result = ref.startOf('day');
  } else if (expr === 'yesterday') {
    result = ref.minus({ days: 1 }).startOf('day');
  } else if (expr === 'tomorrow') {
    result = ref.plus({ days: 1 }).startOf('day');
  } else if (/^in\s+(\d+)\s+days?$/.test(expr)) {
    const match = expr.match(/^in\s+(\d+)\s+days?$/);
    const days = parseInt(match![1]!, 10);
    result = ref.plus({ days }).startOf('day');
  } else if (/^(\d+)\s+days?\s+ago$/.test(expr)) {
    const match = expr.match(/^(\d+)\s+days?\s+ago$/);
    const days = parseInt(match![1]!, 10);
    result = ref.minus({ days }).startOf('day');
  } else if (/^in\s+(\d+)\s+weeks?$/.test(expr)) {
    const match = expr.match(/^in\s+(\d+)\s+weeks?$/);
    const weeks = parseInt(match![1]!, 10);
    result = ref.plus({ weeks }).startOf('day');
  } else if (/^in\s+(\d+)\s+months?$/.test(expr)) {
    const match = expr.match(/^in\s+(\d+)\s+months?$/);
    const months = parseInt(match![1]!, 10);
    result = ref.plus({ months }).startOf('day');
  } else if (expr === 'next week') {
    result = ref.plus({ weeks: 1 }).startOf('day');
  } else if (expr === 'last week') {
    result = ref.minus({ weeks: 1 }).startOf('day');
  } else if (expr === 'next month') {
    result = ref.plus({ months: 1 }).startOf('month');
  } else if (expr === 'last month') {
    result = ref.minus({ months: 1 }).startOf('month');
  } else if (expr === 'start of month' || expr === 'first day of month') {
    result = ref.startOf('month');
  } else if (expr === 'end of month' || expr === 'last day of month') {
    result = ref.endOf('month').startOf('day');
  } else {
    // Attempt standard ISO or natural parsing
    const parsedIso = DateTime.fromISO(params.expression, { zone });
    if (parsedIso.isValid) {
      result = parsedIso;
    } else {
      const parsedHttp = DateTime.fromHTTP(params.expression, { zone });
      if (parsedHttp.isValid) {
        result = parsedHttp;
      } else {
        const parsedJs = DateTime.fromJSDate(new Date(params.expression), { zone });
        if (parsedJs.isValid) {
          result = parsedJs;
        } else {
          return {
            success: false,
            error: `Unable to parse natural language or formatted date: "${params.expression}"`,
          };
        }
      }
    }
  }

  return {
    success: true,
    iso: result.toISO(),
    date: result.toISODate(),
    time: result.toISOTime(),
    formatted: result.toLocaleString(DateTime.DATE_FULL),
    year: result.year,
    month: result.month,
    day: result.day,
    weekday: result.weekdayLong,
    timezone: result.zoneName,
  };
}

/**
 * Calculates date ranges based on presets or offsets.
 */
export function handleCalculateDateRange(params: z.infer<typeof calculateDateRangeSchema>) {
  const zone = params.timezone || 'UTC';
  const now = DateTime.now().setZone(zone).startOf('day');

  let start: DateTime = now;
  let end: DateTime = now;

  if (params.preset) {
    switch (params.preset) {
      case 'today':
        start = now;
        end = now;
        break;
      case 'yesterday':
        start = now.minus({ days: 1 });
        end = start;
        break;
      case 'last_7_days':
        start = now.minus({ days: 6 });
        end = now;
        break;
      case 'last_30_days':
        start = now.minus({ days: 29 });
        end = now;
        break;
      case 'this_week':
        start = now.startOf('week');
        end = now.endOf('week').startOf('day');
        break;
      case 'last_week':
        start = now.minus({ weeks: 1 }).startOf('week');
        end = now.minus({ weeks: 1 }).endOf('week').startOf('day');
        break;
      case 'this_month':
        start = now.startOf('month');
        end = now.endOf('month').startOf('day');
        break;
      case 'last_month':
        start = now.minus({ months: 1 }).startOf('month');
        end = now.minus({ months: 1 }).endOf('month').startOf('day');
        break;
      case 'this_quarter':
        start = now.startOf('quarter');
        end = now.endOf('quarter').startOf('day');
        break;
      case 'last_quarter':
        start = now.minus({ quarters: 1 }).startOf('quarter');
        end = now.minus({ quarters: 1 }).endOf('quarter').startOf('day');
        break;
      case 'this_year':
        start = now.startOf('year');
        end = now.endOf('year').startOf('day');
        break;
    }
  } else if (params.startDate) {
    start = DateTime.fromISO(params.startDate, { zone }).startOf('day');
    if (!start.isValid) {
      return { success: false, error: `Invalid startDate: ${params.startDate}` };
    }

    if (typeof params.daysOffset === 'number') {
      end = start.plus({ days: params.daysOffset });
    } else if (typeof params.businessDaysOffset === 'number') {
      let current = start;
      let added = 0;
      const target = Math.abs(params.businessDaysOffset);
      const step = params.businessDaysOffset >= 0 ? 1 : -1;

      while (added < target) {
        current = current.plus({ days: step });
        if (current.weekday <= 5) {
          added++;
        }
      }
      end = current;
    } else {
      end = start;
    }
  }

  // Ensure start <= end
  if (start > end) {
    const temp = start;
    start = end;
    end = temp;
  }

  // Calculate business days
  let count = 0;
  let cursor = start;
  while (cursor <= end) {
    if (cursor.weekday <= 5) {
      count++;
    }
    cursor = cursor.plus({ days: 1 });
  }

  const diffDays = Math.round(end.diff(start, 'days').days) + 1;

  return {
    success: true,
    startDate: start.toISODate(),
    endDate: end.toISODate(),
    formattedStart: start.toLocaleString(DateTime.DATE_FULL),
    formattedEnd: end.toLocaleString(DateTime.DATE_FULL),
    calendarDays: diffDays,
    businessDays: count,
    timezone: zone,
  };
}

/**
 * Converts timestamps across timezones.
 */
export function handleConvertTimezone(params: z.infer<typeof convertTimezoneSchema>) {
  const fromZone = params.fromTimezone || 'UTC';
  const sourceDt = DateTime.fromISO(params.date, { zone: fromZone });

  if (!sourceDt.isValid) {
    return { success: false, error: `Invalid date format: ${params.date}` };
  }

  const targetDt = sourceDt.setZone(params.toTimezone);
  if (!targetDt.isValid) {
    return { success: false, error: `Invalid target timezone: ${params.toTimezone}` };
  }

  return {
    success: true,
    sourceDate: sourceDt.toISO(),
    sourceTimezone: sourceDt.zoneName,
    targetDate: targetDt.toISO(),
    targetTimezone: targetDt.zoneName,
    targetFormatted: targetDt.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS),
    offsetDifferenceMinutes: targetDt.offset - sourceDt.offset,
    isDST: targetDt.isInDST,
  };
}

/**
 * Retrieves standard holidays for supported countries.
 */
export function handleGetHolidays(params: z.infer<typeof getHolidaysSchema>) {
  const year = params.year;
  const cc = params.countryCode.toUpperCase();

  const standardHolidays: Record<string, Array<{ name: string; date: string; type: string }>> = {
    US: [
      { name: "New Year's Day", date: `${year}-01-01`, type: 'National' },
      { name: 'Independence Day', date: `${year}-07-04`, type: 'Federal' },
      { name: 'Veterans Day', date: `${year}-11-11`, type: 'Federal' },
      { name: 'Christmas Day', date: `${year}-12-25`, type: 'Federal' },
    ],
    GB: [
      { name: "New Year's Day", date: `${year}-01-01`, type: 'Bank Holiday' },
      { name: 'Early May Bank Holiday', date: `${year}-05-04`, type: 'Bank Holiday' },
      { name: 'Christmas Day', date: `${year}-12-25`, type: 'Public' },
      { name: 'Boxing Day', date: `${year}-12-26`, type: 'Public' },
    ],
    DE: [
      { name: 'Neujahr', date: `${year}-01-01`, type: 'National' },
      { name: 'Tag der Arbeit', date: `${year}-05-01`, type: 'National' },
      { name: 'Tag der Deutschen Einheit', date: `${year}-10-03`, type: 'National' },
      { name: '1. Weihnachtstag', date: `${year}-12-25`, type: 'National' },
      { name: '2. Weihnachtstag', date: `${year}-12-26`, type: 'National' },
    ],
    FR: [
      { name: "Jour de l'An", date: `${year}-01-01`, type: 'Férié' },
      { name: 'Fête du Travail', date: `${year}-05-01`, type: 'Férié' },
      { name: 'Fête Nationale', date: `${year}-07-14`, type: 'Férié' },
      { name: 'Noël', date: `${year}-12-25`, type: 'Férié' },
    ],
    LK: [
      { name: 'Tamil Thai Pongal Day', date: `${year}-01-14`, type: 'Public/Bank' },
      { name: 'National Day (Independence)', date: `${year}-02-04`, type: 'Public/Bank/Mercantile' },
      { name: 'Sinhala & Tamil New Year Day', date: `${year}-04-14`, type: 'Public/Bank/Mercantile' },
      { name: 'Christmas Day', date: `${year}-12-25`, type: 'Public/Bank/Mercantile' },
    ],
  };

  const list = standardHolidays[cc] || [
    { name: "New Year's Day", date: `${year}-01-01`, type: 'Public' },
    { name: 'Christmas Day', date: `${year}-12-25`, type: 'Public' },
  ];

  return {
    success: true,
    year,
    countryCode: cc,
    count: list.length,
    holidays: list,
  };
}

/**
 * Validates a single date or date range against constraints.
 */
export function handleValidateDateSelection(params: z.infer<typeof validateDateSelectionSchema>) {
  const errors: string[] = [];
  const blockedSet = new Set(params.disabledDates || []);

  function validateSingle(isoStr: string, label: string) {
    const dt = DateTime.fromISO(isoStr);
    if (!dt.isValid) {
      errors.push(`${label} is not a valid ISO date.`);
      return;
    }

    if (params.minDate) {
      const minDt = DateTime.fromISO(params.minDate);
      if (minDt.isValid && dt < minDt) {
        errors.push(`${label} (${dt.toISODate()}) is before minDate (${minDt.toISODate()}).`);
      }
    }

    if (params.maxDate) {
      const maxDt = DateTime.fromISO(params.maxDate);
      if (maxDt.isValid && dt > maxDt) {
        errors.push(`${label} (${dt.toISODate()}) is after maxDate (${maxDt.toISODate()}).`);
      }
    }

    if (params.excludeWeekends && dt.weekday > 5) {
      errors.push(`${label} (${dt.toISODate()}) falls on a weekend.`);
    }

    const dayIso = dt.toISODate();
    if (dayIso && blockedSet.has(dayIso)) {
      errors.push(`${label} (${dayIso}) is in the disabled dates list.`);
    }
  }

  if (typeof params.date === 'string') {
    validateSingle(params.date, 'Selected Date');
  } else {
    validateSingle(params.date.start, 'Start Date');
    validateSingle(params.date.end, 'End Date');

    const startDt = DateTime.fromISO(params.date.start);
    const endDt = DateTime.fromISO(params.date.end);
    if (startDt.isValid && endDt.isValid && startDt > endDt) {
      errors.push(`Start date (${startDt.toISODate()}) cannot be after end date (${endDt.toISODate()}).`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
