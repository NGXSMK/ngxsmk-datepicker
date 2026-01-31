import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent, type HolidayProvider } from 'ngxsmk-datepicker';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-advanced',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxsmkDatepickerComponent],
  template: `
    <div class="animate-fade-in">
      <h1>{{ i18n.t().advanced.title }}</h1>
      <p class="text-lg">{{ i18n.t().advanced.lead }}</p>

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
    :host { display: block; }
    h1 { margin-bottom: var(--space-xs); }
    .text-lg { 
      font-size: var(--font-size-lg); 
      margin-bottom: var(--space-2xl);
    }
    h2 { margin-top: var(--space-3xl); margin-bottom: var(--space-sm); }
    p { margin-bottom: var(--space-md); }

    .card {
      padding: var(--space-lg);
      @media (max-width: 480px) { padding: var(--space-md); }
    }

    .shortcut-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: var(--space-sm);
      li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: var(--font-size-sm);
        @media (max-width: 480px) { flex-wrap: wrap; }
      }
    }

    kbd {
      background: var(--color-bg-code);
      border: 1px solid var(--color-border);
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 0.8em;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      box-shadow: 0 2px 0 var(--color-border);
      color: var(--color-secondary);
    }

    ngxsmk-datepicker {
      width: 100% !important;
      max-width: 100%;
    }

    .tip {
      font-size: var(--font-size-sm);
      code {
        background: rgba(124, 58, 237, 0.1);
        color: var(--color-primary-light);
        padding: 2px 6px;
        border-radius: 4px;
      }
    }
  `]
})
export class AdvancedFeaturesComponent {
  i18n = inject(I18nService);
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
