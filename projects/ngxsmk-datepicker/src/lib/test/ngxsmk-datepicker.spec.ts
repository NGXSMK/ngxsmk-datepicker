import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { NgxsmkDatepickerContentComponent } from '../components/datepicker-content.component';
import { CalendarHeaderComponent } from '../components/calendar-header.component';
import { CalendarMonthViewComponent } from '../components/calendar-month-view.component';
import { CalendarYearViewComponent } from '../components/calendar-year-view.component';
import { TimeSelectionComponent } from '../components/time-selection.component';
import { getStartOfDay } from '../utils/date.utils';

// Stubs
@Component({
  selector: 'ngxsmk-calendar-header',
  template: '',
  standalone: true,
})
class CalendarHeaderStubComponent {
  readonly currentMonth = input<unknown>();
  readonly currentYear = input<unknown>();
  readonly monthOptions = input<unknown>();
  readonly yearOptions = input<unknown>();
  readonly disabled = input<unknown>();
  readonly isBackArrowDisabled = input<unknown>();
  readonly headerClass = input<unknown>();
  readonly navPrevClass = input<unknown>();
  readonly navNextClass = input<unknown>();
  readonly prevMonthAriaLabel = input<unknown>();
  readonly nextMonthAriaLabel = input<unknown>();
  readonly nextMonth = output<void>();
  readonly previousMonth = output<void>();
  readonly currentMonthChange = output<number>();
  readonly currentYearChange = output<number>();
}

@Component({
  selector: 'ngxsmk-calendar-month-view',
  template: '',
  standalone: true,
})
class CalendarMonthViewStubComponent {
  readonly days = input<unknown>();
  readonly selectedDate = input<unknown>();
  readonly selectedDates = input<unknown>();
  readonly startDate = input<unknown>();
  readonly endDate = input<unknown>();
  readonly currentMonth = input<unknown>();
  readonly currentYear = input<unknown>();
  readonly weekDays = input<unknown>();
  readonly isDateDisabled = input<unknown>();
  readonly isSameDay = input<unknown>();
  readonly isHoliday = input<unknown>();
  readonly getHolidayLabel = input<unknown>();
  readonly formatDayNumber = input<unknown>();
  readonly getDayCellCustomClasses = input<unknown>();
  readonly getDayCellTooltip = input<unknown>();
  readonly dayCellRenderHook = input<unknown>();
  readonly trackByDay = input<unknown>();
  readonly classes = input<unknown>();
  readonly ariaLabel = input<unknown>();
  readonly getAriaLabel = input<unknown>();
  readonly isInRange = input<unknown>();
  readonly isPreviewInRange = input<unknown>();
  readonly isMultipleSelected = input<unknown>();
  readonly mode = input<unknown>();
  readonly focusedDate = input<unknown>();
  readonly today = input<unknown>();
  readonly dateTemplate = input<unknown>();
  readonly dateClick = output<Date>();
  readonly dateHover = output<Date>();
  readonly dateFocus = output<unknown>();
  readonly swipeStart = output<any>();
  readonly swipeMove = output<any>();
  readonly swipeEnd = output<any>();
  readonly touchStart = output<any>();
  readonly touchMove = output<any>();
  readonly touchEnd = output<any>();
}

@Component({
  selector: 'ngxsmk-calendar-year-view',
  template: '',
  standalone: true,
})
class CalendarYearViewStubComponent {
  readonly viewMode = input<unknown>();
  readonly currentYear = input<unknown>();
  readonly minYear = input<unknown>();
  readonly maxYear = input<unknown>();
  readonly years = input<unknown>();
  readonly decades = input<unknown>();
  readonly yearSelected = output<number>();
  readonly decadeSelected = output<number>();
}

@Component({
  selector: 'ngxsmk-time-selection',
  template: '',
  standalone: true,
})
class TimeSelectionStubComponent {
  readonly currentDisplayHour = input<unknown>();
  readonly currentMinute = input<unknown>();
  readonly currentSecond = input<unknown>();
  readonly isPm = input<unknown>();
  readonly hourOptions = input<unknown>();
  readonly minuteOptions = input<unknown>();
  readonly secondOptions = input<unknown>();
  readonly ampmOptions = input<unknown>();
  readonly disabled = input<unknown>();
  readonly timeLabel = input<unknown>();
  readonly showSeconds = input<unknown>();
  readonly timeChange = output<void>();
  readonly currentDisplayHourChange = output<number>();
  readonly currentMinuteChange = output<number>();
  readonly currentSecondChange = output<number>();
  readonly isPmChange = output<boolean>();
}

