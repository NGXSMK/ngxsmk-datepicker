import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { DatePipe } from '@angular/common';

describe('NgxsmkDatepickerComponent - asyncDateFilter', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  const flushMicrotasks = () => new Promise((resolve) => setTimeout(resolve, 0));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
      providers: [DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('disables dates returned by the filter for the visible range', async () => {
    const today = new Date();
    const blocked = new Date(today.getFullYear(), today.getMonth(), 15);
    const open = new Date(today.getFullYear(), today.getMonth(), 16);

    fixture.componentRef.setInput('asyncDateFilter', () => Promise.resolve([blocked]));
    fixture.detectChanges();
    await flushMicrotasks();

    expect(component.isDateDisabled(blocked)).toBeTrue();
    expect(component.isDateDisabled(open)).toBeFalse();
  });

  it('passes the visible month range to the filter', async () => {
    const today = new Date();
    const calls: [Date, Date][] = [];

    fixture.componentRef.setInput('asyncDateFilter', (start: Date, end: Date) => {
      calls.push([start, end]);
      return Promise.resolve([]);
    });
    fixture.detectChanges();
    await flushMicrotasks();

    expect(calls.length).toBeGreaterThan(0);
    const [start, end] = calls[calls.length - 1];
    expect(start.getFullYear()).toBe(today.getFullYear());
    expect(start.getMonth()).toBe(today.getMonth());
    expect(start.getDate()).toBe(1);
    expect(end.getTime()).toBeGreaterThan(start.getTime());
  });

  it('accepts string dates and normalizes them to day precision', async () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');

    fixture.componentRef.setInput('asyncDateFilter', () => Promise.resolve([`${y}-${m}-10`]));
    fixture.detectChanges();
    await flushMicrotasks();

    expect(component.isDateDisabled(new Date(y, today.getMonth(), 10, 14, 30))).toBeTrue();
  });

  it('clears async-disabled dates when the filter is removed', async () => {
    const today = new Date();
    const blocked = new Date(today.getFullYear(), today.getMonth(), 15);

    fixture.componentRef.setInput('asyncDateFilter', () => Promise.resolve([blocked]));
    fixture.detectChanges();
    await flushMicrotasks();
    expect(component.isDateDisabled(blocked)).toBeTrue();

    fixture.componentRef.setInput('asyncDateFilter', null);
    fixture.detectChanges();
    await flushMicrotasks();
    expect(component.isDateDisabled(blocked)).toBeFalse();
  });

  it('emits asyncDateFilterError and keeps the previous set when the filter rejects', async () => {
    const today = new Date();
    const blocked = new Date(today.getFullYear(), today.getMonth(), 15);
    const errors: unknown[] = [];
    component.asyncDateFilterError.subscribe((e) => errors.push(e));

    fixture.componentRef.setInput('asyncDateFilter', () => Promise.resolve([blocked]));
    fixture.detectChanges();
    await flushMicrotasks();

    fixture.componentRef.setInput('asyncDateFilter', () => Promise.reject(new Error('network')));
    fixture.detectChanges();
    await flushMicrotasks();

    expect(errors.length).toBe(1);
    expect(component.isDateDisabled(blocked)).toBeTrue();
  });

  it('emits loading true/false around the request', async () => {
    const states: boolean[] = [];
    component.asyncDateFilterLoading.subscribe((s) => states.push(s));

    fixture.componentRef.setInput('asyncDateFilter', () => Promise.resolve([]));
    fixture.detectChanges();
    await flushMicrotasks();

    expect(states[0]).toBeTrue();
    expect(states[states.length - 1]).toBeFalse();
  });
});
