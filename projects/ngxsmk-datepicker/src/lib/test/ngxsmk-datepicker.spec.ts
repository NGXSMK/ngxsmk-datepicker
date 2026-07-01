import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() currentMonth: unknown;
  @Input() currentYear: unknown;
  @Input() monthOptions: unknown;
  @Input() yearOptions: unknown;
  @Input() disabled: unknown;
  @Input() isBackArrowDisabled: unknown;
  @Input() headerClass: unknown;
  @Input() navPrevClass: unknown;
  @Input() navNextClass: unknown;
  @Input() prevMonthAriaLabel: unknown;
  @Input() nextMonthAriaLabel: unknown;
  @Output() nextMonth = new EventEmitter<void>();
  @Output() previousMonth = new EventEmitter<void>();
  @Output() currentMonthChange = new EventEmitter<number>();
  @Output() currentYearChange = new EventEmitter<number>();
}

@Component({
  selector: 'ngxsmk-calendar-month-view',
  template: '',
  standalone: true,
})
class CalendarMonthViewStubComponent {
  @Input() days: unknown;
  @Input() selectedDate: unknown;
  @Input() selectedDates: unknown;
  @Input() startDate: unknown;
  @Input() endDate: unknown;
  @Input() currentMonth: unknown;
  @Input() currentYear: unknown;
  @Input() weekDays: unknown;
  @Input() isDateDisabled: unknown;
  @Input() isSameDay: unknown;
  @Input() isHoliday: unknown;
  @Input() getHolidayLabel: unknown;
  @Input() formatDayNumber: unknown;
  @Input() getDayCellCustomClasses: unknown;
  @Input() getDayCellTooltip: unknown;
  @Input() dayCellRenderHook: unknown;
  @Input() trackByDay: unknown;
  @Input() classes: unknown;
  @Input() ariaLabel: unknown;
  @Input() getAriaLabel: unknown;
  @Input() isInRange: unknown;
  @Input() isInComparisonRange: unknown;
  @Input() isPreviewInRange: unknown;
  @Input() isMultipleSelected: unknown;
  @Input() mode: unknown;
  @Input() focusedDate: unknown;
  @Input() today: unknown;
  @Input() dateTemplate: unknown;
  @Output() dateClick = new EventEmitter<Date>();
  @Output() dateHover = new EventEmitter<Date>();
  @Output() dateFocus = new EventEmitter<unknown>();
  @Output() swipeStart = new EventEmitter<any>();
  @Output() swipeMove = new EventEmitter<any>();
  @Output() swipeEnd = new EventEmitter<any>();
  @Output() touchStart = new EventEmitter<any>();
  @Output() touchMove = new EventEmitter<any>();
  @Output() touchEnd = new EventEmitter<any>();
}

@Component({
  selector: 'ngxsmk-calendar-year-view',
  template: '',
  standalone: true,
})
class CalendarYearViewStubComponent {
  @Input() viewMode: unknown;
  @Input() currentYear: unknown;
  @Input() minYear: unknown;
  @Input() maxYear: unknown;
  @Input() years: unknown;
  @Input() decades: unknown;
  @Output() yearSelected = new EventEmitter<number>();
  @Output() decadeSelected = new EventEmitter<number>();
}

@Component({
  selector: 'ngxsmk-time-selection',
  template: '',
  standalone: true,
})
class TimeSelectionStubComponent {
  @Input() currentDisplayHour: unknown;
  @Input() currentMinute: unknown;
  @Input() currentSecond: unknown;
  @Input() isPm: unknown;
  @Input() hourOptions: unknown;
  @Input() minuteOptions: unknown;
  @Input() secondOptions: unknown;
  @Input() ampmOptions: unknown;
  @Input() disabled: unknown;
  @Input() timeLabel: unknown;
  @Input() showSeconds: unknown;
  @Output() timeChange = new EventEmitter<void>();
  @Output() currentDisplayHourChange = new EventEmitter<number>();
  @Output() currentMinuteChange = new EventEmitter<number>();
  @Output() currentSecondChange = new EventEmitter<number>();
  @Output() isPmChange = new EventEmitter<boolean>();
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
        relatedTarget: null
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
      component.rangePresetFactory = (_today: Date) => [
        {
          id: 'test-preset',
          name: 'Test Preset',
          calculate: (t: Date) => ({ start: t, end: t })
        }
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
