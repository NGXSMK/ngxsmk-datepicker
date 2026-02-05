import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { DatePipe } from '@angular/common';

describe('NgxsmkDatepickerComponent - Range Reselection Fix', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
      providers: [DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    component.mode = 'range';
    fixture.detectChanges();
  });

  it('should clear end date when clicking on start date with both dates selected', () => {
    const startDate = new Date(2024, 0, 10);
    const endDate = new Date(2024, 0, 20);

    // Set initial range
    component.startDate = startDate;
    component.endDate = endDate;
    fixture.detectChanges();

    // Click on start date
    component.onDateClick(startDate);
    fixture.detectChanges();

    // Verify end date is cleared but start date remains
    expect(component.startDate).toBeTruthy();
    expect(component.startDate?.getTime()).toBe(startDate.getTime());
    expect(component.endDate).toBeNull();
  });

  it('should clear start date when clicking on end date with both dates selected', () => {
    const startDate = new Date(2024, 0, 10);
    const endDate = new Date(2024, 0, 20);

    // Set initial range
    component.startDate = startDate;
    component.endDate = endDate;
    fixture.detectChanges();

    // Click on end date
    component.onDateClick(endDate);
    fixture.detectChanges();

    // Verify start date is cleared and end date becomes new start date
    expect(component.startDate).toBeTruthy();
    expect(component.startDate?.getTime()).toBe(endDate.getTime());
    expect(component.endDate).toBeNull();
  });

  it('should allow selecting a new end date after clicking start date', () => {
    const startDate = new Date(2024, 0, 10);
    const endDate = new Date(2024, 0, 20);
    const newEndDate = new Date(2024, 0, 15);

    // Set initial range
    component.startDate = startDate;
    component.endDate = endDate;
    fixture.detectChanges();

    // Click on start date to clear end date
    component.onDateClick(startDate);
    fixture.detectChanges();

    // Select new end date
    component.onDateClick(newEndDate);
    fixture.detectChanges();

    // Verify new range
    expect(component.startDate?.getTime()).toBe(startDate.getTime());
    expect(component.endDate?.getTime()).toBe(newEndDate.getTime());
  });

  it('should allow selecting a new end date after clicking end date', () => {
    const startDate = new Date(2024, 0, 10);
    const endDate = new Date(2024, 0, 20);
    const newEndDate = new Date(2024, 0, 25);

    // Set initial range
    component.startDate = startDate;
    component.endDate = endDate;
    fixture.detectChanges();

    // Click on end date to clear start date and set end as new start
    component.onDateClick(endDate);
    fixture.detectChanges();

    // Select new end date
    component.onDateClick(newEndDate);
    fixture.detectChanges();

    // Verify new range starts from old end date
    expect(component.startDate?.getTime()).toBe(endDate.getTime());
    expect(component.endDate?.getTime()).toBe(newEndDate.getTime());
  });

  it('should set clicked date as new start when clicking within the range', () => {
    const startDate = new Date(2024, 0, 10);
    const endDate = new Date(2024, 0, 20);
    const dateWithinRange = new Date(2024, 0, 15);

    // Set initial range (Jan 10 - Jan 20)
    component.startDate = startDate;
    component.endDate = endDate;
    fixture.detectChanges();

    // Click on a date within the range (Jan 15)
    component.onDateClick(dateWithinRange);
    fixture.detectChanges();

    // Verify it clears end date and sets clicked date as new start
    expect(component.startDate?.getTime()).toBe(dateWithinRange.getTime());
    expect(component.endDate).toBeNull();
  });
});
