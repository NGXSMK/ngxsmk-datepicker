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
    <div class="home">
      <section class="board-hero" aria-label="NGXSMK DatePicker">
        <div class="board-copy">
          <p class="brand">NGXSMK</p>
          <h1>{{ i18n.t().home.heroTitle }}</h1>
          <p class="lead">{{ i18n.t().home.heroLead }}</p>
          <div class="actions">
            <a class="btn btn-primary" routerLink="/installation">{{ i18n.t().home.ctaBuild }}</a>
            <a class="btn btn-outline" routerLink="/playground">{{ i18n.t().home.ctaPro }}</a>
          </div>
        </div>

        <div class="board-panel">
          <div class="panel-rail">
            <span class="rail-mark">DEP</span>
            <div class="modes" role="tablist" aria-label="Demo selection mode">
              <button
                type="button"
                role="tab"
                class="mode"
                [class.active]="demoMode === 'single'"
                [attr.aria-selected]="demoMode === 'single'"
                (click)="setDemoMode('single')"
              >
                {{ i18n.t().home.demoMode.single }}
              </button>
              <button
                type="button"
                role="tab"
                class="mode"
                [class.active]="demoMode === 'range'"
                [attr.aria-selected]="demoMode === 'range'"
                (click)="setDemoMode('range')"
              >
                {{ i18n.t().home.demoMode.range }}
              </button>
              <button
                type="button"
                role="tab"
                class="mode"
                [class.active]="demoMode === 'multiple'"
                [attr.aria-selected]="demoMode === 'multiple'"
                (click)="setDemoMode('multiple')"
              >
                {{ i18n.t().home.demoMode.multiple }}
              </button>
            </div>
            <span class="rail-code">{{ demoMode | uppercase }}</span>
          </div>

          <div class="calendar-band">
            <ngxsmk-datepicker
              [(ngModel)]="demoValue"
              [mode]="demoMode"
              [inline]="true"
              [autoApplyClose]="false"
              theme="light"
            >
            </ngxsmk-datepicker>
          </div>

          <pre class="snippet" tabindex="0"><code>&lt;ngxsmk-datepicker mode="{{ demoMode }}" /&gt;</code></pre>
        </div>
      </section>

      <section class="brief" aria-labelledby="why-heading">
        <h2 id="why-heading">{{ i18n.t().home.seoTitle }}</h2>
        <p>{{ i18n.t().home.seoText }}</p>
      </section>

      <section class="lanes" aria-labelledby="cap-heading">
        <h2 id="cap-heading">Built for real Angular apps</h2>
        <ul class="lane-list">
          @for (f of features; track f.key) {
            <li>
              <h3>{{ i18n.t().home.features[f.key].title }}</h3>
              <p>{{ i18n.t().home.features[f.key].desc }}</p>
            </li>
          }
        </ul>
      </section>

      <section class="gate" aria-labelledby="install-heading">
        <div>
          <h2 id="install-heading">{{ i18n.t().common.readyToTransform }}</h2>
          <p>{{ i18n.t().common.installToday }}</p>
        </div>
        <pre class="install-cmd" tabindex="0"><code>npm install ngxsmk-datepicker@3.0.6</code></pre>
      </section>
    </div>
  `,
  styles: [
    `
      .home {
        padding-top: 0.15rem;
      }

      .board-hero {
        display: flex;
        flex-direction: column;
        gap: 1.75rem;
        margin-bottom: 3rem;
      }

      .board-copy {
        max-width: 40rem;
        animation: board-in 0.4s ease both;
      }

      .brand {
        font-family: var(--font-family-display);
        font-size: clamp(3rem, 2.4rem + 3vw, 4.5rem);
        font-weight: 700;
        letter-spacing: 0.04em;
        line-height: 0.9;
        text-transform: uppercase;
        color: var(--asphalt);
        margin: 0 0 0.85rem;
        border-left: 6px solid var(--signal);
        padding-left: 0.75rem;
      }

      .board-copy h1 {
        font-family: var(--font-family-body);
        font-size: clamp(1.15rem, 1.05rem + 0.4vw, 1.35rem);
        font-weight: 500;
        line-height: 1.4;
        margin: 0 0 0.75rem;
        max-width: 34ch;
        border: none;
        padding: 0;
        letter-spacing: 0;
        text-transform: none;
        color: var(--color-text-main);
      }

      .lead {
        font-size: var(--font-size-base);
        line-height: 1.55;
        color: var(--color-text-muted);
        max-width: 42ch;
        margin: 0 0 1.35rem;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.55rem;

        .btn {
          width: auto;
          text-decoration: none;
        }

        @media (max-width: 480px) {
          .btn {
            width: 100%;
          }
        }
      }

      .board-panel {
        background: var(--chalk);
        border: 1px solid var(--color-border);
        border-top: 3px solid var(--signal);
        animation: board-in 0.45s ease 0.06s both;
      }

      @keyframes board-in {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .board-copy,
        .board-panel {
          animation: none;
        }
      }

      .panel-rail {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.55rem 0.85rem;
        background: var(--asphalt);
        color: #f2f4f7;
      }

      .rail-mark {
        font-family: var(--font-family-display);
        font-size: 0.85rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        color: var(--signal);
      }

      .modes {
        display: flex;
        flex: 1;
        gap: 0.2rem;
        justify-content: center;
      }

      .mode {
        border: 1px solid transparent;
        background: transparent;
        padding: 0.35rem 0.7rem;
        font-family: var(--font-family-display);
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #9aa3b0;
        cursor: pointer;

        &.active {
          color: #12161c;
          background: var(--signal);
          border-color: var(--signal);
        }
      }

      .rail-code {
        font-family: var(--font-family-mono);
        font-size: 0.72rem;
        letter-spacing: 0.04em;
        color: #9aa3b0;
        text-transform: uppercase;
      }

      .calendar-band {
        padding: 1.75rem 1rem 1.5rem;
        display: flex;
        justify-content: center;
        min-height: 360px;
        background:
          linear-gradient(90deg, color-mix(in srgb, var(--signal) 10%, transparent) 0 4px, transparent 4px),
          var(--chalk);

        ::ng-deep ngxsmk-datepicker {
          width: 100% !important;
          max-width: 400px;
          --datepicker-primary-color: #151920;
          --datepicker-primary-contrast: #ffffff;
          --datepicker-range-background: #fff3cd;
          --datepicker-background: #ffffff;
          --datepicker-text-color: #151920;
          --datepicker-subtle-text-color: #6b7380;
          --datepicker-border-color: transparent;
          --datepicker-hover-background: #f4f6f9;
          --ngxsmk-color-primary: #151920;
          --ngxsmk-color-on-primary: #ffffff;
          --ngxsmk-color-range-bg: #fff3cd;

          .ngxsmk-popover-container.ngxsmk-inline-container,
          .ngxsmk-calendar-container {
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
          }
        }
      }

      .snippet {
        margin: 0;
        padding: 0.75rem 1rem;
        border-top: 1px solid var(--color-border);
        background: var(--color-bg-code);
        font-family: var(--font-family-mono);
        font-size: 0.8rem;
        color: var(--code-text);
        overflow-x: auto;

        code {
          background: none;
          border: none;
          padding: 0;
          color: inherit;
        }
      }

      .brief {
        margin-bottom: 2.75rem;
        max-width: 52ch;
        padding-top: 0.5rem;
        border-top: 1px solid var(--color-border);

        h2 {
          margin-top: 1.25rem;
          border: none;
          padding: 0;
          font-family: var(--font-family-display);
          font-weight: 600;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        p {
          margin: 0;
        }
      }

      .lanes {
        margin-bottom: 2.75rem;

        h2 {
          margin-top: 0;
          border: none;
          padding: 0;
          margin-bottom: 1rem;
          font-family: var(--font-family-display);
          font-weight: 600;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }
      }

      .lane-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0;
        border-top: 1px solid var(--color-border);

        @media (max-width: 900px) {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        @media (max-width: 560px) {
          grid-template-columns: 1fr;
        }

        li {
          padding: 1.15rem 1rem 1.15rem 0;
          border-bottom: 1px solid var(--color-border);
          border-right: 1px solid var(--color-border);

          &:nth-child(3n) {
            border-right: none;
            padding-right: 0;
          }

          @media (max-width: 900px) {
            &:nth-child(3n) {
              border-right: 1px solid var(--color-border);
              padding-right: 1rem;
            }

            &:nth-child(2n) {
              border-right: none;
              padding-right: 0;
            }
          }

          @media (max-width: 560px) {
            border-right: none !important;
            padding-right: 0;
          }
        }

        h3 {
          margin: 0 0 0.35rem;
          font-family: var(--font-family-display);
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          border: none;
          padding: 0;
        }

        p {
          margin: 0;
          font-size: var(--font-size-sm);
          max-width: none;
        }
      }

      .gate {
        display: grid;
        grid-template-columns: 1.15fr 1fr;
        gap: 1.25rem;
        align-items: center;
        padding: 1.35rem 1.4rem;
        border: 1px solid var(--color-border);
        border-left: 4px solid var(--signal);
        background: var(--color-bg-card);

        @media (max-width: 800px) {
          grid-template-columns: 1fr;
        }

        h2 {
          margin: 0 0 0.35rem;
          border: none;
          padding: 0;
          font-family: var(--font-family-display);
          font-size: var(--font-size-xl);
          font-weight: 600;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        p {
          margin: 0;
          font-size: var(--font-size-sm);
        }
      }

      .install-cmd {
        margin: 0;
        padding: 0.9rem 1rem;
        background: var(--color-bg-code);
        font-family: var(--font-family-mono);
        font-size: 0.85rem;
        color: var(--code-text);
        overflow-x: auto;

        code {
          background: none;
          border: none;
          padding: 0;
          color: inherit;
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

  features = [
    { key: 'signals' as const },
    { key: 'zoneless' as const },
    { key: 'multiCalendar' as const },
    { key: 'a11y' as const },
    { key: 'mobile' as const },
    { key: 'locales' as const },
  ];
}
