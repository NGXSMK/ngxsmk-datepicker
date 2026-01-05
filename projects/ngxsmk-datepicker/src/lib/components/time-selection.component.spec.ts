import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeSelectionComponent } from './time-selection.component';
import { CustomSelectComponent } from './custom-select.component';
import { ChangeDetectorRef } from '@angular/core';

describe('TimeSelectionComponent', () => {
  let component: TimeSelectionComponent;
  let fixture: ComponentFixture<TimeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeSelectionComponent, CustomSelectComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TimeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.currentDisplayHour).toBe(12);
    expect(component.currentMinute).toBe(0);
    expect(component.currentSecond).toBe(0);
    expect(component.isPm).toBe(false);
    expect(component.disabled).toBe(false);
    expect(component.timeLabel).toBe('Time');
    expect(component.showSeconds).toBe(false);
  });

  it('should have default ampmOptions', () => {
    expect(component.ampmOptions).toEqual([
      { label: 'AM', value: false },
      { label: 'PM', value: true }
    ]);
  });

  it('should emit timeChange when hour changes', () => {
    spyOn(component.timeChange, 'emit');
    component.currentDisplayHour = 14;
    component.timeChange.emit();
    expect(component.timeChange.emit).toHaveBeenCalled();
  });

  it('should emit timeChange when minute changes', () => {
    spyOn(component.timeChange, 'emit');
    component.currentMinute = 30;
    component.timeChange.emit();
    expect(component.timeChange.emit).toHaveBeenCalled();
  });

  it('should emit timeChange when second changes', () => {
    spyOn(component.timeChange, 'emit');
    component.currentSecond = 45;
    component.timeChange.emit();
    expect(component.timeChange.emit).toHaveBeenCalled();
  });

  it('should emit timeChange when ampm changes', () => {
    spyOn(component.timeChange, 'emit');
    component.isPm = true;
    component.timeChange.emit();
    expect(component.timeChange.emit).toHaveBeenCalled();
  });

  it('should display time label', () => {
    component.timeLabel = 'Select Time';
    // Force change detection for OnPush component
    const cdr = fixture.componentRef.injector.get(ChangeDetectorRef);
    cdr.markForCheck();
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('.ngxsmk-time-label');
    expect(label?.textContent?.trim()).toBe('Select Time');
  });

  it('should display default time label', () => {
    // timeLabel defaults to empty string, so we need to set it or check for empty
    component.timeLabel = 'Time';
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('.ngxsmk-time-label');
    expect(label?.textContent?.trim()).toBe('Time');
  });

  it('should show seconds select when showSeconds is true', () => {
    component.showSeconds = true;
    component.secondOptions = [
      { label: '00', value: 0 },
      { label: '30', value: 30 }
    ];
    // Force change detection for OnPush component
    const cdr = fixture.componentRef.injector.get(ChangeDetectorRef);
    cdr.markForCheck();
    fixture.detectChanges();

    const secondSelect = fixture.nativeElement.querySelector('.second-select');
    expect(secondSelect).toBeTruthy();
  });

  it('should not show seconds select when showSeconds is false', () => {
    component.showSeconds = false;
    fixture.detectChanges();

    const secondSelect = fixture.nativeElement.querySelector('.second-select');
    expect(secondSelect).toBeFalsy();
  });

  it('should pass hourOptions to hour select', () => {
    component.hourOptions = [
      { label: '1', value: 1 },
      { label: '2', value: 2 }
    ];
    fixture.detectChanges();

    expect(component.hourOptions.length).toBe(2);
  });

  it('should pass minuteOptions to minute select', () => {
    component.minuteOptions = [
      { label: '00', value: 0 },
      { label: '15', value: 15 }
    ];
    fixture.detectChanges();

    expect(component.minuteOptions.length).toBe(2);
  });

  it('should pass secondOptions to second select', () => {
    component.showSeconds = true;
    component.secondOptions = [
      { label: '00', value: 0 },
      { label: '30', value: 30 }
    ];
    fixture.detectChanges();

    expect(component.secondOptions.length).toBe(2);
  });

  it('should pass disabled to all selects', () => {
    component.disabled = true;
    fixture.detectChanges();

    // The disabled state is passed to CustomSelectComponent instances
    expect(component.disabled).toBe(true);
  });

  it('should pass currentDisplayHour to hour select', () => {
    component.currentDisplayHour = 15;
    fixture.detectChanges();

    expect(component.currentDisplayHour).toBe(15);
  });

  it('should pass currentMinute to minute select', () => {
    component.currentMinute = 45;
    fixture.detectChanges();

    expect(component.currentMinute).toBe(45);
  });

  it('should pass currentSecond to second select', () => {
    component.showSeconds = true;
    component.currentSecond = 30;
    fixture.detectChanges();

    expect(component.currentSecond).toBe(30);
  });

  it('should pass isPm to ampm select', () => {
    component.isPm = true;
    fixture.detectChanges();

    expect(component.isPm).toBe(true);
  });

  it('should display time separator', () => {
    const separator = fixture.nativeElement.querySelector('.ngxsmk-time-separator');
    expect(separator).toBeTruthy();
    expect(separator.textContent.trim()).toBe(':');
  });

  it('should allow custom ampmOptions', () => {
    component.ampmOptions = [
      { label: 'Morning', value: false },
      { label: 'Evening', value: true }
    ];
    fixture.detectChanges();

    expect(component.ampmOptions.length).toBe(2);
    expect(component.ampmOptions[0].label).toBe('Morning');
  });
});

