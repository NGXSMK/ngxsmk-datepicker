# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-02-05

### Fixed

- **Package Configuration**: Corrected TypeScript declaration paths in package.json
  - Updated `types` and `typings` fields to point to `types/ngxsmk-datepicker.d.ts` instead of non-existent `index.d.ts`
  - Simplified `exports` field to match v2.0.9 format, removing unnecessary module export configurations
  - Removed disallowed `esm2022` property from package.json
  - Ensures proper TypeScript module resolution in consuming applications

### Changed

- **Package Distribution**: Streamlined package exports configuration for better compatibility
  - Aligned exports structure with stable v2.0.9 format
  - Removed redundant module resolution entries for cleaner package.json

### Important Notice

⚠️ **Versions 2.0.10 and 2.0.11 have been unpublished from npm** due to critical package configuration issues that prevented proper TypeScript module resolution. All users should upgrade to v2.1.0 or later.

## [2.0.11] - 2026-02-05 [BROKEN - UNPUBLISHED]

**⚠️ This version has been unpublished from npm due to incorrect package configuration. Use v2.1.0 instead.**

### Fixed

- **TypeScript Type Declarations**: Attempted to fix "Could not find a declaration file for module 'ngxsmk-datepicker'" error
  - Added proper `exports` field in package.json with correct type declaration path
  - Configured exports to point to `index.d.ts` for TypeScript module resolution
  - **Note**: This fix was incomplete and the version has been replaced by v2.1.0

## [2.0.10] - 2026-02-05 [BROKEN - UNPUBLISHED]

**⚠️ This version has been unpublished from npm due to incorrect package configuration. Use v2.1.0 instead.**

### Fixed

- **Infinite Recursion in Date Utilities**: Fixed `RangeError: Maximum call stack size exceeded` in `getEndOfDay()` function
  - Refactored recursive logic to use direct date manipulation
  - Replaced recursive `addMonths` calls with iterative approach
  - Improves performance and eliminates stack overflow risk
- **Timezone Test Edge Cases**: Fixed date component preservation in timezone conversion tests
  - Updated timezone tests to use `Date.UTC()` for consistent cross-environment behavior
  - Ensures test reliability across different system timezones with non-integer offsets (UTC+5:30, etc.)

### Optimized

- **Build and Release**: Removed unnecessary generated files from distribution
  - Cleaned up coverage reports and build artifacts
  - Streamlined demo app output

## [2.0.9] - 2026-01-31

### Optimized

- **Stylesheet Architecture**: Comprehensive optimization of CSS assets
  - Replaced redundant mobile stylesheets with a unified "Responsive Overrides" system
  - Removed deprecated keyframes and duplicate selectors
  - Enhanced commenting standards with industrial/professional documentation style
  - Reduced CSS bundle size by eliminating unused styles

### Fixed

- **Sticky Header Overlap**: Resolved critical z-index stacking issue where sticky headers would overlap the datepicker popup
  - Implemented aggressive z-index boost (`2147483647`) for the host component when active
  - Ensures datepicker always floats above application navigation bars and modal backdrops
- **Mobile Dropup Positioning**: Fixed footer clipping issues on mobile devices
  - Time selection dropdowns now intelligently open upwards ("dropup") on screens < 992px
  - Prevents dropdown options from being cut off by the bottom of the viewport or sticky footers
  - Improved touch interactions for time selection on mobile

## [2.0.8] - 2026-01-31

### Added

- **Ionic Integration**: Added automatic support for Ionic CSS variables
  - Datepicker now automatically inherits Ionic app theme colors (primary, background, text)
  - No additional configuration required for native look and feel in Ionic apps
  - Documented integration steps in README

### Optimized

- **Change Detection**: Optimized internal change detection strategy
  - Removed redundant `ChangeDetectorRef` calls in favor of Signal-based updates
  - Improved compatibility with Zoneless Angular applications
  - Cleaner and more efficient state management

### Fixed

- **Mobile Page Jump**: Fixed issue where selecting a date would cause the page to jump to the top on some mobile browsers (Firefox Android)
  - Added `{ preventScroll: true }` to focus restoration logic
- **Dropdown Scrolling**: Fixed UX issue in month/year dropdowns
  - Dropdowns now automatically scroll to the currently selected option when opened
  - Improved mobile scrolling behavior within dropdowns by removing conflicting close logic

### Changed

- **Version Update**: Updated to version 2.0.8

## [2.0.7] - 2026-01-26

- **Version Update**: Updated to version 2.0.7

## [2.0.6] - 2026-01-15

### Enhanced

- **Range Picker Reselection**: Improved comprehensive range reselection behavior
  - Clicking the start date when a complete range is selected now clears only the end date
  - Clicking the end date when a complete range is selected now clears the start date and sets the end date as the new start date
  - **NEW**: Clicking any date within the selected range now clears the end date and sets the clicked date as the new start date
  - Allows users to easily redefine date ranges from any point (start, end, or within the range)
  - Example scenarios:
    - Range: Jan 10 - Jan 20, Click Jan 10 → Result: Jan 10 (can select new end)
    - Range: Jan 10 - Jan 20, Click Jan 20 → Result: Jan 20 (can select new end)
    - Range: Jan 26 - Jan 30, Click Jan 27 → Result: Jan 27 (can select new end)
  - Improves usability by providing intuitive range adjustment from any direction

### Changed

- **Code Cleanup**: Removed unnecessary inline comments from range selection logic for cleaner, more maintainable code
- **Version Update**: Updated to version 2.0.6

## [2.0.5] - 2026-01-15

### Enhanced

- **Range Picker Reselection**: Improved user experience when reselecting date ranges
  - Clicking the start date again after selecting a complete range now clears only the end date
  - Allows users to easily redefine the end date without clearing the entire selection
  - The start date remains selected, and users can immediately choose a new end date
  - Example: After selecting Jan 19 (start) → Jan 21 (end), clicking Jan 19 again keeps Jan 19 selected and clears Jan 21
  - Improves usability by reducing clicks needed to adjust date ranges

### Fixed

