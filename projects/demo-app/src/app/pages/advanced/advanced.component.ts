import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent, type HolidayProvider } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-advanced',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxsmkDatepickerComponent],
  template: `
    <div class="animate-fade-in">
      <h1>Advanced Features</h1>
      <p class="text-lg">Power-user features for complex date handling scenarios.</p>

      <h2>Signal Forms Integration (Angular 21+)</h2>
      <p>Seamlessly integrate with the latest Angular Signal-based forms. Minimal boilerplate, maximum reactivity.</p>
      <div class="card bg-sidebar">
        <ngxsmk-datepicker 
          [field]="dateField"
          placeholder="Signal-synced field">
        </ngxsmk-datepicker>
        <div class="tip mt-md">
          Reactive State: <code>{{ dateField.value() | date:'medium' }}</code>
        </div>
      </div>

      <h2>Keyboard Shortcuts</h2>
      <p>Full A11y support. Navigate through dates and years purely with your keyboard.</p>
      <div class="grid gap-md">
        <div class="card bg-sidebar">
          <h3>Common Actions</h3>
          <ul class="shortcut-list">
            <li><kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd> - Navigate Days/Weeks</li>
            <li><kbd>PgUp</kbd> <kbd>PgDn</kbd> - Change Month</li>
            <li><kbd>T</kbd> - Select Today</li>
            <li><kbd>Esc</kbd> - Close Calendar</li>
            <li><kbd>?</kbd> - Show Help Overlay</li>
          </ul>
        </div>
      </div>

      <h2>Holiday Highlighting</h2>
      <p>Provide a <code>HolidayProvider</code> to automatically highlight specific dates with labels.</p>
      <div class="card bg-sidebar">
        <ngxsmk-datepicker 
          [holidayProvider]="holidayProvider"
          placeholder="Hover over Holidays (e.g. July 4th)">
        </ngxsmk-datepicker>
      </div>

      <h2>Time Picker Integration</h2>
      <p>Enable precise time selection alongside your date picker.</p>
      <div class="card bg-sidebar">
        <ngxsmk-datepicker 
          [showTime]="true" 
          [use24Hour]="true"
          placeholder="Pick date and time">
        </ngxsmk-datepicker>
      </div>

      <h2>Disabled Dates Logic</h2>
      <p>Restrict selection using custom logic or static arrays.</p>
      <div class="card bg-sidebar">
        <ngxsmk-datepicker 
          [isInvalidDate]="isWeekend"
          placeholder="Weekends are disabled">
        </ngxsmk-datepicker>
      </div>
    </div>
  `,
  styles: [`
    .bg-sidebar { background: var(--color-bg-sidebar); }
  `]
})
export class AdvancedFeaturesComponent {
  dateField = {
    value: signal<Date | null>(new Date()),
    disabled: signal(false),
    hasError: signal(false),
    required: signal(false)
  };

  isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  holidayProvider: HolidayProvider = {
    isHoliday: (date: Date) => {
      const m = date.getMonth() + 1;
      const d = date.getDate();
      return (m === 1 && d === 1) || (m === 7 && d === 4) || (m === 12 && d === 25);
    },
    getHolidayLabel: (date: Date) => {
      const m = date.getMonth() + 1;
      const d = date.getDate();
      if (m === 1 && d === 1) return 'New Year';
      if (m === 7 && d === 4) return 'Independence Day';
      if (m === 12 && d === 25) return 'Christmas';
      return null;
    }
  };
}
