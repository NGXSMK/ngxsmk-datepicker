import { Component, inject, HostListener } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { I18nService } from '../../i18n/i18n.service';
import type { DatepickerValue } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxsmkDatepickerComponent, DatePipe],
  template: `
    <div class="animate-fade-in">
      <h1>{{ i18n.t().nav.integrations }}</h1>
      <p class="text-lg">Learn how to seamlessly integrate <code>ngxsmk-datepicker</code> with your favorite UI frameworks.</p>

      <h2>Angular Material</h2>
      <p>The library provides built-in support for <code>MatFormField</code>. You can use the datepicker inside a standard Material field with floating labels, hints, and error states.</p>
      
      <div class="card bg-code">
        <pre><code class="text-main">import {{ '{' }} MAT_FORM_FIELD_CONTROL {{ '}' }} from '&#64;angular/material/form-field';
import {{ '{' }} NgxsmkDatepickerComponent, provideMaterialFormFieldControl {{ '}' }} from 'ngxsmk-datepicker';

&#64;Component({{ '{' }}
  // ...
  providers: [
    provideMaterialFormFieldControl(MAT_FORM_FIELD_CONTROL) // Enables MatFormField compatibility
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
      <p>For Ionic applications, the datepicker feels right at home. It functions seamlessly inside <code>ion-item</code> and automatically inherits your application's Ionic CSS variables (like <code>--ion-color-primary</code> for the active state). We highly recommend enabling <code>[useNativePicker]="true"</code> to leverage the native OS device wheel pickers on mobile devices for the best user experience.</p>
      
      <div class="card">
        <pre><code class="text-main">&lt;ion-item&gt;
  &lt;ion-label position="floating"&gt;Date&lt;/ion-label&gt;
  &lt;ngxsmk-datepicker 
    [useNativePicker]="true" 
    [inline]="false"&gt;
  &lt;/ngxsmk-datepicker&gt;
&lt;/ion-item&gt;</code></pre>
      </div>

      <h2>React, Vue, & Vanilla JS</h2>
      <p>Since <code>ngxsmk-datepicker</code> is a highly isolated Angular library without heavy dependencies, it can be compiled into <strong>Custom Web Components</strong> using Angular Elements. This allows you to use exactly the same beautiful datepicker in React, Vue, Svelte, or Vanilla JavaScript.</p>
      <div class="card bg-code">
        <pre><code class="text-main">// In your React component
import React, {{ '{' }} useState, useEffect, useRef {{ '}' }} from 'react';
// Import the compiled Angular Element bundle
import 'ngxsmk-datepicker-element/bundle.js';

export function DateSelector() {{ '{' }}
  const datepickerRef = useRef(null);
  
  useEffect(() =&gt; {{ '{' }}
    // Listen to custom events
    datepickerRef.current.addEventListener('dateSelect', (e) =&gt; {{ '{' }}
      console.log('Selected date:', e.detail);
    {{ '}' }});
  {{ '}' }}, []);

  return (
    &lt;div&gt;
      &lt;ngxsmk-datepicker ref={{ '{' }}datepickerRef{{ '}' }} mode="range"&gt;&lt;/ngxsmk-datepicker&gt;
    &lt;/div&gt;
  );
{{ '}' }}</code></pre>
      </div>

      <h2>Tailwind CSS</h2>
      <p>Using Tailwind? No problem! The <code>ngxsmk-datepicker</code> supports a powerful <code>[classes]</code> input that allows you to easily inject utility classes into specific internal DOM elements. Override paddings, typography, backgrounds, or borders natively.</p>
      
      <div class="card bg-code">
        <pre><code class="text-main">&lt;ngxsmk-datepicker
  [classes]="&#123;
    header: 'bg-indigo-600 text-white rounded-t-xl',
    calendar: 'shadow-2xl border-indigo-200',
    navPrev: 'hover:bg-indigo-500 text-white',
    navNext: 'hover:bg-indigo-500 text-white'
  &#125;"&gt;
&lt;/ngxsmk-datepicker&gt;</code></pre>
      </div>

      <h2>{{ i18n.t().integrations.modalSectionTitle }}</h2>
      <p>{{ i18n.t().integrations.modalSectionLead }}</p>
      <div class="card">
        <button type="button" class="btn-primary" (click)="openModal()">
          {{ i18n.t().integrations.openModalBtn }}
        </button>
      </div>

      <div class="tip">
        <strong>Pro Tip:</strong> Use <code>appendToBody: true</code> when using the datepicker inside Modals or Overlays to avoid stacking context issues.
      </div>
    </div>

    @if (isModalOpen) {
      <div class="modal-backdrop" role="presentation" (click)="closeModal()" (keydown.escape)="closeModal()"></div>
      <div class="modal modal-dialog modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">
        <div class="modal-header">
          <h2 id="modal-title" class="modal-title">{{ i18n.t().integrations.modalSectionTitle }}</h2>
          <button type="button" class="modal-close" (click)="closeModal()" [attr.aria-label]="i18n.t().integrations.closeModal">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="modal-body">
          <label class="modal-label" for="modal-datepicker-input">{{ i18n.t().integrations.modalDatePlaceholder }}</label>
          <ngxsmk-datepicker
            id="modal-datepicker-input"
            mode="single"
            [(ngModel)]="modalDate"
            [placeholder]="i18n.t().integrations.modalDatePlaceholder"
            [appendToBody]="true"
          ></ngxsmk-datepicker>
          @if (modalDisplayDate()) {
            <p class="modal-selected text-dim text-sm">Selected: {{ modalDisplayDate() | date: 'mediumDate' }}</p>
          }
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-secondary" (click)="closeModal()">{{ i18n.t().integrations.closeModal }}</button>
        </div>
      </div>
    }
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

    .btn-primary, .btn-secondary {
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: var(--transition-base);
    }
    .btn-primary {
      background: var(--color-primary);
      color: #fff;
      border: none;
    }
    .btn-primary:hover { opacity: 0.9; }
    .btn-secondary {
      background: var(--color-bg-elevated);
      color: var(--color-text-main);
      border: 1px solid var(--color-border);
    }
    .btn-secondary:hover { border-color: var(--color-primary); color: var(--color-primary); }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      z-index: 9998;
      animation: fadeIn 0.2s ease;
    }
    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: min(90vw, 420px);
      max-height: 90vh;
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      animation: fadeIn 0.2s ease;
      /* Allow datepicker dropdown (appendToBody) to layer above modal via its own z-index */
      overflow: visible;
    }
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
    }
    .modal-title { margin: 0; font-size: var(--font-size-xl); }
    .modal-close {
      background: none;
      border: none;
      color: var(--color-text-muted);
      cursor: pointer;
      padding: var(--space-xs);
      border-radius: var(--radius-sm);
    }
    .modal-close:hover { color: var(--color-text-main); }
    .modal-body {
      padding: var(--space-lg);
      overflow-y: auto;
    }
    .modal-label { display: block; margin-bottom: var(--space-sm); font-weight: var(--font-weight-medium); }
    .modal-selected { margin-top: var(--space-md); }
    .modal-footer {
      padding: var(--space-lg);
      border-top: 1px solid var(--color-border);
      display: flex;
      justify-content: flex-end;
      gap: var(--space-md);
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class IntegrationsComponent {
  i18n = inject(I18nService);
  isModalOpen = false;
  modalDate: DatepickerValue | null = null;

  /** Single date for display in modal (single mode returns Date | null). */
  modalDisplayDate(): Date | null {
    const v = this.modalDate;
    if (!v) return null;
    if (v instanceof Date) return v;
    if (typeof v === 'object' && v !== null && 'start' in v) return (v as { start: Date }).start;
    return null;
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isModalOpen) this.closeModal();
  }
}
