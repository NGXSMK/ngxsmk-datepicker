<!--
  SEO Keywords: Angular DatePicker, Angular Date Range Picker, Lightweight Calendar Component, Angular Signals DatePicker, SSR Ready DatePicker, Zoneless Angular, A11y DatePicker, Mobile-Friendly DatePicker, Ionic DatePicker
  Meta Description: The most powerful, lightweight, and accessible date and range picker for modern Angular (17-21+). Built with Signals, Zoneless-ready, and zero dependencies.
-->

<div align="center">
  <img src="projects/ngxsmk-datepicker/docs/header-banner.png" alt="ngxsmk-datepicker - Lightweight Angular Date Range Picker" width="100%" />

# **ngxsmk-datepicker** – Modern Angular Date Picker & Range Picker

### _The Gold Standard for Premium Angular Calendar Selection_

[![npm version](https://img.shields.io/npm/v/ngxsmk-datepicker.svg?style=flat-square&color=6d28d9)](https://www.npmjs.com/package/ngxsmk-datepicker)
[![Angular](https://img.shields.io/badge/Angular-17%2B-DD0031.svg?style=flat-square&logo=angular)](https://angular.io/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/NGXSMK/ngxsmk-datepicker/blob/main/LICENSE)
[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-toozuuu-orange?style=flat-square&logo=buy-me-a-coffee)](https://buymeacoffee.com/toozuuu)
[![Bundle Size](https://img.shields.io/badge/bundle-~127KB-success.svg?style=flat-square)](https://bundlephobia.com/package/ngxsmk-datepicker)
[![Zoneless](https://img.shields.io/badge/Zoneless-Ready-blueviolet.svg?style=flat-square)](https://angular.dev/guide/zoneless)

**`npm i ngxsmk-datepicker`**

[Explore Live Demo](https://ngxsmk.github.io/ngxsmk-datepicker/) • [Buy me a coffee](https://buymeacoffee.com/toozuuu) • [API Documentation](https://github.com/NGXSMK/ngxsmk-datepicker/blob/main/projects/ngxsmk-datepicker/docs/API.md) • [Submit Issue](https://github.com/NGXSMK/ngxsmk-datepicker/issues)

</div>

---

**Last updated:** May 2, 2026 · **Current stable:** v2.2.12

### **Overview**

**ngxsmk-datepicker** is a high-performance, enterprise-ready date and range picker engineered for the modern Angular ecosystem (v17+). Built from the ground up with **Angular Signals**, it delivers a seamless, zoneless-ready experience for both desktop and mobile (Ionic) applications.

> **Stable Release**: `v2.2.12` restores correct **npm** artifacts (compiled `fesm2022/` and types), adds range-mode **`allowSameDay`** for single-day selections, and continues to ship **IANA timezone** support, validation fixes, and strict TypeScript improvements from the v2.2.x line.
>
> ⚠️ **Important**: Versions 2.0.10 and 2.0.11 are broken and have been unpublished. Please use v2.2.12 or later.

---

### **📌 Table of Contents**

1. [📷 Screenshots](#-screenshots)
2. [✨ Features](#-features)
3. [📋 Compatibility](#-compatibility)
4. [🌍 Localization (i18n)](#-localization-i18n)
5. [📦 Installation](#-installation)
6. [🚀 Quick Start](#-quick-start)
7. [🔌 Framework Integration](#-framework-integration)
8. [⚙️ API Reference](#-api-reference)
9. [🎨 Theming](#-theming)
10. [⌨️ Keyboard Navigation](#-keyboard-navigation)

---

## 📷 Screenshots

<p align="center">
  <img src="https://github.com/NGXSMK/ngxsmk-datepicker/raw/main/projects/ngxsmk-datepicker/docs/1.png" alt="Angular Standalone DatePicker Single Selection Mode" width="30%" />
  <img src="https://github.com/NGXSMK/ngxsmk-datepicker/raw/main/projects/ngxsmk-datepicker/docs/2.png" alt="Angular Date Range Picker Selection Mode" width="30%" />
  <img src="https://github.com/NGXSMK/ngxsmk-datepicker/raw/main/projects/ngxsmk-datepicker/docs/3.png" alt="Mobile Angular DatePicker Ionic Compatibility" width="30%" />
</p>

## **✨ Features**

### **Core Capabilities**

- 💎 **Signal-Driven Engine**: Hyper-reactive state management using Angular Signals.
- 🌓 **Native Dark Mode**: Beautifully crafted themes for light and dark environments.
- 📱 **Mobile-First UX**: Native mobile picker integration with touch gestures and haptic feedback.
- 🧩 **Zero Dependencies**: Lightweight standalone component with no external bloat.
- ⚡ **Performance++**: Lazy-loaded calendar months, memoized calculations, and tree-shakable architecture.

### **Advanced Functionality**

- 📅 **Google Calendar Sync**: Built-in support for seamlessly syncing and displaying events natively from Google Calendar.
- 🌐 **8-Language i18n**: Full localization for `en`, `de`, `es`, `sv`, `ko`, `zh`, `ja`, and `fr`.
- 🛠️ **Plugin Architecture**: Extend functionality via hooks for rendering, validation, and shortcuts.
- 🧪 **Signal Forms Native**: Direct integration with Angular 21's new Signal Forms API.
- 🚀 **Zoneless Ready**: Optimized for the future of Angular—works perfectly without zone.js.
- ♿ **Full Accessibility**: WAI-ARIA compliant with extensive keyboard navigation support.

## **📋 Compatibility**

For detailed compatibility information, see [COMPATIBILITY.md](https://github.com/NGXSMK/ngxsmk-datepicker/blob/main/projects/ngxsmk-datepicker/docs/COMPATIBILITY.md).

### Quick Reference

| Angular Version | Status             | Core Features | Signal Forms | SSR | Zoneless |
| --------------- | ------------------ | ------------- | ------------ | --- | -------- |
| Angular 17      | ✅ Fully Supported | ✅ All        | ❌           | ✅  | ✅       |
| Angular 18      | ✅ Fully Supported | ✅ All        | ❌           | ✅  | ✅       |
| Angular 19      | ✅ Fully Supported | ✅ All        | ❌           | ✅  | ✅       |
| Angular 20      | ✅ Fully Supported | ✅ All        | ❌           | ✅  | ✅       |
| Angular 21      | ✅ Fully Supported | ✅ All        | ✅           | ✅  | ✅       |
| Angular 22+     | 🔄 Future Support  | ✅ All        | ✅           | ✅  | ✅       |

**Zone.js**: Optional - The library works with or without Zone.js (zoneless apps supported)

**SSR**: ✅ Fully compatible with Angular Universal and server-side rendering

**Peer Dependencies**: `@angular/core >=17.0.0 <24.0.0`

## **🔒 API Stability & Deprecation Policy**

### API Stability Guarantees

- **Public API**: All public APIs (inputs, outputs, methods) are stable within a major version
- **Experimental Features**: Features marked as `experimental` may change in minor versions
- **Internal APIs**: Private methods and internal services are not part of the public API and may change without notice

### Deprecation Policy

- **Deprecation Period**: Features are deprecated for at least **2 major versions** before removal
- **Deprecation Warnings**:
  - `@deprecated` JSDoc tags in code
  - Console warnings in development mode
  - Clear documentation in CHANGELOG.md
- **Migration Guides**: Provided in `MIGRATION.md` for all breaking changes
- **Breaking Changes**: Only occur in major version releases (semver)

### Stable APIs

The following are considered stable public APIs:

- Component inputs and outputs (`@Input()`, `@Output()`)
- Public methods documented in API docs
- Exported types and interfaces
- Service APIs (when marked as public)

### Experimental Features

Features marked as experimental may change:

- Signal Forms support (`[field]` input) - Experimental in v1.9.x, stable in v2.0.0+
- Some advanced selection modes
- Plugin architecture hooks (subject to refinement)

For details, see [CONTRIBUTING.md](https://github.com/NGXSMK/ngxsmk-datepicker/blob/main/CONTRIBUTING.md#deprecation-policy).

## **📦 Installation**

```bash
npm install ngxsmk-datepicker@2.2.12
```

### Alternative installation

You can install without npm using any of these methods (peer dependencies must still be installed in your app):

| Method | Command |
|--------|--------|
| **Yarn** | `yarn add ngxsmk-datepicker@2.2.12` |
| **pnpm** | `pnpm add ngxsmk-datepicker@2.2.12` |
| **Bun** | `bun add ngxsmk-datepicker@2.2.12` |
| **From Git** | `npm install github:NGXSMK/ngxsmk-datepicker#v2.2.12` (requires the repo to have built output or you build from source) |
| **Local path** | Build the library in the repo (`npx ng build ngxsmk-datepicker`), then `npm install /path/to/ngxsmk-datepicker/dist/ngxsmk-datepicker` |
| **CDN (ESM)** | Use [unpkg](https://unpkg.com/ngxsmk-datepicker@2.2.12/) or [jsDelivr](https://cdn.jsdelivr.net/npm/ngxsmk-datepicker@2.2.12/) in your bundler or import map; peer dependencies (Angular, etc.) must be installed in your app. |

For all options and caveats, see [docs/INSTALLATION.md](docs/INSTALLATION.md).

## **Usage**

ngxsmk-datepicker is a standalone component, so you can import it directly into your component or module.

### Signal Forms (Angular 21)

You can bind directly to a writable Signal using standard two-way binding. This works seamlessly alongside traditional Reactive Forms.

```ts
import { signal } from "@angular/core";
import { DatepickerValue } from "ngxsmk-datepicker";

export class MyComponent {
  dateSig = signal<DatepickerValue>(null);
}
```

```html
<ngxsmk-datepicker mode="single" [value]="dateSig()" (valueChange)="dateSig.set($event)"> </ngxsmk-datepicker>

<p>Signal value: {{ dateSig() | json }}</p>
```

This pattern is also compatible with computed/linked signals produced by `httpResource`, enabling powerful data flows with Angular 21.

### Signal Forms with `[field]` Input (Angular 21+)

For direct integration with Angular Signal Forms, use the `[field]` input. The datepicker automatically tracks dirty state when using this binding:

```typescript
import { Component, signal, form, objectSchema } from "@angular/core";
import { NgxsmkDatepickerComponent } from "ngxsmk-datepicker";

@Component({
  selector: "app-form",
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <form>
      <ngxsmk-datepicker [field]="myForm.dateInQuestion" mode="single" placeholder="Select a date"> </ngxsmk-datepicker>
    </form>
  `,
})
export class FormComponent {
  localObject = signal({ dateInQuestion: new Date() });

  myForm = form(
    this.localObject,
    objectSchema({
      dateInQuestion: objectSchema<Date>(),
    }),
  );
}
```

The `[field]` input provides automatic two-way binding with signal forms - no manual event handling needed! It also automatically tracks the form's dirty state, so `form().dirty()` will return `true` after a user selects a date.

For detailed Signal Forms integration including dirty state tracking, see the [Signal Forms Integration Guide](https://github.com/NGXSMK/ngxsmk-datepicker/blob/main/projects/ngxsmk-datepicker/docs/signal-forms.md).

### Documentation

- **[Plugin Architecture](https://github.com/NGXSMK/ngxsmk-datepicker/blob/main/projects/ngxsmk-datepicker/docs/PLUGIN-ARCHITECTURE.md)** - Complete guide to the plugin architecture and hook system
- **[Signals Integration Guide](https://github.com/NGXSMK/ngxsmk-datepicker/blob/main/projects/ngxsmk-datepicker/docs/signals.md)** - Complete guide to using signals with the datepicker
- **[Signal Forms Guide](https://github.com/NGXSMK/ngxsmk-datepicker/blob/main/projects/ngxsmk-datepicker/docs/signal-forms.md)** - Deep dive into Signal Forms integration
- **[SSR Guide](https://github.com/NGXSMK/ngxsmk-datepicker/blob/main/projects/ngxsmk-datepicker/docs/ssr.md)** - Server-side rendering setup and best practices
- **[SSR Example](https://github.com/NGXSMK/ngxsmk-datepicker/blob/main/projects/ngxsmk-datepicker/docs/SSR-EXAMPLE.md)** - Complete Angular Universal example with hydration notes
- **[Extension Points Guide](https://github.com/NGXSMK/ngxsmk-datepicker/blob/main/projects/ngxsmk-datepicker/docs/extension-points.md)** - Customization hooks and extension points
- **[Theme Tokens Reference](https://github.com/NGXSMK/ngxsmk-datepicker/blob/main/projects/ngxsmk-datepicker/docs/THEME-TOKENS.md)** - Complete CSS custom properties reference with examples
- **[API Documentation](https://github.com/NGXSMK/ngxsmk-datepicker/blob/main/projects/ngxsmk-datepicker/docs/API.md)** - Complete public API reference

#### **1. Import the Component**

All public exports (component, utilities, types, services) come from the main package entry: `'ngxsmk-datepicker'` (there is no separate `/utils` subpath). In your component file (e.g., app.component.ts), import the component (or the module—see troubleshooting below).

    import { Component } from '@angular/core';
    import { NgxsmkDatepickerComponent, DateRange, HolidayProvider } from 'ngxsmk-datepicker';

    @Component({
      selector: 'app-root',
      standalone: true,
      imports: [NgxsmkDatepickerComponent],
      templateUrl: './app.component.html',
    })
    export class AppComponent {
      // Example for predefined ranges
      public myRanges: DateRange = {
        'Today': [new Date(), new Date()],
        'Last 7 Days': [new Date(new Date().setDate(new Date().getDate() - 6)), new Date()],
        'This Month': [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)],
      };

      // Example for disabling weekends
      isWeekend = (date: Date): boolean => {
        const day = date.getDay();
        return day === 0 || day === 6; // Sunday or Saturday
      };

      onDateChange(value: Date | { start: Date; end: Date } | Date[]) {
        console.log('Date changed:', value);
      }
    }

**If you see NG1010** (`'imports' must be an array... Value could not be determined statically`) when using the Angular compiler plugin or in strict AOT builds, use the wrapper module instead: `import { NgxsmkDatepickerModule } from 'ngxsmk-datepicker'` and set `imports: [NgxsmkDatepickerModule]`. The template stays the same (`<ngxsmk-datepicker>`).

#### **2. Add it to Your Template**

Use the `<ngxsmk-datepicker>` selector in your HTML template.

````html
<h2>Advanced Date Range Picker</h2>

<ngxsmk-datepicker [mode]="'range'" [ranges]="myRanges" [showTime]="true" [minuteInterval]="15" [minDate]="today" [isInvalidDate]="isWeekend" [locale]="'en-US'" [theme]="'light'" [inline]="'auto'" (valueChange)="onDateChange($event)"></ngxsmk-datepicker>

#### **3. Disabled Dates Example** Disable specific dates by passing an array of date strings or Date objects: ```typescript // In your component disabledDates = ['10/21/2025', '08/21/2025', '10/15/2025', '10/8/2025', '10/3/2025']; // In your template
<ngxsmk-datepicker [mode]="'single'" [disabledDates]="disabledDates" placeholder="Select a date"> </ngxsmk-datepicker>
````

#### **4. Holiday Tooltips Example**

Holiday dates automatically show tooltips when you hover over them:

```typescript
// Holiday provider with tooltips
class MyHolidayProvider implements HolidayProvider {
  private holidays: { [key: string]: string } = {
    '2025-01-01': 'New Year\'s Day',
    '2025-07-04': 'Independence Day',
    '2025-12-25': 'Christmas Day',
  };

  isHoliday(date: Date): boolean {
    const key = this.formatDateKey(date);
    return !!this.holidays[key];
  }

  getHolidayLabel(date: Date): string | null {
    const key = this.formatDateKey(date);
    return this.holidays[key] || null;
  }
}

// In your template
<ngxsmk-datepicker
  [holidayProvider]="holidayProvider"
  [disableHolidays]="false"
  placeholder="Hover over holidays to see tooltips">
</ngxsmk-datepicker>
```

## **🔌 Framework Integration**

### **Angular Material Form Fields**

Integrate with Angular Material's form field components for a seamless Material Design experience. Works with both standalone and non-standalone components:

**Standalone Components:**

```typescript
import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { NgxsmkDatepickerComponent } from "ngxsmk-datepicker";

@Component({
  selector: "app-material-form",
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgxsmkDatepickerComponent],
  template: `
    <form [formGroup]="myForm">
      <mat-form-field appearance="outline">
        <mat-label>Select Date</mat-label>
        <ngxsmk-datepicker mode="single" formControlName="date" placeholder="Choose a date"> </ngxsmk-datepicker>
      </mat-form-field>
    </form>
  `,
})
export class MaterialFormComponent {
  myForm = new FormGroup({
    date: new FormControl<Date | null>(null),
  });
}
```

**Non-Standalone (NgModules):** Add the directive file from [INTEGRATION.md § Angular Material](projects/ngxsmk-datepicker/docs/INTEGRATION.md#angular-material), then add it to your module `imports` (with `NgxsmkDatepickerComponent`, `MatFormFieldModule`, etc.) and use `ngxsmkMatFormFieldControl` on the datepicker in templates.

**With Date Range:**

```html
<mat-form-field appearance="fill">
  <mat-label>Date Range</mat-label>
  <ngxsmk-datepicker mode="range" [showTime]="true" formControlName="dateRange"> </ngxsmk-datepicker>
</mat-form-field>
```

### **Ionic Components**

For best integration with Ionic, import the integration styles in your global CSS/SCSS file:

```css
@import "ngxsmk-datepicker/styles/ionic-integration.css";
```

**Automatic Theming:**
The datepicker automatically detects and uses Ionic CSS variables (e.g., `--ion-color-primary`, `--ion-background-color`) so it matches your app's theme out of the box without extra configuration.

Works seamlessly with Ionic form components and follows Ionic design patterns:

```typescript
import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { IonItem, IonLabel, IonInput } from "@ionic/angular/standalone";
import { NgxsmkDatepickerComponent } from "ngxsmk-datepicker";

@Component({
  selector: "app-ionic-form",
  standalone: true,
  imports: [ReactiveFormsModule, IonItem, IonLabel, IonInput, NgxsmkDatepickerComponent],
  template: `
    <form [formGroup]="myForm">
      <ion-item>
        <ion-label position="stacked">Appointment Date</ion-label>
        <ngxsmk-datepicker mode="single" formControlName="appointmentDate" placeholder="Select date"> </ngxsmk-datepicker>
      </ion-item>
    </form>
  `,
})
export class IonicFormComponent {
  myForm = new FormGroup({
    appointmentDate: new FormControl<Date | null>(null),
  });
}
```

**With Ionic Datetime Styling:**

```html
<ion-item>
  <ion-label>Check-in / Check-out</ion-label>
  <ngxsmk-datepicker mode="range" [theme]="'light'" formControlName="bookingDates"> </ngxsmk-datepicker>
</ion-item>
```

### **React, Vue, & Vanilla JS (Web Components)**

Because `ngxsmk-datepicker` is highly decoupled from heavy external dependencies, it can be exported as a standard Custom Web Component using Angular Elements. This allows you to use exactly the same datepicker in React, Vue, Svelte, or Vanilla JavaScript projects seamlessly!

**1. Create a Custom Element Wrapper**
```typescript
import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

(async () => {
  const app = await createApplication();
  const DatepickerElement = createCustomElement(NgxsmkDatepickerComponent, { injector: app.injector });
  customElements.define('ngxsmk-datepicker', DatepickerElement);
})().catch(console.error);
```

**2. Use It Natively Anywhere**
```html
<!-- In any HTML, React, Vue, or Svelte file -->
<ngxsmk-datepicker id="myPicker" mode="range" theme="light"></ngxsmk-datepicker>

<script>
  // Add native DOM event listeners
  document.getElementById('myPicker').addEventListener('dateSelect', (e) => {
    console.log('Selected date:', e.detail);
  });
</script>
```

For full working examples (including React & Vue bindings), check out the `/examples` directory in our GitHub repository!

### **Plain HTML Inputs**

Use with standard HTML form inputs for maximum flexibility:

```typescript
import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NgxsmkDatepickerComponent } from "ngxsmk-datepicker";

@Component({
  selector: "app-plain-form",
  standalone: true,
  imports: [ReactiveFormsModule, NgxsmkDatepickerComponent],
  template: `
    <form [formGroup]="myForm">
      <label for="birthdate">Birth Date</label>
      <ngxsmk-datepicker id="birthdate" mode="single" formControlName="birthdate" placeholder="MM/DD/YYYY"> </ngxsmk-datepicker>

      <button type="submit">Submit</button>
    </form>
  `,
})
export class PlainFormComponent {
  myForm = new FormGroup({
    birthdate: new FormControl<Date | null>(null),
  });
}
```

**With Native HTML5 Validation:**

```html
<form [formGroup]="myForm">
  <div class="form-group">
    <label for="event-date">Event Date *</label>
    <ngxsmk-datepicker id="event-date" mode="single" formControlName="eventDate" [minDate]="today" required> </ngxsmk-datepicker>
  </div>
</form>
```

### **Form Validation**

By default, the datepicker input is `readonly` to prevent invalid date strings and force selection via the calendar. However, **browsers do not validate `readonly` fields** during native form submission.

**Behavior:**

- Native browser validation (e.g., blocking submit on `required` fields) will **NOT** trigger on the datepicker by default.
- Custom validation (e.g., Angular validators) works normally but often only shows errors after the control is "touched".

**Solutions:**

1. **Enable Typing (Recommended for Native Validation):**
   Set `[allowTyping]="true"` to make the input standard editable field. This enables native browser validation tooltips and submit-blocking.

   ```html
   <ngxsmk-datepicker [allowTyping]="true" required ...></ngxsmk-datepicker>
   ```

2. **Custom Validation Logic:**
   If you prefer the readonly behavior, ensure your form submission handler explicitly checks `form.invalid` before proceeding, as the browser won't stop the submit button click.

## **⚙️ API Reference**

### **Inputs**

| Property           | Type | Default | Description |
| :----------------- | :--- | :------ | :---------- |
| mode               | 'single' \| 'range' \| 'multiple' | 'single' | The selection mode. |
| inline             | boolean \| 'always' \| 'auto' | false | Controls the display mode. `true` or `'always'` for inline, `'auto'` for responsive. |
| locale             | string | navigator.language | Sets the locale for language and regional formatting (e.g., 'en-US', 'de-DE'). |
| theme              | 'light' \| 'dark' | 'light' | The color theme. |
| showRanges         | boolean | true | If true, displays the predefined ranges panel when in 'range' mode. |
| minDate            | DateInput | null | The earliest selectable date. |
| maxDate            | DateInput | null | The latest selectable date. |
| isInvalidDate      | (date: Date) => boolean | () => false | A function to programmatically disable specific dates. |
| ranges             | DateRange | null | An object of predefined date ranges. |
| minuteInterval     | number | 1 | Interval for minute dropdown options. |
| showTime           | boolean | false | Enables the hour/minute/AM/PM selection section. |
| timeOnly           | boolean | false | Display time picker only (no calendar). Automatically enables `showTime`. |
| use24Hour          | boolean | false | Enable 24-hour time format (00-23) and hide AM/PM selector. |
| allowTyping        | boolean | false | Enable manual typing in the input field. Required for native validation. |
| displayFormat      | string | null | Custom date format string (e.g., 'MM/DD/YYYY'). |
| showCalendarButton | boolean | false | Show/hide the calendar icon button. |
| value              | DatepickerValue | null | Programmatic value setting from code. |
| startAt            | DateInput | null | The date to initially center the calendar view on. |
| holidayProvider    | HolidayProvider | null | An object that provides holiday information. |
| disableHolidays    | boolean | false | If true, disables holiday dates from being selected. |
| disabledDates      | (string \| Date)[] | [] | Array of dates to disable. |
| weekStart          | number \| null | null | Override week start day (0=Sunday, 1=Monday, etc.). |
| yearRange          | number | 10 | Number of years before/after current year to show in year dropdown. |
| clearLabel         | string | 'Clear' | Custom label for the clear button. |
| closeLabel         | string | 'Close' | Custom label for the close button. |
| prevMonthAriaLabel | string | 'Previous month' | Aria label for previous month navigation button. |
| nextMonthAriaLabel | string | 'Next month' | Aria label for next month navigation button. |
| clearAriaLabel     | string | 'Clear selection' | Aria label for clear button. |
| closeAriaLabel     | string | 'Close calendar' | Aria label for close button. |
| classes            | object | undefined | Tailwind-friendly class overrides (wrapper, input, popover, etc.). |
| enableGoogleCalendar| boolean | false | Enable seamless Google Calendar integration and sync. |
| googleClientId     | string \| null | null | Google API OAuth 2.0 Web Client ID for authentication. |

### **Outputs**

| Event       | Payload                         | Description                                                   |
| :---------- | :------------------------------ | :------------------------------------------------------------ |
| valueChange | DatepickerValue                 | Emits the newly selected date, range, or array of dates.      |
| action      | { type: string; payload?: any } | Emits various events like `dateSelected`, `timeChanged`, etc. |
| googleSyncClick | void                          | Emitted when the user clicks the Google Calendar sync button. |

## **🎨 Theming**

### CSS Variables

You can easily customize the colors of the datepicker by overriding the CSS custom properties in your own stylesheet.

```css
ngxsmk-datepicker {
  --datepicker-primary-color: #d9267d;
  --datepicker-primary-contrast: #ffffff;
  --datepicker-range-background: #fce7f3;
}
```

### Tailwind/ngClass Support

For Tailwind CSS or custom class-based theming, use the `classes` input:

```html
<ngxsmk-datepicker
  mode="single"
  [classes]="{
    inputGroup: 'rounded-lg border',
    input: 'px-3 py-2 text-sm',
    popover: 'shadow-2xl',
    dayCell: 'hover:bg-indigo-50',
    footer: 'flex justify-end gap-2',
    clearBtn: 'btn btn-ghost',
    calendarBtn: 'btn btn-icon',
    closeBtn: 'btn btn-primary'
  }"
>
</ngxsmk-datepicker>
```

### Dark Theme

To enable the dark theme, simply bind the theme input:

```html
<ngxsmk-datepicker [theme]="'dark'"></ngxsmk-datepicker>
```

### Calendar Button Visibility

Control the visibility of the calendar icon button:

```html
<!-- Hide calendar button (default - users can still click input to open calendar) -->
<ngxsmk-datepicker mode="single"> </ngxsmk-datepicker>

<!-- Show calendar button -->
<ngxsmk-datepicker [showCalendarButton]="true" mode="single"> </ngxsmk-datepicker>

<!-- Useful with allowTyping for custom UI -->
<ngxsmk-datepicker [allowTyping]="true" [showCalendarButton]="false" mode="single"> </ngxsmk-datepicker>
```

## **🌍 Localization (i18n)**

The `locale` input controls all internationalization. It automatically formats month names, weekday names, and sets the first day of the week based on BCP 47 language tags.

### **Global Language Support**

ngxsmk-datepicker v2.2.12 now features **full localization synchronization** for:

- �� English (`en`)
- �� German (`de`)
- �� French (`fr`)
- �� Spanish (`es`)
- 🇸🇪 Swedish (`sv`)
- �� Korean (`ko`)
- �� Chinese (`zh`)
- �� Japanese (`ja`)

### **Usage Example**

```html
<!-- Force German Locale -->
<ngxsmk-datepicker [locale]="'de-DE'"></ngxsmk-datepicker>

<!-- Swedish with YYYY-MM-DD format and Monday week start -->
<ngxsmk-datepicker [locale]="'sv-SE'"></ngxsmk-datepicker>
```

The component automatically uses ISO 8601 standards (Monday start) for European locales and appropriate regional date formats.

## **🖥️ Server-Side Rendering (SSR)**

The datepicker is fully compatible with Angular Universal and server-side rendering:

- ✅ All browser APIs are platform-checked
- ✅ No `window` or `document` access during initialization
- ✅ Works with partial hydration
- ✅ Compatible with zoneless applications

See the [SSR Guide](./projects/ngxsmk-datepicker/docs/ssr.md) for detailed setup instructions.

## **⌨️ Keyboard Navigation**

The datepicker supports full keyboard navigation for accessibility:

### Built-in Shortcuts

- **Arrow Keys** (← → ↑ ↓): Navigate between dates
- **Page Up/Down**: Navigate months (Shift + Page Up/Down for years)
- **Home/End**: Jump to first/last day of month
- **Enter/Space**: Select focused date
- **Escape**: Close calendar (popover mode)
- **T**: Select today's date
- **Y**: Select yesterday
- **N**: Select tomorrow
- **W**: Select next week (7 days from today)
- **Tab**: Navigate between interactive elements
- **?** (Shift + /): Toggle keyboard shortcuts help dialog

### Custom Keyboard Shortcuts

You can add custom keyboard shortcuts using the `hooks` input or `customShortcuts` input:

```typescript
import { DatepickerHooks, KeyboardShortcutContext } from "ngxsmk-datepicker";

const myHooks: DatepickerHooks = {
  handleShortcut: (event, context) => {
    if (event.ctrlKey && event.key === "1") {
      // Custom action
      return true; // Handled
    }
    return false; // Use default
  },
};
```

```html
<ngxsmk-datepicker [hooks]="myHooks" [customShortcuts]="shortcuts" mode="single"> </ngxsmk-datepicker>
```

All date cells are keyboard accessible with proper ARIA attributes for screen readers. The component is built with **accessibility in mind**: keyboard navigation, ARIA roles and labels, and live regions for announcements. For details see [API.md – Keyboard Support](projects/ngxsmk-datepicker/docs/API.md#keyboard-support) and the ARIA-related inputs (e.g. `closeAriaLabel`, `clearAriaLabel`) in the API reference.

See [Extension Points Guide](./projects/ngxsmk-datepicker/docs/extension-points.md) for detailed customization options.

## **🚀 Performance Optimizations**

This library has been optimized for maximum performance:

- **30% Smaller Bundle**: Optimized build configuration and tree-shaking
- **40% Faster Rendering**: OnPush change detection strategy with proper triggers
- **60% Faster Selection**: Memoized date comparisons and debounced operations
- **Zero Dependencies**: Standalone component with no external dependencies
- **Tree-shakable**: Only import what you need
- **Memory Efficient**: Cache size limits prevent memory leaks
- **Hardware Accelerated**: CSS optimizations for smooth animations
- **Mobile Optimized**: Touch-friendly interactions and responsive design

## **🐛 Bug Fixes & Improvements**

### **Critical Updates in v2.2.6:**

- ✅ **Timezone Support**: Added full support for IANA timezones in "Today" calculation.
- ✅ **Date Validation**: Fixed "Today" unselectable bug by normalizing `minDate` boundary checks.
- ✅ **Keyboard Shortcuts**: Updated "Today" selection shortcut to use timezone-aware calculation.
- ✅ **Validation messages**: User-facing i18n strings for invalid date, min/max; `validationError` output and on-screen error display
- ✅ **Change Detection**: Fixed OnPush change detection issues with proper `markForCheck()` triggers
- ✅ **Date Comparison**: Fixed null safety issues in date range comparisons
- ✅ **Memory Leaks**: Added cache size limits to prevent memory leaks
- ✅ **Type Safety**: Improved TypeScript types and null safety checks
- ✅ **Mobile UX**: Enhanced mobile interactions and touch feedback
- ✅ **Performance**: Optimized template bindings with memoized functions
- ✅ **Accessibility**: Better focus states and keyboard navigation
- ✅ **Build System**: Improved build configuration and optimization

### **Performance Enhancements:**

- 🚀 **Optimized Bundle Size**: Main bundle ~127KB (source maps excluded from published package)
- 🚀 **40% Faster Rendering**: Enhanced OnPush change detection
- 🚀 **60% Faster Selection**: Memoized date comparisons
- 🚀 **Memory Efficient**: Cache size limits prevent memory leaks
- 🚀 **Hardware Accelerated**: CSS optimizations for smooth animations
- 🚀 **Better Tree-Shaking**: Optimized TypeScript compiler settings for smaller output
- 🚀 **Production Optimized**: Source maps automatically removed from production builds

## **📱 Demo Application**

A comprehensive demo application is included to showcase all features with a modern, polished UI:

```bash
# Clone the repository
git clone https://github.com/NGXSMK/ngxsmk-datepicker.git
cd ngxsmk-datepicker

# Install dependencies
npm install

# Run the demo app
npm start
```

The demo includes:

- **Modern UI Design**: Beautiful glassmorphism effects, gradient themes, and polished visual hierarchy
- **Responsive Navigation**: Modern navbar with search, theme toggle, and mobile-friendly menu
- **Enhanced Sidebar**: Redesigned documentation sidebar with smooth animations and visual indicators
- **Signal Forms (Angular 21)** with writable signal binding examples
- **Theming** with CSS variables and Tailwind classes examples
- **Customization & A11y** with weekStart, yearRange, labels, and aria examples
- **Holiday Provider Integration** with US holidays
- **Single Date Selection** with weekend restrictions
- **Inline Range Picker** with toggle controls
- **Date Range with Time** selection
- **Multiple Date Selection** with action tracking
- **Programmatic Value Setting** for all selection modes
- **Theme Toggle** (Light/Dark mode) with automatic system preference detection
- **Customizable Calendar Views**: Year-picker, decade-picker, timeline view, and time-slider view

## **🔧 Development**

### **GitHub Actions**

The project uses GitHub Actions for automated deployment:

- **Deploy Demo App**: Automatically deploys the demo application to GitHub Pages on pushes to `main`/`master` branches
  - Workflow: `.github/workflows/deploy-demo.yml`
  - Triggers: Push to main/master or manual workflow dispatch
  - Builds and deploys the demo app to GitHub Pages

### **Building the Library**

```bash
# Build the library (development)
npm run build

# Build optimized production version
# - Removes source maps automatically
# - Optimized TypeScript compilation
# - Enhanced tree-shaking
npm run build:optimized

# Analyze bundle size (excludes source maps)
npm run build:analyze
```

**Build Output:**

- Main bundle: `dist/ngxsmk-datepicker/fesm2022/ngxsmk-datepicker.mjs` (~127KB)
- Type definitions: `dist/ngxsmk-datepicker/index.d.ts`
- Source maps: Automatically removed from production builds

### **Running Tests**

```bash
# Run all tests (library + demo app)
npm test

# Run library tests only
npx ng test ngxsmk-datepicker --no-watch --browsers=ChromeHeadless

# Run specific test file
npx ng test ngxsmk-datepicker --include="**/issue-13.spec.ts"

# Run tests in watch mode
npm test -- --watch
```

### **Code Quality Improvements**

The library now includes:

- ✅ **TypeScript Strict Mode**: Enhanced type safety
- ✅ **ESLint Configuration**: Code quality enforcement
- ✅ **Performance Monitoring**: Built-in performance metrics
- ✅ **Memory Leak Prevention**: Cache size limits and cleanup
- ✅ **Accessibility Testing**: WCAG compliance checks
- ✅ **Mobile Testing**: Touch interaction validation

## **📦 Package Structure**

```
ngxsmk-datepicker/
├── projects/
│   ├── ngxsmk-datepicker/     # Main library
│   └── demo-app/              # Demo application
├── dist/                      # Built packages
├── docs/                      # Documentation
└── scripts/                   # Build scripts
```

## **🎯 Browser Support**

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Mobile Safari** 14+
- **Chrome Mobile** 90+

## **🗺️ Roadmap**

Check out our [Roadmap](https://github.com/NGXSMK/ngxsmk-datepicker/blob/main/ROADMAP.md) to see planned features, improvements, and how you can contribute. We're always looking for contributors, especially for issues labeled `good-first-issue` and `help-wanted`!

## **🤝 Contributions**

We welcome and appreciate contributions from the community! Whether it's reporting a bug, suggesting a new feature, or submitting code, your help is valuable.

### **Development Setup**

1. **Fork the repository** on GitHub
2. **Clone your fork** to your local machine
3. **Install dependencies**: `npm install`
4. **Run the demo app**: `npm start`
5. **Create a feature branch** for your changes
6. **Commit your changes** following conventional commits
7. **Submit a Pull Request** to the main branch

### **Contribution Guidelines**

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass
- Follow conventional commit messages

## **📄 Changelog**

**Recent:** v2.2.12 — npm publish pipeline fix (full `fesm2022`/types), `allowSameDay` range mode, plus TypeScript strictness, appendToBody/popover fixes, and CSS cleanup from v2.2.x. Versions 2.0.10 and 2.0.11 are unpublished; use v2.2.12 or later.

For the full list of changes, see [CHANGELOG.md](https://github.com/NGXSMK/ngxsmk-datepicker/blob/main/CHANGELOG.md).

## **🎨 Theming with TokiForge**

Looking for a powerful theming solution for your Angular application? Check out **[TokiForge](https://tokiforge.github.io/tokiforge/)** — an open-source modern design token & theme engine that provides runtime theme switching for React, Vue, Svelte, Angular, and any framework.

### Why TokiForge?

- ✅ **SSR compatible** — Works seamlessly with Angular Universal

Perfect for managing design tokens, creating theme systems, and implementing dark mode in your Angular applications!

**👉 [Learn more about TokiForge →](https://tokiforge.github.io/tokiforge/)**

---

## **📜 License**

MIT License - see [LICENSE](https://github.com/NGXSMK/ngxsmk-datepicker/blob/main/LICENSE) file for details.

## **🔍 SEO & Discoverability**

This library is optimized for search engine visibility, especially for European markets:

- **Keywords**: Angular datepicker, date range picker, calendar component, Angular 17-21, TypeScript, Signal Forms, SSR compatible
- **European SEO**: Optimized for Germany, France, Spain, Italy, Netherlands, Poland, Portugal, Sweden, Norway, Finland, Denmark, Belgium, Switzerland, Austria, and United Kingdom
- **Multi-language Support**: hreflang tags for 15+ European languages and locales
- **European Geo-targeting**: Geo tags and structured data optimized for European Union countries
- **Meta Tags**: Comprehensive Open Graph and Twitter Card support with European locale alternates
- **Structured Data**: JSON-LD schema markup with European audience targeting and area served information
- **Documentation**: Complete API documentation with examples
- **Performance**: Optimized bundle size (~127KB) for fast loading
- **European Localization**: Full i18n support for European date formats, week start days, and regional preferences

## **👨‍💻 Author**

**Sachin Dilshan**

- 📧 Email: [sachindilshan040@gmail.com](mailto:sachindilshan040@gmail.com)
- 🐙 GitHub: [@toozuuu](https://github.com/toozuuu)
- 📦 NPM: [ngxsmk-datepicker](https://www.npmjs.com/package/ngxsmk-datepicker)
- 🌐 Website: [sachindilshan.com](https://www.sachindilshan.com/)
- 💼 LinkedIn: [sachindilshan](https://www.linkedin.com/in/sachindilshan/)

## **⭐ Support**

If you find this library helpful, please consider:

- ⭐ **Starring** the repository
- 🐛 **Reporting** bugs and issues
- 💡 **Suggesting** new features
- 🤝 **Contributing** code improvements
- 📢 **Sharing** with the community

