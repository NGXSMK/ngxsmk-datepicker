import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { DatePipe } from '@angular/common';

describe('NgxsmkDatepickerComponent - Input Mask', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
      providers: [DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    component.allowTyping = true;
    fixture.detectChanges();
    input = document.createElement('input');
  });

  function type(value: string): void {
    // Focus first: typedInputValue only reflects the typing buffer while isTyping
    component.onInputFocus({ target: input } as unknown as FocusEvent);
    input.value = value;
    input.setSelectionRange(value.length, value.length);
    component.onInputChange({ target: input } as unknown as Event);
  }

  describe('with inputMask enabled (default MM/DD/YYYY)', () => {
    beforeEach(() => {
      component.inputMask = true;
    });

    it('does not zero-pad a partial month', () => {
      type('1');
      expect(component.typedInputValue).toBe('1');
    });

    it('inserts the separator once the month is complete and more digits follow', () => {
      type('123');
      expect(component.typedInputValue).toBe('12/3');
    });

    it('formats a full date', () => {
      type('12252026');
      expect(component.typedInputValue).toBe('12/25/2026');
    });

    it('ignores non-digit characters the user types', () => {
      type('12abc25');
      expect(component.typedInputValue).toBe('12/25');
    });

    it('writes the masked value back into the input element', () => {
      type('1225');
      expect(input.value).toBe('12/25');
    });
  });

  describe('with a custom mask pattern', () => {
    it('masks using DD.MM.YYYY', () => {
      component.inputMask = 'DD.MM.YYYY';
      type('25122026');
      expect(component.typedInputValue).toBe('25.12.2026');
    });
  });

  describe('with displayFormat only (backward compatibility)', () => {
    it('still masks when displayFormat is set and inputMask is false', () => {
      component.displayFormat = 'YYYY-MM-DD';
      type('20261225');
      expect(component.typedInputValue).toBe('2026-12-25');
    });

    it('does not mask when neither inputMask nor displayFormat is set', () => {
      type('12252026');
      expect(component.typedInputValue).toBe('12252026');
    });
  });

  describe('explicit pattern takes precedence over displayFormat', () => {
    it('uses the inputMask pattern string', () => {
      component.displayFormat = 'MM/DD/YYYY';
      component.inputMask = 'YYYY-MM-DD';
      type('20261225');
      expect(component.typedInputValue).toBe('2026-12-25');
    });
  });
});
