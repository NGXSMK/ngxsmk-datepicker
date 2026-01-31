import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxsmkDatepickerComponent],
  template: `
    <div class="animate-fade-in">
        <div class="playground-hero">
          <h1>{{ i18n.t().playground.title }}</h1>
          <p class="text-lg">{{ i18n.t().playground.lead }}</p>
        </div>
      
      <div class="playground-layout mt-2xl">
        <aside class="config-panel card">
          <h3 class="config-title">{{ i18n.t().playground.configTitle }}</h3>
          
          <div class="config-group">
            <span class="group-label">{{ i18n.t().playground.selectionMode }}</span>
            <div class="config-item">
              <select [(ngModel)]="mode">
                <option value="single">{{ i18n.t().playground.singleDate }}</option>
                <option value="range">{{ i18n.t().playground.dateRange }}</option>
                <option value="multiple">{{ i18n.t().playground.multipleDates }}</option>
                <option value="week">{{ i18n.t().playground.weekSelection }}</option>
                <option value="month">{{ i18n.t().playground.monthSelection }}</option>
                <option value="year">{{ i18n.t().playground.yearSelection }}</option>
              </select>
            </div>
            <div class="config-item">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="inline">
                {{ i18n.t().playground.inlineMode }}
              </label>
            </div>
          </div>

          <div class="config-group">
            <span class="group-label">{{ i18n.t().playground.functionalBehavior }}</span>
            <div class="config-item">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="allowTyping">
                {{ i18n.t().playground.allowTyping }}
              </label>
            </div>
            <div class="config-item">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showCalendarButton">
                {{ i18n.t().playground.showIcon }}
              </label>
            </div>
            <div class="config-item">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="useNativePicker">
                {{ i18n.t().playground.nativePicker }}
              </label>
            </div>
          </div>

          <div class="config-group">
            <span class="group-label">{{ i18n.t().playground.multiCalendar }}</span>
            <div class="config-item">
              <label for="calendarCount">{{ i18n.t().playground.calendarCount }} (1-3)</label>
              <input type="number" id="calendarCount" [(ngModel)]="calendarCount" min="1" max="3">
            </div>
            <div class="config-item" *ngIf="calendarCount > 1">
              <label for="calendarLayout">{{ i18n.t().playground.layout }}</label>
              <select id="calendarLayout" [(ngModel)]="calendarLayout">
                <option value="horizontal">{{ i18n.t().playground.horizontal }}</option>
                <option value="vertical">{{ i18n.t().playground.vertical }}</option>
                <option value="auto">{{ i18n.t().playground.auto }}</option>
              </select>
            </div>
          </div>

          <div class="config-group">
            <span class="group-label">{{ i18n.t().playground.timeLocales }}</span>
            <div class="config-item">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showTime">
                {{ i18n.t().playground.showTime }}
              </label>
            </div>
            <div class="config-item" *ngIf="showTime">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showSeconds">
                {{ i18n.t().playground.showSeconds }}
              </label>
            </div>
            <div class="config-item">
              <label for="activeLocale">{{ i18n.t().playground.locale }}</label>
              <select id="activeLocale" [(ngModel)]="locale">
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="de-DE">German</option>
                <option value="ar-SA">Arabic (RTL)</option>
                <option value="he-IL">Hebrew (RTL)</option>
                <option value="ja-JP">Japanese</option>
              </select>
            </div>
          </div>

          <div class="config-group">
            <span class="group-label">{{ i18n.t().playground.theming }}</span>
            <div class="config-item">
              <select [(ngModel)]="theme">
                <option value="light">{{ i18n.t().playground.lightTheme }}</option>
                <option value="dark">{{ i18n.t().playground.darkTheme }}</option>
              </select>
            </div>
          </div>

          <button class="btn btn-outline reset-btn" (click)="reset()">{{ i18n.t().playground.reset }}</button>
        </aside>

        <main class="preview-panel card">
          <div class="preview-header">
             <div class="value-chip" *ngIf="value">{{ i18n.t().playground.value }}: <code>{{ value | json }}</code></div>
             <div class="value-chip" *ngIf="!value">{{ i18n.t().playground.noSelection }}</div>
          </div>
          <div class="preview-canvas">
            <ngxsmk-datepicker 
              [mode]="mode" 
              [inline]="inline"
              [locale]="locale"
              [showTime]="showTime"
              [use24Hour]="use24Hour"
              [showSeconds]="showSeconds"
              [minuteInterval]="minuteInterval"
              [theme]="theme"
              [dir]="direction"
              [allowTyping]="allowTyping"
              [showCalendarButton]="showCalendarButton"
              [calendarCount]="calendarCount"
              [calendarLayout]="calendarLayout"
              [useNativePicker]="useNativePicker"
              [(ngModel)]="value">
            </ngxsmk-datepicker>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .playground-layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 2rem;
    }
    
    .config-panel {
      padding: 1.25rem;
      position: sticky;
      top: 100px;
      height: fit-content;
      @media (max-width: 900px) { padding: 1rem; }
      @media (max-width: 480px) { padding: var(--space-md) var(--space-sm); }
    }

    .config-title {
      font-size: var(--font-size-lg);
      margin: 0 0 var(--space-md);
      color: var(--color-text-main);
    }

    .config-group {
      margin-bottom: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .group-label {
      font-size: var(--font-size-xs);
      font-weight: 800;
      text-transform: uppercase;
      color: var(--color-text-dim);
      letter-spacing: 0.1em;
    }

    .config-item {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      
      label { font-size: var(--font-size-sm); color: var(--color-text-muted); }
      
      select, input {
        background: var(--color-bg-sidebar);
        border: 1px solid var(--color-border);
        color: var(--color-text-main);
        padding: 0.65rem 0.75rem;
        border-radius: var(--radius-sm);
        font-family: inherit;
        font-size: var(--font-size-sm);
        outline: none;
        width: 100%;
        transition: var(--transition-base);
        &:focus { border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2); }
      }
    }

    .checkbox-label {
      display: flex;
      flex-direction: row !important;
      align-items: center !important;
      gap: 0.6rem !important;
      cursor: pointer;
      user-select: none;
      font-weight: 500;
      
      input[type="checkbox"] {
        width: 16px;
        height: 16px;
        margin: 0;
        cursor: pointer;
        accent-color: var(--color-primary);
      }
    }

    .preview-panel {
      min-height: 500px;
      padding: 0;
      display: flex;
      flex-direction: column;
      background: radial-gradient(circle at center, rgba(139, 92, 246, 0.03) 0%, transparent 70%);
      /* Remove overflow hidden to allow popover to bleed out */
    }

    .preview-header {
      padding: 1rem;
      border-bottom: 1px solid var(--color-border);
      background: rgba(0,0,0,0.1);
      display: flex;
      justify-content: center;
      z-index: 10;
    }

    .value-chip {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      code { color: var(--color-primary-light); }
    }

    .preview-canvas {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      position: relative;
      overflow: visible;
      @media (min-width: 480px) { padding: 1.5rem 1rem; }
      @media (min-width: 768px) { padding: 3rem; }
      
      ngxsmk-datepicker {
         display: block;
         width: 100% !important;
         max-width: 100%;
      }
    }

    .reset-btn { width: 100%; justify-content: center; margin-top: 1rem; }
    
    @media (max-width: 900px) {
      .playground-hero { text-align: center; }
      .playground-layout { grid-template-columns: 1fr; gap: 1rem; }
      .config-panel { position: static; order: 2; padding: 1rem; }
      .preview-panel { order: 1; min-height: 400px; border-radius: 0; border-left: none; border-right: none; }
    }

    @media (max-width: 640px) {
      .preview-panel { margin: 0; }
      .preview-header { padding: 0.75rem; }
      .value-chip { font-size: 0.65rem; }
    }
  `]
})
export class PlaygroundComponent {
  i18n = inject(I18nService);
  mode: 'single' | 'range' | 'multiple' | 'week' | 'month' | 'quarter' | 'year' = 'single';
  direction: 'ltr' | 'rtl' = 'ltr';
  inline: boolean | 'always' | 'auto' = false;
  locale = 'en-US';
  showTime = false;
  use24Hour = false;
  showSeconds = false;
  minuteInterval = 1;
  theme: 'light' | 'dark' = 'dark';
  allowTyping = false;
  showCalendarButton = true;
  calendarCount = 1;
  calendarLayout: 'horizontal' | 'vertical' | 'auto' = 'horizontal';
  useNativePicker = false;
  weekStart: number | null = null;
  value: Date | { start: Date; end: Date } | Date[] | null = null;

  reset() {
    this.mode = 'single';
    this.direction = 'ltr';
    this.inline = false;
    this.locale = 'en-US';
    this.showTime = false;
    this.use24Hour = false;
    this.showSeconds = false;
    this.minuteInterval = 1;
    this.theme = 'dark';
    this.allowTyping = false;
    this.showCalendarButton = true;
    this.calendarCount = 1;
    this.calendarLayout = 'horizontal';
    this.useNativePicker = false;
    this.weekStart = null;
    this.value = null;
  }
}
