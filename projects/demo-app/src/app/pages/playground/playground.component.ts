import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxsmkDatepickerComponent],
  template: `
    <div class="animate-fade-in">
      <div class="flex justify-between items-center mb-xl">
        <div>
          <h1>Playground</h1>
          <p class="text-lg">Tweak properties and see how the datepicker behaves in real-time.</p>
        </div>
      </div>
      
      <div class="playground-layout mt-2xl">
        <aside class="config-panel card">
          <h3 class="config-title">Configurations</h3>
          
          <div class="config-group">
            <span class="group-label">Selection Mode</span>
            <div class="config-item">
              <select [(ngModel)]="mode">
                <option value="single">Single Date</option>
                <option value="range">Date Range</option>
                <option value="multiple">Multiple Dates</option>
                <option value="week">Week Selection</option>
                <option value="month">Month Selection</option>
                <option value="year">Year Selection</option>
              </select>
            </div>
            <div class="config-item">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="inline">
                Inline Mode
              </label>
            </div>
          </div>

          <div class="config-group">
            <span class="group-label">Functional Behavior</span>
            <div class="config-item">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="allowTyping">
                Allow Direct Typing
              </label>
            </div>
            <div class="config-item">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showCalendarButton">
                Show Icon Button
              </label>
            </div>
            <div class="config-item">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="useNativePicker">
                Use Native Mobile Picker
              </label>
            </div>
          </div>

          <div class="config-group">
            <span class="group-label">Multi-Calendar Layout</span>
            <div class="config-item">
              <label for="calendarCount">Calendar Count (1-3)</label>
              <input type="number" id="calendarCount" [(ngModel)]="calendarCount" min="1" max="3">
            </div>
            <div class="config-item" *ngIf="calendarCount > 1">
              <label for="calendarLayout">Layout</label>
              <select id="calendarLayout" [(ngModel)]="calendarLayout">
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>

          <div class="config-group">
            <span class="group-label">Time & Locales</span>
            <div class="config-item">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showTime">
                Show Time Picker
              </label>
            </div>
            <div class="config-item" *ngIf="showTime">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showSeconds">
                Show Seconds
              </label>
            </div>
            <div class="config-item">
              <label for="activeLocale">Locale</label>
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
            <span class="group-label">Theming</span>
            <div class="config-item">
              <select [(ngModel)]="theme">
                <option value="light">Light Theme</option>
                <option value="dark">Dark Theme</option>
              </select>
            </div>
          </div>

          <button class="btn btn-outline reset-btn" (click)="reset()">Reset Defaults</button>
        </aside>

        <main class="preview-panel card">
          <div class="preview-header">
             <div class="value-chip" *ngIf="value">Value: <code>{{ value | json }}</code></div>
             <div class="value-chip" *ngIf="!value">No selection</div>
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
      padding: 1.5rem;
      position: sticky;
      top: 100px;
      height: fit-content;
    }

    .config-group {
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .group-label {
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      color: var(--color-text-dim);
      letter-spacing: 0.1em;
    }

    .config-item {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      
      label { font-size: 0.85rem; color: var(--color-text-muted); }
      
      select, input {
        background: var(--color-bg-sidebar);
        border: 1px solid var(--color-border);
        color: var(--color-text-main);
        padding: 0.5rem;
        border-radius: var(--radius-sm);
        font-family: inherit;
        outline: none;
        &:focus { border-color: var(--color-primary); }
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
      font-size: 0.75rem;
      color: var(--color-text-muted);
      code { color: var(--color-primary-light); }
    }

    .preview-canvas {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      position: relative;
      @media (max-width: 768px) { padding: 1.5rem; }
      
      ngxsmk-datepicker {
         display: block;
      }
    }

    .reset-btn { width: 100%; justify-content: center; margin-top: 1rem; }
    
    @media (max-width: 900px) {
      .playground-layout { grid-template-columns: 1fr; }
      .config-panel { position: static; }
    }
  `]
})
export class PlaygroundComponent {
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
