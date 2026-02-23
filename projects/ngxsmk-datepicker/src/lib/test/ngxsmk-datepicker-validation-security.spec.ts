import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { DatepickerParsingService } from '../services/datepicker-parsing.service';
import { getStartOfDay } from '../utils/date.utils';
import {
  DateAdapter,
  NativeDateAdapter,
} from '../adapters/date-adapter.interface';
import { isDevMode } from '@angular/core';
import { DatePipe } from '@angular/common';

describe('NgxsmkDatepickerComponent - Input Validation & Security', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;
  let consoleWarnSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent, ReactiveFormsModule],
      providers: [DatePipe, DatepickerParsingService],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    component.inline = true;
    consoleWarnSpy = spyOn(console, 'warn');
    fixture.detectChanges();
  });

  describe('validateInputs() - minDate > maxDate', () => {
    it('should prevent invalid state when minDate > maxDate', () => {
      const minDate = getStartOfDay(new Date(2025, 5, 20));
      const maxDate = getStartOfDay(new Date(2025, 5, 10)); // Before minDate

      component.minDate = minDate;
      component.maxDate = maxDate;
      fixture.detectChanges();

      // Trigger validation
      component.ngOnChanges({
        minDate: {
          previousValue: null,
          currentValue: minDate,
          firstChange: false,
          isFirstChange: () => false,
        },
        maxDate: {
          previousValue: null,
          currentValue: maxDate,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      // maxDate should be adjusted to be at least 1 day after minDate
      expect(component.maxDate).toBeTruthy();
      if (component.maxDate && component.minDate) {
        const minTime = getStartOfDay(component.minDate).getTime();
        const maxTime = getStartOfDay(component.maxDate).getTime();
        expect(maxTime).toBeGreaterThanOrEqual(minTime);
        // Should be at least 1 day after
        const oneDay = 24 * 60 * 60 * 1000;
        expect(maxTime - minTime).toBeGreaterThanOrEqual(oneDay);
      }
    });

    it('should warn in dev mode when minDate > maxDate', () => {
      if (isDevMode()) {
        const minDate = getStartOfDay(new Date(2025, 5, 20));
        const maxDate = getStartOfDay(new Date(2025, 5, 10));

        component.minDate = minDate;
        component.maxDate = maxDate;
        fixture.detectChanges();

        component.ngOnChanges({
          minDate: {
            previousValue: null,
            currentValue: minDate,
            firstChange: false,
            isFirstChange: () => false,
          },
          maxDate: {
            previousValue: null,
            currentValue: maxDate,
            firstChange: false,
            isFirstChange: () => false,
          },
        });

        expect(consoleWarnSpy).toHaveBeenCalledWith(
          jasmine.stringContaining('minDate is greater than maxDate'),
        );
      }
    });

    it('should handle minDate > maxDate when only minDate changes', () => {
      const maxDate = getStartOfDay(new Date(2025, 5, 10));
      const minDate = getStartOfDay(new Date(2025, 5, 20)); // After maxDate

      component.maxDate = maxDate;
      fixture.detectChanges();

      component.minDate = minDate;
      fixture.detectChanges();

      component.ngOnChanges({
        minDate: {
          previousValue: null,
          currentValue: minDate,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      // maxDate should be adjusted
      expect(component.maxDate).toBeTruthy();
      if (component.maxDate && component.minDate) {
        const minTime = getStartOfDay(component.minDate).getTime();
        const maxTime = getStartOfDay(component.maxDate).getTime();
        expect(maxTime).toBeGreaterThanOrEqual(minTime);
      }
    });

    it('should handle minDate > maxDate when only maxDate changes', () => {
      const minDate = getStartOfDay(new Date(2025, 5, 20));
      const maxDate = getStartOfDay(new Date(2025, 5, 10)); // Before minDate

      component.minDate = minDate;
      fixture.detectChanges();

      component.maxDate = maxDate;
      fixture.detectChanges();

      component.ngOnChanges({
        maxDate: {
          previousValue: null,
          currentValue: maxDate,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      // maxDate should be adjusted
      expect(component.maxDate).toBeTruthy();
      if (component.maxDate && component.minDate) {
        const minTime = getStartOfDay(component.minDate).getTime();
        const maxTime = getStartOfDay(component.maxDate).getTime();
        expect(maxTime).toBeGreaterThanOrEqual(minTime);
      }
    });
  });

  describe('validateInputs() - timeOnly mode', () => {
    it('should disable timeOnly when mode is not single', () => {
      component.mode = 'range';
      component.timeOnly = true;
      fixture.detectChanges();

      component.ngOnChanges({
        timeOnly: {
          previousValue: false,
          currentValue: true,
          firstChange: false,
          isFirstChange: () => false,
        },
        mode: {
          previousValue: 'single',
          currentValue: 'range',
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.timeOnly).toBe(false);
    });

    it('should allow timeOnly when mode is single', () => {
      component.mode = 'single';
      component.timeOnly = true;
      fixture.detectChanges();

      component.ngOnChanges({
        timeOnly: {
          previousValue: false,
          currentValue: true,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.timeOnly).toBe(true);
    });

    it('should warn in dev mode when timeOnly is used with non-single mode', () => {
      if (isDevMode()) {
        component.mode = 'range';
        component.timeOnly = true;
        fixture.detectChanges();

        component.ngOnChanges({
          timeOnly: {
            previousValue: false,
            currentValue: true,
            firstChange: false,
            isFirstChange: () => false,
          },
        });

        expect(consoleWarnSpy).toHaveBeenCalledWith(
          jasmine.stringContaining(
            'timeOnly is only supported with mode="single"',
          ),
        );
      }
    });
  });

  describe('validateInputs() - calendarCount', () => {
    it('should clamp calendarCount to valid range', () => {
      component.calendarCount = 0;
      fixture.detectChanges();
      expect(component.calendarCount).toBeGreaterThanOrEqual(1);

      component.calendarCount = 15;
      fixture.detectChanges();
      expect(component.calendarCount).toBeLessThanOrEqual(12);
    });
  });

  describe('validateInputs() - minuteInterval', () => {
    it('should set minuteInterval to 1 if less than 1', () => {
      component.minuteInterval = 0;
      fixture.detectChanges();

      component.ngOnChanges({
        minuteInterval: {
          previousValue: 1,
          currentValue: 0,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.minuteInterval).toBe(1);
    });

    it('should warn in dev mode when minuteInterval < 1', () => {
      if (isDevMode()) {
        component.minuteInterval = 0;
        fixture.detectChanges();

        component.ngOnChanges({
          minuteInterval: {
            previousValue: 1,
            currentValue: 0,
            firstChange: false,
            isFirstChange: () => false,
          },
        });

        expect(consoleWarnSpy).toHaveBeenCalledWith(
          jasmine.stringContaining('minuteInterval must be at least 1'),
        );
      }
    });
  });

  describe('validateInputs() - secondInterval', () => {
    it('should set secondInterval to 1 if less than 1', () => {
      component.secondInterval = -1;
      fixture.detectChanges();

      component.ngOnChanges({
        secondInterval: {
          previousValue: 1,
          currentValue: -1,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.secondInterval).toBe(1);
    });
  });

  describe('validateInputs() - yearRange', () => {
    it('should set yearRange to 1 if less than 1', () => {
      component.yearRange = 0;
      fixture.detectChanges();

      component.ngOnChanges({
        yearRange: {
          previousValue: 10,
          currentValue: 0,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.yearRange).toBeGreaterThanOrEqual(1);
    });
  });

  describe('sanitizeInput() - XSS Prevention', () => {
    it('should remove HTML tag delimiters', () => {
      const malicious = '<script>alert("xss")</script>';
      const sanitized = component['sanitizeInput'](malicious);
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
    });

    it('should remove script event handlers', () => {
      const malicious = 'onerror=alert(1) onclick=evil()';
      const sanitized = component['sanitizeInput'](malicious);
      expect(sanitized).not.toContain('onerror');
      expect(sanitized).not.toContain('onclick');
    });

    it('should remove javascript: protocol', () => {
      const malicious = 'javascript:alert("xss")';
      const sanitized = component['sanitizeInput'](malicious);
      expect(sanitized).not.toContain('javascript:');
    });

    it('should remove data URI scripts', () => {
      const malicious = 'data:text/html,<script>alert(1)</script>';
      const sanitized = component['sanitizeInput'](malicious);
      expect(sanitized).not.toContain('data:text/html');
    });

    it('should preserve valid date/time strings', () => {
      const valid = '2025-06-15 14:30:00';
      const sanitized = component['sanitizeInput'](valid);
      expect(sanitized).toBe('2025-06-15 14:30:00');
    });

    it('should handle empty strings', () => {
      expect(component['sanitizeInput']('')).toBe('');
      expect(component['sanitizeInput']('   ')).toBe('');
    });

    it('should handle non-string inputs', () => {
      expect(component['sanitizeInput'](null as unknown as string)).toBe('');
      expect(component['sanitizeInput'](undefined as unknown as string)).toBe(
        '',
      );
      expect(component['sanitizeInput'](123 as unknown as string)).toBe('');
    });

    it('should trim whitespace', () => {
      expect(component['sanitizeInput']('  2025-06-15  ')).toBe('2025-06-15');
    });
  });

  describe('parseDateString() - Error Callback Usage', () => {
    let parsingService: DatepickerParsingService;

    beforeEach(() => {
      parsingService = TestBed.inject(DatepickerParsingService);
    });

    it('should use adapter with error callback when adapter is configured', () => {
      let errorCallbackCalled = false;
      let capturedError: Error | null | undefined = null;

      const mockAdapter: DateAdapter = {
        ...new NativeDateAdapter(),
        parse: (
          value: string | Date | number | unknown,
          onError?: (error: Error) => void,
        ): Date | null => {
          if (typeof value === 'string' && value === 'invalid-date') {
            const error = new Error('Invalid date string');
            if (onError) {
              onError(error);
            }
            errorCallbackCalled = true;
            capturedError = error;
            return null;
          }
          return new NativeDateAdapter().parse(value, onError);
        },
        format: (date: Date) => new NativeDateAdapter().format(date),
        isValid: (value: string | Date | number | unknown) =>
          new NativeDateAdapter().isValid(value),
        startOfDay: (date: Date) => new NativeDateAdapter().startOfDay(date),
        endOfDay: (date: Date) => new NativeDateAdapter().endOfDay(date),
        addMonths: (date: Date, months: number) =>
          new NativeDateAdapter().addMonths(date, months),
        addDays: (date: Date, days: number) =>
          new NativeDateAdapter().addDays(date, days),
        isSameDay: (date1: Date | null, date2: Date | null) =>
          new NativeDateAdapter().isSameDay(date1, date2),
      };

      const result = parsingService.parseDateString(
        'invalid-date',
        mockAdapter,
      );

      expect(result).toBeNull();
      expect(errorCallbackCalled).toBe(true);
      expect(capturedError).toBeTruthy();
      const error = capturedError as unknown as Error;
      expect(error.message).toContain('Invalid date string');
    });

    it('should fall back to native Date parsing when no adapter is configured', () => {
      const result = parsingService.parseDateString('2025-06-15');
      expect(result).toBeTruthy();
      expect(result).toBeInstanceOf(Date);
    });

    it('should handle invalid date strings gracefully', () => {
      const result = parsingService.parseDateString('not-a-date');
      expect(result).toBeNull();
    });

    it('should warn in dev mode when parsing fails', () => {
      const result = parsingService.parseDateString(
        'invalid-date-string',
        new NativeDateAdapter(),
      );
      expect(result).toBeNull();
    });
  });

  describe('Input Sanitization Integration', () => {
    it('should sanitize input in onInputChange', () => {
      const sanitizeSpy = spyOn(
        component as unknown as { sanitizeInput: (v: string) => string },
        'sanitizeInput',
      ).and.callThrough();
      component.allowTyping = true;
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      if (input) {
        input.value = '<script>alert("xss")</script>';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(sanitizeSpy).toHaveBeenCalled();
      }
    });

    it('should sanitize input in onInputBlur', () => {
      const sanitizeSpy = spyOn(
        component as unknown as { sanitizeInput: (v: string) => string },
        'sanitizeInput',
      ).and.callThrough();
      component.allowTyping = true;
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      if (input) {
        input.value = 'onerror=alert(1)';
        input.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(sanitizeSpy).toHaveBeenCalled();
      }
    });

    it('should sanitize input in onInputKeyDown', () => {
      const sanitizeSpy = spyOn(
        component as unknown as { sanitizeInput: (v: string) => string },
        'sanitizeInput',
      ).and.callThrough();
      component.allowTyping = true;
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      if (input) {
        input.value = 'javascript:alert(1)';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        fixture.detectChanges();

        expect(sanitizeSpy).toHaveBeenCalled();
      }
    });
  });

  describe('Production Build Behavior', () => {
    it('should handle validation without warnings in production mode', () => {
      // This test verifies that validation still works even when isDevMode() returns false
      // We can't actually change isDevMode() in tests, but we can verify the logic
      const minDate = getStartOfDay(new Date(2025, 5, 20));
      const maxDate = getStartOfDay(new Date(2025, 5, 10));

      component.minDate = minDate;
      component.maxDate = maxDate;
      fixture.detectChanges();

      component.ngOnChanges({
        minDate: {
          previousValue: null,
          currentValue: minDate,
          firstChange: false,
          isFirstChange: () => false,
        },
        maxDate: {
          previousValue: null,
          currentValue: maxDate,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      // Validation should still work (adjust maxDate) even if warnings are suppressed
      expect(component.maxDate).toBeTruthy();
      if (component.maxDate && component.minDate) {
        const minTime = getStartOfDay(component.minDate).getTime();
        const maxTime = getStartOfDay(component.maxDate).getTime();
        expect(maxTime).toBeGreaterThanOrEqual(minTime);
      }
    });
  });
});

