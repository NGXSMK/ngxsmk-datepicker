import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-month-navigation',
  standalone: true,
  imports: [FormsModule, NgxsmkDatepickerComponent],
  template: `
    <div class="page">
      <h2>Month navigation (filed issue)</h2>
      <div class="instructions">
        <strong>Steps to verify:</strong>
        <ol>
          <li>Open the calendar (inline is shown below).</li>
          <li>Select Jan 31 as start (e.g. click Jan 31).</li>
          <li>Click “next month” to go to February.</li>
          <li>Select a date in February (e.g. Feb 3).</li>
          <li><strong>Expected:</strong> The view stays on February (does not snap back to January).</li>
          <li>Click “next month” again. <strong>Expected:</strong> View goes to March.</li>
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
export class MonthNavigationComponent {
  range: { start: Date; end: Date } | null = null;
}
