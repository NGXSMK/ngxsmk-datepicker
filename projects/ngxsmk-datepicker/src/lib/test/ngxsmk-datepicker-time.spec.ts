import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SimpleChange } from '@angular/core';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { getStartOfDay } from '../utils/date.utils';

// Helper function to create SimpleChange objects for testing
function createSimpleChange<T>(currentValue: T, previousValue: T, firstChange: boolean = false): SimpleChange {
  return {
    currentValue,
    previousValue,
    firstChange,
    isFirstChange: () => firstChange
  };
}

describe('NgxsmkDatepickerComponent - Time Handling', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    component.inline = true;
    component.showTime = true;
    fixture.detectChanges();
  });

  describe('Time Selection', () => {
    it('should initialize with current time when no date is selected', () => {
      const now = new Date();
      expect(component.currentHour).toBe(now.getHours());
      expect(component.currentMinute).toBe(now.getMinutes());
    });

    it('should update time when hour changes', () => {
      spyOn(component.valueChange, 'emit');
      component.mode = 'single';
      component.selectedDate = getStartOfDay(new Date());
      fixture.detectChanges();

      component.currentDisplayHour = 2; // 2 PM
      component.isPm = true;
      component.timeChange();

      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getHours()).toBe(14);
      }
      expect(component.valueChange.emit).toHaveBeenCalled();
    });

    it('should update time when minute changes', () => {
      spyOn(component.valueChange, 'emit');
      component.mode = 'single';
      component.selectedDate = getStartOfDay(new Date());
      fixture.detectChanges();

      component.currentMinute = 30;
      component.timeChange();

      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getMinutes()).toBe(30);
      }
      expect(component.valueChange.emit).toHaveBeenCalled();
    });

    it('should update AM/PM state correctly', () => {
      spyOn(component.valueChange, 'emit');
      component.mode = 'single';
      component.selectedDate = getStartOfDay(new Date());
      fixture.detectChanges();

      component.isPm = true;
      component.currentDisplayHour = 2; // 2 PM
      component.timeChange();

      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getHours()).toBe(14); // 2 PM = 14:00
      }
      expect(component.valueChange.emit).toHaveBeenCalled();
    });
  });

  describe('Time-Only Mode', () => {
    it('should create date when time is selected in time-only mode', () => {
      spyOn(component.valueChange, 'emit');
      component.mode = 'single';
      component.timeOnly = true;
      component.selectedDate = null;
      fixture.detectChanges();

      component.currentDisplayHour = 10;
      component.currentMinute = 30;
      component.isPm = false;
      component.timeChange();

      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        const date = component.selectedDate as Date;
        expect(date.getHours()).toBe(10);
        expect(date.getMinutes()).toBe(30);
      }
      expect(component.valueChange.emit).toHaveBeenCalled();
    });

    it('should hide calendar in time-only mode', () => {
      component.inline = true; // Ensure calendar is visible
      component.timeOnly = true; // Set timeOnly BEFORE generating calendar
      component.calendarViewMode = 'month'; // Ensure we're in month view
      component.ngOnChanges({ timeOnly: createSimpleChange(true, false) });
      component.generateCalendar(); // Generate calendar AFTER setting timeOnly
      fixture.detectChanges();

      // The header should be hidden in time-only mode (it's inside @if (!timeOnly))
      const calendarHeader = fixture.debugElement.query(By.css('.ngxsmk-header'));
      expect(calendarHeader).toBeFalsy();
    });

    it('should show time selection in time-only mode', () => {
      component.timeOnly = true;
      fixture.detectChanges();

      const timeSelection = fixture.debugElement.query(By.css('.ngxsmk-time-selection'));
      expect(timeSelection).toBeTruthy();
    });
  });

  describe('Time with Date Range', () => {
    it('should apply time to both start and end dates in range mode', () => {
      spyOn(component.valueChange, 'emit');
      component.mode = 'range';
      const today = new Date();
      component.startDate = getStartOfDay(today);
      component.endDate = getStartOfDay(new Date(today.getTime() + 86400000)); // Next day
      fixture.detectChanges();

      component.currentDisplayHour = 3; // 3 PM
      component.isPm = true;
      component.currentMinute = 45;
      component.timeChange();

      expect(component.startDate).toBeTruthy();
      expect(component.endDate).toBeTruthy();
      if (component.startDate && component.endDate) {
        expect(component.startDate.getHours()).toBe(15);
        expect(component.startDate.getMinutes()).toBe(45);
        expect(component.endDate.getHours()).toBe(15);
        expect(component.endDate.getMinutes()).toBe(45);
      }
      expect(component.valueChange.emit).toHaveBeenCalled();
    });
  });

  describe('Time with Multiple Dates', () => {
    it('should apply time to all selected dates in multiple mode', () => {
      spyOn(component.valueChange, 'emit');
      component.mode = 'multiple';
      const today = new Date();
      component.selectedDates = [
        getStartOfDay(today),
        getStartOfDay(new Date(today.getTime() + 86400000))
      ];
      fixture.detectChanges();

      component.currentDisplayHour = 12;
      component.isPm = true; // Noon
      component.currentMinute = 0;
      component.timeChange();

      expect(component.selectedDates.length).toBe(2);
      component.selectedDates.forEach(date => {
        expect(date.getHours()).toBe(12);
        expect(date.getMinutes()).toBe(0);
      });
      expect(component.valueChange.emit).toHaveBeenCalled();
    });
  });

  describe('Minute Interval', () => {
    it('should generate minute options based on minuteInterval', () => {
      component.minuteInterval = 15;
      component.ngOnChanges({ minuteInterval: createSimpleChange(15, 1) });
      fixture.detectChanges();

      const minuteOptions = component.minuteOptions;
      expect(minuteOptions.length).toBe(4); // 0, 15, 30, 45
      expect(minuteOptions[0].value).toBe(0);
      expect(minuteOptions[1].value).toBe(15);
      expect(minuteOptions[2].value).toBe(30);
      expect(minuteOptions[3].value).toBe(45);
    });

    it('should generate minute options with interval of 5', () => {
      component.minuteInterval = 5;
      component.ngOnChanges({ minuteInterval: createSimpleChange(5, 1) });
      fixture.detectChanges();

      const minuteOptions = component.minuteOptions;
      expect(minuteOptions.length).toBe(12); // 0, 5, 10, ..., 55
      expect(minuteOptions[0].value).toBe(0);
      expect(minuteOptions[1].value).toBe(5);
    });
  });

  describe('12/24 Hour Format', () => {
    it('should convert 24-hour to 12-hour display', () => {
      component.currentHour = 14; // 2 PM
      (component as unknown as { update12HourState: (h: number) => void }).update12HourState(component.currentHour);
      fixture.detectChanges();

      expect(component.currentDisplayHour).toBe(2);
      expect(component.isPm).toBe(true);
    });

    it('should convert 12-hour display to 24-hour', () => {
      component.mode = 'single';
      component.selectedDate = getStartOfDay(new Date());
      component.currentDisplayHour = 2;
      component.isPm = true;
      component.timeChange();
      fixture.detectChanges();

      expect(component.currentHour).toBe(14);
    });

    it('should handle midnight correctly', () => {
      component.currentHour = 0; // Midnight
      (component as unknown as { update12HourState: (h: number) => void }).update12HourState(component.currentHour);
      fixture.detectChanges();

      expect(component.currentDisplayHour).toBe(12);
      expect(component.isPm).toBe(false);
    });

    it('should handle noon correctly', () => {
      component.currentHour = 12; // Noon
      (component as unknown as { update12HourState: (h: number) => void }).update12HourState(component.currentHour);
      fixture.detectChanges();

      expect(component.currentDisplayHour).toBe(12);
      expect(component.isPm).toBe(true);
    });
    describe('24-Hour Format', () => {
      it('should generate 0-23 hours when use24Hour is true', () => {
        component.use24Hour = true;
        component.ngOnChanges({ use24Hour: createSimpleChange(true, false) });
        expect(component.hourOptions.length).toBe(24);
        expect(component.hourOptions[0].value).toBe(0);
        expect(component.hourOptions[23].value).toBe(23);
      });

      it('should display hour as-is when use24Hour is true', () => {
        component.use24Hour = true;
        component.currentHour = 14;
        (component as unknown as { update12HourState: (h: number) => void }).update12HourState(component.currentHour);
        expect(component.currentDisplayHour).toBe(14);
        expect(component.isPm).toBe(false);
      });

      it('should set internal value correctly when use24Hour is true', () => {
        component.use24Hour = true;
        component.mode = 'single';
        component.selectedDate = getStartOfDay(new Date());
        component.currentDisplayHour = 15;
        component.timeChange();
        expect(component.selectedDate?.getHours()).toBe(15);
      });
    });
  });
});

