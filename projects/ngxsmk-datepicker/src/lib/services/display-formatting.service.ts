import { Injectable } from '@angular/core';
import { DatepickerValue } from '../utils/calendar.utils';
import { formatDateWithTimezone } from '../utils/timezone.utils';

export interface FormattingOptions {
  locale: string;
  timezone?: string;
  displayFormat?: string;
  mode: 'single' | 'range' | 'multiple' | 'week' | 'month' | 'quarter' | 'year';
  timeOnly: boolean;
  showTime: boolean;
}

@Injectable()
export class DisplayFormattingService {
  /**
   * Format a datepicker value for display
   */
  formatValue(
    value: DatepickerValue,
    options: FormattingOptions
  ): string {
    if (!value) {
      return '';
    }

    if (options.timeOnly) {
      return this.formatTimeOnly(value, options);
    }

    if (options.displayFormat) {
      return this.formatWithCustomFormat(value, options);
    }

    if (Array.isArray(value)) {
      return this.formatMultipleDates(value, options);
    }

    if (value && typeof value === 'object' && 'start' in value && 'end' in value) {
      return this.formatDateRange(value.start, value.end, options);
    }

    if (value instanceof Date) {
      return this.formatSingleDate(value, options);
    }

    return '';
  }

  /**
   * Format a single date
   */
  private formatSingleDate(date: Date, options: FormattingOptions): string {
    const formatOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    if (options.showTime) {
      formatOptions.hour = 'numeric';
      formatOptions.minute = '2-digit';
    }

    return formatDateWithTimezone(
      date,
      options.locale,
      formatOptions,
      options.timezone
    );
  }

  /**
   * Format a date range
   */
  private formatDateRange(start: Date | null, end: Date | null, options: FormattingOptions): string {
    const startFormatted = start ? formatDateWithTimezone(
      start,
      options.locale,
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      },
      options.timezone
    ) : '--';

    const endFormatted = end ? formatDateWithTimezone(
      end,
      options.locale,
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      },
      options.timezone
    ) : '--';

    return `${startFormatted} - ${endFormatted}`;
  }

  /**
   * Format multiple dates
   */
  private formatMultipleDates(dates: Date[], options: FormattingOptions): string {
    if (dates.length === 0) {
      return '';
    }

    if (dates.length === 1) {
      const firstDate = dates[0];
      if (firstDate) {
        return this.formatSingleDate(firstDate, options);
      }
    }

    return `${dates.length} dates selected`;
  }

  /**
   * Format time only
   */
  private formatTimeOnly(value: DatepickerValue, options: FormattingOptions): string {
    let date: Date | null = null;

    if (value instanceof Date) {
      date = value;
    } else if (Array.isArray(value) && value.length > 0 && value[0]) {
      date = value[0];
    } else if (value && typeof value === 'object' && 'start' in value) {
      date = value.start;
    }

    if (!date) {
      return '';
    }

    return formatDateWithTimezone(
      date,
      options.locale,
      {
        hour: 'numeric',
        minute: '2-digit',
        second: options.showTime ? '2-digit' : undefined
      },
      options.timezone
    );
  }

  /**
   * Format with custom format string
   */
  private formatWithCustomFormat(value: DatepickerValue, options: FormattingOptions): string {
    if (!options.displayFormat) {
      const restOptions = { ...options };
      delete restOptions.displayFormat;
      return this.formatValue(value, restOptions);
    }

    let date: Date | null = null;

    if (value instanceof Date) {
      date = value;
    } else if (Array.isArray(value) && value.length > 0 && value[0]) {
      date = value[0];
    } else if (value && typeof value === 'object' && 'start' in value) {
      date = value.start;
    }

    if (!date) {
      return '';
    }

    return this.formatDateSimple(date, options.displayFormat, options.locale);
  }

  /**
   * Simple date formatting with format string
   */
  private formatDateSimple(date: Date, format: string, _locale: string): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return format
      .replace(/yyyy/g, String(year))
      .replace(/yy/g, String(year).slice(-2))
      .replace(/MM/g, String(month).padStart(2, '0'))
      .replace(/M/g, String(month))
      .replace(/dd/g, String(day).padStart(2, '0'))
      .replace(/d/g, String(day))
      .replace(/HH/g, String(hours).padStart(2, '0'))
      .replace(/H/g, String(hours))
      .replace(/mm/g, String(minutes).padStart(2, '0'))
      .replace(/m/g, String(minutes))
      .replace(/ss/g, String(seconds).padStart(2, '0'))
      .replace(/s/g, String(seconds));
  }
}

