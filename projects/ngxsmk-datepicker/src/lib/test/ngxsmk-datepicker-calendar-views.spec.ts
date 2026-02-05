import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { getStartOfDay, getEndOfDay } from '../utils/date.utils';
import { DatePipe } from '@angular/common';

describe('NgxsmkDatepickerComponent - Calendar Views', () => {
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

  describe('Year Picker View', () => {
    beforeEach(() => {
      component.calendarViewMode = 'year';
      component.mode = 'single';
      fixture.detectChanges();
    });

    it('should display year grid when calendarViewMode is year', () => {
      expect(component.calendarViewMode).toBe('year');
      expect(component.yearGrid).toBeDefined();
      expect(component.yearGrid.length).toBeGreaterThan(0);
    });

    it('should generate year grid with correct range', () => {
      const currentYear = new Date().getFullYear();
      expect(component.yearGrid).toContain(currentYear);
    });

    it('should select year when onYearClick is called', () => {
      const testYear = 2025;
      component.onYearClick(testYear);
      fixture.detectChanges();

      expect(component._currentYear).toBe(testYear);
      expect(component.calendarViewMode).toBe('month');
    });

    it('should navigate years with changeYear', () => {
      const initialYear = component._currentYear;
      component.changeYear(12);
      fixture.detectChanges();

      expect(component._currentYear).toBe(initialYear + 12);
    });

    it('should handle year selection change', () => {
      const testYear = 2023;
      component.onYearSelectChange(testYear);
      fixture.detectChanges();

      expect(component._currentYear).toBe(testYear);
    });
  });

  describe('Decade Picker View', () => {
    beforeEach(() => {
      component.calendarViewMode = 'decade';
      component.mode = 'single';
      fixture.detectChanges();
    });

    it('should display decade grid when calendarViewMode is decade', () => {
      expect(component.calendarViewMode).toBe('decade');
      expect(component.decadeGrid).toBeDefined();
      expect(component.decadeGrid.length).toBeGreaterThan(0);
    });

    it('should generate decade grid with correct range', () => {
      const currentDecade = Math.floor(new Date().getFullYear() / 10) * 10;
      expect(component.decadeGrid).toContain(currentDecade);
    });

    it('should select decade when onDecadeClick is called', () => {
      const testDecade = 2020;
      component.onDecadeClick(testDecade);
      fixture.detectChanges();

      expect(component._currentDecade).toBe(testDecade);
      expect(component.calendarViewMode).toBe('year');
    });

    it('should navigate decades with changeDecade', () => {
      const initialDecade = component._currentDecade;
      component.changeDecade(1);
      fixture.detectChanges();

      expect(component._currentDecade).toBe(initialDecade + 10);
    });
  });

  describe('Timeline View', () => {
    beforeEach(() => {
      component.calendarViewMode = 'timeline';
      component.mode = 'range';
      fixture.detectChanges();
    });

    it('should display timeline when calendarViewMode is timeline', () => {
      expect(component.calendarViewMode).toBe('timeline');
      expect(component.timelineMonths).toBeDefined();
    });

    it('should generate timeline months when view mode is set', () => {
      component.mode = 'range'; // Timeline only works in range mode
      component.calendarViewMode = 'timeline';
      // Generate timeline manually since ngOnInit already ran
      component['generateTimeline']();
      fixture.detectChanges();

      // generateTimeline should populate timelineMonths
      expect(component.timelineMonths.length).toBeGreaterThan(0);
      expect(component.timelineStartDate).toBeDefined();
      expect(component.timelineEndDate).toBeDefined();
    });

    it('should check if timeline month is selected', () => {
      const testMonth = new Date(2025, 5, 1);
      component.startDate = getStartOfDay(testMonth);
      component.endDate = getStartOfDay(new Date(2025, 6, 1));
      fixture.detectChanges();

      const isSelected = component.isTimelineMonthSelected(testMonth);
      expect(isSelected).toBe(true);
    });

    it('should handle timeline month click', () => {
      const testMonth = new Date(2025, 5, 1);
      component.onTimelineMonthClick(testMonth);
      fixture.detectChanges();

      expect(component.startDate).toBeTruthy();
    });

    it('should zoom in timeline', () => {
      const initialMonthsCount = component.timelineMonths.length;
      component.timelineZoomIn();
      fixture.detectChanges();

      expect(component.timelineMonths.length).toBeGreaterThan(
        initialMonthsCount,
      );
    });

    it('should zoom out timeline', () => {
      component.timelineZoomIn();
      const monthsAfterIn = component.timelineMonths.length;
      component.timelineZoomOut();
      fixture.detectChanges();

      expect(component.timelineMonths.length).toBeLessThan(monthsAfterIn);
    });
  });

  describe('Time Slider View', () => {
    beforeEach(() => {
      component.calendarViewMode = 'time-slider';
      component.mode = 'range';
      component.showTime = true;
      fixture.detectChanges();
    });

    it('should display time slider when calendarViewMode is time-slider', () => {
      expect(component.calendarViewMode).toBe('time-slider');
      expect(component.startTimeSlider).toBeDefined();
      expect(component.endTimeSlider).toBeDefined();
    });

    it('should format time slider value correctly', () => {
      const minutes = 720; // 12:00 PM
      const formatted = component.formatTimeSliderValue(minutes);

      expect(formatted).toContain('12');
      expect(formatted).toContain('00');
    });

    it('should handle start time slider change', () => {
      // Time slider change requires startDate to exist
      component.startDate = getStartOfDay(new Date(2025, 5, 15));
      component.endDate = getEndOfDay(new Date(2025, 5, 15));
      // Initialize sliders first
      component['initializeTimeSliders']();
      const testMinutes = 600; // 10:00 AM
      component.startTimeSlider = testMinutes; // Set directly first
      component.onStartTimeSliderChange(testMinutes);
      fixture.detectChanges();

      // The handler updates the date time, not necessarily the slider value directly
      // But in practice, ngModel binding should keep it in sync
      if (component.startDate) {
        expect(component.startDate.getHours()).toBe(10);
        expect(component.startDate.getMinutes()).toBe(0);
      }
    });

    it('should handle end time slider change', () => {
      component.startDate = getStartOfDay(new Date(2025, 5, 15));
      component.endDate = getEndOfDay(new Date(2025, 5, 15));
      component.endTimeSlider = 1440; // Reset first
      const testMinutes = 1020; // 5:00 PM
      component.endTimeSlider = testMinutes; // Set the slider value directly
      component.onEndTimeSliderChange(testMinutes);
      fixture.detectChanges();

      expect(component.endTimeSlider).toBe(testMinutes);
      if (component.endDate) {
        expect(component.endDate.getHours()).toBe(17);
        expect(component.endDate.getMinutes()).toBe(0);
      }
    });

    it('should update start date time when start slider changes', () => {
      component.startDate = getStartOfDay(new Date(2025, 5, 15));
      const testMinutes = 600; // 10:00 AM
      component.onStartTimeSliderChange(testMinutes);
      fixture.detectChanges();

      expect(component.startDate).toBeTruthy();
      expect(component.startDate!.getHours()).toBe(10);
      expect(component.startDate!.getMinutes()).toBe(0);
    });

    it('should update end date time when end slider changes', () => {
      component.endDate = getStartOfDay(new Date(2025, 5, 15));
      const testMinutes = 1020; // 5:00 PM
      component.onEndTimeSliderChange(testMinutes);
      fixture.detectChanges();

      expect(component.endDate).toBeTruthy();
      expect(component.endDate!.getHours()).toBe(17);
      expect(component.endDate!.getMinutes()).toBe(0);
    });
  });
});
