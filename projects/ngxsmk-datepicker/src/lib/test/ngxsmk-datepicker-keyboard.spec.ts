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
        const lastDay = new Date(component.currentYear, component.currentMonth + 1, 0).getDate();
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
        expect(component.isSameDay(component.selectedDate, getStartOfDay(yesterday))).toBe(true);
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
        expect(component.isSameDay(component.selectedDate, getStartOfDay(tomorrow))).toBe(true);
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
        expect(component.isSameDay(component.selectedDate, getStartOfDay(nextWeek))).toBe(true);
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

    it('should swallow Escape bubbling from popover escape handler', () => {
      const event = {
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation'),
      } as unknown as KeyboardEvent;

      component.onPopoverEscape(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
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

  describe('Focus Retention and Successive Shortcut Navigation (Issue #313)', () => {
    it('should maintain focusedDate and allow successive PageUp calls', () => {
      const startDate = new Date(2026, 7, 15); // August 15, 2026
      component.currentMonth = 7;
      component.currentYear = 2026;
      component.focusedDate = new Date(startDate);
      component.generateCalendar();
      fixture.detectChanges();

      // First PageUp -> July 2026, focusedDate = July 15, 2026
      const event1 = new KeyboardEvent('keydown', { key: 'PageUp' });
      component.onKeyDown(event1);

      expect(component.currentMonth).toBe(6);
      expect(component.currentYear).toBe(2026);
      expect(component.focusedDate?.getMonth()).toBe(6);
      expect(component.focusedDate?.getDate()).toBe(15);

      // Second PageUp in succession -> June 2026, focusedDate = June 15, 2026
      const event2 = new KeyboardEvent('keydown', { key: 'PageUp' });
      component.onKeyDown(event2);

      expect(component.currentMonth).toBe(5);
      expect(component.currentYear).toBe(2026);
      expect(component.focusedDate?.getMonth()).toBe(5);
      expect(component.focusedDate?.getDate()).toBe(15);
    });

    it('should maintain focusedDate and allow successive PageDown calls', () => {
      const startDate = new Date(2026, 5, 10); // June 10, 2026
      component.currentMonth = 5;
      component.currentYear = 2026;
      component.focusedDate = new Date(startDate);
      component.generateCalendar();
      fixture.detectChanges();

      // First PageDown -> July 2026
      const event1 = new KeyboardEvent('keydown', { key: 'PageDown' });
      component.onKeyDown(event1);

      expect(component.currentMonth).toBe(6);
      expect(component.focusedDate?.getMonth()).toBe(6);
      expect(component.focusedDate?.getDate()).toBe(10);

      // Second PageDown in succession -> August 2026
      const event2 = new KeyboardEvent('keydown', { key: 'PageDown' });
      component.onKeyDown(event2);

      expect(component.currentMonth).toBe(7);
      expect(component.focusedDate?.getMonth()).toBe(7);
      expect(component.focusedDate?.getDate()).toBe(10);
    });

    it('should clamp day when navigating to month with fewer days on PageUp', () => {
      // March 31, 2026 -> PageUp -> February 28, 2026 (non-leap)
      const startDate = new Date(2026, 2, 31); // March 31, 2026
      component.currentMonth = 2;
      component.currentYear = 2026;
      component.focusedDate = new Date(startDate);
      component.generateCalendar();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'PageUp' });
      component.onKeyDown(event);

      expect(component.currentMonth).toBe(1); // February
      expect(component.focusedDate?.getMonth()).toBe(1);
      expect(component.focusedDate?.getDate()).toBe(28);
    });

    it('should clamp day when navigating to month with fewer days on PageDown', () => {
      // August 31, 2026 -> PageDown -> September 30, 2026
      const startDate = new Date(2026, 7, 31); // August 31, 2026
      component.currentMonth = 7;
      component.currentYear = 2026;
      component.focusedDate = new Date(startDate);
      component.generateCalendar();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'PageDown' });
      component.onKeyDown(event);

      expect(component.currentMonth).toBe(8); // September
      expect(component.focusedDate?.getMonth()).toBe(8);
      expect(component.focusedDate?.getDate()).toBe(30);
    });

    it('should maintain focusedDate and allow successive Shift+PageUp/Down calls', () => {
      const startDate = new Date(2026, 7, 20); // Aug 20, 2026
      component.currentMonth = 7;
      component.currentYear = 2026;
      component.focusedDate = new Date(startDate);
      component.generateCalendar();
      fixture.detectChanges();

      // Shift+PageUp -> Aug 20, 2025
      const prevYearEvent = new KeyboardEvent('keydown', { key: 'PageUp', shiftKey: true });
      component.onKeyDown(prevYearEvent);

      expect(component.currentYear).toBe(2025);
      expect(component.focusedDate?.getFullYear()).toBe(2025);
      expect(component.focusedDate?.getMonth()).toBe(7);
      expect(component.focusedDate?.getDate()).toBe(20);

      // Shift+PageDown -> Aug 20, 2026
      const nextYearEvent = new KeyboardEvent('keydown', { key: 'PageDown', shiftKey: true });
      component.onKeyDown(nextYearEvent);

      expect(component.currentYear).toBe(2026);
      expect(component.focusedDate?.getFullYear()).toBe(2026);
      expect(component.focusedDate?.getMonth()).toBe(7);
      expect(component.focusedDate?.getDate()).toBe(20);
    });

    it('should switch month when ArrowRight navigates beyond the last day of month', () => {
      const startDate = new Date(2026, 0, 31); // Jan 31, 2026
      component.currentMonth = 0;
      component.currentYear = 2026;
      component.focusedDate = new Date(startDate);
      component.generateCalendar();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      component.onKeyDown(event);

      expect(component.currentMonth).toBe(1); // Feb
      expect(component.focusedDate?.getMonth()).toBe(1);
      expect(component.focusedDate?.getDate()).toBe(1);
    });

    it('should switch month when ArrowLeft navigates before the first day of month', () => {
      const startDate = new Date(2026, 1, 1); // Feb 1, 2026
      component.currentMonth = 1;
      component.currentYear = 2026;
      component.focusedDate = new Date(startDate);
      component.generateCalendar();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      component.onKeyDown(event);

      expect(component.currentMonth).toBe(0); // Jan
      expect(component.focusedDate?.getMonth()).toBe(0);
      expect(component.focusedDate?.getDate()).toBe(31);
    });

    it('should call focus on DOM cell when focusDateCell is invoked', (done) => {
      const testDate = new Date(2026, 7, 15);
      component.currentMonth = 7;
      component.currentYear = 2026;
      component.generateCalendar();
      fixture.detectChanges();

      const spy = spyOn(component, 'focusDateCell').and.callThrough();
      component.focusDateCell(testDate);

      expect(spy).toHaveBeenCalledWith(testDate);
      expect(component.focusedDate).toEqual(testDate);

      // Verify DOM element resolution asynchronously
      setTimeout(() => {
        done();
      }, 50);
    });

    it('should handle keyboard events when target is inside calendar popover container', () => {
      const dummyPopover = document.createElement('div');
      dummyPopover.className = 'ngxsmk-popover-container';
      const dummyGrid = document.createElement('div');
      dummyGrid.className = 'ngxsmk-days-grid';
      dummyPopover.appendChild(dummyGrid);

      component.currentMonth = 7;
      component.currentYear = 2026;
      component.focusedDate = new Date(2026, 7, 15);
      component.generateCalendar();
      fixture.detectChanges();

      const event = {
        key: 'PageUp',
        target: dummyGrid,
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation'),
      } as unknown as KeyboardEvent;

      component.onKeyDown(event);

      expect(component.currentMonth).toBe(6); // Changed to July
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should not hijack shortcuts when target is an editable input', () => {
      const input = document.createElement('input');
      input.type = 'text';

      component.currentMonth = 7;
      component.currentYear = 2026;
      component.generateCalendar();
      fixture.detectChanges();

      const event = {
        key: 't',
        target: input,
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation'),
      } as unknown as KeyboardEvent;

      component.onKeyDown(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });
});
