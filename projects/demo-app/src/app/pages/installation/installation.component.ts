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
        <pre><code class="text-main">npm install ngxsmk-datepicker@2.0.8</code></pre>
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
    .bg-code {
      background: var(--color-bg-code);
      padding: 2rem;
      border-radius: var(--radius-md);
      overflow-x: auto;
      border: 1px solid var(--color-border);
      pre { margin: 0; }
    }
  `]
})
export class InstallationComponent {
  i18n = inject(I18nService);
}