- **Range Mode Value Emission**: Fixed issue where clicking the start date again after a complete range was selected would update the visual state but not emit the value change
  - The datepicker now properly emits a partial range value (`{ start: Date, end: null }`) when the end date is cleared
  - Parent components and form bindings now correctly reflect the cleared end date state
  - Resolves inconsistency between visual calendar state and bound values

### Patch Changes

- **Version Update**: Updated to version 2.0.5
- **Documentation**: Added comprehensive "Form Validation" section to README to explain `readonly` input behavior and provide solutions for native browser validation (e.g., using `allowTyping="true"`).

## [2.0.4] - 2026-01-14

### Patch Changes

- **Version Update**: Updated to version 2.0.4
- **Validation Fix**: Fixed issue where `[field]` validation messages were not triggering because the `touched` state was not being synced to the field. Added `markAsTouched` support to `FieldSyncService` and updated `NgxsmkDatepickerComponent` to mark the field as touched on blur and value selection.

## [2.0.3] - 2026-01-14

### Patch Changes

- **Version Update**: Updated to version 2.0.3
- **Code Cleanup**: Removed unnecessary comments from `field-sync.service.ts` to improve code readability and maintainability.
- **Bug Fixed**: Verified fixes for issues #136, #112, #84, and #71.
- **TypeScript Compatibility**: Fixed `SignalFormField` and `SignalFormFieldConfig` types to be fully compatible with Angular 21+ `FieldTree<string | Date | null, string>` structure. The types now accept `WritableSignal<string | Date | null>` from Angular's Signal Forms, resolving TypeScript compilation errors when using `[field]` binding.

## [2.0.2] - 2026-01-14

### Patch Changes

- **Version Update**: Updated to version 2.0.2
- **Documentation**: Updated all documentation to reflect new version

## [2.0.1] - 2026-01-14

### Patch Changes

- **Version Update**: Updated to version 2.0.1
- **Bug Fixes**: Minor bug fixes and improvements
- **Documentation**: Updated all documentation to reflect new version

## [2.0.0] - 2026-01-14

### Major Changes

- **Version Update**: Updated to version 2.0.0
- **Breaking Changes**:
  - Updated minimum Angular version requirement to 17.0.0
  - Improved Signal Forms integration
  - Enhanced timezone handling
- **Documentation**: Updated all documentation to reflect new version

## [1.9.29] - 2026-01-13

### Added

