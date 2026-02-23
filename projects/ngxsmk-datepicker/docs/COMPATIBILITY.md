# Version Compatibility Matrix

**Last updated:** February 23, 2026 · **Current stable:** v2.1.7

This document provides comprehensive compatibility information for `ngxsmk-datepicker` across different Angular versions, Zone.js configurations, and SSR/CSR setups.

## 📋 Angular Version Compatibility

### Compatibility Matrix

| Angular Version | Status | Core Features | Signal Features | Signal Forms | SSR Support | Notes |
|----------------|--------|--------------|----------------|--------------|-------------|-------|
| **Angular 17** | ✅ Fully Supported | ✅ All | ✅ Signals, Computed | ❌ Not Available | ✅ Full | Minimum supported version |
| **Angular 18** | ✅ Fully Supported | ✅ All | ✅ Signals, Computed, Effects | ❌ Not Available | ✅ Full | Enhanced signal support |
| **Angular 19** | ✅ Fully Supported | ✅ All | ✅ Signals, Computed, Effects | ❌ Not Available | ✅ Full | Optimized performance |
| **Angular 20** | ✅ Fully Supported | ✅ All | ✅ Signals, Computed, Effects | ❌ Not Available | ✅ Full | Fully supported |
| **Angular 21** | ✅ Fully Supported | ✅ All | ✅ Signals, Computed, Effects | ✅ Signal Forms `[field]` | ✅ Full | **Officially released - Current development target**<br/>✅ Signal Forms (experimental)<br/>✅ Zoneless by default<br/>✅ Vitest compatible<br/>✅ Angular Aria compatible |
| **Angular 22+** | 🔄 Future Support | ✅ All | ✅ Signals, Computed, Effects | ✅ Signal Forms `[field]` | ✅ Full | Peer dependency: `<24.0.0` |

### Feature Availability by Angular Version

#### Core Features (Available in all versions)
- ✅ Date selection (single, range, multiple)
- ✅ Time selection
- ✅ Calendar views (month, year, decade, timeline, time-slider)
- ✅ Keyboard navigation
- ✅ Touch gestures
- ✅ RTL support
- ✅ Timezone support
- ✅ Custom formatting
- ✅ Holiday provider integration
- ✅ Custom hooks and extensions
- ✅ Accessibility (ARIA, keyboard)
- ✅ Theming (light/dark)
- ✅ Translations/i18n

#### Signal Features (Angular 17+)
- ✅ `signal()` - Reactive state management
- ✅ `computed()` - Derived reactive values
- ✅ `effect()` - Side effects (Angular 18+)
- ✅ `inject()` - Dependency injection

#### Signal Forms (Angular 21+)
- ✅ `[field]` input binding (experimental Angular 21 feature)
- ✅ Automatic field synchronization
- ✅ Reactive form field updates
- ✅ Signal-based value management
- ✅ Works with `form()`, `objectSchema()`, and `validators`
- ✅ Compatible with `httpResource` and `linkedSignal` patterns

#### Angular 21 New Features Compatibility
- ✅ **Zoneless by Default**: Fully compatible with Angular 21 apps that don't include Zone.js
- ✅ **Vitest Test Runner**: Library works in apps using Vitest (Angular 21 default)
- ✅ **Angular Aria**: Compatible with Angular Aria components; uses custom ARIA implementation for screen reader support

### Peer Dependencies

```json
{
  "@angular/common": ">=17.0.0 <24.0.0",
  "@angular/core": ">=17.0.0 <24.0.0",
  "@angular/forms": ">=17.0.0 <24.0.0"
}
```

**Zone.js**: Optional (declared in `peerDependenciesMeta`)

## 🔄 Zone.js vs Zoneless Compatibility

### Overview

`ngxsmk-datepicker` is designed to work **with or without Zone.js**, making it compatible with both traditional Angular applications and modern zoneless applications.

### Zone.js Required Features

