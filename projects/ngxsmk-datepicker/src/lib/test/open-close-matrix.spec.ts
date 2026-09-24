import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';

/**
 * Regression matrix: popover open → select → stay open / close.
 * Covers autoApplyClose × showTime × selection modes (issue #325 + close-pipeline work).
 */
describe('NgxsmkDatepickerComponent — open/close regression matrix', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
      providers: [DatePipe, { provide: PLATFORM_ID, useValue: 'browser' }],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function openPopover(): void {
    component.toggleCalendar();
    tick(100);
    fixture.detectChanges();
    expect(component.isCalendarOpen).toBe(true);
  }

  function clickDay(day: Date): void {
    component.onDateClick(day);
    tick(100);
    fixture.detectChanges();
  }

  describe('single mode', () => {
    it('stays open by default (autoApplyClose false)', fakeAsync(() => {
      openPopover();
      clickDay(new Date(2024, 5, 15));
      expect(component.isCalendarOpen).toBe(true);
      expect(component.selectedDate).toBeTruthy();
    }));

    it('closes when autoApplyClose is true', fakeAsync(() => {
      fixture.componentRef.setInput('autoApplyClose', true);
      fixture.detectChanges();
      openPopover();
      clickDay(new Date(2024, 5, 15));
      expect(component.isCalendarOpen).toBe(false);
    }));

    it('stays open with showTime even when autoApplyClose is true', fakeAsync(() => {
      fixture.componentRef.setInput('autoApplyClose', true);
      component.showTime = true;
      fixture.detectChanges();
      openPopover();
      clickDay(new Date(2024, 5, 15));
      expect(component.isCalendarOpen).toBe(true);

      component.currentDisplayHour = 10;
      component.currentMinute = 45;
      component.use24Hour = true;
      component.timeChange();
      tick(100);
      fixture.detectChanges();
      expect(component.isCalendarOpen).toBe(true);
    }));

    it('stays open when inline regardless of autoApplyClose', fakeAsync(() => {
      fixture.componentRef.setInput('autoApplyClose', true);
      component.inline = true;
      fixture.detectChanges();
      expect(component.isCalendarOpen).toBe(false);
      clickDay(new Date(2024, 5, 15));
      expect(component.isCalendarOpen).toBe(false);
      expect(component.selectedDate).toBeTruthy();
    }));
  });

  describe('range mode', () => {
    beforeEach(() => {
      component.mode = 'range';
      fixture.detectChanges();
    });

    it('stays open after start-only select when autoApplyClose is true', fakeAsync(() => {
      fixture.componentRef.setInput('autoApplyClose', true);
      fixture.detectChanges();
      openPopover();
      clickDay(new Date(2024, 5, 10));
      expect(component.isCalendarOpen).toBe(true);
      expect(component.startDate).toBeTruthy();
      expect(component.endDate).toBeNull();
    }));

    it('closes after complete range when autoApplyClose is true', fakeAsync(() => {
      fixture.componentRef.setInput('autoApplyClose', true);
      fixture.detectChanges();
      openPopover();
      clickDay(new Date(2024, 5, 10));
      clickDay(new Date(2024, 5, 20));
      expect(component.isCalendarOpen).toBe(false);
      expect(component.startDate).toBeTruthy();
      expect(component.endDate).toBeTruthy();
    }));

    it('stays open after complete range when autoApplyClose is false', fakeAsync(() => {
      openPopover();
      clickDay(new Date(2024, 5, 10));
      clickDay(new Date(2024, 5, 20));
      expect(component.isCalendarOpen).toBe(true);
    }));

    it('stays open for complete range when showTime is true', fakeAsync(() => {
      fixture.componentRef.setInput('autoApplyClose', true);
      component.showTime = true;
      fixture.detectChanges();
      openPopover();
      clickDay(new Date(2024, 5, 10));
      clickDay(new Date(2024, 5, 20));
      expect(component.isCalendarOpen).toBe(true);
    }));
  });

  describe('period modes', () => {
    it('closes after month select when autoApplyClose is true', fakeAsync(() => {
      fixture.componentRef.setInput('autoApplyClose', true);
      component.mode = 'month';
      fixture.detectChanges();
      openPopover();
      clickDay(new Date(2024, 5, 15));
      expect(component.isCalendarOpen).toBe(false);
      expect(component.startDate).toBeTruthy();
      expect(component.endDate).toBeTruthy();
    }));

    it('stays open after week select when autoApplyClose is false', fakeAsync(() => {
      component.mode = 'week';
      fixture.detectChanges();
      openPopover();
      clickDay(new Date(2024, 5, 12));
      expect(component.isCalendarOpen).toBe(true);
      expect(component.startDate).toBeTruthy();
      expect(component.endDate).toBeTruthy();
    }));
  });

  describe('dismiss paths share finalize', () => {
    it('Escape close finalizes allowSameDay range', fakeAsync(() => {
      component.mode = 'range';
      fixture.componentRef.setInput('allowSameDay', true);
      fixture.detectChanges();
      openPopover();
      clickDay(new Date(2024, 6, 4));
      expect(component.endDate).toBeNull();

      component.closeCalendarWithFocusRestore();
      tick(100);
      fixture.detectChanges();

      expect(component.isCalendarOpen).toBe(false);
      expect(component.endDate).not.toBeNull();
      expect(component.startDate!.getTime()).toBe(component.endDate!.getTime());
    }));
  });
});
