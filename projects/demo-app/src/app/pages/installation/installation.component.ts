import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-installation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-fade-in">
      <h1>{{ i18n.t().installation.title }}</h1>
      <p class="text-lg">{{ i18n.t().installation.lead }}</p>

      <h2>{{ i18n.t().installation.npmTitle }}</h2>
      <p>{{ i18n.t().installation.npmLead }}</p>
      
      <div class="code-window">
        <div class="window-header">
          <div class="dot red"></div>
          <div class="dot yellow"></div>
          <div class="dot green"></div>
          <div class="window-title">bash</div>
        </div>
        <pre><code class="text-main"><span class="token-function">npm install</span> ngxsmk-datepicker@<span class="token-number">2.1.9</span></code></pre>
      </div>

      <div class="tip">
        <strong>{{ i18n.t().installation.note.split(':')[0] }}:</strong> {{ i18n.t().installation.note.split(':')[1] }}
      </div>

      <h2>{{ i18n.t().installation.altTitle }}</h2>
      <p>{{ i18n.t().installation.altLead }}</p>
      <div class="code-window">
        <div class="window-header">
          <div class="dot red"></div>
          <div class="dot yellow"></div>
          <div class="dot green"></div>
          <div class="window-title">bash</div>
        </div>
        <pre><code class="text-main"><span class="token-function">yarn add</span> ngxsmk-datepicker@<span class="token-number">2.1.9</span>
<span class="token-function">pnpm add</span> ngxsmk-datepicker@<span class="token-number">2.1.9</span>
<span class="token-function">bun add</span> ngxsmk-datepicker@<span class="token-number">2.1.9</span></code></pre>
      </div>
      <p>
        <a href="https://github.com/NGXSMK/ngxsmk-datepicker/blob/main/docs/INSTALLATION.md" target="_blank" rel="noopener noreferrer" class="link">{{ i18n.t().installation.moreLink }}</a>
      </p>

      <h2>{{ i18n.t().installation.importTitle }}</h2>
      <p>{{ i18n.t().installation.importLead }}</p>

      <div class="code-window">
        <div class="window-header">
          <div class="dot red"></div>
          <div class="dot yellow"></div>
          <div class="dot green"></div>
          <div class="window-title">app.component.ts</div>
        </div>
        <pre><code class="text-main"><span class="token-keyword">import</span> {{ '{' }} <span class="token-class">NgxsmkDatepickerComponent</span> {{ '}' }} <span class="token-keyword">from</span> <span class="token-string">'ngxsmk-datepicker'</span>;

<span class="token-keyword">&#64;Component</span>({{ '{' }}
  selector: <span class="token-string">'app-root'</span>,
  standalone: <span class="token-number">true</span>,
  <span class="token-keyword">imports</span>: [<span class="token-class">NgxsmkDatepickerComponent</span>],
  template: <span class="token-string">\`
    &lt;<span class="token-tag">ngxsmk-datepicker</span> <span class="token-attr">mode</span>=<span class="token-string">"range"</span>&gt;&lt;/<span class="token-tag">ngxsmk-datepicker</span>&gt;
  \`</span>
{{ '}' }})
<span class="token-keyword">export class</span> <span class="token-class">AppComponent</span> {{ '{' }} {{ '}' }}</code></pre>
      </div>

      <h2>{{ i18n.t().installation.zonelessTitle }}</h2>
      <p>{{ i18n.t().installation.zonelessLead }}</p>
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

    .code-window {
        background: var(--color-bg-code);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        margin: var(--space-xl) 0;
        overflow: hidden;
        box-shadow: var(--shadow-lg);

        .window-header {
            background: rgba(255, 255, 255, 0.03);
            padding: 0.75rem 1.25rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            border-bottom: 1px solid var(--color-border);

            .dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                &.red { background: #ff5f56; }
                &.yellow { background: #ffbd2e; }
                &.green { background: #27c93f; }
            }
            .window-title {
                margin-left: 0.5rem;
                font-size: 0.7rem;
                font-family: 'JetBrains Mono', monospace;
                color: var(--color-text-dim);
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
        }

        pre {
            margin: 0;
            padding: var(--space-lg);
            overflow-x: auto;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9rem;
            line-height: 1.7;

            code {
                background: none;
                border: none;
                padding: 0;
                color: #e0e6ed;
                
                .token-keyword { color: #ff79c6; }
                .token-string { color: #f1fa8c; }
                .token-comment { color: #6272a4; font-style: italic; }
                .token-function { color: #50fa7b; }
                .token-class { color: #8be9fd; }
                .token-operator { color: #ff79c6; }
                .token-number { color: #bd93f9; }
                .token-tag { color: #ff79c6; }
                .token-attr { color: #bd93f9; }
            }
        }
    }
    .tip { margin-top: var(--space-lg); }
    p a.link { display: inline-block; margin-top: var(--space-xs); }
  `]
})
export class InstallationComponent {
  i18n = inject(I18nService);
}
