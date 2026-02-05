import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent, HolidayProvider } from 'ngxsmk-datepicker';
import { ThemeService } from '@tokiforge/angular';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-examples',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, NgxsmkDatepickerComponent],
  template: `
    <div class="animate-fade-in examples-container">
      <div class="page-header">
        <h1>{{ i18n.t().examples.basicTitle }}</h1>
        <p class="text-lg">{{ i18n.t().examples.basicLead }}</p>
      </div>

      <div class="example-category">
        <h2 class="category-title">Selection Modes</h2>
        <div class="examples-grid">
          <div class="card demo-card">
            <div class="card-header">
              <h3>Single Date</h3>
              <span class="badge">Default</span>
            </div>
            <p class="card-desc">Standard single date selection.</p>
            <ngxsmk-datepicker
              mode="single"
              [(ngModel)]="singleValue"
              placeholder="Select a date"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="singleValue">
              <code>{{ singleValue | date: 'mediumDate' }}</code>
            </div>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>Date Range</h3>
              <span class="badge">Range</span>
            </div>
            <p class="card-desc">Select a start and end date.</p>
            <ngxsmk-datepicker
              mode="range"
              [(ngModel)]="rangeValue"
              placeholder="Select range"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="rangeValue">
              <code
                >{{ rangeValue.start | date: 'shortDate' }} -
                {{ rangeValue.end | date: 'shortDate' }}</code
              >
            </div>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>Multiple Dates</h3>
              <span class="badge">Multiple</span>
            </div>
            <p class="card-desc">Pick multiple non-contiguous dates.</p>
            <ngxsmk-datepicker
              mode="multiple"
              [(ngModel)]="multipleValue"
              placeholder="Pick multiple dates"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="multipleValue.length">
              <code>{{ multipleValue.length }} dates selected</code>
            </div>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>Month Selection</h3>
              <span class="badge">Month</span>
            </div>
            <p class="card-desc">Select an entire month.</p>
            <ngxsmk-datepicker
              mode="month"
              [(ngModel)]="monthValue"
              placeholder="Select month"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="monthValue">
              <code>{{ monthValue.start | date: 'MMMM yyyy' }}</code>
            </div>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>Week Selection</h3>
              <span class="badge">Week</span>
            </div>
            <p class="card-desc">Select a specific week.</p>
            <ngxsmk-datepicker
              mode="week"
              [(ngModel)]="weekValue"
              placeholder="Select week"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="weekValue">
              <code>Week of {{ weekValue.start | date: 'shortDate' }}</code>
            </div>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>Year Selection</h3>
              <span class="badge">Year</span>
            </div>
            <p class="card-desc">Select an entire year.</p>
            <ngxsmk-datepicker
              mode="year"
              [(ngModel)]="yearValue"
              placeholder="Select year"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="yearValue">
              <code>{{ yearValue.start | date: 'yyyy' }}</code>
            </div>
          </div>
        </div>
      </div>

      <div class="example-category">
        <h2 class="category-title">Date & Time</h2>
        <div class="examples-grid">
          <div class="card demo-card">
            <div class="card-header">
              <h3>Date + Time</h3>
              <span class="badge">Time</span>
            </div>
            <p class="card-desc">Select date with time (12h format).</p>
            <ngxsmk-datepicker
              [showTime]="true"
              [(ngModel)]="dateTimeValue"
              placeholder="Select date & time"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="dateTimeValue">
              <code>{{ dateTimeValue | date: 'short' }}</code>
            </div>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>24 Hour Format</h3>
              <span class="badge">24h</span>
            </div>
            <p class="card-desc">Using 24-hour clock cycle.</p>
            <ngxsmk-datepicker
              [showTime]="true"
              [use24Hour]="true"
              [(ngModel)]="dateTime24Value"
              placeholder="Select 24h time"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="dateTime24Value">
              <code>{{ dateTime24Value | date: 'medium' }}</code>
            </div>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>Time Only</h3>
              <span class="badge">Time Only</span>
            </div>
            <p class="card-desc">Time picker without calendar.</p>
            <ngxsmk-datepicker
              [timeOnly]="true"
              [(ngModel)]="timeOnlyValue"
              placeholder="Select time"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="timeOnlyValue">
              <code>{{ timeOnlyValue | date: 'shortTime' }}</code>
            </div>
          </div>
          <div class="card demo-card">
            <div class="card-header">
              <h3>With Seconds</h3>
              <span class="badge">Seconds</span>
            </div>
            <p class="card-desc">High precision time selection.</p>
            <ngxsmk-datepicker
              [timeOnly]="true"
              [showSeconds]="true"
              [(ngModel)]="timeSecondsValue"
              placeholder="Select time w/ seconds"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="timeSecondsValue">
              <code>{{ timeSecondsValue | date: 'mediumTime' }}</code>
            </div>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>Time Range</h3>
              <span class="badge">New</span>
            </div>
            <p class="card-desc">Select time range (from-to).</p>
            <ngxsmk-datepicker
              [timeRangeMode]="true"
              [showTime]="true"
              [use24Hour]="true"
              [(ngModel)]="timeRangeValue"
              placeholder="Select time range"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="timeRangeValue">
              <code
                >{{ timeRangeValue.start | date: 'HH:mm' }} -
                {{ timeRangeValue.end | date: 'HH:mm' }}</code
              >
            </div>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>Custom Date Format</h3>
              <span class="badge">New</span>
            </div>
            <p class="card-desc">Pattern: YYYY-MM-DD HH:mm</p>
            <ngxsmk-datepicker
              [dateFormatPattern]="'YYYY-MM-DD HH:mm'"
              [showTime]="true"
              [(ngModel)]="customFormatValue"
              placeholder="Custom format"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="customFormatValue">
              <code>{{ customFormatValue | date: 'medium' }}</code>
            </div>
          </div>
        </div>
      </div>

      <div class="example-category">
        <h2 class="category-title">Multi-Calendar & Animations</h2>
        <div class="examples-grid">
          <div class="card demo-card">
            <div class="card-header">
              <h3>Synchronized Calendars</h3>
              <span class="badge">New</span>
            </div>
            <p class="card-desc">Calendars stay 1 month apart.</p>
            <ngxsmk-datepicker
              mode="range"
              [calendarCount]="2"
              [syncScroll]="{ enabled: true, monthGap: 1 }"
              [(ngModel)]="syncScrollValue"
              placeholder="Synced layout"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="syncScrollValue">
              <code
                >{{ syncScrollValue.start | date: 'shortDate' }} -
                {{ syncScrollValue.end | date: 'shortDate' }}</code
              >
            </div>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>Fast Animations</h3>
              <span class="badge">New</span>
            </div>
            <p class="card-desc">Custom animation (100ms).</p>
            <ngxsmk-datepicker
              [animationConfig]="{
                enabled: true,
                duration: 100,
                easing: 'ease-out',
              }"
              [(ngModel)]="animationValue"
              placeholder="Fast animations"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="animationValue">
              <code>{{ animationValue | date: 'shortDate' }}</code>
            </div>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>Reduced Motion</h3>
              <span class="badge">A11y</span>
            </div>
            <p class="card-desc">Respects prefers-reduced-motion.</p>
            <ngxsmk-datepicker
              [animationConfig]="{ enabled: false }"
              [(ngModel)]="noAnimValue"
              placeholder="No animations"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="noAnimValue">
              <code>{{ noAnimValue | date: 'shortDate' }}</code>
            </div>
          </div>
        </div>
      </div>

      <div class="example-category">
        <h2 class="category-title">Visual Configuration</h2>
        <div class="examples-grid">
          <div class="card demo-card">
            <div class="card-header">
              <h3>Multiple Months</h3>
              <span class="badge">Multi-View</span>
            </div>
            <p class="card-desc">Show 2 months side-by-side.</p>
            <div class="inline-wrapper">
              <ngxsmk-datepicker
                [inline]="true"
                mode="range"
                [calendarCount]="2"
                [(ngModel)]="multiMonthValue"
              ></ngxsmk-datepicker>
            </div>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>Vertical Layout</h3>
              <span class="badge">Layout</span>
            </div>
            <p class="card-desc">Stacked calendars for vertical space.</p>
            <div class="inline-wrapper vertical-wrapper">
              <ngxsmk-datepicker
                [inline]="true"
                [calendarCount]="2"
                calendarLayout="vertical"
                [(ngModel)]="verticalValue"
              ></ngxsmk-datepicker>
            </div>
          </div>
        </div>
      </div>

      <div class="example-category">
        <h2 class="category-title">Validation & Constraints</h2>
        <div class="examples-grid">
          <div class="card demo-card">
            <div class="card-header">
              <h3>Min/Max Date</h3>
              <span class="badge">Bounds</span>
            </div>
            <p class="card-desc">Only allow selection within next 7 days.</p>
            <ngxsmk-datepicker
              [minDate]="today"
              [maxDate]="nextWeek"
              [(ngModel)]="constrainedValue"
              placeholder="Next 7 days only"
            ></ngxsmk-datepicker>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>Disabled Dates</h3>
              <span class="badge">Specific</span>
            </div>
            <p class="card-desc">Specific dates are disabled.</p>
            <ngxsmk-datepicker
              [disabledDates]="disabledDates"
              [(ngModel)]="disabledSpecificValue"
              placeholder="Try picking the 15th"
            ></ngxsmk-datepicker>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>Custom Logic</h3>
              <span class="badge">Function</span>
            </div>
            <p class="card-desc">Weekends are disabled.</p>
            <ngxsmk-datepicker
              [isInvalidDate]="isWeekend"
              [(ngModel)]="weekendValue"
              placeholder="No weekends allowed"
            ></ngxsmk-datepicker>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>Holidays</h3>
              <span class="badge">Provider</span>
            </div>
            <p class="card-desc">Highlighting holidays.</p>
            <ngxsmk-datepicker
              [holidayProvider]="holidayProvider"
              [(ngModel)]="holidayValue"
              placeholder="See Jan 1 or Dec 25"
            ></ngxsmk-datepicker>
          </div>
        </div>
      </div>

      <div class="example-category">
        <h2 class="category-title">Localization</h2>
        <div class="examples-grid">
          <div class="card demo-card">
            <div class="card-header">
              <h3>German (de-DE)</h3>
              <span class="badge">Locale</span>
            </div>
            <p class="card-desc">Monday start, German labels.</p>
            <ngxsmk-datepicker
              locale="de-DE"
              [(ngModel)]="localeDeValue"
              placeholder="Wählen Sie ein Datum"
            ></ngxsmk-datepicker>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>Japanese (ja-JP)</h3>
              <span class="badge">Locale</span>
            </div>
            <p class="card-desc">Year-Month-Day format.</p>
            <ngxsmk-datepicker
              locale="ja-JP"
              [(ngModel)]="localeJaValue"
              placeholder="日付を選択"
            ></ngxsmk-datepicker>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>Arabic (ar-SA)</h3>
              <span class="badge">RTL</span>
            </div>
            <p class="card-desc">RTL layout support.</p>
            <div dir="rtl">
              <ngxsmk-datepicker
                locale="ar-SA"
                dir="rtl"
                [(ngModel)]="localeArValue"
                placeholder="اختر التاريخ"
              ></ngxsmk-datepicker>
            </div>
          </div>
        </div>
      </div>

      <div class="example-category">
        <h2 class="category-title">Custom Templates</h2>
        <div class="examples-grid">
          <div class="card demo-card">
            <div class="card-header">
              <h3>Custom Day Cell</h3>
              <span class="badge">Template</span>
            </div>
            <p class="card-desc">Custom markers on specific days.</p>
            <ngxsmk-datepicker
              [(ngModel)]="templateValue"
              [dateTemplate]="customDateCell"
              placeholder="Check the 1st and 15th"
            ></ngxsmk-datepicker>

            <ng-template #customDateCell let-day let-selected="selected">
              <div class="custom-cell" [class.selected]="selected">
                <span class="day-num">{{ day.getDate() }}</span>
                <div class="dots" *ngIf="day.getDate() === 15"></div>
                <div class="tag" *ngIf="day.getDate() === 1">1st</div>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .examples-container {
        padding-bottom: 4rem;
      }
      .page-header {
        margin-bottom: 3rem;
      }

      .example-category {
        margin-bottom: 4rem;
      }

      .category-title {
        font-size: var(--font-size-2xl);
        margin-bottom: 1.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--color-border);
        color: var(--color-text-main);
      }

      .examples-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1rem;
      }

      .demo-card {
        background: var(--color-bg-sidebar);
        border-color: var(--color-border-light);
        padding: 1.5rem;
        transition:
          transform 0.2s,
          box-shadow 0.2s,
          border-color 0.2s;
        position: relative;

        &:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--color-border);
          z-index: 5;
        }

        &:focus-within {
          z-index: 100;
          border-color: var(--color-primary);
          box-shadow: var(--shadow-lg);
        }
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;

        h3 {
          margin: 0;
          font-size: var(--font-size-lg);
          color: var(--color-text-main);
        }
      }

      .badge {
        font-size: 0.65rem;
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: 0.05em;
        padding: 2px 6px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.05);
        color: var(--color-text-dim);
        border: 1px solid var(--color-border);
      }

      .card-desc {
        color: var(--color-text-muted);
        font-size: var(--font-size-sm);
        margin-bottom: 1.25rem;
        min-height: 2.5em; /* Align cards roughly */
      }

      .selection-box {
        margin-top: 1rem;
        padding: 0.75rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 6px;
        font-size: var(--font-size-sm);
        text-align: center;
        border: 1px dashed var(--color-border);

        code {
          color: var(--color-secondary);
          background: none;
          border: none;
        }
      }

      ngxsmk-datepicker {
        display: block;
        width: 100% !important;
        max-width: 100%;
        position: relative;
      }

      .inline-wrapper {
        display: flex;
        justify-content: center;
        background: var(--color-bg-card);
        padding: 1rem;
        border-radius: 12px;
        overflow-x: auto;
      }

      .vertical-wrapper {
        max-height: 400px;
        overflow-y: auto;
      }

      /* Custom Template Styles */
      .custom-cell {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        position: relative;
        width: 100%;
      }
      .dots {
        width: 4px;
        height: 4px;
        background: #ef4444;
        border-radius: 50%;
        position: absolute;
        bottom: 2px;
      }
      .tag {
        font-size: 8px;
        background: #3b82f6;
        color: white;
        padding: 1px 3px;
        border-radius: 2px;
        position: absolute;
        top: 0;
        right: 0;
        line-height: 1;
      }
    `,
  ],
})
export class ExamplesComponent {
  i18n = inject(I18nService);
  themeService = inject(ThemeService);

