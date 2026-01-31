import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-fade-in">
      <h1>Framework Integration</h1>
      <p class="text-lg">Learn how to seamlessly integrate <code>ngxsmk-datepicker</code> with your favorite UI frameworks.</p>

      <h2>Angular Material</h2>
      <p>The library provides built-in support for <code>MatFormField</code>. You can use the datepicker inside a standard Material field with floating labels, hints, and error states.</p>
      
      <div class="card bg-code">
        <pre><code class="text-main">import {{ '{' }} provideMaterialFormFieldControl {{ '}' }} from 'ngxsmk-datepicker';

@Component({{ '{' }}
  // ...
  providers: [
    provideMaterialFormFieldControl() // Enables MatFormField compatibility
  ]
{{ '}' }})
export class MyComponent {{ '{' }} {{ '}' }}</code></pre>
      </div>

      <div class="card">
        <h3>Usage with MatFormField</h3>
        <pre><code class="text-main">&lt;mat-form-field&gt;
  &lt;mat-label&gt;Select Date&lt;/mat-label&gt;
  &lt;ngxsmk-datepicker matFormFieldControl&gt;&lt;/ngxsmk-datepicker&gt;
&lt;/mat-form-field&gt;</code></pre>
      </div>

      <h2>Ionic Framework</h2>
      <p>For Ionic applications, the datepicker can be used inside <code>ion-item</code>. We recommend using <code>useNativePicker: true</code> on mobile devices for the best user experience.</p>
      
      <div class="card">
        <pre><code class="text-main">&lt;ion-item&gt;
  &lt;ion-label position="floating"&gt;Date&lt;/ion-label&gt;
  &lt;ngxsmk-datepicker [inline]="false"&gt;&lt;/ngxsmk-datepicker&gt;
&lt;/ion-item&gt;</code></pre>
      </div>

      <div class="tip">
        <strong>Pro Tip:</strong> Use <code>appendToBody: true</code> when using the datepicker inside Modals or Overlays to avoid stacking context issues.
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
    h3 { margin-bottom: var(--space-sm); }
    p { margin-bottom: var(--space-md); }

    .card {
      padding: var(--space-lg);
      @media (max-width: 480px) { padding: var(--space-md); }
      margin-bottom: var(--space-md);
    }

    .bg-code { 
      background: var(--color-bg-code); 
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
    }
    pre { overflow-x: auto; margin: 0; }
    code { 
        white-space: pre; 
        font-size: var(--font-size-sm);
        @media (min-width: 480px) { font-size: var(--font-size-base); }
    }
    .tip { margin-top: var(--space-2xl); }
  `]
})
export class IntegrationsComponent { }
