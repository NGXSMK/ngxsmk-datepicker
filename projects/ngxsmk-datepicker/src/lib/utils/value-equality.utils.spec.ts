import { isDatepickerValueEqual, isNullableDateEqual } from './value-equality.utils';

describe('value-equality.utils', () => {
  it('compares nullable dates', () => {
    const a = new Date(2025, 5, 15);
    const b = new Date(2025, 5, 15);
    expect(isNullableDateEqual(a, b)).toBe(true);
    expect(isNullableDateEqual(a, null)).toBe(false);
    expect(isNullableDateEqual(null, null)).toBe(true);
  });

  it('compares partial ranges without throwing', () => {
    const start = new Date(2025, 5, 10);
    expect(isDatepickerValueEqual({ start, end: null }, { start, end: null })).toBe(true);
    expect(isDatepickerValueEqual({ start, end: null }, { start, end: new Date(2025, 5, 12) })).toBe(false);
  });
});
