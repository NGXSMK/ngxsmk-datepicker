import { TestBed } from '@angular/core/testing';
import { DisplayFormattingService } from './display-formatting.service';
import { DatepickerValue } from '../utils/calendar.utils';

describe('DisplayFormattingService', () => {
  let service: DisplayFormattingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DisplayFormattingService]
    });
    service = TestBed.inject(DisplayFormattingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('formatValue', () => {
    it('should return empty string for null value', () => {
      const result = service.formatValue(null, {
        locale: 'en-US',
        mode: 'single',
        timeOnly: false,
        showTime: false
      });
      
      expect(result).toBe('');
    });

    it('should format single date', () => {
      const date = new Date(2025, 5, 15);
      const result = service.formatValue(date, {
        locale: 'en-US',
        mode: 'single',
        timeOnly: false,
        showTime: false
      });
      
      expect(result).toBeTruthy();
      expect(result).toContain('June');
      expect(result).toContain('15');
      expect(result).toContain('2025');
    });

    it('should format date range', () => {
      const range: DatepickerValue = {
        start: new Date(2025, 5, 10),
        end: new Date(2025, 5, 20)
      };
      
      const result = service.formatValue(range, {
        locale: 'en-US',
        mode: 'range',
        timeOnly: false,
        showTime: false
      });
      
      expect(result).toBeTruthy();
      expect(result).toContain('-');
    });

    it('should format multiple dates', () => {
      const dates: DatepickerValue = [
        new Date(2025, 5, 10),
        new Date(2025, 5, 15),
        new Date(2025, 5, 20)
      ];
      
      const result = service.formatValue(dates, {
        locale: 'en-US',
        mode: 'multiple',
        timeOnly: false,
        showTime: false
      });
      
      expect(result).toBeTruthy();
      expect(result).toContain('3 dates selected');
    });

    it('should format time only', () => {
      const date = new Date(2025, 5, 15, 14, 30);
      const result = service.formatValue(date, {
        locale: 'en-US',
        mode: 'single',
        timeOnly: true,
        showTime: true
      });
      
      expect(result).toBeTruthy();
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should format with custom format string', () => {
      const date = new Date(2025, 5, 15, 14, 30, 45);
      const result = service.formatValue(date, {
        locale: 'en-US',
        mode: 'single',
        timeOnly: false,
        showTime: false,
        displayFormat: 'yyyy-MM-dd HH:mm:ss'
      });
      
      expect(result).toBe('2025-06-15 14:30:45');
    });

    it('should format with time when showTime is true', () => {
      const date = new Date(2025, 5, 15, 14, 30);
      const result = service.formatValue(date, {
        locale: 'en-US',
        mode: 'single',
        timeOnly: false,
        showTime: true
      });
      
      expect(result).toBeTruthy();
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should handle week mode', () => {
      const date = new Date(2025, 5, 15);
      const result = service.formatValue(date, {
        locale: 'en-US',
        mode: 'week',
        timeOnly: false,
        showTime: false
      });
      
      expect(result).toBeTruthy();
    });

    it('should handle month mode', () => {
      const date = new Date(2025, 5, 15);
      const result = service.formatValue(date, {
        locale: 'en-US',
        mode: 'month',
        timeOnly: false,
        showTime: false
      });
      
      expect(result).toBeTruthy();
    });

    it('should handle quarter mode', () => {
      const date = new Date(2025, 5, 15);
      const result = service.formatValue(date, {
        locale: 'en-US',
        mode: 'quarter',
        timeOnly: false,
        showTime: false
      });
      
      expect(result).toBeTruthy();
    });

    it('should handle year mode', () => {
      const date = new Date(2025, 5, 15);
      const result = service.formatValue(date, {
        locale: 'en-US',
        mode: 'year',
        timeOnly: false,
        showTime: false
      });
      
      expect(result).toBeTruthy();
    });
  });
});

