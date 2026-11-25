import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { DatePipe } from '@angular/common';

describe('NgxsmkDatepickerComponent - Touch Gestures', () => {
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
    component.writeValue(new Date(2025, 5, 15));
    fixture.detectChanges();
  });

  function swipe(endX: number, endY: number): void {
    const target = fixture.nativeElement as HTMLElement;
    const start = new Touch({ identifier: 0, target, clientX: 200, clientY: 200 });
    const end = new Touch({ identifier: 0, target, clientX: endX, clientY: endY });
    component.onCalendarSwipeStart(new TouchEvent('touchstart', { touches: [start] }));
    component.onCalendarSwipeMove(new TouchEvent('touchmove', { touches: [end], cancelable: true }));
    component.onCalendarSwipeEnd(new TouchEvent('touchend', { changedTouches: [end] }));
  }

  it('navigates to the next month on a left swipe', () => {
    const initialMonth = component.currentMonth;
    swipe(50, 200);
    expect(component.currentMonth).toBe((initialMonth + 1) % 12);
  });

  it('navigates to the previous month on a right swipe', () => {
    const initialMonth = component.currentMonth;
    swipe(350, 200);
    expect(component.currentMonth).toBe((initialMonth + 11) % 12);
  });

  it('changes the year without changing the month on a vertical swipe', () => {
    const initialMonth = component.currentMonth;
    const initialYear = component.currentYear;
    swipe(200, 50);
    expect(component.currentMonth).toBe(initialMonth);
    expect(component.currentYear).toBe(initialYear + 1);
  });

  it('ignores an extra touchend after a completed swipe', () => {
    swipe(50, 200);
    const monthAfterSwipe = component.currentMonth;
    const touch = new Touch({ identifier: 0, target: fixture.nativeElement, clientX: 50, clientY: 200 });
    component.onCalendarSwipeEnd(new TouchEvent('touchend', { changedTouches: [touch] }));
    expect(component.currentMonth).toBe(monthAfterSwipe);
  });
});
