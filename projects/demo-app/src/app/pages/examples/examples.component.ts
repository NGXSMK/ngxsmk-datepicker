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
        <h2 class="category-title">{{ i18n.t().examples.categories.selectionModes }}</h2>
        <div class="examples-grid">
          <div class="card demo-card">
            <div class="card-header">
              <h3>{{ i18n.t().examples.modes.singleDate }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.default }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.modes.singleDesc }}</p>
            <ngxsmk-datepicker
              mode="single"
              [(ngModel)]="singleValue"
              [placeholder]="i18n.t().examples.placeholders.selectDate"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="singleValue">
              <code>{{ singleValue | date: 'mediumDate' }}</code>
            </div>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>{{ i18n.t().examples.modes.dateRange }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.range }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.modes.rangeDesc }}</p>
            <ngxsmk-datepicker
              mode="range"
              [(ngModel)]="rangeValue"
              [placeholder]="i18n.t().examples.placeholders.selectRange"
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
              <h3>{{ i18n.t().examples.modes.multipleDates }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.multiple }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.modes.multipleDesc }}</p>
            <ngxsmk-datepicker
              mode="multiple"
              [(ngModel)]="multipleValue"
              [placeholder]="i18n.t().examples.placeholders.pickMultiple"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="multipleValue.length">
              <code>{{ multipleValue.length }} {{ i18n.t().examples.status.datesSelected }}</code>
            </div>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>{{ i18n.t().examples.modes.monthSelection }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.month }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.modes.monthDesc }}</p>
            <ngxsmk-datepicker
              mode="month"
              [(ngModel)]="monthValue"
              [placeholder]="i18n.t().examples.placeholders.selectMonth"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="monthValue">
              <code>{{ monthValue.start | date: 'MMMM yyyy' }}</code>
            </div>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>{{ i18n.t().examples.modes.weekSelection }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.week }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.modes.weekDesc }}</p>
            <ngxsmk-datepicker
              mode="week"
              [(ngModel)]="weekValue"
              [placeholder]="i18n.t().examples.placeholders.selectWeek"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="weekValue">
              <code>{{ i18n.t().examples.status.weekOf }} {{ weekValue.start | date: 'shortDate' }}</code>
            </div>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>{{ i18n.t().examples.modes.yearSelection }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.year }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.modes.yearDesc }}</p>
            <ngxsmk-datepicker
              mode="year"
              [(ngModel)]="yearValue"
              [placeholder]="i18n.t().examples.placeholders.selectYear"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="yearValue">
              <code>{{ yearValue.start | date: 'yyyy' }}</code>
            </div>
          </div>
        </div>
      </div>

      <div class="example-category">
        <h2 class="category-title">{{ i18n.t().examples.categories.dateTime }}</h2>
        <div class="examples-grid">
          <div class="card demo-card">
            <div class="card-header">
              <h3>{{ i18n.t().examples.modes.dateTime }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.time }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.modes.dateTimeDesc }}</p>
            <ngxsmk-datepicker
              [showTime]="true"
              [(ngModel)]="dateTimeValue"
              [placeholder]="i18n.t().examples.placeholders.selectDateTime"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="dateTimeValue">
              <code>{{ dateTimeValue | date: 'short' }}</code>
            </div>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>{{ i18n.t().examples.modes.dateTime24 }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.time24 }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.modes.dateTime24Desc }}</p>
            <ngxsmk-datepicker
              [showTime]="true"
              [use24Hour]="true"
              [(ngModel)]="dateTime24Value"
              [placeholder]="i18n.t().examples.placeholders.select24h"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="dateTime24Value">
              <code>{{ dateTime24Value | date: 'medium' }}</code>
            </div>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>{{ i18n.t().examples.modes.timeOnly }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.timeOnly }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.modes.timeOnlyDesc }}</p>
            <ngxsmk-datepicker
              [timeOnly]="true"
              [(ngModel)]="timeOnlyValue"
              [placeholder]="i18n.t().examples.placeholders.selectTime"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="timeOnlyValue">
              <code>{{ timeOnlyValue | date: 'shortTime' }}</code>
            </div>
          </div>
          <div class="card demo-card">
            <div class="card-header">
              <h3>{{ i18n.t().examples.modes.timeSeconds }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.seconds }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.modes.timeSecondsDesc }}</p>
            <ngxsmk-datepicker
              [timeOnly]="true"
              [showSeconds]="true"
              [(ngModel)]="timeSecondsValue"
              [placeholder]="i18n.t().examples.placeholders.selectSeconds"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="timeSecondsValue">
              <code>{{ timeSecondsValue | date: 'mediumTime' }}</code>
            </div>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>{{ i18n.t().examples.modes.timeRange }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.new }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.modes.timeRangeDesc }}</p>
            <ngxsmk-datepicker
              [timeRangeMode]="true"
              [showTime]="true"
              [use24Hour]="true"
              [(ngModel)]="timeRangeValue"
              [placeholder]="i18n.t().examples.placeholders.selectTimeRange"
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
              <h3>{{ i18n.t().examples.modes.customFormat }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.new }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.modes.customFormatDesc }}</p>
            <ngxsmk-datepicker
              [dateFormatPattern]="'YYYY-MM-DD HH:mm'"
              [showTime]="true"
              [(ngModel)]="customFormatValue"
              [placeholder]="i18n.t().examples.placeholders.customFormat"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="customFormatValue">
              <code>{{ customFormatValue | date: 'medium' }}</code>
            </div>
          </div>
        </div>
      </div>

      <div class="example-category">
        <h2 class="category-title">{{ i18n.t().examples.categories.multiCalendar }}</h2>
        <div class="examples-grid">
          <div class="card demo-card">
            <div class="card-header">
              <h3>{{ i18n.t().examples.modes.syncScroll }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.new }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.modes.syncScrollDesc }}</p>
            <ngxsmk-datepicker
              mode="range"
              [calendarCount]="2"
              [syncScroll]="{ enabled: true, monthGap: 1 }"
              [(ngModel)]="syncScrollValue"
              [placeholder]="i18n.t().examples.placeholders.syncedLayout"
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
              <h3>{{ i18n.t().examples.modes.animations }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.new }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.modes.animationsDesc }}</p>
            <ngxsmk-datepicker
              [animationConfig]="{
                enabled: true,
                duration: 100,
                easing: 'ease-out',
              }"
              [(ngModel)]="animationValue"
              [placeholder]="i18n.t().examples.placeholders.fastAnimations"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="animationValue">
              <code>{{ animationValue | date: 'shortDate' }}</code>
            </div>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>{{ i18n.t().examples.modes.noAnimations }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.a11y }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.modes.noAnimationsDesc }}</p>
            <ngxsmk-datepicker
              [animationConfig]="{ enabled: false }"
              [(ngModel)]="noAnimValue"
              [placeholder]="i18n.t().examples.placeholders.noAnimations"
            ></ngxsmk-datepicker>
            <div class="selection-box" *ngIf="noAnimValue">
              <code>{{ noAnimValue | date: 'shortDate' }}</code>
            </div>
          </div>
        </div>
      </div>

      <div class="example-category">
        <h2 class="category-title">{{ i18n.t().examples.categories.visual }}</h2>
        <div class="examples-grid">
          <div class="card demo-card">
            <div class="card-header">
              <h3>{{ i18n.t().examples.modes.multiMonth }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.multiView }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.modes.multiMonthDesc }}</p>
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
              <h3>{{ i18n.t().examples.modes.vertical }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.layout }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.modes.verticalDesc }}</p>
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
        <h2 class="category-title">{{ i18n.t().examples.categories.validation }}</h2>
        <div class="examples-grid">
          <div class="card demo-card">
            <div class="card-header">
              <h3>{{ i18n.t().examples.modes.minMax }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.bounds }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.modes.minMaxDesc }}</p>
            <ngxsmk-datepicker
              [minDate]="today"
              [maxDate]="nextWeek"
              [(ngModel)]="constrainedValue"
              [placeholder]="i18n.t().examples.placeholders.next7Days"
            ></ngxsmk-datepicker>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>{{ i18n.t().examples.modes.disabledDates }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.specific }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.modes.disabledDatesDesc }}</p>
            <ngxsmk-datepicker
              [disabledDates]="disabledDates"
              [(ngModel)]="disabledSpecificValue"
              [placeholder]="i18n.t().examples.placeholders.try15th"
            ></ngxsmk-datepicker>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>{{ i18n.t().examples.modes.customLogic }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.function }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.modes.customLogicDesc }}</p>
            <ngxsmk-datepicker
              [isInvalidDate]="isWeekend"
              [(ngModel)]="weekendValue"
              [placeholder]="i18n.t().examples.placeholders.noWeekends"
            ></ngxsmk-datepicker>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>{{ i18n.t().examples.modes.holidays }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.provider }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.modes.holidaysDesc }}</p>
            <ngxsmk-datepicker
              [holidayProvider]="holidayProvider"
              [(ngModel)]="holidayValue"
              [placeholder]="i18n.t().examples.placeholders.seeHolidays"
            ></ngxsmk-datepicker>
          </div>
        </div>
      </div>

      <div class="example-category">
        <h2 class="category-title">{{ i18n.t().examples.categories.localization }}</h2>
        <div class="examples-grid">
          <div class="card demo-card">
            <div class="card-header">
              <h3>{{ i18n.t().examples.locales.german }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.locale }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.locales.germanDesc }}</p>
            <ngxsmk-datepicker
              locale="de-DE"
              [(ngModel)]="localeDeValue"
              [placeholder]="i18n.t().examples.placeholders.german"
            ></ngxsmk-datepicker>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>{{ i18n.t().examples.locales.japanese }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.locale }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.locales.japaneseDesc }}</p>
            <ngxsmk-datepicker
              locale="ja-JP"
              [(ngModel)]="localeJaValue"
              [placeholder]="i18n.t().examples.placeholders.japanese"
            ></ngxsmk-datepicker>
          </div>

          <div class="card demo-card">
            <div class="card-header">
              <h3>{{ i18n.t().examples.locales.arabic }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.rtl }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.locales.arabicDesc }}</p>
            <div dir="rtl">
              <ngxsmk-datepicker
                locale="ar-SA"
                dir="rtl"
                [(ngModel)]="localeArValue"
                [placeholder]="i18n.t().examples.placeholders.arabic"
              ></ngxsmk-datepicker>
            </div>
          </div>
        </div>
      </div>

      <div class="example-category">
        <h2 class="category-title">{{ i18n.t().examples.categories.templates }}</h2>
        <div class="examples-grid">
          <div class="card demo-card">
            <div class="card-header">
              <h3>{{ i18n.t().examples.modes.customTemplate }}</h3>
              <span class="badge">{{ i18n.t().examples.badges.template }}</span>
            </div>
            <p class="card-desc">{{ i18n.t().examples.modes.customTemplateDesc }}</p>
            <ngxsmk-datepicker
              [(ngModel)]="templateValue"
              [dateTemplate]="customDateCell"
              [placeholder]="i18n.t().examples.placeholders.check1st15th"
            ></ngxsmk-datepicker>

            <ng-template #customDateCell let-day let-selected="selected">
              <div class="custom-cell" [class.selected]="selected">
                <span class="day-num">{{ day.getDate() }}</span>
                <div class="dots" *ngIf="day.getDate() === 15"></div>
                <div class="tag" *ngIf="day.getDate() === 1">{{ i18n.t().examples.badges.first }}</div>
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
      if (m === 1 && d === 1) return this.i18n.t().advanced.holidayLabels.newYear;
      if (m === 12 && d === 25) return this.i18n.t().advanced.holidayLabels.christmas;
      return null;
    },
  };
}
