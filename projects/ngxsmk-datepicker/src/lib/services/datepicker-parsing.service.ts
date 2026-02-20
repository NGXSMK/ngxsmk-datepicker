import { Injectable, inject, isDevMode } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DatepickerValue } from '../utils/calendar.utils';
import type { DateAdapter } from '../adapters/date-adapter.interface';
import { getStartOfDay } from '../utils/date.utils';

@Injectable()
export class DatepickerParsingService {
  private datePipe = inject(DatePipe);

  /**
   * Formats a date or range for display in the input field
   */
  formatDisplayValue(
    value: DatepickerValue,
    mode: string,
    format?: string,
    locale?: string,
  ): string {
    if (!value) return '';

    if (mode === 'single' && value instanceof Date) {
      return this.formatDate(value, format, locale);
    }

    if (mode === 'range' && typeof value === 'object' && 'start' in value) {
      const start = value.start
        ? this.formatDate(value.start, format, locale)
        : '';
      const end = value.end ? this.formatDate(value.end, format, locale) : '';
      return start || end ? `${start} - ${end}` : '';
    }

    if (mode === 'multiple' && Array.isArray(value)) {
      return value.map((d) => this.formatDate(d, format, locale)).join(', ');
    }

    return '';
  }

  /**
   * Parses a string input back into a Date object
   * (Foundational for Relative Date Support)
   */
  parseInput(input: string, _format?: string): Date | null {
    if (!input) return null;

    // Basic native parsing for now
    // Future: Add relative date logic like "next Friday" here
    const timestamp = Date.parse(input);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }

  parseDateString(
    dateString: string,
    adapter?: DateAdapter | null,
  ): Date | null {
    if (adapter && typeof adapter.parse === 'function') {
      // Use adapter with error callback for better error handling
      const onError = (error: Error) => {
        if (isDevMode()) {
          console.warn(
            `[ngxsmk-datepicker] Date parsing failed: ${error.message}`,
            dateString,
          );
        }
      };

      const parsed = adapter.parse(dateString, onError);
      if (parsed) {
        return getStartOfDay(parsed);
      }
      // If parsing failed, error was logged via callback
      return null;
    }

    // Fallback to native Date parsing
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        if (isDevMode()) {
          console.warn(
            `[ngxsmk-datepicker] Invalid date string: "${dateString}"`,
          );
        }
        return null;
      }
      return getStartOfDay(date);
    } catch (error) {
      if (isDevMode()) {
        console.warn(`[ngxsmk-datepicker] Date parsing error:`, error);
      }
      return null;
    }
  }

  parseTypedInput(value: string, displayFormat?: string): Date | null {
    if (!value || !value.trim()) return null;

    if (displayFormat) {
      return this.parseCustomDateString(value, displayFormat);
    }

    const isoDate = new Date(value);
    if (!isNaN(isoDate.getTime())) {
      return isoDate;
    }

    const formats = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
      /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/,
    ];

    for (const format of formats) {
      const match = value.match(format);
      if (match && match[1] && match[2] && match[3]) {
        const date1 = new Date(
          parseInt(match[3]),
          parseInt(match[1]) - 1,
          parseInt(match[2]),
        );
        const date2 = new Date(
          parseInt(match[3]),
          parseInt(match[2]) - 1,
          parseInt(match[1]),
        );

        if (
          !isNaN(date1.getTime()) &&
          date1.getMonth() === parseInt(match[1]) - 1
        ) {
          return date1;
        }
        if (
          !isNaN(date2.getTime()) &&
          date2.getMonth() === parseInt(match[2]) - 1
        ) {
          return date2;
        }
      }
    }

    return null;
  }

  parseCustomDateString(dateString: string, format: string): Date | null {
    if (!dateString || !format) return null;

    try {
      const formatTokens: {
        [key: string]: {
          regex: RegExp;
          extractor: (match: RegExpMatchArray) => number;
        };
      } = {
        YYYY: {
          regex: /(\d{4})/,
          extractor: (match) => parseInt(match[1] || '0', 10),
        },
        YY: {
          regex: /(\d{2})/,
          extractor: (match) => 2000 + parseInt(match[1] || '0', 10),
        },
        MM: {
          regex: /(\d{2})/,
          extractor: (match) => parseInt(match[1] || '0', 10) - 1,
        },
        M: {
          regex: /(\d{1,2})/,
          extractor: (match) => parseInt(match[1] || '0', 10) - 1,
        },
        DD: {
          regex: /(\d{2})/,
          extractor: (match) => parseInt(match[1] || '0', 10),
        },
        D: {
          regex: /(\d{1,2})/,
          extractor: (match) => parseInt(match[1] || '0', 10),
        },
        hh: {
          regex: /(\d{2})/,
          extractor: (match) => parseInt(match[1] || '0', 10),
        },
        h: {
          regex: /(\d{1,2})/,
          extractor: (match) => parseInt(match[1] || '0', 10),
        },
        HH: {
          regex: /(\d{2})/,
          extractor: (match) => parseInt(match[1] || '0', 10),
        },
        H: {
          regex: /(\d{1,2})/,
          extractor: (match) => parseInt(match[1] || '0', 10),
        },
        mm: {
          regex: /(\d{2})/,
          extractor: (match) => parseInt(match[1] || '0', 10),
        },
        m: {
          regex: /(\d{1,2})/,
          extractor: (match) => parseInt(match[1] || '0', 10),
        },
        ss: {
          regex: /(\d{2})/,
          extractor: (match) => parseInt(match[1] || '0', 10),
        },
        s: {
          regex: /(\d{1,2})/,
          extractor: (match) => parseInt(match[1] || '0', 10),
        },
        a: {
          regex: /(am|pm)/i,
          extractor: (match) =>
            (match[1] || '').toLowerCase() === 'pm' ? 1 : 0,
        },
        A: {
          regex: /(AM|PM)/,
          extractor: (match) => ((match[1] || '') === 'PM' ? 1 : 0),
        },
      };

      const dateParts: { [key: string]: number } = {};
      let remainingFormat = format;
      let remainingString = dateString;

      const sortedTokens = Object.keys(formatTokens).sort(
        (a, b) => b.length - a.length,
      );

      for (const token of sortedTokens) {
        if (remainingFormat.includes(token)) {
          const tokenInfo = formatTokens[token];
          if (!tokenInfo) continue;

          const match = remainingString.match(tokenInfo.regex);

          if (match) {
            dateParts[token] = tokenInfo.extractor(match);
            const matchIndex = remainingString.indexOf(match[0]);
            remainingString =
              remainingString.substring(0, matchIndex) +
              remainingString.substring(matchIndex + match[0].length);
            remainingFormat = remainingFormat.replace(token, '');
          }
        }
      }

      const now = new Date();
      const year =
        dateParts['YYYY'] !== undefined ? dateParts['YYYY'] : now.getFullYear();
      const month =
        dateParts['MM'] !== undefined
          ? dateParts['MM']
          : dateParts['M'] !== undefined
            ? dateParts['M']
            : now.getMonth();
      const day =
        dateParts['DD'] !== undefined
          ? dateParts['DD']
          : dateParts['D'] !== undefined
            ? dateParts['D']
            : now.getDate();

      let hours = 0;
      let minutes = 0;
      let seconds = 0;

      if (dateParts['hh'] !== undefined || dateParts['h'] !== undefined) {
        const hour12 =
          dateParts['hh'] !== undefined
            ? dateParts['hh']
            : dateParts['h'] !== undefined
              ? dateParts['h']
              : 0;
        const isPm =
          dateParts['a'] !== undefined
            ? dateParts['a']
            : dateParts['A'] !== undefined
              ? dateParts['A']
              : 0;
        hours = (hour12 % 12) + (isPm ? 12 : 0);
      } else if (
        dateParts['HH'] !== undefined ||
        dateParts['H'] !== undefined
      ) {
        hours =
          dateParts['HH'] !== undefined
            ? dateParts['HH']
            : dateParts['H'] !== undefined
              ? dateParts['H']
              : 0;
      }

      minutes =
        dateParts['mm'] !== undefined
          ? dateParts['mm']
          : dateParts['m'] !== undefined
            ? dateParts['m']
            : 0;
      seconds =
        dateParts['ss'] !== undefined
          ? dateParts['ss']
          : dateParts['s'] !== undefined
            ? dateParts['s']
            : 0;

      const date = new Date(year, month, day, hours, minutes, seconds);

      if (isNaN(date.getTime())) {
        return null;
      }

      return date;
    } catch {
      return null;
    }
  }

  formatValueForNativeInput(
    value: DatepickerValue,
    mode: string,
    showTime: boolean,
    timeOnly: boolean,
  ): string {
    if (!value) {
      return '';
    }
    if (mode === 'range') {
      if (Array.isArray(value) && value.length === 2 && value[0]) {
        return this.formatDateForNativeInput(value[0], showTime, timeOnly);
      }
      return '';
    }
    if (value instanceof Date) {
      return this.formatDateForNativeInput(value, showTime, timeOnly);
    }
    return '';
  }

  formatDateForNativeInput(
    date: Date,
    showTime: boolean,
    timeOnly: boolean,
  ): string {
    if (!date || isNaN(date.getTime())) {
      return '';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let result = `${year}-${month}-${day}`;
    if (showTime || timeOnly) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      if (timeOnly) {
        return `${hours}:${minutes}`;
      }
      result += `T${hours}:${minutes}`;
    }
    return result;
  }

  parseNativeInputValue(value: string, mode: string): DatepickerValue {
    if (!value) {
      return null;
    }
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return null;
      }
      if (mode === 'range') {
        return [date, null] as DatepickerValue;
      }
      return date;
    } catch {
      return null;
    }
  }

  /**
   * Format a date using a custom pattern (e.g. MM/DD/YYYY, DD.MM.YYYY).
   * Supports YYYY, YY, MM, M, DD, D, hh, h, HH, H, mm, m, ss, s, a, A.
   */
  formatDateWithPattern(date: Date, format: string): string {
    if (!date || isNaN(date.getTime())) return '';

    const pad = (n: number, len: number = 2) =>
      n.toString().padStart(len, '0');

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;

    return format
      .replace(/YYYY/g, year.toString())
      .replace(/YY/g, year.toString().slice(-2))
      .replace(/MM/g, pad(month))
      .replace(/M/g, month.toString())
      .replace(/DD/g, pad(day))
      .replace(/D/g, day.toString())
      .replace(/hh/g, pad(hours12))
      .replace(/h/g, hours12.toString())
      .replace(/HH/g, pad(hours))
      .replace(/H/g, hours.toString())
      .replace(/mm/g, pad(minutes))
      .replace(/m/g, minutes.toString())
      .replace(/ss/g, pad(seconds))
      .replace(/s/g, seconds.toString())
      .replace(/a/g, ampm.toLowerCase())
      .replace(/A/g, ampm);
  }

  private formatDate(date: Date, format?: string, locale?: string): string {
    try {
      return (
        this.datePipe.transform(
          date,
          format || 'mediumDate',
          undefined,
          locale,
        ) || ''
      );
    } catch {
      return date.toDateString();
    }
  }
}
