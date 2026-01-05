import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import * as AngularCore from '@angular/core';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { getStartOfDay, getEndOfDay, getStartOfMonth, getEndOfMonth } from '../utils/date.utils';
import { HolidayProvider, DatepickerValue } from '../utils/calendar.utils';

const form = (AngularCore as any).form;
const objectSchema = (AngularCore as any).objectSchema;

class TestHolidayProvider implements HolidayProvider {
  private holidays: { [key: string]: string } = {
    '2025-01-01': 'New Year\'s Day',
    '2025-12-25': 'Christmas Day',
  };

  private formatDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isHoliday(date: Date): boolean {
    const key = this.formatDateKey(date);
    return !!this.holidays[key];
  }

  getHolidayLabel(date: Date): string | null {
    const key = this.formatDateKey(date);
    return this.holidays[key] || null;
  }
}

describe('NgxsmkDatepickerComponent - Comprehensive Feature Tests', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    component.inline = true;
    fixture.detectChanges();
  });

  describe('Basic Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should have default mode as single', () => {
      expect(component.mode).toBe('single');
    });

    it('should initialize with null value', () => {
      expect(component.value).toBeNull();
    });
  });

  describe('Single Date Selection', () => {
    it('should select a single date and emit valueChange', () => {
      spyOn(component.valueChange, 'emit');
      component.mode = 'single';
      fixture.detectChanges();

      const testDate = new Date(2025, 5, 15);
      component.onDateClick(testDate);
      fixture.detectChanges();

      expect(component.selectedDate).toBeTruthy();
      expect(component.valueChange.emit).toHaveBeenCalled();
    });

    it('should display selected date in displayValue', () => {
      component.mode = 'single';
      const testDate = getStartOfDay(new Date(2025, 5, 15));
      component.selectedDate = testDate;
      fixture.detectChanges();

      const displayValue = component.displayValue;
      expect(displayValue).toBeTruthy();
      expect(displayValue).toContain('15');
    });
  });

  describe('Range Date Selection', () => {
    it('should select a date range', () => {
      spyOn(component.valueChange, 'emit');
      component.mode = 'range';
      fixture.detectChanges();

      const startDate = new Date(2025, 5, 10);
      const endDate = new Date(2025, 5, 20);

      component.onDateClick(startDate);
      fixture.detectChanges();
      expect(component.startDate).toBeTruthy();
      expect(component.endDate).toBeNull();

      component.onDateClick(endDate);
      fixture.detectChanges();
      expect(component.endDate).toBeTruthy();
      expect(component.valueChange.emit).toHaveBeenCalled();
    });

    it('should display range in displayValue', () => {
      component.mode = 'range';
      component.startDate = getStartOfDay(new Date(2025, 5, 10));
      component.endDate = getEndOfDay(new Date(2025, 5, 20));
      fixture.detectChanges();

      const displayValue = component.displayValue;
      expect(displayValue).toBeTruthy();
      expect(displayValue).toContain('-');
    });
  });

  describe('Multiple Date Selection', () => {
    it('should select multiple dates', () => {
      spyOn(component.valueChange, 'emit');
      component.mode = 'multiple';
      fixture.detectChanges();

      const date1 = getStartOfDay(new Date(2025, 5, 10));
      const date2 = getStartOfDay(new Date(2025, 5, 15));
      const date3 = getStartOfDay(new Date(2025, 5, 20));

      component.onDateClick(date1);
      fixture.detectChanges();
      expect(component.selectedDates.length).toBe(1);

      component.onDateClick(date2);
      fixture.detectChanges();
      expect(component.selectedDates.length).toBe(2);

      component.onDateClick(date3);
      fixture.detectChanges();
      expect(component.selectedDates.length).toBe(3);
      expect(component.valueChange.emit).toHaveBeenCalledTimes(3);
    });

    it('should toggle date selection when clicking same date twice', () => {
      component.mode = 'multiple';
      fixture.detectChanges();

      const date = getStartOfDay(new Date(2025, 5, 15));
      component.onDateClick(date);
      fixture.detectChanges();
      expect(component.selectedDates.length).toBe(1);

      component.onDateClick(date);
      fixture.detectChanges();
      expect(component.selectedDates.length).toBe(0);
    });
  });

  describe('Programmatic Value Setting', () => {
    it('should accept single date via writeValue', () => {
      component.mode = 'single';
      const testDate = getStartOfDay(new Date(2025, 5, 15));
      component.writeValue(testDate);
      fixture.detectChanges();

      expect(component.selectedDate).toBeTruthy();
      expect(component.selectedDate?.getTime()).toBe(testDate.getTime());
    });

    it('should accept range via writeValue', () => {
      component.mode = 'range';
      const range = {
        start: getStartOfDay(new Date(2025, 5, 10)),
        end: getEndOfDay(new Date(2025, 5, 20))
      };
      component.writeValue(range);
      fixture.detectChanges();

      expect(component.startDate).toBeTruthy();
      expect(component.endDate).toBeTruthy();
    });

    it('should accept multiple dates via writeValue', () => {
      component.mode = 'multiple';
      const dates = [
        getStartOfDay(new Date(2025, 5, 10)),
        getStartOfDay(new Date(2025, 5, 15)),
        getStartOfDay(new Date(2025, 5, 20))
      ];
      component.writeValue(dates);
      fixture.detectChanges();

      expect(component.selectedDates.length).toBe(3);
    });
  });

  describe('Week Start Configuration', () => {
    it('should use locale-based week start by default', () => {
      component.locale = 'en-US';
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.weekDays.length).toBe(7);
    });

    it('should override week start when weekStart input is provided', () => {
      component.weekStart = 1;
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.weekDays.length).toBe(7);
      expect(component.weekDays[0]).toBeTruthy();
    });
  });

  describe('Year Range Configuration', () => {
    it('should use default year range of 10', () => {
      component.yearRange = 10;
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.yearOptions.length).toBe(21);
    });

    it('should use custom year range', () => {
      component.yearRange = 5;
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.yearOptions.length).toBe(11);
    });
  });

  describe('Custom Labels', () => {
    it('should use custom clear label', () => {
      component.clearLabel = 'Reset';
      fixture.detectChanges();

      expect(component.clearLabel).toBe('Reset');
    });

    it('should use custom close label', () => {
      component.closeLabel = 'Done';
      fixture.detectChanges();

      expect(component.closeLabel).toBe('Done');
    });

    it('should use custom aria labels', () => {
      component.prevMonthAriaLabel = 'Go to previous month';
      component.nextMonthAriaLabel = 'Go to next month';
      component.clearAriaLabel = 'Clear date selection';
      component.closeAriaLabel = 'Close date picker';
      fixture.detectChanges();

      expect(component.prevMonthAriaLabel).toBe('Go to previous month');
      expect(component.nextMonthAriaLabel).toBe('Go to next month');
      expect(component.clearAriaLabel).toBe('Clear date selection');
      expect(component.closeAriaLabel).toBe('Close date picker');
    });
  });

  describe('Classes Input for Theming', () => {
    it('should accept classes input', () => {
      const customClasses = {
        inputGroup: 'custom-input-group',
        input: 'custom-input',
        popover: 'custom-popover',
        dayCell: 'custom-day-cell'
      };
      component.classes = customClasses;
      fixture.detectChanges();

      expect(component.classes).toEqual(customClasses);
    });

    it('should handle partial classes object', () => {
      const partialClasses = {
        inputGroup: 'custom-input-group'
      };
      component.classes = partialClasses;
      fixture.detectChanges();

      expect(component.classes?.inputGroup).toBe('custom-input-group');
    });
  });

  describe('Disabled Dates', () => {
    it('should disable specific dates', () => {
      const disabledDate = getStartOfDay(new Date(2025, 5, 15));
      component.disabledDates = [disabledDate];
      fixture.detectChanges();

      const isDisabled = component.isDateDisabled(disabledDate);
      expect(isDisabled).toBe(true);
    });

    it('should disable dates from string array', () => {
      component.disabledDates = ['06/15/2025'];
      fixture.detectChanges();

      const testDate = new Date(2025, 5, 15);
      const isDisabled = component.isDateDisabled(testDate);
      expect(isDisabled).toBe(true);
    });
  });

  describe('Min/Max Date Constraints', () => {
    it('should disable dates before minDate', () => {
      const minDate = getStartOfDay(new Date(2025, 5, 15));
      component.minDate = minDate;
      fixture.detectChanges();

      const beforeMin = new Date(2025, 5, 14);
      const isDisabled = component.isDateDisabled(beforeMin);
      expect(isDisabled).toBe(true);
    });

    it('should disable dates after maxDate', () => {
      const maxDate = getEndOfDay(new Date(2025, 5, 20));
      component.maxDate = maxDate;
      fixture.detectChanges();

      const afterMax = new Date(2025, 5, 21);
      const isDisabled = component.isDateDisabled(afterMax);
      expect(isDisabled).toBe(true);
    });

    it('should allow dates within min/max range', () => {
      component.minDate = getStartOfDay(new Date(2025, 5, 10));
      component.maxDate = getEndOfDay(new Date(2025, 5, 20));
      fixture.detectChanges();

      const validDate = new Date(2025, 5, 15);
      const isDisabled = component.isDateDisabled(validDate);
      expect(isDisabled).toBe(false);
    });
  });

  describe('Holiday Provider', () => {
    it('should mark holidays when holiday provider is set', () => {
      const holidayProvider = new TestHolidayProvider();
      component.holidayProvider = holidayProvider;
      fixture.detectChanges();

      const newYear = new Date(2025, 0, 1);
      const isHoliday = component.isHoliday(newYear);
      expect(isHoliday).toBe(true);
    });

    it('should get holiday label when available', () => {
      const holidayProvider = new TestHolidayProvider();
      component.holidayProvider = holidayProvider;
      fixture.detectChanges();

      const newYear = new Date(2025, 0, 1);
      const label = component.getHolidayLabel(newYear);
      expect(label).toBe('New Year\'s Day');
    });

    it('should disable holidays when disableHolidays is true', () => {
      const holidayProvider = new TestHolidayProvider();
      component.holidayProvider = holidayProvider;
      component.disableHolidays = true;
      fixture.detectChanges();

      const newYear = new Date(2025, 0, 1);
      const isDisabled = component.isDateDisabled(newYear);
      expect(isDisabled).toBe(true);
    });
  });

  describe('Time Selection', () => {
    it('should show time selection when showTime is true', () => {
      component.showTime = true;
      fixture.detectChanges();

      expect(component.showTime).toBe(true);
    });

    it('should update time when time controls change', () => {
      component.showTime = true;
      component.mode = 'single';
      component.selectedDate = getStartOfDay(new Date(2025, 5, 15));
      fixture.detectChanges();

      component.currentDisplayHour = 2;
      component.currentMinute = 30;
      component.isPm = true;
      component.timeChange();
      fixture.detectChanges();

      expect(component.selectedDate).toBeTruthy();
      expect(component.selectedDate?.getHours()).toBe(14);
      expect(component.selectedDate?.getMinutes()).toBe(30);
    });
  });

  describe('Inline Mode', () => {
    it('should be in inline mode when inline is true', () => {
      component.inline = true;
      fixture.detectChanges();

      expect(component.isInlineMode).toBe(true);
    });

    it('should be in inline mode when inline is "always"', () => {
      component.inline = 'always';
      fixture.detectChanges();

      expect(component.isInlineMode).toBe(true);
    });

    it('should show calendar when inline', () => {
      component.inline = true;
      fixture.detectChanges();

      expect(component.isCalendarVisible).toBe(true);
    });
  });

  describe('Theme Configuration', () => {
    it('should have default theme as light', () => {
      expect(component.theme).toBe('light');
    });

    it('should switch to dark theme', () => {
      component.theme = 'dark';
      fixture.detectChanges();

      expect(component.theme).toBe('dark');
      expect(component.isDarkMode).toBe(true);
    });
  });

  describe('ControlValueAccessor Integration', () => {
    it('should implement ControlValueAccessor', () => {
      expect(component.writeValue).toBeDefined();
      expect(component.registerOnChange).toBeDefined();
      expect(component.registerOnTouched).toBeDefined();
      expect(component.setDisabledState).toBeDefined();
    });

    it('should update value when writeValue is called', () => {
      const testDate = getStartOfDay(new Date(2025, 5, 15));
      component.writeValue(testDate);
      fixture.detectChanges();

      expect(component.value).toBeTruthy();
    });

    it('should call onChange callback when value changes', () => {
      let onChangeValue: DatepickerValue = null;
      component.registerOnChange((value: DatepickerValue) => {
        onChangeValue = value;
      });

      const testDate = getStartOfDay(new Date(2025, 5, 15));
      component.mode = 'single';
      component.onDateClick(testDate);
      fixture.detectChanges();

      expect(onChangeValue).toBeTruthy();
    });

    it('should handle disabled state', () => {
      component.setDisabledState(true);
      fixture.detectChanges();

      expect(component.disabled).toBe(true);
    });
  });

  describe('FormControl Integration', () => {
    it('should work with FormControl', () => {
      fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
      component = fixture.componentInstance;
      component.inline = true;
      fixture.detectChanges();

      const testDate = getStartOfDay(new Date(2025, 5, 15));
      component.writeValue(testDate);
      fixture.detectChanges();

      expect(component.value).toBeTruthy();
    });
  });

  describe('Signal Forms Integration (Angular 21+)', () => {
    it('should mark Signal Form as dirty when date is selected via [field] binding', () => {
      if (typeof form !== 'function' || typeof objectSchema !== 'function') {
        pending('Signal Forms API not available - requires Angular 21+');
        return;
      }

      @Component({
        standalone: true,
        imports: [NgxsmkDatepickerComponent],
        template: `
          <ngxsmk-datepicker
            [field]="myForm.dateField"
            mode="single"
            [inline]="true">
          </ngxsmk-datepicker>
        `
      })
      class TestSignalFormComponent {
        localObject = signal({ dateField: new Date(2025, 0, 1) });
        myForm = form(this.localObject, objectSchema({
          dateField: (objectSchema as any)()
        }));
      }

      const testFixture = TestBed.createComponent(TestSignalFormComponent);
      testFixture.detectChanges();

      const testComponent = testFixture.componentInstance;
      const datepickerComponent = testFixture.debugElement.query(
        By.directive(NgxsmkDatepickerComponent)
      ).componentInstance as NgxsmkDatepickerComponent;

      expect(testComponent.myForm().dirty()).toBe(false);

      const newDate = getStartOfDay(new Date(2025, 5, 15));
      datepickerComponent.onDateClick(newDate);
      testFixture.detectChanges();

      expect(testComponent.myForm().dirty()).toBe(true);
    });

    it('should use setValue or updateValue when available to track dirty state', () => {
      if (typeof form !== 'function' || typeof objectSchema !== 'function') {
        pending('Signal Forms API not available - requires Angular 21+');
        return;
      }

      @Component({
        standalone: true,
        imports: [NgxsmkDatepickerComponent],
        template: `
          <ngxsmk-datepicker
            [field]="myForm.dateField"
            mode="single"
            [inline]="true">
          </ngxsmk-datepicker>
        `
      })
      class TestSignalFormComponent {
        localObject = signal({ dateField: new Date(2025, 0, 1) });
        myForm = form(this.localObject, objectSchema({
          dateField: (objectSchema as any)()
        }));
      }

      const testFixture = TestBed.createComponent(TestSignalFormComponent);
      testFixture.detectChanges();

      const testComponent = testFixture.componentInstance;
      const datepickerComponent = testFixture.debugElement.query(
        By.directive(NgxsmkDatepickerComponent)
      ).componentInstance as NgxsmkDatepickerComponent;

      const field = testComponent.myForm.dateField;
      const hasSetValue = typeof (field as any).setValue === 'function';
      const hasUpdateValue = typeof (field as any).updateValue === 'function';
      
      expect(hasSetValue || hasUpdateValue).toBe(true);

      const newDate = getStartOfDay(new Date(2025, 5, 15));
      datepickerComponent.onDateClick(newDate);
      testFixture.detectChanges();

      expect(testComponent.myForm().dirty()).toBe(true);
    });
  });

  describe('Clear Value Functionality', () => {
    it('should clear single date selection', () => {
      component.mode = 'single';
      component.selectedDate = getStartOfDay(new Date(2025, 5, 15));
      fixture.detectChanges();

      component.clearValue();
      fixture.detectChanges();

      expect(component.selectedDate).toBeNull();
      expect(component.value).toBeNull();
    });

    it('should clear range selection', () => {
      component.mode = 'range';
      component.startDate = getStartOfDay(new Date(2025, 5, 10));
      component.endDate = getEndOfDay(new Date(2025, 5, 20));
      fixture.detectChanges();

      component.clearValue();
      fixture.detectChanges();

      expect(component.startDate).toBeNull();
      expect(component.endDate).toBeNull();
    });

    it('should clear multiple dates selection', () => {
      component.mode = 'multiple';
      component.selectedDates = [
        getStartOfDay(new Date(2025, 5, 10)),
        getStartOfDay(new Date(2025, 5, 15))
      ];
      fixture.detectChanges();

      component.clearValue();
      fixture.detectChanges();

      expect(component.selectedDates.length).toBe(0);
    });
  });

  describe('Month Navigation', () => {
    it('should navigate to next month', () => {
      const initialMonth = component.currentMonth;
      component.changeMonth(1);
      fixture.detectChanges();

      const expectedMonth = (initialMonth + 1) % 12;
      expect(component.currentMonth).toBe(expectedMonth);
    });

    it('should navigate to previous month', () => {
      const initialMonth = component.currentMonth;
      component.changeMonth(-1);
      fixture.detectChanges();

      const expectedMonth = initialMonth === 0 ? 11 : initialMonth - 1;
      expect(component.currentMonth).toBe(expectedMonth);
    });

    it('should disable back arrow when minDate prevents navigation', () => {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      component.minDate = firstDayOfMonth;
      fixture.detectChanges();

      expect(component.isBackArrowDisabled).toBe(true);
    });
  });

  describe('Range Selection with Predefined Ranges', () => {
    it('should select predefined range', () => {
      spyOn(component.valueChange, 'emit');
      component.mode = 'range';
      const start = getStartOfDay(new Date(2025, 5, 1));
      const end = getEndOfDay(new Date(2025, 5, 30));
      const range: [Date, Date] = [start, end];

      component.selectRange(range);
      fixture.detectChanges();

      expect(component.startDate).toBeTruthy();
      expect(component.endDate).toBeTruthy();
      expect(component.valueChange.emit).toHaveBeenCalled();
    });
  });

  describe('Range Mode Previous Month Selection', () => {
    it('should allow selecting dates from previous month in range mode with null initial values', () => {
      component.mode = 'range';
      component.inline = true;
      fixture.detectChanges();

      component.writeValue(null);
      fixture.detectChanges();

      const currentMonth = new Date(2024, 6, 15);
      component.currentDate = currentMonth;
      component.generateCalendar();
      fixture.detectChanges();

      expect(component.startDate).toBeNull();
      expect(component.endDate).toBeNull();

      const previousMonthDate = getStartOfDay(new Date(2024, 5, 25));
      const isDisabled = component.isDateDisabled(previousMonthDate);
      
      if (!isDisabled) {
        spyOn(component.valueChange, 'emit');
        component.onDateClick(previousMonthDate);
        fixture.detectChanges();

        expect(component.startDate).toBeTruthy();
        expect(component.startDate!.getMonth()).toBe(5);
        expect(component.endDate).toBeNull();
        expect(component.valueChange.emit).not.toHaveBeenCalled();
      }
    });
  });

  describe('Accessibility Features', () => {
    it('should have aria labels on navigation buttons', () => {
      component.inline = true;
      fixture.detectChanges();

      const navButtons = fixture.debugElement.queryAll(By.css('.ngxsmk-nav-button'));
      expect(navButtons.length).toBeGreaterThan(0);
    });

    it('should have role and aria attributes on input group', () => {
      component.inline = false;
      component.ngOnInit();
      fixture.detectChanges();

      const inputGroup = fixture.debugElement.query(By.css('.ngxsmk-input-group'));
      expect(inputGroup).withContext('Input group should be rendered when not in inline mode').toBeTruthy();
      if (inputGroup) {
        expect(inputGroup.nativeElement.getAttribute('role')).toBe('button');
        expect(inputGroup.nativeElement.getAttribute('aria-haspopup')).toBe('dialog');
      } else {
        expect(component.isInlineMode).toBe(false);
      }
    });
  });

  describe('Locale Configuration', () => {
    it('should use browser locale by default', () => {
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.locale).toBeTruthy();
    });

    it('should use custom locale', () => {
      component.locale = 'de-DE';
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.locale).toBe('de-DE');
    });
  });

  describe('Placeholder Configuration', () => {
    it('should have default placeholder', () => {
      expect(component.placeholder).toBe('Select date');
    });

    it('should use custom placeholder', () => {
      component.placeholder = 'Choose a date';
      fixture.detectChanges();

      expect(component.placeholder).toBe('Choose a date');
    });
  });

  describe('Action Events', () => {
    it('should emit action event on date selection', () => {
      spyOn(component.action, 'emit');
      component.mode = 'single';
      const testDate = new Date(2025, 5, 15);
      component.onDateClick(testDate);
      fixture.detectChanges();

      expect(component.action.emit).toHaveBeenCalled();
    });

    it('should emit action event on clear', () => {
      spyOn(component.action, 'emit');
      component.clearValue();
      fixture.detectChanges();

      expect(component.action.emit).toHaveBeenCalledWith({ type: 'clear', payload: null });
    });
  });

});

