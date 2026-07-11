import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { getStartOfDay, getEndOfDay } from '../utils/date.utils';
import { DatePipe } from '@angular/common';

describe('NgxsmkDatepickerComponent - Date Constraints', () => {
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

  describe('Min/Max Date Constraints', () => {
    it('should disable dates before minDate', () => {
      const today = new Date();
      const minDate = getStartOfDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5));
      component.minDate = minDate;
      fixture.detectChanges();

      const dateBeforeMin = getStartOfDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3));
      const isDisabled = component.isDateDisabled(dateBeforeMin);
      expect(isDisabled).toBe(true);
    });

    it('should disable dates after maxDate', () => {
      const today = new Date();
      const maxDate = getEndOfDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10));
      component.maxDate = maxDate;
      fixture.detectChanges();

      const dateAfterMax = getStartOfDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15));
      const isDisabled = component.isDateDisabled(dateAfterMax);
      expect(isDisabled).toBe(true);
    });

    it('should allow dates within min/max range', () => {
      const today = new Date();
      component.minDate = getStartOfDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5));
      component.maxDate = getEndOfDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10));
      fixture.detectChanges();

      const dateInRange = getStartOfDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7));
      const isDisabled = component.isDateDisabled(dateInRange);
      expect(isDisabled).toBe(false);
    });

    it('should disable back arrow when minDate is set', () => {
      const today = new Date();
      component.minDate = getStartOfDay(new Date(today.getFullYear(), today.getMonth(), 1));
      component.currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
      fixture.detectChanges();

      expect(component.isBackArrowDisabled).toBe(true);
    });
  });

  describe('Disabled Date Ranges', () => {
    it('should disable dates within disabled ranges', () => {
      const today = new Date();
      const rangeStart = getStartOfDay(new Date(today.getFullYear(), today.getMonth(), 10));
      const rangeEnd = getEndOfDay(new Date(today.getFullYear(), today.getMonth(), 15));

      component.disabledRanges = [{ start: rangeStart, end: rangeEnd }];
      fixture.detectChanges();

      const dateInRange = getStartOfDay(new Date(today.getFullYear(), today.getMonth(), 12));
      const isDisabled = component.isDateDisabled(dateInRange);
      expect(isDisabled).toBe(true);
    });

    it('should allow dates outside disabled ranges', () => {
      const today = new Date();
      const rangeStart = getStartOfDay(new Date(today.getFullYear(), today.getMonth(), 10));
      const rangeEnd = getEndOfDay(new Date(today.getFullYear(), today.getMonth(), 15));

      component.disabledRanges = [{ start: rangeStart, end: rangeEnd }];
      fixture.detectChanges();

      const dateOutsideRange = getStartOfDay(new Date(today.getFullYear(), today.getMonth(), 5));
      const isDisabled = component.isDateDisabled(dateOutsideRange);
      expect(isDisabled).toBe(false);
    });

    it('should handle multiple disabled ranges', () => {
      const today = new Date();
      component.disabledRanges = [
        {
          start: getStartOfDay(new Date(today.getFullYear(), today.getMonth(), 5)),
          end: getEndOfDay(new Date(today.getFullYear(), today.getMonth(), 7)),
        },
        {
          start: getStartOfDay(new Date(today.getFullYear(), today.getMonth(), 20)),
          end: getEndOfDay(new Date(today.getFullYear(), today.getMonth(), 22)),
        },
      ];
      fixture.detectChanges();

      const dateInFirstRange = getStartOfDay(new Date(today.getFullYear(), today.getMonth(), 6));
      const dateInSecondRange = getStartOfDay(new Date(today.getFullYear(), today.getMonth(), 21));
      const dateOutsideRanges = getStartOfDay(new Date(today.getFullYear(), today.getMonth(), 15));

      expect(component.isDateDisabled(dateInFirstRange)).toBe(true);
      expect(component.isDateDisabled(dateInSecondRange)).toBe(true);
      expect(component.isDateDisabled(dateOutsideRanges)).toBe(false);
    });

    it('should handle empty disabled ranges array', () => {
      component.disabledRanges = [];
      fixture.detectChanges();

      const testDate = getStartOfDay(new Date());
      const isDisabled = component.isDateDisabled(testDate);
      expect(isDisabled).toBe(false);
    });
  });

  describe('Combined Constraints', () => {
    it('should respect both minDate and disabled ranges', () => {
      const today = new Date();
      component.minDate = getStartOfDay(new Date(today.getFullYear(), today.getMonth(), 5));
      component.disabledRanges = [
        {
          start: getStartOfDay(new Date(today.getFullYear(), today.getMonth(), 10)),
          end: getEndOfDay(new Date(today.getFullYear(), today.getMonth(), 12)),
        },
      ];
      fixture.detectChanges();

      const dateBeforeMin = getStartOfDay(new Date(today.getFullYear(), today.getMonth(), 3));
      const dateInDisabledRange = getStartOfDay(new Date(today.getFullYear(), today.getMonth(), 11));
      const validDate = getStartOfDay(new Date(today.getFullYear(), today.getMonth(), 15));

      expect(component.isDateDisabled(dateBeforeMin)).toBe(true);
      expect(component.isDateDisabled(dateInDisabledRange)).toBe(true);
      expect(component.isDateDisabled(validDate)).toBe(false);
    });
  });

  describe('Month and Year Dropdown Constraints', () => {
    it('should disable years before minDate year and after maxDate year', () => {
      component.minDate = new Date(2025, 5, 15);
      component.maxDate = new Date(2027, 8, 20);
      component.currentDate = new Date(2026, 0, 1);
      fixture.detectChanges();

      const yearOpts = component.yearOptions();
      const year2024 = yearOpts.find((y) => y.value === 2024);
      const year2025 = yearOpts.find((y) => y.value === 2025);
      const year2026 = yearOpts.find((y) => y.value === 2026);
      const year2027 = yearOpts.find((y) => y.value === 2027);
      const year2028 = yearOpts.find((y) => y.value === 2028);

      if (year2024) expect(year2024.disabled).toBe(true);
      if (year2025) expect(year2025.disabled).toBe(false);
      if (year2026) expect(year2026.disabled).toBe(false);
      if (year2027) expect(year2027.disabled).toBe(false);
      if (year2028) expect(year2028.disabled).toBe(true);
    });

    it('should disable months before minDate month in minDate year and after maxDate month in maxDate year', () => {
      component.minDate = new Date(2026, 3, 15); // April 15
      component.maxDate = new Date(2026, 8, 10); // September 10
      component.currentDate = new Date(2026, 5, 1); // June 1
      fixture.detectChanges();

      const monthOpts = component.monthOptions();
      // Months are 0-indexed (Jan = 0, April = 3, Sept = 8)
      expect(monthOpts[2].disabled).toBe(true); // March
      expect(monthOpts[3].disabled).toBe(false); // April
      expect(monthOpts[5].disabled).toBe(false); // June
      expect(monthOpts[8].disabled).toBe(false); // September
      expect(monthOpts[9].disabled).toBe(true); // October
    });

    it('should snap currentMonth to minDate month if new year equals minDate year and current month precedes minMonth', () => {
      component.minDate = new Date(2026, 3, 15); // April 15
      component.currentYear = 2027;
      component.currentMonth = 1; // February
      fixture.detectChanges();

      // Change year to 2026
      component.currentYear = 2026;
      fixture.detectChanges();

      expect(component.currentMonth).toBe(3); // Should snap to April
    });

    it('should snap currentMonth to maxDate month if new year equals maxDate year and current month exceeds maxMonth', () => {
      component.maxDate = new Date(2026, 8, 10); // September 10
      component.currentYear = 2025;
      component.currentMonth = 10; // November
      fixture.detectChanges();

      // Change year to 2026
      component.currentYear = 2026;
      fixture.detectChanges();

      expect(component.currentMonth).toBe(8); // Should snap to September
    });

    it('should snap currentYear and currentMonth to valid ranges when minDate changes dynamically', () => {
      component.currentYear = 2025;
      component.currentMonth = 5; // June
      fixture.detectChanges();

      // Change minDate dynamically to 2026 August
      component.minDate = new Date(2026, 7, 15);
      fixture.detectChanges();

      expect(component.currentYear).toBe(2026);
      expect(component.currentMonth).toBe(7); // August
    });
  });
});
