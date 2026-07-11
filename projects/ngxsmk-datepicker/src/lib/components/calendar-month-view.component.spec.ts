import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarMonthViewComponent } from './calendar-month-view.component';

describe('CalendarMonthViewComponent week numbers', () => {
  let fixture: ComponentFixture<CalendarMonthViewComponent>;
  let component: CalendarMonthViewComponent;

  const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  // Two full ISO weeks: Mon 2026-01-05 .. Sun 2026-01-18 (weeks 2 and 3)
  const twoWeeks: (Date | null)[] = Array.from({ length: 14 }, (_, i) => new Date(2026, 0, 5 + i));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarMonthViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarMonthViewComponent);
    component = fixture.componentInstance;
    component.weekDays = weekDays;
    component.days = twoWeeks;
  });

  it('renders no week-number column by default', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.ngxsmk-week-number').length).toBe(0);
    expect(el.querySelector('.ngxsmk-week-number-header')).toBeNull();
    expect(el.querySelector('.ngxsmk-days-grid')!.classList).not.toContain('ngxsmk-with-week-numbers');
  });

  it('renders one week-number cell per row plus a header cell when enabled', () => {
    component.showWeekNumbers = true;
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const cells = el.querySelectorAll('.ngxsmk-week-number');
    expect(cells.length).toBe(2);
    expect(cells[0].textContent!.trim()).toBe('2');
    expect(cells[1].textContent!.trim()).toBe('3');
    expect(el.querySelector('.ngxsmk-week-number-header')!.textContent!.trim()).toBe('Wk');
    expect(el.querySelector('.ngxsmk-days-grid')!.classList).toContain('ngxsmk-with-week-numbers');
  });

  it('uses the custom weekNumberLabel', () => {
    component.showWeekNumbers = true;
    component.weekNumberLabel = 'KW';
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('.ngxsmk-week-number-header');
    expect(header.textContent.trim()).toBe('KW');
  });

  it('skips leading empty cells when computing the row week number', () => {
    // Row 1: 5 nulls then Sat 2026-01-03, Sun 2026-01-04 (ISO week 1)
    component.showWeekNumbers = true;
    component.days = [null, null, null, null, null, new Date(2026, 0, 3), new Date(2026, 0, 4)];
    fixture.detectChanges();
    const cells = fixture.nativeElement.querySelectorAll('.ngxsmk-week-number');
    expect(cells.length).toBe(1);
    expect(cells[0].textContent.trim()).toBe('1');
  });

  it('week-number cells are hidden from assistive technology', () => {
    component.showWeekNumbers = true;
    fixture.detectChanges();
    const cell = fixture.nativeElement.querySelector('.ngxsmk-week-number');
    expect(cell.getAttribute('aria-hidden')).toBe('true');
  });

  describe('day metadata', () => {
    it('renders label and indicator dot from metadata', () => {
      component.getDayMetadata = (d: Date | null) =>
        d && d.getDate() === 5 ? { label: '$120', indicatorColor: 'rgb(255, 0, 0)' } : null;
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      const labels = el.querySelectorAll('.ngxsmk-day-meta-label');
      const dots = el.querySelectorAll<HTMLElement>('.ngxsmk-day-indicator');
      expect(labels.length).toBe(1);
      expect(labels[0].textContent!.trim()).toBe('$120');
      expect(dots.length).toBe(1);
      expect(dots[0].style.backgroundColor).toBe('rgb(255, 0, 0)');
    });

    it('renders nothing without metadata', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.ngxsmk-day-meta-label').length).toBe(0);
      expect(fixture.nativeElement.querySelectorAll('.ngxsmk-day-indicator').length).toBe(0);
    });
  });

  describe('secondary calendar', () => {
    it('renders no secondary day labels by default', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.ngxsmk-day-secondary').length).toBe(0);
    });

    it('renders a secondary day label per day cell when enabled', () => {
      component.secondaryCalendar = 'persian';
      component.secondaryCalendarLocale = 'en-US';
      fixture.detectChanges();
      const labels = fixture.nativeElement.querySelectorAll('.ngxsmk-day-secondary');
      expect(labels.length).toBe(14);
      expect(labels[0].textContent.trim().length).toBeGreaterThan(0);
      expect(labels[0].getAttribute('aria-hidden')).toBe('true');
    });
  });
});