| Feature | With Zone.js | Without Zone.js | Notes |
|---------|--------------|-----------------|-------|
| **Change Detection** | ✅ Automatic | ✅ Manual (OnPush) | Component uses `OnPush` strategy |
| **Form Integration** | ✅ Works | ✅ Works | Uses `ControlValueAccessor` |
| **Event Handling** | ✅ Works | ✅ Works | Native event listeners |
| **Signal Updates** | ✅ Works | ✅ Works | Signals trigger change detection |
| **Reactive Forms** | ✅ Works | ✅ Works | FormControl integration |
| **Signal Forms** | ✅ Works | ✅ Works | Angular 21+ signal forms |

### Zoneless Setup

The component uses **OnPush change detection strategy** and **signals** for reactive updates, making it fully compatible with zoneless applications:

```typescript
@Component({
  selector: 'ngxsmk-datepicker',
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅ Zoneless compatible
  // ...
})
```

#### Manual Change Detection

When using without Zone.js, the component handles change detection internally:

```typescript
// Component automatically calls markForCheck() when needed
private scheduleChangeDetection(): void {
  if (!this._changeDetectionScheduled) {
    this._changeDetectionScheduled = true;
    Promise.resolve().then(() => {
      this._changeDetectionScheduled = false;
      this.cdr.markForCheck();
    });
  }
}
```

#### Signal-Based Reactivity

The component uses Angular signals for reactive state:

```typescript
// Reactive calendar open state
private _isCalendarOpen = signal<boolean>(false);

// Computed dependencies for memoization
private _memoDependencies = computed(() => ({
  month: this._currentMonthSignal(),
  year: this._currentYearSignal(),
  // ...
}));
```

### Zone.js Configuration

#### With Zone.js (Default)

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent);
// Zone.js is automatically included
```

#### Without Zone.js (Zoneless)

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    // No Zone.js provider needed
    // Component works with OnPush + signals
  ]
});
```

### Migration Guide: Zone.js → Zoneless

1. **Remove Zone.js dependency** (if desired)
2. **Ensure OnPush strategy** (already used by component)
3. **Use signals for state** (component already uses signals)
4. **No code changes needed** - component is zoneless-ready

## 🌐 SSR vs CSR Compatibility

### Server-Side Rendering (SSR)

The component is **fully compatible** with Angular Universal and SSR.

#### SSR-Safe Features

| Feature | SSR Support | Implementation |
|---------|-------------|----------------|
| **Platform Detection** | ✅ Safe | Uses `isPlatformBrowser()` and `PLATFORM_ID` |
| **DOM Access** | ✅ Safe | Guarded with `isBrowser` checks |
| **Event Listeners** | ✅ Safe | Only attached in browser |
| **Date Formatting** | ✅ Safe | Uses `Intl` API (available in Node.js) |
| **Local Storage** | ✅ Safe | Not used |
| **Window/Document** | ✅ Safe | Guarded with platform checks |

#### SSR Implementation Details

```typescript
// Platform detection
private readonly platformId = inject(PLATFORM_ID);
private readonly isBrowser = isPlatformBrowser(this.platformId);

// Safe DOM access
if (this.isBrowser && typeof document !== 'undefined') {
  // Browser-only code
  document.documentElement.dir === 'rtl';
}

// Safe event listeners
if (this.isBrowser) {
  // Attach event listeners
}
```

#### SSR-Specific Considerations

1. **Initial Render**: Component renders safely on server
2. **Hydration**: Client-side hydration works correctly
3. **Date Formatting**: Uses `Intl.DateTimeFormat` (available in Node.js 13+)
4. **Locale Detection**: Falls back to 'en-US' on server if `navigator` is unavailable

### Client-Side Rendering (CSR)

All features work identically in CSR mode. No special configuration needed.

### SSR vs CSR Differences

