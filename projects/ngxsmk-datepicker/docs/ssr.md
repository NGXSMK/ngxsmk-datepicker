# Server-Side Rendering (SSR) Guide

**Last updated:** February 23, 2026 · **Current stable:** v2.1.8

ngxsmk-datepicker is fully compatible with Angular Universal and server-side rendering. This guide covers SSR setup, best practices, and troubleshooting.

## Overview

The datepicker is designed to work seamlessly in both server and browser environments:

- ✅ All browser-only APIs are guarded with platform checks
- ✅ No direct `window` or `document` access during initialization
- ✅ Event listeners only attach in browser environment
- ✅ Compatible with Angular Universal
- ✅ Supports partial hydration

## Basic SSR Setup

### Angular Universal Installation

If you haven't set up Angular Universal yet:

```bash
ng add @nguniversal/express-engine
```

### No Additional Configuration Required

The datepicker works out of the box with SSR. No special configuration is needed:

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ngxsmk-datepicker
      mode="single"
      [value]="selectedDate">
    </ngxsmk-datepicker>
  `
})
export class AppComponent {
  selectedDate: Date | null = null;
}
```

## Platform Detection

The datepicker automatically detects the platform and only uses browser APIs when available:

```typescript
// Internal implementation (you don't need to do this)
private readonly isBrowser = isPlatformBrowser(this.platformId);

// Browser-only code is automatically guarded
if (this.isBrowser) {
  // Safe to use window, document, etc.
}
```

## SSR Best Practices

### 1. Initialize Values Safely

Always initialize date values safely:

```typescript
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  // ...
})
export class SafeComponent {
  private platformId = inject(PLATFORM_ID);
  
  selectedDate: Date | null = null;
  
  ngOnInit() {
    // Only access browser APIs in browser
    if (isPlatformBrowser(this.platformId)) {
      this.selectedDate = new Date();
    }
  }
}
```

### 2. Use Signals for Reactive Data

Signals work great with SSR:

```typescript
import { Component, signal } from '@angular/core';

@Component({
  // ...
})
export class SignalComponent {
  // Signals are SSR-safe
  selectedDate = signal<Date | null>(null);
}
```

### 3. Server-Side Data

When fetching data on the server:

```typescript
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { signal, linkedSignal, computed } from '@angular/core';

@Component({
  // ...
})
export class ServerDataComponent {
  private http = inject(HttpClient);
  
  resource = httpResource({
    request: () => this.http.get<{ date: string }>('/api/data'),
    loader: signal(false)
  });
  
  localObject = linkedSignal(() => this.resource.response.value());
  
  // Computed signals are SSR-safe
  selectedDate = computed(() => {
    const obj = this.localObject();
    return obj?.date ? new Date(obj.date) : null;
  });
}
```

## Testing SSR

### Build for SSR

```bash
npm run build:ssr
npm run serve:ssr
```

### Verify SSR Works

1. Build your app with SSR
2. Check the server-rendered HTML contains the datepicker markup
3. Verify no console errors during server rendering
4. Test that the datepicker works after hydration

## Common SSR Issues

### Issue: Datepicker not rendering on server

**Solution**: Ensure you're using the component correctly. The datepicker renders its initial state on the server, but interactive features (like opening the calendar) only work in the browser.

### Issue: `window is not defined` error

**Solution**: This shouldn't happen with the current version. If you see this error, ensure you're using the latest version of the datepicker. All browser APIs are properly guarded.

### Issue: Dates not displaying correctly

**Solution**: Ensure date values are properly serialized/deserialized. Use `Date` objects, not strings, when possible:

```typescript
// ❌ Bad - may cause issues
date: "2024-01-15"

// ✅ Good
date: new Date("2024-01-15")
```

### Issue: Locale not working on server

**Solution**: The datepicker uses the browser's locale by default. On the server, you may need to explicitly set the locale:

```html
<ngxsmk-datepicker
  [locale]="'en-US'"
  mode="single">
</ngxsmk-datepicker>
```

Or inject `LOCALE_ID`:

```typescript
import { LOCALE_ID, inject } from '@angular/core';

@Component({
  // ...
  providers: [
    { provide: LOCALE_ID, useValue: 'en-US' }
  ]
})
export class LocaleComponent {
  locale = inject(LOCALE_ID);
}
```

## Hydration

The datepicker supports Angular's partial hydration:

1. The component renders on the server
2. On client hydration, interactive features become available
3. No additional configuration needed

## Performance Considerations

### OnPush Change Detection

The datepicker uses `OnPush` change detection, which is optimal for SSR:

- Fewer change detection cycles
- Better performance in both server and browser
- Compatible with zoneless applications

### Lazy Initialization

Browser-only features are lazily initialized:

- Event listeners attach only in browser
- Media queries only checked in browser
- Navigator API only accessed in browser

## Zone.js and Zoneless

The datepicker works with or without Zone.js:

- ✅ Works with Zone.js (default)
- ✅ Works without Zone.js (zoneless)
- Uses `ChangeDetectorRef.markForCheck()` for manual change detection
- Compatible with Angular's zoneless mode

## Example: Full SSR Setup

```typescript
import { Component, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { linkedSignal, computed } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-ssr-example',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ngxsmk-datepicker
      [value]="selectedDate()"
      (valueChange)="onDateChange($event)"
      mode="single"
      placeholder="Select a date">
    </ngxsmk-datepicker>
  `
})
export class SSRExampleComponent {
  private http = inject(HttpClient);
  
  // Fetch data (works on both server and client)
  resource = httpResource({
    request: () => this.http.get<{ date: string }>('/api/data'),
    loader: signal(false)
  });
  
  // Link to response
  localObject = linkedSignal(() => this.resource.response.value());
  
  // Compute date (SSR-safe)
  selectedDate = computed(() => {
    const obj = this.localObject();
    return obj?.date ? new Date(obj.date) : null;
  });
  
  onDateChange(date: Date | null) {
    // Update logic here
    console.log('Date changed:', date);
  }
}
```

## Troubleshooting Checklist

- [ ] Build completes without errors: `npm run build:ssr`
- [ ] Server starts without errors: `npm run serve:ssr`
- [ ] No `window is not defined` errors in server logs
- [ ] Datepicker renders in server HTML
- [ ] Datepicker works after client hydration
- [ ] No console errors in browser
- [ ] Dates display correctly
- [ ] Locale works as expected

## Additional Resources

- **[SSR Example](./SSR-EXAMPLE.md)** - Complete working example with code samples
- [Angular Universal Guide](https://angular.dev/guide/ssr)
- [Angular SSR Documentation](https://angular.dev/guide/ssr)
- [Platform Detection](https://angular.dev/api/common/isPlatformBrowser)

