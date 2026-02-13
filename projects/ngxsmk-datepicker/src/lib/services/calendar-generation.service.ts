import { Injectable } from '@angular/core';
import { DateInput } from '../utils/date.utils';

export interface CalendarMonth {
  month: number;
  year: number;
  days: (Date | null)[];
}

@Injectable()
export class CalendarGenerationService {
  private monthCache = new Map<string, (Date | null)[]>();
  private readonly MAX_CACHE_SIZE = 24; // Cache up to 24 months (2 years)

  /**
   * Generate calendar days for a specific month
   */
  generateMonthDays(
    year: number,
    month: number,
    firstDayOfWeek: number,
    normalizeDateFn: (date: DateInput | null) => Date | null
  ): (Date | null)[] {
    const cacheKey = `${year}-${month}-${firstDayOfWeek}`;
    let days = this.monthCache.get(cacheKey);

    if (!days) {
      days = this._generateMonthDays(year, month, firstDayOfWeek, normalizeDateFn);

      // Add to cache and manage cache size
      if (this.monthCache.size >= this.MAX_CACHE_SIZE) {
        // Remove oldest entry (first key in Map)
        const firstKey = this.monthCache.keys().next().value;
        if (firstKey) {
          this.monthCache.delete(firstKey);
        }
      }
      this.monthCache.set(cacheKey, days);
    }

    return days;
  }

  /**
   * Generate multiple calendar months
   */
  generateMultipleMonths(
    startYear: number,
    startMonth: number,
    count: number,
    firstDayOfWeek: number,
    normalizeDateFn: (date: DateInput | null) => Date | null
  ): CalendarMonth[] {
    const months: CalendarMonth[] = [];

    for (let calIndex = 0; calIndex < count; calIndex++) {
      const calMonth = (startMonth + calIndex) % 12;
      const calYear = startYear + Math.floor((startMonth + calIndex) / 12);
      const days = this.generateMonthDays(calYear, calMonth, firstDayOfWeek, normalizeDateFn);

      months.push({
        month: calMonth,
        year: calYear,
        days: days
      });
    }

    return months;
  }

  /**
   * Preload adjacent months for smoother navigation
   */
  preloadAdjacentMonths(
    currentYear: number,
    currentMonth: number,
    firstDayOfWeek: number,
    normalizeDateFn: (date: DateInput | null) => Date | null
  ): void {
    const monthsToPreload = [
      { year: currentMonth === 0 ? currentYear - 1 : currentYear, month: currentMonth === 0 ? 11 : currentMonth - 1 },
      { year: currentMonth === 11 ? currentYear + 1 : currentYear, month: currentMonth === 11 ? 0 : currentMonth + 1 }
    ];

    for (const { year, month } of monthsToPreload) {
      const cacheKey = `${year}-${month}-${firstDayOfWeek}`;
      if (!this.monthCache.has(cacheKey)) {
        const days = this._generateMonthDays(year, month, firstDayOfWeek, normalizeDateFn);
        if (this.monthCache.size >= this.MAX_CACHE_SIZE) {
          const firstKey = this.monthCache.keys().next().value;
          if (firstKey) {
            this.monthCache.delete(firstKey);
          }
        }
        this.monthCache.set(cacheKey, days);
      }
    }
  }

  /**
   * Clear the month cache
   */
  clearCache(): void {
    this.monthCache.clear();
  }

  /**
   * Internal method to generate days for a month
   */
  private _generateMonthDays(
    year: number,
    month: number,
    firstDayOfWeek: number,
    normalizeDateFn: (date: DateInput | null) => Date | null
  ): (Date | null)[] {
    const days: (Date | null)[] = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDayOfMonth.getDay();
    const emptyCellCount = (startDayOfWeek - firstDayOfWeek + 7) % 7;

    const previousMonth = month === 0 ? 11 : month - 1;
    const previousYear = month === 0 ? year - 1 : year;
    const lastDayOfPreviousMonth = new Date(previousYear, previousMonth + 1, 0);

    // Add days from previous month
    for (let i = 0; i < emptyCellCount; i++) {
      const dayNumber = lastDayOfPreviousMonth.getDate() - emptyCellCount + i + 1;
      days.push(normalizeDateFn(new Date(previousYear, previousMonth, dayNumber)));
    }

    // Add days from current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(normalizeDateFn(new Date(year, month, i)));
    }

    // Add days from next month to reach exactly 42 days (6 weeks)
    // This ensures a consistent calendar grid height and prevents layout shifts
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const remainingCells = 42 - days.length;

    for (let i = 1; i <= remainingCells; i++) {
      days.push(normalizeDateFn(new Date(nextYear, nextMonth, i)));
    }

    return days;
  }
}

