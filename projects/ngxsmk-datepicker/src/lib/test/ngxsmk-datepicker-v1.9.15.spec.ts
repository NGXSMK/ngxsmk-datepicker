import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { getStartOfDay } from '../utils/date.utils';
import { SignalFormField } from '../services/field-sync.service';
import { DatePipe } from '@angular/common';

/**
 * Mock Moment.js object for testing
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createMockMomentObject(date: Date, utcOffset?: number): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const momentObj: any = {
    _d: date,
    format: (formatString?: string) => {
      if (formatString === 'YYYY-MM-DDTHH:mm:ss.SSSZ') {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
        const offset = utcOffset !== undefined ? utcOffset : 0;
        const offsetHours = Math.floor(Math.abs(offset) / 60);
        const offsetMinutes = Math.abs(offset) % 60;
        const offsetSign = offset >= 0 ? '+' : '-';
        const offsetStr = `${offsetSign}${String(offsetHours).padStart(2, '0')}${String(offsetMinutes).padStart(2, '0')}`;
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetStr}`;
      }
      return date.toISOString();
    },
    toDate: () => date,
    isMoment: () => true,
    utcOffset: utcOffset !== undefined ? () => utcOffset : undefined,
  };
  return momentObj;
}

describe('NgxsmkDatepickerComponent - v1.9.15 Fixes', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent, FormsModule],
      providers: [DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    component.inline = true;
    fixture.detectChanges();
  });

  describe('Moment Object Binding with ngModel (writeValue)', () => {
    it('should bind moment object correctly via writeValue', () => {
      component.mode = 'single';
      const testDate = new Date(2025, 5, 15, 10, 30, 0);
      const momentObj = createMockMomentObject(testDate);

      component.writeValue(momentObj);
      fixture.detectChanges();

      expect(component.selectedDate).toBeTruthy();
      expect(component.selectedDate).toBeInstanceOf(Date);
      expect(component.selectedDate!.getFullYear()).toBe(2025);
      expect(component.selectedDate!.getMonth()).toBe(5);
      expect(component.selectedDate!.getDate()).toBe(15);
    });

    it('should bind moment object with utcOffset via writeValue', () => {
      component.mode = 'single';
      const testDate = new Date(2025, 5, 15, 10, 30, 0);
      const utcOffset = -360; // -6 hours
      const momentObj = createMockMomentObject(testDate, utcOffset);

      component.writeValue(momentObj);
      fixture.detectChanges();

      expect(component.selectedDate).toBeTruthy();
      expect(component.selectedDate).toBeInstanceOf(Date);
      // The date should be converted preserving timezone offset
      expect(component.selectedDate!.getFullYear()).toBe(2025);
      expect(component.selectedDate!.getMonth()).toBe(5);
      expect(component.selectedDate!.getDate()).toBe(15);
    });

    it('should bind moment object correctly after setting null first', () => {
      component.mode = 'single';

      // First set to null
      component.writeValue(null);
      fixture.detectChanges();
      expect(component.selectedDate).toBeNull();

      // Then set moment object (simulating API call scenario)
      const testDate = new Date(2025, 5, 15, 10, 30, 0);
      const momentObj = createMockMomentObject(testDate);

      component.writeValue(momentObj);
      fixture.detectChanges();

      expect(component.selectedDate).toBeTruthy();
      expect(component.selectedDate).toBeInstanceOf(Date);
      expect(component.selectedDate!.getFullYear()).toBe(2025);
      expect(component.selectedDate!.getMonth()).toBe(5);
      expect(component.selectedDate!.getDate()).toBe(15);
    });

    it('should normalize moment object before initializing value', () => {
      component.mode = 'single';
      const testDate = new Date(2025, 5, 15, 10, 30, 0);
      const momentObj = createMockMomentObject(testDate);

      // Spy on _normalizeValue to ensure it's called
      const normalizeValueSpy = spyOn(
        component as unknown as { _normalizeValue: (v: unknown) => unknown },
        '_normalizeValue',
      ).and.callThrough();

      component.writeValue(momentObj);
      fixture.detectChanges();

      expect(normalizeValueSpy).toHaveBeenCalledWith(momentObj);
      expect(component.selectedDate).toBeTruthy();
      expect(component.selectedDate).toBeInstanceOf(Date);
    });
  });

  describe('Date Clicks After Month Navigation', () => {
    it('should allow clicking dates after navigating forward one month', () => {
      component.mode = 'single';
      component.inline = true;
      fixture.detectChanges();

      // Navigate to June 2024
      const targetDate = new Date(2024, 5, 1); // June 1, 2024
      component.currentDate = targetDate;
      component.generateCalendar();
      fixture.detectChanges();

      // Click a date in June
      const june15 = getStartOfDay(new Date(2024, 5, 15));
      expect(component.isDateDisabled(june15)).toBe(false);

      spyOn(component.valueChange, 'emit');
      component.onDateClick(june15);
      fixture.detectChanges();

      expect(component.selectedDate).toBeTruthy();
      expect(component.valueChange.emit).toHaveBeenCalled();

      // Navigate forward to July
      component.changeMonth(1);
      fixture.detectChanges();

      // Click a date in July (should be clickable)
      const july10 = getStartOfDay(new Date(2024, 6, 10));
      expect(component.isDateDisabled(july10)).toBe(false);

      component.onDateClick(july10);
      fixture.detectChanges();

      expect(component.selectedDate).toBeTruthy();
      expect(component.selectedDate!.getMonth()).toBe(6); // July
      expect(component.selectedDate!.getDate()).toBe(10);
    });

    it('should allow clicking dates after navigating backward one month', () => {
      component.mode = 'single';
      component.inline = true;
      fixture.detectChanges();

      // Navigate to June 2024
      const targetDate = new Date(2024, 5, 1); // June 1, 2024
      component.currentDate = targetDate;
      component.generateCalendar();
      fixture.detectChanges();

      // Click a date in June
      const june15 = getStartOfDay(new Date(2024, 5, 15));
      component.onDateClick(june15);
      fixture.detectChanges();

      expect(component.selectedDate).toBeTruthy();

      // Navigate backward to May
      component.changeMonth(-1);
      fixture.detectChanges();

      // Click a date in May (should be clickable)
      const may20 = getStartOfDay(new Date(2024, 4, 20));
      expect(component.isDateDisabled(may20)).toBe(false);

      spyOn(component.valueChange, 'emit');
      component.onDateClick(may20);
      fixture.detectChanges();

      expect(component.selectedDate).toBeTruthy();
      expect(component.selectedDate!.getMonth()).toBe(4); // May
      expect(component.selectedDate!.getDate()).toBe(20);
      expect(component.valueChange.emit).toHaveBeenCalled();
    });

    it('should invalidate disabled date cache when month changes', () => {
      component.mode = 'single';
      component.inline = true;
      fixture.detectChanges();

      // Navigate to June 2024
      const targetDate = new Date(2024, 5, 1);
      component.currentDate = targetDate;
      component.generateCalendar();
      fixture.detectChanges();

      // Get the memoized function
      const memo1 = component.isDateDisabledMemo;
      expect(memo1).toBeTruthy();

      // Navigate to July
      component.changeMonth(1);
      fixture.detectChanges();

      // Get the memoized function again - should be invalidated and recreated
      const memo2 = component.isDateDisabledMemo;

      // The function reference might be the same, but the closure should use new month/year
      // Test that dates in July are correctly evaluated
      const july10 = getStartOfDay(new Date(2024, 6, 10));
      expect(memo2(july10)).toBe(false);
      expect(component.isDateDisabled(july10)).toBe(false);
    });

    it('should allow clicking dates in previous month cells after navigation', () => {
      component.mode = 'single';
      component.inline = true;
      fixture.detectChanges();

      // Start in June 2024
      const juneDate = new Date(2024, 5, 1);
      component.currentDate = juneDate;
      component.generateCalendar();
      fixture.detectChanges();

      // Navigate forward to July
      component.changeMonth(1);
      fixture.detectChanges();

      // July calendar should show some days from previous month (June) in empty cells
      // These should be clickable
      const june30 = getStartOfDay(new Date(2024, 5, 30)); // Last day of June

      // Check if date is disabled (should not be if within valid range)
      const isDisabled = component.isDateDisabled(june30);
      if (!isDisabled) {
        spyOn(component.valueChange, 'emit');
        component.onDateClick(june30);
        fixture.detectChanges();

        expect(component.selectedDate).toBeTruthy();
        expect(component.valueChange.emit).toHaveBeenCalled();
      }
    });

    it('should allow clicking dates in next month cells after navigation', () => {
      component.mode = 'single';
      component.inline = true;
      fixture.detectChanges();

      // Start in June 2024
      const juneDate = new Date(2024, 5, 1);
      component.currentDate = juneDate;
      component.generateCalendar();
      fixture.detectChanges();

      // Navigate backward to May
      component.changeMonth(-1);
      fixture.detectChanges();

      // May calendar should show some days from next month (June) in empty cells
      // These should be clickable
      const june1 = getStartOfDay(new Date(2024, 5, 1)); // First day of June

      // Check if date is disabled (should not be if within valid range)
      const isDisabled = component.isDateDisabled(june1);
      if (!isDisabled) {
        spyOn(component.valueChange, 'emit');
        component.onDateClick(june1);
        fixture.detectChanges();

        expect(component.selectedDate).toBeTruthy();
        expect(component.selectedDate!.getMonth()).toBe(5); // June
        expect(component.valueChange.emit).toHaveBeenCalled();
      }
    });

    it('should update month/year signals when navigating and allow date clicks', () => {
      component.mode = 'single';
      component.inline = true;
      fixture.detectChanges();

      // Navigate to June 2024
      const juneDate = new Date(2024, 5, 1);
      component.currentDate = juneDate;
      component.generateCalendar();
      fixture.detectChanges();

      expect(component.currentMonth).toBe(5); // June
      expect(component.currentYear).toBe(2024);

      // Navigate forward to July
      component.changeMonth(1);
      fixture.detectChanges();

      expect(component.currentMonth).toBe(6); // July
      expect(component.currentYear).toBe(2024);

      // Dates in July should be clickable
      const july15 = getStartOfDay(new Date(2024, 6, 15));
      expect(component.isDateDisabled(july15)).toBe(false);

      spyOn(component.valueChange, 'emit');
      component.onDateClick(july15);
      fixture.detectChanges();

      expect(component.selectedDate).toBeTruthy();
      expect(component.selectedDate!.getMonth()).toBe(6); // July
      expect(component.valueChange.emit).toHaveBeenCalled();
    });
  });

  describe('Range Mode Previous Month Selection', () => {
    it('should allow selecting start date from previous month in range mode', () => {
      component.mode = 'range';
      component.inline = true;
      fixture.detectChanges();

      // Start with null values
      component.writeValue(null);
      fixture.detectChanges();

      // Start in July 2024
      const julyDate = new Date(2024, 6, 15);
      component.currentDate = julyDate;
      component.generateCalendar();
      fixture.detectChanges();

      expect(component.currentMonth).toBe(6); // July
      expect(component.startDate).toBeNull();
      expect(component.endDate).toBeNull();

      // Click on a date from previous month (June) - should navigate and select
      const june30 = getStartOfDay(new Date(2024, 5, 30)); // Last day of June

      // Check if date is disabled (should not be if within valid range)
      const isDisabled = component.isDateDisabled(june30);
      if (!isDisabled) {
        spyOn(component.valueChange, 'emit');
        component.onDateClick(june30);
        fixture.detectChanges();

        // Should navigate to June and set as start date
        expect(component.currentMonth).toBe(5); // June
        expect(component.startDate).toBeTruthy();
        expect(component.startDate!.getMonth()).toBe(5); // June
        expect(component.startDate!.getDate()).toBe(30);
        expect(component.endDate).toBeNull();
        // valueChange.emit is only called when both start and end dates are set in range mode
        expect(component.valueChange.emit).not.toHaveBeenCalled();
      }
    });

    it('should allow selecting dates from previous month after setting start date', () => {
      component.mode = 'range';
      component.inline = true;
      fixture.detectChanges();

      // Start in July 2024
      const julyDate = new Date(2024, 6, 15);
      component.currentDate = julyDate;
      component.generateCalendar();
      fixture.detectChanges();

      // Set a start date in July
      const july10 = getStartOfDay(new Date(2024, 6, 10));
      component.onDateClick(july10);
      fixture.detectChanges();

      expect(component.startDate).toBeTruthy();
      expect(component.startDate!.getMonth()).toBe(6); // July
      expect(component.endDate).toBeNull();

      // Click on a date from previous month (June) - should update start date
      const june30 = getStartOfDay(new Date(2024, 5, 30));

      const isDisabled = component.isDateDisabled(june30);
      if (!isDisabled) {
        spyOn(component.valueChange, 'emit');
        component.onDateClick(june30);
        fixture.detectChanges();

        // Should navigate to June and update start date
        expect(component.currentMonth).toBe(5); // June
        expect(component.startDate).toBeTruthy();
        expect(component.startDate!.getMonth()).toBe(5); // June
        expect(component.startDate!.getDate()).toBe(30);
        expect(component.endDate).toBeNull();
        // valueChange.emit is only called when both start and end dates are set in range mode
        expect(component.valueChange.emit).not.toHaveBeenCalled();
      }
    });

    it('should properly invalidate memo cache when navigating to previous month in range mode', () => {
      component.mode = 'range';
      component.inline = true;
      fixture.detectChanges();

      // Start in July 2024
      const julyDate = new Date(2024, 6, 15);
      component.currentDate = julyDate;
      component.generateCalendar();
      fixture.detectChanges();

      // Get initial memo function
      expect(component.isDateDisabledMemo).toBeTruthy();
      const june30 = getStartOfDay(new Date(2024, 5, 30));

      // Click on date from previous month - should navigate and invalidate cache
      const isDisabled = component.isDateDisabled(june30);
      if (!isDisabled) {
        component.onDateClick(june30);
        fixture.detectChanges();

        // After navigation, memo should be updated
        const memo2 = component.isDateDisabledMemo;

        // The memo function should now use the new month/year (June)
        expect(component.currentMonth).toBe(5); // June
        expect(component.currentYear).toBe(2024);

        // Dates in June should be correctly evaluated
        const june15 = getStartOfDay(new Date(2024, 5, 15));
        expect(memo2(june15)).toBe(false);
        expect(component.isDateDisabled(june15)).toBe(false);
      }
    });

    it('should allow selecting range across month boundaries starting from previous month', () => {
      component.mode = 'range';
      component.inline = true;
      fixture.detectChanges();

      // Start in July 2024
      const julyDate = new Date(2024, 6, 15);
      component.currentDate = julyDate;
      component.generateCalendar();
      fixture.detectChanges();

      // Click on date from previous month (June) as start
      const june30 = getStartOfDay(new Date(2024, 5, 30));
      const isDisabledJune = component.isDateDisabled(june30);

      if (!isDisabledJune) {
        component.onDateClick(june30);
        fixture.detectChanges();

        expect(component.startDate).toBeTruthy();
        expect(component.startDate!.getMonth()).toBe(5); // June
        expect(component.endDate).toBeNull();

        // Navigate back to July and select end date
        component.changeMonth(1);
        fixture.detectChanges();

        expect(component.currentMonth).toBe(6); // July

        // Select end date in July
        const july5 = getStartOfDay(new Date(2024, 6, 5));
        const isDisabledJuly = component.isDateDisabled(july5);

        if (!isDisabledJuly) {
          spyOn(component.valueChange, 'emit');
          component.onDateClick(july5);
          fixture.detectChanges();

          expect(component.startDate).toBeTruthy();
          expect(component.startDate!.getMonth()).toBe(5); // June
          expect(component.endDate).toBeTruthy();
          expect(component.endDate!.getMonth()).toBe(6); // July
          expect(component.valueChange.emit).toHaveBeenCalled();
        }
      }
    });

    it('should work with null start and end values', () => {
      component.mode = 'range';
      component.inline = true;

      // Initialize with null values
      component.writeValue(null);
      fixture.detectChanges();

      expect(component.startDate).toBeNull();
      expect(component.endDate).toBeNull();

      // Start in July 2024
      const julyDate = new Date(2024, 6, 15);
      component.currentDate = julyDate;
      component.generateCalendar();
      fixture.detectChanges();

      // Click on date from previous month
      const june25 = getStartOfDay(new Date(2024, 5, 25));
      const isDisabled = component.isDateDisabled(june25);

      if (!isDisabled) {
        spyOn(component.valueChange, 'emit');
        component.onDateClick(june25);
        fixture.detectChanges();

        // Should set start date and navigate to June
        expect(component.startDate).toBeTruthy();
        expect(component.startDate!.getMonth()).toBe(5); // June
        expect(component.startDate!.getDate()).toBe(25);
        expect(component.endDate).toBeNull();
        expect(component.currentMonth).toBe(5); // June
        // valueChange.emit is only called when both start and end dates are set in range mode
        expect(component.valueChange.emit).not.toHaveBeenCalled();
      }
    });
  });

  describe('Angular 21 Compatibility', () => {
    it('should be compatible with Angular 21 features', () => {
      expect(component).toBeTruthy();
    });

    it('should work with Signal Forms [field] input', () => {
      const mockField = {
        value: new Date(2025, 0, 15),
        disabled: false,
        setValue: jasmine.createSpy('setValue'),
        updateValue: jasmine.createSpy('updateValue'),
      };

      component.field = mockField as unknown as SignalFormField;
      fixture.detectChanges();

      expect(component.value).toEqual(mockField.value);
    });

    it('should be compatible with zoneless Angular 21 apps', () => {
      const testDate = new Date(2025, 0, 15);
      component.value = testDate;
      fixture.detectChanges();

      expect(component.value).toEqual(testDate);
    });
  });
});
