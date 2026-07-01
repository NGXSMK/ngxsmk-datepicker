# ngxsmk-datepicker — v3 Roadmap

v3 is a **breaking** modernization release. It is delivered in **stages**, each landing on `main`
with the full test suite green (currently **1256 tests**) and the production build passing.
Non-breaking modernizations ship in `2.x`; anything that changes the public API waits for `3.0.0`.

> Guiding rule: never regress the published package. Every stage is independently shippable,
> incremental, and verified with `ng build ngxsmk-datepicker --configuration production` +
> `ng test ngxsmk-datepicker --watch=false --browsers=ChromeHeadless`.

---

## Stage 0 — Non-breaking groundwork (ships in 2.x) — ✅ in progress
- [x] Fix TS 6.0 build blockers (`baseUrl`, `importsNotUsedAsValues`).
- [x] Convert internal transient state to signals (`isOpeningCalendar`, `naturalLanguagePreview`,
      `showNaturalLanguagePreview`, `validationErrorMessage`, `typedInputValue`).
- [x] Make the `displayValue` getter pure (remove render-time state writes).
- [x] Migrate `@Output()` → `output()` (non-breaking; consumers keep `(event)="…"`).
- [ ] Migrate remaining internal `cdr.markForCheck()` reliance to signals (path to zoneless-by-default).

## Stage 1 — Signal inputs & `model()` (3.0.0, breaking)
The component has **78 `@Input()`s** and a `ControlValueAccessor` with a custom `value` setter.
Migrate in three buckets:
1. **Read-only inputs → `input()`** — API-compatible for consumers (`[x]="…"` unchanged); internal
   reads become `this.x()`. *Effort:* mechanical but touches the large inline template — do in
   reviewable batches. The compiler (`strictTemplates`) flags every ref that needs `()`.
   - ✅ **Batch 1 done & verified** (1256 tests green, demo-app builds): `dateTemplate`,
     `naturalLanguagePreviewTemplate`, `classes`, `syncScroll`. Spec assignments migrated to
     `fixture.componentRef.setInput(...)`; reads to `x()`.
   - ✅ **Batch 2 done & verified** (15/78 inputs now signals): `showRanges`, `showTimezoneSelector`,
     `timeRangeMode`, `appendToBody`, `autoApplyClose`, `allowSameDay`, `enableHapticFeedback`,
     `enablePullToRefresh`, `mobileTheme`, `disableFocusTrap`, `comparisonRange`.
   - ⚠️⚠️ **Hazard (found the hard way):** the compiler does **NOT** flag `!this.x` or truthy uses
     (`this.x || …`) when `x` becomes a signal — `!fn`/`fn` are valid but always `false`/`true`.
     These are silent logic bugs. **After each batch, grep every `this.<input>\b` not followed by `(`**
     and fix, in addition to the compiler-flagged assignment/binding errors. (Caught 3 this way.)
   - ⚠️ **Gotcha:** inputs referenced in `ngOnChanges` (`changes['x']`) can't convert cleanly —
     signal inputs don't fire `ngOnChanges`. Those (`mode`, `align`, `theme`, `locale`, `minDate`,
     `maxDate`, `showTime`, `calendarLayout`, …) need their reaction moved to an `effect()` first.
     Do this as a coordinated `ngOnChanges → effects` refactor, not piecemeal.
   - Remaining read-only, non-`ngOnChanges` inputs are safe to batch next the same way.
2. **Two-way value → `model<DatepickerValue>()`** so `[(value)]` keeps working. Requires
   refactoring the `value` custom setter (`normalize → initialize → generateCalendar`) into an
   `effect()`/explicit reaction, and reconciling with CVA `writeValue`. **This is the hard part.**
3. **Internally-mutated state** (`startDate`, `endDate`, `selectedDate`, `currentDate`) → `signal()`
   (not `input()`, which is readonly). Expose read-only computed views where needed.

## Stage 2 — Component decomposition (3.0.0)
Break up the ~6.4k-line orchestrator (already delegates to ~15 services). Extract, one cohesive
cluster at a time, keeping tests green: `DatepickerOverlayService` (open/close/position/focus-trap/
scroll-lock — the most self-contained), then typed-input, then time-picker state.

## Stage 3 — CSS reconciliation (3.0.0)
The abandoned half-built SCSS architecture (`datepicker.scss` + `styles/{components,core,abstracts}/`
+ `_legacy-datepicker.scss`, ~7k lines total) has been **deleted** — it was unreferenced, 3 months
stale, and diverged from the maintained flat `styles/datepicker.css`. If build-time theming is
desired later, generate a fresh SCSS **from** the current `datepicker.css` (source of truth) with
visual-regression coverage — do not resurrect the old tree.

## Stage 4 — Cleanup & DX (3.0.0)
- Remove deprecated inputs/aliases; publish a `MIGRATION.md` v2→v3 section + an `ng update` schematic.
- Offer zoneless-by-default guidance; keep the `NgModule` compat shim (still needed for NG1010).
- Consider secondary entry points once the core no longer imports optional features.

---

## Sequencing & risk
Ship Stage 1.1 (read-only `input()`) and Stage 2 (`DatepickerOverlayService`) first — highest value,
most self-contained. Defer Stage 1.2 (`model()` + CVA) until covered by added tests (typing/time
paths are only ~57% branch-covered today). Publish `3.0.0-beta` tags per stage before `latest`.
