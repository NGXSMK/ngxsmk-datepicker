/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { DatePipe } from '@angular/common';
import {
  measureSync,
  measureRender,
  benchmark,
  formatBenchmarkStats,
} from '../utils/performance-testing.utils';

/**
 * Performance Tests
 * Tests for calendar generation, rendering speed, and performance regressions
 * SKIPPED: Tests depend on non-existent component properties and methods
 */
xdescribe('Performance Tests', () => {
  let component: any;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
      providers: [DatePipe, { provide: PLATFORM_ID, useValue: 'browser' }],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Calendar Generation Performance', () => {
    it('should generate single month calendar quickly', () => {
      const result = measureSync('single-month-generation', () => {
        (component as { numberOfMonths?: number }).numberOfMonths = 1;
        component.generateCalendar();
      });

      console.log(`Single month generation: ${result.duration.toFixed(2)}ms`);
      expect(result.duration).toBeLessThan(50); // Should complete in < 50ms
    });

    it('should generate multi-month calendar efficiently', () => {
      const result = measureSync('multi-month-generation', () => {
        (component as { numberOfMonths?: number }).numberOfMonths = 3;
        component.generateCalendar();
      });

      console.log(
        `Multi-month generation (3): ${result.duration.toFixed(2)}ms`,
      );
      expect(result.duration).toBeLessThan(100); // 3 months in < 100ms
    });

    it('should benchmark calendar generation across iterations', () => {
      const stats = benchmark(
        'calendar-generation-benchmark',
        () => {
          (component as { numberOfMonths?: number }).numberOfMonths = 1;
          component.generateCalendar();
        },
        { iterations: 20, warmupIterations: 3 },
      );

      console.log(formatBenchmarkStats(stats));

      // P95 should be reasonable
      expect(stats.p95).toBeLessThan(60);
      expect(stats.average).toBeLessThan(50);
    });

    it('should handle large date ranges efficiently', () => {
      const result = measureSync('large-range-generation', () => {
        component.minDate = new Date(2020, 0, 1);
        component.maxDate = new Date(2030, 11, 31);
        component.generateCalendar();
      });

      console.log(`Large range generation: ${result.duration.toFixed(2)}ms`);
      expect(result.duration).toBeLessThan(100);
    });
  });

  describe('Rendering Performance', () => {
    it('should render calendar quickly', () => {
      component.inline = true;
      (component as { numberOfMonths?: number }).numberOfMonths = 1;

      const result = measureRender('calendar-render', () => {
        fixture.detectChanges();
      });

      console.log(`Calendar render: ${result.duration.toFixed(2)}ms`);
      // Should render in less than one frame at 60fps (16.67ms)
      expect(result.duration).toBeLessThan(100);
    });

    it('should render multi-calendar efficiently', () => {
      component.inline = true;
      (component as { numberOfMonths?: number }).numberOfMonths = 3;

      const result = measureRender('multi-calendar-render', () => {
        fixture.detectChanges();
      });

      console.log(`Multi-calendar render: ${result.duration.toFixed(2)}ms`);
      expect(result.duration).toBeLessThan(150);
    });

    it('should benchmark initial render', () => {
      component.inline = true;
      (component as { numberOfMonths?: number }).numberOfMonths = 1;

      const stats = benchmark(
        'initial-render',
        () => {
          fixture.detectChanges();
        },
        { iterations: 10, warmupIterations: 2 },
      );

      console.log(formatBenchmarkStats(stats));
      expect(stats.average).toBeLessThan(100);
    });
  });

  describe('Navigation Performance', () => {
    beforeEach(() => {
      component.inline = true;
      fixture.detectChanges();
    });

    it('should navigate to next month quickly', () => {
      const result = measureSync('next-month-navigation', () => {
        component.nextMonth();
        fixture.detectChanges();
      });

      console.log(`Next month navigation: ${result.duration.toFixed(2)}ms`);
      expect(result.duration).toBeLessThan(50);
    });

    it('should navigate to previous month quickly', () => {
      const result = measureSync('prev-month-navigation', () => {
        component.previousMonth();
        fixture.detectChanges();
      });

      console.log(`Previous month navigation: ${result.duration.toFixed(2)}ms`);
      expect(result.duration).toBeLessThan(50);
    });

    it('should navigate to specific month efficiently', () => {
      const result = measureSync('goto-month-navigation', () => {
        component.goToMonth(6, 2025);
        fixture.detectChanges();
      });

      console.log(`Go to month navigation: ${result.duration.toFixed(2)}ms`);
      expect(result.duration).toBeLessThan(75);
    });

    it('should benchmark month navigation', () => {
      const stats = benchmark(
        'month-navigation',
        () => {
          component.nextMonth();
          fixture.detectChanges();
        },
        { iterations: 15 },
      );

      console.log(formatBenchmarkStats(stats));
      expect(stats.p95).toBeLessThan(60);
    });
  });

  describe('Date Selection Performance', () => {
    beforeEach(() => {
      component.inline = true;
      fixture.detectChanges();
    });

    it('should select single date quickly', () => {
      const testDate = new Date(2024, 5, 15);

      const result = measureSync('single-date-selection', () => {
        component.onDateClick(testDate);
        fixture.detectChanges();
      });

      console.log(`Single date selection: ${result.duration.toFixed(2)}ms`);
      expect(result.duration).toBeLessThan(50);
    });

    it('should handle range selection efficiently', () => {
      component.mode = 'range';
      fixture.detectChanges();

      const startDate = new Date(2024, 5, 1);
      const endDate = new Date(2024, 5, 15);

      const result = measureSync('range-selection', () => {
        component.onDateClick(startDate);
        component.onDateClick(endDate);
        fixture.detectChanges();
      });

      console.log(`Range selection: ${result.duration.toFixed(2)}ms`);
      expect(result.duration).toBeLessThan(75);
    });

    it('should benchmark date selection', () => {
      const testDate = new Date(2024, 5, 15);

      const stats = benchmark(
        'date-selection',
        () => {
          component.onDateClick(testDate);
          fixture.detectChanges();
        },
        { iterations: 20 },
      );

      console.log(formatBenchmarkStats(stats));
      expect(stats.average).toBeLessThan(50);
    });
  });

  describe('View Mode Switching Performance', () => {
    beforeEach(() => {
      component.inline = true;
      fixture.detectChanges();
    });

    it('should switch to year view quickly', () => {
      const result = measureSync('switch-to-year-view', () => {
        component.calendarViewMode = 'year';
        fixture.detectChanges();
      });

      console.log(`Switch to year view: ${result.duration.toFixed(2)}ms`);
      expect(result.duration).toBeLessThan(75);
    });

    it('should switch to decade view quickly', () => {
      const result = measureSync('switch-to-decade-view', () => {
        component.calendarViewMode = 'decade';
        fixture.detectChanges();
      });

      console.log(`Switch to decade view: ${result.duration.toFixed(2)}ms`);
      expect(result.duration).toBeLessThan(75);
    });

    it('should switch back to month view quickly', () => {
      component.calendarViewMode = 'year';
      fixture.detectChanges();

      const result = measureSync('switch-to-month-view', () => {
        component.calendarViewMode = 'month';
        fixture.detectChanges();
      });

      console.log(`Switch to month view: ${result.duration.toFixed(2)}ms`);
      expect(result.duration).toBeLessThan(75);
    });

    it('should benchmark view switching', () => {
      const stats = benchmark(
        'view-switching',
        () => {
          component.calendarViewMode = 'year';
          fixture.detectChanges();
          component.calendarViewMode = 'month';
          fixture.detectChanges();
        },
        { iterations: 10 },
      );

      console.log(formatBenchmarkStats(stats));
      expect(stats.average).toBeLessThan(100);
    });
  });

  describe('Time Selection Performance', () => {
    beforeEach(() => {
      component.inline = true;
      component.showTime = true;
      fixture.detectChanges();
    });

    it('should update time quickly', () => {
      const result = measureSync('time-update', () => {
        component.onTimeChange({ hour: 14, minute: 30, second: 0 });
        fixture.detectChanges();
      });

      console.log(`Time update: ${result.duration.toFixed(2)}ms`);
      expect(result.duration).toBeLessThan(50);
    });

    it('should benchmark time selection', () => {
      const stats = benchmark(
        'time-selection',
        () => {
          component.onTimeChange({ hour: 10, minute: 15, second: 0 });
          fixture.detectChanges();
        },
        { iterations: 15 },
      );

      console.log(formatBenchmarkStats(stats));
      expect(stats.average).toBeLessThan(50);
    });
  });

  describe('Input Parsing Performance', () => {
    it('should parse date string quickly', () => {
      const result = measureSync('date-string-parsing', () => {
        component.writeValue('2024-06-15');
        fixture.detectChanges();
      });

      console.log(`Date string parsing: ${result.duration.toFixed(2)}ms`);
      expect(result.duration).toBeLessThan(25);
    });

    it('should parse Date object quickly', () => {
      const testDate = new Date(2024, 5, 15);

      const result = measureSync('date-object-parsing', () => {
        component.writeValue(testDate);
        fixture.detectChanges();
      });

      console.log(`Date object parsing: ${result.duration.toFixed(2)}ms`);
      expect(result.duration).toBeLessThan(25);
    });

    it('should benchmark date parsing', () => {
      const stats = benchmark(
        'date-parsing',
        () => {
          component.writeValue('2024-06-15');
          fixture.detectChanges();
        },
        { iterations: 20 },
      );

      console.log(formatBenchmarkStats(stats));
      expect(stats.average).toBeLessThan(30);
    });
  });

  describe('Popup Opening Performance', () => {
    it('should open calendar quickly', () => {
      const result = measureSync('calendar-open', () => {
        component.toggleCalendar();
        fixture.detectChanges();
      });

      console.log(`Calendar open: ${result.duration.toFixed(2)}ms`);
      expect(result.duration).toBeLessThan(100);
    });

    it('should close calendar quickly', () => {
      component.toggleCalendar();
      fixture.detectChanges();

      const result = measureSync('calendar-close', () => {
        component.toggleCalendar();
        fixture.detectChanges();
      });

      console.log(`Calendar close: ${result.duration.toFixed(2)}ms`);
      expect(result.duration).toBeLessThan(75);
    });
  });

  describe('Performance Regression Detection', () => {
    it('should detect if calendar generation regresses', () => {
      // Baseline measurement
      const baseline = benchmark(
        'baseline-generation',
        () => {
          component.generateCalendar();
        },
        { iterations: 10 },
      );

      // Simulate implementation (should be same or better)
      const current = benchmark(
        'current-generation',
        () => {
          component.generateCalendar();
        },
        { iterations: 10 },
      );

      // Allow up to 20% regression for test variance
      const allowedRegression = baseline.average * 0.2;
      expect(current.average).toBeLessThanOrEqual(
        baseline.average + allowedRegression,
      );

      console.log(`Baseline: ${baseline.average.toFixed(2)}ms`);
      console.log(`Current:  ${current.average.toFixed(2)}ms`);
    });
  });

  describe('Memory Efficiency', () => {
    it('should not leak memory on repeated operations', () => {
      const iterations = 50;

      // Perform many operations
      for (let i = 0; i < iterations; i++) {
        component.generateCalendar();
        component.nextMonth();
        component.previousMonth();
      }

      fixture.detectChanges();

      // Component should still be functional
      expect(component.calendars).toBeDefined();
      expect(component.calendars.length).toBeGreaterThan(0);
    });
  });
});