- **Angular Signal Forms Validation Support**: Full support for schema-based validation with Angular 21+ Signal Forms
  - Automatically detects and responds to validation errors from the field's `errors()` signal
  - Recognizes `required` validation from schema (e.g., `required(p.dateDue)`)
  - Updates component's `errorState` based on field's `invalid()` signal
  - Reactive updates when validation state changes
  - Resolves [#136](https://github.com/NGXSMK/ngxsmk-datepicker/issues/136) - "datepicker doesn't recognise 'required' attribute in schema"
- **Validation Error Types**: Added `ValidationError` interface to support Angular Signal Forms error structure
- **Error State Callback**: Added `onErrorStateChanged` callback to `FieldSyncCallbacks` for validation state tracking
- **Comprehensive Documentation**: Added `docs/SIGNAL_FORMS_VALIDATION.md` with usage examples, API reference, and migration guide
- **Test Coverage**: Added comprehensive test suite in `signal-forms-validation.spec.ts` for validation scenarios
- **Input Attributes Support**: Added support for standard input attributes on the datepicker input element
  - `inputId`: Custom ID support (defaults to component unique ID)
  - `name`: Form name attribute support
  - `autocomplete`: Autocomplete attribute support (defaults to 'off')
  - `aria-invalid`: Accessibility support for invalid state visibility
- **Keyboard Shortcuts Help Dialog**: Added a built-in help dialog for keyboard shortcuts, accessible via `?` or `Shift + /`.
- **New Shortcut**: Added `?` keyboard shortcut to toggle the help dialog.

### Enhanced

- **Field Sync Service**: Enhanced with new helper methods
  - `readFieldErrors()`: Reads validation errors from field's `errors` signal
  - `readRequiredState()`: Checks for required validation in errors or direct property (prioritizes schema validation)
  - `hasValidationErrors()`: Determines if field has any validation errors
- **Backward Compatibility**: Maintains full compatibility with:
  - Direct `required` attribute: `<ngxsmk-datepicker required>`
  - Reactive Forms: `<ngxsmk-datepicker [formControl]="dateControl">`
  - Template-driven forms: `<ngxsmk-datepicker [(ngModel)]="date">`
  - Direct `required` property on field: `field.required = true`

### Fixed

- **Header Layout**: Fixed CSS issue where the datepicker header width was not spanning the full container width, ensuring consistent layout across all screen sizes.
- **Angular Signal Forms Schema Validation**: Fixed issue where `required` attribute from schema was not properly reflected on the input and form validation
- **Month Navigation**: Fixed a critical bug where navigating to the next month would skip a month (e.g., Jan -> Mar) if the current date was the 31st (due to JS Date overflow). Navigation now correctly calculates from the start of the month.
- **Signal Forms Integration**: Critical fix for `[field]` binding where Signal fields (passed as functions) were being ignored, preventing validation metadata (like `.required`) from being read.
- **Range Navigation**: Fixed usability issue where selecting an end date in a different month would unexpectedly reset the calendar view back to the start date's month, causing confusion.
- **Field Sync Service**: Updated `readRequiredState` and `readDisabledState` to correctly process function-type fields (Signals).

### Changed

- **Version Update**: Updated to version 1.9.29

## [1.9.27] - 2026-01-10

### Refactored

- **Modern Control Flow**: Fully migrated all standalone components (`NgxsmkDatepickerComponent`, `CalendarHeaderComponent`, `CalendarMonthViewComponent`, `CalendarYearViewComponent`, `TimeSelectionComponent`, `CustomSelectComponent`) to modern Angular `@if` and `@for` block syntax.
- **Optimized Imports**: Replaced monolithic `CommonModule` with individual directive and pipe imports (`NgClass`, `NgTemplateOutlet`, `DatePipe`) in all standalone components. This improves tree-shaking and resolves resolution conflicts in some environments.

### Fixed

- **Module Resolution**: Resolved "Value could not be determined statically" error when importing standalone library components into traditional NgModules in some monorepo configurations.
- **Build Process**: Fixed library compilation error (`TS6133`) caused by unused `CommonModule` after migration to modern control flow.
- **Monorepo Compatibility**: Improved Angular core dependency resolution for example applications to prevent "duplicate symbol" and "exported symbol not found" errors during development.

### Maintenance

- **Git**: Added `/examples` directory to `.gitignore` to prevent committing experimental test applications.

### Changed

- **Version Update**: Updated to version 1.9.27

## [1.9.26] - 2026-01-09

> ⚠️ **DO NOT USE**: This version contains broken styles. Please use v1.9.27 or v1.9.25 instead.

### Refactored

- **Core Architecture**: Major refactoring of `NgxsmkDatepickerComponent` to address "God Component" issues
  - Split monolithic component into dedicated sub-components: `CalendarMonthViewComponent`, `CalendarYearViewComponent`
  - Integrated `CalendarHeaderComponent` and `TimeSelectionComponent` to handle specific functional areas
  - Removed 1000+ lines of inline template code, significantly improving maintainability and readability
  - Improved strict template type checking support
  - **No breaking changes** to the public API

### Fixed

- **Ionic Integration**: Fixed issue where `ionic-integration.css` was not exported in the package bundle
  - Moved styles to allow correct exporting via package logic
  - Ensures `@import 'ngxsmk-datepicker/styles/ionic-integration.css'` works as documented
  - Resolves [#123](https://github.com/NGXSMK/ngxsmk-datepicker/issues/123)

### Fixed (Mobile UI)

- **Mobile View Styles**: Enhanced mobile UI styles for both Angular and Ionic projects
  - Added proper positioning and animations for `bottom-sheet` and `fullscreen` mobile modes
  - Fixed missing styles in core `datepicker.css` that prevented `mobileModalStyle` from working correctly
  - Improved gesture handling and transition animations for mobile devices

### Changed

- **Version Update**: Updated to version 1.9.26

## [1.9.25] - 2026-01-06

### Fixed

- **IDE Support**: Fixed "This component requires inline template type-checking" error by including all source files in tsconfig
  - Ensures accurate template type checking in VS Code and other IDEs
- **NPM Package**: Fixed issue where `README.md` was missing from the npm package
  - Updated build scripts to ensure `README.md` is correctly included in the distribution
  - Ensures proper documentation rendering on npmjs.com

### Changed

- **Version Update**: Updated to version 1.9.25

## [1.9.23] - 2025-12-15

### Fixed

- **Signal Forms Dirty State Tracking (Issue #112)**: Fixed issue where Angular Signal Forms were not being marked as dirty when date values changed through the `[field]` binding
  - Improved `updateFieldFromInternal()` method to always prefer `setValue()` and `updateValue()` methods over direct signal mutation
  - Added dev mode warnings when falling back to direct signal mutation, which may bypass dirty state tracking
  - Enhanced error handling to track which update method succeeded and provide better diagnostics
  - The datepicker now properly marks forms as dirty when using `[field]` binding with Angular 21+ Signal Forms
  - Added comprehensive test coverage for Signal Forms dirty state tracking
  - Updated documentation with detailed guidance on proper usage patterns and troubleshooting
  - Resolves [#112](https://github.com/NGXSMK/ngxsmk-datepicker/issues/112)

- **CSS Variables Theming (Issue #84)**: Fixed issue where CSS variables theming was not working when variables were defined in the global `:root` selector
  - Enhanced CSS selector from `:root` to `:root, :root > body` for higher specificity
  - Added `!important` flags to inline styles to ensure they override existing styles
  - ThemeBuilderService now properly overrides global stylesheet variables
  - Updated documentation to explain the fix and provide guidance
  - Resolves [#84](https://github.com/NGXSMK/ngxsmk-datepicker/issues/84)

### Changed

- **Version Update**: Updated to version 1.9.23

## [1.9.22] - 2025-12-14

### Fixed

- **Form Control Value Initialization**: Fixed issue where datepicker was not properly updating the displayed month when initialized with form control values
  - Added `_updateMemoSignals()` call in `writeValue()` method to ensure month/year signals are properly updated
  - Added `scheduleChangeDetection()` to trigger UI updates when form control values are set
  - Ensures datepicker correctly displays the month from form control values instead of defaulting to current month
  - Resolves issue where demo app datepickers were showing December instead of the correct month from form control values
  - Fixes calendar month display when using Reactive Forms with initial values

- **Locale Week Start Detection**: Fixed `getFirstDayOfWeek()` function to properly return 1 for en-GB locale
  - Added fallback logic for locales where `Intl.Locale.weekInfo` is not available (older browsers/environments)
  - Implemented locale-based mapping for common locales (en-GB, en-AU, en-NZ, and most European locales return 1 for Monday)
  - Now correctly returns Monday (1) for en-GB and other European locales
  - Maintains backward compatibility with en-US and other locales that use Sunday (0) as first day
  - All calendar utils tests now passing (19/19 tests)

### Changed

- **Version Update**: Updated to version 1.9.22

## [1.9.21] - 2025-12-10

### Added

- **Mobile-Specific Features**: Comprehensive mobile optimization and native integration
  - Native date picker integration with `useNativePicker` input for automatic native picker on mobile devices
  - Bottom sheet modal style with swipe-to-dismiss gesture support
  - Mobile-optimized time picker with enhanced touch interactions
  - Enhanced gesture support: double-tap on today to select, swipe up/down for year navigation
  - Haptic feedback support with `enableHapticFeedback` input (light, medium, heavy vibrations)
  - Mobile keyboard optimizations for better input experience
  - Mobile-specific animations and transitions
  - Auto-detection of mobile devices with `autoDetectMobile` input
  - Mobile modal styles: `bottom-sheet`, `center`, and `fullscreen` options

- **Advanced Selection Modes**: Extended selection capabilities beyond single/range/multiple
  - Week selection mode: Select entire weeks with configurable week start day
  - Month selection mode: Select entire months with start/end dates
  - Quarter selection mode: Select quarters (Q1, Q2, Q3, Q4) with proper date ranges
  - Year selection mode: Select entire years with January 1st to December 31st ranges
  - All new modes work seamlessly with existing validation, constraints, and formatting

- **Enhanced Time Selection**: Improved time picker functionality
  - Seconds selection with `showSeconds` input and `secondInterval` configuration
  - `currentSecond` property for programmatic second control
  - Infrastructure for time range selection (future enhancement)

- **Code Refactoring**: Improved maintainability and performance
  - `CalendarGenerationService`: Extracted calendar generation logic for better separation of concerns
  - `DisplayFormattingService`: Centralized display formatting logic with support for all selection modes
  - `DateValidationService`: Extracted date validation logic for reusable validation across components
  - Reduced main component size and complexity
  - Improved code organization and testability

- **Accessibility Enhancements**: Improved screen reader and keyboard navigation
  - Enhanced ARIA live region announcements with debouncing and queue management
  - Improved focus trap management with proper focus return on close
  - Better screen reader support for all new selection modes
  - High contrast mode styling improvements

- **Performance Optimizations**: Infrastructure for better performance
  - Virtual scrolling infrastructure for year/decade views (ready for future implementation)
  - Lazy loading calendar months with intelligent caching (up to 24 months)
  - Calendar month cache with automatic size management
  - Preloading of adjacent months for smoother navigation

- **Test Coverage**: Comprehensive test suite updates
  - New service tests: `CalendarGenerationService`, `DisplayFormattingService`, `DateValidationService`
  - Updated comprehensive component tests with new selection modes
  - Updated utility function tests for week/month/quarter/year helpers
  - Updated E2E tests for mobile features and new selection modes
  - All 414 tests passing with improved coverage

### Changed

- **Version Update**: Updated to version 1.9.21
- **Hooks Interface**: Extended hooks interface to support new selection modes (`week`, `month`, `quarter`, `year`)
- **Type Definitions**: Updated `DatepickerValue` type to explicitly handle range mode with `[Date, Date | null]`
- **Service Architecture**: Refactored component to use new services for better maintainability

### Fixed

- **Angular 21 Signal Forms Integration (Issue #80)**: Fixed broken `[field]` input binding with Angular 21 Signal Forms
  - Improved signal detection in `readFieldValue()` to handle Angular 21's `FieldTree<Date, string>` structure
  - Enhanced effect setup to properly track Signal Forms dependencies when `field.value` is a function returning a signal
  - Fixed `updateFieldFromInternal()` to handle cases where `field.value` is a function that returns a writable signal
  - Now correctly handles Angular 21 Signal Forms where `field.value` is a function that returns the actual signal
  - Resolves [#80](https://github.com/NGXSMK/ngxsmk-datepicker/issues/80)
- **Build Issues**: Fixed TypeScript compilation errors related to strict null checks
- **Test Failures**: Fixed async timing issues in AriaLiveService tests
- **Calendar Generation**: Fixed structural issues in calendar generation method
- **Type Safety**: Improved type safety with explicit null checks and proper type definitions

### Migration Notes

- This is a patch version update
- No breaking changes from v1.9.20
- All changes are backward compatible
- Compatible with Angular 17-22
- New features are opt-in and don't affect existing implementations
- Mobile features automatically detect mobile devices but can be disabled with `autoDetectMobile="false"`
- New selection modes extend existing `mode` input with additional options

## [1.9.20] - 2025-12-06

### Fixed

- **Test Environment Compatibility (Issue #71)**: Fixed `TypeError: window.matchMedia is not a function` error in test environments (jsdom/Vitest)
  - Added try-catch block around `window.matchMedia` call in `applyAnimationConfig()` method
  - Component now gracefully handles missing `matchMedia` API in test environments
  - Prevents test failures when running with Vitest and jsdom
  - Added comprehensive test coverage for `matchMedia` compatibility scenarios

### Changed

- **Version Update**: Updated to version 1.9.20

### Migration Notes

- This is a patch version update
- No breaking changes from v1.9.19
- All changes are backward compatible
- Compatible with Angular 17-22
- Fixes test compatibility issues with Vitest and jsdom environments

## [1.9.19] - 2025-01-15

### Added

- **Comprehensive Responsive Layout Redesign**: Complete redesign of demo project layout for all screen sizes
  - Redesigned navbar for all breakpoints (320px-374px, 375px-479px, 480px-599px, 600px-767px, 768px-1023px, 1024px+)
  - Enhanced sidebar navigation with mobile drawer, tablet collapsible, and desktop fixed layouts
  - Responsive hero section with adaptive typography and button layouts
  - Feature grid responsive design (1 column → 2 columns → 3 columns → 4 columns)
  - Optimized content sections with responsive padding, typography, and spacing
  - Improved example demo containers, code blocks, mobile preview containers, and result boxes
  - Better touch targets and visual hierarchy across all breakpoints

### Changed

- **Version Update**: Updated to version 1.9.19
- **Meta Tag Update**: Replaced deprecated `apple-mobile-web-app-capable` with `mobile-web-app-capable`
- **Code Cleanup**: Removed unnecessary comments from SCSS files for cleaner codebase

### Migration Notes

- This is a patch version update
- No breaking changes from v1.9.18
- All changes are backward compatible
- Compatible with Angular 17-22
- Demo project layout improvements are automatic and require no code changes

## [1.9.18] - 2025-11-22

### Fixed

- **Mobile Touch Event Handling**: Improved touch listener attachment when calendar opens on mobile devices
  - Touch listeners now properly attach when calendar first opens, eliminating the need to navigate months first
  - Added retry mechanism with multiple attempts to ensure listeners are attached even on slower mobile devices
  - Improved timing with double `requestAnimationFrame` calls and multiple retry strategies
  - Enhanced mobile rendering timing to handle DOM delays

### Changed

- **Version Update**: Updated to version 1.9.18

### Migration Notes

- This is a patch version update
- No breaking changes from v1.9.17
- All changes are backward compatible
- Compatible with Angular 17-22
- Improved mobile experience with better touch event handling

## [1.9.17] - 2025-11-21

### Added

- **Calendar Button Visibility Control**: Added `showCalendarButton` input property to show/hide the calendar icon button
  - Defaults to `true` for backward compatibility
  - When set to `false`, users can still open the calendar by clicking the input field
  - Useful for custom UI designs or when using `allowTyping` with custom calendar triggers
- **Calendar Button Styling**: Added `calendarBtn` to `DatepickerClasses` for custom styling of the calendar button

### Changed

- **Version Update**: Updated to version 1.9.17
- **Type Compatibility**: Updated `SignalFormField` type to be fully compatible with Angular 21's `FieldTree<Date, string>` types

### Migration Notes

- This is a patch version update
- No breaking changes from v1.9.16
- All changes are backward compatible
- Compatible with Angular 17-22
- The calendar button is visible by default (`showCalendarButton="true"`), existing behavior unchanged

## [1.9.16] - 2025-11-20

### Fixed

- **Range Mode Previous Month Selection**: Fixed issue where users could not select dates from previous months in range mode when starting with `{ start: null, end: null }`
  - Added memo cache invalidation before calendar generation when clicking dates from previous/next months in range mode
  - Fixed issue where clicking dates from previous months would navigate but memoized functions would use stale month/year values
  - Now properly invalidates memo cache in single, range, and multiple modes when navigating to different months via date clicks
  - Users can now select dates from previous months in range mode without issues, allowing proper range selection across month boundaries

### Changed

- **Version Update**: Updated to version 1.9.16
- **Angular 21 Support**: Updated dependencies and peer dependencies to support Angular 21 (officially released)
  - Updated devDependencies to Angular 21.0.0
  - Updated peer dependencies to support Angular 17-22 (`>=17.0.0 <24.0.0`)
  - Full compatibility with Angular 21 including Signal Forms support
  - **Signal Forms**: Full support for Angular 21 Signal Forms with `[field]` input binding (experimental feature)
  - **Zoneless by Default**: Compatible with Angular 21 applications that don't include Zone.js by default
  - **Vitest Compatible**: Works with Angular 21's new default Vitest test runner (library tests use Karma/Jasmine, but library is compatible with Vitest-based apps)
  - **Angular Aria Compatible**: Built-in ARIA support works alongside Angular Aria components (uses custom AriaLiveService for screen reader announcements)

### Migration Notes

- This is a patch version update with bug fixes and Angular 21 support
- No breaking changes from v1.9.15
- All fixes are backward compatible
- Compatible with Angular 17-22 (including officially released Angular 21)

## [1.9.15] - 2025-11-20

### Fixed

- **Moment Object Binding with ngModel**: Fixed issue where Moment.js objects passed via `[(ngModel)]` were not binding correctly with the datepicker
  - Updated `writeValue()` method to normalize Moment.js objects before passing to `initializeValue()`
  - Ensures Moment.js objects (including those with `utcOffset()` applied) are properly converted to Date objects when binding with template-driven forms
  - Now correctly handles `moment(response.Date).utcOffset(timezone)` when setting via ngModel
- **Date Clicks After Month Navigation**: Fixed issue where dates became unclickable after navigating backward or forward months
  - Updated `isDateDisabledMemo` getter to properly invalidate cached memoized function when month/year changes
  - Added month/year change detection to ensure disabled date cache is refreshed after navigation
  - Dates in previous/next months are now properly clickable without needing to close and reopen the datepicker
- **Range Mode Previous Month Selection**: Fixed issue where users could not select dates from previous months in range mode when starting with `{ start: null, end: null }`
  - Added memo cache invalidation before calendar generation when clicking dates from previous/next months in range mode
  - Fixed issue where clicking dates from previous months would navigate but memoized functions would use stale month/year values
  - Now properly invalidates memo cache in single, range, and multiple modes when navigating to different months via date clicks
  - Users can now select dates from previous months in range mode without issues, allowing proper range selection across month boundaries

### Changed

- **Version Update**: Updated to version 1.9.15

### Migration Notes

- This is a patch version update with bug fixes only
- No breaking changes from v1.9.14
- All fixes are backward compatible
- Compatible with Angular 17 and up versions

## [1.9.14] - 2025-11-20

### Fixed

- **Date Picker Selection Issue**: Fixed issue where date picker was not working properly when selecting dates, especially in range mode
  - Added proper change detection scheduling when setting start date in range mode
  - Added memo cache invalidation to ensure UI updates correctly reflect selected dates
  - Fixed UI not updating when only start date is selected in range mode
  - Dates now properly show as selected and calendar updates correctly in all selection modes
- **Moment.js Timezone Offset Preservation**: Fixed issue where Moment.js objects with timezone offsets (e.g., `moment().utcOffset('-0600')`) were not preserving the timezone offset when converted to Date objects
  - Added `momentToDate()` method that detects and preserves timezone offsets from Moment.js objects
  - Uses moment's `format('YYYY-MM-DDTHH:mm:ss.SSSZ')` to preserve offset information
  - Now correctly handles `moment().utcOffset('-0600')` without requiring `toDate()` which loses timezone information
  - Works for single dates, range values, and array of dates

### Changed

- **Version Update**: Updated to version 1.9.14

### Migration Notes

- This is a patch version update with bug fixes only
- No breaking changes from v1.9.13
- All fixes are backward compatible

## [1.9.13] - 2025-11-19

### Fixed

- **valueChange Event Bug**: Fixed issue where `(valueChange)` event was emitting `null` instead of the date value for range mode when using template-driven forms with `[(ngModel)]`
  - Changed `emitValue` method to use `_normalizeValue()` instead of `_normalizeDate()` to properly handle range objects `{ start: Date, end: Date }`
  - Now correctly emits date values for all modes (single, range, multiple)
- **Range Mode Date Selection**: Fixed issue where dates became disabled/unclickable after navigating to previous or next months in range mode
  - Updated `changeMonth()` method to properly update month/year signals when navigating
  - Fixed `onDateClick()` for all modes (single, range, multiple) to update signals when clicking dates in different months
  - Fixed `onYearClick()`, `onYearSelectChange()`, and `onDecadeClick()` to update signals
  - Ensures memoized `isDateDisabledMemo` function uses correct month/year values after navigation
  - Dates in previous/next months are now properly selectable without needing to close and reopen the datepicker
- **Moment.js Object Handling**: Fixed issue where Moment.js objects in range values and arrays were not being properly normalized
  - Enhanced `_normalizeValue()` method to explicitly detect and convert Moment.js objects in range objects (`{ start, end }`)
  - Enhanced array value normalization to properly handle Moment.js objects in multiple date selections
  - Ensures Moment.js objects are correctly converted to Date objects before emission in `valueChange` event

### Changed

- **Version Update**: Updated to version 1.9.13

### Migration Notes

- This is a patch version update with bug fixes only
- No breaking changes from v1.9.12
- All fixes are backward compatible

## [1.9.12] - 2025-11-19

### Added

- **SEO Optimization**: Comprehensive search engine optimization improvements
  - Enhanced meta tags with expanded keywords, geo-location, and Apple mobile web app tags
  - Complete Open Graph implementation for social media sharing (Facebook, LinkedIn)
  - Enhanced Twitter Card metadata with additional labels and image alt text
  - Multi-locale Open Graph support (en_US, es_ES, fr_FR, de_DE)
  - Structured data (Schema.org) with SoftwareApplication, WebPage, and HowTo schemas
  - robots.txt file with proper crawl directives and sitemap reference
  - sitemap.xml with all important pages, priorities, and change frequencies
  - SEO documentation guide (docs/SEO.md) with best practices and monitoring recommendations
- **Package Keywords Expansion**: Expanded npm package keywords from 14 to 38 keywords
  - Added keywords for features (signal-forms, SSR, zoneless, accessibility)
  - Added keywords for use cases (date-picker, time-picker, holiday-calendar)
  - Added keywords for qualities (lightweight, customizable, open-source, MIT)
  - Improved discoverability on npm and search engines
- **README SEO Enhancements**: Added downloads badge and expanded SEO keywords section
  - More comprehensive keyword coverage for better search visibility
  - Enhanced description with additional relevant terms

### Changed

- **Version Update**: Updated to version 1.9.12
- **Multi-Calendar Spacing**: Increased gap between multiple calendars from 16px to 32px for better visual separation
  - Applied to horizontal, vertical, and auto layouts
  - Improved spacing consistency across all multi-calendar configurations
- **Multi-Calendar Container Sizing**: Enhanced container width handling for multi-calendar layouts
  - Changed from fixed `width: 100%` to `width: fit-content` for better content fitting
  - Increased max-width from 1200px to 1400px to accommodate more calendars
  - Containers now properly expand to fit all calendars without overlapping
- **Demo App Select Inputs**: Enhanced styling for all select inputs in the demo application
  - Custom dropdown arrow icons with theme-aware colors
  - Improved hover and focus states with smooth transitions
  - Better visual consistency with the overall design system
  - Full dark theme support
- **Build Configuration**: Updated angular.json to include SEO files in build output
  - robots.txt and sitemap.xml now properly copied to build root
  - Files accessible at site root for search engine crawlers

### Removed

- **Demo App Sections**: Removed "2 Calendars Side-by-Side" and "3 Calendars Side-by-Side" demo sections
  - Cleaned up unused TypeScript variables (`multiCalendarRange2`, `multiCalendarSingle3`)

### Fixed

- **Multi-Calendar Overlapping**: Fixed issue where multiple calendars would overlap when displayed side-by-side
  - Added proper `box-sizing: border-box` to calendar months
  - Reduced container padding for multi-calendar layouts to provide more space
  - Ensured containers expand to fit content with proper gap spacing
- **Test Suite**: Fixed TypeScript compilation error in issue-33.spec.ts
  - Fixed undefined `dayNumbers` variable in test assertion
  - Added proper day number collection for debugging when test fails
  - Improved test error messages with actual day numbers found

### Migration Notes

- This is a minor version update with backward compatibility
- No breaking changes from v1.9.11
- SEO improvements are automatic and require no code changes
- See [MIGRATION.md](MIGRATION.md) for detailed migration guide
- See [docs/SEO.md](projects/ngxsmk-datepicker/docs/SEO.md) for SEO best practices

## [1.9.11] - 2025-11-17

### Fixed

- **Moment.js Integration with Custom Formats**: Fixed critical issue where Moment.js objects with custom date formats would not populate correctly
  - Added `isMomentObject()` helper method to safely detect Moment.js instances
  - Enhanced `_normalizeValue()` method to handle Moment.js objects directly by extracting native Date using `.toDate()`
  - Improved `parseCustomDateString()` method to use bracket notation for TypeScript compatibility with dynamic object properties
  - Added comprehensive support for format tokens: YYYY, YY, MM, M, DD, D, hh, h, HH, H, mm, m, ss, s, a, A
  - Resolves issue where `moment(this.date).utcOffset(timezone).format('MM/DD/YYYY hh:mm a')` with `displayFormat="MM/DD/YYYY hh:mm a"` would not populate correctly
  - Maintains full backward compatibility with Date objects, strings, and all other supported formats

### Improved

- **Custom Format Parser**: Enhanced format token parsing with better TypeScript compatibility
- **Moment.js Detection**: More robust detection of Moment.js objects across different versions
- **Demo Application**: Added working Moment.js integration example with interactive controls

## [1.9.10] - 2025-11-15

### Changed

- **Version Update**: Updated to version 1.9.10

### Fixed

- **Async Database Value Loading**: Enhanced datepicker to properly handle database values that load asynchronously after component initialization
  - Added fallback sync mechanism in `ngAfterViewInit` to catch async database loads
  - Added delayed sync checks in `ngOnInit`, `ngOnChanges`, and `ngAfterViewInit` to handle field value changes that occur after component initialization
  - Added sync on calendar open, focus events, and touch events to ensure values are populated
  - Extended interval sync duration to 30 seconds (from 10 seconds) with 100ms check intervals
  - Ensures datepicker properly displays database values even when they load after the component is rendered
- **TypeScript Compilation Error**: Fixed `EffectRef` type error when using Angular 17+ `effect()` API
  - Changed `_fieldEffectDestroy: (() => void) | null` to `_fieldEffectRef: EffectRef | null`
  - Updated effect cleanup to use `effectRef.destroy()` instead of function call
  - Added proper `EffectRef` import from `@angular/core`
- **Test Configuration**: Fixed test configuration for Angular 17+ compatibility
  - Updated karma configuration to work with `@angular/build:karma` builder
  - Simplified karma.conf.js to remove deprecated plugins
  - Updated test script to target correct project

### Improved

- **Async Value Handling**: Improved handling of field values that change asynchronously
- **Effect Management**: Proper effect lifecycle management with `EffectRef` for correct cleanup
- **Code Cleanup**: Removed unnecessary comments for cleaner codebase
- **Test Reliability**: Enhanced test configuration for better reliability across Angular versions

## [1.9.9] - 2025-11-15

### Changed

- **Version Update**: Updated to version 1.9.9

### Fixed

- **Database Value Population**: Fixed critical issue where datepicker would not populate with values from database when using `[field]` input binding
  - Added `_normalizeValue()` helper method to properly handle all value types (Date objects, strings, range objects, arrays)
  - Updated field effect and related methods to use `_normalizeValue()` instead of `_normalizeDate()` which only handled single dates
  - Fixed issue where string dates from database (common scenario) were not being parsed and displayed correctly
  - Now properly handles Date objects, string dates, range objects `{start: Date, end: Date}`, and arrays of dates

### Improved

- **Value Normalization**: Improved value normalization to handle all DatepickerValue types consistently
- **Database Integration**: Enhanced compatibility with database values in various formats (strings, Date objects, etc.)

## [1.9.8] - 2025-11-14

### Changed

- **Version Update**: Updated to version 1.9.8

### Fixed

- **Date Selection Reset Issue**: Fixed critical bug where selected dates would reset to today's date when using `[field]` input binding
  - Fixed `applyCurrentTime` to create a new Date object instead of mutating the original, preventing reference issues
  - Added `_isUpdatingFromInternal` flag to prevent field effect from resetting the value when updating internally
  - This ensures selected dates are properly stored in the form field instead of being reset to today

### Improved

- **Date Mutation Prevention**: Improved date handling to prevent unintended mutations of date objects
- **Field Update Stability**: Enhanced field binding stability to prevent value resets during internal updates

## [1.9.7] - 2025-11-14

### Changed

- **Version Update**: Updated to version 1.9.7

### Fixed

- **Calendar Population**: Fixed critical issue where datepicker calendar would not populate with dates when opened, especially when multiple datepickers were present in the same form
- **Calendar Generation**: Ensured `generateCalendar()` is called when opening the datepicker via click, touch, or programmatic methods

### Improved

- **Calendar Initialization**: Improved calendar initialization to ensure dates are always generated before the calendar becomes visible

## [1.9.6] - 2025-11-14

### Changed

- **Version Update**: Updated to version 1.9.6

### Fixed

- **Multiple Datepicker Management**: Fixed issue where multiple datepickers in the same form would open in the same centered location
- **Outside Click Detection**: Improved click detection to properly close datepicker when clicking outside the popover and input field
- **Auto-close Other Datepickers**: When opening a datepicker, all other open datepickers in the same form are now automatically closed
- **Mobile Datepicker Opening**: Fixed issue where datepicker modal would not open on mobile screens
- **Datepicker Closing on Mobile**: Fixed issue where datepicker would open and immediately disappear on mobile devices
- **Select Box Cursor**: Added pointer cursor to all select boxes (month, year, hour, minute, AM/PM) in the datepicker

### Improved

- **Document Click Handler**: Enhanced document click handler to check if clicks are inside the popover container, not just the input group
- **Touch Event Handling**: Improved touch event handling to prevent premature closing on mobile devices
- **Instance Management**: Added static instance registry to track all datepicker instances for better coordination

## [1.9.5] - 2025-11-14

### Changed

- **Version Update**: Updated to version 1.9.5

### Fixed

- **Angular 21+ Signal Forms Type Compatibility**: Fixed TypeScript compilation error with Angular 21+ Signal Forms
  - Fixed `Type '() => string' is not assignable to type 'never'` error when using `[field]` input
  - Updated `SignalFormField` type definition to be compatible with Angular 21's `FieldTree<Date, string>` types
  - Maintains backward compatibility with Angular 17-20 where field input is optional
  - Resolves [#33](https://github.com/NGXSMK/ngxsmk-datepicker/issues/33)

## [1.9.4] - 2025-11-14

### Changed

- **Version Update**: Updated to version 1.9.4

### Added

- **Custom Date Format**: New `[displayFormat]` input property to display dates in custom formats
  - Supports format strings like "MM/DD/YYYY hh:mm A"
  - Works with date adapters (date-fns, dayjs, luxon) or built-in simple formatter
  - Supports common format tokens: YYYY, MM, DD, hh, mm, A, etc.
  - Resolves [#31](https://github.com/NGXSMK/ngxsmk-datepicker/issues/31)

### Fixed

- **Time Selection Dropdowns**: Fixed visibility issues with time selection dropdowns
  - Dropdowns now properly display and are not clipped by parent containers
  - Improved z-index handling for time selection dropdowns
  - Removed unnecessary scrollbars from datepicker wrapper
  - Fixed overflow and positioning issues in time selection context
  - Resolves [#32](https://github.com/NGXSMK/ngxsmk-datepicker/issues/32)
- **Angular 21+ Signal Forms Type Compatibility**: Fixed TypeScript compilation error with Angular 21+ Signal Forms
  - Fixed `Type '() => string' is not assignable to type 'never'` error when using `[field]` input
  - Updated `SignalFormField` type definition to be compatible with Angular 21's `FieldTree<Date, string>` types
  - Maintains backward compatibility with Angular 17-20 where field input is optional
  - Resolves [#33](https://github.com/NGXSMK/ngxsmk-datepicker/issues/33)

## [1.9.3] - 2025-11-13

### Changed

- **Version Update**: Updated to version 1.9.3

### Added

- **Time-Only Picker**: New `[timeOnly]` input property to display only time selection without calendar
  - Hides calendar grid and shows only time controls (hour, minute, AM/PM)
  - Automatically enables `showTime` when `timeOnly` is true
  - Perfect for time selection scenarios where date is not needed
  - Value is still a Date object using today's date with selected time
  - Placeholder automatically changes to "Select Time" in time-only mode
  - Resolves [#29](https://github.com/NGXSMK/ngxsmk-datepicker/issues/29)
- **Modern Demo App UI**: Complete redesign of the demo application
  - Modern navbar with glassmorphism effects, search functionality, and improved theme toggle
  - Redesigned sidebar with gradient backgrounds, smooth animations, and visual indicators
  - Enhanced icon sizes and better visual hierarchy
  - Improved responsive design with better mobile experience
  - Automatic system theme detection (dark/light mode preference)
  - Gradient accents, shadows, and modern design patterns throughout

### Fixed

- **Test Suite**: Fixed 25+ failing tests across multiple test files
  - **Date Utils Tests**: Fixed `normalizeDate` comparison to use `.toEqual()` instead of `.toBe()` and corrected invalid date handling
  - **Calendar Utils Tests**: Updated `generateMonthOptions` to include required year parameter, fixed `generateTimeOptions` to match new return type (object with `hourOptions`/`minuteOptions`), fixed `generateDecadeGrid` expectations, updated `processDateRanges` to match new return type (object instead of array)
  - **Timezone Utils Tests**: Updated `formatDateWithTimezone` calls to match new signature (locale, options, timezone)
  - **Edge Cases Tests**: Fixed `update12HourState` to check component properties instead of return value, changed `previewEndDate` to `hoveredDate`, fixed date validation and normalization expectations, corrected `applyCurrentTime` to use `currentDisplayHour` and `isPm`, fixed touch event mocks, added change detection for calendar toggle, corrected `isDateDisabled` null handling
  - **Adapters Tests**: Fixed date normalization expectations to match actual behavior
  - **Performance Utils Tests**: Changed array comparison to use `.toEqual()` instead of `.toBe()` for cached results
  - **RTL Tests**: Fixed RTL detection from locale and document direction by properly setting document direction in tests
  - **Touch Gestures Tests**: Fixed swipe handling by creating proper array-like TouchList mock that supports both `item()` and `[0]` indexing
  - **Calendar Views Tests**: Fixed time slider tests to initialize dates and sliders correctly, fixed timeline generation test to call `generateTimeline()` directly
  - **Recurring Dates Utils Tests**: Fixed pattern matching test to use correct date (Jan 6 is Monday, not Jan 8)
- All 353 tests now pass successfully

## [1.9.2] - 2025-11-12

### Changed

- **Bundle Optimization**: Optimized bundle size with improved TypeScript compiler settings
  - Main bundle: ~127KB (source maps excluded from published package)
  - Enhanced tree-shaking with optimized imports and compiler options
  - Added `importsNotUsedAsValues: "remove"` for smaller output
  - Disabled `preserveConstEnums` for better inlining
- **Build Process**:
  - Source maps automatically removed from production builds (saves ~127KB)
  - Improved build scripts with better error handling
  - Enhanced bundle analysis that excludes source maps
- **Package Configuration**:
  - Fixed package.json exports to eliminate build warnings
  - Optimized `files` array to exclude unnecessary files
  - Updated exports field for better module resolution
- **Test Configuration**:
  - Added Zone.js polyfills to library test configuration
  - Updated test commands to explicitly target library project
  - Improved test reliability across Angular versions

### Fixed

- Test suite configuration - added missing Zone.js polyfills for library tests
- Bundle analysis now correctly excludes source maps from size calculations
- Build warnings from conflicting export conditions resolved
- Source map removal script made more resilient for build environments

## [1.9.1] - 2025-11-11

### Fixed

- Minor bug fixes and improvements

## [1.9.0] - 2025-11-10

### Added

- Extension Points & Hooks system for customization
- Enhanced keyboard shortcuts (Y, N, W keys)
- Modern UI/UX with improved animations and responsiveness
- API documentation with TypeDoc
- Semantic release automation
- Animation performance optimizations with GPU acceleration
- Global search functionality in documentation
- Mobile playground for responsive testing

### Changed

- Optimized animations using `transform3d` for hardware acceleration
- Reduced animation durations from 0.2s to 0.15s
- Improved transition performance with specific property targeting
- Updated documentation structure
- Enhanced mobile responsiveness

### Fixed

- Animation performance issues
- Mobile responsive layout
- Sidebar scrollbar styling
- TypeScript warnings

## [1.8.0] - 2025-11-09

### Added

- Signal Forms support with `[field]` input for Angular 21+
- SSR compatibility with platform checks
- Zoneless support (works without Zone.js)
- Immediate value initialization when `[value]` is set programmatically
- Comprehensive documentation for Signals, Signal Forms, and SSR
- GitHub Pages deployment automation

### Changed

- Updated peer dependencies to support Angular 17-22 (`>=17.0.0 <24.0.0`)
- Added `@angular/forms` as peer dependency
- Made `zone.js` optional peer dependency
- Enhanced `exports` field in package.json with proper types
- Optimized imports for better tree-shaking

### Fixed

- Issue #13: Programmatic value setting now works correctly
- SSR compatibility: All browser APIs properly guarded
- Value input setter now initializes immediately

## [1.7.0] - Previous Release

_Previous changelog entries..._

---

## Types of Changes

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes
