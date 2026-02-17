import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-range-reselection',
  standalone: true,
  imports: [FormsModule, NgxsmkDatepickerComponent],
  template: `
    <div class="page">
      <h2>Range reselection (filed issue)</h2>
      <div class="instructions">
        <strong>Steps to verify:</strong>
        <ol>
          <li>Pre-filled range is Jan 10 – Jan 20.</li>
          <li>Click on the <strong>start</strong> (Jan 10): end should clear, start stays.</li>
          <li>Select a new end date: range should be Jan 10 – new end.</li>
          <li>Or: set range again (e.g. Jan 10–20), then click <strong>end</strong> (Jan 20): start becomes Jan 20, end clears.</li>
          <li>Select new end: range should be Jan 20 – new end.</li>
          <li>Or: set range again, then click a date <strong>inside</strong> the range (e.g. Jan 15): that date becomes new start, end clears.</li>
        </ol>
      </div>
      <div class="datepicker-wrap">
        <ngxsmk-datepicker
          [(ngModel)]="range"
          mode="range"
          [inline]="true"
        ></ngxsmk-datepicker>
      </div>
    </div>
  `,
})
export class RangeReselectionComponent {
  range: { start: Date; end: Date } | null = {
    start: new Date(2024, 0, 10),
    end: new Date(2024, 0, 20),
  };
}
