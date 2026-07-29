import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';

@Component({
  standalone: true,
  imports: [NgxsmkDatepickerComponent, FormsModule],
  template: ` <ngxsmk-datepicker [(ngModel)]="selectedDate" [mode]="mode" [minDate]="minDate" [maxDate]="maxDate" /> `,
})
class TestHostComponent {
  selectedDate: any = null;
  mode: 'single' | 'year' = 'single';
  minDate: Date | null = null;
  maxDate: Date | null = null;
}

describe('Year Selection Fixes', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should update currentYear and signal when changeYear is called', () => {
    const datepickerComponent = fixture.debugElement.children[0].componentInstance as NgxsmkDatepickerComponent;
    const initialYear = datepickerComponent.currentYear;

    datepickerComponent.changeYear(2);
    fixture.detectChanges();

    expect(datepickerComponent.currentYear).toBe(initialYear + 2);
  });

  it('should select full year when in mode="year" and year is clicked', () => {
    host.mode = 'year';
    fixture.detectChanges();

    const datepickerComponent = fixture.debugElement.children[0].componentInstance as NgxsmkDatepickerComponent;
    datepickerComponent.onYearClick(2026);
    fixture.detectChanges();

    expect(host.selectedDate).toBeTruthy();
    expect(host.selectedDate.start.getFullYear()).toBe(2026);
    expect(host.selectedDate.end.getFullYear()).toBe(2026);
  });

  it('should disable years outside minDate and maxDate', () => {
    host.minDate = new Date(2022, 0, 1);
    host.maxDate = new Date(2027, 11, 31);
    fixture.detectChanges();

    const datepickerComponent = fixture.debugElement.children[0].componentInstance as NgxsmkDatepickerComponent;
    expect(datepickerComponent.isYearDisabled(2020)).toBeTrue();
    expect(datepickerComponent.isYearDisabled(2021)).toBeTrue();
    expect(datepickerComponent.isYearDisabled(2025)).toBeFalse();
    expect(datepickerComponent.isYearDisabled(2028)).toBeTrue();
  });
});
