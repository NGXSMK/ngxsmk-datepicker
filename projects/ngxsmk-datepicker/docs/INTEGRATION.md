# Integration Guides

**Last updated:** July 2, 2026 - **Current stable:** v2.4.0

This document provides integration examples for using ngxsmk-datepicker with popular frameworks and libraries.

## Table of Contents

- [Theming](#theming)
- [Accessibility](#accessibility)
- [Input sanitization and CSP](#input-sanitization-and-csp)
- [Angular Material](#angular-material)
- [Ionic](#ionic)
- [Tailwind CSS](#tailwind-css)
- [React, Vue, & Vanilla JS (Web Components)](#react-vue--vanilla-js-web-components)
- [Modals and overlays](#modals-and-overlays)

## Theming

Two different mechanisms apply:

- **Component input `[theme]`**: Accepts only `'light'` or `'dark'`. Use it to switch the built-in light/dark color set (e.g. `[theme]="'dark'"` or `[theme]="isDark() ? 'dark' : 'light'"`).
- **ThemeBuilderService.applyTheme(themeObject, element?)**: Accepts a theme **object** (colors, spacing, borderRadius, shadows, etc.) and applies it as CSS variables to the given element (or globally if no element). Use it for custom brand colors and full design tokens. See [THEME-TOKENS.md](THEME-TOKENS.md).
  - When `element` is a **wrapper** (not the `ngxsmk-datepicker` host), the theme is applied to the wrapper and all descendant `ngxsmk-datepicker` elements so library defaults are overridden.
  - Use `theme.shadows.focus` to customize the input focus ring (e.g. `'0 0 0 3px color-mix(in srgb, var(--datepicker-primary-color) 15%, transparent)'`). Internal `--ngxsmk-color-*` variables are bridged from your theme colors automatically.

Do not pass a theme object to the `[theme]` input; use `ThemeBuilderService` for that.

## Accessibility

The datepicker is built with **accessibility in mind**: keyboard navigation (arrows, Enter, Escape, T/Y/N/W, etc.), ARIA roles and labels on interactive elements, and live regions for screen reader announcements. For keyboard shortcuts and ARIA options see [API.md – Keyboard Support](API.md#keyboard-support) and the ARIA-related inputs in the API reference.

## Input sanitization and CSP

- **Input sanitization**: The library sanitizes user-provided date/time strings (e.g. from the input field) before use: it strips HTML delimiters, script handlers, and dangerous protocols. Template bindings do not use `innerHTML` for user content, so Angular's `DomSanitizer` is not required for normal usage.
- **CSP**: If your app enforces a Content-Security-Policy, ensure it allows the same directives required by Angular (e.g. `script-src` for your app and Angular, `style-src` for component styles). The datepicker does not use `eval`, inline scripts, or nonce-based scripts; it uses standard Angular templates and styles. No extra CSP directives are required specifically for ngxsmk-datepicker.

## Angular Material

The main `ngxsmk-datepicker` bundle does **not** import `@angular/material`, so non-Material apps are not forced to install it. If you use `mat-form-field`, install Material and add the directive as below.

### Installation

```bash
npm install @angular/material @angular/cdk ngxsmk-datepicker
```

### Basic Integration (Standalone Components)

**Recommended:** Use the **`ngxsmkMatFormFieldControl`** directive on the datepicker so `mat-form-field` finds it. Add this directive file to your project (e.g. `ngxsmk-mat-form-field.directive.ts`) so only Material apps pull in `@angular/material`:

```typescript
// ngxsmk-mat-form-field.directive.ts
import { Directive, forwardRef } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Directive({
  selector: 'ngxsmk-datepicker[ngxsmkMatFormFieldControl]',
  standalone: true,
  providers: [
    { provide: MatFormFieldControl, useExisting: forwardRef(() => NgxsmkDatepickerComponent) },
  ],
})
export class NgxsmkDatepickerMatFormFieldControlDirective {}
```

Then in your component:

```typescript
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { NgxsmkDatepickerMatFormFieldControlDirective } from './ngxsmk-mat-form-field.directive'; // your local file
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  imports: [MatFormFieldModule, NgxsmkDatepickerComponent, NgxsmkDatepickerMatFormFieldControlDirective, ...],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>Select Date</mat-label>
      <ngxsmk-datepicker ngxsmkMatFormFieldControl [value]="dateControl.value" (valueChange)="dateControl.setValue($event)" ... />
    </mat-form-field>
  `
})
```

If you see "mat-form-field must contain a MatFormFieldControl", add the directive to the datepicker host (see Issue #187).

**Alternative (legacy / when directive is not used):** In `main.ts` before bootstrap, call `NgxsmkDatepickerComponent.withMaterialSupport(MatFormFieldControl)` (and optionally set `globalThis.__NGXSMK_MAT_FORM_FIELD_CONTROL__ = MatFormFieldControl`). Then use the datepicker inside `mat-form-field` without the directive. Prefer the directive above.

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [
    NgxsmkDatepickerComponent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>Select Date</mat-label>
      <ngxsmk-datepicker
        [value]="dateControl.value"
        (valueChange)="dateControl.setValue($event)"
        [theme]="materialTheme"
        placeholder="Choose a date">
      </ngxsmk-datepicker>
    </mat-form-field>
  `
})
export class DatepickerComponent {
  dateControl = new FormControl<Date | null>(null);
  
  materialTheme = {
    colors: {
      primary: '#3f51b5',
      background: '#ffffff',
      text: '#212121',
      border: '#e0e0e0',
      hover: '#f5f5f5'
    },
    borderRadius: {
      md: '4px'
    }
  };
}
```

**If you see "mat-form-field must contain a MatFormFieldControl":** Add the **`ngxsmkMatFormFieldControl`** directive to the datepicker (Option A above). Do not use `MAT_FORM_FIELD` or pass the wrong token; the directive is the supported path.

### Integration with Non-Standalone Components (NgModules)

Add the same directive file (see snippet above) to your project, then import it in your NgModule:

```typescript
import { NgModule } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { NgxsmkDatepickerMatFormFieldControlDirective } from './ngxsmk-mat-form-field.directive'; // your local file
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    NgxsmkDatepickerComponent,
    NgxsmkDatepickerMatFormFieldControlDirective,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class MyModule { }
```

Use `ngxsmkMatFormFieldControl` on the datepicker in your templates.

Then use it in your component:

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-material-form',
  template: `
    <form [formGroup]="myForm">
      <mat-form-field appearance="outline">
        <mat-label>Select Date</mat-label>
        <ngxsmk-datepicker
          mode="single"
          formControlName="date"
          placeholder="Choose a date">
        </ngxsmk-datepicker>
      </mat-form-field>
    </form>
  `
})
export class MaterialFormComponent {
  myForm = new FormGroup({
    date: new FormControl<Date | null>(null)
  });
}
```

### Using with Reactive Forms

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-material-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxsmkDatepickerComponent
  ],
  template: `
    <form [formGroup]="myForm">
      <mat-form-field appearance="outline">
        <mat-label>Select Date</mat-label>
        <ngxsmk-datepicker
          mode="single"
          formControlName="date"
          placeholder="Choose a date">
        </ngxsmk-datepicker>
      </mat-form-field>
    </form>
  `
})
export class MaterialFormComponent {
  myForm = new FormGroup({
    date: new FormControl<Date | null>(null)
  });
}
```

### With Material Datepicker Styling

```typescript
import { Component, inject, ElementRef } from '@angular/core';
import { NgxsmkDatepickerComponent, ThemeBuilderService } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-material-datepicker',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <div class="material-datepicker-wrapper">
      <ngxsmk-datepicker
        [value]="selectedDate"
        (valueChange)="selectedDate = $event"
        theme="light"
        [classes]="materialClasses">
      </ngxsmk-datepicker>
    </div>
  `,
  styles: [`
    .material-datepicker-wrapper {
      width: 100%;
    }
    
    :host ::ng-deep .ngxsmk-input-group {
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      padding: 8px 12px;
      transition: border-color 0.2s;
    }
    
    :host ::ng-deep .ngxsmk-input-group:hover {
      border-color: rgba(0, 0, 0, 0.24);
    }
    
    :host ::ng-deep .ngxsmk-input-group:focus-within {
      border-color: #3f51b5;
      border-width: 2px;
    }
  `]
})
export class MaterialDatepickerComponent {
  private themeBuilder = inject(ThemeBuilderService);
  private hostEl = inject(ElementRef).nativeElement;
  selectedDate: Date | null = null;
  
  materialTheme = {
    colors: {
      primary: '#3f51b5',
      primaryContrast: '#ffffff',
      background: '#ffffff',
      text: '#212121',
      border: '#e0e0e0',
      hover: '#f5f5f5'
    },
    borderRadius: { md: '4px', lg: '8px' }
  };
  
  ngOnInit() {
    this.themeBuilder.applyTheme(this.materialTheme, this.hostEl);
  }
  
  materialClasses = {
    wrapper: 'material-datepicker',
    inputGroup: 'material-input-group',
    popover: 'material-popover'
  };
}
```

## Ionic

### Installation

```bash
npm install @ionic/angular ngxsmk-datepicker
```

### Basic Integration

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-ionic-datepicker',
  standalone: true,
  imports: [NgxsmkDatepickerComponent, IonItem, IonLabel],
  template: `
    <ion-item>
      <ion-label position="stacked">Select Date</ion-label>
      <ngxsmk-datepicker
        [value]="selectedDate"
        (valueChange)="selectedDate = $event"
        [theme]="ionicTheme"
        [classes]="ionicClasses">
      </ngxsmk-datepicker>
    </ion-item>
  `,
  styles: [`
    :host ::ng-deep .ngxsmk-input-group {
      border: 1px solid var(--ion-color-medium);
      border-radius: 8px;
      background: var(--ion-background-color);
    }
    
    :host ::ng-deep .ngxsmk-popover-container {
      --datepicker-primary-color: var(--ion-color-primary);
      --datepicker-background: var(--ion-background-color);
      --datepicker-text-color: var(--ion-text-color);
    }
  `]
})
export class IonicDatepickerComponent {
  selectedDate: Date | null = null;
  
