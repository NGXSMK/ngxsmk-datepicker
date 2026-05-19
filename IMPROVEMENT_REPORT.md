# Comprehensive Improvement Report

**Last updated:** May 19, 2026 - **Current stable:** v2.2.14

This document is the **maintained index** for architectural and quality initiatives referenced from [ROADMAP.md](ROADMAP.md). Each section maps to anchor links used across the repository. Effort levels: **S** small, **M** medium, **L** large.

---

<h2 id="2-performance-optimizations">2. Performance optimizations</h2>

Year/decade virtual scrolling, CD batching, and memoization of expensive getters (see sections [2.1](#21-implement-virtual-scrolling-for-yeardecade-views)–[2.5](#25-optimize-template-bindings)).

---

<h3 id="11-extract-calendar-generation-logic-to-service">1.1 Extract calendar generation logic to service</h3>

Consolidate `generateCalendar`, year/decade/timeline generation orchestration inside `CalendarGenerationService`; thin `NgxsmkDatepickerComponent`. **Effort: L**

<h3 id="12-extract-input-parsing-and-formatting-logic">1.2 Extract input parsing and formatting logic</h3>

Dedicated `InputParsingService` (or extend `DatepickerParsingService`) for typed input, display format, and CVA normalization. **Effort: M**

<h3 id="13-extract-touch-gesture-logic">1.3 Extract touch gesture logic</h3>

Isolate swipe/touch state from the main component into `TouchGestureHandlerService` surface tests. **Effort: M**

<h3 id="14-extract-popover-positioning-logic">1.4 Extract popover positioning logic</h3>

Further narrow `PopoverPositioningService` responsibilities vs. inline/append-to-body branching. **Effort: M**

<h3 id="15-consolidate-date-utility-methods">1.5 Consolidate date utility methods</h3>

Deduplicate helpers between `utils/date.utils.ts` and component private methods. **Effort: S**

<h3 id="16-reduce-method-complexity">1.6 Reduce method complexity</h3>

Sonar/cognitive complexity reduction on hot paths (keyboard, open/close). **Effort: M**

<h3 id="21-implement-virtual-scrolling-for-yeardecade-views">2.1 Implement virtual scrolling for year/decade views</h3>

Finish virtual scroll for large year grids using existing infrastructure. **Effort: M**

<h3 id="22-optimize-change-detection-calls">2.2 Optimize change detection calls</h3>

Audit `markForCheck` / `scheduleChangeDetection`; batch related input changes. **Effort: M**

<h3 id="23-memoize-expensive-computations">2.3 Memoize expensive computations</h3>

Prefer `computed()` for month/year options and derived display strings where safe. **Effort: S**

<h3 id="24-lazy-load-calendar-months">2.4 Lazy load calendar months</h3>

Align IntersectionObserver indices when `calendarCount` changes; revision signal pattern (see library implementation). **Effort: S**

<h3 id="25-optimize-template-bindings">2.5 Optimize template bindings</h3>

Reduce redundant method calls in templates via pipes or memoized signals. **Effort: M**

<h3 id="31-eliminate-any-type-usage">3.1 Eliminate `any` type usage</h3>

Replace remaining `any` in public/test surfaces with precise types. **Effort: S**

<h3 id="32-add-error-boundaries-for-date-parsing">3.2 Add error boundaries for date parsing</h3>

Graceful degradation when parsing fails; surface via `validationErrorMessage`. **Effort: M**

<h3 id="33-add-input-validation-error-callbacks">3.3 Add input validation error callbacks</h3>

Optional hook for host apps when typed input is invalid. **Effort: S**

<h3 id="34-add-null-safety-checks">3.4 Add null safety checks</h3>

Harden edge cases for null dates in range/multiple modes. **Effort: S**

<h3 id="41-add-loading-state-announcements">4.1 Add loading state announcements</h3>

ARIA live during calendar generation / async paths. **Effort: S**

<h3 id="42-improve-keyboard-navigation-for-yeardecade-grids">4.2 Improve keyboard navigation for year/decade grids</h3>

Home/End, grid wrap, roving tabindex patterns. **Effort: M**

<h3 id="43-add-aria-descriptions-for-complex-features">4.3 Add ARIA descriptions for complex features</h3>

Describe multi-calendar and range presets for assistive tech. **Effort: S**

<h3 id="44-improve-focus-management-in-multi-calendar-mode">4.4 Improve focus management in multi-calendar mode</h3>

Focus order when navigating months and on open/close. **Effort: M**

<h3 id="51-add-performance-benchmarks">5.1 Add performance benchmarks</h3>

Micro-benchmarks or CI budget checks for calendar generation. **Effort: M**

<h3 id="53-add-accessibility-testing">5.3 Add accessibility testing</h3>

Automated axe checks in CI for demo-app critical routes. **Effort: M**

<h3 id="54-add-tests-for-error-recovery">5.4 Add tests for error recovery</h3>

Unit tests for invalid input and recovery flows. **Effort: S**

<h3 id="61-add-jsdoc-for-all-public-methods">6.1 Add JSDoc for all public methods</h3>

Complete API docs for exported symbols. **Effort: M**

<h3 id="62-add-migration-guide-for-breaking-changes">6.2 Add migration guide for breaking changes</h3>

Cross-link [MIGRATION.md](MIGRATION.md) from releases. **Effort: S**

<h3 id="64-document-performance-best-practices">6.4 Document performance best practices</h3>

Author guide: disabled dates cardinality, `calendarCount`, zoneless. **Effort: S**

<h3 id="71-enhance-input-sanitization">7.1 Enhance input sanitization</h3>

Sanitize template/custom cell outputs where user HTML could appear. **Effort: M**

<h3 id="72-add-csp-compliance-verification">7.2 Add CSP compliance verification</h3>

Document strict CSP requirements for styles/fonts. **Effort: S**

<h3 id="73-add-input-validation-for-all-user-inputs">7.3 Add input validation for all user inputs</h3>

Clamp numeric inputs consistently (`calendarCount`, intervals). **Effort: S**

<h3 id="81-add-loading-indicators">8.1 Add loading indicators</h3>

Optional spinner hook while calendar loads (already partially present). **Effort: S**

<h3 id="82-improve-error-messages">8.2 Improve error messages</h3>

Translation keys for validation failures. **Effort: S**

<h3 id="83-add-animation-performance-monitoring">8.3 Add animation performance monitoring</h3>

Optional dev-mode metrics for open/close animations. **Effort: S**

<h3 id="84-improve-mobile-touch-feedback">8.4 Improve mobile touch feedback</h3>

Haptics integration polish where enabled. **Effort: S**

<h3 id="91-document-deprecation-strategy">9.1 Document deprecation strategy</h3>

Publish policy in README / CONTRIBUTING. **Effort: S**

<h3 id="92-add-api-stability-guarantees">9.2 Add API stability guarantees</h3>

Label experimental inputs (`Signal Forms`, etc.) in typedoc. **Effort: S**

<h3 id="93-review-public-api-surface">9.3 Review public API surface</h3>

Trim accidental exports from barrel `public-api.ts`. **Effort: M**

<h3 id="101-optimize-bundle-size">10.1 Optimize bundle size</h3>

Secondary entry points or lazy chunks for rarely used views if metrics justify. **Effort: L**

<h3 id="102-improve-tree-shaking">10.2 Improve tree-shaking</h3>

Ensure side-effect-free exports; verify `package.json` sideEffects. **Effort: S**

<h3 id="103-add-source-map-optimization">10.3 Add source map optimization</h3>

Production source maps policy for the library package. **Effort: S**

---

For narrative roadmap priorities and timelines, see [ROADMAP.md](ROADMAP.md). For refactor sequencing, see [projects/ngxsmk-datepicker/docs/REFACTOR_PLAN.md](projects/ngxsmk-datepicker/docs/REFACTOR_PLAN.md). For upcoming **localization and time** APIs, see [projects/ngxsmk-datepicker/docs/FEATURE_SCOPING.md](projects/ngxsmk-datepicker/docs/FEATURE_SCOPING.md).