| Aspect | SSR | CSR | Notes |
|--------|-----|-----|-------|
| **Initial Render** | Server | Browser | Component renders on both |
| **DOM Access** | ❌ Not Available | ✅ Available | Guarded with `isPlatformBrowser()` |
| **Event Listeners** | ❌ Not Attached | ✅ Attached | Only in browser |
| **Date Formatting** | ✅ Works | ✅ Works | Uses `Intl` API |
| **Locale Detection** | ⚠️ Limited | ✅ Full | Server uses default, browser detects |
| **Performance** | ✅ Fast Initial Load | ✅ Interactive | SSR improves SEO and initial load |

### SSR Setup Example

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(), // Enable SSR hydration
    // ... other providers
  ]
};
```

```typescript
// Component usage (works in both SSR and CSR)
@Component({
  template: `
    <ngxsmk-datepicker
      [locale]="'en-US'"
      mode="single">
    </ngxsmk-datepicker>
  `
})
export class MyComponent {
  // Component automatically handles SSR/CSR differences
}
```

## 🔧 Feature Compatibility Matrix

### By Angular Version

| Feature | Angular 17 | Angular 18 | Angular 19 | Angular 20 | Angular 21+ |
|---------|------------|-----------|------------|------------|-------------|
| **Standalone Component** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Signals** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Computed Signals** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Effects** | ⚠️ Limited | ✅ | ✅ | ✅ | ✅ |
| **Signal Forms** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **ControlValueAccessor** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Reactive Forms** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **OnPush Strategy** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **SSR Support** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Zoneless Support** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Translations/i18n** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Locale Registry** | ✅ | ✅ | ✅ | ✅ | ✅ |

### By Configuration

| Configuration | Zone.js | Zoneless | SSR | CSR |
|---------------|---------|----------|-----|-----|
| **Change Detection** | ✅ Auto | ✅ Manual | ✅ Works | ✅ Works |
| **Form Integration** | ✅ Works | ✅ Works | ✅ Works | ✅ Works |
| **Event Handling** | ✅ Works | ✅ Works | ⚠️ Browser Only | ✅ Works |
| **Signal Updates** | ✅ Works | ✅ Works | ✅ Works | ✅ Works |
| **Date Formatting** | ✅ Works | ✅ Works | ✅ Works | ✅ Works |
| **Keyboard Navigation** | ✅ Works | ✅ Works | ⚠️ Browser Only | ✅ Works |
| **Touch Gestures** | ✅ Works | ✅ Works | ⚠️ Browser Only | ✅ Works |

## 📝 Migration Guides

### Upgrading from Angular 17 to 21

1. **Update Angular dependencies**:
   ```bash
   ng update @angular/core @angular/cli
   ```

2. **Enable Signal Forms** (Angular 21+):
   ```typescript
   // Before (Angular 17-20)
   <ngxsmk-datepicker
     [value]="dateValue"
     (valueChange)="dateValue = $event">
   </ngxsmk-datepicker>

   // After (Angular 21+)
   <ngxsmk-datepicker
     [field]="myForm.myDate">
   </ngxsmk-datepicker>
   ```

3. **No breaking changes** - all existing code continues to work

### Migrating to Zoneless

1. **Remove Zone.js** (optional):
   ```bash
   npm uninstall zone.js
   ```

2. **Update bootstrap** (if needed):
   ```typescript
   // No changes needed - component is already zoneless-ready
   ```

3. **Verify OnPush strategy** (already used):
   ```typescript
   // Component already uses OnPush
   changeDetection: ChangeDetectionStrategy.OnPush
   ```

### Enabling SSR

1. **Install Angular Universal**:
   ```bash
   ng add @angular/ssr
   ```

2. **Configure SSR**:
   ```typescript
   // app.config.ts
   import { provideClientHydration } from '@angular/platform-browser';

   export const appConfig: ApplicationConfig = {
     providers: [provideClientHydration()]
   };
   ```

3. **No component changes needed** - component is SSR-safe

## ⚠️ Known Limitations

### Angular 17
- Effects support is limited (use signals/computed instead)
- Signal Forms not available (use `[value]` binding)

### SSR
- DOM-dependent features only work in browser (keyboard navigation, touch gestures)
- Locale auto-detection falls back to 'en-US' on server

### Zoneless
- Requires manual change detection (handled automatically by component)
- Form integration works the same as with Zone.js

## 🧪 Testing Compatibility

The component is tested against:
- ✅ Angular 17, 18, 19, 20, 21
- ✅ With and without Zone.js
- ✅ SSR and CSR modes
- ✅ Various browser environments
- ✅ **Vitest Compatible**: Works in Angular 21 applications using Vitest (Angular 21 default test runner)
  - Library tests use Karma/Jasmine, but the library itself is fully compatible with Vitest-based apps
  - No changes needed when using Vitest in your Angular 21 application

## 🆕 Angular 21 New Features Support

### Signal Forms (Experimental)
- ✅ **Full Support**: `[field]` input binding for direct Signal Forms integration
- ✅ **Automatic Sync**: Two-way binding with signal form fields
- ✅ **Validation**: Respects field validation and disabled state
- ✅ **Server Integration**: Works with `httpResource` and `linkedSignal` patterns

### Zoneless by Default
- ✅ **Fully Compatible**: Works in Angular 21 apps without Zone.js
- ✅ **OnPush Strategy**: Uses OnPush change detection for optimal performance
- ✅ **Signal-Based**: Leverages signals for reactive updates
- ✅ **No Changes Needed**: Existing code works without modification

### Vitest Test Runner
- ✅ **Compatible**: Library works in apps using Vitest (Angular 21 default)
- ✅ **No Migration Required**: Use the library as-is in Vitest-based projects
- ✅ **Test Suite**: Library tests use Karma/Jasmine but library is Vitest-compatible

### Angular Aria Compatibility
- ✅ **ARIA Support**: Built-in ARIA attributes and screen reader support
- ✅ **AriaLiveService**: Custom service for live region announcements
- ✅ **Compatible**: Works alongside Angular Aria components
- ✅ **Accessibility First**: All interactive elements have proper ARIA labels

## 📚 Additional Resources

- [Angular Signals Documentation](https://angular.dev/guide/signals)
- [Angular SSR Guide](https://angular.dev/guide/ssr)
- [Zoneless Angular Guide](https://angular.dev/guide/zoneless)
- [Signal Forms Documentation](https://angular.dev/guide/forms/signal-forms)
- [Angular Aria Documentation](https://angular.dev/guide/accessibility/angular-aria)
- [Vitest Documentation](https://vitest.dev/)
- [Angular Aria Documentation](https://angular.dev/guide/accessibility/angular-aria)
- [Vitest Documentation](https://vitest.dev/)

## 🔍 Version Detection

To check your Angular version:

```bash
ng version
```

To verify compatibility:

```bash
npm list @angular/core @angular/common @angular/forms
```

## 💡 Best Practices

1. **Use Signal Forms** (Angular 21+): Prefer `[field]` input for better integration
2. **Enable SSR**: Improves SEO and initial load performance
3. **Consider Zoneless**: Better performance, component is ready
4. **Use OnPush**: Already enabled, ensures optimal change detection
5. **Platform Checks**: Component handles SSR/CSR automatically

## 🆘 Troubleshooting

### Issue: Component not updating in zoneless app
**Solution**: Component uses `markForCheck()` internally. Ensure you're using signals for reactive updates.

### Issue: SSR errors with DOM access
**Solution**: Component guards all DOM access. Check if you're using any custom code that accesses DOM directly.

### Issue: Signal Forms not working (Angular 21+)
**Solution**: Ensure you're using Angular 21+ and the `[field]` input with a signal form field.

### Issue: Translations not working in SSR
**Solution**: Translations work in SSR. Ensure locale is explicitly set if auto-detection fails on server.

