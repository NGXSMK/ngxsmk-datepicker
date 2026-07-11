import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { DatePipe } from '@angular/common';

describe('NgxsmkDatepickerComponent — allowSameDay range (issue #231)', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;
  const emitted: unknown[] = [];

  beforeEach(async () => {
    emitted.length = 0;
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
      providers: [DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    component.mode = 'range';
    fixture.componentRef.setInput('allowSameDay', true);
    component.valueChange.subscribe((v) => emitted.push(v));
    fixture.detectChanges();
  });

  it('should emit a range when the same calendar day is clicked twice', () => {
    const day = new Date(2026, 2, 15);
    component.onDateClick(day);
    fixture.detectChanges();
    component.onDateClick(new Date(2026, 2, 15, 12, 0, 0));
    fixture.detectChanges();

    const start = component.startDate;
    const end = component.endDate;
    expect(start).not.toBeNull();
    expect(end).not.toBeNull();
    expect(start!.getTime()).toBe(end!.getTime());
    const last = emitted.at(-1);
    expect(last).toEqual(
      jasmine.objectContaining({
        start: jasmine.any(Date),
        end: jasmine.any(Date),
      })
    );
    const range = last as { start: Date; end: Date };
    expect(range.start.getTime()).toBe(start!.getTime());
    expect(range.end.getTime()).toBe(end!.getTime());
  });

  it('should not complete same-day range when allowSameDay is false', () => {
    fixture.componentRef.setInput('allowSameDay', false);
    const day = new Date(2026, 2, 10);
    component.onDateClick(day);
    fixture.detectChanges();
    emitted.length = 0;
    component.onDateClick(day);
    fixture.detectChanges();

    expect(component.endDate).toBeNull();
    expect(emitted.length).toBe(0);
  });

  it('should emit same-day range when closing popover with only start selected', () => {
    component.inline = false;
    component.isCalendarOpen = true;
    const day = new Date(2026, 2, 20);
    component.onDateClick(day);
    fixture.detectChanges();
    emitted.length = 0;

    component.closeCalendarWithFocusRestore();
    fixture.detectChanges();

    const start = component.startDate;
    const end = component.endDate;
    expect(start).not.toBeNull();
    expect(end).not.toBeNull();
    expect(start!.getTime()).toBe(end!.getTime());
    expect(emitted.length).toBeGreaterThan(0);
    const last = emitted.at(-1) as { start: Date; end: Date };
    expect(last.start.getTime()).toBe(last.end.getTime());
  });

  it('should not finalize on close when inline (no popover close semantics)', () => {
    component.inline = true;
    fixture.detectChanges();
    const day = new Date(2026, 2, 5);
    component.onDateClick(day);
    fixture.detectChanges();
    emitted.length = 0;

    component.closeCalendarWithFocusRestore();
    fixture.detectChanges();

    expect(component.endDate).toBeNull();
    expect(emitted.length).toBe(0);
  });
});
