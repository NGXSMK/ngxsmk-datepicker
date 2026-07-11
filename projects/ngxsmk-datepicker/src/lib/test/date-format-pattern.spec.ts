import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { DatePipe } from '@angular/common';

describe('NgxsmkDatepickerComponent - dateFormatPattern', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
      providers: [DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display date correctly with DDD MMMM DD, YYYY pattern', () => {
    // 21 March 2026 is a Saturday
    const testDate = new Date(2026, 2, 21);
    component.mode = 'single';
    component.dateFormatPattern = 'DDD MMMM DD, YYYY';
    component.value = testDate;
    fixture.detectChanges();

    expect(component.displayValue).toBe('Sat March 21, 2026');
  });

  it('should display date correctly with other patterns', () => {
    const testDate = new Date(2026, 2, 21, 14, 30, 45);
    component.mode = 'single';
    component.dateFormatPattern = 'YYYY-MM-DD HH:mm:ss';
    component.value = testDate;
    fixture.detectChanges();

    expect(component.displayValue).toBe('2026-03-21 14:30:45');
  });

  it('should handle AM/PM correctly', () => {
    const testDate = new Date(2026, 2, 21, 14, 30);
    component.mode = 'single';
    component.dateFormatPattern = 'hh:mm A';
    component.value = testDate;
    fixture.detectChanges();

    expect(component.displayValue).toBe('02:30 PM');
  });

  it('should handle weekday names correctly across the week (Sunday-first check)', () => {
    const days = [
      { date: new Date(2026, 2, 22), expected: 'Sun' }, // Sunday
      { date: new Date(2026, 2, 23), expected: 'Mon' },
      { date: new Date(2026, 2, 24), expected: 'Tue' },
      { date: new Date(2026, 2, 25), expected: 'Wed' },
      { date: new Date(2026, 2, 26), expected: 'Thu' },
      { date: new Date(2026, 2, 27), expected: 'Fri' },
      { date: new Date(2026, 2, 28), expected: 'Sat' },
    ];

    component.mode = 'single';
    component.dateFormatPattern = 'DDD';

    days.forEach((day) => {
      component.value = day.date;
      fixture.detectChanges();
      expect(component.displayValue).toBe(day.expected);
    });
  });
});
