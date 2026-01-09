import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { CalendarHeaderComponent } from '../components/calendar-header.component';
import { CalendarMonthViewComponent } from '../components/calendar-month-view.component';
import { CalendarYearViewComponent } from '../components/calendar-year-view.component';
import { TimeSelectionComponent } from '../components/time-selection.component';
import { getStartOfDay } from '../utils/date.utils';

// Stubs
@Component({
  selector: 'ngxsmk-calendar-header',
  template: '',
  standalone: true
})
class CalendarHeaderStubComponent {
  @Input() currentMonth: any;
  @Input() currentYear: any;
  @Input() monthOptions: any;
  @Input() yearOptions: any;
  @Input() disabled: any;
  @Input() isBackArrowDisabled: any;
  @Input() headerClass: any;
  @Input() navPrevClass: any;
  @Input() navNextClass: any;
  @Input() prevMonthAriaLabel: any;
  @Input() nextMonthAriaLabel: any;
  @Output() nextMonth = new EventEmitter<void>();
  @Output() previousMonth = new EventEmitter<void>();
  @Output() currentMonthChange = new EventEmitter<number>();
  @Output() currentYearChange = new EventEmitter<number>();
}

@Component({
  selector: 'ngxsmk-calendar-month-view',
  template: '',
  standalone: true
})
class CalendarMonthViewStubComponent {
  @Input() days: any;
  @Input() selectedDate: any;
  @Input() selectedDates: any;
  @Input() startDate: any;
  @Input() endDate: any;
  @Input() currentMonth: any;
  @Input() currentYear: any;
  @Input() weekDays: any;
  @Input() isDateDisabled: any;
  @Input() isSameDay: any;
  @Input() isHoliday: any;
  @Input() getHolidayLabel: any;
  @Input() formatDayNumber: any;
  @Input() getDayCellCustomClasses: any;
  @Input() getDayCellTooltip: any;
  @Input() dayCellRenderHook: any;
  @Input() trackByDay: any;
  @Input() classes: any;
  @Input() ariaLabel: any;
  @Input() getAriaLabel: any;
  @Input() isInRange: any;
  @Input() isPreviewInRange: any;
  @Input() isMultipleSelected: any;
  @Input() mode: any;
  @Input() focusedDate: any;
  @Input() today: any;
  @Output() dateClick = new EventEmitter<Date>();
  @Output() dateHover = new EventEmitter<Date>();
  @Output() dateFocus = new EventEmitter<any>();
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
  standalone: true
})
class CalendarYearViewStubComponent {
  @Input() viewMode: any;
  @Input() currentYear: any;
  @Input() minYear: any;
  @Input() maxYear: any;
  @Input() years: any;
  @Input() decades: any;
  @Output() yearSelected = new EventEmitter<number>();
  @Output() decadeSelected = new EventEmitter<number>();
}

@Component({
  selector: 'ngxsmk-time-selection',
  template: '',
  standalone: true
})
class TimeSelectionStubComponent {
  @Input() currentDisplayHour: any;
  @Input() currentMinute: any;
  @Input() currentSecond: any;
  @Input() isPm: any;
  @Input() hourOptions: any;
  @Input() minuteOptions: any;
  @Input() secondOptions: any;
  @Input() ampmOptions: any;
  @Input() disabled: any;
  @Input() timeLabel: any;
  @Input() showSeconds: any;
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
      imports: [NgxsmkDatepickerComponent]
    })
      .overrideComponent(NgxsmkDatepickerComponent, {
        remove: { imports: [CalendarHeaderComponent, CalendarMonthViewComponent, CalendarYearViewComponent, TimeSelectionComponent] },
        add: { imports: [CalendarHeaderStubComponent, CalendarMonthViewStubComponent, CalendarYearViewStubComponent, TimeSelectionStubComponent] }
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
});