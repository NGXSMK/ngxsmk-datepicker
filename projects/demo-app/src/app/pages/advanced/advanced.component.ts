import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent, type DayMetadata, type HolidayProvider } from 'ngxsmk-datepicker';
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
            [placeholder]="i18n.t().advanced.placeholders.signalField"
          >
          </ngxsmk-datepicker>
          <div class="tip mt-md">
            Reactive State: <code class="text-secondary">{{ dateField.value() | date: 'medium' }}</code>
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
          [placeholder]="i18n.t().advanced.placeholders.holidayHover"
        >
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
          [placeholder]="i18n.t().advanced.placeholders.pickDateTime"
        >
        </ngxsmk-datepicker>
      </div>

      <h2>{{ i18n.t().advanced.disabledDatesTitle }}</h2>
      <p>{{ i18n.t().advanced.disabledDatesLead }}</p>
      <div class="card bg-sidebar overflow-visible">
        <ngxsmk-datepicker
          [isInvalidDate]="isWeekend"
          [inline]="true"
          [theme]="themeService.theme() === 'dark' ? 'dark' : 'light'"
          placeholder="{{ i18n.t().advanced.weekendsDisabled }}"
        >
        </ngxsmk-datepicker>
      </div>

      <h2>{{ i18n.t().advanced.whatsNew.weekNumbersTitle }}</h2>
      <p>{{ i18n.t().advanced.whatsNew.weekNumbersLead }}</p>
      <div class="card bg-sidebar overflow-visible">
        <ngxsmk-datepicker
          [showWeekNumbers]="true"
          [inline]="true"
          [theme]="themeService.theme() === 'dark' ? 'dark' : 'light'"
        >
        </ngxsmk-datepicker>
      </div>

      <h2>{{ i18n.t().advanced.whatsNew.inputMaskTitle }}</h2>
      <p>{{ i18n.t().advanced.whatsNew.inputMaskLead }}</p>
      <div class="card bg-sidebar overflow-visible">
        <ngxsmk-datepicker
          [allowTyping]="true"
          [inputMask]="true"
          displayFormat="MM/DD/YYYY"
          [theme]="themeService.theme() === 'dark' ? 'dark' : 'light'"
          [placeholder]="i18n.t().advanced.whatsNew.inputMaskPlaceholder"
        >
        </ngxsmk-datepicker>
      </div>

      <h2>{{ i18n.t().advanced.whatsNew.asyncFilterTitle }}</h2>
      <p>{{ i18n.t().advanced.whatsNew.asyncFilterLead }}</p>
      <div class="card bg-sidebar overflow-visible">
        <ngxsmk-datepicker
          [asyncDateFilter]="loadBlockedDates"
          (asyncDateFilterLoading)="availabilityLoading.set($event)"
          [inline]="true"
          [theme]="themeService.theme() === 'dark' ? 'dark' : 'light'"
        >
        </ngxsmk-datepicker>
        @if (availabilityLoading()) {
          <div class="tip mt-md">{{ i18n.t().advanced.whatsNew.asyncLoading }}</div>
        }
      </div>

      <h2>{{ i18n.t().advanced.whatsNew.secondaryCalendarTitle }}</h2>
      <p>{{ i18n.t().advanced.whatsNew.secondaryCalendarLead }}</p>
      <div class="card bg-sidebar overflow-visible">
        <div class="system-picker">
          @for (system of calendarSystems; track system) {
            <button
              type="button"
              class="system-button"
              [class.active]="secondaryCalendar() === system"
              (click)="secondaryCalendar.set(system)"
            >
              {{ system }}
            </button>
          }
        </div>
        <ngxsmk-datepicker
          [secondaryCalendar]="secondaryCalendar()"
          [inline]="true"
          [theme]="themeService.theme() === 'dark' ? 'dark' : 'light'"
        >
        </ngxsmk-datepicker>
      </div>

      <h2>{{ i18n.t().advanced.whatsNew.dayMetadataTitle }}</h2>
      <p>{{ i18n.t().advanced.whatsNew.dayMetadataLead }}</p>
      <div class="card bg-sidebar overflow-visible">
        <ngxsmk-datepicker
          [dayMetadata]="priceMetadata"
          [inline]="true"
          [theme]="themeService.theme() === 'dark' ? 'dark' : 'light'"
        >
        </ngxsmk-datepicker>
      </div>

      <h2>{{ i18n.t().advanced.whatsNew.actionSlotsTitle }}</h2>
      <p>{{ i18n.t().advanced.whatsNew.actionSlotsLead }}</p>
      <div class="card bg-sidebar overflow-visible">
        <ngxsmk-datepicker
          [inline]="true"
          [calendarHeaderTemplate]="slotHeader"
          [calendarFooterTemplate]="slotFooter"
          [theme]="themeService.theme() === 'dark' ? 'dark' : 'light'"
        >
        </ngxsmk-datepicker>
        <ng-template #slotHeader>
          <div class="slot-header">{{ i18n.t().advanced.whatsNew.headerSlotText }}</div>
        </ng-template>
        <ng-template #slotFooter let-actions>
          <button type="button" class="slot-button" (click)="actions.clear()">
            {{ i18n.t().advanced.whatsNew.actionReset }}
          </button>
          <button type="button" class="slot-button slot-button-primary" (click)="actions.close()">
            {{ i18n.t().advanced.whatsNew.actionDone }}
          </button>
        </ng-template>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      h1 {
        margin-bottom: var(--space-xs);
      }
      .text-lg {
        font-size: var(--font-size-lg);
        margin-bottom: var(--space-2xl);
      }
      h2 {
        margin-top: var(--space-3xl);
        margin-bottom: var(--space-sm);
      }
      p {
        margin-bottom: var(--space-md);
      }

      .card {
        padding: var(--space-lg);
        @media (max-width: 480px) {
          padding: var(--space-md);
        }
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
          @media (max-width: 480px) {
            flex-wrap: wrap;
          }
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

      .p-lg {
        padding: var(--space-lg);
      }

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

      .overflow-visible {
        overflow: visible !important;
      }

      .system-picker {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-xs);
        justify-content: center;
        margin-bottom: var(--space-md);
      }

      .system-button {
        background: var(--color-bg-code);
        border: 1px solid var(--color-border);
        border-radius: 6px;
        padding: 4px 10px;
        font-size: var(--font-size-sm);
        cursor: pointer;
        color: inherit;
        text-transform: capitalize;
        &.active {
          border-color: var(--color-secondary);
          color: var(--color-secondary);
        }
      }

      .slot-header {
        padding: var(--space-sm) var(--space-md);
        font-size: var(--font-size-sm);
        font-weight: 600;
        text-align: center;
        border-bottom: 1px solid var(--color-border);
      }

      .slot-button {
        background: var(--color-bg-code);
        border: 1px solid var(--color-border);
        border-radius: 6px;
        padding: 6px 14px;
        font-size: var(--font-size-sm);
        cursor: pointer;
        color: inherit;
        margin: 0 4px;
        &.slot-button-primary {
          border-color: var(--color-secondary);
          color: var(--color-secondary);
        }
      }

      ::ng-deep .demo-sold-out {
        opacity: 0.45;
        text-decoration: line-through;
      }
    `,
  ],
})
export class AdvancedFeaturesComponent {
  i18n = inject(I18nService);
  themeService = inject(ThemeService);
  dateField = {
    value: signal<Date | null>(new Date()),
    disabled: signal(false),
    hasError: signal(false),
    required: signal(false),
  };

  isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  availabilityLoading = signal(false);

  /** Simulates a booking API: blocks three fixed days of the visible month after a short delay. */
  loadBlockedDates = (start: Date, _end: Date): Promise<Date[]> => {
    const y = start.getFullYear();
    const m = start.getMonth();
    return new Promise((resolve) => {
      setTimeout(() => resolve([new Date(y, m, 4), new Date(y, m, 12), new Date(y, m, 20)]), 600);
    });
  };

  readonly calendarSystems = ['islamic', 'persian', 'hebrew', 'buddhist', 'japanese'] as const;
  secondaryCalendar = signal<(typeof this.calendarSystems)[number]>('persian');

  /** Booking-style demo: weekday prices, weekend sold-out styling, a promo dot on the 15th. */
  priceMetadata = (date: Date): DayMetadata | null => {
    const day = date.getDay();
    if (day === 0 || day === 6) {
      return { label: '—', cssClass: 'demo-sold-out', tooltip: 'Sold out' };
    }
    const price = 89 + (date.getDate() % 5) * 10;
    return {
      label: '$' + price,
      indicatorColor: date.getDate() === 15 ? '#7c3aed' : undefined,
      tooltip: date.getDate() === 15 ? 'Promo day' : undefined,
    };
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
    },
  };
}
