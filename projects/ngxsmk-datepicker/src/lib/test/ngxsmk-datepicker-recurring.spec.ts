import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { getStartOfDay } from '../utils/date.utils';
import { generateRecurringDates } from '../utils/recurring-dates.utils';
import { DatePipe } from '@angular/common';

describe('NgxsmkDatepickerComponent - Recurring Dates', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
      providers: [DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    component.inline = true;
    fixture.detectChanges();
  });

  describe('Recurring Pattern Configuration', () => {
    it('should accept recurring pattern configuration', () => {
      component.recurringPattern = {
        pattern: 'weekly',
        startDate: new Date(),
        dayOfWeek: 1, // Monday
        interval: 1,
      };
      fixture.detectChanges();

      expect(component.recurringPattern).toBeDefined();
      expect(component.recurringPattern!.pattern).toBe('weekly');
    });

    it('should generate recurring dates for daily pattern', () => {
      const startDate = getStartOfDay(new Date(2025, 0, 1));
      const dates = generateRecurringDates({
        pattern: 'daily',
        startDate: startDate,
        interval: 2,
        occurrences: 5,
      });

      expect(dates.length).toBe(5);
      expect(dates[0].getTime()).toBe(startDate.getTime());
    });

    it('should generate recurring dates for weekly pattern', () => {
      const startDate = getStartOfDay(new Date(2025, 0, 1)); // Wednesday
      const dates = generateRecurringDates({
        pattern: 'weekly',
        startDate: startDate,
        dayOfWeek: 3, // Wednesday
        interval: 1,
        occurrences: 4,
      });

      expect(dates.length).toBe(4);
      dates.forEach((date) => {
        expect(date.getDay()).toBe(3); // All should be Wednesdays
      });
    });

    it('should generate recurring dates for monthly pattern', () => {
      const startDate = getStartOfDay(new Date(2025, 0, 15));
      const dates = generateRecurringDates({
        pattern: 'monthly',
        startDate: startDate,
        dayOfMonth: 15,
        interval: 1,
        occurrences: 6,
      });

      expect(dates.length).toBe(6);
      dates.forEach((date) => {
        expect(date.getDate()).toBe(15);
      });
    });

    it('should generate recurring dates for yearly pattern', () => {
      const startDate = getStartOfDay(new Date(2025, 5, 15));
      const dates = generateRecurringDates({
        pattern: 'yearly',
        startDate: startDate,
        monthAndDay: { month: 5, day: 15 },
        interval: 1,
        occurrences: 3,
      });

      expect(dates.length).toBe(3);
      dates.forEach((date) => {
        expect(date.getMonth()).toBe(5);
        expect(date.getDate()).toBe(15);
      });
    });

    it('should respect endDate in recurring pattern', () => {
      const startDate = getStartOfDay(new Date(2025, 0, 1));
      const endDate = getStartOfDay(new Date(2025, 0, 10));
      const dates = generateRecurringDates({
        pattern: 'daily',
        startDate: startDate,
        endDate: endDate,
        interval: 1,
      });

      expect(dates.length).toBeLessThanOrEqual(10);
      dates.forEach((date) => {
        expect(date.getTime()).toBeLessThanOrEqual(endDate.getTime());
      });
    });

    it('should handle weekdays pattern', () => {
      const startDate = getStartOfDay(new Date(2025, 0, 1)); // Wednesday
      const dates = generateRecurringDates({
        pattern: 'weekdays',
        startDate: startDate,
        interval: 1,
        occurrences: 10,
      });

      expect(dates.length).toBeGreaterThan(0);
      dates.forEach((date) => {
        const dayOfWeek = date.getDay();
        expect(dayOfWeek).toBeGreaterThanOrEqual(1);
        expect(dayOfWeek).toBeLessThanOrEqual(5);
      });
    });

    it('should apply recurring pattern to datepicker selection', () => {
      component.mode = 'multiple';
      component.recurringPattern = {
        pattern: 'weekly',
        startDate: getStartOfDay(new Date(2025, 0, 1)),
        dayOfWeek: 1, // Monday
        interval: 1,
      };
      fixture.detectChanges();

      expect(component.recurringPattern).toBeDefined();
    });
  });
});
