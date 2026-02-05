import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { getStartOfDay } from '../utils/date.utils';
import { DatePipe } from '@angular/common';

describe('NgxsmkDatepickerComponent - Keyboard Navigation', () => {
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

  describe('Arrow Key Navigation', () => {
    it('should navigate to previous day with ArrowLeft', () => {
      const today = new Date();
      component.selectedDate = getStartOfDay(today);
      component.generateCalendar();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      component.onKeyDown(event);

      expect(component.focusedDate).toBeTruthy();
      if (component.focusedDate) {
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - 1);
        expect(component.focusedDate.getDate()).toBe(expectedDate.getDate());
      }
    });

    it('should navigate to next day with ArrowRight', () => {
      const today = new Date();
      component.selectedDate = getStartOfDay(today);
      component.generateCalendar();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      component.onKeyDown(event);

      expect(component.focusedDate).toBeTruthy();
      if (component.focusedDate) {
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() + 1);
        expect(component.focusedDate.getDate()).toBe(expectedDate.getDate());
      }
    });

    it('should navigate to previous week with ArrowUp', () => {
      const today = new Date();
      component.selectedDate = getStartOfDay(today);
      component.generateCalendar();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      component.onKeyDown(event);

      expect(component.focusedDate).toBeTruthy();
      if (component.focusedDate) {
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - 7);
        expect(component.focusedDate.getDate()).toBe(expectedDate.getDate());
      }
    });

    it('should navigate to next week with ArrowDown', () => {
      const today = new Date();
      component.selectedDate = getStartOfDay(today);
      component.generateCalendar();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      component.onKeyDown(event);

      expect(component.focusedDate).toBeTruthy();
      if (component.focusedDate) {
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() + 7);
        expect(component.focusedDate.getDate()).toBe(expectedDate.getDate());
      }
    });
  });

  describe('Page Up/Down Navigation', () => {
    it('should navigate to previous month with PageUp', () => {
      const today = new Date();
      component.currentMonth = today.getMonth();
      component.currentYear = today.getFullYear();
      component.selectedDate = getStartOfDay(today);
      component.generateCalendar();
      fixture.detectChanges();

      const initialMonth = component.currentMonth;
      const event = new KeyboardEvent('keydown', { key: 'PageUp' });
      component.onKeyDown(event);

      const expectedMonth = initialMonth === 0 ? 11 : initialMonth - 1;
      expect(component.currentMonth).toBe(expectedMonth);
    });

    it('should navigate to next month with PageDown', () => {
      const today = new Date();
      component.currentMonth = today.getMonth();
      component.currentYear = today.getFullYear();
      component.selectedDate = getStartOfDay(today);
      component.generateCalendar();
      fixture.detectChanges();

      const initialMonth = component.currentMonth;
      const event = new KeyboardEvent('keydown', { key: 'PageDown' });
      component.onKeyDown(event);

      const expectedMonth = initialMonth === 11 ? 0 : initialMonth + 1;
      expect(component.currentMonth).toBe(expectedMonth);
    });

    it('should navigate to previous year with Shift+PageUp', () => {
      const today = new Date();
      component.currentYear = today.getFullYear();
      component.generateCalendar();
      fixture.detectChanges();

      const initialYear = component.currentYear;
      const event = new KeyboardEvent('keydown', {
        key: 'PageUp',
        shiftKey: true,
      });
      component.onKeyDown(event);

      expect(component.currentYear).toBe(initialYear - 1);
    });

    it('should navigate to next year with Shift+PageDown', () => {
      const today = new Date();
      component.currentYear = today.getFullYear();
      component.generateCalendar();
      fixture.detectChanges();

      const initialYear = component.currentYear;
      const event = new KeyboardEvent('keydown', {
        key: 'PageDown',
        shiftKey: true,
      });
      component.onKeyDown(event);

      expect(component.currentYear).toBe(initialYear + 1);
    });
  });

  describe('Home/End Navigation', () => {
    it('should navigate to first day of month with Home', () => {
      const today = new Date();
      component.currentMonth = today.getMonth();
      component.currentYear = today.getFullYear();
      component.selectedDate = getStartOfDay(today);
      component.generateCalendar();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Home' });
      component.onKeyDown(event);

      expect(component.focusedDate).toBeTruthy();
      if (component.focusedDate) {
        expect(component.focusedDate.getDate()).toBe(1);
      }
    });

    it('should navigate to last day of month with End', () => {
      const today = new Date();
      component.currentMonth = today.getMonth();
      component.currentYear = today.getFullYear();
      component.selectedDate = getStartOfDay(today);
      component.generateCalendar();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'End' });
      component.onKeyDown(event);

      expect(component.focusedDate).toBeTruthy();
      if (component.focusedDate) {
        const lastDay = new Date(
          component.currentYear,
          component.currentMonth + 1,
          0,
        ).getDate();
        expect(component.focusedDate.getDate()).toBe(lastDay);
      }
    });
  });

  describe('Shortcut Keys', () => {
    it('should select today with T key', () => {
      spyOn(component.valueChange, 'emit');
      component.mode = 'single';
      component.generateCalendar();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'T' });
      component.onKeyDown(event);

      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        const today = getStartOfDay(new Date());
        expect(component.isSameDay(component.selectedDate, today)).toBe(true);
      }
      expect(component.valueChange.emit).toHaveBeenCalled();
    });

    it('should select yesterday with Y key', () => {
      spyOn(component.valueChange, 'emit');
      component.mode = 'single';
      component.generateCalendar();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Y' });
      component.onKeyDown(event);

      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        expect(
          component.isSameDay(component.selectedDate, getStartOfDay(yesterday)),
        ).toBe(true);
      }
      expect(component.valueChange.emit).toHaveBeenCalled();
    });

    it('should select tomorrow with N key', () => {
      spyOn(component.valueChange, 'emit');
      component.mode = 'single';
      component.generateCalendar();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'N' });
      component.onKeyDown(event);

      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        expect(
          component.isSameDay(component.selectedDate, getStartOfDay(tomorrow)),
        ).toBe(true);
      }
      expect(component.valueChange.emit).toHaveBeenCalled();
    });

    it('should select next week with W key', () => {
      spyOn(component.valueChange, 'emit');
      component.mode = 'single';
      component.generateCalendar();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'W' });
      component.onKeyDown(event);

      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        expect(
          component.isSameDay(component.selectedDate, getStartOfDay(nextWeek)),
        ).toBe(true);
      }
      expect(component.valueChange.emit).toHaveBeenCalled();
    });
  });

  describe('Enter/Space Selection', () => {
    it('should select focused date with Enter', () => {
      spyOn(component.valueChange, 'emit');
      component.mode = 'single';
      const today = new Date();
      component.focusedDate = getStartOfDay(today);
      component.generateCalendar();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.onKeyDown(event);

      expect(component.selectedDate).toBeTruthy();
      expect(component.valueChange.emit).toHaveBeenCalled();
    });

    it('should select focused date with Space', () => {
      spyOn(component.valueChange, 'emit');
      component.mode = 'single';
      const today = new Date();
      component.focusedDate = getStartOfDay(today);
      component.generateCalendar();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: ' ' });
      component.onKeyDown(event);

      expect(component.selectedDate).toBeTruthy();
      expect(component.valueChange.emit).toHaveBeenCalled();
    });
  });

  describe('Escape Key', () => {
    it('should close calendar with Escape key in popover mode', () => {
      component.inline = false;
      component.isCalendarOpen = true;
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onKeyDown(event);

      expect(component.isCalendarOpen).toBe(false);
    });

    it('should not close calendar with Escape key in inline mode', () => {
      component.inline = true;
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onKeyDown(event);

      // Inline mode should remain visible
      expect(component.isCalendarVisible).toBe(true);
    });
  });

  describe('Disabled Keyboard Shortcuts', () => {
    it('should not handle keyboard shortcuts when enableKeyboardShortcuts is false', () => {
      component.enableKeyboardShortcuts = false;
      component.mode = 'single';
      const initialSelectedDate = component.selectedDate;
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'T' });
      component.onKeyDown(event);

      expect(component.selectedDate).toBe(initialSelectedDate);
    });
  });

  describe('RTL Keyboard Navigation', () => {
    it('should reverse ArrowLeft/ArrowRight in RTL mode', () => {
      component.rtl = true;
      const today = new Date();
      component.selectedDate = getStartOfDay(today);
      component.generateCalendar();
      fixture.detectChanges();

      // In RTL, ArrowLeft should go forward (next day)
      const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      component.onKeyDown(leftEvent);

      expect(component.focusedDate).toBeTruthy();
      if (component.focusedDate) {
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() + 1); // Reversed in RTL
        expect(component.focusedDate.getDate()).toBe(expectedDate.getDate());
      }
    });
  });
});
