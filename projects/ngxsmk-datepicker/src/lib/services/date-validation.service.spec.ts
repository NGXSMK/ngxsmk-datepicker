import { TestBed } from '@angular/core/testing';
import { DateValidationService } from './date-validation.service';
import { HolidayProvider } from '../utils/calendar.utils';

class TestHolidayProvider implements HolidayProvider {
  private holidays: { [key: string]: string } = {
    '2025-12-25': 'Christmas',
    '2025-01-01': 'New Year'
  };

  private formatDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isHoliday(date: Date): boolean {
    return !!this.holidays[this.formatDateKey(date)];
  }

  getHolidayLabel(date: Date): string | null {
    return this.holidays[this.formatDateKey(date)] || null;
  }
}

describe('DateValidationService', () => {
  let service: DateValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateValidationService]
    });
    service = TestBed.inject(DateValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isDateValid', () => {
    it('should return false for null date', () => {
      const result = service.isDateValid(null, {});
      expect(result).toBe(false);
    });

    it('should return false for invalid date', () => {
      const invalidDate = new Date('invalid');
      const result = service.isDateValid(invalidDate, {});
      expect(result).toBe(false);
    });

    it('should return true for valid date with no constraints', () => {
      const date = new Date(2025, 5, 15);
      const result = service.isDateValid(date, {});
      expect(result).toBe(true);
    });

    it('should validate minDate constraint', () => {
      const date = new Date(2025, 5, 15);
      const minDate = new Date(2025, 5, 20);

      const result = service.isDateValid(date, { minDate });
      expect(result).toBe(false);
    });

    it('should validate maxDate constraint', () => {
      const date = new Date(2025, 5, 25);
      const maxDate = new Date(2025, 5, 20);

      const result = service.isDateValid(date, { maxDate });
      expect(result).toBe(false);
    });

    it('should validate disabledDates', () => {
      const date = new Date(2025, 5, 15);
      const disabledDate = new Date(2025, 5, 15);

      const result = service.isDateValid(date, {
        disabledDates: [disabledDate]
      });
      expect(result).toBe(false);
    });

    it('should validate disabledRanges', () => {
      const date = new Date(2025, 5, 15);

      const result = service.isDateValid(date, {
        disabledRanges: [{
          start: new Date(2025, 5, 10),
          end: new Date(2025, 5, 20)
        }]
      });
      expect(result).toBe(false);
    });

    it('should validate custom isInvalidDate function', () => {
      const date = new Date(2025, 5, 15);

      const result = service.isDateValid(date, {
        isInvalidDate: (d) => d.getDate() === 15
      });
      expect(result).toBe(false);
    });

    it('should validate holidays when disableHolidays is true', () => {
      const holidayProvider = new TestHolidayProvider();
      const holidayDate = new Date(2025, 11, 25); // Christmas

      const result = service.isDateValid(holidayDate, {
        disableHolidays: true,
        holidayProvider
      });
      expect(result).toBe(false);
    });

    it('should allow holidays when disableHolidays is false', () => {
      const holidayProvider = new TestHolidayProvider();
      const holidayDate = new Date(2025, 11, 25); // Christmas

      const result = service.isDateValid(holidayDate, {
        disableHolidays: false,
        holidayProvider
      });
      expect(result).toBe(true);
    });
  });

  describe('isDateDisabled', () => {
    it('should return true for null date', () => {
      const result = service.isDateDisabled(null, {});
      expect(result).toBe(true);
    });

    it('should return opposite of isDateValid', () => {
      const date = new Date(2025, 5, 15);
      const minDate = new Date(2025, 5, 20);

      const isValid = service.isDateValid(date, { minDate });
      const isDisabled = service.isDateDisabled(date, { minDate });

      expect(isDisabled).toBe(!isValid);
    });
  });

  describe('isHoliday', () => {
    it('should return false for null date', () => {
      const result = service.isHoliday(null, new TestHolidayProvider());
      expect(result).toBe(false);
    });

    it('should return false for null provider', () => {
      const date = new Date(2025, 11, 25);
      const result = service.isHoliday(date, null);
      expect(result).toBe(false);
    });

    it('should detect holidays', () => {
      const holidayProvider = new TestHolidayProvider();
      const holidayDate = new Date(2025, 11, 25);

      const result = service.isHoliday(holidayDate, holidayProvider);
      expect(result).toBe(true);
    });

    it('should return false for non-holidays', () => {
      const holidayProvider = new TestHolidayProvider();
      const regularDate = new Date(2025, 5, 15);

      const result = service.isHoliday(regularDate, holidayProvider);
      expect(result).toBe(false);
    });
  });

  describe('getHolidayLabel', () => {
    it('should return null for null date', () => {
      const result = service.getHolidayLabel(null, new TestHolidayProvider());
      expect(result).toBeNull();
    });

    it('should return null for null provider', () => {
      const date = new Date(2025, 11, 25);
      const result = service.getHolidayLabel(date, null);
      expect(result).toBeNull();
    });

    it('should return holiday label', () => {
      const holidayProvider = new TestHolidayProvider();
      const holidayDate = new Date(2025, 11, 25);

      const result = service.getHolidayLabel(holidayDate, holidayProvider);
      expect(result).toBe('Christmas');
    });

    it('should return null for non-holidays', () => {
      const holidayProvider = new TestHolidayProvider();
      const regularDate = new Date(2025, 5, 15);

      const result = service.getHolidayLabel(regularDate, holidayProvider);
      expect(result).toBeNull();
    });
  });
});