describe('NgxsmkDatepickerComponent', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
      providers: [DatePipe],
    })
      .overrideComponent(NgxsmkDatepickerComponent, {
        remove: {
          imports: [
            CalendarHeaderComponent,
            CalendarMonthViewComponent,
            CalendarYearViewComponent,
            TimeSelectionComponent,
          ],
        },
        add: {
          imports: [
            CalendarHeaderStubComponent,
            CalendarMonthViewStubComponent,
            CalendarYearViewStubComponent,
            TimeSelectionStubComponent,
          ],
        },
      })
      .overrideComponent(NgxsmkDatepickerContentComponent, {
        remove: {
          imports: [
            CalendarHeaderComponent,
            CalendarMonthViewComponent,
            CalendarYearViewComponent,
            TimeSelectionComponent,
          ],
        },
        add: {
          imports: [
            CalendarHeaderStubComponent,
            CalendarMonthViewStubComponent,
            CalendarYearViewStubComponent,
            TimeSelectionStubComponent,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    component.inline = true;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the next month when the nextMonth event is emitted from header', () => {
    component.currentMonth = 0; // January
    fixture.detectChanges();

    const headerDebugEl = fixture.debugElement.query(By.directive(CalendarHeaderStubComponent));
    expect(headerDebugEl).withContext('CalendarHeaderStubComponent not found').toBeTruthy();

    // Simulate next month event
    headerDebugEl.componentInstance.nextMonth.emit();
    fixture.detectChanges();

    expect(component.currentMonth).toBe(1); // February
  });

  it('should select a single date and emit valueChange when dateClick is emitted from month view', () => {
    spyOn(component.valueChange, 'emit');
    component.mode = 'single';
    fixture.detectChanges();

    const monthViewDebugEl = fixture.debugElement.query(By.directive(CalendarMonthViewStubComponent));
    expect(monthViewDebugEl).withContext('CalendarMonthViewStubComponent not found').toBeTruthy();

    const testDate = new Date(component.currentYear, component.currentMonth, 15);

    // Simulate date click event
    monthViewDebugEl.componentInstance.dateClick.emit(testDate);
    fixture.detectChanges();

    expect(component.selectedDate).toEqual(testDate);
    expect(component.valueChange.emit).toHaveBeenCalled();
  });

  it('should identify disabled dates via isDateDisabled method', () => {
    const today = new Date();
    const minDate = getStartOfDay(new Date(today.getFullYear(), today.getMonth(), 15));
    component.minDate = minDate;

    const disabledDate = new Date(today.getFullYear(), today.getMonth(), 10);
    const enabledDate = new Date(today.getFullYear(), today.getMonth(), 20);

    expect(component.isDateDisabled(disabledDate)).toBe(true);
    expect(component.isDateDisabled(enabledDate)).toBe(false);
  });

  describe('New Features Integration', () => {
    it('should support natural language input fallback on blur', () => {
      component.enableNaturalLanguage = true;
      component.allowTyping = true;
      spyOn(component.naturalLanguageResolved, 'emit');
      fixture.detectChanges();

      const event = {
        target: { value: 'today' },
        relatedTarget: null,
      } as unknown as FocusEvent;

      component.onInputBlur(event);
      expect(component.selectedDate).toBeDefined();
      expect(component.naturalLanguageResolved.emit).toHaveBeenCalled();
    });

    it('should alias calendars to calendarCount', () => {
      component.calendars = 3;
      expect(component.calendarCount).toBe(3);
      expect(component.calendars).toBe(3);
    });

    it('should build presets using rangePresetFactory', () => {
      component.rangePresetFactory = (today: Date) => [
        {
          id: 'test-preset',
          name: 'Test Preset',
          calculate: (t: Date) => ({ start: t, end: t }),
        },
      ];
      (component as any).updateRangesArray();
      expect(component.rangesArray.length).toBeGreaterThan(0);
      expect(component.rangesArray[0].key).toBe('Test Preset');
    });

    it('should validate range selection and emit invalidRange if disabled date is inside', () => {
      component.mode = 'range';
      component.isDateDisabled = (d: Date | null) => {
        if (!d) return false;
        return d.getDate() === 15; // Disable 15th
      };
      spyOn(component.invalidRange, 'emit');

      const start = new Date(2026, 5, 10);
      const end = new Date(2026, 5, 20);
      component.checkAndEmitInvalidRange(start, end);

      expect(component.invalidRange.emit).toHaveBeenCalled();
    });

    it('should handle timezone selector selection changes', () => {
      spyOn(component.timezoneChange, 'emit');
      component.setTimezone('America/New_York');
      expect(component.timezone).toBe('America/New_York');
      expect(component.timezoneChange.emit).toHaveBeenCalledWith('America/New_York');
    });
  });
});
