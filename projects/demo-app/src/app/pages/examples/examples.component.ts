import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { RouterLink } from '@angular/router';
import { ThemeService } from '@tokiforge/angular';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-examples',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxsmkDatepickerComponent, RouterLink],
  template: `
    <div class="animate-fade-in">
      <h1>{{ i18n.t().nav.basicExamples }}</h1>
      <p class="text-lg">Common usage patterns for <code>ngxsmk-datepicker</code> components.</p>

      <section class="examples-grid">
        <div class="card demo-card">
          <h3>Single Selection</h3>
          <ngxsmk-datepicker mode="single" [(ngModel)]="singleValue" placeholder="Choose a date"></ngxsmk-datepicker>
          <div class="selection-box" *ngIf="singleValue">
            <code>{{ singleValue | date:'mediumDate' }}</code>
          </div>
        </div>

        <div class="card demo-card">
          <h3>Range Selection</h3>
          <ngxsmk-datepicker mode="range" [(ngModel)]="rangeValue" placeholder="Select range"></ngxsmk-datepicker>
          <div class="selection-box" *ngIf="rangeValue">
            <code>{{ rangeValue.start | date:'shortDate' }} - {{ rangeValue.end | date:'shortDate' }}</code>
          </div>
        </div>
      </section>

      <h1 class="mt-3xl">{{ i18n.t().examples.title }}</h1>
      <p class="text-lg">High-performance features for complex enterprise requirements.</p>

      <!-- Advanced Feature Showcase -->
      <div class="featured-example card">
        <div class="feature-header">
           <div class="badge">Featured Selection</div>
           <h2>{{ i18n.t().examples.dateTimeTitle }}</h2>
           <p>{{ i18n.t().examples.dateTimeLead }}</p>
        </div>
        
        <div class="feature-body grid-2">
           <div class="picker-panel">
             <ngxsmk-datepicker 
                [inline]="true" 
                [showTime]="true" 
                [(ngModel)]="dateTimeValue"
                [theme]="themeService.theme() === 'dark' ? 'dark' : 'light'">
             </ngxsmk-datepicker>
           </div>
           <div class="specs-panel">
             <div class="spec-item">
                <span class="label">Accuracy</span>
                <span class="value">Millisecond Precision</span>
             </div>
             <div class="spec-item">
                <span class="label">Selected Output</span>
                <code class="val-code">{{ dateTimeValue | date:'medium' }}</code>
             </div>
             <div class="spec-item">
                <span class="label">Zoneless Flow</span>
                <span class="value text-success">Active</span>
             </div>
           </div>
        </div>
      </div>

      <section class="examples-grid mt-2xl">
        <div class="card demo-card">
          <h3>{{ i18n.t().examples.multiMonthTitle }}</h3>
          <p class="text-sm mb-lg">{{ i18n.t().examples.multiMonthLead }}</p>
          <div class="flex justify-center overflow-x-auto">
            <ngxsmk-datepicker 
                [inline]="true" 
                [calendarCount]="2" 
                mode="range" 
                [(ngModel)]="multiMonthValue">
            </ngxsmk-datepicker>
          </div>
        </div>

        <div class="card demo-card">
          <h3>{{ i18n.t().examples.constraintsTitle }}</h3>
          <p class="text-sm mb-lg">{{ i18n.t().examples.constraintsLead }}</p>
          <ngxsmk-datepicker 
            [minDate]="today" 
            [maxDate]="nextMonth" 
            [(ngModel)]="constrainedValue"
            placeholder="Limits: Today to Next Month">
          </ngxsmk-datepicker>
          <div class="selection-box mt-md" *ngIf="constrainedValue">
            <code>{{ constrainedValue | date:'fullDate' }}</code>
          </div>
        </div>
      </section>

      <div class="tip">
        <strong>{{ i18n.t().common.enterpriseReady }}:</strong> Looking for RTL support or custom providers? Check out the <a routerLink="/advanced">Advanced Features</a> section.
      </div>
    </div>
  `,
  styles: [`
    .examples-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem; @media (max-width: 900px) { grid-template-columns: 1fr; } }
    .demo-card { background: var(--color-bg-sidebar); border-color: var(--color-border-light); padding: 2rem; h3 { margin-top: 0; margin-bottom: 0.5rem; font-size: 1.1rem; } }
    .selection-box { margin-top: 1rem; padding-top: 0.75rem; border-top: 1px dashed var(--color-border); font-size: 0.85rem; }
    
    .featured-example {
      padding: 0;
      overflow: hidden;
      margin-top: 2.5rem;
      background: linear-gradient(135deg, var(--color-bg-card), var(--color-bg-secondary));
      
      .feature-header { padding: 1.5rem; border-bottom: 1px solid var(--color-border); @media (min-width: 768px) { padding: 3rem; } }
      .badge { display: inline-block; padding: 4px 10px; background: rgba(124, 58, 237, 0.15); color: var(--color-primary-light); border-radius: 6px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; }
      h2 { margin: 0 0 0.5rem; border: none; padding: 0; font-size: 1.75rem; @media (min-width: 768px) { font-size: 2rem; } }
      p { margin: 0; opacity: 0.8; font-size: 0.95rem; }
      
      .feature-body { padding: 1.5rem; gap: 2rem; @media (min-width: 768px) { padding: 3rem; gap: 4rem; } }
      .grid-2 { display: grid; grid-template-columns: 1fr; align-items: start; @media (max-width: 1024px) { grid-template-columns: 1fr; } @media (min-width: 1025px) { grid-template-columns: auto 1fr; } }
      
      .specs-panel {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        padding-top: 1rem;
      }
      .spec-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        .label { font-size: 0.7rem; font-weight: 800; color: var(--color-text-dim); text-transform: uppercase; }
        .value { font-size: 1.1rem; font-weight: 600; color: var(--color-text-main); }
        .val-code { background: rgba(0,0,0,0.3); border: 1px solid var(--color-border); padding: 0.75rem 1rem; border-radius: 8px; color: var(--color-secondary); font-size: 1rem; }
      }
    }
  `]
})
export class ExamplesComponent {
  i18n = inject(I18nService);
  themeService = inject(ThemeService);

  singleValue: Date | null = null;
  rangeValue: { start: Date; end: Date } | null = null;
  dateTimeValue: Date = new Date();
  multiMonthValue: { start: Date; end: Date } | null = null;
  constrainedValue: Date | null = null;

  today = new Date();
  nextMonth = new Date(new Date().setMonth(new Date().getMonth() + 1));
}
