import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-api',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-fade-in">
      <h1>API Reference</h1>
      <p class="text-lg">Comprehensive documentation for all component inputs, outputs, and utility functions.</p>
      
      <!-- Inputs Section -->
      <section>
        <h2>Component Inputs</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
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
        <h2>Component Outputs</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Payload</th>
                <th>Description</th>
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
        <h2>Advanced Types</h2>
        <div class="grid gap-lg">
          <div class="card bg-code">
            <h4>DatepickerValue</h4>
            <pre><code>type DatepickerValue = Date | {{ '{' }}start: Date; end: Date{{ '}' }} | Date[] | null;</code></pre>
          </div>
          <div class="card bg-code">
            <h4>HolidayProvider</h4>
            <pre><code>interface HolidayProvider {{ '{' }}
  isHoliday(date: Date): boolean;
  getHolidayLabel?(date: Date): string | null;
{{ '}' }}</code></pre>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .table-container {
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      overflow-x: auto;
      margin-top: 1rem;
      background: var(--color-bg-sidebar);
    }
    
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th, td { padding: 1.25rem; border-bottom: 1px solid var(--color-border); }
    
    th {
      background: rgba(255, 255, 255, 0.03);
      font-size: 0.75rem;
      font-weight: 800;
      color: var(--color-text-dim);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    
    td { font-size: 0.95rem; vertical-align: top; color: var(--color-text-muted); }
    code { color: var(--color-secondary); }
    .bg-code { background: var(--color-bg-code); padding: 1.5rem; }
  `]
})
export class ApiComponent {
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
