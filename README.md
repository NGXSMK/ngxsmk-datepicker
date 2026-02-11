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
[![Bundle Size](https://img.shields.io/badge/bundle-~127KB-success.svg?style=flat-square)](https://bundlephobia.com/package/ngxsmk-datepicker)
[![Zoneless](https://img.shields.io/badge/Zoneless-Ready-blueviolet.svg?style=flat-square)](https://angular.dev/guide/zoneless)

**`npm i ngxsmk-datepicker`**

[Explore Live Demo](https://ngxsmk.github.io/ngxsmk-datepicker/) • [API Documentation](https://github.com/NGXSMK/ngxsmk-datepicker/blob/main/projects/ngxsmk-datepicker/docs/API.md) • [Submit Issue](https://github.com/NGXSMK/ngxsmk-datepicker/issues)

</div>

---

### **Overview**

**ngxsmk-datepicker** is a high-performance, enterprise-ready date and range picker engineered for the modern Angular ecosystem (v17+). Built from the ground up with **Angular Signals**, it delivers a seamless, zoneless-ready experience for both desktop and mobile (Ionic) applications.

> **Stable Release**: `v2.1.3` is live! This major update introduces a significant **UI Refresh (Border Detox)**, **Mobile Stability** improvements, and fixes for circular dependencies.
>
> ⚠️ **Important**: Versions 2.0.10 and 2.0.11 are broken and have been unpublished. Please use v2.1.3 or later.

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
npm install ngxsmk-datepicker@2.1.3
```

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

In your component file (e.g., app.component.ts), import NgxsmkDatepickerComponent.

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

**Non-Standalone Components (NgModules):**

```typescript
import { NgModule } from "@angular/core";
import { MAT_FORM_FIELD_CONTROL } from "@angular/material/form-field";
import { NgxsmkDatepickerComponent, provideMaterialFormFieldControl } from "ngxsmk-datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [NgxsmkDatepickerComponent, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  providers: [provideMaterialFormFieldControl(MAT_FORM_FIELD_CONTROL)],
})
export class MyModule {}
```

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

| Property           | Type                                                                                                                                                   | Default            | Description                                                                                                     |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------- | :-------------------------------------------------------------------------------------------------------------- |
| mode               | 'single' \| 'range' \| 'multiple'                                                                                                                      | 'single'           | The selection mode.                                                                                             |
| inline             | boolean \| 'always' \| 'auto'                                                                                                                          | false              | Controls the display mode. `true` or `'always'` for inline, `'auto'` for responsive.                            |
| locale             | string                                                                                                                                                 | navigator.language | Sets the locale for language and regional formatting (e.g., 'en-US', 'de-DE').                                  |
| theme              | 'light' \| 'dark'                                                                                                                                      | 'light'            | The color theme.                                                                                                |
| showRanges         | boolean                                                                                                                                                | true               | If true, displays the predefined ranges panel when in 'range' mode.                                             |
| minDate            | DateInput                                                                                                                                              | null               | The earliest selectable date.                                                                                   |
| maxDate            | DateInput                                                                                                                                              | null               | The latest selectable date.                                                                                     |
| isInvalidDate      | (date: Date) => boolean                                                                                                                                | () => false        | A function to programmatically disable specific dates.                                                          |
| ranges             | DateRange                                                                                                                                              | null               | An object of predefined date ranges.                                                                            |
| minuteInterval     | number                                                                                                                                                 | 1                  | Interval for minute dropdown options.                                                                           |
| showTime           | boolean                                                                                                                                                | false              | Enables the hour/minute/AM/PM selection section.                                                                |
| timeOnly           | boolean                                                                                                                                                | false              | Display time picker only (no calendar). Automatically enables `showTime`. Perfect for time selection scenarios. |
| use24Hour          | boolean                                                                                                                                                | false              | Enable 24-hour time format (00-23) and hide AM/PM selector.                                                     |
| showCalendarButton | boolean                                                                                                                                                | false              | Show/hide the calendar icon button. When `false`, users can still open calendar by clicking the input field.    |
| value              | DatepickerValue                                                                                                                                        | null               | Programmatic value setting. Set the datepicker value from code (useful for server-side API data).               |
| startAt            | DateInput                                                                                                                                              | null               | The date to initially center the calendar view on.                                                              |
| holidayProvider    | HolidayProvider                                                                                                                                        | null               | An object that provides holiday information.                                                                    |
| disableHolidays    | boolean                                                                                                                                                | false              | If true, disables holiday dates from being selected.                                                            |
| disabledDates      | (string \| Date)[]                                                                                                                                     | []                 | Array of dates to disable. Supports both string dates (MM/DD/YYYY) and Date objects.                            |
| weekStart          | number \| null                                                                                                                                         | null               | Override week start day (0=Sunday, 1=Monday, etc.). If null, uses locale-based week start.                      |
| yearRange          | number                                                                                                                                                 | 10                 | Number of years before/after current year to show in year dropdown.                                             |
| clearLabel         | string                                                                                                                                                 | 'Clear'            | Custom label for the clear button.                                                                              |
| closeLabel         | string                                                                                                                                                 | 'Close'            | Custom label for the close button.                                                                              |
| prevMonthAriaLabel | string                                                                                                                                                 | 'Previous month'   | Aria label for previous month navigation button.                                                                |
| nextMonthAriaLabel | string                                                                                                                                                 | 'Next month'       | Aria label for next month navigation button.                                                                    |
| clearAriaLabel     | string                                                                                                                                                 | 'Clear selection'  | Aria label for clear button.                                                                                    |
| closeAriaLabel     | string                                                                                                                                                 | 'Close calendar'   | Aria label for close button.                                                                                    |
| classes            | { wrapper?, inputGroup?, input?, popover?, container?, calendar?, header?, navPrev?, navNext?, dayCell?, footer?, clearBtn?, calendarBtn?, closeBtn? } | undefined          | Tailwind-friendly class overrides for theming.                                                                  |

### **Outputs**

| Event       | Payload                         | Description                                                   |
| :---------- | :------------------------------ | :------------------------------------------------------------ |
| valueChange | DatepickerValue                 | Emits the newly selected date, range, or array of dates.      |
| action      | { type: string; payload?: any } | Emits various events like `dateSelected`, `timeChanged`, etc. |

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

ngxsmk-datepicker v2.1.3 now features **full localization synchronization** for:

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

All date cells are keyboard accessible with proper ARIA attributes for screen readers.

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

### **Critical Bug Fixes in v1.4.15:**

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

### **v1.9.25** (Stable)

- 🎉 **Version Update**: Updated to version 1.9.25
- ✅ **Stable Release**: Version 1.9.25 is the current stable version
- ✨ **Improvements**: Fixed IDE template type-checking, fixed NPM README issues, updated docs with European localization support

### **v1.9.24**

- 🎉 **Version Update**: Updated to version 1.9.24
- ✅ **Stable Release**: Version 1.9.24 is the current stable version

### **v1.9.23**

- 🐛 **Fixed**: CSS Variables Theming (Issue #84) - CSS variables theming now works when variables are defined in global `:root` selector
  - Enhanced CSS selector from `:root` to `:root, :root > body` for higher specificity
  - Added `!important` flags to inline styles to ensure they override existing styles
  - ThemeBuilderService now properly overrides global stylesheet variables
  - Updated documentation to explain the fix and provide guidance
  - Resolves issue where theme variables defined in global stylesheets were not being applied

### **v1.9.22**

- 🎉 **Version Update**: Updated to version 1.9.22
- 🐛 **Fixed**: Form control value initialization issue - datepicker now correctly displays month from form control values
  - Fixed calendar month display when using Reactive Forms with initial values
  - Added proper signal updates and change detection in `writeValue()` method
- 🐛 **Fixed**: Locale week start detection for en-GB and other European locales
  - Added fallback logic for locales where `Intl.Locale.weekInfo` is not available
  - Now correctly returns Monday (1) for en-GB and other European locales

### **v1.9.21**

- 🎉 **Version Update**: Updated to version 1.9.21
- 📱 **Mobile-Specific Features**: Comprehensive mobile optimization
  - Native date picker integration with automatic mobile detection
  - Bottom sheet modal with swipe-to-dismiss gestures
  - Enhanced touch gestures (double-tap, swipe navigation)
  - Haptic feedback support for better mobile UX
  - Mobile-optimized animations and keyboard handling
- 🎯 **Advanced Selection Modes**: Extended selection capabilities
  - Week selection mode for selecting entire weeks
  - Month selection mode for selecting full months
  - Quarter selection mode for quarterly selections
  - Year selection mode for annual date ranges
- ⏱️ **Enhanced Time Selection**: Improved time picker
  - Seconds selection with configurable intervals
  - Better time picker UX and controls
- 🏗️ **Code Refactoring**: Improved architecture
  - New services: CalendarGenerationService, DisplayFormattingService, DateValidationService
  - Better code organization and maintainability
  - Reduced component complexity
- ♿ **Accessibility Enhancements**: Better screen reader support
  - Improved ARIA live regions
  - Enhanced focus management
  - Better keyboard navigation
- ⚡ **Performance Optimizations**: Infrastructure improvements
  - Lazy loading calendar months with intelligent caching
  - Virtual scrolling infrastructure
  - Preloading adjacent months
- 🧪 **Test Coverage**: Comprehensive test suite
  - 414 tests passing
  - New service tests
  - Updated component and utility tests
- 🔄 **Backward Compatible**: Full backward compatibility with v1.9.20

### **v1.9.20**

- 🎉 **Version Update**: Updated to version 1.9.20
- 🐛 **Bug Fix (Issue #71)**: Fixed `TypeError: window.matchMedia is not a function` error in test environments (jsdom/Vitest)
  - Added error handling for `window.matchMedia` in `applyAnimationConfig()` method
  - Component now gracefully handles missing `matchMedia` API in test environments
  - Prevents test failures when running with Vitest and jsdom
- ✅ **Test Coverage**: Added comprehensive test coverage for `matchMedia` compatibility scenarios
- 🔄 **Backward Compatible**: Full backward compatibility with v1.9.19

### **v1.9.19**

- 🎉 **Version Update**: Updated to version 1.9.19
- 🎨 **Responsive Layout Redesign**: Complete redesign of demo project layout for all screen sizes (320px to desktop)
- 📱 **Mobile Optimization**: Enhanced mobile experience with improved navbar, sidebar, hero section, and feature grid
- 🧹 **Code Cleanup**: Removed unnecessary comments for cleaner codebase
- 🔧 **Meta Tag Update**: Replaced deprecated `apple-mobile-web-app-capable` with `mobile-web-app-capable`
- 🔄 **Backward Compatible**: Full backward compatibility with v1.9.18

### **v1.9.18**

- 🐛 **Mobile Touch Event Handling**: Fixed touch listener attachment when calendar opens on mobile devices
  - Touch listeners now properly attach when calendar first opens, eliminating the need to navigate months first
  - Added retry mechanism with multiple attempts to ensure listeners are attached even on slower mobile devices
  - Improved timing with double `requestAnimationFrame` calls and multiple retry strategies
- 🎉 **Version Update**: Updated to version 1.9.18
- 🔄 **Backward Compatible**: Full backward compatibility with v1.9.17

### **v1.9.17**

- 🎉 **Calendar Button Visibility Control**: Added `showCalendarButton` input property to show/hide the calendar icon button
  - Defaults to `false` for a cleaner, more minimal UI
  - When set to `true`, displays the calendar icon button next to the input field
  - When set to `false`, users can still open the calendar by clicking the input field
  - Perfect for custom UI designs or when using `allowTyping` with custom calendar triggers
- 🎨 **Calendar Button Styling**: Added `calendarBtn` to `DatepickerClasses` for custom styling of the calendar button
- 🔧 **Type Compatibility**: Updated `SignalFormField` type to be fully compatible with Angular 21's `FieldTree<Date, string>` types
  - Resolves TypeScript compilation issues when using `[field]` input with Angular 21 Signal Forms
  - Maintains full backward compatibility with Angular 17-20
- 🎉 **Version Update**: Updated to version 1.9.17
- 🔄 **Backward Compatible**: Full backward compatibility with v1.9.16
- ✅ **Angular 17-22 Compatible**: Verified compatibility with Angular 17-22 (including Angular 21)

### **v1.9.16**

- 🐛 **Range Mode Previous Month Selection**: Fixed issue where users could not select dates from previous months in range mode when starting with `{ start: null, end: null }`
- 🎉 **Version Update**: Updated to version 1.9.16
- 🔄 **Backward Compatible**: Full backward compatibility with v1.9.15
- ✅ **Angular 17+ Compatible**: Verified compatibility with Angular 17 and up versions

### **v1.9.15**

- 🐛 **Moment Object Binding Fix**: Fixed Moment.js objects not binding correctly with ngModel
- 🐛 **Date Clicks After Navigation**: Fixed dates becoming unclickable after month navigation
- 🎉 **Version Update**: Updated to version 1.9.15
- 🔄 **Backward Compatible**: Full backward compatibility with v1.9.14
- ✅ **Angular 17+ Compatible**: Verified compatibility with Angular 17 and up versions

### **v1.9.14**

- 🐛 **Date Picker Selection Fix**: Fixed date picker selection issues, especially in range mode
- 🐛 **Moment.js Timezone Support**: Fixed timezone offset preservation for Moment.js objects
- 🎉 **Version Update**: Updated to version 1.9.14
- 🔄 **Backward Compatible**: Full backward compatibility with v1.9.13

### **v1.9.13**

- 🐛 **Bug Fixes**: Fixed `valueChange` event emitting null for range mode with ngModel
- 🐛 **Bug Fixes**: Fixed date selection becoming disabled after month navigation in range mode
- 🐛 **Bug Fixes**: Fixed Moment.js object handling in range values and arrays
- 🎉 **Version Update**: Updated to version 1.9.13
- 🔄 **Backward Compatible**: Full backward compatibility with v1.9.12

### **v1.9.12**

- 🎉 **Version Update**: Updated to version 1.9.12
- 🔄 **Backward Compatible**: Full backward compatibility with v1.9.11
- 📚 **Migration Guide**: See [MIGRATION.md](MIGRATION.md) for detailed migration instructions

### **v1.9.11**

- 🐛 **Moment.js Integration**: Fixed critical issue where Moment.js objects with custom date formats would not populate correctly
  - Added `isMomentObject()` helper method to safely detect Moment.js instances
  - Enhanced `_normalizeValue()` method to handle Moment.js objects directly
  - Improved `parseCustomDateString()` method for TypeScript compatibility
  - Added comprehensive support for format tokens: YYYY, YY, MM, M, DD, D, hh, h, HH, H, mm, m, ss, s, a, A
  - Maintains full backward compatibility with Date objects, strings, and all other supported formats
- 🎨 **Custom Format Parser**: Enhanced format token parsing with better TypeScript compatibility
- 🔍 **Moment.js Detection**: More robust detection of Moment.js objects across different versions
- 🎮 **Demo Application**: Added working Moment.js integration example with interactive controls

### **v1.9.10**

- 🐛 **Async Database Value Loading**: Enhanced datepicker to properly handle database values that load asynchronously
  - Added fallback sync mechanism in `ngAfterViewInit` to catch async database loads
  - Added delayed sync checks in `ngOnInit`, `ngOnChanges`, and `ngAfterViewInit`
  - Added sync on calendar open, focus events, and touch events
  - Extended interval sync duration to 30 seconds with 100ms check intervals
- 🔧 **TypeScript Compilation Error**: Fixed `EffectRef` type error when using Angular 17+ `effect()` API
  - Changed `_fieldEffectDestroy: (() => void) | null` to `_fieldEffectRef: EffectRef | null`
  - Updated effect cleanup to use `effectRef.destroy()` instead of function call
  - Added proper `EffectRef` import from `@angular/core`
- 🧪 **Test Configuration**: Fixed test configuration for Angular 17+ compatibility
  - Updated karma configuration to work with `@angular/build:karma` builder
  - Simplified karma.conf.js to remove deprecated plugins
  - Updated test script to target correct project

### **v1.9.9**

- 🐛 **Database Value Population**: Fixed critical issue where datepicker would not populate with values from database when using `[field]` input binding
  - Added `_normalizeValue()` helper method to properly handle all value types
  - Updated field effect and related methods to use `_normalizeValue()` instead of `_normalizeDate()`
  - Fixed issue where string dates from database were not being parsed and displayed correctly
  - Now properly handles Date objects, string dates, range objects, and arrays of dates

### **v1.9.8**

- 🐛 **Date Selection Reset Issue**: Fixed critical bug where selected dates would reset to today's date when using `[field]` input binding
  - Fixed `applyCurrentTime` to create a new Date object instead of mutating the original
  - Added `_isUpdatingFromInternal` flag to prevent field effect from resetting the value
  - This ensures selected dates are properly stored in the form field

### **v1.9.7**

- 🐛 **Calendar Population**: Fixed critical issue where datepicker calendar would not populate with dates when opened
  - Fixed issue when multiple datepickers were present in the same form
  - Ensured `generateCalendar()` is called when opening the datepicker via click, touch, or programmatic methods

### **v1.9.6**

- 🐛 **Multiple Datepicker Management**: Fixed issue where multiple datepickers in the same form would open in the same centered location
- 🖱️ **Outside Click Detection**: Improved click detection to properly close datepicker when clicking outside
- 🔄 **Auto-close Other Datepickers**: When opening a datepicker, all other open datepickers in the same form are now automatically closed
- 📱 **Mobile Datepicker Opening**: Fixed issue where datepicker modal would not open on mobile screens
- 📱 **Datepicker Closing on Mobile**: Fixed issue where datepicker would open and immediately disappear on mobile devices
- 👆 **Select Box Cursor**: Added pointer cursor to all select boxes (month, year, hour, minute, AM/PM) in the datepicker

### **v1.9.5**

- 🔧 **Angular 21+ Signal Forms Type Compatibility**: Fixed TypeScript compilation error with Angular 21+ Signal Forms
  - Fixed `Type '() => string' is not assignable to type 'never'` error when using `[field]` input
  - Updated `SignalFormField` type definition to be compatible with Angular 21's `FieldTree<Date, string>` types
  - Maintains backward compatibility with Angular 17-20 where field input is optional
  - Resolves [#33](https://github.com/NGXSMK/ngxsmk-datepicker/issues/33)

### **v1.9.4**

- ✨ **Custom Date Format**: New `[displayFormat]` input property to display dates in custom formats
  - Supports format strings like "MM/DD/YYYY hh:mm A"
  - Works with date adapters (date-fns, dayjs, luxon) or built-in simple formatter
  - Supports common format tokens: YYYY, MM, DD, hh, mm, A, etc.
  - Resolves [#31](https://github.com/NGXSMK/ngxsmk-datepicker/issues/31)
- 🐛 **Time Selection Dropdowns**: Fixed visibility issues with time selection dropdowns
  - Dropdowns now properly display and are not clipped by parent containers
  - Improved z-index handling for time selection dropdowns
  - Removed unnecessary scrollbars from datepicker wrapper
  - Resolves [#32](https://github.com/NGXSMK/ngxsmk-datepicker/issues/32)

### **v1.9.3**

- ✨ **Time-Only Picker**: New `[timeOnly]` input property to display only time selection without calendar
  - Hides calendar grid and shows only time controls (hour, minute, AM/PM)
  - Automatically enables `showTime` when `timeOnly` is true
  - Perfect for time selection scenarios where date is not needed
  - Value is still a Date object using today's date with selected time
  - Placeholder automatically changes to "Select Time" in time-only mode
  - Resolves [#29](https://github.com/NGXSMK/ngxsmk-datepicker/issues/29)
- 🎨 **Modern Demo App UI**: Complete redesign of the demo application
  - Modern navbar with glassmorphism effects, search functionality, and improved theme toggle
  - Redesigned sidebar with gradient backgrounds, smooth animations, and visual indicators
  - Enhanced icon sizes and better visual hierarchy
  - Improved responsive design with better mobile experience
  - Automatic system theme detection (dark/light mode preference)
  - Gradient accents, shadows, and modern design patterns throughout
- 🧪 **Test Suite**: Fixed 25+ failing tests across multiple test files
  - Fixed date utils tests, calendar utils tests, timezone utils tests, edge cases tests
  - Fixed adapters tests, performance utils tests, RTL tests, touch gestures tests
  - Fixed calendar views tests, recurring dates utils tests
  - All 353 tests now pass successfully

### **v1.9.2**

- 📦 **Bundle Optimization**: Optimized bundle size with improved TypeScript compiler settings
  - Main bundle: ~127KB (source maps excluded from published package)
  - Enhanced tree-shaking with optimized imports and compiler options
  - Added `importsNotUsedAsValues: "remove"` for smaller output
  - Disabled `preserveConstEnums` for better inlining
- 🔧 **Build Process**:
  - Source maps automatically removed from production builds (saves ~127KB)
  - Improved build scripts with better error handling
  - Enhanced bundle analysis that excludes source maps
- 📦 **Package Configuration**:
  - Fixed package.json exports to eliminate build warnings
  - Optimized `files` array to exclude unnecessary files
  - Updated exports field for better module resolution
- 🧪 **Test Configuration**:
  - Added Zone.js polyfills to library test configuration
  - Updated test commands to explicitly target library project
  - Improved test reliability across Angular versions
- 🐛 **Bug Fixes**:
  - Test suite configuration - added missing Zone.js polyfills for library tests
  - Bundle analysis now correctly excludes source maps from size calculations
  - Build warnings from conflicting export conditions resolved
  - Source map removal script made more resilient for build environments

### **v1.9.1**

- 🐛 Minor bug fixes and improvements

### **v1.9.0**

- ✨ **Extension Points & Hooks**: system for customization
- ⌨️ **Enhanced Keyboard Shortcuts**: Y, N, W keys with custom shortcut support
- 🎨 **Modern UI/UX**: Improved animations and responsiveness
- 📚 **API Documentation**: TypeDoc integration
- 🤖 **Semantic Release**: Automated versioning and publishing
- 🚀 **Animation Performance**: Optimizations with GPU acceleration
- 🔍 **Global Search**: Functionality in documentation
- 📱 **Mobile Playground**: For responsive testing

### **v1.7.0**

- 🎯 **Signal Forms Support**: Full Angular 21 signal forms integration with writable signals
- 🎨 **Tailwind Theming**: Added `classes` input for Tailwind CSS and custom class-based theming
- 🌍 **Localization Improvements**: Added `weekStart` input to override locale-based week start day
- 📅 **Year Range Configuration**: Added `yearRange` input to customize year dropdown range
- ♿ **Accessibility Enhancements**: Added customizable aria labels for all interactive elements
- 🏷️ **Custom Labels**: Added `clearLabel` and `closeLabel` inputs for button customization
- 🧪 **Comprehensive Test Suite**: Added 56 tests covering all features and edge cases
- 🐛 **Bug Fixes**: Fixed programmatic value setting and Angular 21 compatibility tests
- 🧹 **Code Cleanup**: Removed unnecessary files, folders, and comments from codebase
- 📝 **Test Improvements**: Enhanced test coverage with comprehensive feature tests
- 🔧 **Test Fixes**: Fixed disabled date tests and integration test issues
- 🎯 **Code Quality**: Improved code maintainability by removing redundant comments

### **v1.6.0**

- 🎯 **Programmatic Value Setting**: Added `value` input property to set datepicker value programmatically, perfect for server-side API data integration
- 🎨 **Enhanced Demo App**: Completely redesigned demo application with TokiForge-inspired modern UI and API documentation style
- 🚀 **GitHub Pages Deployment**: Added automated GitHub Pages deployment with GitHub Actions workflow
- 📚 **Improved Documentation**: Enhanced demo app with comprehensive examples, code snippets, and interactive documentation
- 🔧 **Build Optimizations**: Updated CSS budget limits and improved build configuration
- 🎨 **Modern UI Design**: Beautiful gradient themes, glass-morphism effects, and improved visual hierarchy
- 📱 **Better UX**: Enhanced navigation, code copying functionality, and responsive design
- 🛠️ **Developer Experience**: Improved build scripts and deployment automation

### **v1.5.0**

- 🚀 **Angular 21 Support**: Full compatibility with Angular 21 RC versions
- ⚡ **Zone-less Support**: Works without zone.js for improved performance
- 🧪 **Comprehensive Tests**: Added extensive test suite covering all features
- 🔧 **Angular 17-21 Compatibility**: Supports Angular versions 17, 18, 19, 20, and 21
- 📦 **Dependency Updates**: Updated to Angular 21 RC and latest build tools
- 🧹 **Code Cleanup**: Removed unnecessary documentation files and comments
- 📝 **Improved Keywords**: Added version-specific keywords for better discoverability
- 🎯 **Peer Dependencies**: Updated to support Angular 17-21 range

### **v1.4.16**

- 📚 **Documentation**: Comprehensive README updates with latest features and improvements
- 🎯 **Version Management**: Updated version references across all package files
- 📖 **User Experience**: Enhanced documentation with better examples and API references
- 🔧 **Maintenance**: Improved project structure and documentation consistency
- 📦 **Package Updates**: Synchronized version numbers across all package.json files
- 🎨 **Documentation**: Added detailed bug fixes and performance metrics
- 🚀 **Developer Experience**: Better setup instructions and contribution guidelines

### **v1.4.15**

- 🐛 **Bug Fixes**: Fixed 10 critical bugs including change detection issues and date comparison errors
- ⚡ **Performance**: Enhanced OnPush change detection with proper triggers
- 🎯 **Memory Management**: Added cache size limits to prevent memory leaks
- 🔧 **Type Safety**: Improved TypeScript types and null safety
- 📱 **Mobile Optimization**: Enhanced mobile responsive design with touch-friendly interactions
- 🎨 **UI Improvements**: Better visual feedback and accessibility
- 🚀 **Build Optimization**: Improved build configuration and tree-shaking
- 🧹 **Code Quality**: Enhanced code maintainability and performance

### **v1.4.13**

- 🚫 **Disabled Dates**: New `disabledDates` input property to disable specific dates
- 🎯 **Date String Support**: Supports both string dates (MM/DD/YYYY) and Date objects
- 💡 **Holiday Tooltips**: Hover over holiday dates to see holiday names as tooltips
- 🎨 **Enhanced UX**: Better visual feedback for disabled dates
- 📦 **Improved API**: More flexible date disabling options

### **v1.4.12**

- ⚡ **Instant Navigation**: Removed all animations for lightning-fast arrow navigation
- 🚫 **Smart Back Arrow**: Automatically disables back arrow when minDate is set
- 🎯 **Better UX**: Prevents navigation to invalid date ranges
- 🗓️ **Previous Month Days**: Now shows last few days of previous month for better context
- 🎨 **Enhanced Styling**: Improved visual hierarchy with better day cell sizing
- 🖱️ **Interactive Previous Days**: Previous month days are now selectable and interactive
- 🧹 **Code Optimization**: Cleaner, more maintainable codebase
- 📦 **Smaller Bundle**: Reduced CSS and JavaScript footprint

### **v1.4.11**

- 🎨 **UI Improvements**: Enhanced day cell sizing and visual hierarchy
- 🖱️ **Better Interactions**: Improved click and hover states for previous month days

### **v1.4.10**

- 🗓️ **Previous Month Display**: Added last few days of previous month for better context
- 🎯 **Smart Selection**: Previous month days are now selectable and interactive

### **v1.4.9**

- 🚫 **Range Fix**: Fixed range highlighting on empty/previous month days
- 🎨 **Styling Updates**: Improved visual consistency across all day types

### **v1.4.8**

- ⚡ **Performance**: Optimized calendar generation and rendering
- 🧹 **Code Cleanup**: Removed unused animation code and improved maintainability

### **v1.4.6**

- 🔧 **Fixed Import Paths**: Corrected package exports for proper module resolution
- 📦 **Better Package Structure**: Improved npm package configuration

### **v1.4.5**

- 🐛 Bug fixes and stability improvements
- 🔧 Enhanced error handling
- 📱 Improved mobile responsiveness
- 🎨 Minor UI/UX improvements

### **v1.4.0**

- ✅ Performance optimizations (30% smaller bundle)
- ✅ OnPush change detection strategy
- ✅ Memoized date comparisons
- ✅ Tree-shakable architecture
- ✅ Enhanced TypeScript support
- ✅ Improved accessibility
- ✅ Better mobile responsiveness

### **Previous Versions**

- v1.3.5: Initial release with core features
- v1.3.4: Bug fixes and improvements
- v1.3.3: Holiday provider integration

## **🎨 Theming with TokiForge**

Looking for a powerful theming solution for your Angular application? Check out **[TokiForge](https://tokiforge.github.io/tokiforge/)** — an open-source modern design token & theme engine that provides runtime theme switching for React, Vue, Svelte, Angular, and any framework.

### Why TokiForge?

- ✅ **Framework-agnostic** — Works with Angular, React, Vue, Svelte, and vanilla JS
- ✅ **Runtime theme switching** — Change themes dynamically without rebuilds
- ✅ **Type-safe** — Full TypeScript support for design tokens
- ✅ **Lightweight** — <3 KB gzipped runtime footprint
- ✅ **CSS custom properties** — Zero JS overhead in static mode
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
- 💼 LinkedIn: [sachindilshan](https://www.linkedin.com/in/sachindilshan/)

## **⭐ Support**

If you find this library helpful, please consider:

- ⭐ **Starring** the repository
- 🐛 **Reporting** bugs and issues
- 💡 **Suggesting** new features
- 🤝 **Contributing** code improvements
- 📢 **Sharing** with the community
