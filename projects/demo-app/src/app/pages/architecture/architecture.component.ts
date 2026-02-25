import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-architecture',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-fade-in">
      <h1>{{ i18n.t().architecture.title }}</h1>
      <p class="text-lg">{{ i18n.t().architecture.lead }}</p>

      <!-- Architecture Diagram -->
      <div class="arch-diagram card">
        <div class="diagram-grid">
          <div class="column">
            <div class="layer-label">{{ i18n.t().architecture.layers.external }}</div>
            <div class="box plugin">{{ i18n.t().architecture.boxes.adapters }}</div>
            <div class="box plugin">{{ i18n.t().architecture.boxes.strategies }}</div>
            <div class="box plugin">{{ i18n.t().architecture.boxes.locales }}</div>
          </div>
          
          <div class="connector flex items-center justify-center">
            <svg viewBox="0 0 40 20" width="40"><path d="M0 10 L40 10 M35 5 L40 10 L35 15" stroke="currentColor" fill="none" stroke-width="2"/></svg>
          </div>

          <div class="column">
            <div class="layer-label">{{ i18n.t().architecture.layers.extensibility }}</div>
            <div class="box hook">{{ i18n.t().architecture.boxes.hooks }}</div>
            <div class="box hook">{{ i18n.t().architecture.boxes.middleware }}</div>
            <div class="box hook">{{ i18n.t().architecture.boxes.interceptors }}</div>
          </div>

          <div class="connector flex items-center justify-center">
            <svg viewBox="0 0 40 20" width="40"><path d="M0 10 L40 10 M35 5 L40 10 L35 15" stroke="currentColor" fill="none" stroke-width="2"/></svg>
          </div>

          <div class="column core-col">
            <div class="layer-label">{{ i18n.t().architecture.layers.core }}</div>
            <div class="core-node">
              <div class="core-inner">
                <span class="core-text">{{ i18n.t().architecture.boxes.signals }}</span>
                <span class="core-subtext">{{ i18n.t().architecture.boxes.state }}</span>
              </div>
            </div>
            <div class="box internal">{{ i18n.t().architecture.boxes.bus }}</div>
          </div>
        </div>
      </div>

      <h2>{{ i18n.t().architecture.adaptersTitle }}</h2>
      <p>{{ i18n.t().architecture.adaptersLead }}</p>
      
      <div class="code-window">
        <div class="window-header">
          <div class="dot red"></div>
          <div class="dot yellow"></div>
          <div class="dot green"></div>
          <div class="window-title">adapter.ts</div>
        </div>
        <pre><code class="text-main"><span class="token-keyword">export class</span> <span class="token-class">MyLuxonAdapter</span> <span class="token-keyword">extends</span> <span class="token-class">DateAdapter</span>&lt;<span class="token-class">DateTime</span>&gt; {{ '{' }}
  <span class="token-comment">// Implement formatting, parsing, and arithmetic logic</span>
  <span class="token-function">addMonths</span>(date: <span class="token-class">DateTime</span>, months: <span class="token-number">number</span>): <span class="token-class">DateTime</span> {{ '{' }}
    <span class="token-keyword">return</span> date.<span class="token-function">plus</span>({{ '{' }} months {{ '}' }});
  {{ '}' }}
{{ '}' }}

