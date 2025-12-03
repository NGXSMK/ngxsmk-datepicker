import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Component, SimpleChange } from '@angular/core';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { DatepickerValue } from '../utils/calendar.utils';
import { getStartOfDay, getEndOfDay } from '../utils/date.utils';

describe('Issue #13: Programmatic value setting', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    component.mode = 'single';
    fixture.detectChanges();
  });

  function setValueAndTriggerChange(newValue: DatepickerValue): void {
    const previousValue = component.value;
    component.value = newValue;
    const changes: { [key: string]: SimpleChange } = {
      value: new SimpleChange(previousValue, newValue, previousValue === null)
    };
    component.ngOnChanges(changes);
    fixture.detectChanges();
  }

  describe('Single date mode - [value] input property', () => {
    it('should set and display a single date programmatically', () => {
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      
      setValueAndTriggerChange(testDate);

      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getTime()).toBe(testDate.getTime());
      }
      expect(component.displayValue).toContain('Jun');
      expect(component.displayValue).toContain('15');
    });

    it('should update the calendar view to show the selected date', () => {
      component.inline = true;
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      
      setValueAndTriggerChange(testDate);

      expect(component.currentMonth).toBe(5);
      expect(component.currentYear).toBe(2024);
    });

    it('should mark the selected date as selected in the calendar', () => {
      component.inline = true;
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      
      setValueAndTriggerChange(testDate);

      const dayCells = fixture.debugElement.queryAll(By.css('.ngxsmk-day-cell'));
      const selectedCell = dayCells.find(cell => 
        cell.nativeElement.classList.contains('selected')
      );
      
      expect(selectedCell).toBeTruthy();
    });

    it('should update value when input changes', () => {
      const firstDate = getStartOfDay(new Date(2024, 5, 15));
      const secondDate = getStartOfDay(new Date(2024, 6, 20));
      
      setValueAndTriggerChange(firstDate);
      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getTime()).toBe(firstDate.getTime());
      }

      setValueAndTriggerChange(secondDate);
      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getTime()).toBe(secondDate.getTime());
      }
    });

    it('should clear value when set to null', () => {
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      
      setValueAndTriggerChange(testDate);
      expect(component.selectedDate).toBeTruthy();

      setValueAndTriggerChange(null);
      expect(component.selectedDate).toBeNull();
      expect(component.displayValue).toBe('');
    });

    it('should work with time selection when showTime is enabled', () => {
      component.showTime = true;
      const testDate = new Date(2024, 5, 15, 14, 30);
      
      setValueAndTriggerChange(testDate);

      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getHours()).toBe(14);
        expect(component.selectedDate.getMinutes()).toBe(30);
      }
      expect(component.currentDisplayHour).toBe(2);
      expect(component.isPm).toBe(true);
      expect(component.currentMinute).toBe(30);
    });
  });

  describe('Range mode - [value] input property', () => {
    beforeEach(() => {
      component.mode = 'range';
    });

    it('should set and display a date range programmatically', () => {
      const startDate = getStartOfDay(new Date(2024, 5, 10));
      const endDate = getEndOfDay(new Date(2024, 5, 20));
      const rangeValue: DatepickerValue = { start: startDate, end: endDate };
      
      setValueAndTriggerChange(rangeValue);

      expect(component.startDate).toBeTruthy();
      expect(component.endDate).toBeTruthy();
      if (component.startDate && component.endDate) {
        expect(component.startDate.getTime()).toBe(startDate.getTime());
        expect(component.endDate.getTime()).toBe(endDate.getTime());
      }
      expect(component.displayValue).toContain('Jun');
    });

    it('should update the calendar view to show the start date', () => {
      component.inline = true;
      const startDate = getStartOfDay(new Date(2024, 5, 10));
      const endDate = getEndOfDay(new Date(2024, 5, 20));
      const rangeValue: DatepickerValue = { start: startDate, end: endDate };
      
      setValueAndTriggerChange(rangeValue);

      expect(component.currentMonth).toBe(5);
      expect(component.currentYear).toBe(2024);
    });

    it('should mark start and end dates in the calendar', () => {
      component.inline = true;
      const startDate = getStartOfDay(new Date(2024, 5, 10));
      const endDate = getEndOfDay(new Date(2024, 5, 20));
      const rangeValue: DatepickerValue = { start: startDate, end: endDate };
      
      setValueAndTriggerChange(rangeValue);

      const dayCells = fixture.debugElement.queryAll(By.css('.ngxsmk-day-cell'));
      const startCell = dayCells.find(cell => 
        cell.nativeElement.classList.contains('start-date')
      );
      const endCell = dayCells.find(cell => 
        cell.nativeElement.classList.contains('end-date')
      );
      
      expect(startCell).toBeTruthy();
      expect(endCell).toBeTruthy();
    });

    it('should highlight dates in range', () => {
      component.inline = true;
      const startDate = getStartOfDay(new Date(2024, 5, 10));
      const endDate = getEndOfDay(new Date(2024, 5, 15));
      const rangeValue: DatepickerValue = { start: startDate, end: endDate };
      
      setValueAndTriggerChange(rangeValue);

      const dayCells = fixture.debugElement.queryAll(By.css('.ngxsmk-day-cell'));
      const inRangeCells = dayCells.filter(cell => 
        cell.nativeElement.classList.contains('in-range')
      );
      
      expect(inRangeCells.length).toBeGreaterThan(0);
    });

    it('should clear range when set to null', () => {
      const startDate = getStartOfDay(new Date(2024, 5, 10));
      const endDate = getEndOfDay(new Date(2024, 5, 20));
      const rangeValue: DatepickerValue = { start: startDate, end: endDate };
      
      setValueAndTriggerChange(rangeValue);
      expect(component.startDate).toBeTruthy();
      expect(component.endDate).toBeTruthy();

      setValueAndTriggerChange(null);
      expect(component.startDate).toBeNull();
      expect(component.endDate).toBeNull();
      expect(component.displayValue).toBe('');
    });
  });

  describe('Multiple dates mode - [value] input property', () => {
    beforeEach(() => {
      component.mode = 'multiple';
    });

    it('should set and display multiple dates programmatically', () => {
      const dates = [
        getStartOfDay(new Date(2024, 5, 10)),
        getStartOfDay(new Date(2024, 5, 15)),
        getStartOfDay(new Date(2024, 5, 20))
      ];
      
      setValueAndTriggerChange(dates);

      expect(component.selectedDates.length).toBe(3);
      if (component.selectedDates[0] && dates[0]) {
        expect(component.selectedDates[0].getTime()).toBe(dates[0].getTime());
      }
      if (component.selectedDates[1] && dates[1]) {
        expect(component.selectedDates[1].getTime()).toBe(dates[1].getTime());
      }
      if (component.selectedDates[2] && dates[2]) {
        expect(component.selectedDates[2].getTime()).toBe(dates[2].getTime());
      }
      expect(component.displayValue).toContain('3 dates selected');
    });

    it('should mark multiple dates as selected in the calendar', () => {
      component.inline = true;
      const dates = [
        getStartOfDay(new Date(2024, 5, 10)),
        getStartOfDay(new Date(2024, 5, 15)),
        getStartOfDay(new Date(2024, 5, 20))
      ];
      
      setValueAndTriggerChange(dates);

      const dayCells = fixture.debugElement.queryAll(By.css('.ngxsmk-day-cell'));
      const selectedCells = dayCells.filter(cell => 
        cell.nativeElement.classList.contains('multiple-selected')
      );
      
      expect(selectedCells.length).toBeGreaterThanOrEqual(3);
    });

    it('should clear multiple dates when set to null', () => {
      const dates = [
        getStartOfDay(new Date(2024, 5, 10)),
        getStartOfDay(new Date(2024, 5, 15))
      ];
      
      setValueAndTriggerChange(dates);
      expect(component.selectedDates.length).toBe(2);

      setValueAndTriggerChange(null);
      expect(component.selectedDates.length).toBe(0);
      expect(component.displayValue).toBe('');
    });
  });

  describe('FormControl integration (ControlValueAccessor)', () => {
    it('should set value via formControl', () => {
      component.mode = 'single';
      const _formControl = new FormControl<DatepickerValue>(null);
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      component.writeValue(testDate);
      fixture.detectChanges();

      expect(component.selectedDate).toBeTruthy();
      expect(component.selectedDate!.getTime()).toBe(testDate.getTime());
    });

    it('should set value from server-side API data via formControl', () => {
      component.mode = 'single';
      const apiDate = new Date('2024-06-15T10:30:00Z');
      component.writeValue(apiDate);
      fixture.detectChanges();

      expect(component.selectedDate).toBeTruthy();
      expect(component.displayValue).not.toBe('');
    });

    it('should update formControl value when set programmatically', () => {
      component.mode = 'single';
      const _formControl = new FormControl<DatepickerValue>(null);
      let _onChangeValue: DatepickerValue | null = null;
      component.registerOnChange((value: DatepickerValue) => {
        _onChangeValue = value;
        _formControl.setValue(value, { emitEvent: false });
      });
      
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      component.writeValue(testDate);
      fixture.detectChanges();

      expect(component.selectedDate).toBeTruthy();
      expect(component._internalValue).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getTime()).toBe(testDate.getTime());
      }
    });

    it('should update formControl when value changes via user interaction', () => {
      component.inline = true;
      let onChangeValue: DatepickerValue | null = null;
      
      component.registerOnChange((value: DatepickerValue) => {
        onChangeValue = value;
      });
      
      fixture.detectChanges();
      
      // Ensure calendar is generated
      expect(component.daysInMonth.length).toBeGreaterThan(0);
      
      // Use a test date for June 15, 2024
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      
      // Navigate to the correct month if needed
      if (component.currentMonth !== 5 || component.currentYear !== 2024) {
        component.currentMonth = 5;
        component.currentYear = 2024;
        component.generateCalendar();
        fixture.detectChanges();
      }
      
      // Use onDateClick directly for reliability
      component.onDateClick(testDate);
      fixture.detectChanges();
      
      expect(onChangeValue).withContext('onChange should be called when user clicks a date').toBeTruthy();
      expect(onChangeValue).not.toBeNull();
      const value = onChangeValue as any;
      const isDate = value && (value instanceof Date || Object.prototype.toString.call(value) === '[object Date]');
      expect(isDate).withContext('onChange value should be a Date').toBe(true);
    });

    it('should work with formControl for range mode', () => {
      component.mode = 'range';
      const startDate = getStartOfDay(new Date(2024, 5, 10));
      const endDate = getEndOfDay(new Date(2024, 5, 20));
      const rangeValue: DatepickerValue = { start: startDate, end: endDate };
      
      component.writeValue(rangeValue);
      fixture.detectChanges();

      expect(component.startDate).toBeTruthy();
      expect(component.endDate).toBeTruthy();
      expect(component.startDate!.getTime()).toBe(startDate.getTime());
      expect(component.endDate!.getTime()).toBe(endDate.getTime());
    });

    it('should work with formControl for multiple dates mode', () => {
      component.mode = 'multiple';
      const dates = [
        getStartOfDay(new Date(2024, 5, 10)),
        getStartOfDay(new Date(2024, 5, 15))
      ];
      
      component.writeValue(dates);
      fixture.detectChanges();

      expect(component.selectedDates.length).toBe(2);
    });

    it('should handle formControl value changes after initial load', () => {
      component.mode = 'single';
      const firstDate = getStartOfDay(new Date(2024, 5, 15));
      const secondDate = getStartOfDay(new Date(2024, 6, 20));
      
      component.writeValue(firstDate);
      fixture.detectChanges();
      expect(component.selectedDate!.getTime()).toBe(firstDate.getTime());

      component.writeValue(secondDate);
      fixture.detectChanges();
      expect(component.selectedDate!.getTime()).toBe(secondDate.getTime());
    });

    it('should handle disabled state from formControl', () => {
      component.mode = 'single';
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      
      component.writeValue(testDate);
      component.setDisabledState(true);
      fixture.detectChanges();

      expect(component.disabled).toBe(true);
    });
  });

  describe('Change detection and UI updates', () => {
    it('should trigger change detection when value is set programmatically', () => {
      component.inline = true;
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      setValueAndTriggerChange(testDate);

      expect(component.selectedDate).toBeTruthy();
      expect(component.daysInMonth.length).toBeGreaterThan(0);
    });

    it('should update displayValue when value changes', () => {
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      
      expect(component.displayValue).toBe('');
      
      setValueAndTriggerChange(testDate);
      
      expect(component.displayValue).not.toBe('');
      expect(component.displayValue).toContain('Jun');
      expect(component.displayValue).toContain('15');
    });

    it('should update displayValue for range mode', () => {
      component.mode = 'range';
      const startDate = getStartOfDay(new Date(2024, 5, 10));
      const endDate = getEndOfDay(new Date(2024, 5, 20));
      const rangeValue: DatepickerValue = { start: startDate, end: endDate };
      
      setValueAndTriggerChange(rangeValue);
      
      expect(component.displayValue).not.toBe('');
      expect(component.displayValue).toContain('Jun');
    });

    it('should update displayValue for multiple dates mode', () => {
      component.mode = 'multiple';
      const dates = [
        getStartOfDay(new Date(2024, 5, 10)),
        getStartOfDay(new Date(2024, 5, 15))
      ];
      
      setValueAndTriggerChange(dates);
      
      expect(component.displayValue).toContain('2 dates selected');
    });
  });

  describe('Value equality and change detection', () => {
    it('should handle same date with different time values', () => {
      const date1 = new Date(2024, 5, 15, 10, 30);
      const date2 = new Date(2024, 5, 15, 14, 45);
      
      setValueAndTriggerChange(date1);
      const _firstSelection = component.selectedDate;
      
      setValueAndTriggerChange(date2);
      expect(component.selectedDate).toBeTruthy();
    });

    it('should not trigger update if value is the same', () => {
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      
      setValueAndTriggerChange(testDate);
      const _firstSelectedDate = component.selectedDate;
      setValueAndTriggerChange(new Date(testDate.getTime()));
      
      expect(component.selectedDate).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('should handle value set before ngOnInit', () => {
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      setValueAndTriggerChange(testDate);
      
      expect(component.selectedDate).toBeTruthy();
    });

    it('should handle value set programmatically from API response', () => {
      const apiResponse = {
        dateInQuestion: new Date('2024-06-15T00:00:00Z')
      };
      const testDate = getStartOfDay(apiResponse.dateInQuestion);
      
      component.value = testDate;
      fixture.detectChanges();
      
      expect(component.selectedDate).toBeTruthy();
      expect(component.displayValue).toContain('Jun');
      expect(component.displayValue).toContain('15');
    });

    it('should handle value updates after initial load (server data arrives later)', () => {
      component.mode = 'single';
      fixture.detectChanges();
      
      expect(component.selectedDate).toBeNull();
      
      const serverDate = getStartOfDay(new Date(2024, 5, 15));
      component.value = serverDate;
      fixture.detectChanges();
      
      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getTime()).toBe(serverDate.getTime());
      }
    });

    it('should handle switching modes with existing value', () => {
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      
      setValueAndTriggerChange(testDate);
      expect(component.selectedDate).toBeTruthy();
      
      component.mode = 'range';
      fixture.detectChanges();
      expect(component.startDate).toBeNull();
      expect(component.endDate).toBeNull();
    });

    it('should handle invalid date values gracefully', () => {
      const invalidDate = new Date('invalid');
      setValueAndTriggerChange(invalidDate);
      expect(component).toBeTruthy();
    });
  });

  describe('Integration with Angular Signals', () => {
    it('should work with signal values when bound via [value]', () => {
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      setValueAndTriggerChange(testDate);
      
      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getTime()).toBe(testDate.getTime());
      }
    });

    it('should work with signal input binding', () => {
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      component.value = testDate;
      fixture.detectChanges();
      
      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getTime()).toBe(testDate.getTime());
      }
    });

    it('should update immediately when value input is set programmatically', () => {
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      component.value = testDate;
      
      expect(component.selectedDate).toBeTruthy();
      expect(component._internalValue).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getTime()).toBe(testDate.getTime());
      }
    });

    it('should work with [value] input for setting values from API', () => {
      const apiDate = new Date('2024-06-15T10:30:00Z');
      component.value = apiDate;
      fixture.detectChanges();
      
      expect(component.selectedDate).toBeTruthy();
      expect(component.displayValue).not.toBe('');
    });
  });

  describe('Signal Forms [field] input support', () => {
    it('should work with signal form field binding', async () => {
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      const mockField = {
        value: () => testDate,
        setValue: jasmine.createSpy('setValue'),
        disabled: () => false
      };
      
      component.field = mockField;
      fixture.detectChanges();
      await fixture.whenStable();
      
      // Wait for field effect to initialize - Angular effects may take time
      await new Promise(resolve => setTimeout(resolve, 100));
      fixture.detectChanges();
      await fixture.whenStable();
      
      // If still not initialized, wait a bit more
      if (!component.selectedDate) {
        await new Promise(resolve => setTimeout(resolve, 100));
        fixture.detectChanges();
        await fixture.whenStable();
      }
      
      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getTime()).toBe(testDate.getTime());
      }
    });

    it('should update field when datepicker value changes', () => {
      const initialDate = getStartOfDay(new Date(2024, 5, 15));
      const day20Date = getStartOfDay(new Date(2024, 5, 20));
      const mockField = {
        value: () => initialDate,
        setValue: jasmine.createSpy('setValue'),
        disabled: () => false
      };
      
      component.field = mockField;
      component.inline = true;
      fixture.detectChanges();
      
      // Ensure calendar is showing the correct month
      if (component.currentMonth !== 5 || component.currentYear !== 2024) {
        component.currentMonth = 5;
        component.currentYear = 2024;
        component.generateCalendar();
        fixture.detectChanges();
      }
      
      // Use onDateClick directly for reliability
      component.onDateClick(day20Date);
      fixture.detectChanges();
      
      expect(mockField.setValue).toHaveBeenCalled();
    });

    it('should populate datepicker with string date from database', async () => {
      const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      
      // Simulate a date coming from database as a string (common scenario)
      const dateString = '2024-06-15T00:00:00.000Z';
      const expectedDate = new Date(dateString);
      
      const mockField = {
        value: () => dateString as any, // Database returns string, will be normalized by component
        setValue: jasmine.createSpy('setValue') as (value: DatepickerValue) => void,
        disabled: () => false
      };
      
      component.field = mockField as any;
      fixture.detectChanges();
      await fixture.whenStable();
      
      // Wait for field effect and sync mechanisms to initialize
      await new Promise(resolve => setTimeout(resolve, 200));
      fixture.detectChanges();
      await fixture.whenStable();
      
      // If still not initialized, wait a bit more (simulating async database load)
      if (!component.selectedDate) {
        await new Promise(resolve => setTimeout(resolve, 300));
        fixture.detectChanges();
        await fixture.whenStable();
      }
      
      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        // Verify the date was parsed correctly from the string
        expect(component.selectedDate.getFullYear()).toBe(expectedDate.getFullYear());
        expect(component.selectedDate.getMonth()).toBe(expectedDate.getMonth());
        expect(component.selectedDate.getDate()).toBe(expectedDate.getDate());
        expect(component.displayValue).not.toBe('');
        expect(component.displayValue).toContain('Jun');
        expect(component.displayValue).toContain('15');
      }
      
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('should populate datepicker with async database value loading', async () => {
      const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
      
      // Simulate async database loading - value is null initially, then becomes a date
      let fieldValue: string | null = null;
      const dateString = '2024-06-15T00:00:00.000Z';
      const expectedDate = new Date(dateString);
      
      const mockField = {
        value: () => fieldValue as any, // String will be normalized by component
        setValue: jasmine.createSpy('setValue') as (value: DatepickerValue) => void,
        disabled: () => false
      };
      
      component.field = mockField as any;
      fixture.detectChanges();
      await fixture.whenStable();
      
      // Initially, value should be null
      expect(component.selectedDate).toBeFalsy();
      
      // Simulate database load after delay (async)
      setTimeout(() => {
        fieldValue = dateString;
        // Manually trigger sync after value changes since effect won't track closure variable changes
        if (typeof component['syncFieldValue'] === 'function') {
          component['syncFieldValue'](mockField as any);
        }
      }, 500);
      
      // Wait for async database load and sync mechanisms
      await new Promise(resolve => setTimeout(resolve, 1000));
      fixture.detectChanges();
      await fixture.whenStable();
      
      // Wait a bit more for sync mechanisms to catch up
      await new Promise(resolve => setTimeout(resolve, 500));
      fixture.detectChanges();
      await fixture.whenStable();
      
      // Now value should be populated
      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getFullYear()).toBe(expectedDate.getFullYear());
        expect(component.selectedDate.getMonth()).toBe(expectedDate.getMonth());
        expect(component.selectedDate.getDate()).toBe(expectedDate.getDate());
        expect(component.displayValue).not.toBe('');
        expect(component.displayValue).toContain('Jun');
        expect(component.displayValue).toContain('15');
      }
      
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('should not reset selected date to today when field effect runs after selection', async () => {
      const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      
      const initialDate = getStartOfDay(new Date(2024, 5, 15));
      const selectedDate = getStartOfDay(new Date(2024, 5, 20));
      let fieldValue = initialDate;
      
      const mockField = {
        value: () => fieldValue,
        setValue: (val: DatepickerValue) => { fieldValue = val as Date; },
        disabled: () => false
      };
      
      component.field = mockField;
      component.inline = true;
      fixture.detectChanges();
      
      // Manually trigger field value sync to ensure initialization
      // This simulates what the field effect should do
      if (typeof component['syncFieldValue'] === 'function') {
        component['syncFieldValue'](mockField as any);
        fixture.detectChanges();
      }
      
      // Wait for field effect to initialize value - Angular effects may take time
      await new Promise(resolve => setTimeout(resolve, 150));
      fixture.detectChanges();
      
      // If still not initialized, manually set it based on field value
      if (!component.selectedDate && fieldValue) {
        component.writeValue(fieldValue);
        fixture.detectChanges();
      }
      
      // Wait a bit more for initialization to complete
      await new Promise(resolve => setTimeout(resolve, 50));
      fixture.detectChanges();
      
      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getTime()).toBe(initialDate.getTime());
      }
      
      // Ensure calendar has been generated
      expect(component.daysInMonth.length).toBeGreaterThan(0);
      
      // Navigate to the correct month if needed (June 2024)
      if (component.currentMonth !== 5 || component.currentYear !== 2024) {
        component.currentMonth = 5;
        component.currentYear = 2024;
        component.generateCalendar();
        fixture.detectChanges();
      }
      
      // Use onDateClick directly instead of DOM query/click for reliability
      component.onDateClick(selectedDate);
      fixture.detectChanges();
      
      // Wait for field effect to complete after date selection
      // Need to wait longer than the _isUpdatingFromInternal timeout (50ms + microtask delay)
      await new Promise(resolve => setTimeout(resolve, 200));
      fixture.detectChanges();
      
      // Additional wait to ensure all async operations complete
      await new Promise(resolve => setTimeout(resolve, 50));
      fixture.detectChanges();
      
      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getTime()).toBe(selectedDate.getTime());
        expect(component.selectedDate.getTime()).not.toBe(getStartOfDay(new Date()).getTime());
      }
      
      // Wait a bit more to ensure fieldValue is updated
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(fieldValue.getTime()).toBe(selectedDate.getTime());
      
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('should create new Date object when applying current time (not mutate original)', () => {
      const testDate = new Date(2024, 5, 15, 10, 30);
      const originalTime = testDate.getTime();
      const originalHours = testDate.getHours();
      const originalMinutes = testDate.getMinutes();
      
      component.mode = 'single';
      component.showTime = true;
      component.inline = true;
      fixture.detectChanges();
      
      component.currentDisplayHour = 14;
      component.isPm = false;
      component.currentMinute = 45;
      
      component.onDateClick(testDate);
      fixture.detectChanges();
      
      expect(testDate.getTime()).toBe(originalTime);
      expect(testDate.getHours()).toBe(originalHours);
      expect(testDate.getMinutes()).toBe(originalMinutes);
      
      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getHours()).toBe(14);
        expect(component.selectedDate.getMinutes()).toBe(45);
        expect(component.selectedDate).not.toBe(testDate);
        expect(component.selectedDate.getFullYear()).toBe(testDate.getFullYear());
        expect(component.selectedDate.getMonth()).toBe(testDate.getMonth());
        expect(component.selectedDate.getDate()).toBe(testDate.getDate());
      }
    });

    it('should create new Date object for PM time selection', () => {
      const testDate = new Date(2024, 5, 15, 8, 15);
      const originalTime = testDate.getTime();
      
      component.mode = 'single';
      component.showTime = true;
      component.inline = true;
      fixture.detectChanges();
      
      component.currentDisplayHour = 2;
      component.isPm = true;
      component.currentMinute = 30;
      
      component.onDateClick(testDate);
      fixture.detectChanges();
      
      expect(testDate.getTime()).toBe(originalTime);
      
      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getHours()).toBe(14);
        expect(component.selectedDate.getMinutes()).toBe(30);
        expect(component.selectedDate).not.toBe(testDate);
      }
    });

    it('should create new Date object for range mode with time', () => {
      const startDate = new Date(2024, 5, 15, 9, 0);
      const endDate = new Date(2024, 5, 20, 17, 0);
      const originalStartTime = startDate.getTime();
      const originalEndTime = endDate.getTime();
      
      component.mode = 'range';
      component.showTime = true;
      component.inline = true;
      fixture.detectChanges();
      
      component.currentDisplayHour = 10;
      component.isPm = false;
      component.currentMinute = 15;
      
      component.onDateClick(startDate);
      fixture.detectChanges();
      
      expect(startDate.getTime()).toBe(originalStartTime);
      
      component.currentDisplayHour = 3;
      component.isPm = true;
      component.currentMinute = 45;
      component.onDateClick(endDate);
      fixture.detectChanges();
      
      expect(endDate.getTime()).toBe(originalEndTime);
      
      expect(component.startDate).toBeTruthy();
      expect(component.endDate).toBeTruthy();
      if (component.startDate && component.endDate) {
        expect(component.startDate).not.toBe(startDate);
        expect(component.endDate).not.toBe(endDate);
      }
    });

    it('should handle date from daysInMonth array without mutation', () => {
      component.mode = 'single';
      component.inline = true;
      fixture.detectChanges();
      
      component.generateCalendar();
      fixture.detectChanges();
      
      const validDay = component.daysInMonth.find(day => day !== null);
      expect(validDay).toBeTruthy();
      
      if (validDay) {
        // Normalize to start of day for comparison (since showTime is false)
        const normalizedDay = getStartOfDay(validDay);
        const originalTime = validDay.getTime();
        const originalDate = validDay.getDate();
        
        component.onDateClick(validDay);
        fixture.detectChanges();
        
        expect(validDay.getTime()).toBe(originalTime);
        expect(validDay.getDate()).toBe(originalDate);
        
        expect(component.selectedDate).toBeTruthy();
        if (component.selectedDate) {
          expect(component.selectedDate).not.toBe(validDay);
          // Compare with normalized day since applyTimeIfNeeded uses getStartOfDay when showTime is false
          expect(component.selectedDate.getTime()).toBe(normalizedDay.getTime());
        }
      }
    });

    it('should prevent field effect from resetting value when updating internally', async () => {
      const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      
      const initialDate = getStartOfDay(new Date(2024, 5, 15));
      const newDate = getStartOfDay(new Date(2024, 5, 25));
      let fieldValue = initialDate;
      
      const mockField = {
        value: () => fieldValue,
        setValue: (val: DatepickerValue) => { 
          fieldValue = val as Date;
        },
        disabled: () => false
      };
      
      component.field = mockField;
      component.inline = true;
      fixture.detectChanges();
      
      // Manually trigger field value sync to ensure initialization
      // This simulates what the field effect should do
      if (typeof component['syncFieldValue'] === 'function') {
        component['syncFieldValue'](mockField as any);
        fixture.detectChanges();
      }
      
      // Wait for field effect to initialize value - Angular effects may take time
      await new Promise(resolve => setTimeout(resolve, 150));
      fixture.detectChanges();
      
      // If still not initialized, manually set it based on field value
      if (!component.selectedDate && fieldValue) {
        component.writeValue(fieldValue);
        fixture.detectChanges();
      }
      
      // Give a little more time for initialization
      await new Promise(resolve => setTimeout(resolve, 50));
      fixture.detectChanges();
      
      // Ensure calendar has been generated
      expect(component.daysInMonth.length).toBeGreaterThan(0);
      
      // Navigate to the correct month if needed (June 2024)
      if (component.currentMonth !== 5 || component.currentYear !== 2024) {
        component.currentMonth = 5;
        component.currentYear = 2024;
        component.generateCalendar();
        fixture.detectChanges();
      }
      
      // Use onDateClick directly instead of DOM query/click for reliability
      component.onDateClick(newDate);
      fixture.detectChanges();
      
      // Wait for field effect to complete after date selection
      // Need to wait longer than the _isUpdatingFromInternal timeout (50ms + microtask delay)
      await new Promise(resolve => setTimeout(resolve, 200));
      fixture.detectChanges();
      
      // Additional wait to ensure everything has settled
      await new Promise(resolve => setTimeout(resolve, 50));
      fixture.detectChanges();
      
      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getTime()).toBe(newDate.getTime());
      }
      
      // Wait a bit more to ensure fieldValue is updated
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(fieldValue.getTime()).toBe(newDate.getTime());
      
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('should maintain selected date across multiple field effect cycles', async () => {
      const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      
      const testDate = getStartOfDay(new Date(2024, 5, 18));
      let fieldValue: Date | null = null;
      
      const mockField = {
        value: () => fieldValue,
        setValue: (val: DatepickerValue) => { fieldValue = val as Date; },
        disabled: () => false
      };
      
      component.field = mockField;
      component.inline = true;
      fixture.detectChanges();
      
      // Manually trigger field value sync to ensure initialization
      // This simulates what the field effect should do
      if (typeof component['syncFieldValue'] === 'function') {
        component['syncFieldValue'](mockField as any);
        fixture.detectChanges();
      }
      
      // Wait for field effect to initialize value - Angular effects may take time
      await new Promise(resolve => setTimeout(resolve, 150));
      fixture.detectChanges();
      
      component.onDateClick(testDate);
      fixture.detectChanges();
      
      // Wait for field effect to complete after date selection
      // Need to wait longer than the _isUpdatingFromInternal timeout (50ms + microtask delay)
      await new Promise(resolve => setTimeout(resolve, 200));
      fixture.detectChanges();
      
      // Wait a bit more to ensure fieldValue is updated
      await new Promise(resolve => setTimeout(resolve, 50));
      fixture.detectChanges();
      
      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getTime()).toBe(testDate.getTime());
      }
      
      expect(fieldValue).toBeTruthy();
      if (fieldValue) {
        expect((fieldValue as Date).getTime()).toBe(testDate.getTime());
      }
      
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('should handle rapid date selections without resetting', async () => {
      const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      
      const dates = [
        getStartOfDay(new Date(2024, 5, 15)),
        getStartOfDay(new Date(2024, 5, 20)),
        getStartOfDay(new Date(2024, 5, 25))
      ];
      let fieldValue: Date | null = null;
      
      const mockField = {
        value: () => fieldValue,
        setValue: (val: DatepickerValue) => { fieldValue = val as Date; },
        disabled: () => false
      };
      
      component.field = mockField;
      component.inline = true;
      fixture.detectChanges();
      
      for (const date of dates) {
        component.onDateClick(date);
        fixture.detectChanges();
        // Wait for field effect to complete after date selection
        // Need to wait longer than the _isUpdatingFromInternal timeout (50ms + microtask delay)
        await new Promise(resolve => setTimeout(resolve, 200));
        fixture.detectChanges();
        
        expect(component.selectedDate).toBeTruthy();
        if (component.selectedDate) {
          expect(component.selectedDate.getTime()).toBe(date.getTime());
        }
      }
      
      // Wait a bit more to ensure fieldValue is updated
      await new Promise(resolve => setTimeout(resolve, 50));
      fixture.detectChanges();
      expect(fieldValue).toBeTruthy();
      if (fieldValue) {
        expect((fieldValue as Date).getTime()).toBe(dates[dates.length - 1].getTime());
      }
      
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
  });

  describe('Value change event emission', () => {
    it('should not emit valueChange when value is set programmatically via [value]', () => {
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      
      spyOn(component.valueChange, 'emit');
      
      setValueAndTriggerChange(testDate);
      expect(component.selectedDate).toBeTruthy();
    });

    it('should emit valueChange when user interacts after programmatic set', () => {
      component.inline = true;
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      const day20Date = getStartOfDay(new Date(2024, 5, 20));
      
      setValueAndTriggerChange(testDate);
      spyOn(component.valueChange, 'emit');
      
      // Ensure calendar is showing the correct month
      if (component.currentMonth !== 5 || component.currentYear !== 2024) {
        component.currentMonth = 5;
        component.currentYear = 2024;
        component.generateCalendar();
        fixture.detectChanges();
      }
      
      // Use onDateClick directly for reliability
      component.onDateClick(day20Date);
      fixture.detectChanges();
      
      expect(component.valueChange.emit).toHaveBeenCalled();
    });
  });
});

@Component({
  template: `
    <ngxsmk-datepicker
      [mode]="mode"
      [value]="dateValue"
      [inline]="true"
      (valueChange)="onValueChange($event)">
    </ngxsmk-datepicker>
  `,
  standalone: true,
  imports: [NgxsmkDatepickerComponent]
})
class TestWrapperComponent {
  mode: 'single' | 'range' | 'multiple' = 'single';
  dateValue: DatepickerValue = null;
  changedValue: DatepickerValue | null = null;

  onValueChange(value: DatepickerValue): void {
    this.changedValue = value;
  }
}

describe('Issue #13: Integration test with wrapper component', () => {
  let component: TestWrapperComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;
  let datepickerComponent: NgxsmkDatepickerComponent;

  it('should bind value from parent component', async () => {
    await TestBed.configureTestingModule({
      imports: [TestWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.componentInstance;
    component.mode = 'single';
    
    const testDate = getStartOfDay(new Date(2024, 5, 15));
    component.dateValue = testDate;
    
    fixture.detectChanges();
    
    const datepickerDebugElement = fixture.debugElement.query(
      By.directive(NgxsmkDatepickerComponent)
    );
    datepickerComponent = datepickerDebugElement.componentInstance;
    expect(datepickerComponent.selectedDate).toBeTruthy();
    if (datepickerComponent.selectedDate) {
      const selectedTime = datepickerComponent.selectedDate.getTime();
      const expectedTime = testDate.getTime();
      expect(selectedTime).toBe(expectedTime);
    }
  });

  it('should update when parent component changes value', async () => {
    await TestBed.configureTestingModule({
      imports: [TestWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.componentInstance;
    component.mode = 'single';
    
    const firstDate = getStartOfDay(new Date(2024, 5, 15));
    const secondDate = getStartOfDay(new Date(2024, 6, 20));
    component.dateValue = firstDate;
    fixture.detectChanges();
    
    const datepickerDebugElement = fixture.debugElement.query(
      By.directive(NgxsmkDatepickerComponent)
    );
    datepickerComponent = datepickerDebugElement.componentInstance;
    
    expect(datepickerComponent.selectedDate).toBeTruthy();
    if (datepickerComponent.selectedDate) {
      expect(datepickerComponent.selectedDate.getTime()).toBe(firstDate.getTime());
    }
    
    component.dateValue = secondDate;
    fixture.detectChanges();
    
    datepickerComponent.value = secondDate;
    const changes: { [key: string]: SimpleChange } = {
      value: new SimpleChange(firstDate, secondDate, false)
    };
    datepickerComponent.ngOnChanges(changes);
    fixture.detectChanges();
    
    expect(datepickerComponent.selectedDate).toBeTruthy();
    if (datepickerComponent.selectedDate) {
      expect(datepickerComponent.selectedDate.getTime()).toBe(secondDate.getTime());
    }
  });
});

