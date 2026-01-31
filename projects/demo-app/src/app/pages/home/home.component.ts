import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { ThemeService } from '@tokiforge/angular';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, NgxsmkDatepickerComponent],
  template: `
    <div class="home-container animate-fade-in">
      <section class="hero-section">
        <div class="hero-text">
          <div class="badge-wrapper">
            <span class="version-badge">{{ i18n.t().home.heroBadge }}</span>
          </div>
          <h1>{{ i18n.t().home.heroTitle }} <br> <span class="gradient-text">{{ i18n.t().home.heroSubtitle }}</span></h1>
          <p class="hero-lead">
            {{ i18n.t().home.heroLead }}
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" routerLink="/installation">
              {{ i18n.t().home.ctaBuild }}
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14m-7-7l7 7-7 7"></path></svg>
            </button>
            <button class="btn btn-outline btn-lg" routerLink="/playground">{{ i18n.t().home.ctaPro }}</button>
          </div>
        </div>

        <div class="hero-preview card">
          <div class="preview-header">
            <div class="dots flex gap-xs"><span></span><span></span><span></span></div>
            <div class="preview-controls flex gap-sm">
              <button class="mode-btn" [class.active]="demoMode === 'single'" (click)="setDemoMode('single')">Single</button>
              <button class="mode-btn" [class.active]="demoMode === 'range'" (click)="setDemoMode('range')">Range</button>
              <button class="mode-btn" [class.active]="demoMode === 'multiple'" (click)="setDemoMode('multiple')">Multiple</button>
            </div>
          </div>
          <div class="preview-body">
            <div class="picker-container">
              <ngxsmk-datepicker 
                [(ngModel)]="demoValue" 
                [mode]="demoMode" 
                [inline]="true"
                [theme]="themeService.theme() === 'dark' ? 'dark' : 'light'">
              </ngxsmk-datepicker>
            </div>
            
            <div class="preview-footer mt-lg pt-md border-t border-dashed">
              <div class="flex justify-between items-center mb-sm">
                <span class="text-xs font-bold uppercase text-dim">Implementation</span>
                <span class="text-xs text-secondary">Signal Optimized</span>
              </div>
              <pre class="demo-code"><code>&lt;ngxsmk-datepicker mode="{{ demoMode }}"&gt;&lt;/ngxsmk-datepicker&gt;</code></pre>
            </div>
          </div>
        </div>
      </section>

      <div class="seo-statement text-center mb-3xl">
        <span class="pill">{{ i18n.t().common.enterpriseReady }}</span>
        <h2 class="text-3xl">{{ i18n.t().home.seoTitle }}</h2>
        <p class="text-dim max-w-2xl mx-auto">{{ i18n.t().home.seoText }}</p>
      </div>

      <section class="features-section">
        <div class="features-grid">
          @for (f of features; track f.title) {
            <div class="feature-card">
              <div class="icon-box" [innerHTML]="f.icon"></div>
              <h3>{{ f.title }}</h3>
              <p>{{ f.desc }}</p>
            </div>
          }
        </div>
      </section>

      <section class="code-cta card mt-3xl">
        <div class="cta-inner">
          <div class="cta-text">
            <h2>Ready to transform your Angular project?</h2>
            <p>Install the best-in-class datepicker today and experience the difference.</p>
          </div>
          <div class="cta-code">
            <pre><code>npm install ngxsmk-datepicker@2.0.8</code></pre>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      padding-top: 2rem;
    }

    .pill {
        display: inline-block;
        padding: 4px 12px;
        background: rgba(6, 182, 212, 0.1);
        color: var(--color-secondary);
        border-radius: 99px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 1rem;
    }

    .hero-section {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 4rem;
      align-items: center;
      min-height: 50vh;
      margin-bottom: 8rem;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 3rem;
        margin-bottom: 4rem;
      }
    }

    .badge-wrapper {
      margin-bottom: 1.5rem;
      @media (max-width: 1024px) { display: flex; justify-content: center; }
    }

    .version-badge {
      padding: 6px 14px;
      background: linear-gradient(to right, rgba(124, 58, 237, 0.1), rgba(6, 182, 212, 0.1));
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 100px;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--color-primary-light);
      letter-spacing: 0.02em;
    }

    .hero-lead {
      font-size: 1.25rem;
      line-height: 1.7;
      margin-bottom: 3.5rem;
      color: var(--color-text-muted);
      max-width: 55ch;
      @media (max-width: 1024px) { margin-left: auto; margin-right: auto; }
    }

    .hero-actions {
      display: flex;
      gap: 1.5rem;
      @media (max-width: 1024px) { justify-content: center; }
      @media (max-width: 640px) { flex-direction: column; width: 100%; max-width: 320px; margin: 0 auto; }
    }

    .hero-preview {
      padding: 0;
      overflow: hidden;
      box-shadow: 0 40px 100px -20px rgba(0,0,0,0.8);
      border: 1px solid var(--color-border);
      background: var(--color-bg-sidebar);
      border-radius: var(--radius-xl);
    }

    .preview-header {
      padding: 0.75rem 1rem;
      @media (min-width: 768px) { padding: 1.25rem 2rem; }
      background: var(--color-bg-secondary);
      border-bottom: 1px solid var(--color-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dots {
      display: flex;
      gap: 8px;
      span { width: 10px; height: 10px; border-radius: 50%; background: var(--color-border); }
    }

    .preview-body { 
        padding: 0; 
        @media (min-width: 768px) { padding: 2.5rem; }
        background: radial-gradient(circle at top right, rgba(124, 58, 237, 0.05), transparent);
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .picker-container {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 0.5rem 0;
        @media (min-width: 768px) { padding: 1rem 0; }
        ngxsmk-datepicker {
            width: auto;
            max-width: 100%;
        }
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      @media (min-width: 768px) { gap: 2rem; }
    }

    .feature-card {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      padding: 3.5rem 2.5rem;
      border-radius: var(--radius-lg);
      transition: var(--transition-smooth);
      position: relative;
      overflow: hidden;

      &::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(to right, transparent, var(--color-primary-light), transparent);
          opacity: 0.15;
          transition: 0.4s;
      }

      &:hover {
        background: var(--color-bg-elevated);
        transform: translateY(-12px);
        border-color: var(--color-primary);
        box-shadow: var(--shadow-lg);
        
        &::before { opacity: 1; height: 4px; }
        .icon-box { transform: scale(1.1) rotate(5deg); box-shadow: 0 8px 16px rgba(124, 58, 237, 0.2); }
      }

      h3 { margin-top: 1.75rem; margin-bottom: 1rem; font-size: 1.5rem; letter-spacing: -0.02em; }
      p { font-size: 1.05rem; color: var(--color-text-muted); margin-bottom: 0; line-height: 1.6; }
    }

    .icon-box {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: var(--transition-smooth);
      svg { width: 32px; height: 32px; stroke-width: 2.5; }
    }

    .code-cta {
      margin-top: 6rem;
      @media (min-width: 768px) { margin-top: 12rem; }
      padding: 3rem 1.5rem;
      @media (min-width: 768px) { padding: 5rem 4rem; }
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%);
      border: 1px solid var(--color-border-light);
      border-radius: var(--radius-xl);
    }

    .cta-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 3rem;
      @media (max-width: 900px) { flex-direction: column; text-align: center; }
    }

    .cta-code {
      background: var(--color-bg-code);
      padding: 1.25rem 2.5rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
      code { color: var(--color-secondary); background: none; padding: 0; font-size: 1.1rem; }
    }

    .mode-btn {
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      color: var(--color-text-dim);
      cursor: pointer;
      transition: all 0.2s;
      &:hover { background: rgba(255,255,255,0.08); }
      &.active { 
        background: var(--color-primary); 
        border-color: var(--color-primary); 
        color: #fff;
        box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
      }
    }

    .demo-code {
        margin: 0;
        background: rgba(0,0,0,0.2);
        padding: 0.75rem;
        border-radius: 8px;
        font-size: 0.75rem;
        @media (min-width: 768px) { font-size: 0.85rem; }
        border: 1px solid rgba(255,255,255,0.03);
        overflow-x: auto;
        code { color: var(--color-secondary); padding: 0; background: none; white-space: pre; }
    }

    .btn-lg { padding: 1.15rem 2.25rem; font-size: 1.1rem; }
    .gradient-text {
      background: linear-gradient(135deg, var(--color-text-main) 20%, var(--color-secondary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .text-3xl { font-size: 2.25rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .max-w-2xl { max-width: 42rem; }
  `]
})
export class HomeComponent {
  themeService = inject(ThemeService);
  i18n = inject(I18nService);
  demoMode: 'single' | 'range' | 'multiple' = 'range';
  demoValue: Date | Date[] | { start: Date; end: Date } | null = [new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)];

  setDemoMode(mode: 'single' | 'range' | 'multiple') {
    this.demoMode = mode;
    if (mode === 'single') {
      this.demoValue = new Date();
    } else if (mode === 'range') {
      this.demoValue = [new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)];
    } else {
      this.demoValue = [new Date()];
    }
  }

  features = [
    {
      title: 'Signals Powered',
      desc: 'Built with the latest Angular Signals for ultra-fast, fine-grained reactivity and minimal change detection.',
      icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>'
    },
    {
      title: 'Zoneless Ready',
      desc: 'Engineered for the future of Angular. Operates seamlessly without zone.js for peak performance.',
      icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>'
    },
    {
      title: 'Multi-Calendar Layouts',
      desc: 'Effortlessly display multiple calendars (up to 12) with horizontal or vertical orientations.',
      icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>'
    },
    {
      title: 'Full A11y & Keyboard',
      desc: 'Complete keyboard navigation and WAI-ARIA compliance for a truly inclusive user experience.',
      icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>'
    },
    {
      title: 'Mobile Optimized',
      desc: 'Responsive design with native picker support on mobile devices for smooth touch interaction.',
      icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>'
    },
    {
      title: 'RTL & Locales',
      desc: 'Built-in support for right-to-left languages and international date/time formatting.',
      icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"></path></svg>'
    }
  ];
}
