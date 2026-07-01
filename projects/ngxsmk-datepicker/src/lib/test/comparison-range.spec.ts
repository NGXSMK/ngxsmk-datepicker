import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';

/**
 * Tests for the additive `comparisonRange` feature: a secondary, purely-presentational
 * range highlighted alongside the primary selection. Defaults to a no-op so existing
 * behavior is unchanged.
 */
describe('NgxsmkDatepickerComponent comparisonRange', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  const setRange = (range: [Date | null, Date | null] | null) =>
    fixture.componentRef.setInput('comparisonRange', range);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
  });

  it('defaults to no comparison range (no cells highlighted)', () => {
    expect(component.comparisonRange()).toBeNull();
    expect(component.isInComparisonRange(new Date(2024, 0, 10))).toBe(false);
  });

  it('highlights dates within the comparison range, inclusive of both endpoints', () => {
    setRange([new Date(2024, 0, 10), new Date(2024, 0, 20)]);

    expect(component.isInComparisonRange(new Date(2024, 0, 10))).toBe(true); // start
    expect(component.isInComparisonRange(new Date(2024, 0, 15))).toBe(true); // middle
    expect(component.isInComparisonRange(new Date(2024, 0, 20))).toBe(true); // end
    expect(component.isInComparisonRange(new Date(2024, 0, 9))).toBe(false); // before
    expect(component.isInComparisonRange(new Date(2024, 0, 21))).toBe(false); // after
  });

  it('normalizes reversed ranges and ignores incomplete ones', () => {
    setRange([new Date(2024, 0, 20), new Date(2024, 0, 10)]);
    expect(component.isInComparisonRange(new Date(2024, 0, 15))).toBe(true);

    setRange([new Date(2024, 0, 10), null]);
    expect(component.isInComparisonRange(new Date(2024, 0, 15))).toBe(false);

    setRange(null);
    expect(component.isInComparisonRange(new Date(2024, 0, 15))).toBe(false);
  });

  it('does not affect the primary selection or emitted value', () => {
    const emitSpy = spyOn(component.valueChange, 'emit');
    setRange([new Date(2024, 0, 10), new Date(2024, 0, 20)]);
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