  ionicTheme = {
    colors: {
      primary: 'var(--ion-color-primary)',
      background: 'var(--ion-background-color)',
      text: 'var(--ion-text-color)',
      border: 'var(--ion-color-medium)',
      hover: 'var(--ion-color-light)'
    },
    borderRadius: {
      md: '8px',
      lg: '12px'
    }
  };
  
  ionicClasses = {
    wrapper: 'ionic-datepicker',
    inputGroup: 'ionic-input-group'
  };
}
```

### With Ionic Popover

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-datepicker-popover',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ion-button (click)="openDatepicker()">
      Select Date
    </ion-button>
  `
})
export class DatepickerPopoverComponent {
  constructor(private popoverController: PopoverController) {}
  
  async openDatepicker() {
    const popover = await this.popoverController.create({
      component: NgxsmkDatepickerComponent,
      componentProps: {
        inline: true,
        value: new Date()
      },
      cssClass: 'datepicker-popover'
    });
    
    await popover.present();
  }
}
```

## Tailwind CSS

### Installation

```bash
npm install ngxsmk-datepicker tailwindcss
```

### Basic Integration

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-tailwind-datepicker',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <div class="w-full max-w-md">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Select Date
      </label>
      <ngxsmk-datepicker
        [value]="selectedDate"
        (valueChange)="selectedDate = $event"
        [classes]="tailwindClasses">
      </ngxsmk-datepicker>
    </div>
  `,
  styles: [`
    :host ::ng-deep .ngxsmk-input-group {
      @apply border border-gray-300 rounded-lg px-4 py-2 
             focus-within:ring-2 focus-within:ring-blue-500 
             focus-within:border-blue-500 transition-all;
    }
    
    :host ::ng-deep .ngxsmk-display-input {
      @apply w-full outline-none text-gray-900;
    }
    
    :host ::ng-deep .ngxsmk-popover-container {
      @apply shadow-lg rounded-lg border border-gray-200;
    }
    
    :host ::ng-deep .ngxsmk-day-cell.selected {
      @apply bg-blue-500 text-white;
    }
    
    :host ::ng-deep .ngxsmk-day-cell:hover:not(.disabled) {
      @apply bg-blue-50;
    }
  `]
})
export class TailwindDatepickerComponent {
  selectedDate: Date | null = null;
  
