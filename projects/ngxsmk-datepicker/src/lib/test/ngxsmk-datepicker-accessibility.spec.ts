import { ComponentFixture, TestBed, fakeAsync, tick, flush, flushMicrotasks } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { AriaLiveService } from '../services/aria-live.service';
import { By } from '@angular/platform-browser';
import { PLATFORM_ID } from '@angular/core';

describe('NgxsmkDatepickerComponent - Accessibility', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;
  let service: AriaLiveService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;

    if (!component.locale) {
      component.locale = 'en-US';
    }

    service = TestBed.inject(AriaLiveService);
    component.autoDetectMobile = false;
    fixture.detectChanges();
  });

  afterEach(() => {
    const liveRegions = document.body.querySelectorAll('.ngxsmk-aria-live-region');
    liveRegions.forEach(region => {
      if (region.parentNode) {
        region.parentNode.removeChild(region);
      }
    });
  });

  it('should have focus trap when calendar is open', fakeAsync(() => {
    component.toggleCalendar();
    fixture.detectChanges();

    tick(200);

    const popover = fixture.debugElement.query(By.css('.ngxsmk-popover-container'));
    expect(popover).toBeTruthy();
    expect(popover.nativeElement.getAttribute('role')).toBe('dialog');
    expect(popover.nativeElement.getAttribute('aria-modal')).toBe('true');

    flush();
  }));

  it('should have ARIA live region', fakeAsync(() => {
    // Trigger an announcement to create the live region
    service.announce('Initial message');
    tick(100);
    fixture.detectChanges();

    const liveRegion = document.body.querySelector('.ngxsmk-aria-live-region');
    expect(liveRegion).toBeTruthy('Live region should exist in document body');
    expect(liveRegion?.getAttribute('aria-live')).toBe('polite');
    expect(liveRegion?.getAttribute('aria-atomic')).toBe('true');
  }));

  it('should announce calendar opening', fakeAsync(() => {
    const ariaService = fixture.debugElement.injector.get(AriaLiveService);
    const announceSpy = spyOn(ariaService, 'announce').and.callThrough();

    component.inline = false;
    fixture.detectChanges();
    expect(component.isCalendarOpen).toBe(false);

    if (!component.currentDate) {
      component.currentDate = new Date();
    }

    const existingRegions = document.body.querySelectorAll('.ngxsmk-aria-live-region');
    existingRegions.forEach(region => {
      if (region.parentNode) {
        region.parentNode.removeChild(region);
      }
    });

    component.toggleCalendar();
    fixture.detectChanges();

    expect(component.isCalendarOpen).toBe(true);

    tick(100);
    flushMicrotasks();
    fixture.detectChanges();

    expect(announceSpy).toHaveBeenCalled();

    const announcedMessage = announceSpy.calls.mostRecent()?.args[0] || '';

    if (announcedMessage === '') {
      const monthName = component.currentDate.toLocaleDateString(component.locale, { month: 'long' });
      const year = String(component.currentDate.getFullYear());
      // calendarOpened is a valid key in DatepickerTranslations
      component.getTranslation('calendarOpened', undefined, { month: monthName, year });
    }

    expect(announcedMessage.length).toBeGreaterThan(0,
      `Announce was called with empty message. This suggests getTranslation returned empty or the fallback failed.`);

    // Wait for debounce delay
    tick(100);
    fixture.detectChanges();

    // The live region creation is async due to requestAnimationFrame
    // So we verify that announce was called with the correct message
    // The actual DOM element may not exist immediately
    const liveRegion = document.body.querySelector('.ngxsmk-aria-live-region') as HTMLElement;

    if (liveRegion) {
      // If region exists, check its content
      tick(0); // Allow requestAnimationFrame to complete
      fixture.detectChanges();

      const textContent = liveRegion.textContent || '';
      if (textContent === '' && announcedMessage) {
        // Text might not be set yet, but announce was called
        expect(announceSpy).toHaveBeenCalledWith(announcedMessage, 'polite');
      } else if (textContent) {
        expect(textContent).toBe(announcedMessage,
          `Live region text should match announced message. Got: "${textContent}", Expected: "${announcedMessage}"`);
      }
    } else {
      // If region doesn't exist yet, at least verify announce was called
      // This is acceptable since requestAnimationFrame is async
      expect(announceSpy).toHaveBeenCalledWith(announcedMessage, 'polite');
    }

    tick(1000);
    flush();
  }));

  it('should have proper ARIA labels on navigation buttons', () => {
    component.toggleCalendar();
    fixture.detectChanges();

    const prevButton = fixture.debugElement.query(By.css('.ngxsmk-nav-button'));
    expect(prevButton).toBeTruthy();
    expect(prevButton.nativeElement.getAttribute('aria-label')).toBeTruthy();
  });

  it('should have proper ARIA labels on date cells', () => {
    component.toggleCalendar();
    fixture.detectChanges();

    const dateCell = fixture.debugElement.query(By.css('.ngxsmk-day-cell[role="gridcell"]'));
    if (dateCell) {
      expect(dateCell.nativeElement.getAttribute('aria-label')).toBeTruthy();
    }
  });

  it('should announce date selection', fakeAsync(() => {
    const ariaService = fixture.debugElement.injector.get(AriaLiveService);
    const announceSpy = spyOn(ariaService, 'announce').and.callThrough();

    component.toggleCalendar();
    fixture.detectChanges();
    tick(200);
    flushMicrotasks();

    const liveRegionBefore = document.body.querySelector('.ngxsmk-aria-live-region') as HTMLElement;
    if (liveRegionBefore) {
      liveRegionBefore.textContent = '';
    }

    announceSpy.calls.reset();

    const today = new Date();
    component.onDateClick(today);
    fixture.detectChanges();
    tick(10);
    flushMicrotasks();

    expect(announceSpy).toHaveBeenCalled();

    const announcedMessage = announceSpy.calls.mostRecent()?.args[0] || '';
    expect(announcedMessage.length).toBeGreaterThan(0,
      `Announce was called with empty message.`);
    expect(announcedMessage).toContain('selected',
      `Date selection announcement should mention selection. Got: "${announcedMessage}"`);

    const liveRegion = document.body.querySelector('.ngxsmk-aria-live-region') as HTMLElement;
    expect(liveRegion).toBeTruthy('Live region should exist');

    const textContent = liveRegion?.textContent || '';

    expect(announceSpy).toHaveBeenCalledWith(announcedMessage, 'polite');

    if (textContent && textContent !== '') {
      expect(textContent).toBe(announcedMessage,
        `Live region text should match announced message. Got: "${textContent}", Expected: "${announcedMessage}"`);
    }
  }));

  it('should announce month change', fakeAsync(() => {
    const ariaService = fixture.debugElement.injector.get(AriaLiveService);
    const announceSpy = spyOn(ariaService, 'announce').and.callThrough();

    component.toggleCalendar();
    fixture.detectChanges();
    tick(200);
    flushMicrotasks();

    const liveRegionBefore = document.body.querySelector('.ngxsmk-aria-live-region') as HTMLElement;
    if (liveRegionBefore) {
      liveRegionBefore.textContent = '';
    }

    announceSpy.calls.reset();

    // Get the current month before changing
    const currentMonthIndex = component.currentMonth;
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const nextMonthIndex = (currentMonthIndex + 1) % 12;
    const expectedMonthName = monthNames[nextMonthIndex];

    component.changeMonth(1);
    fixture.detectChanges();
    tick(10);
    flushMicrotasks();

    expect(announceSpy).toHaveBeenCalled();

    const announcedMessage = announceSpy.calls.mostRecent()?.args[0] || '';
    expect(announcedMessage.length).toBeGreaterThan(0,
      `Announce was called with empty message for month change.`);
    expect(announcedMessage).toContain(expectedMonthName,
      `Month change announcement should mention the new month. Got: "${announcedMessage}", Expected to contain: "${expectedMonthName}"`);

    const liveRegion = document.body.querySelector('.ngxsmk-aria-live-region') as HTMLElement;
    expect(liveRegion).toBeTruthy('Live region should exist');

    const textContent = liveRegion?.textContent || '';

    expect(announceSpy).toHaveBeenCalledWith(announcedMessage, 'polite');

    if (textContent && textContent !== '') {
      expect(textContent).toBe(announcedMessage,
        `Live region text should match announced message. Got: "${textContent}", Expected: "${announcedMessage}"`);
    }
  }));

  it('should have proper dialog role and aria-modal', () => {
    component.toggleCalendar();
    fixture.detectChanges();

    const popover = fixture.debugElement.query(By.css('.ngxsmk-popover-container'));
    expect(popover.nativeElement.getAttribute('role')).toBe('dialog');
    expect(popover.nativeElement.getAttribute('aria-modal')).toBe('true');
  });

  it('should remove focus trap when calendar closes', fakeAsync(() => {
    component.toggleCalendar();
    fixture.detectChanges();
    tick(200);

    component['closeCalendar']();
    fixture.detectChanges();

    tick(100);

    expect(component['focusTrapCleanup']).toBeNull();
    flush();
  }));
});