<span class="token-comment">// Register in providers</span>
<span class="token-keyword">providers</span>: [
  {{ '{' }} provide: <span class="token-class">DateAdapter</span>, <span class="token-keyword">useClass</span>: <span class="token-class">MyLuxonAdapter</span> {{ '}' }}
]</code></pre>
      </div>

      <h2>{{ i18n.t().architecture.hooksTitle }}</h2>
      <p>{{ i18n.t().architecture.hooksLead }}</p>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>{{ i18n.t().architecture.table.hook }}</th>
              <th>{{ i18n.t().architecture.table.description }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>DayCellRenderHook</code></td>
              <td>Modify the CSS classes or content of individual day cells.</td>
            </tr>
            <tr>
              <td><code>ValidationHook</code></td>
              <td>Provide complex multi-step validation logic for ranges.</td>
            </tr>
            <tr>
              <td><code>KeyboardShortcutHook</code></td>
              <td>Override or add new keyboard shortcuts dynamically.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>{{ i18n.t().architecture.registryTitle }}</h2>
      <p>{{ i18n.t().architecture.registryLead }}</p>
      <ul>
        <li><code>LocaleRegistryService</code>: Register new calendar systems or BCP47 data.</li>
        <li><code>TranslationRegistryService</code>: Update UI labels globally for the entire app.</li>
      </ul>

      <h2>{{ i18n.t().architecture.strategiesTitle }}</h2>
      <p>{{ i18n.t().architecture.strategiesLead }}</p>
      
      <div class="code-window">
        <div class="window-header">
          <div class="dot red"></div>
          <div class="dot yellow"></div>
          <div class="dot green"></div>
          <div class="window-title">selection-strategy.ts</div>
        </div>
        <pre><code class="text-main"><span class="token-keyword">@Injectable</span>()
<span class="token-keyword">export class</span> <span class="token-class">WorkingWeekStrategy</span> <span class="token-keyword">implements</span> <span class="token-class">SelectionStrategy</span>&lt;<span class="token-class">Date</span>&gt; {{ '{' }}
  <span class="token-function">createSelection</span>(date: <span class="token-class">Date</span>, current: <span class="token-class">DateRange</span>&lt;<span class="token-class">Date</span>&gt;): <span class="token-class">DateRange</span>&lt;<span class="token-class">Date</span>&gt; {{ '{' }}
    <span class="token-comment">// Force selection to always span Monday to Friday</span>
    <span class="token-keyword">const</span> start = <span class="token-keyword">this</span>.adapter.<span class="token-function">getStartOfWeek</span>(date);
    <span class="token-keyword">return new</span> <span class="token-class">DateRange</span>(start, <span class="token-keyword">this</span>.adapter.<span class="token-function">addDays</span>(start, <span class="token-number">4</span>));
  {{ '}' }}
{{ '}' }}</code></pre>
      </div>

      <h2>{{ i18n.t().architecture.stateTitle }}</h2>
      <p>{{ i18n.t().architecture.stateLead }}</p>
      
      <div class="grid-2">
        <div class="info-card">
          <h4>View State</h4>
          <p>Read-only signals for current month, year, and hover states.</p>
        </div>
        <div class="info-card">
          <h4>Command Bus</h4>
          <p>Imperative actions to switch views or trigger animations.</p>
        </div>
      </div>

      <h2>{{ i18n.t().architecture.middlewareTitle }}</h2>
      <p>{{ i18n.t().architecture.middlewareLead }}</p>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>{{ i18n.t().architecture.table.service }}</th>
              <th>{{ i18n.t().architecture.table.hookPoint }}</th>
              <th>{{ i18n.t().architecture.table.description }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>LocaleRegistry</code></td>
              <td><code>onLocaleChange$</code></td>
              <td>Intercept and augment locale data before formatting.</td>
            </tr>
            <tr>
              <td><code>FeatureToggleService</code></td>
              <td><code>isFeatureEnabled()</code></td>
              <td>Override library defaults (e.g., disable specific animations).</td>
            </tr>
            <tr>
              <td><code>StyleRegistry</code></td>
              <td><code>injectStyles()</code></td>
              <td>Programmatically inject CSS variables into the shadow DOM.</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
               <td colspan="3" class="text-center py-md text-dim italic">{{ i18n.t().architecture.table.moreHooks }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="tip">
        <strong>Pro Tip:</strong> Use <code>provideDatepickerConfig()</code> at the root level to set global architectural defaults for your entire organization.
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

    .arch-diagram {
      background: var(--color-bg-sidebar);
      padding: var(--space-xl) var(--space-md);
      overflow-x: auto;
      margin: var(--space-xl) -1rem;
      border-radius: 0;
      @media (min-width: 768px) {
        padding: 3rem 2rem;
        margin: 2.5rem 0;
        border-radius: var(--radius-lg);
      }
      -webkit-overflow-scrolling: touch;
    }
    .diagram-grid {
      display: grid;
      grid-template-columns: 1fr auto 1fr auto 1fr;
      gap: 1rem;
      min-width: 700px;
    }
    .column {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .layer-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      font-weight: 800;
      color: var(--color-text-dim);
      letter-spacing: 0.1em;
      margin-bottom: 0.5rem;
      text-align: center;
    }
    .box {
      padding: 1rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
      text-align: center;
      border: 1px solid var(--color-border);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      &.plugin { background: rgba(6, 182, 212, 0.05); color: var(--color-secondary); }
      &.hook { background: rgba(139, 92, 246, 0.05); color: var(--color-primary-light); }
      &.internal { background: rgba(255,255,255,0.03); color: var(--color-text-dim); }

      &:hover {
        transform: scale(1.02);
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        border-color: currentColor;
      }
    }
    .connector {
      color: var(--color-border-light);
      opacity: 0.5;
    }
    .core-col {
      justify-content: center;
    }
    .core-node {
      height: 100px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      box-shadow: 0 0 30px rgba(124, 58, 237, 0.3);
      margin-bottom: 0.75rem;

      .core-inner {
        text-align: center;
        .core-text { display: block; font-size: 1.25rem; font-weight: 900; letter-spacing: -0.02em; }
        .core-subtext { font-size: 0.65rem; text-transform: uppercase; font-weight: 700; opacity: 0.8; }
      }
    }
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
                color: #e0e6ed; /* Softer white */
                
                .token-keyword { color: #ff79c6; } /* Pink */
                .token-string { color: #f1fa8c; }  /* Yellow */
                .token-comment { color: #6272a4; font-style: italic; } /* Blue-gray */
                .token-function { color: #50fa7b; } /* Green */
                .token-class { color: #8be9fd; }    /* Cyan */
                .token-operator { color: #ff79c6; }
                .token-number { color: #bd93f9; }   /* Purple */
            }
        }
    }
    .grid-2 { 
        display: grid; 
        grid-template-columns: 1fr 1fr; 
        gap: var(--space-md); 
        margin: var(--space-xl) 0; 
        @media (max-width: 768px) { grid-template-columns: 1fr; }
    }
    .info-card { 
      background: rgba(255,255,255,0.02); 
      padding: var(--space-lg); 
      border: 1px solid var(--color-border); 
      border-radius: var(--radius-md);
      transition: transform 0.2s ease;
      &:hover { transform: translateY(-2px); background: rgba(255,255,255,0.04); }
      h4 { margin-top: 0; color: var(--color-secondary); font-size: 1rem; }
      p { font-size: 0.85rem; margin: 0.5rem 0 0; color: var(--color-text-dim); }
    }
    .table-container {
      margin: var(--space-xl) 0;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      table { width: 100%; border-collapse: collapse; min-width: 500px; @media (min-width: 768px) { min-width: 0; } }
      th, td { padding: 1rem; border-bottom: 1px solid var(--color-border); text-align: left; }
      th { background: rgba(255,255,255,0.03); color: var(--color-text-dim); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
      td { font-size: 0.9rem; color: var(--color-text-muted); }
      tr:last-child td { border-bottom: none; }
    }
    .tip { margin-top: var(--space-2xl); }
  `]
})
export class ArchitectureComponent {
  i18n = inject(I18nService);
}
