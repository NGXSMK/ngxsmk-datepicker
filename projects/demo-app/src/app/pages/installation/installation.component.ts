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
        <pre><code class="text-main"><span class="token-function">npm install</span> ngxsmk-datepicker@<span class="token-number">2.2.0</span></code></pre>
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
        <pre><code class="text-main"><span class="token-function">yarn add</span> ngxsmk-datepicker@<span class="token-number">2.2.0</span>
<span class="token-function">pnpm add</span> ngxsmk-datepicker@<span class="token-number">2.2.0</span>
<span class="token-function">bun add</span> ngxsmk-datepicker@<span class="token-number">2.2.0</span></code></pre>
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


    .tip { margin-top: var(--space-lg); }
    p a.link { display: inline-block; margin-top: var(--space-xs); }
  `]
})
export class InstallationComponent {
  i18n = inject(I18nService);
}
