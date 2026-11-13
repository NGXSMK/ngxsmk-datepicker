import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';

describe('UI/UX polish (3.0.7+)', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('defaults allowTyping to true and mobileModalStyle to bottom-sheet', () => {
    expect(component.allowTyping).toBe(true);
    expect(component.mobileModalStyle).toBe('bottom-sheet');
  });

  it('exposes a format hint for typed entry', () => {
    component.displayFormat = 'DD/MM/YYYY';
    expect(component.formatHintText).toContain('DD/MM/YYYY');
  });

  it('defaults range mode to two calendars on desktop when calendarCount is unset', () => {
    component.mode = 'range';
    spyOn(component, 'isMobileDevice').and.returnValue(false);
    expect(component.effectiveCalendarCount).toBe(2);
  });

  it('respects explicit calendarCount in range mode', () => {
    component.mode = 'range';
    component.calendarCount = 1;
    spyOn(component, 'isMobileDevice').and.returnValue(false);
    expect(component.effectiveCalendarCount).toBe(1);
  });

  it('includes disabled reason in aria labels for blocked days', () => {
    const today = new Date();
    const min = new Date(today);
    min.setDate(today.getDate() + 5);
    component.minDate = min;
    component.ngOnChanges({
      minDate: {
        previousValue: null,
        currentValue: min,
        firstChange: true,
        isFirstChange: () => true,
      },
    });
    const before = new Date(today);
    const label = component.getAriaLabel(before);
    expect(label.toLowerCase()).toMatch(/before|minimum|on or after|unavailable/);
  });
});
