import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-architecture',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-fade-in">
      <h1>Plugin Architecture</h1>
      <p class="text-lg">Extend the datepicker with custom logic, adapters, and behavioral hooks.</p>

      <!-- Architecture Diagram -->
      <div class="arch-diagram card">
        <div class="diagram-grid">
          <div class="column">
            <div class="layer-label">External Layer</div>
            <div class="box plugin">Custom Adapters</div>
            <div class="box plugin">Custom Strategies</div>
            <div class="box plugin">Localization Data</div>
          </div>
          
          <div class="connector flex items-center justify-center">
            <svg viewBox="0 0 40 20" width="40"><path d="M0 10 L40 10 M35 5 L40 10 L35 15" stroke="currentColor" fill="none" stroke-width="2"/></svg>
          </div>

          <div class="column">
            <div class="layer-label">Extensibility Layer</div>
            <div class="box hook">Behavioral Hooks</div>
            <div class="box hook">Validation Middleware</div>
            <div class="box hook">Theme Interceptors</div>
          </div>

          <div class="connector flex items-center justify-center">
            <svg viewBox="0 0 40 20" width="40"><path d="M0 10 L40 10 M35 5 L40 10 L35 15" stroke="currentColor" fill="none" stroke-width="2"/></svg>
          </div>

          <div class="column core-col">
            <div class="layer-label">Core Engine</div>
            <div class="core-node">
              <div class="core-inner">
                <span class="core-text">Signals</span>
                <span class="core-subtext">State Service</span>
              </div>
            </div>
            <div class="box internal">Commands Bus</div>
          </div>
        </div>
      </div>

      <h2>Custom Date Adapters</h2>
      <p>By default, <code>ngxsmk-datepicker</code> uses native JavaScript Date objects. You can plug in custom adapters for libraries like <strong>Luxon</strong>, <strong>Day.js</strong>, or <strong>date-fns</strong>.</p>
      
      <div class="card bg-code">
        <pre><code class="text-main">export class MyLuxonAdapter extends DateAdapter&lt;DateTime&gt; {{ '{' }}
  // Implement formatting, parsing, and arithmetic logic
  addMonths(date: DateTime, months: number): DateTime {{ '{' }}
    return date.plus({{ '{' }} months {{ '}' }});
  {{ '}' }}
{{ '}' }}

// Register in providers
providers: [
  {{ '{' }} provide: DateAdapter, useClass: MyLuxonAdapter {{ '}' }}
]</code></pre>
      </div>

      <h2>Behavioral Hooks</h2>
      <p>Intercept core interactions with the <code>[hooks]</code> input. This allows for deep customization of rendering and validation.</p>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Hook</th>
              <th>Description</th>
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

      <h2>Internal Registry Service</h2>
      <p>All localization and translation data is managed by centralized services that you can access and modify at runtime:</p>
      <ul>
        <li><code>LocaleRegistryService</code>: Register new calendar systems or BCP47 data.</li>
        <li><code>TranslationRegistryService</code>: Update UI labels globally for the entire app.</li>
      </ul>

      <h2>Custom Selection Strategies</h2>
      <p>Take full control over how users select dates. By implementing the <code>SelectionStrategy</code> interface, you can enforce custom business logic, such as "Work-week only" ranges or "Fixed Duration" selections.</p>
      
      <div class="card bg-code">
        <pre><code class="text-main">@Injectable()
export class WorkingWeekStrategy implements SelectionStrategy&lt;Date&gt; {{ '{' }}
  createSelection(date: Date, current: DateRange&lt;Date&gt;): DateRange&lt;Date&gt; {{ '{' }}
    // Force selection to always span Monday to Friday
    const start = this.adapter.getStartOfWeek(date);
    return new DateRange(start, this.adapter.addDays(start, 4));
  {{ '}' }}
{{ '}' }}</code></pre>
      </div>

      <h2>Internal Signal State</h2>
      <p>The datepicker is built using a unidirectional Signal-based state architecture. You can inject the <code>DatepickerStateService</code> to react to internal changes before they are emitted to the <code>(ngModel)</code>.</p>
      
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

      <h2>Middleware & Interceptors</h2>
      <p>Registry services support a middleware pattern. This allows you to intercept translations or locale data as it's requested by the UI components.</p>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Hook Point</th>
              <th>Description</th>
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
               <td colspan="3" class="text-center py-md text-dim italic">More hooks available in Advanced API Reference</td>
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
    .arch-diagram {
      background: var(--color-bg-sidebar);
      padding: 2rem 1rem;
      overflow-x: auto;
      margin: 2rem -1rem;
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
    .bg-code { background: var(--color-bg-code); padding: 1.5rem; border-radius: var(--radius-md); margin: 1rem 0; }
    .grid-2 { 
        display: grid; 
        grid-template-columns: 1fr 1fr; 
        gap: 1.5rem; 
        margin: 2rem 0; 
        @media (max-width: 768px) { grid-template-columns: 1fr; }
    }
    .info-card { 
      background: rgba(255,255,255,0.02); 
      padding: 1.5rem; 
      border: 1px solid var(--color-border); 
      border-radius: var(--radius-md);
      transition: transform 0.2s ease;
      &:hover { transform: translateY(-2px); background: rgba(255,255,255,0.04); }
      h4 { margin-top: 0; color: var(--color-secondary); font-size: 1rem; }
      p { font-size: 0.85rem; margin: 0.5rem 0 0; color: var(--color-text-dim); }
    }
    .table-container {
      margin: 1.5rem 0;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      table { width: 100%; border-collapse: collapse; }
      th, td { padding: 1rem; border-bottom: 1px solid var(--color-border); text-align: left; }
      th { background: rgba(255,255,255,0.03); color: var(--color-text-dim); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
      td { font-size: 0.9rem; color: var(--color-text-muted); }
      tr:last-child td { border-bottom: none; }
    }
    .tip {
      padding: 1.5rem;
      background: rgba(139, 92, 246, 0.05);
      border-left: 4px solid var(--color-primary);
      border-radius: var(--radius-sm);
      margin-top: 3rem;
      font-size: 0.95rem;
    }
  `]
})
export class ArchitectureComponent { }
