import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { generateWeekDaysFull } from '../utils/calendar.utils';

@Component({
  standalone: true,
  imports: [NgxsmkDatepickerComponent, FormsModule],
  template: ` <ngxsmk-datepicker [(ngModel)]="selectedDate" [mode]="mode" [showOtherMonths]="showOtherMonths" /> `,
})
class TestHostComponent {
  selectedDate: any = null;
  mode: 'single' | 'range' = 'single';
  showOtherMonths = false;
}

describe('Angular Issues Fixes Suite', () => {
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

  it('should generate full weekday names correctly', () => {
    const fullDays = generateWeekDaysFull('en-US', 0);
    expect(fullDays.length).toBe(7);
    expect(fullDays[0]).toBe('Sunday');
  });

  it('should support showOtherMonths input binding', () => {
    host.showOtherMonths = true;
    fixture.detectChanges();
    const datepickerComponent = fixture.debugElement.children[0].componentInstance as NgxsmkDatepickerComponent;
    expect(datepickerComponent.showOtherMonths).toBeTrue();
  });
});
