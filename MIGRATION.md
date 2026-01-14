# Migration Guide

This document provides migration instructions for upgrading between major versions of ngxsmk-datepicker.

## Table of Contents

- [v2.0.1 → v2.0.2](#v201---v202)
- [v2.0.0 → v2.0.1](#v200---v201)
- [v1.9.30 → v2.0.0](#v1930---v200)
- [v1.9.29 → v1.9.30](#v1929---v1930)
- [v1.9.27 → v1.9.28](#v1927---v1928)
- [v1.9.26 → v1.9.27](#v1926---v1927)
- [v1.9.25 → v1.9.26](#v1925---v1926)
- [v1.9.23 → v1.9.25](#v1923---v1925)
- [v1.9.22 → v1.9.23](#v1922---v1923)
- [v1.9.21 → v1.9.22](#v1921---v1922)
- [v1.9.20 → v1.9.21](#v1920---v1921)
- [v1.9.19 → v1.9.20](#v1919---v1920)
- [v1.9.18 → v1.9.19](#v1918---v1919)
- [v1.9.17 → v1.9.18](#v1917---v1918)
- [v1.9.16 → v1.9.17](#v1916---v1917)
- [v1.9.15 → v1.9.16](#v1915---v1916)
- [v1.9.14 → v1.9.15](#v1914---v1915)
- [v1.9.13 → v1.9.14](#v1913---v1914)
- [v1.9.12 → v1.9.13](#v1912---v1913)
- [v1.9.11 → v1.9.12](#v1911---v1912)
- [v1.9.10 → v1.9.11](#v1910---v1911)
- [v1.9.9 → v1.9.10](#v199---v1910)
- [v1.9.8 → v1.9.9](#v198---v199)
- [v1.9.7 → v1.9.8](#v197---v198)
- [v1.9.6 → v1.9.7](#v196---v197)
- [v1.9.5 → v1.9.6](#v195---v196)
- [v1.9.4 → v1.9.5](#v194---v195)
- [v1.9.3 → v1.9.4](#v193---v194)
- [v1.9.2 → v1.9.3](#v192---v193)
- [v1.9.1 → v1.9.2](#v191---v192)
- [v1.9.0 → v1.9.1](#v190---v191)
- [v1.8.0 → v1.9.0](#v180---v190)
- [v1.9.0 → v2.0.0](#v190---v200) (Future)
- [v1.7.0 → v1.8.0](#v170---v180)

## v2.0.1 → v2.0.2

### Changes

- Documentation updates to reflect new version

## v2.0.0 → v2.0.1

### Changes

- Bug fixes and improvements

## v1.9.30 → v2.0.0

### Breaking Changes

This is a major version update with the following breaking changes:

- Updated minimum Angular version requirement to 17.0.0
- Improved Signal Forms integration
- Enhanced timezone handling
- Updated documentation and examples

### Migration Steps

No specific migration steps are required for this update.

## v1.9.29 → v1.9.30

### Installation

Update to the latest version:

```bash
npm install ngxsmk-datepicker@2.0.0
```

### Changes

- **Signal Form Resolution**: Improved the way signal-based form fields are resolved. The datepicker now correctly handles signals that have field properties attached directly to the signal function.
- **Improved Validation**: Enhanced detection of `required` state from Signal Forms schema.
- **Public API**: Exported `SignalFormFieldConfig` for better type safety.

### Breaking Changes

None in v2.0.0.

### v1.9.30

None in v1.9.30.

### Migration Steps

If you are using custom types for Signal Form fields, you can now use the officially exported `SignalFormFieldConfig` interface.

## v1.9.27 → v1.9.28

### Installation

Update to the latest version:

```bash
npm install ngxsmk-datepicker@1.9.28
```

### Changes

- **Input Attributes**: New `inputId`, `name`, and `autocomplete` inputs are available.
- **Improved Validation**: The `required` attribute is now correctly reflected on the internal input element when set via form schema.

### Breaking Changes

None in v1.9.28.

### Migration Steps

No code changes required. The new features are additive.

## v1.9.26 → v1.9.27

### Installation

Update to the latest version:

```bash
npm install ngxsmk-datepicker@1.9.27
```

### Changes

- **Modern Control Flow**: Components migrated to Angular's built-in `@if` and `@for` blocks.
- **Improved Resolution**: Resolved static analysis and module resolution issues in monorepos.

### Breaking Changes

None in v1.9.27.

### Migration Steps

No code changes required. The changes are focused on internal library architecture and build compatibility.

## v1.9.25 → v1.9.26

> ⚠️ **Warning**: Version `1.9.26` has broken styles. It is highly recommended to skip this version and upgrade directly to `1.9.27`.

### Installation

Update to the latest version:

```bash
npm install ngxsmk-datepicker@1.9.26
```

### Changes

- **Core Architecture**: Major internal refactoring to improve maintainability and performance.
- **Ionic Integration**: Fixed localized style exporting issues.

### Breaking Changes

None in v1.9.26.

### Migration Steps

No code changes required. The refactoring is internal and maintains full backward compatibility.

## v1.9.23 → v1.9.25

### Installation

```bash
npm install ngxsmk-datepicker@1.9.25
```

### Changes

- **Strict Mode**: Improved support for strict template type checking in IDEs.
- **NPM Package**: Fixed missing README in package distribution.

### Breaking Changes

None in v1.9.25.

## v1.9.22 → v1.9.23

### Installation

```bash
npm install ngxsmk-datepicker@1.9.23
```

### Changes

- **Signal Forms**: Fixed dirty state tracking for `[field]` binding.
- **CSS Variables**: Improved theming specificity for global variables.

### Breaking Changes

None in v1.9.23.


## v1.9.21 → v1.9.22

### Installation

Update to the latest version:

```bash
npm install ngxsmk-datepicker@1.9.22
```

### Changes

- **Version Update**: Updated to version 1.9.22
- **Stable Release**: Version 1.9.22 is the current stable version

### Bug Fixes

- **Form Control Value Initialization**: Fixed issue where datepicker was not properly updating the displayed month when initialized with form control values
  - The datepicker now correctly displays the month from form control values instead of defaulting to the current month
  - Added proper signal updates and change detection in `writeValue()` method
  - This fix ensures that when using Reactive Forms with initial date values, the calendar opens to the correct month
  - Example: If a form control has a value of January 2026, the calendar will now open showing January instead of the current month

- **Locale Week Start Detection**: Fixed `getFirstDayOfWeek()` function to properly return 1 for en-GB locale and other European locales
  - Added fallback logic for locales where `Intl.Locale.weekInfo` is not available (older browsers/environments)
  - Now correctly returns Monday (1) for en-GB, en-AU, en-NZ, and most European locales
  - Maintains backward compatibility with en-US and other locales that use Sunday (0) as first day
  - All calendar utils tests now passing

### Breaking Changes

None in v1.9.22.

### Deprecations

None in v1.9.22.

## v1.9.20 → v1.9.21

### Installation

Update to the latest version:

```bash
npm install ngxsmk-datepicker@latest
```

### New Features

#### Mobile-Specific Features

Version 1.9.21 introduces comprehensive mobile optimization:

```typescript
// Enable native picker on mobile devices (automatic detection)
<ngxsmk-datepicker
  [useNativePicker]="true"
  [autoDetectMobile]="true"
  [mobileModalStyle]="'bottom-sheet'"
  [enableHapticFeedback]="true">
</ngxsmk-datepicker>
```

**New Inputs:**
- `useNativePicker`: Enable native date picker on mobile devices
- `autoDetectMobile`: Automatically detect mobile devices (default: `true`)
- `mobileModalStyle`: Choose modal style (`'bottom-sheet'`, `'center'`, `'fullscreen'`)
- `enableHapticFeedback`: Enable haptic feedback for interactions

#### Advanced Selection Modes

New selection modes extend the existing `mode` input:

```typescript
// Week selection
<ngxsmk-datepicker mode="week"></ngxsmk-datepicker>

// Month selection
<ngxsmk-datepicker mode="month"></ngxsmk-datepicker>

// Quarter selection
<ngxsmk-datepicker mode="quarter"></ngxsmk-datepicker>

// Year selection
<ngxsmk-datepicker mode="year"></ngxsmk-datepicker>
```

#### Enhanced Time Selection

Seconds selection is now available:

```typescript
<ngxsmk-datepicker
  [showTime]="true"
  [showSeconds]="true"
  [secondInterval]="1">
</ngxsmk-datepicker>
```

**New Inputs:**
- `showSeconds`: Show seconds selector in time picker
- `secondInterval`: Interval for seconds selection (default: `1`)

### Migration Steps

No migration steps required. This is a patch version with new features that are opt-in:

1. **Existing code continues to work**: All existing implementations remain unchanged
2. **New features are opt-in**: Mobile features and new selection modes require explicit configuration
3. **Backward compatible**: All changes maintain full backward compatibility

### Breaking Changes

None. This version is fully backward compatible.

### Compatibility

- Angular 17-22
- All existing features continue to work
- New features are additive only

## v1.9.15 → v1.9.16

### Fixed

- **Range Mode Previous Month Selection**: Fixed issue where users could not select dates from previous months in range mode when starting with `{ start: null, end: null }`
  - Added memo cache invalidation before calendar generation when clicking dates from previous/next months in range mode
  - Fixed issue where clicking dates from previous months would navigate but memoized functions would use stale month/year values
  - Now properly invalidates memo cache in single, range, and multiple modes when navigating to different months via date clicks
  - Users can now select dates from previous months in range mode without issues, allowing proper range selection across month boundaries

### Changed

- **Version Update**: Updated to version 1.9.16
- **Stable Release**: Version 1.9.16 is the current stable version

### Migration Steps

No migration steps required. This is a patch version with bug fixes only. Simply update your package version:

```bash
npm install ngxsmk-datepicker@1.9.16
```

### Breaking Changes

None in v1.9.16.

### Deprecations

None in v1.9.16.

### Notes

- This version maintains full backward compatibility with v1.9.15. All existing code will continue to work without modifications.
- The fix ensures that range mode date pickers work correctly when users click on dates from previous months, especially when starting with null initial values.

## v1.9.20 → v1.9.21

### Changed
- **Version Update**: Updated to version 1.9.21
- **Stable Release**: Version 1.9.21 is the current stable version

### Installation

```bash
npm install ngxsmk-datepicker@1.9.21
```

### Breaking Changes
None in v1.9.21.

### Deprecations
None in v1.9.21.

### Migration Steps
- This version maintains full backward compatibility with v1.9.20. All existing code will continue to work without modifications.
- No code changes required.

## v1.9.19 → v1.9.20

### Fixed
- **Test Environment Compatibility (Issue #71)**: Fixed `TypeError: window.matchMedia is not a function` error in test environments (jsdom/Vitest)
  - Added error handling for `window.matchMedia` in `applyAnimationConfig()` method
  - Component now gracefully handles missing `matchMedia` API in test environments
  - Prevents test failures when running with Vitest and jsdom
  - Added comprehensive test coverage for `matchMedia` compatibility scenarios

### Changed
- **Version Update**: Updated to version 1.9.20
- **Stable Release**: Version 1.9.20 is the current stable version

### Installation

```bash
npm install ngxsmk-datepicker@1.9.20
```

### Breaking Changes
None in v1.9.20.

### Deprecations
None in v1.9.20.

### Migration Steps
- This version maintains full backward compatibility with v1.9.19. All existing code will continue to work without modifications.
- No code changes required.
- Fixes test compatibility issues with Vitest and jsdom environments.

## v1.9.18 → v1.9.19

### Added
- **Comprehensive Responsive Layout Redesign**: Complete redesign of demo project layout for all screen sizes
  - Redesigned navbar for all breakpoints (320px-374px, 375px-479px, 480px-599px, 600px-767px, 768px-1023px, 1024px+)
  - Enhanced sidebar navigation with mobile drawer, tablet collapsible, and desktop fixed layouts
  - Responsive hero section with adaptive typography and button layouts
  - Feature grid responsive design (1 column → 2 columns → 3 columns → 4 columns)
  - Optimized content sections with responsive padding, typography, and spacing

### Changed
- **Version Update**: Updated to version 1.9.19
- **Stable Release**: Version 1.9.19 is the current stable version
- **Meta Tag Update**: Replaced deprecated `apple-mobile-web-app-capable` with `mobile-web-app-capable`
- **Code Cleanup**: Removed unnecessary comments from SCSS files for cleaner codebase

### Installation

```bash
npm install ngxsmk-datepicker@1.9.19
```

### Breaking Changes
None in v1.9.19.

### Deprecations
None in v1.9.19.

### Migration Steps
- This version maintains full backward compatibility with v1.9.18. All existing code will continue to work without modifications.
- No code changes required.
- Demo project layout improvements are automatic and require no code changes.

## v1.9.17 → v1.9.18

### Fixed
- **Mobile Touch Event Handling**: Improved touch listener attachment when calendar opens on mobile devices
  - Touch listeners now properly attach when calendar first opens, eliminating the need to navigate months first
  - Added retry mechanism with multiple attempts to ensure listeners are attached even on slower mobile devices
  - Improved timing with double `requestAnimationFrame` calls and multiple retry strategies

### Changed
- **Version Update**: Updated to version 1.9.18
- **Stable Release**: Version 1.9.18 is the current stable version

### Installation

```bash
npm install ngxsmk-datepicker@1.9.18
```

### Breaking Changes
None in v1.9.18.

### Deprecations
None in v1.9.18.

### Migration Steps
- This version maintains full backward compatibility with v1.9.17. All existing code will continue to work without modifications.
- No code changes required.

## v1.9.16 → v1.9.17

### Changed

- **Version Update**: Updated to version 1.9.17
- **Stable Release**: Version 1.9.17 is the current stable version

### Migration Steps

No migration steps required. This is a patch version update. Simply update your package version:

```bash
npm install ngxsmk-datepicker@1.9.17
```

### Breaking Changes

None in v1.9.17.

### Deprecations

None in v1.9.17.

### Notes

- This version maintains full backward compatibility with v1.9.16. All existing code will continue to work without modifications.
- This is a patch version update with no code changes required.

## v1.9.14 → v1.9.15

### Fixed

- **Moment Object Binding with ngModel**: Fixed issue where Moment.js objects passed via `[(ngModel)]` were not binding correctly with the datepicker
  - Updated `writeValue()` method to normalize Moment.js objects before passing to `initializeValue()`
  - Ensures Moment.js objects (including those with `utcOffset()` applied) are properly converted to Date objects when binding with template-driven forms
  - Now correctly handles `moment(response.Date).utcOffset(timezone)` when setting via ngModel
- **Date Clicks After Month Navigation**: Fixed issue where dates became unclickable after navigating backward or forward months
  - Updated `isDateDisabledMemo` getter to properly invalidate cached memoized function when month/year changes
  - Added month/year change detection to ensure disabled date cache is refreshed after navigation
  - Dates in previous/next months are now properly clickable without needing to close and reopen the datepicker

### Changed

- **Version Update**: Updated to version 1.9.15
- **Stable Release**: Version 1.9.15 is the current stable version

### Migration Steps

No migration steps required. This is a patch version with bug fixes only. Simply update your package version:

```bash
npm install ngxsmk-datepicker@1.9.15
```

All fixes are backward compatible and require no code changes. This version is compatible with Angular 17 and up versions.

## v1.9.13 → v1.9.14

### Fixed

- **Date Picker Selection Issue**: Fixed issue where date picker was not working properly when selecting dates, especially in range mode
  - Added proper change detection scheduling when setting start date in range mode
  - Added memo cache invalidation to ensure UI updates correctly reflect selected dates
  - Fixed UI not updating when only start date is selected in range mode
- **Moment.js Timezone Offset Preservation**: Fixed issue where Moment.js objects with timezone offsets (e.g., `moment().utcOffset('-0600')`) were not preserving the timezone offset when converted to Date objects
  - Added `momentToDate()` method that detects and preserves timezone offsets from Moment.js objects
  - Now correctly handles `moment().utcOffset('-0600')` without requiring `toDate()` which loses timezone information

### Changed

- **Version Update**: Updated to version 1.9.14
- **Stable Release**: Version 1.9.14 is the current stable version

### Migration Steps

No migration steps required. This is a patch version with bug fixes only. Simply update your package version:

```bash
npm install ngxsmk-datepicker@1.9.14
```

All fixes are backward compatible and require no code changes.

## v1.9.12 → v1.9.13

### Fixed

- **valueChange Event Bug**: Fixed issue where `(valueChange)` event was emitting `null` instead of the date value for range mode when using template-driven forms with `[(ngModel)]`
- **Range Mode Date Selection**: Fixed issue where dates became disabled/unclickable after navigating to previous or next months in range mode
- **Moment.js Object Handling**: Fixed issue where Moment.js objects in range values and arrays were not being properly normalized and converted to Date objects

### Changed

- **Version Update**: Updated to version 1.9.13
- **Stable Release**: Version 1.9.13 is the current stable version

### Migration Steps

No migration steps required. This is a patch version with bug fixes only. Simply update your package version:

```bash
npm install ngxsmk-datepicker@1.9.13
```

All fixes are backward compatible and require no code changes.

## v1.9.11 → v1.9.12

### Changed

- **Version Update**: Updated to version 1.9.12
- **Stable Release**: Version 1.9.12 is the current stable version

### Migration Steps

No code changes required. This is a minor version update with backward compatibility:

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.12
   ```

2. Rebuild your application:
   ```bash
   npm run build
   ```

3. Run tests to ensure everything works:
   ```bash
   npm test
   ```

**Note**: This version maintains full backward compatibility with v1.9.11. All existing code will continue to work without modifications.

## v1.9.10 → v1.9.11

### Fixed

- **Moment.js Integration**: Fixed critical issue where Moment.js objects with custom date formats would not populate correctly
  - Added support for Moment.js objects via `.toDate()` method
  - Enhanced format token parsing (YYYY, YY, MM, M, DD, D, hh, h, HH, H, mm, m, ss, s, a, A)
  - Improved TypeScript compatibility with dynamic object properties

### Migration Steps

No code changes required. This is a bug fix release:

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.11
   ```

2. If you're using Moment.js with custom formats, the datepicker will now properly handle Moment.js objects.

## v1.9.9 → v1.9.10

### Fixed

- **Async Database Value Loading**: Enhanced datepicker to properly handle database values that load asynchronously
  - Added fallback sync mechanisms for async database loads
  - Extended sync duration to 30 seconds with 100ms check intervals
- **TypeScript Compilation Error**: Fixed `EffectRef` type error when using Angular 17+ `effect()` API
- **Test Configuration**: Fixed test configuration for Angular 17+ compatibility

### Migration Steps

No code changes required. This is a bug fix release:

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.10
   ```

2. If you're experiencing issues with database values not populating, this version should resolve them.

## v1.9.8 → v1.9.9

### Fixed

- **Database Value Population**: Fixed critical issue where datepicker would not populate with values from database when using `[field]` input binding
  - Now properly handles Date objects, string dates, range objects, and arrays of dates

### Migration Steps

No code changes required. This is a bug fix release:

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.9
   ```

## v1.9.7 → v1.9.8

### Fixed

- **Date Selection Reset Issue**: Fixed critical bug where selected dates would reset to today's date when using `[field]` input binding
  - Fixed date mutation issues
  - Added internal update flag to prevent value resets

### Migration Steps

No code changes required. This is a bug fix release:

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.8
   ```

## v1.9.6 → v1.9.7

### Fixed

- **Calendar Population**: Fixed critical issue where datepicker calendar would not populate with dates when opened
  - Fixed issue when multiple datepickers were present in the same form

### Migration Steps

No code changes required. This is a bug fix release:

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.7
   ```

## v1.9.5 → v1.9.6

### Fixed

- **Multiple Datepicker Management**: Fixed issue where multiple datepickers in the same form would open in the same centered location
- **Outside Click Detection**: Improved click detection to properly close datepicker
- **Auto-close Other Datepickers**: When opening a datepicker, all other open datepickers are now automatically closed
- **Mobile Datepicker**: Fixed issues with mobile datepicker opening and closing
- **Select Box Cursor**: Added pointer cursor to all select boxes

### Migration Steps

No code changes required. This is a bug fix release:

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.6
   ```

## v1.9.4 → v1.9.5

### Fixed

- **Angular 21+ Signal Forms Type Compatibility**: Fixed TypeScript compilation error with Angular 21+ Signal Forms
  - Fixed `Type '() => string' is not assignable to type 'never'` error when using `[field]` input
  - Updated `SignalFormField` type definition to be compatible with Angular 21's `FieldTree<Date, string>` types
  - Maintains backward compatibility with Angular 17-20

### Migration Steps

No code changes required. This is a bug fix release:

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.5
   ```

2. If you were experiencing TypeScript errors with Signal Forms in Angular 21+, they should now be resolved.

## v1.9.3 → v1.9.4

### Added

- **Custom Date Format**: New `[displayFormat]` input property to display dates in custom formats
  - Supports format strings like "MM/DD/YYYY hh:mm A"
  - Works with date adapters (date-fns, dayjs, luxon) or built-in simple formatter
  - Supports common format tokens: YYYY, MM, DD, hh, mm, A, etc.

### Fixed

- **Time Selection Dropdowns**: Fixed visibility issues with time selection dropdowns
  - Dropdowns now properly display and are not clipped by parent containers
  - Improved z-index handling for time selection dropdowns

### Migration Steps

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.4
   ```

2. **Optional**: Use the new `[displayFormat]` input for custom date formatting:
   ```html
   <ngxsmk-datepicker
     [displayFormat]="'MM/DD/YYYY hh:mm A'"
     mode="single">
   </ngxsmk-datepicker>
   ```

## v1.9.2 → v1.9.3

### Added

- **Time-Only Picker**: New `[timeOnly]` input property to display only time selection without calendar
  - Hides calendar grid and shows only time controls (hour, minute, AM/PM)
  - Automatically enables `showTime` when `timeOnly` is true
  - Perfect for time selection scenarios where date is not needed

### Fixed

- **Test Suite**: Fixed 25+ failing tests across multiple test files
  - All 353 tests now pass successfully

### Migration Steps

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.3
   ```

2. **Optional**: Use the new `[timeOnly]` input for time-only selection:
   ```html
   <ngxsmk-datepicker
     [timeOnly]="true"
     placeholder="Select Time">
   </ngxsmk-datepicker>
   ```

## v1.9.1 → v1.9.2

### Changed

- **Bundle Optimization**: Optimized bundle size with improved TypeScript compiler settings
  - Main bundle: ~127KB (source maps excluded from published package)
  - Enhanced tree-shaking with optimized imports and compiler options
  - Source maps automatically removed from production builds

### Fixed

- Test suite configuration improvements
- Bundle analysis now correctly excludes source maps
- Build warnings from conflicting export conditions resolved

### Migration Steps

No code changes required. This is a transparent update with optimizations:

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.2
   ```

2. Rebuild your application to benefit from bundle optimizations:
   ```bash
   npm run build
   ```

## v1.9.0 → v1.9.1

### New Features

*No new features in v1.9.1.*

### Changes

#### Bundle Optimization

The library bundle has been further optimized for production:

- **Bundle Size**: Main bundle is now ~127KB (source maps excluded from published package)
- **TypeScript Compiler**: Enhanced settings for better tree-shaking
  - Added `importsNotUsedAsValues: "remove"` for smaller output
  - Disabled `preserveConstEnums` for better inlining
- **Source Maps**: Automatically removed from production builds (saves ~127KB)
- **Package Configuration**: Fixed exports to eliminate build warnings

**For Developers:**
- Use `npm run build:optimized` for production builds
- Use `npm run build:analyze` to check bundle size
- Source maps are automatically excluded from the published package

#### Build Process Improvements

- Source maps are now automatically removed from production builds
- Improved build scripts with better error handling
- Enhanced bundle analysis that correctly excludes source maps

#### Package Configuration

- Fixed `package.json` exports to eliminate build warnings
- Optimized `files` array to exclude unnecessary files
- Updated exports field for better module resolution

#### Test Configuration

- Added Zone.js polyfills to library test configuration
- Updated test commands to explicitly target library project
- Improved test reliability across Angular versions

### Breaking Changes

None in v1.9.1.

### Deprecations

None in v1.9.1.

### Migration Steps

No code changes required. This is a transparent update with optimizations and bug fixes:

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^1.9.1
   ```

2. Rebuild your application:
   ```bash
   npm run build
   ```

3. Verify bundle size improvements (optional):
   - Check your application's bundle size
   - You should see improved tree-shaking benefits

4. Run tests to ensure everything works:
   ```bash
   npm test
   ```

**Note**: If you're a library developer using ngxsmk-datepicker as a dependency, you may notice:
- Smaller bundle sizes in your application
- Fewer build warnings related to package exports
- Improved test reliability if you're running tests with Zone.js

## v1.8.0 → v1.9.0

### New Features

#### Extension Points & Hooks

Added comprehensive hook system for customization.

**New Input:**
```typescript
hooks: DatepickerHooks | null = null;
```

**Usage:**
```typescript
const myHooks: DatepickerHooks = {
  getDayCellClasses: (date, isSelected, isDisabled, isToday, isHoliday) => {
    return isHoliday ? ['custom-holiday'] : [];
  },
  validateDate: (date, currentValue, mode) => {
    return date.getDay() !== 0; // Disable Sundays
  }
};
```

```html
<ngxsmk-datepicker [hooks]="myHooks"></ngxsmk-datepicker>
```

#### Enhanced Keyboard Shortcuts

New keyboard shortcuts:
- `Y`: Select yesterday
- `N`: Select tomorrow
- `W`: Select next week

#### Animation Optimizations

All animations now use GPU acceleration for better performance. No code changes required.

#### Bundle Optimization

The library bundle has been optimized for production:
- **Bundle Size**: Main bundle is now ~127KB (source maps excluded from published package)
- **Tree-Shaking**: Enhanced with optimized TypeScript compiler settings
- **Source Maps**: Automatically removed from production builds (saves ~127KB)
- **No Breaking Changes**: All optimizations are transparent to end users

**For Developers:**
- Use `npm run build:optimized` for production builds
- Use `npm run build:analyze` to check bundle size
- Source maps are automatically excluded from the published package

### Breaking Changes

None in v1.9.0.

### Deprecations

None in v1.9.0.

## v1.7.0 → v1.8.0

### New Features

#### Signal Forms Support

Added `[field]` input for Angular 21+ Signal Forms integration.

**Before:**
```typescript
// Using Reactive Forms
dateControl = new FormControl<DatepickerValue>(null);
```

```html
<ngxsmk-datepicker formControlName="date"></ngxsmk-datepicker>
```

**After (Optional - Reactive Forms still work):**
```typescript
// Using Signal Forms
localObject = signal({ date: null as DatepickerValue });
myForm = form(this.localObject, objectSchema({
  date: objectSchema<DatepickerValue>()
}));
```

```html
<ngxsmk-datepicker [field]="myForm.date"></ngxsmk-datepicker>
```

#### SSR Optimizations

The datepicker is now fully SSR-compatible. No code changes required, but ensure you're using the latest version for SSR applications.

#### Improved Value Input

The `[value]` input now initializes immediately when set programmatically.

**Before:**
```typescript
// Value might not initialize immediately
component.value = new Date();
```

**After:**
```typescript
// Value initializes immediately
component.value = new Date();
```

### Breaking Changes

None in v1.8.0.

### Deprecations

None in v1.8.0.

## v1.9.0 → v2.0.0

### Planned Breaking Changes

*This section will be updated when v2.0.0 is released.*

### Migration Steps

1. Update package version:
   ```bash
   npm install ngxsmk-datepicker@^2.0.0
   ```

2. Review breaking changes below
3. Update your code according to migration steps
4. Run tests
5. Update any custom styles if CSS classes changed

## General Migration Tips

### 1. Read the Changelog

Always check `CHANGELOG.md` for detailed changes in each version.

### 2. Test Thoroughly

After upgrading:
- Test all datepicker instances in your app
- Verify form integration still works
- Check SSR compatibility if applicable
- Test keyboard navigation
- Verify accessibility features

### 3. Update Dependencies

Ensure your Angular version is compatible:
- Check the compatibility table in README.md
- Update Angular if needed

### 4. Check TypeScript Errors

New versions may have stricter types:
```bash
npm run build
# Fix any TypeScript errors
```

### 5. Review CSS Changes

If you've customized styles:
- Check if CSS class names changed
- Review CSS custom properties
- Update selectors if needed

## Getting Help

If you encounter issues during migration:

1. Check existing GitHub issues
2. Review the documentation
3. Open a new issue with:
   - Your current version
   - Target version
   - Error messages
   - Code examples

## Version Compatibility

| ngxsmk-datepicker | Angular | Node.js |
|-------------------|---------|---------|
| 1.9.17+ | 17-22 | 18+ |
| 1.9.16 | 17-22 | 18+ |
| 1.9.15 | 17-22 | 18+ |
| 1.9.14 | 17-22 | 18+ |
| 1.9.11 | 17-22 | 18+ |
| 1.9.10 | 17-22 | 18+ |
| 1.9.9 | 17-22 | 18+ |
| 1.9.8 | 17-22 | 18+ |
| 1.9.7 | 17-22 | 18+ |
| 1.9.6 | 17-22 | 18+ |
| 1.9.5 | 17-22 | 18+ |
| 1.9.4 | 17-22 | 18+ |
| 1.9.3 | 17-22 | 18+ |
| 1.9.2 | 17-22 | 18+ |
| 1.9.1 | 17-22 | 18+ |
| 1.9.0 | 17-22 | 18+ |
| 1.8.0 | 17-22 | 18+ |
| 1.7.0 | 17-20 | 18+ |

## Deprecation Timeline

When APIs are deprecated:

1. **Deprecation Notice**: API marked with `@deprecated` JSDoc
2. **Warning Period**: Deprecated API remains functional for at least one major version
3. **Removal**: Deprecated API removed in next major version

Example:
- v1.8.0: API deprecated
- v1.9.0: Still works with deprecation warning
- v1.9.1: Still works with deprecation warning
- v2.0.0: Removed

