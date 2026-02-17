# 🗺️ Roadmap

This roadmap outlines the planned features, improvements, and enhancements for ngxsmk-datepicker. We welcome community input and contributions!

**Last updated:** February 2026 · **Current stable:** v2.1.6

## 🎯 Current Focus (Q1 2026 - Q2 2026)

### High Priority

- [x] **Accessibility Improvements** ✅ (v1.9.21)
  - Enhanced screen reader support
  - ARIA live regions for dynamic updates
  - Focus trap management in popover mode
  - High contrast mode support
  - *Completed in v1.9.21*

- [x] **Performance Optimizations** ✅ (v1.9.21)
  - Virtual scrolling infrastructure for large date ranges
  - Lazy loading of calendar months with intelligent caching
  - Memoization improvements for date calculations
  - *Completed in v1.9.21 - Infrastructure ready, full implementation in progress*

- [ ] **Enhanced Localization**
  - More locale-specific date formats
  - Custom date format patterns
  - Locale-aware number formatting
  - *Label: `enhancement`, `i18n`, `good-first-issue`*

### Medium Priority

- [x] **Advanced Date Selection** ✅ (v1.9.21)
  - Week selection mode
  - Month selection mode
  - Quarter selection mode
  - Year selection mode
  - *Completed in v1.9.21*

- [x] **Custom Date Formatting** ✅ (Implemented in v1.9.4)
  - Custom format strings (similar to Angular DatePipe) - `[displayFormat]` input
  - Format validation
  - Format presets
  - *Available in v1.9.4+*

- [ ] **Animation Customization**
  - Configurable animation durations
  - Custom animation presets
  - Reduced motion support
  - *Label: `enhancement`, `accessibility`*

- [ ] **Enhanced Time Selection**
  - Seconds selection
  - Timezone-aware time display (✅ Timezone utilities available via `timezone.utils`)
  - Time range selection
  - *Label: `enhancement`, `feature-request`*

## 🔮 Future Considerations

### Features Under Discussion

- [x] **Multi-Calendar Support** ✅ (Implemented in v1.9.12)
  - Display multiple months side-by-side - Available via `[calendarCount]` input
  - Configurable calendar count - Set `calendarCount` from 1 to 12
  - *Available via: `<ngxsmk-datepicker [calendarCount]="2">`*

- [x] **Date Presets** ✅ (Implemented in v1.9.12)
  - User-defined date presets - Available via `DatePresetsService.savePreset()`
  - Preset management API - Full CRUD operations via `DatePresetsService`
  - Preset categories - Supported via `category` property
  - *Available via: `import { DatePresetsService } from 'ngxsmk-datepicker'`*

- [x] **Export/Import Functionality** ✅ (Implemented)
  - Export selected dates to various formats (JSON, CSV, ICS) - Available via `exportToJson`, `exportToCsv`, `exportToIcs`
  - Import dates from external sources - Available via `importFromJson`, `importFromCsv`, `importFromIcs`
  - *Available in utils exports: `import { exportToJson, importFromJson } from 'ngxsmk-datepicker/utils'`*

- [x] **Advanced Styling** ✅ (Implemented in v1.9.12)
  - CSS-in-JS support - Available via `ThemeBuilderService.generateStyleObject()`
  - Theme builder tool - Available via `ThemeBuilderService.applyTheme()`
  - Component variants - Supported via theme customization
  - *Available via: `import { ThemeBuilderService, DatepickerTheme } from 'ngxsmk-datepicker'`*

- [x] **Integration Examples** ✅ (Implemented in v1.9.12)
  - Angular Material integration guide - Available in `docs/INTEGRATION.md`
  - Ionic integration guide - Available in `docs/INTEGRATION.md`
  - Tailwind CSS integration guide - Available in `docs/INTEGRATION.md`
  - *See: `projects/ngxsmk-datepicker/docs/INTEGRATION.md`*

## 🐛 Known Issues & Improvements

### Code Architecture & Refactoring (Critical Priority)

- [ ] **Extract Calendar Generation Logic to Service**
  - Move `generateCalendar()`, `generateYearGrid()`, `generateDecadeGrid()`, `generateTimeline()` to `CalendarGenerationService`
  - Reduce main component from 5,090 lines
  - *Label: `refactoring`, `performance`, `maintainability`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#11-extract-calendar-generation-logic-to-service)*

- [ ] **Extract Input Parsing and Formatting Logic**
  - Create `InputParsingService` for date parsing and formatting
  - Improve testability and code organization
  - *Label: `refactoring`, `maintainability`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#12-extract-input-parsing-and-formatting-logic)*

### Performance Optimizations (High Priority)

- [ ] **Implement Virtual Scrolling for Year/Decade Views**
  - Complete virtual scrolling implementation (infrastructure exists)
  - Improve performance with large year ranges (100+ years)
  - *Label: `performance`, `enhancement`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#21-implement-virtual-scrolling-for-yeardecade-views)*

- [ ] **Optimize Change Detection Calls**
  - Audit and optimize 29 `markForCheck()` calls
  - Batch state changes for better performance
  - *Label: `performance`, `optimization`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#22-optimize-change-detection-calls)*

- [ ] **Memoize Expensive Computations**
  - Use computed signals for `monthOptions`, `yearOptions`, `displayValue`
  - Reduce unnecessary recalculations
  - *Label: `performance`, `optimization`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#23-memoize-expensive-computations)*

### Type Safety & Error Handling (High Priority)

- [ ] **Eliminate `any` Type Usage**
  - Remove 8 instances of `any` type
  - Improve type safety and IDE support
  - *Label: `type-safety`, `good-first-issue`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#31-eliminate-any-type-usage)*

- [ ] **Add Error Boundaries for Date Parsing**
  - Add comprehensive error handling for date parsing
  - Improve error recovery
  - *Label: `error-handling`, `good-first-issue`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#32-add-error-boundaries-for-date-parsing)*

### Accessibility Enhancements (High Priority)

- [ ] **Add Loading State Announcements**
  - ARIA announcements when calendar is loading/generating
  - Improve screen reader experience
  - *Label: `accessibility`, `good-first-issue`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#41-add-loading-state-announcements)*

- [ ] **Improve Keyboard Navigation for Year/Decade Grids**
  - Enhanced arrow key navigation for grid views
  - Home/End support for grid rows
  - *Label: `accessibility`, `enhancement`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#42-improve-keyboard-navigation-for-yeardecade-grids)*

### Testing Coverage (High Priority)

- [ ] **Add Performance Benchmarks**
  - Create performance test suite
  - Measure and track performance regressions
  - *Label: `testing`, `performance`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#51-add-performance-benchmarks)*

- [ ] **Add Accessibility Testing**
  - Automated accessibility testing with axe-core
  - Catch accessibility regressions automatically
  - *Label: `testing`, `accessibility`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#53-add-accessibility-testing)*

### Documentation Improvements

- [ ] **Add JSDoc for All Public Methods**
  - Complete JSDoc comments for all public APIs
  - Improve IDE autocomplete and developer experience
  - *Label: `documentation`, `good-first-issue`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#61-add-jsdoc-for-all-public-methods)*

- [ ] **Add Migration Guide for Breaking Changes**
  - Comprehensive migration guide for version upgrades
  - Code examples for common scenarios
  - *Label: `documentation`, `good-first-issue`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#62-add-migration-guide-for-breaking-changes)*

- [ ] **Add More Usage Examples**
  - Examples for all selection modes
  - Hooks and plugins examples
  - Customization examples
  - *Label: `documentation`, `good-first-issue`*

- [ ] **Document Performance Best Practices**
  - Performance optimization guide
  - When to use virtual scrolling
  - Caching strategies
  - *Label: `documentation`, `performance`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#64-document-performance-best-practices)*

- [ ] **Create video tutorials**
  - *Label: `documentation`, `help-wanted`*

### Security & Input Sanitization (High Priority)

- [ ] **Enhance Input Sanitization**
  - Use Angular's DomSanitizer for robust sanitization
  - Enhanced regex patterns for XSS prevention
  - *Label: `security`, `enhancement`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#71-enhance-input-sanitization)*

- [ ] **Add CSP Compliance Verification**
  - Test with strict CSP headers
  - Document CSP requirements
  - *Label: `security`, `compliance`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#72-add-csp-compliance-verification)*

### User Experience (High Priority)

- [ ] **Add Loading Indicators**
  - Visual feedback when calendar is generating
  - Loading state with ARIA announcements
  - *Label: `ux`, `accessibility`, `good-first-issue`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#81-add-loading-indicators)*

- [ ] **Improve Error Messages**
  - User-friendly error messages in UI
  - Actionable error messages with translations
  - *Label: `ux`, `enhancement`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#82-improve-error-messages)*

### API Design (High Priority)

- [ ] **Document Deprecation Strategy**
  - Establish deprecation policy (e.g., 2 major versions)
  - Add `@deprecated` JSDoc tags
  - Provide migration paths
  - *Label: `api-design`, `documentation`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#91-document-deprecation-strategy)*

- [ ] **Add API Stability Guarantees**
  - Document which APIs are stable
  - Mark experimental features clearly
  - *Label: `api-design`, `documentation`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#92-add-api-stability-guarantees)*

### Bug Fixes Needed

- [ ] Investigate and fix any reported accessibility issues
  - *Label: `bug`, `accessibility`*

- [ ] Performance improvements for large date ranges
  - *Label: `bug`, `performance`*

### Code Architecture & Refactoring (Medium Priority)

- [ ] **Extract Touch Gesture Logic**
  - Move all touch gesture methods to `TouchGestureHandlerService`
  - Improve code organization and consistency
  - *Label: `refactoring`, `maintainability`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#13-extract-touch-gesture-logic)*

- [ ] **Extract Popover Positioning Logic**
  - Create `PopoverPositioningService` for positioning logic
  - Improve testability and reusability
  - *Label: `refactoring`, `maintainability`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#14-extract-popover-positioning-logic)*

- [ ] **Reduce Method Complexity**
  - Break down complex methods (>50 lines) into smaller functions
  - Reduce cyclomatic complexity
  - *Label: `refactoring`, `maintainability`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#16-reduce-method-complexity)*

### Performance Optimizations (Medium Priority)

- [ ] **Lazy Load Calendar Months**
  - Implement aggressive lazy loading for non-visible months
  - Preload only adjacent months
  - *Label: `performance`, `optimization`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#24-lazy-load-calendar-months)*

### Type Safety & Error Handling (Medium Priority)

- [ ] **Add Input Validation Error Callbacks**
  - Emit validation errors via `@Output() validationError`
  - Allow programmatic error handling
  - *Label: `error-handling`, `enhancement`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#33-add-input-validation-error-callbacks)*

- [ ] **Add Null Safety Checks**
  - Add null checks for all optional properties
  - Use optional chaining where appropriate
  - *Label: `type-safety`, `good-first-issue`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#34-add-null-safety-checks)*

### Accessibility Enhancements (Medium Priority)

- [ ] **Add ARIA Descriptions for Complex Features**
  - Add `aria-describedby` for complex controls
  - Provide detailed descriptions in ARIA live regions
  - *Label: `accessibility`, `good-first-issue`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#43-add-aria-descriptions-for-complex-features)*

- [ ] **Improve Focus Management in Multi-Calendar Mode**
  - Ensure logical focus movement between calendars
  - Add visual focus indicators
  - *Label: `accessibility`, `enhancement`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#44-improve-focus-management-in-multi-calendar-mode)*

### Testing Coverage (Medium Priority)

- [ ] **Add Tests for Error Recovery**
  - Test all error scenarios
  - Verify error recovery mechanisms
  - *Label: `testing`, `good-first-issue`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#54-add-tests-for-error-recovery)*

### Security & Input Sanitization (Medium Priority)

- [ ] **Add Input Validation for All User Inputs**
  - Validate all user inputs with whitelist approach
  - Reject suspicious patterns
  - *Label: `security`, `good-first-issue`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#73-add-input-validation-for-all-user-inputs)*

### User Experience (Medium Priority)

- [ ] **Add Animation Performance Monitoring**
  - Detect frame drops
  - Log performance warnings in dev mode
  - *Label: `ux`, `performance`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#83-add-animation-performance-monitoring)*

- [ ] **Improve Mobile Touch Feedback**
  - Improve haptic feedback timing
  - Add visual touch feedback
  - *Label: `ux`, `mobile`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#84-improve-mobile-touch-feedback)*

### API Design (Medium Priority)

- [ ] **Review Public API Surface**
  - Audit all public methods
  - Make internal methods private
  - *Label: `api-design`, `refactoring`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#93-review-public-api-surface)*

### Build & Distribution (Medium Priority)

- [ ] **Optimize Bundle Size**
  - Analyze bundle with webpack-bundle-analyzer
  - Identify large dependencies
  - Consider code splitting for optional features
  - *Label: `performance`, `build`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#101-optimize-bundle-size)*

### Code Architecture & Refactoring (Low Priority)

- [ ] **Consolidate Date Utility Methods**
  - Audit all date operations in component
  - Replace with `date.utils.ts` functions where possible
  - *Label: `refactoring`, `good-first-issue`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#15-consolidate-date-utility-methods)*

### Performance Optimizations (Low Priority)

- [ ] **Optimize Template Bindings**
  - Review all template bindings
  - Use memoized functions for complex expressions
  - *Label: `performance`, `optimization`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#25-optimize-template-bindings)*

### Build & Distribution (Low Priority)

- [ ] **Improve Tree Shaking**
  - Ensure all exports are tree-shakeable
  - Test tree-shaking with minimal imports
  - *Label: `performance`, `build`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#102-improve-tree-shaking)*

