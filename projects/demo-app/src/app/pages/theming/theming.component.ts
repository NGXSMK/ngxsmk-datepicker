import { Component, inject, ViewChild, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../i18n/i18n.service';
import { ThemeService } from '@tokiforge/angular';
import { NgxsmkDatepickerComponent, ThemeBuilderService, DatepickerTheme } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-theming',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxsmkDatepickerComponent],
  template: `
    <div class="animate-fade-in">
      <h1>{{ i18n.t().nav.customTheming }}</h1>
      <p class="text-lg">Full control over the visual identity of your datepicker using a powerful CSS variables system.</p>

      <h2>Dynamic Theming (ThemeBuilderService)</h2>
      <p>Use the <code>ThemeBuilderService</code> to dynamically generate and apply themes at runtime. Try it on the datepicker below—custom themes now perfectly style the popover even when it portals to the body on mobile devices!</p>
      
      <div class="card flex flex-col md:flex-row gap-xl mt-md mb-2xl">
        <div class="flex-1">
          <div class="theme-buttons flex gap-sm mb-lg flex-wrap">
            <button class="btn" [class.btn-primary]="currentTheme === 'ocean'" [class.btn-outline]="currentTheme !== 'ocean'" (click)="applyTheme('ocean')">Ocean</button>
            <button class="btn" [class.btn-primary]="currentTheme === 'forest'" [class.btn-outline]="currentTheme !== 'forest'" (click)="applyTheme('forest')">Forest</button>
            <button class="btn" [class.btn-primary]="currentTheme === 'sunset'" [class.btn-outline]="currentTheme !== 'sunset'" (click)="applyTheme('sunset')">Sunset</button>
            <button class="btn btn-outline" (click)="resetTheme()">Reset</button>
          </div>
          
          <div class="flex flex-col gap-sm" style="max-width: 300px;">
            <label class="text-sm font-bold" for="theming-datepicker">Select Date</label>
            <ngxsmk-datepicker 
              id="theming-datepicker"
              [(ngModel)]="dateValue" 
              [appendToBody]="true"
              [theme]="themeService.theme() === 'dark' ? 'dark' : 'light'">
            </ngxsmk-datepicker>
          </div>
        </div>
        <div class="flex-1">
          <pre><code class="text-main">const theme = {{ '{' }}
  colors: {{ '{' }}
    primary: '{{ themes[currentTheme || 'ocean'].colors!.primary }}',
    background: '{{ themes[currentTheme || 'ocean'].colors!.background }}',
    text: '{{ themes[currentTheme || 'ocean'].colors!.text }}',
    border: '{{ themes[currentTheme || 'ocean'].colors!.border }}'
  {{ '}' }},
  borderRadius: {{ '{' }} md: '{{ themes[currentTheme || 'ocean'].borderRadius!.md }}' {{ '}' }}
{{ '}' }};

themeBuilder.applyTheme(theme, datepickerEl);</code></pre>
        </div>
      </div>

      <div class="color-grid mt-xl">
        <div class="color-item" style="background: var(--color-primary)">
          <span>Primary</span>
          <code>#7C3AED</code>
        </div>
        <div class="color-item" style="background: var(--color-secondary)">
          <span>Secondary</span>
          <code>#06B6D4</code>
        </div>
      </div>

      <h2>Design Tokens</h2>
      <p>Override these variables in your global <code>styles.scss</code> to change the look and feel globally.</p>
      
      <div class="table-container card">
        <table>
          <thead>
            <tr>
              <th>Variable</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><code>--ngxsmk-primary</code></td><td>Main brand color for selection and highlights.</td></tr>
            <tr><td><code>--ngxsmk-bg-popover</code></td><td>Background color of the calendar dropdown.</td></tr>
            <tr><td><code>--ngxsmk-border-color</code></td><td>Border color for inputs and interactive elements.</td></tr>
            <tr><td><code>--ngxsmk-radius-main</code></td><td>Corner radius for the main container and buttons.</td></tr>
            <tr><td><code>--ngxsmk-font-family</code></td><td>Font used across the entire component.</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Glassmorphism UI</h2>
      <p>Achieve modern, translucent effects by combining background blur with transparency.</p>
      <div class="card glass-example mt-md">
        <pre><code class="text-main">.custom-glass {{ '{' }}
  --ngxsmk-bg-popover: rgba(15, 15, 15, 0.7);
  backdrop-filter: blur(12px);
{{ '}' }}</code></pre>
      </div>

      <h2>Tailwind CSS Integration</h2>
      <p>You can easily map Tailwind colors to the datepicker variables inside your <code>tailwind.config.js</code> or CSS layers.</p>
      <div class="card bg-sidebar">
        <pre><code class="text-main">&#64;layer base {{ '{' }}
  :root {{ '{' }}
    --ngxsmk-primary: theme('colors.indigo.600');
    --ngxsmk-radius-main: theme('borderRadius.lg');
  {{ '}' }}
{{ '}' }}</code></pre>
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

    .color-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: var(--space-sm);
      margin-bottom: var(--space-xl);
    }
    .color-item {
      height: 80px;
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 0.75rem;
      font-size: 0.75rem;
      span { font-weight: 700; color: white; margin-bottom: 2px; }
      code { background: rgba(0,0,0,0.2); border-radius: 4px; padding: 1px 4px; color: rgba(255,255,255,0.8); border: none; }
    }
    .table-container {
      margin: var(--space-md) 0;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      table { width: 100%; border-collapse: collapse; min-width: 400px; }
      th, td { padding: 0.8rem 1rem; text-align: left; font-size: 0.85rem; @media (min-width: 768px) { font-size: 0.9rem; } }
      th { border-bottom: 2px solid var(--color-border); color: var(--color-text-dim); }
      td { border-bottom: 1px solid var(--color-border); color: var(--color-text-muted); }
      tr:last-child td { border-bottom: none; }
      code { color: var(--color-secondary); background: none; padding: 0; }
    }
    .card {
      padding: var(--space-lg);
      @media (max-width: 480px) { padding: var(--space-md); }
      margin-bottom: var(--space-md);
    }
    pre { overflow-x: auto; margin: 0; }
    code { 
        white-space: pre; 
        font-size: var(--font-size-sm);
        @media (min-width: 480px) { font-size: var(--font-size-base); }
    }
    .glass-example {
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(6, 182, 212, 0.1));
      border: 1px solid var(--color-border-light);
    }
    .flex-wrap { flex-wrap: wrap; }
    .flex-1 { flex: 1 1 0%; }
    .flex-col { flex-direction: column; }
    .md\\:flex-row { @media (min-width: 768px) { flex-direction: row; } }
    .mb-2xl { margin-bottom: var(--space-2xl); }
  `]
})
export class ThemingComponent implements OnInit, OnDestroy {
  i18n = inject(I18nService);
  themeBuilder = inject(ThemeBuilderService);
  themeService = inject(ThemeService);

