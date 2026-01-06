import { TestBed } from '@angular/core/testing';
import { ValueManagementService } from './value-management.service';
import { DatepickerValue } from '../utils/calendar.utils';

describe('ValueManagementService', () => {
  let service: ValueManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValueManagementService]
    });
    
    service = TestBed.inject(ValueManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('normalizeDate', () => {
    it('should normalize Date object', () => {
      const date = new Date('2024-01-15');
      const result = service.normalizeDate(date);
      expect(result).toEqual(date);
    });

    it('should return null for null input', () => {
      const result = service.normalizeDate(null);
      expect(result).toBeNull();
    });
  });

  describe('isMomentObject', () => {
    it('should return true for moment-like object', () => {
      const momentLike = {
        format: () => '2024-01-15',
        toDate: () => new Date('2024-01-15'),
        isMoment: () => true
      };
      
      expect(service.isMomentObject(momentLike)).toBe(true);
    });

    it('should return false for non-object', () => {
      expect(service.isMomentObject(null)).toBe(false);
      expect(service.isMomentObject(undefined)).toBe(false);
      expect(service.isMomentObject('string')).toBe(false);
      expect(service.isMomentObject(123)).toBe(false);
    });

    it('should return false for object without required methods', () => {
      expect(service.isMomentObject({})).toBe(false);
      expect(service.isMomentObject({ format: () => {} })).toBe(false);
    });

    it('should return false if isMoment returns false', () => {
      const notMoment = {
        format: () => '2024-01-15',
        toDate: () => new Date('2024-01-15'),
        isMoment: () => false
      };
      
      expect(service.isMomentObject(notMoment)).toBe(false);
    });
  });

  describe('normalizeValue', () => {
    it('should normalize Date to DatepickerValue', () => {
      const date = new Date('2024-01-15');
      const result = service.normalizeValue(date);
      expect(result).toEqual(date);
    });

    it('should return null for null', () => {
      expect(service.normalizeValue(null)).toBeNull();
    });

    it('should return null for undefined', () => {
      expect(service.normalizeValue(undefined)).toBeNull();
    });

    it('should normalize moment-like object', () => {
      const momentLike = {
        format: () => '2024-01-15',
        toDate: () => new Date('2024-01-15'),
        isMoment: () => true
      };
      
      const result = service.normalizeValue(momentLike);
      expect(result).toBeInstanceOf(Date);
    });

    it('should normalize date range', () => {
      const range = {
        start: new Date('2024-01-15'),
        end: new Date('2024-01-20')
      };
      
      const result = service.normalizeValue(range);
      expect(typeof result).toBe('object');
      if (typeof result === 'object' && result !== null && 'start' in result && 'end' in result) {
        expect((result as { start: Date; end: Date }).start).toBeInstanceOf(Date);
        expect((result as { start: Date; end: Date }).end).toBeInstanceOf(Date);
      }
    });

    it('should return null for invalid range', () => {
      const invalidRange = {
        start: null,
        end: new Date('2024-01-20')
      };
      
      const result = service.normalizeValue(invalidRange);
      expect(result).toBeNull();
    });

    it('should normalize date array', () => {
      const dates = [
        new Date('2024-01-15'),
        new Date('2024-02-20')
      ];
      
      const result = service.normalizeValue(dates);
      expect(Array.isArray(result)).toBe(true);
      expect((result as Date[]).length).toBe(2);
    });

    it('should filter out invalid dates from array', () => {
      const dates = [
        new Date('2024-01-15'),
        null,
        new Date('2024-02-20')
      ];
      
      const result = service.normalizeValue(dates);
      expect(Array.isArray(result)).toBe(true);
      expect((result as Date[]).length).toBe(2);
    });

    it('should parse string with custom parser', () => {
      const parseCustom = (str: string, format: string) => {
        if (format === 'YYYY-MM-DD' && str === '2024-01-15') {
          return new Date('2024-01-15');
        }
        return null;
      };
      
      const result = service.normalizeValue('2024-01-15', 'YYYY-MM-DD', parseCustom);
      expect(result).toBeInstanceOf(Date);
    });

    it('should normalize string date', () => {
      const result = service.normalizeValue('2024-01-15');
      expect(result).toBeInstanceOf(Date);
    });

    it('should return null for invalid value', () => {
      expect(service.normalizeValue({ invalid: 'value' })).toBeNull();
      expect(service.normalizeValue(123)).toBeNull();
    });
  });

  describe('isValueEqual', () => {
    it('should return true for same reference', () => {
      const date = new Date('2024-01-15');
      expect(service.isValueEqual(date, date)).toBe(true);
    });

    it('should return true for both null', () => {
      expect(service.isValueEqual(null, null)).toBe(true);
    });

    it('should return false if one is null', () => {
      const date = new Date('2024-01-15');
      expect(service.isValueEqual(null, date)).toBe(false);
      expect(service.isValueEqual(date, null)).toBe(false);
    });

    it('should compare Date objects by time', () => {
      const date1 = new Date('2024-01-15T10:00:00Z');
      const date2 = new Date('2024-01-15T10:00:00Z');
      const date3 = new Date('2024-01-16T10:00:00Z');
      
      expect(service.isValueEqual(date1, date2)).toBe(true);
      expect(service.isValueEqual(date1, date3)).toBe(false);
    });

    it('should compare date ranges', () => {
      const range1: DatepickerValue = {
        start: new Date('2024-01-15'),
        end: new Date('2024-01-20')
      };
      const range2: DatepickerValue = {
        start: new Date('2024-01-15'),
        end: new Date('2024-01-20')
      };
      const range3: DatepickerValue = {
        start: new Date('2024-01-15'),
        end: new Date('2024-01-21')
      };
      
      expect(service.isValueEqual(range1, range2)).toBe(true);
      expect(service.isValueEqual(range1, range3)).toBe(false);
    });

    it('should compare date arrays', () => {
      const dates1: DatepickerValue = [
        new Date('2024-01-15'),
        new Date('2024-02-20')
      ];
      const dates2: DatepickerValue = [
        new Date('2024-01-15'),
        new Date('2024-02-20')
      ];
      const dates3: DatepickerValue = [
        new Date('2024-01-15'),
        new Date('2024-02-21')
      ];
      const dates4: DatepickerValue = [
        new Date('2024-02-20'),
        new Date('2024-01-15') // Different order
      ];
      
      expect(service.isValueEqual(dates1, dates2)).toBe(true);
      expect(service.isValueEqual(dates1, dates3)).toBe(false);
      expect(service.isValueEqual(dates1, dates4)).toBe(true); // Order shouldn't matter
    });

    it('should return false for arrays of different lengths', () => {
      const dates1: DatepickerValue = [new Date('2024-01-15')];
      const dates2: DatepickerValue = [
        new Date('2024-01-15'),
        new Date('2024-02-20')
      ];
      
      expect(service.isValueEqual(dates1, dates2)).toBe(false);
    });

    it('should return false for different types', () => {
      const date = new Date('2024-01-15');
      const range: DatepickerValue = {
        start: new Date('2024-01-15'),
        end: new Date('2024-01-20')
      };
      
      expect(service.isValueEqual(date, range)).toBe(false);
    });
  });
});

