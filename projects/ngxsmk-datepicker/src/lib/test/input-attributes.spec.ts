import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { DatePipe } from '@angular/common';

describe('NgxsmkDatepickerComponent Input Attributes', () => {
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

  it('should apply inputId to internal input', fakeAsync(() => {
    component.inputId = 'custom-id';
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('.ngxsmk-display-input'))
      .nativeElement as HTMLInputElement;
    expect(input.id).toBe('custom-id');
  }));

  it('should apply name to internal input', fakeAsync(() => {
    component.name = 'custom-name';
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('.ngxsmk-display-input'))
      .nativeElement as HTMLInputElement;
    expect(input.name).toBe('custom-name');
  }));

  it('should apply autocomplete to internal input', fakeAsync(() => {
    component.autocomplete = 'on';
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('.ngxsmk-display-input'))
      .nativeElement as HTMLInputElement;
    expect(input.getAttribute('autocomplete')).toBe('on');
  }));

  it('should default autocomplete to off', () => {
    // defaults are set on init
    expect(component.autocomplete).toBe('off');

    // Initial render
    const input = fixture.debugElement.query(By.css('.ngxsmk-display-input'))
      .nativeElement as HTMLInputElement;
    expect(input.getAttribute('autocomplete')).toBe('off');
  });

  it('should apply aria-invalid when errorState is true', fakeAsync(() => {
    component.errorState = true;
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('.ngxsmk-display-input'))
      .nativeElement as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');
  }));

  it('should apply aria-invalid when errorState is false', fakeAsync(() => {
    component.errorState = false;
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('.ngxsmk-display-input'))
      .nativeElement as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('false');
  }));
});
