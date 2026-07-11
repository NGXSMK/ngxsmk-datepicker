import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';

/**
 * Regression guard for the typed-input display behavior after `displayValue` was
 * made side-effect free and `typedInputValue` was converted to a signal.
 *
 * Invariants preserved from the original getter-side-effect implementation:
 *  - When NOT typing (and typing is allowed), the shown value derives live from `displayValue`.
 *  - While typing, the shown value is the user's in-progress buffer.
 *  - Reading `displayValue` never mutates `typedInputValue` (no write during render → no NG0600).
 */
describe('NgxsmkDatepickerComponent typed-input display', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
  });

  it('derives typedInputValue from displayValue when not typing', () => {
    component.allowTyping = true;
    component.value = new Date(2024, 0, 15);

    expect(component.typedInputValue).toBe(component.displayValue);
    expect(component.typedInputValue.length).toBeGreaterThan(0);
  });

  it('returns the typed buffer while typing and keeps displayValue pure', () => {
    component.allowTyping = true;
    component.value = new Date(2024, 0, 15);

    // Simulate an active typing session.
    (component as unknown as { isTyping: boolean }).isTyping = true;
    component.typedInputValue = 'partial-typed';

    expect(component.typedInputValue).toBe('partial-typed');

    // Reading displayValue must not mutate the typing buffer (pure getter).
    const displayed = component.displayValue;
    expect(displayed).not.toBe('partial-typed');
    expect(component.typedInputValue).toBe('partial-typed');
  });

  it('ignores the stale buffer once typing ends', () => {
    component.allowTyping = true;
    component.value = new Date(2024, 0, 15);

    (component as unknown as { isTyping: boolean }).isTyping = true;
    component.typedInputValue = 'leftover';
    (component as unknown as { isTyping: boolean }).isTyping = false;

    // Not typing again → derives from displayValue, not the stale buffer.
    expect(component.typedInputValue).toBe(component.displayValue);
    expect(component.typedInputValue).not.toBe('leftover');
  });
});
