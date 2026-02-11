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
          <h1>
            {{ i18n.t().home.heroTitle }} <br />
            <span class="gradient-text">{{ i18n.t().home.heroSubtitle }}</span>
          </h1>
          <p class="hero-lead">
            {{ i18n.t().home.heroLead }}
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" routerLink="/installation">
              {{ i18n.t().home.ctaBuild }}
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path d="M5 12h14m-7-7l7 7-7 7"></path>
              </svg>
            </button>
            <button class="btn btn-outline btn-lg" routerLink="/playground">
              {{ i18n.t().home.ctaPro }}
            </button>
          </div>
        </div>

        <div class="hero-preview card">
          <div class="preview-header">
            <div class="dots flex gap-xs">
              <span></span><span></span><span></span>
            </div>
            <div class="preview-controls flex gap-sm">
              <button
                class="mode-btn"
                [class.active]="demoMode === 'single'"
                (click)="setDemoMode('single')"
              >
                {{ i18n.t().home.demoMode.single }}
              </button>
              <button
                class="mode-btn"
                [class.active]="demoMode === 'range'"
                (click)="setDemoMode('range')"
              >
                {{ i18n.t().home.demoMode.range }}
              </button>
              <button
                class="mode-btn"
                [class.active]="demoMode === 'multiple'"
                (click)="setDemoMode('multiple')"
              >
                {{ i18n.t().home.demoMode.multiple }}
              </button>
            </div>
          </div>
          <div class="preview-body">
            <div class="picker-container">
              <ngxsmk-datepicker
                [(ngModel)]="demoValue"
                [mode]="demoMode"
                [inline]="true"
                [theme]="themeService.theme() === 'dark' ? 'dark' : 'light'"
              >
              </ngxsmk-datepicker>
            </div>

            <div class="preview-footer mt-lg pt-md">
              <div class="flex justify-between items-center mb-sm">
                <span class="text-xs font-bold uppercase text-dim">{{
                  i18n.t().home.implementation
                }}</span>
                <span class="text-xs text-secondary">{{
                  i18n.t().home.signalOptimized
                }}</span>
              </div>
              <pre
                class="demo-code"
              ><code>&lt;ngxsmk-datepicker mode="{{ demoMode }}"&gt;&lt;/ngxsmk-datepicker&gt;</code></pre>
            </div>
          </div>
        </div>
      </section>

      <div class="seo-statement text-center mb-2xl">
        <span class="pill">{{ i18n.t().common.enterpriseReady }}</span>
        <h2 class="text-3xl">{{ i18n.t().home.seoTitle }}</h2>
        <p class="text-dim max-w-2xl mx-auto">{{ i18n.t().home.seoText }}</p>
      </div>

      <section class="features-section">
        <div class="features-grid">
          @for (f of features; track f.key) {
            <div class="feature-card">
              <div class="icon-box" [innerHTML]="f.icon"></div>
              <h3>{{ i18n.t().home.features[f.key].title }}</h3>
              <p>{{ i18n.t().home.features[f.key].desc }}</p>
            </div>
          }
        </div>
      </section>

      <section class="code-cta card mt-3xl">
        <div class="cta-inner">
          <div class="cta-text">
            <h2>{{ i18n.t().common.readyToTransform }}</h2>
            <p>{{ i18n.t().common.installToday }}</p>
          </div>
          <div class="cta-code">
            <pre><code>npm install ngxsmk-datepicker@2.1.3</code></pre>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
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
        gap: var(--space-3xl);
        align-items: center;
        min-height: 40vh;
        margin-bottom: var(--space-3xl);

        @media (max-width: 1024px) {
          grid-template-columns: 1fr;
          text-align: center;
          gap: var(--space-xl);
          margin-bottom: var(--space-2xl);
        }

        @media (max-width: 480px) {
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
        }

        h1 {
          margin-bottom: var(--space-md);
          br {
            display: none;
            @media (min-width: 1025px) {
              display: block;
            }
          }
        }
      }

      .badge-wrapper {
        margin-bottom: 1.5rem;
        @media (max-width: 1024px) {
          display: flex;
          justify-content: center;
        }
        @media (max-width: 480px) {
          margin-bottom: 1rem;
        }
      }

      .version-badge {
        padding: 6px 14px;
        @media (max-width: 480px) {
          padding: 4px 10px;
          font-size: 0.75rem;
        }
        background: linear-gradient(
          to right,
          rgba(124, 58, 237, 0.1),
          rgba(6, 182, 212, 0.1)
        );
        border: 1px solid rgba(124, 58, 237, 0.2);
        border-radius: 100px;
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--color-primary-light);
        letter-spacing: 0.02em;
      }

      .hero-lead {
        font-size: var(--font-size-lg);
        line-height: 1.6;
        margin-bottom: var(--space-xl);
        color: var(--color-text-muted);
        max-width: 55ch;
        @media (max-width: 1024px) {
          margin-left: auto;
          margin-right: auto;
          font-size: var(--font-size-base);
        }
      }

      .hero-actions {
        display: flex;
        gap: var(--space-md);
        @media (max-width: 1024px) {
          justify-content: center;
        }
        @media (max-width: 640px) {
          flex-direction: column;
          width: 100%;
          max-width: none;
          margin: 0;
          padding: 0 1rem;
        }
      }

      .hero-preview {
        padding: 0;
        overflow: hidden;
        box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: #0f172a;
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        border-radius: 24px;
        position: relative;
        @media (max-width: 480px) {
          border-radius: 0;
          margin-left: calc(-1 * var(--space-sm));
          margin-right: calc(-1 * var(--space-sm));
          border-left: none;
          border-right: none;
        }
      }

      .preview-header {
        padding: 1rem 1.5rem;
        background: rgba(30, 41, 59, 0.5);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .dots {
        display: flex;
        gap: 8px;
        span {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          &:nth-child(1) { background: #ff5f56; }
          &:nth-child(2) { background: #ffbd2e; }
          &:nth-child(3) { background: #27c93f; }
        }
      }

      .preview-controls {
        display: flex;
        gap: 0.5rem;
      }

      .preview-body {
        padding: 2rem;
        @media (max-width: 768px) {
          padding: 1rem;
        }
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
      }

      .picker-container {
        display: flex;
        justify-content: center;
        ::ng-deep ngxsmk-datepicker {
          width: 100% !important;
          max-width: 400px;
          --datepicker-background: transparent;
          --datepicker-border-color: transparent;
          --datepicker-shadow-md: none;
          --datepicker-shadow-lg: none;

          .ngxsmk-popover-container.ngxsmk-inline-container,
          .ngxsmk-calendar-container {
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
            padding: 0 !important;
          }
          
          .ngxsmk-header {
            margin-bottom: 1.5rem !important;
          }

          .ngxsmk-nav-button, .ngxsmk-select-display {
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            background: rgba(255, 255, 255, 0.03) !important;
          }
        }
      }


      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 1.5rem;
        @media (max-width: 480px) {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 768px) {
          gap: 2rem;
        }
      }

      .feature-card {
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        padding: var(--space-xl) var(--space-lg);
        @media (max-width: 480px) {
          padding: var(--space-lg) var(--space-md);
        }
        border-radius: var(--radius-lg);
        transition: var(--transition-smooth);
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(
            to right,
            transparent,
            var(--color-primary-light),
            transparent
          );
          opacity: 0.15;
          transition: 0.4s;
        }

        &:hover {
          background: var(--color-bg-elevated);
          transform: translateY(-12px);
          border-color: var(--color-primary);
          box-shadow: var(--shadow-lg);

          &::before {
            opacity: 1;
            height: 4px;
          }
          .icon-box {
            transform: scale(1.1) rotate(5deg);
            box-shadow: 0 8px 16px rgba(124, 58, 237, 0.2);
          }
        }

        h3 {
          margin-top: var(--space-md);
          margin-bottom: var(--space-xs);
          font-size: var(--font-size-2xl);
          letter-spacing: -0.02em;
        }
        p {
          font-size: var(--font-size-base);
          color: var(--color-text-muted);
          margin-bottom: 0;
          line-height: 1.6;
        }
      }

      .icon-box {
        width: 54px;
        height: 54px;
        @media (min-width: 768px) {
          width: 64px;
          height: 64px;
        }
        background: linear-gradient(
          135deg,
          var(--color-primary),
          var(--color-primary-dark)
        );
        border-radius: 16px;
        @media (min-width: 768px) {
          border-radius: 20px;
        }
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        transition: var(--transition-smooth);
        svg {
          width: 28px;
          height: 28px;
          @media (min-width: 768px) {
            width: 32px;
            height: 32px;
          }
          stroke-width: 2.5;
        }
      }

      .code-cta {
        margin-top: var(--space-3xl);
        @media (min-width: 768px) {
          margin-top: 10rem;
        }
        padding: var(--space-2xl) var(--space-lg);
        @media (min-width: 768px) {
          padding: 5rem 4rem;
        }
        background: linear-gradient(
          135deg,
          rgba(124, 58, 237, 0.08) 0%,
          rgba(6, 182, 212, 0.08) 100%
        );
        border: 1px solid var(--color-border-light);
        border-radius: var(--radius-xl);

        h2 {
          font-size: var(--font-size-2xl);
          @media (min-width: 768px) {
            font-size: var(--font-size-3xl);
          }
          margin-bottom: var(--space-sm);
          letter-spacing: -0.03em;
          line-height: 1.2;
        }
        p {
          font-size: var(--font-size-base);
          @media (min-width: 768px) {
            font-size: var(--font-size-lg);
          }
          color: var(--color-text-muted);
          margin-bottom: 0;
          max-width: 45ch;
          @media (max-width: 900px) {
            margin: 0 auto;
          }
        }
      }

      .cta-inner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--space-xl);
        @media (max-width: 900px) {
          flex-direction: column;
          text-align: center;
          gap: var(--space-lg);
        }
      }

      .cta-code {
        background: var(--color-bg-code);
        padding: var(--space-md) var(--space-lg);
        @media (max-width: 480px) {
          padding-inline: 2rem;
        }
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
        width: 100%;
        max-width: 100%;
        overflow-x: auto;
        code {
          color: var(--color-secondary);
          background: none;
          padding: 0;
          font-size: var(--font-size-base);
          white-space: nowrap;
        }
        @media (min-width: 768px) {
          padding: 1rem;
          width: auto;
          code {
            font-size: 0.8rem;
          }
        }
      }

      .mode-btn {
        padding: 0.35rem 0.6rem;
        border-radius: 8px;
        font-size: var(--font-size-xs);
        @media (min-width: 480px) {
          padding: 0.4rem 0.8rem;
        }
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        background: transparent;
        border: 1px solid transparent;
        color: var(--color-text-dim);
        cursor: pointer;
        transition: all 0.2s;
        &:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }
        &.active {
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
          border-color: rgba(255, 255, 255, 0.2);
          color: #fff;
          box-shadow: 0 8px 16px rgba(124, 58, 237, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
        }
      }

      .preview-footer {
        width: 100%;
        padding: 1rem;
        @media (max-width: 480px) {
          padding-inline: 2rem;
        }
        box-sizing: border-box;
        @media (min-width: 768px) {
          padding: 0;
        }
      }

      .demo-code {
        margin: 0;
        background: rgba(0, 0, 0, 0.2);
        padding: 0.75rem;
        border-radius: 8px;
        font-size: var(--font-size-xs);
        @media (min-width: 768px) {
          font-size: var(--font-size-sm);
        }
        border: 1px solid rgba(255, 255, 255, 0.03);
        overflow-x: auto;
        code {
          color: var(--color-secondary);
          padding: 0;
          background: none;
          white-space: pre;
        }
      }

      .btn-lg {
        padding: 1rem 1.5rem;
        font-size: var(--font-size-lg);
        @media (min-width: 768px) {
          padding: 1.15rem 2.25rem;
        }
      }
      .gradient-text {
        background: linear-gradient(
          135deg,
          var(--color-text-main) 20%,
          var(--color-secondary) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .text-3xl {
        font-size: var(--font-size-3xl);
      }
      .mx-auto {
        margin-left: auto;
        margin-right: auto;
      }
      .max-w-2xl {
        max-width: 42rem;
      }
    `,
  ],
})
export class HomeComponent {
  themeService = inject(ThemeService);
  i18n = inject(I18nService);
  demoMode: 'single' | 'range' | 'multiple' = 'range';
  demoValue: Date | Date[] | { start: Date; end: Date } | null = [
    new Date(),
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  ];

  setDemoMode(mode: 'single' | 'range' | 'multiple') {
    this.demoMode = mode;
    if (mode === 'single') {
      this.demoValue = new Date();
    } else if (mode === 'range') {
      this.demoValue = [
        new Date(),
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ];
    } else {
      this.demoValue = [new Date()];
    }
  }

  features = [
    {
      key: 'signals' as const,
      icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>',
    },
    {
      key: 'zoneless' as const,
      icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>',
    },
    {
      key: 'multiCalendar' as const,
      icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>',
    },
    {
      key: 'a11y' as const,
      icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>',
    },
    {
      key: 'mobile' as const,
      icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>',
    },
    {
      key: 'locales' as const,
      icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"></path></svg>',
    },
  ];
}
