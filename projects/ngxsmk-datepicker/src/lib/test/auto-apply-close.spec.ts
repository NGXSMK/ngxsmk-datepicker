import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';

/**
 * Regression coverage for issue #325:
 * emitValue must respect shouldAutoClose (autoApplyClose / showTime / timeOnly / inline).
 */
describe('NgxsmkDatepickerComponent — autoApplyClose (issue #325)', () => {
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

  it('defaults autoApplyClose to false (documented API default)', () => {
    expect(component.autoApplyClose()).toBe(false);
  });

  it('closes after date select when autoApplyClose is true (date-only)', fakeAsync(() => {
    fixture.componentRef.setInput('autoApplyClose', true);
    fixture.detectChanges();

    component.toggleCalendar();
    tick(100);
    fixture.detectChanges();
    expect(component.isCalendarOpen).toBe(true);

    component.onDateClick(new Date(2024, 5, 15));
    tick(100);
    fixture.detectChanges();

    expect(component.isCalendarOpen).toBe(false);
  }));

  it('stays open after date select when autoApplyClose is false (date-only)', fakeAsync(() => {
    expect(component.autoApplyClose()).toBe(false);

    component.toggleCalendar();
    tick(100);
    fixture.detectChanges();
    expect(component.isCalendarOpen).toBe(true);

    component.onDateClick(new Date(2024, 5, 15));
    tick(100);
    fixture.detectChanges();

    expect(component.isCalendarOpen).toBe(true);
    expect(component.selectedDate).toBeTruthy();

    component.closeCalendarWithFocusRestore();
    tick(100);
    fixture.detectChanges();
    expect(component.isCalendarOpen).toBe(false);
  }));

  it('stays open after date select and time change when showTime is true', fakeAsync(() => {
    fixture.componentRef.setInput('autoApplyClose', true);
    component.showTime = true;
    component.use24Hour = true;
    fixture.detectChanges();

    component.toggleCalendar();
    tick(100);
    fixture.detectChanges();
    expect(component.isCalendarOpen).toBe(true);

    const day = new Date(2024, 5, 15);
    component.onDateClick(day);
    tick(100);
    fixture.detectChanges();
    expect(component.isCalendarOpen).toBe(true);
    expect(component.selectedDate).toBeTruthy();

    component.currentDisplayHour = 14;
    component.currentMinute = 30;
    component.timeChange();
    tick(100);
    fixture.detectChanges();

    expect(component.isCalendarOpen).toBe(true);
    expect(component.selectedDate!.getHours()).toBe(14);
    expect(component.selectedDate!.getMinutes()).toBe(30);

    component.closeCalendarWithFocusRestore();
    tick(100);
    fixture.detectChanges();
    expect(component.isCalendarOpen).toBe(false);
  }));

  it('closes after month period select when autoApplyClose is true', fakeAsync(() => {
    fixture.componentRef.setInput('autoApplyClose', true);
    component.mode = 'month';
    fixture.detectChanges();

    component.toggleCalendar();
    tick(100);
    fixture.detectChanges();
    expect(component.isCalendarOpen).toBe(true);

    component.onDateClick(new Date(2024, 5, 15));
    tick(100);
    fixture.detectChanges();

    expect(component.isCalendarOpen).toBe(false);
    expect(component.startDate).toBeTruthy();
    expect(component.endDate).toBeTruthy();
  }));
});
