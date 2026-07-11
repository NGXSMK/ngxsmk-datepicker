import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NaturalLanguageParserService {
  /**
   * Parse relative time expressions into actual Date or Range objects.
   * e.g., 'today', 'tomorrow', 'in 3 weeks', 'Q3 2026'
   */
  public parse(text: string): Date | { start: Date; end: Date } | null {
    if (!text) return null;
    const clean = text.toLowerCase().trim();
    const today = new Date();

    if (clean === 'today') return new Date(today);
    if (clean === 'tomorrow') {
      return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    }
    if (clean === 'yesterday') {
      return new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    }

    // Relative offsets: "in 3 weeks", "2 days ago", "5 months"
    const relativeMatch = clean.match(/^(?:in\s+)?(\d+)\s+(day|week|month|year)s?(?:\s+ago)?$/);
    if (relativeMatch) {
      const amount = parseInt(relativeMatch[1] || '0', 10);
      const unit = relativeMatch[2];
      const direction = clean.includes('ago') ? -1 : 1;
      const result = new Date(today);

      if (unit === 'day') {
        result.setDate(today.getDate() + amount * direction);
      } else if (unit === 'week') {
        result.setDate(today.getDate() + amount * 7 * direction);
      } else if (unit === 'month') {
        result.setMonth(today.getMonth() + amount * direction);
      } else if (unit === 'year') {
        result.setFullYear(today.getFullYear() + amount * direction);
      }
      return result;
    }

    // Calendar quarter mapping: "q3 2025" or "Q2 2026"
    const quarterMatch = clean.match(/^q([1-4])\s+(\d{4})$/);
    if (quarterMatch) {
      const quarter = parseInt(quarterMatch[1] || '1', 10);
      const year = parseInt(quarterMatch[2] || '2026', 10);
      const startMonth = (quarter - 1) * 3;
      return {
        start: new Date(year, startMonth, 1),
        end: new Date(year, startMonth + 3, 0, 23, 59, 59, 999),
      };
    }

    return null;
  }
}
