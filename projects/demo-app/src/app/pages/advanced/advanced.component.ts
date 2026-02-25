import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent, type HolidayProvider } from 'ngxsmk-datepicker';
import { I18nService } from '../../i18n/i18n.service';
import { ThemeService } from '@tokiforge/angular';

@Component({
  selector: 'app-advanced',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxsmkDatepickerComponent],
  template: `
    <div class="animate-fade-in">
      <h1>{{ i18n.t().advanced.title }}</h1>
      <p class="text-lg">{{ i18n.t().advanced.lead }}</p>

      <h2>{{ i18n.t().advanced.signalFormsTitle }}</h2>
      <p>{{ i18n.t().advanced.signalFormsLead }}</p>
      <div class="code-window mt-md overflow-visible">
        <div class="window-header">
          <div class="dot red"></div>
          <div class="dot yellow"></div>
          <div class="dot green"></div>
          <div class="window-title">signal-form.html</div>
        </div>
        <div class="p-lg preview-body-alt">
          <ngxsmk-datepicker 
            [field]="dateField"
            [inline]="true"
            [theme]="themeService.theme() === 'dark' ? 'dark' : 'light'"
            [placeholder]="i18n.t().advanced.placeholders.signalField">
          </ngxsmk-datepicker>
          <div class="tip mt-md">
            Reactive State: <code class="text-secondary">{{ dateField.value() | date:'medium' }}</code>
          </div>
        </div>
      </div>

      <h2>{{ i18n.t().advanced.keyboardTitle }}</h2>
      <p>{{ i18n.t().advanced.keyboardLead }}</p>
      <div class="grid gap-md">
        <div class="card bg-sidebar">
          <h3>{{ i18n.t().advanced.commonActions }}</h3>
          <ul class="shortcut-list">
            <li><kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd> - {{ i18n.t().advanced.shortcuts.arrows }}</li>
            <li><kbd>PgUp</kbd> <kbd>PgDn</kbd> - {{ i18n.t().advanced.shortcuts.pgUpDn }}</li>
            <li><kbd>T</kbd> - {{ i18n.t().advanced.shortcuts.today }}</li>
            <li><kbd>Esc</kbd> - {{ i18n.t().advanced.shortcuts.close }}</li>
            <li><kbd>?</kbd> - {{ i18n.t().advanced.shortcuts.help }}</li>
          </ul>
        </div>
      </div>

      <h2>{{ i18n.t().advanced.holidaysTitle }}</h2>
      <p>{{ i18n.t().advanced.holidaysLead }}</p>
      <div class="card bg-sidebar overflow-visible">
        <ngxsmk-datepicker 
          [holidayProvider]="holidayProvider"
          [inline]="true"
          [theme]="themeService.theme() === 'dark' ? 'dark' : 'light'"
          [placeholder]="i18n.t().advanced.placeholders.holidayHover">
        </ngxsmk-datepicker>
      </div>

      <h2>{{ i18n.t().advanced.timePickerTitle }}</h2>
      <p>{{ i18n.t().advanced.timePickerLead }}</p>
      <div class="card bg-sidebar overflow-visible">
        <ngxsmk-datepicker 
          [showTime]="true" 
          [use24Hour]="true"
          [inline]="true"
          [theme]="themeService.theme() === 'dark' ? 'dark' : 'light'"
          [placeholder]="i18n.t().advanced.placeholders.pickDateTime">
        </ngxsmk-datepicker>
      </div>

      <h2>{{ i18n.t().advanced.disabledDatesTitle }}</h2>
      <p>{{ i18n.t().advanced.disabledDatesLead }}</p>
      <div class="card bg-sidebar overflow-visible">
        <ngxsmk-datepicker 
          [isInvalidDate]="isWeekend"
          [inline]="true"
          [theme]="themeService.theme() === 'dark' ? 'dark' : 'light'"
          placeholder="{{ i18n.t().advanced.weekendsDisabled }}">
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
      font-family: 'JetBrains Mono', monospace;
      box-shadow: 0 2px 0 var(--color-border);
      color: var(--color-secondary);
    }
    
    .p-lg { padding: var(--space-lg); }
    
    .preview-body-alt {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--space-2xl) var(--space-lg);
      background: radial-gradient(circle at top, rgba(124, 58, 237, 0.05), transparent);
    }

    ngxsmk-datepicker {
      display: block;
      width: fit-content !important;
      margin: 0 auto;
    }

    .tip {
      font-size: var(--font-size-sm);
      text-align: center;
      width: 100%;
    }
    
    .overflow-visible { overflow: visible !important; }
    

  `]
})
export class AdvancedFeaturesComponent {
  i18n = inject(I18nService);
  themeService = inject(ThemeService);
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
      const labels = this.i18n.t().advanced.holidayLabels;
      if (m === 1 && d === 1) return labels.newYear;
      if (m === 7 && d === 4) return labels.independenceDay;
      if (m === 12 && d === 25) return labels.christmas;
      return null;
    }
  };
}
