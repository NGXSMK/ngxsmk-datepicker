import { DateInput, normalizeDate } from './date.utils';

export interface HolidayProvider {
  isHoliday(date: Date): boolean;
  getHolidayLabel?(date: Date): string | null;
}

export interface DateRange {
  [key: string]: [DateInput, DateInput];
}

export type DatepickerValue =
  | Date
  | { start: Date | null; end: Date | null }
  | Date[]
  | null;

export function generateMonthOptions(
  locale: string,
  year: number,
): { label: string; value: number }[] {
  return Array.from({ length: 12 }).map((_, i) => ({
    label: new Date(year, i, 1).toLocaleDateString(locale, { month: 'long' }),
    value: i,
  }));
}

/**
 * Format a number using locale-aware number formatting.
 * Uses Intl.NumberFormat for proper localization of numeric separators and decimals.
 *
 * @param value - The number to format
 * @param locale - The locale to use for formatting (e.g., 'en-US', 'de-DE', 'fr-FR')
 * @param options - Optional Intl.NumberFormatOptions for customization
 * @returns Formatted number string
 */
export function formatLocaleNumber(
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions,
): string {
  try {
    const formatter = new Intl.NumberFormat(locale, {
      useGrouping: true,
      minimumIntegerDigits: 1,
      ...options,
    });
    return formatter.format(value);
  } catch {
    // Fallback for invalid locale
    return String(value);
  }
}

export function generateYearOptions(
  currentYear: number,
  range: number = 10,
  locale?: string,
): { label: string; value: number }[] {
  const startYear = currentYear - range;
  const endYear = currentYear + range;
  const options: { label: string; value: number }[] = [];

  for (let i = startYear; i <= endYear; i++) {
    // Years should not use thousand separators (e.g., "2026" not "2,026")
    const label = `${i}`;
    options.push({ label, value: i });
  }

  return options;
}

export function generateTimeOptions(
  minuteInterval: number = 1,
  secondInterval: number = 1,
  includeSeconds: boolean = false,
  use24Hour: boolean = false,
): {
  hourOptions: { label: string; value: number }[];
  minuteOptions: { label: string; value: number }[];
  secondOptions?: { label: string; value: number }[];
} {
  const hourOptions = use24Hour
    ? Array.from({ length: 24 }).map((_, i) => ({
      label: i.toString().padStart(2, '0'),
      value: i,
    }))
    : Array.from({ length: 12 }).map((_, i) => ({
      label: (i + 1).toString().padStart(2, '0'),
      value: i + 1,
    }));

  const minuteOptions: { label: string; value: number }[] = [];
  for (let i = 0; i < 60; i += minuteInterval) {
    minuteOptions.push({
      label: i.toString().padStart(2, '0'),
      value: i,
    });
  }

  const result: {
    hourOptions: { label: string; value: number }[];
    minuteOptions: { label: string; value: number }[];
    secondOptions?: { label: string; value: number }[];
  } = { hourOptions, minuteOptions };

  if (includeSeconds) {
    const secondOptions: { label: string; value: number }[] = [];
    for (let i = 0; i < 60; i += secondInterval) {
      secondOptions.push({
        label: i.toString().padStart(2, '0'),
        value: i,
      });
    }
    result.secondOptions = secondOptions;
  }

  return result;
}

export function generateWeekDays(
  locale: string,
  firstDayOfWeek: number = 0,
): string[] {
  const day = new Date(2024, 0, 7 + firstDayOfWeek);
  return Array.from({ length: 7 }).map(() => {
    const weekDay = new Date(day).toLocaleDateString(locale, {
      weekday: 'short',
    });
    day.setDate(day.getDate() + 1);
    return weekDay;
  });
}

/**
 * Determines the first day of the week (0 = Sunday, 1 = Monday, etc.) for a given locale.
 * Uses Intl.Locale API when available, with fallback to locale mapping for older browsers.
 *
 * Browser compatibility:
 * - Intl.Locale: Chrome 74+, Firefox 75+, Safari 14.1+, Node.js 13+
 * - Fallback: All browsers via locale string matching
 *
 * @param locale - Locale string (e.g., 'en-US', 'en-GB', 'de-DE')
 * @returns Day of week (0-6) where 0 is Sunday, 1 is Monday, etc.
 */
