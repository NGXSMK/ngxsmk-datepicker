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
      const minDate = getStartOfDay(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      );
      component.minDate = minDate;
      fixture.detectChanges();

      const dateBeforeMin = getStartOfDay(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
      );
      const isDisabled = component.isDateDisabled(dateBeforeMin);
      expect(isDisabled).toBe(true);
    });

    it('should disable dates after maxDate', () => {
      const today = new Date();
      const maxDate = getEndOfDay(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
      );
      component.maxDate = maxDate;
      fixture.detectChanges();

      const dateAfterMax = getStartOfDay(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15),
      );
      const isDisabled = component.isDateDisabled(dateAfterMax);
      expect(isDisabled).toBe(true);
    });

    it('should allow dates within min/max range', () => {
      const today = new Date();
      component.minDate = getStartOfDay(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      );
      component.maxDate = getEndOfDay(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
      );
      fixture.detectChanges();

      const dateInRange = getStartOfDay(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
      );
      const isDisabled = component.isDateDisabled(dateInRange);
      expect(isDisabled).toBe(false);
    });

    it('should disable back arrow when minDate is set', () => {
      const today = new Date();
      component.minDate = getStartOfDay(
        new Date(today.getFullYear(), today.getMonth(), 1),
      );
      component.currentDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      );
      fixture.detectChanges();

      expect(component.isBackArrowDisabled).toBe(true);
    });
  });

  describe('Disabled Date Ranges', () => {
    it('should disable dates within disabled ranges', () => {
      const today = new Date();
      const rangeStart = getStartOfDay(
        new Date(today.getFullYear(), today.getMonth(), 10),
      );
      const rangeEnd = getEndOfDay(
        new Date(today.getFullYear(), today.getMonth(), 15),
      );

      component.disabledRanges = [{ start: rangeStart, end: rangeEnd }];
      fixture.detectChanges();

      const dateInRange = getStartOfDay(
        new Date(today.getFullYear(), today.getMonth(), 12),
      );
      const isDisabled = component.isDateDisabled(dateInRange);
      expect(isDisabled).toBe(true);
    });

    it('should allow dates outside disabled ranges', () => {
      const today = new Date();
      const rangeStart = getStartOfDay(
        new Date(today.getFullYear(), today.getMonth(), 10),
      );
      const rangeEnd = getEndOfDay(
        new Date(today.getFullYear(), today.getMonth(), 15),
      );

      component.disabledRanges = [{ start: rangeStart, end: rangeEnd }];
      fixture.detectChanges();

      const dateOutsideRange = getStartOfDay(
        new Date(today.getFullYear(), today.getMonth(), 5),
      );
      const isDisabled = component.isDateDisabled(dateOutsideRange);
      expect(isDisabled).toBe(false);
    });

    it('should handle multiple disabled ranges', () => {
      const today = new Date();
      component.disabledRanges = [
        {
          start: getStartOfDay(
            new Date(today.getFullYear(), today.getMonth(), 5),
          ),
          end: getEndOfDay(new Date(today.getFullYear(), today.getMonth(), 7)),
        },
        {
          start: getStartOfDay(
            new Date(today.getFullYear(), today.getMonth(), 20),
          ),
          end: getEndOfDay(new Date(today.getFullYear(), today.getMonth(), 22)),
        },
      ];
      fixture.detectChanges();

      const dateInFirstRange = getStartOfDay(
        new Date(today.getFullYear(), today.getMonth(), 6),
      );
      const dateInSecondRange = getStartOfDay(
        new Date(today.getFullYear(), today.getMonth(), 21),
      );
      const dateOutsideRanges = getStartOfDay(
        new Date(today.getFullYear(), today.getMonth(), 15),
      );

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
      component.minDate = getStartOfDay(
        new Date(today.getFullYear(), today.getMonth(), 5),
      );
      component.disabledRanges = [
        {
          start: getStartOfDay(
            new Date(today.getFullYear(), today.getMonth(), 10),
          ),
          end: getEndOfDay(new Date(today.getFullYear(), today.getMonth(), 12)),
        },
      ];
      fixture.detectChanges();

      const dateBeforeMin = getStartOfDay(
        new Date(today.getFullYear(), today.getMonth(), 3),
      );
      const dateInDisabledRange = getStartOfDay(
        new Date(today.getFullYear(), today.getMonth(), 11),
      );
      const validDate = getStartOfDay(
        new Date(today.getFullYear(), today.getMonth(), 15),
      );

      expect(component.isDateDisabled(dateBeforeMin)).toBe(true);
      expect(component.isDateDisabled(dateInDisabledRange)).toBe(true);
      expect(component.isDateDisabled(validDate)).toBe(false);
    });
  });
});
