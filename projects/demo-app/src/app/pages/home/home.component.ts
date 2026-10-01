import { Component, inject, signal } from '@angular/core';
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
    <div class="home">
      <!-- HERO SECTION -->
      <section class="hero-section" aria-label="NGXSMK Datepicker Hero">
        <div class="hero-content">
          <!-- Release Badge -->
          <div class="version-badge">
            <span class="pulse-dot"></span>
            <span class="badge-tag">v3.0.6</span>
            <span class="badge-divider">·</span>
            <span class="badge-text">Angular 17-19+ & Zoneless Native</span>
          </div>

          <!-- Main Title -->
          <h1 class="hero-title">
            {{ i18n.t().home.heroTitle }}
          </h1>

          <p class="hero-lead">
            {{ i18n.t().home.heroLead }}
          </p>

          <!-- CTAs and Install Command -->
          <div class="hero-actions">
            <a class="btn btn-primary" routerLink="/installation">
              <span>{{ i18n.t().home.ctaBuild }}</span>
              <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
            <a class="btn btn-outline" routerLink="/playground">
              <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span>{{ i18n.t().home.ctaPro }}</span>
            </a>

            <!-- Quick Copy Box -->
            <div class="quick-install-box" (click)="copyInstallCommand()" role="button" tabindex="0" (keydown.enter)="copyInstallCommand()">
              <span class="install-prompt">$</span>
              <code class="install-cmd">npm i ngxsmk-datepicker</code>
              <button type="button" class="copy-trigger" [attr.aria-label]="hasCopiedInstall() ? 'Copied' : 'Copy command'">
                @if (hasCopiedInstall()) {
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                } @else {
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                }
              </button>
            </div>
          </div>

          <!-- Trust / Capability Pills -->
          <div class="trust-pills">
            <div class="trust-pill">
              <span class="check-icon">✓</span>
              <span>Signals Native</span>
            </div>
            <div class="trust-pill">
              <span class="check-icon">✓</span>
              <span>Zoneless Ready</span>
            </div>
            <div class="trust-pill">
              <span class="check-icon">✓</span>
              <span>WCAG 2.1 AA</span>
            </div>
            <div class="trust-pill">
              <span class="check-icon">✓</span>
              <span>Pure CSS Variables</span>
            </div>
          </div>
        </div>

        <!-- Interactive Live Showcase Card -->
        <div class="showcase-card">
          <!-- Window Header Bar -->
          <div class="showcase-bar">
            <div class="traffic-lights">
              <span class="light red"></span>
              <span class="light yellow"></span>
              <span class="light green"></span>
            </div>

            <!-- Segmented Mode Control -->
            <div class="mode-tabs" role="tablist" aria-label="Demo mode switcher">
              <button
                type="button"
                role="tab"
                class="tab-btn"
                [class.active]="demoMode === 'single'"
                [attr.aria-selected]="demoMode === 'single'"
                (click)="setDemoMode('single')"
              >
                {{ i18n.t().home.demoMode.single }}
              </button>
              <button
                type="button"
                role="tab"
                class="tab-btn"
                [class.active]="demoMode === 'range'"
                [attr.aria-selected]="demoMode === 'range'"
                (click)="setDemoMode('range')"
              >
                {{ i18n.t().home.demoMode.range }}
              </button>
              <button
                type="button"
                role="tab"
                class="tab-btn"
                [class.active]="demoMode === 'multiple'"
                [attr.aria-selected]="demoMode === 'multiple'"
                (click)="setDemoMode('multiple')"
              >
                {{ i18n.t().home.demoMode.multiple }}
              </button>
            </div>

            <div class="live-indicator">
              <span class="live-dot"></span>
              <span class="live-text">Interactive</span>
            </div>
          </div>

          <!-- Calendar Preview Stage -->
          <div class="showcase-stage">
            <ngxsmk-datepicker
              [(ngModel)]="demoValue"
              [mode]="demoMode"
              [inline]="true"
              [autoApplyClose]="false"
              [theme]="currentTheme"
            >
            </ngxsmk-datepicker>
          </div>

          <!-- Showcase Footer with Reactive Output & Snippet -->
          <div class="showcase-footer">
            <div class="output-preview">
              <span class="output-label">Selected:</span>
              <span class="output-val">{{ formattedValue }}</span>
            </div>
            <div class="snippet-box" (click)="copySnippet()" role="button" tabindex="0" (keydown.enter)="copySnippet()">
              <code>&lt;ngxsmk-datepicker mode="{{ demoMode }}" /&gt;</code>
              <button type="button" class="snippet-copy-btn" [attr.aria-label]="hasCopiedSnippet() ? 'Copied' : 'Copy snippet'">
                @if (hasCopiedSnippet()) {
                  <span class="copied-badge">Copied!</span>
                } @else {
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                }
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- BENTO GRID FEATURES -->
      <section class="bento-section" aria-labelledby="features-heading">
        <div class="section-header">
          <span class="section-tag">High-Performance Architecture</span>
          <h2 id="features-heading">{{ i18n.t().home.seoTitle }}</h2>
          <p class="section-sub">{{ i18n.t().home.seoText }}</p>
        </div>

        <div class="bento-grid">
          @for (f of features; track f.key) {
            <div class="bento-card" [class]="'bento-' + f.key">
              <div class="card-head">
                <div class="card-icon" [attr.data-icon]="f.key">
                  @switch (f.key) {
                    @case ('signals') {
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                      </svg>
                    }
                    @case ('zoneless') {
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    }
                    @case ('multiCalendar') {
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    }
                    @case ('a11y') {
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="5" r="2"></circle>
                        <path d="m4 11 4-2 4 1 4-1 4 2"></path>
                        <path d="M10 15v6"></path>
                        <path d="M14 15v6"></path>
                      </svg>
                    }
                    @case ('mobile') {
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                        <line x1="12" y1="18" x2="12.01" y2="18"></line>
                      </svg>
                    }
                    @case ('locales') {
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      </svg>
                    }
                  }
                </div>
                <span class="card-badge">{{ f.tag }}</span>
              </div>
              <h3 class="card-title">{{ i18n.t().home.features[f.key].title }}</h3>
              <p class="card-desc">{{ i18n.t().home.features[f.key].desc }}</p>
            </div>
          }
        </div>
      </section>

      <!-- COMPARISON MATRIX -->
      <section class="comparison-section">
        <div class="section-header">
          <span class="section-tag">Framework Benchmark</span>
          <h2>Why developers choose NGXSMK</h2>
          <p class="section-sub">Built from the ground up for modern Angular paradigms with zero legacy baggage.</p>
        </div>

        <div class="matrix-card">
          <div class="matrix-table-wrap">
            <table class="matrix-table">
              <thead>
                <tr>
                  <th scope="col">Capability</th>
                  <th scope="col" class="highlight-col">ngxsmk-datepicker</th>
                  <th scope="col">Angular Material</th>
                  <th scope="col">ngx-bootstrap</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="feature-col">Signals & Zoneless Support</td>
                  <td class="highlight-col"><span class="badge-yes">✅ Native signal outputs</span></td>
                  <td><span class="badge-mid">⚠️ Zone.js dependent</span></td>
                  <td><span class="badge-no">❌ Legacy CD only</span></td>
                </tr>
                <tr>
                  <td class="feature-col">Multi-Month Linked Calendars</td>
                  <td class="highlight-col"><span class="badge-yes">✅ 1-3 Linked calendars</span></td>
                  <td><span class="badge-mid">⚠️ Single month view</span></td>
                  <td><span class="badge-no">❌ Separate inputs</span></td>
                </tr>
                <tr>
                  <td class="feature-col">CSS Variable Customization</td>
                  <td class="highlight-col"><span class="badge-yes">✅ 30+ pure CSS tokens</span></td>
                  <td><span class="badge-mid">⚠️ Heavy Sass mixins</span></td>
                  <td><span class="badge-no">❌ Hardcoded styles</span></td>
                </tr>
                <tr>
                  <td class="feature-col">Adaptive Mobile Experience</td>
                  <td class="highlight-col"><span class="badge-yes">✅ Auto sheet modal</span></td>
                  <td><span class="badge-mid">⚠️ Requires MatDialog</span></td>
                  <td><span class="badge-no">❌ Overflow issues</span></td>
                </tr>
                <tr>
                  <td class="feature-col">Date Engine Flexibility</td>
                  <td class="highlight-col"><span class="badge-yes">✅ Native Date or Luxon</span></td>
                  <td><span class="badge-mid">⚠️ Custom DateAdapter</span></td>
                  <td><span class="badge-no">❌ Tight Moment lock-in</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- CTA BANNER -->
      <section class="cta-banner" aria-labelledby="cta-heading">
        <div class="cta-content">
          <h2 id="cta-heading">{{ i18n.t().common.readyToTransform }}</h2>
          <p class="cta-lead">{{ i18n.t().common.installToday }}</p>
          <div class="cta-actions">
            <a class="btn btn-primary" routerLink="/installation">Get Started Now</a>
            <a class="btn btn-outline" href="https://github.com/NGXSMK/ngxsmk-datepicker" target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
        <div class="cta-terminal" (click)="copyInstallCommand()" role="button" tabindex="0" (keydown.enter)="copyInstallCommand()">
          <div class="terminal-bar">
            <span class="term-dot red"></span>
            <span class="term-dot yellow"></span>
            <span class="term-dot green"></span>
            <span class="term-title">terminal</span>
          </div>
          <div class="terminal-body">
            <span class="term-prompt">$</span>
            <span class="term-code">npm install ngxsmk-datepicker</span>
            <button type="button" class="term-copy" [attr.aria-label]="hasCopiedInstall() ? 'Copied' : 'Copy command'">
              @if (hasCopiedInstall()) {
                <span class="term-copied">✓ Copied</span>
              } @else {
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              }
            </button>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .home {
        display: flex;
        flex-direction: column;
        gap: 4.5rem;
        padding-top: 0.5rem;
        padding-bottom: 3rem;
      }

      /* ================= HERO SECTION ================= */
      .hero-section {
        display: grid;
        grid-template-columns: 1.15fr 1fr;
        gap: 2.5rem;
        align-items: center;

        @media (max-width: 1024px) {
          grid-template-columns: 1fr;
          gap: 2rem;
        }
      }

      .hero-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      .version-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.35rem 0.85rem;
        border-radius: 9999px;
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        box-shadow: var(--shadow-sm);
        margin-bottom: 1.25rem;
        font-size: var(--font-size-xs);
        color: var(--color-text-muted);
        backdrop-filter: blur(12px);

        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
          animation: pulse-glow 2s infinite;
        }

        .badge-tag {
          font-weight: 700;
          color: var(--color-primary);
        }

        .badge-divider {
          opacity: 0.4;
        }

        .badge-text {
          font-weight: 500;
          color: var(--color-text-main);
        }
      }

      @keyframes pulse-glow {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(0.9); }
      }

      .hero-title {
        font-family: var(--font-family-display);
        font-size: clamp(2rem, 1.6rem + 2vw, 3.25rem);
        font-weight: 700;
        line-height: 1.15;
        letter-spacing: -0.035em;
        margin: 0 0 1.1rem;
        color: var(--color-text-main);
        max-width: 22ch;
      }

      .hero-lead {
        font-size: clamp(1rem, 0.95rem + 0.25vw, 1.15rem);
        line-height: 1.65;
        color: var(--color-text-muted);
        margin: 0 0 1.75rem;
        max-width: 44ch;
      }

      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.75rem;
        width: 100%;

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }

        @media (max-width: 560px) {
          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      }

      .btn-icon {
        flex-shrink: 0;
      }

      .quick-install-box {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: #0f172a;
        border: 1px solid #1e293b;
        border-radius: var(--radius-pill);
        padding: 0.55rem 0.95rem;
        font-family: var(--font-family-mono);
        font-size: 0.82rem;
        color: #f8fafc;
        cursor: pointer;
        transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        user-select: none;

        &:hover {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
        }

        .install-prompt {
          color: #818cf8;
          font-weight: 700;
        }

        .install-cmd {
          background: none !important;
          border: none !important;
          padding: 0 !important;
          color: #f8fafc !important;
        }

        .copy-trigger {
          background: none;
          border: none;
          padding: 0.15rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          cursor: pointer;

          &:hover {
            color: #ffffff;
          }
        }

        @media (max-width: 560px) {
          width: 100%;
          justify-content: space-between;
        }
      }

      .trust-pills {
        display: flex;
        flex-wrap: wrap;
        gap: 0.65rem 1.25rem;

        .trust-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: var(--font-size-xs);
          font-weight: 600;
          color: var(--color-text-muted);

          .check-icon {
            color: #10b981;
            font-weight: 800;
          }
        }
      }

      /* ================= SHOWCASE CARD ================= */
      .showcase-card {
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-xl);
        overflow: hidden;
        backdrop-filter: blur(16px);
        transition: transform var(--transition-normal), box-shadow var(--transition-normal);

        &:hover {
          box-shadow: 0 24px 48px -12px rgba(99, 102, 241, 0.18);
        }
      }

      .showcase-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1.15rem;
        background: var(--color-bg-elevated);
        border-bottom: 1px solid var(--color-border);
        gap: 0.5rem;
      }

      .traffic-lights {
        display: flex;
        gap: 6px;

        .light {
          width: 10px;
          height: 10px;
          border-radius: 50%;

          &.red { background: #ef4444; }
          &.yellow { background: #f59e0b; }
          &.green { background: #10b981; }
        }
      }

      .mode-tabs {
        display: flex;
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-pill);
        padding: 2px;
        gap: 2px;
      }

      .tab-btn {
        background: transparent;
        border: none;
        border-radius: var(--radius-pill);
        padding: 0.3rem 0.8rem;
        font-family: var(--font-family-body);
        font-size: var(--font-size-xs);
        font-weight: 600;
        color: var(--color-text-muted);
        cursor: pointer;
        transition: all var(--transition-fast);

        &:hover {
          color: var(--color-text-main);
        }

        &.active {
          background: var(--color-primary);
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(99, 102, 241, 0.35);
        }
      }

      .live-indicator {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: var(--font-size-xs);
        font-weight: 600;
        color: var(--color-text-muted);

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
        }

        @media (max-width: 440px) {
          display: none;
        }
      }

      .showcase-stage {
        padding: 1.75rem 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 370px;
        background: radial-gradient(ellipse at 50% 50%, rgba(99, 102, 241, 0.07) 0%, transparent 75%), var(--color-bg-card);

        ::ng-deep ngxsmk-datepicker {
          width: 100% !important;
          max-width: 380px;
          margin: 0 auto;
          --datepicker-radius-md: 12px;
          --datepicker-radius-lg: 16px;

          .ngxsmk-popover-container.ngxsmk-inline-container,
          .ngxsmk-calendar-container {
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
          }
        }
      }

      .showcase-footer {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.75rem 1.15rem;
        background: var(--color-bg-elevated);
        border-top: 1px solid var(--color-border);
      }

      .output-preview {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: var(--font-size-xs);

        .output-label {
          font-weight: 600;
          color: var(--color-text-muted);
        }

        .output-val {
          font-family: var(--font-family-mono);
          font-weight: 600;
          color: var(--brand-primary-dark);
          background: rgba(99, 102, 241, 0.08);
          border: 1px solid rgba(99, 102, 241, 0.2);
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-sm);
        }
      }

      .snippet-box {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: #0b0f19;
        border: 1px solid #1e293b;
        border-radius: var(--radius-md);
        padding: 0.35rem 0.65rem;
        font-family: var(--font-family-mono);
        font-size: 0.78rem;
        color: #f1f5f9;
        cursor: pointer;
        transition: border-color var(--transition-fast);

        &:hover {
          border-color: var(--color-primary);
        }

        code {
          background: none !important;
          border: none !important;
          padding: 0 !important;
          color: #f1f5f9 !important;
        }

        .snippet-copy-btn {
          background: none;
          border: none;
          padding: 0;
          display: flex;
          align-items: center;
          color: #94a3b8;
          cursor: pointer;

          &:hover {
            color: #ffffff;
          }
        }

        .copied-badge {
          color: #10b981;
          font-weight: 700;
          font-size: 0.72rem;
        }
      }

      /* ================= BENTO GRID SECTION ================= */
      .bento-section {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .section-header {
        max-width: 48rem;

        .section-tag {
          display: inline-block;
          font-size: var(--font-size-xs);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-primary);
          margin-bottom: 0.5rem;
        }

        h2 {
          font-family: var(--font-family-display);
          font-size: clamp(1.75rem, 1.4rem + 1.2vw, 2.35rem);
          font-weight: 700;
          letter-spacing: -0.025em;
          margin: 0 0 0.65rem;
          color: var(--color-text-main);
        }

        .section-sub {
          font-size: 1.05rem;
          line-height: 1.6;
          color: var(--color-text-muted);
          margin: 0;
        }
      }

      .bento-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1.25rem;

        @media (max-width: 960px) {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        @media (max-width: 580px) {
          grid-template-columns: 1fr;
        }
      }

      .bento-card {
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        transition: transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-fast);
        box-shadow: var(--shadow-sm);

        &:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-lg);
          border-color: rgba(99, 102, 241, 0.35);
        }
      }

      .card-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.25rem;
      }

      .card-icon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;

        &[data-icon='signals'] {
          background: rgba(99, 102, 241, 0.12);
          color: #6366f1;
        }
        &[data-icon='zoneless'] {
          background: rgba(16, 185, 129, 0.12);
          color: #10b981;
        }
        &[data-icon='multiCalendar'] {
          background: rgba(139, 92, 246, 0.12);
          color: #8b5cf6;
        }
        &[data-icon='a11y'] {
          background: rgba(245, 158, 11, 0.12);
          color: #f59e0b;
        }
        &[data-icon='mobile'] {
          background: rgba(244, 63, 94, 0.12);
          color: #f43f5e;
        }
        &[data-icon='locales'] {
          background: rgba(6, 182, 212, 0.12);
          color: #06b6d4;
        }
      }

      .card-badge {
        font-size: 0.72rem;
        font-weight: 600;
        padding: 0.2rem 0.6rem;
        border-radius: var(--radius-pill);
        background: var(--color-bg-elevated);
        border: 1px solid var(--color-border);
        color: var(--color-text-muted);
      }

      .card-title {
        font-family: var(--font-family-display);
        font-size: 1.15rem;
        font-weight: 600;
        letter-spacing: -0.015em;
        margin: 0 0 0.5rem;
        color: var(--color-text-main);
      }

      .card-desc {
        font-size: var(--font-size-sm);
        line-height: 1.55;
        color: var(--color-text-muted);
        margin: 0;
      }

      /* ================= COMPARISON MATRIX ================= */
      .comparison-section {
        display: flex;
        flex-direction: column;
        gap: 1.75rem;
      }

      .matrix-card {
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        overflow: hidden;
      }

      .matrix-table-wrap {
        overflow-x: auto;
      }

      .matrix-table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
        font-size: var(--font-size-sm);

        th, td {
          padding: 1.1rem 1.35rem;
          border-bottom: 1px solid var(--color-border);
          vertical-align: middle;
        }

        th {
          background: var(--color-bg-elevated);
          font-weight: 700;
          font-family: var(--font-family-display);
          color: var(--color-text-main);
          font-size: var(--font-size-xs);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        tr:last-child td {
          border-bottom: none;
        }

        .highlight-col {
          background: rgba(99, 102, 241, 0.05);
          font-weight: 600;
        }

        .feature-col {
          font-weight: 600;
          color: var(--color-text-main);
          white-space: nowrap;
        }

        .badge-yes {
          color: #059669;
          font-weight: 600;
        }

        .badge-mid {
          color: #b45309;
          font-weight: 600;
        }

        .badge-no {
          color: var(--color-text-dim);
          font-weight: 500;
        }
      }

      /* ================= CTA BANNER ================= */
      .cta-banner {
        position: relative;
        display: grid;
        grid-template-columns: 1.25fr 1fr;
        gap: 2rem;
        align-items: center;
        padding: 2.5rem;
        border-radius: var(--radius-xl);
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(245, 158, 11, 0.06) 100%), var(--color-bg-card);
        border: 1px solid var(--color-border);
        box-shadow: var(--shadow-xl);
        overflow: hidden;

        @media (max-width: 900px) {
          grid-template-columns: 1fr;
          padding: 1.75rem;
        }
      }

      .cta-content {
        h2 {
          font-family: var(--font-family-display);
          font-size: clamp(1.6rem, 1.3rem + 1vw, 2.2rem);
          font-weight: 700;
          letter-spacing: -0.025em;
          margin: 0 0 0.5rem;
          color: var(--color-text-main);
        }

        .cta-lead {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--color-text-muted);
          margin: 0 0 1.5rem;
          max-width: 44ch;
        }
      }

      .cta-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }
      }

      .cta-terminal {
        background: #0b0f19;
        border: 1px solid #1e293b;
        border-radius: var(--radius-lg);
        overflow: hidden;
        box-shadow: var(--shadow-md);
        cursor: pointer;
        transition: border-color var(--transition-fast), box-shadow var(--transition-fast);

        &:hover {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
        }
      }

      .terminal-bar {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 0.65rem 0.95rem;
        background: #111827;
        border-bottom: 1px solid #1f2937;

        .term-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;

          &.red { background: #ef4444; }
          &.yellow { background: #f59e0b; }
          &.green { background: #10b981; }
        }

        .term-title {
          margin-left: 0.5rem;
          font-family: var(--font-family-mono);
          font-size: 0.72rem;
          color: #94a3b8;
        }
      }

      .terminal-body {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.15rem;
        gap: 0.75rem;
        font-family: var(--font-family-mono);
        font-size: 0.85rem;

        .term-prompt {
          color: #818cf8;
          font-weight: 700;
        }

        .term-code {
          color: #f8fafc !important;
          font-weight: 500;
        }

        .term-copy {
          background: none;
          border: none;
          padding: 0.2rem;
          display: flex;
          align-items: center;
          color: #94a3b8;
          cursor: pointer;

          &:hover {
            color: #ffffff;
          }
        }

        .term-copied {
          color: #10b981;
          font-weight: 700;
          font-size: 0.75rem;
        }
      }
    `,
  ],
})
export class HomeComponent {
  themeService = inject(ThemeService);
  i18n = inject(I18nService);

  demoMode: 'single' | 'range' | 'multiple' = 'range';
  demoValue: Date | Date[] | { start: Date; end: Date } | null = {
    start: new Date(),
    end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };

  hasCopiedInstall = signal(false);
  hasCopiedSnippet = signal(false);

  features = [
    { key: 'signals' as const, tag: 'Reactivity' },
    { key: 'zoneless' as const, tag: 'Performance' },
    { key: 'multiCalendar' as const, tag: 'Synchronized' },
    { key: 'a11y' as const, tag: 'WCAG 2.1 AA' },
    { key: 'mobile' as const, tag: 'Adaptive' },
    { key: 'locales' as const, tag: 'i18n & RTL' },
  ];

  setDemoMode(mode: 'single' | 'range' | 'multiple') {
    this.demoMode = mode;
    if (mode === 'single') {
      this.demoValue = new Date();
    } else if (mode === 'range') {
      this.demoValue = {
        start: new Date(),
        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };
    } else {
      this.demoValue = [new Date()];
    }
  }

  get currentTheme(): 'light' | 'dark' {
    return this.themeService.theme() === 'dark' ? 'dark' : 'light';
  }

  get formattedValue(): string {
    if (!this.demoValue) return 'None selected';
    if (this.demoValue instanceof Date) {
      return this.demoValue.toLocaleDateString();
    }
    if (Array.isArray(this.demoValue)) {
      return `${this.demoValue.length} dates selected`;
    }
    if (typeof this.demoValue === 'object' && 'start' in this.demoValue && 'end' in this.demoValue) {
      const s = this.demoValue.start ? this.demoValue.start.toLocaleDateString() : '...';
      const e = this.demoValue.end ? this.demoValue.end.toLocaleDateString() : '...';
      return `${s} → ${e}`;
    }
    return '';
  }

  copyInstallCommand() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('npm install ngxsmk-datepicker');
      this.hasCopiedInstall.set(true);
      setTimeout(() => this.hasCopiedInstall.set(false), 2000);
    }
  }

  copySnippet() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`<ngxsmk-datepicker mode="${this.demoMode}" />`);
      this.hasCopiedSnippet.set(true);
      setTimeout(() => this.hasCopiedSnippet.set(false), 2000);
    }
  }
}