interface IntlExtended {
  Locale: {
    new(locale: string): {
      weekInfo?: {
        firstDay: number;
      };
    };
  };
}

export function getFirstDayOfWeek(locale: string): number {
  try {
    const intlExt = Intl as unknown as IntlExtended;
    if (
      typeof intlExt !== 'undefined' &&
      typeof intlExt.Locale !== 'undefined'
    ) {
      const localeObj = new intlExt.Locale(locale);
      if (
        'weekInfo' in localeObj &&
        localeObj.weekInfo?.firstDay !== undefined
      ) {
        return localeObj.weekInfo.firstDay % 7;
      }
    }

    const localeLower = locale.toLowerCase();
    if (
      localeLower.startsWith('en-gb') ||
      localeLower.startsWith('en-au') ||
      localeLower.startsWith('en-nz') ||
      localeLower.startsWith('de') ||
      localeLower.startsWith('fr') ||
      localeLower.startsWith('es') ||
      localeLower.startsWith('it') ||
      localeLower.startsWith('pt') ||
      localeLower.startsWith('nl') ||
      localeLower.startsWith('pl') ||
      localeLower.startsWith('ru') ||
      localeLower.startsWith('sv') ||
      localeLower.startsWith('no') ||
      localeLower.startsWith('da') ||
      localeLower.startsWith('fi')
    ) {
      return 1; // Monday
    }

    // Default to Sunday for en-US and other locales
    return 0;
  } catch {
    // If locale parsing fails, default based on locale string
    const localeLower = locale.toLowerCase();
    if (
      localeLower.startsWith('en-gb') ||
      localeLower.startsWith('en-au') ||
      localeLower.startsWith('en-nz')
    ) {
      return 1; // Monday
    }
    return 0; // Sunday (default for en-US and others)
  }
}

export function get24Hour(displayHour: number, isPm: boolean): number {
  if (isPm) {
    return displayHour === 12 ? 12 : displayHour + 12;
  }
  return displayHour === 12 ? 0 : displayHour;
}

export function update12HourState(fullHour: number): {
  isPm: boolean;
  displayHour: number;
} {
  return {
    isPm: fullHour >= 12,
    displayHour: fullHour % 12 || 12,
  };
}

export function processDateRanges(
  ranges: DateRange | null,
): { [key: string]: [Date, Date] } | null {
  if (!ranges) return null;

  return Object.entries(ranges).reduce(
    (acc, [key, dates]) => {
      const start = normalizeDate(dates[0]);
      const end = normalizeDate(dates[1]);
      if (start && end) acc[key] = [start, end];
      return acc;
    },
    {} as { [key: string]: [Date, Date] },
  );
}

export function generateYearGrid(currentYear: number): number[] {
  const startYear = Math.floor(currentYear / 10) * 10 - 1;
  const years: number[] = [];
  for (let i = 0; i < 12; i++) {
    years.push(startYear + i);
  }
  return years;
}

export function generateDecadeGrid(currentDecade: number): number[] {
  const decades: number[] = [];
  for (let i = 0; i < 12; i++) {
    decades.push(currentDecade + i * 10 - 10);
  }
  return decades;
}

/**
 * Generate a large year range for virtual scrolling (100 years centered on current)
 */
export function generateLargeYearRange(
  centerYear: number,
  range: number = 100,
): number[] {
  const startYear = centerYear - Math.floor(range / 2);
  const years: number[] = [];
  for (let i = 0; i < range; i++) {
    years.push(startYear + i);
  }
  return years;
}

/**
 * Generate a large decade range for virtual scrolling (50 decades centered on current)
 */
export function generateLargeDecadeRange(
  centerDecade: number,
  range: number = 50,
): number[] {
  const startDecade = centerDecade - Math.floor(range / 2) * 10;
  const decades: number[] = [];
  for (let i = 0; i < range; i++) {
    decades.push(startDecade + i * 10);
  }
  return decades;
}
