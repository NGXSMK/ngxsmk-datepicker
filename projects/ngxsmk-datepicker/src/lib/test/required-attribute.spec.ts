import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { SignalFormField } from '../services/field-sync.service';
import { DatePipe } from '@angular/common';

describe('NgxsmkDatepickerComponent Required Attribute', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
      providers: [DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    component.inline = false;
    fixture.detectChanges();
  });

  it('should apply required attribute to internal input when required input is true', fakeAsync(() => {
    component.required = true;
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const inputDebug = fixture.debugElement.query(
      By.css('.ngxsmk-display-input'),
    );
    expect(inputDebug).withContext('Input element not found').toBeTruthy();

    if (inputDebug) {
      const input = inputDebug.nativeElement as HTMLInputElement;
      expect(input.required).toBe(true);
    }
  }));

  it('should handle required as a direct boolean in field', fakeAsync(() => {
    const mockField: Partial<SignalFormField> = {
      value: null,
      required: true,
      setValue: (_val: unknown) => {},
    };

    component.field = mockField as SignalFormField;
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    expect(component.required).toBe(true);
    const inputDebug = fixture.debugElement.query(
      By.css('.ngxsmk-display-input'),
    );
    if (inputDebug) {
      const input = inputDebug.nativeElement as HTMLInputElement;
      expect(input.required).toBe(true);
    }
  }));

  it('should handle required as a function in field', fakeAsync(() => {
    const mockField: Partial<SignalFormField> = {
      value: null,
      required: () => true,
      setValue: (_val: unknown) => {},
    };

    component.field = mockField as SignalFormField;
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    expect(component.required).toBe(true);
    const inputDebug = fixture.debugElement.query(
      By.css('.ngxsmk-display-input'),
    );
    if (inputDebug) {
      const input = inputDebug.nativeElement as HTMLInputElement;
      expect(input.required).toBe(true);
    }
  }));

  it('should handle field as a function (Signal) with required metadata', fakeAsync(() => {
    // Simulate a Signal (function) that also has 'required' property attached
    const signalFn = () => null;
    Object.assign(signalFn, {
      required: true,
      setValue: (_val: unknown) => {},
    });

    component.field = signalFn as unknown as SignalFormField;
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    expect(component.required).toBe(true);
    const inputDebug = fixture.debugElement.query(
      By.css('.ngxsmk-display-input'),
    );
    if (inputDebug) {
      const input = inputDebug.nativeElement as HTMLInputElement;
      expect(input.required).toBe(true);
    }
  }));
});
