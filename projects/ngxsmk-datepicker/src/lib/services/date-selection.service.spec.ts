import { TestBed } from '@angular/core/testing';
import { DateSelectionService, DateSelectionState, DateSelectionConfig, DateSelectionCallbacks } from './date-selection.service';

describe('DateSelectionService', () => {
  let service: DateSelectionService;
  let state: DateSelectionState;
  let config: DateSelectionConfig;
  let callbacks: DateSelectionCallbacks;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateSelectionService]
    });

    service = TestBed.inject(DateSelectionService);

    state = {
      selectedDate: null,
      startDate: null,
      endDate: null,
      selectedDates: [],
      hoveredDate: null
    };

    config = {
      mode: 'single',
      showTime: false,
      timeOnly: false,
      currentDisplayHour: 12,
      isPm: false,
      currentMinute: 0,
      minuteInterval: 1
    };

    callbacks = {
      isDateDisabled: () => false,
      isCurrentMonth: () => true,
      applyTimeIfNeeded: (date: Date) => date,
      onValueEmitted: jasmine.createSpy('onValueEmitted'),
      onStateChanged: jasmine.createSpy('onStateChanged')
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('selectDate - single mode', () => {
    it('should select a date in single mode', () => {
      const date = new Date('2024-01-15');
      service.selectDate(date, state, config, callbacks);

      expect(state.selectedDate).toEqual(date);
      expect(callbacks.onValueEmitted).toHaveBeenCalledWith(date);
    });

    it('should not select disabled date', () => {
      const date = new Date('2024-01-15');
      callbacks.isDateDisabled = () => true;

      service.selectDate(date, state, config, callbacks);

      expect(state.selectedDate).toBeNull();
      expect(callbacks.onValueEmitted).not.toHaveBeenCalled();
    });

    it('should not select date if beforeDateSelect returns false', () => {
      const date = new Date('2024-01-15');
      callbacks.beforeDateSelect = () => false;

      service.selectDate(date, state, config, callbacks);

      expect(state.selectedDate).toBeNull();
      expect(callbacks.onValueEmitted).not.toHaveBeenCalled();
    });

    it('should change month if date is not in current month', () => {
      const date = new Date('2024-02-15');
      callbacks.isCurrentMonth = () => false;
      callbacks.onMonthYearChanged = jasmine.createSpy('onMonthYearChanged');
      callbacks.onCalendarGenerated = jasmine.createSpy('onCalendarGenerated');

      service.selectDate(date, state, config, callbacks);

      expect(callbacks.onMonthYearChanged).toHaveBeenCalledWith(1, 2024);
      expect(callbacks.onCalendarGenerated).toHaveBeenCalled();
    });

    it('should apply time if needed', () => {
      const date = new Date('2024-01-15');
      const dateWithTime = new Date('2024-01-15T14:30:00');
      callbacks.applyTimeIfNeeded = () => dateWithTime;

      service.selectDate(date, state, config, callbacks);

      expect(state.selectedDate).toEqual(dateWithTime);
    });

    it('should auto-close if shouldAutoClose returns true', () => {
      const date = new Date('2024-01-15');
      callbacks.shouldAutoClose = () => true;
      callbacks.onCloseCalendar = jasmine.createSpy('onCloseCalendar');

      service.selectDate(date, state, config, callbacks);

      expect(callbacks.onCloseCalendar).toHaveBeenCalled();
    });

    it('should call afterDateSelect if provided', () => {
      const date = new Date('2024-01-15');
      callbacks.afterDateSelect = jasmine.createSpy('afterDateSelect');

      service.selectDate(date, state, config, callbacks);

      expect(callbacks.afterDateSelect).toHaveBeenCalled();
    });

    it('should emit action event', () => {
      const date = new Date('2024-01-15');
      callbacks.onActionEmitted = jasmine.createSpy('onActionEmitted');

      service.selectDate(date, state, config, callbacks);

      expect(callbacks.onActionEmitted).toHaveBeenCalledWith({
        type: 'dateSelected',
        payload: {
          mode: 'single',
          value: null,
          date: date
        }
      });
    });
  });

  describe('selectDate - range mode', () => {
    beforeEach(() => {
      config.mode = 'range';
    });

    it('should set start date when no start date exists', () => {
      const date = new Date('2024-01-15');
      service.selectDate(date, state, config, callbacks);

      expect(state.startDate).toEqual(date);
      expect(state.endDate).toBeNull();
    });

    it('should reset range when both dates are set', () => {
      state.startDate = new Date('2024-01-10');
      state.endDate = new Date('2024-01-20');
      const date = new Date('2024-01-25');

      service.selectDate(date, state, config, callbacks);

      expect(state.startDate).toEqual(date);
      expect(state.endDate).toBeNull();
    });

    it('should set end date when start date exists', () => {
      state.startDate = new Date('2024-01-10');
      const date = new Date('2024-01-20');

      service.selectDate(date, state, config, callbacks);

      expect(state.startDate).toEqual(new Date('2024-01-10'));
      expect(state.endDate).toEqual(date);
      expect(callbacks.onValueEmitted).toHaveBeenCalledWith({
        start: state.startDate,
        end: state.endDate
      });
    });

    it('should update start date if selected date is before start date', () => {
      state.startDate = new Date('2024-01-15');
      const date = new Date('2024-01-10');

      service.selectDate(date, state, config, callbacks);

      expect(state.startDate).toEqual(date);
      expect(state.endDate).toBeNull();
    });

    it('should not set end date if same day is selected', () => {
      state.startDate = new Date('2024-01-15');
      const date = new Date('2024-01-15');

      service.selectDate(date, state, config, callbacks);

      expect(state.endDate).toBeNull();
    });

    it('should validate range if validateRange is provided', () => {
      const startDate = new Date('2024-01-10');
      state.startDate = startDate;
      const date = new Date('2024-01-20');
      const dateWithTime = callbacks.applyTimeIfNeeded(date);
      callbacks.validateRange = jasmine.createSpy('validateRange').and.returnValue(false);

      service.selectDate(date, state, config, callbacks);

      // validateRange should be called with the original startDate and the new date
      expect(callbacks.validateRange).toHaveBeenCalledWith(startDate, dateWithTime);
      expect(state.endDate).toBeNull();
      expect(state.startDate).toEqual(dateWithTime);
    });

    it('should clear hovered date after selection', () => {
      state.startDate = new Date('2024-01-10');
      state.hoveredDate = new Date('2024-01-15');
      const date = new Date('2024-01-20');

      service.selectDate(date, state, config, callbacks);

      expect(state.hoveredDate).toBeNull();
    });
  });

  describe('selectDate - multiple mode', () => {
    beforeEach(() => {
      config.mode = 'multiple';
    });

    it('should add date to selected dates', () => {
      const date = new Date('2024-01-15');
      const dateWithTime = new Date('2024-01-15T00:00:00');
      callbacks.applyTimeIfNeeded = (d: Date) => {
        // In multiple mode, getStartOfDay is called first, so time is stripped
        return d;
      };
      service.selectDate(date, state, config, callbacks);

      expect(state.selectedDates.length).toBe(1);
      // The date will have time stripped by getStartOfDay, then applyTimeIfNeeded is called
      expect(state.selectedDates[0].getTime()).toBe(dateWithTime.getTime());
      expect(callbacks.onValueEmitted).toHaveBeenCalled();
    });

    it('should remove date if already selected', () => {
      const date = new Date('2024-01-15');
      state.selectedDates = [date];

      service.selectDate(date, state, config, callbacks);

      expect(state.selectedDates.length).toBe(0);
    });

    it('should sort selected dates', () => {
      const date1 = new Date('2024-01-20');
      const date2 = new Date('2024-01-10');
      const date3 = new Date('2024-01-15');

      // Dates will have time stripped by getStartOfDay
      const date1Start = new Date('2024-01-20T00:00:00');
      const date2Start = new Date('2024-01-10T00:00:00');
      const date3Start = new Date('2024-01-15T00:00:00');

      service.selectDate(date1, state, config, callbacks);
      service.selectDate(date2, state, config, callbacks);
      service.selectDate(date3, state, config, callbacks);

      expect(state.selectedDates[0].getTime()).toBe(date2Start.getTime());
      expect(state.selectedDates[1].getTime()).toBe(date3Start.getTime());
      expect(state.selectedDates[2].getTime()).toBe(date1Start.getTime());
    });

    it('should handle recurring pattern', () => {
      const date = new Date('2024-01-15');
      config.recurringPattern = {
        pattern: 'daily',
        startDate: date,
        interval: 1
      };

      service.selectDate(date, state, config, callbacks);

      expect(state.selectedDates.length).toBeGreaterThan(0);
      expect(callbacks.onValueEmitted).toHaveBeenCalled();
    });

    it('should handle recurring pattern with end date', () => {
      const date = new Date('2024-01-15');
      config.recurringPattern = {
        pattern: 'daily',
        startDate: date,
        endDate: new Date('2024-01-20'),
        interval: 1
      };

      service.selectDate(date, state, config, callbacks);

      expect(state.selectedDates.length).toBeGreaterThan(0);
    });

    it('should handle recurring pattern with dayOfWeek', () => {
      const date = new Date('2024-01-15');
      config.recurringPattern = {
        pattern: 'weekly',
        startDate: date,
        dayOfWeek: 1,
        interval: 1
      };

      service.selectDate(date, state, config, callbacks);

      expect(state.selectedDates.length).toBeGreaterThan(0);
    });

    it('should handle recurring pattern with dayOfMonth', () => {
      const date = new Date('2024-01-15');
      config.recurringPattern = {
        pattern: 'monthly',
        startDate: date,
        dayOfMonth: 15,
        interval: 1
      };

      service.selectDate(date, state, config, callbacks);

      expect(state.selectedDates.length).toBeGreaterThan(0);
    });
  });

  describe('selectRange', () => {
    beforeEach(() => {
      config.mode = 'range';
    });

    it('should set start and end dates', () => {
      const start = new Date('2024-01-10');
      const end = new Date('2024-01-20');

      service.selectRange([start, end], state, config, callbacks);

      expect(state.startDate).toEqual(start);
      expect(state.endDate).toEqual(end);
      expect(callbacks.onValueEmitted).toHaveBeenCalledWith({
        start: start,
        end: end
      });
    });

    it('should not do anything if mode is not range', () => {
      config.mode = 'single';
      const start = new Date('2024-01-10');
      const end = new Date('2024-01-20');

      service.selectRange([start, end], state, config, callbacks);

      expect(state.startDate).toBeNull();
      expect(state.endDate).toBeNull();
    });

    it('should clear hovered date', () => {
      state.hoveredDate = new Date('2024-01-15');
      const start = new Date('2024-01-10');
      const end = new Date('2024-01-20');

      service.selectRange([start, end], state, config, callbacks);

      expect(state.hoveredDate).toBeNull();
    });

    it('should auto-close if shouldAutoClose returns true', () => {
      callbacks.shouldAutoClose = () => true;
      callbacks.onCloseCalendar = jasmine.createSpy('onCloseCalendar');
      const start = new Date('2024-01-10');
      const end = new Date('2024-01-20');

      service.selectRange([start, end], state, config, callbacks);

      expect(callbacks.onCloseCalendar).toHaveBeenCalled();
    });
  });

  describe('clearSelection', () => {
    it('should clear all selection state', () => {
      state.selectedDate = new Date('2024-01-15');
      state.startDate = new Date('2024-01-10');
      state.endDate = new Date('2024-01-20');
      state.selectedDates = [new Date('2024-01-15')];
      state.hoveredDate = new Date('2024-01-18');

      service.clearSelection(state);

      expect(state.selectedDate).toBeNull();
      expect(state.startDate).toBeNull();
      expect(state.endDate).toBeNull();
      expect(state.selectedDates).toEqual([]);
      expect(state.hoveredDate).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle null date', () => {
      service.selectDate(null, state, config, callbacks);

      expect(state.selectedDate).toBeNull();
      expect(callbacks.onValueEmitted).not.toHaveBeenCalled();
    });

    it('should handle empty selectedDates array in multiple mode', () => {
      config.mode = 'multiple';
      const date = new Date('2024-01-15');

      service.selectDate(date, state, config, callbacks);

      expect(state.selectedDates.length).toBe(1);
    });

    it('should sync date correctly for single mode', () => {
      const date = new Date('2024-01-15');
      callbacks.afterDateSelect = jasmine.createSpy('afterDateSelect');

      service.selectDate(date, state, config, callbacks);

      expect(callbacks.afterDateSelect).toHaveBeenCalledWith(date, null);
    });

    it('should sync date correctly for range mode', () => {
      config.mode = 'range';
      state.startDate = new Date('2024-01-10');
      const date = new Date('2024-01-20');
      callbacks.afterDateSelect = jasmine.createSpy('afterDateSelect');

      service.selectDate(date, state, config, callbacks);

      expect(callbacks.afterDateSelect).toHaveBeenCalledWith(date, null);
    });

    it('should sync last date for multiple mode', () => {
      config.mode = 'multiple';
      const date1 = new Date('2024-01-10');
      const date2 = new Date('2024-01-20');
      callbacks.afterDateSelect = jasmine.createSpy('afterDateSelect');

      service.selectDate(date1, state, config, callbacks);
      service.selectDate(date2, state, config, callbacks);

      expect(callbacks.afterDateSelect).toHaveBeenCalledWith(date2, null);
    });
  });
});

