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
      
      <div class="card bg-code">
        <pre><code class="text-main">npm install ngxsmk-datepicker@2.1.3</code></pre>
      </div>

      <div class="tip">
        <strong>{{ i18n.t().installation.note.split(':')[0] }}:</strong> {{ i18n.t().installation.note.split(':')[1] }}
      </div>

      <h2>{{ i18n.t().installation.importTitle }}</h2>
      <p>{{ i18n.t().installation.importLead }}</p>

      <div class="card bg-code">
        <pre><code class="text-main">import {{ '{' }} NgxsmkDatepickerComponent {{ '}' }} from 'ngxsmk-datepicker';

@Component({{ '{' }}
  selector: 'app-root',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: \`
    &lt;ngxsmk-datepicker mode="range"&gt;&lt;/ngxsmk-datepicker&gt;
  \`
{{ '}' }})
export class AppComponent {{ '{' }} {{ '}' }}</code></pre>
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

    .bg-code {
      background: var(--color-bg-code);
      padding: var(--space-md);
      @media (min-width: 768px) { padding: var(--space-xl); }
      border-radius: var(--radius-md);
      overflow-x: auto;
      border: 1px solid var(--color-border);
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
      pre { margin: 0; }
      code { 
        white-space: pre; 
        font-size: var(--font-size-sm);
        @media (min-width: 480px) { font-size: var(--font-size-base); }
      }
    }
    .tip { margin-top: var(--space-lg); }
  `]
})
export class InstallationComponent {
  i18n = inject(I18nService);
}