- [ ] **Add Source Map Optimization**
  - Use separate source map files
  - Optimize source map generation
  - *Label: `build`, `optimization`*
  - *See: [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md#103-add-source-map-optimization)*

### Additional Improvements

For a complete list of all 47 identified improvements with detailed code examples, effort estimates, and recommendations, see the [Comprehensive Improvement Report](IMPROVEMENT_REPORT.md).

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Good First Issues

Issues labeled with `good-first-issue` are perfect for new contributors:
- Documentation improvements
- Small bug fixes
- Test additions
- Example code additions

### Help Wanted

Issues labeled with `help-wanted` need community assistance:
- Feature implementations
- Performance optimizations
- Integration examples
- Documentation enhancements

### How to Contribute

1. Check the [Contributing Guide](CONTRIBUTING.md)
2. Look for issues labeled `good-first-issue` or `help-wanted`
3. Comment on the issue to let us know you're working on it
4. Submit a pull request following our guidelines

## 📅 Timeline

### Q1 2026 (Current Focus)
- **Critical Priority Items:**
  - Extract Calendar Generation Logic to Service
  - Extract Input Parsing and Formatting Logic
- **High Priority Items:**
  - Implement Virtual Scrolling for Year/Decade Views
  - Optimize Change Detection Calls
  - Eliminate `any` Type Usage
  - Add Loading Indicators
  - Add Performance Benchmarks

### Q2 2026
- **High Priority Items (continued):**
  - Complete remaining high priority improvements
  - Enhanced localization
  - Security enhancements
- **Medium Priority Items:**
  - Code architecture refactoring
  - Additional testing coverage
  - Documentation improvements

### Q3 2026
- **Medium & Low Priority Items:**
  - Complete remaining improvements
  - Performance optimizations
  - UX enhancements
  - Build optimizations

*Note: Timeline is subject to change based on community feedback and priorities. See [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md) for detailed effort estimates.*

## 💡 Suggest a Feature

Have an idea that's not on the roadmap? We'd love to hear it!

1. Check if it's already been requested in [issues](https://github.com/NGXSMK/ngxsmk-datepicker/issues)
2. If not, create a [feature request](https://github.com/NGXSMK/ngxsmk-datepicker/issues/new?template=feature_request.yml)
3. Engage with the community in [discussions](https://github.com/NGXSMK/ngxsmk-datepicker/discussions)

## 🏷️ Label Guide

We use labels to help organize issues:

- `good-first-issue` - Great for new contributors
- `help-wanted` - Community assistance needed
- `bug` - Something isn't working
- `enhancement` - New feature or improvement
- `documentation` - Documentation improvements
- `performance` - Performance-related
- `accessibility` - A11y improvements
- `i18n` - Internationalization
- `styling` - CSS/styling related
- `refactoring` - Code refactoring and restructuring
- `type-safety` - TypeScript type safety improvements
- `error-handling` - Error handling and recovery
- `testing` - Testing-related improvements
- `security` - Security enhancements
- `ux` - User experience improvements
- `api-design` - API design and stability
- `maintainability` - Code maintainability improvements
- `optimization` - Performance optimizations
- `compliance` - Compliance and standards
- `mobile` - Mobile-specific improvements
- `build` - Build and distribution improvements
- `needs-triage` - Needs review/prioritization

---

## 📊 Improvement Analysis Summary

A comprehensive analysis of the codebase (v2.0.0) has identified **47 concrete improvements** across 10 categories.

### Priority Breakdown

- **Critical Priority:** 2 items (Component refactoring - must fix before next major release)
- **High Priority:** 11 items (Performance, type safety, accessibility, testing - should fix soon)
- **Medium Priority:** 13 items (Code quality, additional features - nice to have)
- **Low Priority:** 21 items (Future enhancements - incremental improvements)

### Categories Covered

1. **Code Architecture & Maintainability** (6 improvements)
   - Component size reduction (5,090 lines → target: <3,000 lines)
   - Service extraction opportunities
   - Code duplication elimination

2. **Performance Optimizations** (5 improvements)
   - Virtual scrolling implementation
   - Change detection optimization
   - Memoization improvements

3. **Type Safety & Error Handling** (4 improvements)
   - Eliminate `any` types (8 instances)
   - Error boundaries
   - Input validation callbacks

4. **Accessibility Enhancements** (4 improvements)
   - Loading state announcements
   - Keyboard navigation improvements
   - ARIA descriptions

5. **Testing Coverage** (3 improvements)
   - Performance benchmarks
   - Automated accessibility testing
   - Error recovery tests

6. **Documentation & Developer Experience** (4 improvements)
   - Complete JSDoc for public APIs
   - Migration guides
   - Usage examples

7. **Security & Input Sanitization** (3 improvements)
   - Enhanced input sanitization
   - CSP compliance
   - Input validation

8. **User Experience** (4 improvements)
   - Loading indicators
   - Error messages
   - Animation performance

9. **API Design & Breaking Changes** (3 improvements)
   - Deprecation strategy
   - API stability guarantees
   - Public API review

10. **Build & Distribution** (3 improvements)
    - Bundle size optimization
    - Tree shaking improvements
    - Source map optimization

### Estimated Effort

- **Critical:** 3-5 days
- **High Priority:** 12-18 days
- **Medium Priority:** 15-22 days
- **Low Priority:** 8-12 days

**Total:** 38-57 days (approximately 2-3 months of focused development)

### Quick Links

- **Full Report:** [IMPROVEMENT_REPORT.md](IMPROVEMENT_REPORT.md) - Complete analysis with code examples, effort estimates, and recommendations
- **Component Analysis:** Main component is 5,090 lines with 147 methods
- **Key Metrics:**
  - 8 instances of `any` type usage
  - 29 `markForCheck()` calls (optimization opportunity)
  - 18 try-catch blocks (error handling coverage)
  - 15 test files (good coverage, but gaps identified)

---

**Last Updated**: February 17, 2026

*This roadmap is a living document and will be updated regularly based on community feedback and project needs.*

