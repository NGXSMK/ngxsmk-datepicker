import { isDatepickerValueEqual, isNullableDateEqual } from './value-equality.utils';

describe('value-equality.utils', () => {
  it('compares nullable dates', () => {
    const a = new Date(2025, 5, 15);
    const b = new Date(2025, 5, 15);
    expect(isNullableDateEqual(a, b)).toBe(true);
    expect(isNullableDateEqual(a, null)).toBe(false);
    expect(isNullableDateEqual(null, a)).toBe(false);
    expect(isNullableDateEqual(null, null)).toBe(true);
    expect(isNullableDateEqual(a, a)).toBe(true);
    expect(isNullableDateEqual(a, new Date(2025, 5, 16))).toBe(false);
  });

  it('compares Date values and null identity', () => {
    const a = new Date(2025, 5, 15);
    expect(isDatepickerValueEqual(a, a)).toBe(true);
    expect(isDatepickerValueEqual(a, new Date(2025, 5, 15))).toBe(true);
    expect(isDatepickerValueEqual(a, new Date(2025, 5, 16))).toBe(false);
    expect(isDatepickerValueEqual(null, null)).toBe(true);
    expect(isDatepickerValueEqual(a, null)).toBe(false);
  });

  it('compares partial ranges without throwing', () => {
    const start = new Date(2025, 5, 10);
    expect(isDatepickerValueEqual({ start, end: null }, { start, end: null })).toBe(true);
    expect(isDatepickerValueEqual({ start, end: null }, { start, end: new Date(2025, 5, 12) })).toBe(false);
  });

  it('compares multiple-date arrays by length and epoch', () => {
    const a = new Date(2025, 1, 1);
    const b = new Date(2025, 1, 2);
    expect(isDatepickerValueEqual([a, b], [new Date(2025, 1, 1), new Date(2025, 1, 2)])).toBe(true);
    expect(isDatepickerValueEqual([a], [a, b])).toBe(false);
    expect(isDatepickerValueEqual([a, b], [b, a])).toBe(false);
  });

  it('returns false for mismatched value shapes', () => {
    expect(isDatepickerValueEqual(new Date(2025, 1, 1), [new Date(2025, 1, 1)])).toBe(false);
  });
});
