import { FormControl } from '@angular/forms';
import {
  ngxsmkMinDateValidator,
  ngxsmkMaxDateValidator,
  ngxsmkDateRangeValidator,
  ngxsmkBlockedDatesValidator,
} from './datepicker.validators';

describe('Datepicker Reactive Form Validators', () => {
  describe('ngxsmkMinDateValidator', () => {
    it('should return null when value is null or empty', () => {
      const validator = ngxsmkMinDateValidator(new Date(2025, 0, 1));
      const control = new FormControl(null);
      expect(validator(control)).toBeNull();
    });

    it('should validate single Date against minDate bound', () => {
      const min = new Date(2025, 5, 15);
      const validator = ngxsmkMinDateValidator(min);

      const validControl = new FormControl(new Date(2025, 5, 15));
      expect(validator(validControl)).toBeNull();

      const futureControl = new FormControl(new Date(2025, 5, 20));
      expect(validator(futureControl)).toBeNull();

      const invalidControl = new FormControl(new Date(2025, 5, 14));
      const error = validator(invalidControl);
      expect(error).toEqual({
        ngxsmkMinDate: { min, actual: jasmine.any(Date) },
      });
    });

    it('should support dynamic function as minDate', () => {
      let dynamicMin = new Date(2025, 0, 1);
      const validator = ngxsmkMinDateValidator(() => dynamicMin);

      const control = new FormControl(new Date(2025, 0, 15));
      expect(validator(control)).toBeNull();

      dynamicMin = new Date(2025, 1, 1);
      expect(validator(control)).not.toBeNull();
    });

    it('should validate date range start date', () => {
      const min = new Date(2025, 5, 1);
      const validator = ngxsmkMinDateValidator(min);

      const validRange = new FormControl({ start: new Date(2025, 5, 5), end: new Date(2025, 5, 10) });
      expect(validator(validRange)).toBeNull();

      const invalidRange = new FormControl({ start: new Date(2025, 4, 30), end: new Date(2025, 5, 10) });
      expect(validator(invalidRange)).not.toBeNull();
    });

    it('should validate multiple dates array', () => {
      const min = new Date(2025, 5, 1);
      const validator = ngxsmkMinDateValidator(min);

      const validMultiple = new FormControl([new Date(2025, 5, 5), new Date(2025, 5, 10)]);
      expect(validator(validMultiple)).toBeNull();

      const invalidMultiple = new FormControl([new Date(2025, 5, 5), new Date(2025, 4, 20)]);
      expect(validator(invalidMultiple)).not.toBeNull();
    });
  });

  describe('ngxsmkMaxDateValidator', () => {
    it('should validate single Date against maxDate bound', () => {
      const max = new Date(2025, 5, 15);
      const validator = ngxsmkMaxDateValidator(max);

      const validControl = new FormControl(new Date(2025, 5, 15));
      expect(validator(validControl)).toBeNull();

      const pastControl = new FormControl(new Date(2025, 5, 10));
      expect(validator(pastControl)).toBeNull();

      const invalidControl = new FormControl(new Date(2025, 5, 16));
      expect(validator(invalidControl)).toEqual({
        ngxsmkMaxDate: { max, actual: jasmine.any(Date) },
      });
    });

    it('should validate date range end date against maxDate', () => {
      const max = new Date(2025, 5, 20);
      const validator = ngxsmkMaxDateValidator(max);

      const validRange = new FormControl({ start: new Date(2025, 5, 5), end: new Date(2025, 5, 20) });
      expect(validator(validRange)).toBeNull();

      const invalidRange = new FormControl({ start: new Date(2025, 5, 5), end: new Date(2025, 5, 25) });
      expect(validator(invalidRange)).not.toBeNull();
    });
  });

  describe('ngxsmkDateRangeValidator', () => {
    it('should validate requireBoth flag', () => {
      const validator = ngxsmkDateRangeValidator({ requireBoth: true });

      const incompleteControl = new FormControl({ start: new Date(2025, 5, 1), end: null });
      expect(validator(incompleteControl)).toEqual({ ngxsmkRangeIncomplete: true });

      const completeControl = new FormControl({ start: new Date(2025, 5, 1), end: new Date(2025, 5, 5) });
      expect(validator(completeControl)).toBeNull();
    });

    it('should validate minDays and maxDays constraints', () => {
      const validator = ngxsmkDateRangeValidator({ minDays: 3, maxDays: 7 });

      // 2 days range (too short)
      const shortControl = new FormControl({ start: new Date(2025, 5, 1), end: new Date(2025, 5, 2) });
      expect(validator(shortControl)).toEqual({
        ngxsmkRangeTooShort: { minDays: 3, actualDays: 2 },
      });

      // 5 days range (valid)
      const validControl = new FormControl({ start: new Date(2025, 5, 1), end: new Date(2025, 5, 5) });
      expect(validator(validControl)).toBeNull();

      // 10 days range (too long)
      const longControl = new FormControl({ start: new Date(2025, 5, 1), end: new Date(2025, 5, 10) });
      expect(validator(longControl)).toEqual({
        ngxsmkRangeTooLong: { maxDays: 7, actualDays: 10 },
      });
    });

    it('should flag invalid range where end is before start', () => {
      const validator = ngxsmkDateRangeValidator();
      const invalidOrder = new FormControl({ start: new Date(2025, 5, 10), end: new Date(2025, 5, 5) });
      expect(validator(invalidOrder)).toEqual({
        ngxsmkRangeInvalid: { message: 'End date must be after start date' },
      });
    });
  });

  describe('ngxsmkBlockedDatesValidator', () => {
    const blockedDates = [new Date(2025, 5, 10), new Date(2025, 5, 15)];

    it('should validate single date against blocked list', () => {
      const validator = ngxsmkBlockedDatesValidator(blockedDates);

      const validControl = new FormControl(new Date(2025, 5, 11));
      expect(validator(validControl)).toBeNull();

      const blockedControl = new FormControl(new Date(2025, 5, 10));
      expect(validator(blockedControl)).toEqual({
        ngxsmkDateBlocked: { date: jasmine.any(Date) },
      });
    });

    it('should detect blocked dates inside a selected range', () => {
      const validator = ngxsmkBlockedDatesValidator(blockedDates);

      const rangeWithoutBlocked = new FormControl({ start: new Date(2025, 5, 1), end: new Date(2025, 5, 5) });
      expect(validator(rangeWithoutBlocked)).toBeNull();

      const rangeWithBlocked = new FormControl({ start: new Date(2025, 5, 8), end: new Date(2025, 5, 12) });
      const error = validator(rangeWithBlocked);
      expect(error).not.toBeNull();
      expect(error?.['ngxsmkRangeContainsBlocked']?.blockedDates?.length).toBe(1);
    });

    it('should support predicate function', () => {
      const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
      const validator = ngxsmkBlockedDatesValidator(isWeekend);

      // Wednesday
      const wednesday = new FormControl(new Date(2025, 5, 11));
      expect(validator(wednesday)).toBeNull();

      // Sunday
      const sunday = new FormControl(new Date(2025, 5, 15));
      expect(validator(sunday)).not.toBeNull();
    });
  });
});