  // Models
  singleValue: Date | null = null;
  rangeValue: { start: Date; end: Date } | null = null;
  multipleValue: Date[] = [];
  monthValue: { start: Date; end: Date } | null = null;
  weekValue: { start: Date; end: Date } | null = null;
  yearValue: { start: Date; end: Date } | null = null;

  dateTimeValue: Date | null = null;
  dateTime24Value: Date | null = null;
  timeOnlyValue: Date | null = null;
  timeSecondsValue: Date | null = null;
  timeRangeValue: { start: Date; end: Date } | null = null;
  customFormatValue: Date | null = null;

  multiMonthValue: { start: Date; end: Date } | null = null;
  verticalValue: Date | null = null;
  syncScrollValue: { start: Date; end: Date } | null = null;
  animationValue: Date | null = null;
  noAnimValue: Date | null = null;
  darkThemeValue: Date | null = null;

  constrainedValue: Date | null = null;
  disabledSpecificValue: Date | null = null;
  weekendValue: Date | null = null;
  holidayValue: Date | null = null;

  localeDeValue: Date | null = null;
  localeJaValue: Date | null = null;
  localeArValue: Date | null = null;

  templateValue: Date | null = null;

  // Helpers
  today = new Date();
  nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  disabledDates = [
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
  ];

  isWeekend = (date: Date) => {
    const d = date.getDay();
    return d === 0 || d === 6;
  };

  holidayProvider: HolidayProvider = {
    isHoliday: (date: Date) => {
      const m = date.getMonth() + 1;
      const d = date.getDate();
      return (m === 1 && d === 1) || (m === 12 && d === 25);
    },
    getHolidayLabel: (date: Date) => {
      const m = date.getMonth() + 1;
      const d = date.getDate();
      if (m === 1 && d === 1) return 'New Year';
      if (m === 12 && d === 25) return 'Christmas';
      return null;
    },
  };
}