  dateValue = new Date();
  currentTheme: string | null = null;

  @ViewChild(NgxsmkDatepickerComponent, { read: ElementRef, static: true }) datepickerRef!: ElementRef;

  themes: Record<string, DatepickerTheme> = {
    ocean: {
      colors: {
        primary: '#0ea5e9',
        primaryContrast: '#ffffff',
        background: '#f0f9ff',
        text: '#0f172a',
        border: '#bae6fd',
        hover: '#e0f2fe'
      },
      borderRadius: { md: '12px' }
    },
    forest: {
      colors: {
        primary: '#10b981',
        primaryContrast: '#ffffff',
        background: '#ecfdf5',
        text: '#064e3b',
        border: '#a7f3d0',
        hover: '#d1fae5'
      },
      borderRadius: { md: '4px' }
    },
    sunset: {
      colors: {
        primary: '#f43f5e',
        primaryContrast: '#ffffff',
        background: '#fff1f2',
        text: '#881337',
        border: '#fecdd3',
        hover: '#ffe4e6'
      },
      borderRadius: { md: '24px' }
    }
  };

  applyTheme(themeKey: string) {
    this.currentTheme = themeKey;
    if (this.datepickerRef) {
      this.themeBuilder.applyTheme(this.themes[themeKey], this.datepickerRef.nativeElement);
    }
  }

  ngOnInit() {
    // Wait briefly for calendar initialization if needed, or apply synchronously if static
    setTimeout(() => {
      this.applyTheme('ocean');
    });
  }

  resetTheme() {
    this.currentTheme = null;
    if (this.datepickerRef) {
      this.themeBuilder.removeTheme(this.datepickerRef.nativeElement);
    }
  }

  ngOnDestroy() {
    this.resetTheme();
  }
}