  tailwindClasses = {
    wrapper: 'tailwind-datepicker',
    inputGroup: 'tailwind-input-group',
    popover: 'tailwind-popover'
  };
}
```

### With Tailwind Utility Classes

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent, ThemeBuilderService } from 'ngxsmk-datepicker';
import { inject } from '@angular/core';

@Component({
  selector: 'app-tailwind-themed-datepicker',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <div class="container mx-auto p-4">
      <ngxsmk-datepicker
        [value]="selectedDate"
        (valueChange)="selectedDate = $event"
        [theme]="tailwindTheme"
        class="w-full">
      </ngxsmk-datepicker>
    </div>
  `
})
export class TailwindThemedDatepickerComponent {
  private themeBuilder = inject(ThemeBuilderService);
  selectedDate: Date | null = null;
  
  tailwindTheme = {
    colors: {
      primary: '#3b82f6', // Tailwind blue-500
      background: '#ffffff',
      text: '#111827', // gray-900
      border: '#d1d5db', // gray-300
      hover: '#f3f4f6' // gray-100
    },
    spacing: {
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem'
    },
    borderRadius: {
      md: '0.5rem',
      lg: '0.75rem'
    }
  };
  
  constructor() {
    // Apply theme globally
    this.themeBuilder.applyTheme(this.tailwindTheme);
  }
}
```

## Custom Styling Tips

### Using CSS Variables

All datepicker styles can be customized using CSS variables:

```css
:root {
  --datepicker-primary-color: #3b82f6;
  --datepicker-background: #ffffff;
  --datepicker-text-color: #111827;
  --datepicker-border-color: #d1d5db;
  --datepicker-spacing-md: 1rem;
  --datepicker-radius-md: 0.5rem;
}
```

### Scoped Styling

For component-specific styling:

```typescript
@Component({
  styles: [`
    :host ::ng-deep .ngxsmk-datepicker-wrapper {
      /* Your custom styles */
    }
  `]
})
```

### Theme Builder Service

For dynamic theming:

```typescript
import { ThemeBuilderService } from 'ngxsmk-datepicker';

