import { DateInput, normalizeDate } from './date.utils';

export interface HolidayProvider {
  isHoliday(date: Date): boolean;
  getHolidayLabel?(date: Date): string | null;
}

export interface DateRange {
  [key: string]: [DateInput, DateInput];
}

export type DatepickerValue = Date | { start: Date, end: Date } | Date[] | null;

export function generateMonthOptions(locale: string, year: number): { label: string; value: number }[] {
  return Array.from({length: 12}).map((_, i) => ({
    label: new Date(year, i, 1).toLocaleDateString(locale, {month: 'long'}),
    value: i,
  }));
}

export function generateYearOptions(currentYear: number, range: number = 10): { label: string; value: number }[] {
  const startYear = currentYear - range;
  const endYear = currentYear + range;
  const options: { label: string; value: number }[] = [];
  
  for (let i = startYear; i <= endYear; i++) {
    options.push({label: `${i}`, value: i});
  }
  
  return options;
}

export function generateTimeOptions(minuteInterval: number = 1, secondInterval: number = 1, includeSeconds: boolean = false): {
  hourOptions: { label: string; value: number }[];
  minuteOptions: { label: string; value: number }[];
  secondOptions?: { label: string; value: number }[];
} {
  const hourOptions = Array.from({length: 12}).map((_, i) => ({
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

export function generateWeekDays(locale: string, firstDayOfWeek: number = 0): string[] {
  const day = new Date(2024, 0, 7 + firstDayOfWeek);
  return Array.from({length: 7}).map(() => {
    const weekDay = new Date(day).toLocaleDateString(locale, {weekday: 'short'});
    day.setDate(day.getDate() + 1);
    return weekDay;
  });
}

export function getFirstDayOfWeek(locale: string): number {
  try {
    return ((new Intl.Locale(locale) as { weekInfo?: { firstDay?: number } }).weekInfo?.firstDay || 0) % 7;
  } catch {
    return 0;
  }
}

export function get24Hour(displayHour: number, isPm: boolean): number {
  if (isPm) { return displayHour === 12 ? 12 : displayHour + 12; }
  return displayHour === 12 ? 0 : displayHour;
}

export function update12HourState(fullHour: number): { isPm: boolean; displayHour: number } {
  return {
    isPm: fullHour >= 12,
    displayHour: fullHour % 12 || 12
  };
}

export function processDateRanges(ranges: DateRange | null): { [key: string]: [Date, Date] } | null {
  if (!ranges) return null;
  
  return Object.entries(ranges).reduce((acc, [key, dates]) => {
    const start = normalizeDate(dates[0]);
    const end = normalizeDate(dates[1]);
    if (start && end) acc[key] = [start, end];
    return acc;
  }, {} as { [key: string]: [Date, Date] });
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
    decades.push(currentDecade + (i * 10) - 10);
  }
  return decades;
}

/**
 * Generate a large year range for virtual scrolling (100 years centered on current)
 */
export function generateLargeYearRange(centerYear: number, range: number = 100): number[] {
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
export function generateLargeDecadeRange(centerDecade: number, range: number = 50): number[] {
  const startDecade = centerDecade - Math.floor(range / 2) * 10;
  const decades: number[] = [];
  for (let i = 0; i < range; i++) {
    decades.push(startDecade + (i * 10));
  }
  return decades;
}