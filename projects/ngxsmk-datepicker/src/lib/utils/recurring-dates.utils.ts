import { getStartOfDay, getEndOfDay } from './date.utils';

export type RecurringPattern = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'weekdays' | 'weekends' | 'custom';

export interface RecurringDateConfig {
  pattern: RecurringPattern;
  startDate: Date;
  endDate?: Date;
  occurrences?: number;
  dayOfWeek?: number;
  dayOfMonth?: number;
  monthAndDay?: { month: number; day: number };
  interval?: number;
}

export function generateRecurringDates(config: RecurringDateConfig): Date[] {
  const dates: Date[] = [];
  const interval = config.interval || 1;
  const startDate = getStartOfDay(config.startDate);
  const endDate = config.endDate ? getEndOfDay(config.endDate) : null;

  if (!Number.isFinite(startDate.getTime()) || (endDate && !Number.isFinite(endDate.getTime()))) return dates;
  if (!Number.isInteger(interval) || interval < 1) return dates;

  const currentDate = new Date(startDate);
  let count = 0;
  const maxOccurrences = config.occurrences || (endDate ? 365 : 10);

  switch (config.pattern) {
    case 'daily': {
      while (count < maxOccurrences) {
        if (endDate && currentDate > endDate) break;
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + interval);
        count++;
      }
      break;
    }

    case 'weekly': {
      const targetDay = config.dayOfWeek ?? startDate.getDay();
      if (!Number.isInteger(targetDay) || targetDay < 0 || targetDay > 6) break;
      const daysUntilTarget = (targetDay - currentDate.getDay() + 7) % 7;
      currentDate.setDate(currentDate.getDate() + daysUntilTarget);
      while (count < maxOccurrences && Number.isFinite(currentDate.getTime())) {
        if (endDate && currentDate > endDate) break;
        dates.push(new Date(currentDate));
        count++;
        currentDate.setDate(currentDate.getDate() + 7 * interval);
      }
      break;
    }

    case 'monthly': {
      const targetDay = config.dayOfMonth || startDate.getDate();
      if (!Number.isInteger(targetDay) || targetDay < 1 || targetDay > 31) break;
      while (count < maxOccurrences && Number.isFinite(currentDate.getTime())) {
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const dayToSet = Math.min(targetDay, lastDayOfMonth);
        currentDate.setDate(dayToSet);
        if (endDate && currentDate > endDate) break;
        if (currentDate >= startDate && Number.isFinite(currentDate.getTime())) {
          dates.push(new Date(currentDate));
          count++;
        }
        currentDate.setMonth(currentDate.getMonth() + interval, 1);
      }
      break;
    }

    case 'yearly': {
      const monthDay = config.monthAndDay || { month: startDate.getMonth(), day: startDate.getDate() };
      if (
        !Number.isInteger(monthDay.month) ||
        monthDay.month < 0 ||
        monthDay.month > 11 ||
        !Number.isInteger(monthDay.day) ||
        monthDay.day < 1 ||
        monthDay.day > 31
      )
        break;
      for (let year = startDate.getFullYear(); count < maxOccurrences; year += interval) {
        currentDate.setFullYear(year, monthDay.month, monthDay.day);
        if (!Number.isFinite(currentDate.getTime()) || (endDate && currentDate > endDate)) break;
        if (currentDate >= startDate) {
          dates.push(new Date(currentDate));
          count++;
        }
      }
      break;
    }

    case 'weekdays':
      while (count < maxOccurrences && Number.isFinite(currentDate.getTime())) {
        if (endDate && currentDate > endDate) break;
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          dates.push(new Date(currentDate));
          count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      break;

    case 'weekends':
      while (count < maxOccurrences && Number.isFinite(currentDate.getTime())) {
        if (endDate && currentDate > endDate) break;
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          dates.push(new Date(currentDate));
          count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      break;

    default:
      break;
  }

  return dates;
}

export function matchesRecurringPattern(date: Date, config: RecurringDateConfig): boolean {
  const generatedDates = generateRecurringDates(config);
  const dateTime = getStartOfDay(date).getTime();
  return generatedDates.some((d) => getStartOfDay(d).getTime() === dateTime);
}