constructor(private themeBuilder: ThemeBuilderService) {
  const theme = {
    colors: {
      primary: '#your-color',
      // ... other colors
    }
  };
  
  // Apply globally
  this.themeBuilder.applyTheme(theme);
  
  // Or get CSS-in-JS style object
  const styles = this.themeBuilder.generateStyleObject(theme);
}
```

## Best Practices

1. **Consistent Theming**: Use your framework's design tokens (colors, spacing, etc.) when creating themes
2. **Accessibility**: Ensure your custom themes maintain sufficient color contrast
3. **Responsive Design**: Test datepicker on different screen sizes, especially when using multi-calendar mode
4. **Performance**: Use `OnPush` change detection strategy when possible
5. **Localization**: Set the `locale` input to match your application's locale

## Troubleshooting

### Styles Not Applying

- Ensure your styles are scoped correctly using `::ng-deep` or view encapsulation
- Check that CSS variables are defined in the correct scope
- Verify that the theme object structure matches the `DatepickerTheme` interface

### Integration Issues

- Make sure all required peer dependencies are installed
- Check that Angular version is compatible (Angular 17+)
- Verify that standalone components are properly imported

## React, Vue, & Vanilla JS (Web Components)

Since `ngxsmk-datepicker` is built as a highly isolated Angular library without heavy dependencies, it can be compiled into **Custom Web Components** using Angular Elements. This allows you to use exactly the same datepicker in React, Vue, Svelte, or Vanilla JavaScript.

### 1. Build as Custom Element

You'll need a wrapper to bootstrap the Angular component as a custom element:

```typescript
import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

(async () => {
  const app = await createApplication();

  const DatepickerElement = createCustomElement(NgxsmkDatepickerComponent, {
    injector: app.injector
  });

  customElements.define('ngxsmk-datepicker', DatepickerElement);
})().catch(err => console.error(err));
```

### 2. Framework-specific Usage

Once registered as `<ngxsmk-datepicker>`, you can use it in any framework.

#### React Example
```jsx
import React, { useEffect, useRef } from 'react';

export function MyView() {
  const datepickerRef = useRef(null);
  
  useEffect(() => {
    // Listen to native custom events
    const picker = datepickerRef.current;
    const handleSelect = (e) => console.log('Selected:', e.detail);
    
    picker.addEventListener('dateSelect', handleSelect);
    return () => picker.removeEventListener('dateSelect', handleSelect);
  }, []);

  return (
    <ngxsmk-datepicker 
      ref={datepickerRef} 
      mode="range" 
      theme="light">
    </ngxsmk-datepicker>
  );
}
```

#### Vue Example
```html
<script setup>
import { ref } from 'vue';

const date = ref(null);
const onDateSelect = (e) => {
  date.value = e.detail;
};
</script>

<template>
  <ngxsmk-datepicker 
    mode="single" 
    @dateSelect="onDateSelect"
  ></ngxsmk-datepicker>
</template>
```

#### Vanilla JS
```html
<ngxsmk-datepicker id="myPicker"></ngxsmk-datepicker>

<script>
  const picker = document.getElementById('myPicker');
  picker.addEventListener('dateSelect', (e) => {
    alert('Date selected: ' + e.detail);
  });
</script>
```

## Modals and overlays

When using the datepicker inside a modal, dialog, or overlay (e.g. `role="dialog"`, Angular Material dialog, or a custom modal), set **`[appendToBody]="true"`** so the calendar popover is appended to `document.body`. This avoids stacking-context and overflow issues and ensures the popover positions correctly and does not flash in the wrong place on first open. The library can auto-detect some modal containers and enable append-to-body; for reliability we recommend setting it explicitly:

```html
<ngxsmk-datepicker
  [appendToBody]="true"
  [(ngModel)]="myDate"
  placeholder="Pick a date">
</ngxsmk-datepicker>
```

See the demo app **Integrations** page for a full "Datepicker in a modal" example.

## Additional Resources

- [API Documentation](./API.md)
- [Theme Guide](./THEME-TOKENS.md)
- [Locale Guide](./LOCALE-GUIDE.md)



