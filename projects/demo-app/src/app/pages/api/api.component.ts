import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-api',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-fade-in">
      <h1>{{ i18n.t().api.title }}</h1>
      <p class="text-lg">{{ i18n.t().api.lead }}</p>
      
      <!-- Inputs Section -->
      <section>
        <h2>{{ i18n.t().api.inputsTitle }}</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{ i18n.t().api.table.property }}</th>
                <th>{{ i18n.t().api.table.type }}</th>
                <th>{{ i18n.t().api.table.default }}</th>
                <th>{{ i18n.t().api.table.description }}</th>
              </tr>
            </thead>
            <tbody>
              @for (input of inputs; track input.name) {
                <tr>
                  <td><code class="text-secondary">{{ input.name }}</code></td>
                  <td><code class="text-xs">{{ input.type }}</code></td>
                  <td><code>{{ input.default }}</code></td>
                  <td>{{ input.description }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <!-- Outputs Section -->
      <section>
        <h2>{{ i18n.t().api.outputsTitle }}</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{ i18n.t().api.table.event }}</th>
                <th>{{ i18n.t().api.table.payload }}</th>
                <th>{{ i18n.t().api.table.description }}</th>
              </tr>
            </thead>
            <tbody>
              @for (output of outputs; track output.name) {
                <tr>
                  <td><code class="text-secondary">{{ output.name }}</code></td>
                  <td><code class="text-xs">{{ output.payload }}</code></td>
                  <td>{{ output.description }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <!-- Advanced Types -->
      <section>
        <h2>{{ i18n.t().api.advancedTypesTitle }}</h2>
        <div class="grid gap-lg">
          <div class="code-window mt-0 mb-0">
            <div class="window-header">
              <div class="dot red"></div>
              <div class="dot yellow"></div>
              <div class="dot green"></div>
              <div class="window-title">types.ts</div>
            </div>
            <pre><code><span class="token-keyword">type</span> <span class="token-class">DatepickerValue</span> = <span class="token-class">Date</span> | {{ '{' }}start: <span class="token-class">Date</span>; end: <span class="token-class">Date</span>{{ '}' }} | <span class="token-class">Date</span>[] | <span class="token-number">null</span>;</code></pre>
          </div>
          <div class="code-window mt-0 mb-0">
            <div class="window-header">
              <div class="dot red"></div>
              <div class="dot yellow"></div>
              <div class="dot green"></div>
              <div class="window-title">interfaces.ts</div>
            </div>
            <pre><code><span class="token-keyword">interface</span> <span class="token-class">HolidayProvider</span> {{ '{' }}
  <span class="token-function">isHoliday</span>(date: <span class="token-class">Date</span>): <span class="token-number">boolean</span>;
  <span class="token-function">getHolidayLabel</span>?(date: <span class="token-class">Date</span>): <span class="token-number">string</span> | <span class="token-number">null</span>;
{{ '}' }}</code></pre>
          </div>
        </div>
      </section>
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

    .table-container {
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      overflow-x: auto;
      margin-top: var(--space-md);
      background: var(--color-bg-sidebar);
      -webkit-overflow-scrolling: touch;
    }
    
    table { width: 100%; border-collapse: collapse; text-align: left; min-width: 600px; @media (min-width: 768px) { min-width: 0; } }
    th, td { padding: 0.75rem 0.5rem; border-bottom: 1px solid var(--color-border); @media (min-width: 768px) { padding: 1.25rem; } }
    
    th {
      background: rgba(255, 255, 255, 0.03);
      font-size: 0.65rem;
      @media (min-width: 768px) { font-size: 0.75rem; }
      font-weight: 800;
      color: var(--color-text-dim);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    
    td { font-size: 0.85rem; @media (min-width: 768px) { font-size: 0.95rem; } vertical-align: top; color: var(--color-text-muted); }
    code { color: var(--color-secondary); background: none; padding: 0; }
    .text-xs { font-size: 0.75rem; }


  `]
})
export class ApiComponent {
  i18n = inject(I18nService);
  inputs = [
    { name: 'mode', type: "'single' | 'range' | 'multiple' | 'week' | 'month' | 'quarter' | 'year'", default: "'single'", description: 'Selection behavior of the datepicker.' },
    { name: 'inline', type: "boolean | 'always' | 'auto'", default: 'false', description: 'Controls whether the calendar is embedded or shown in a popover.' },
    { name: 'locale', type: 'string', default: 'navigator.language', description: 'BCP 47 language tag for internationalization.' },
    { name: 'theme', type: "'light' | 'dark'", default: "'light'", description: 'Visual theme of the component.' },
    { name: 'showTime', type: 'boolean', default: 'false', description: 'Enables time selection inputs.' },
    { name: 'showSeconds', type: 'boolean', default: 'false', description: 'Enables seconds selection in time picker.' },
    { name: 'use24Hour', type: 'boolean', default: 'false', description: 'Switches to 24-hour time format.' },
    { name: 'allowTyping', type: 'boolean', default: 'false', description: 'Allows users to type the date directly into the input.' },
    { name: 'calendarCount', type: 'number', default: '1', description: 'Number of calendars to show (max 12).' },
    { name: 'calendarLayout', type: "'horizontal' | 'vertical' | 'auto'", default: "'auto'", description: 'Layout orientation for multi-calendar displays.' },
    { name: 'useNativePicker', type: 'boolean', default: 'false', description: 'Uses the browser/OS native date picker (recommended for mobile).' },
    { name: 'field', type: 'SignalFormField', default: 'null', description: 'Integration with Angular 21 Signal-based Forms.' },
    { name: 'minDate', type: 'Date | string', default: 'null', description: 'Minimum selectable date.' },
    { name: 'maxDate', type: 'Date | string', default: 'null', description: 'Maximum selectable date.' },
    { name: 'ranges', type: 'DateRange', default: 'null', description: 'Predefined range options for Range mode.' },
    { name: 'holidayProvider', type: 'HolidayProvider', default: 'null', description: 'Provider for highlighting/labeling holidays.' },
    { name: 'isInvalidDate', type: '(date: Date) => boolean', default: '() => false', description: 'Custom function to disable specific dates.' },
    { name: 'disabledDates', type: '(string | Date)[]', default: '[]', description: 'Static list of dates to disable.' }
  ];

  outputs = [
    { name: 'valueChange', payload: 'DatepickerValue', description: 'Emitted when the selected date or range changes.' },
    { name: 'action', payload: "{ type: string; payload?: any }", description: 'Detailed event emission for specific UI interactions.' }
  ];
}
