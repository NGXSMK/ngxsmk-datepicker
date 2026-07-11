# Refactor plan: thin `NgxsmkDatepickerComponent`

**Last updated:** July 11, 2026

This plan operationalizes [IMPROVEMENT_REPORT.md](../../IMPROVEMENT_REPORT.md) items **1.1**–**1.6** without blocking feature work. Phases are incremental and test-backed.

## Goals

- Move orchestration of calendar **generation** and **month arrays** behind `CalendarGenerationService` (already exists—expand responsibilities).
- Move **input ↔ model** normalization boundaries closer to `DatepickerParsingService` / a thin `InputFacade`.
- Keep **public `@Input` / `@Output` API** stable unless explicitly versioned.

## Phase 1 — Boundaries only (low risk)

1. List public methods on `NgxsmkDatepickerComponent` that only delegate to `CalendarGenerationService`; replace with direct service calls from tests where duplicated.
2. Ensure `generateCalendar()` becomes a thin orchestrator: **invalidate revision signals → assign `multiCalendarMonths` → CD**.

## Phase 2 — Extract pure builders

1. Move `buildCalendarMonths` logic that does not need component closure into `CalendarGenerationService` with explicit parameters (`firstDayOfWeek`, `syncScroll`, `count`).
2. Unit-test service methods in isolation with Jasmine.

## Phase 3 — Parsing facade

1. Route typed-input updates through `DatepickerParsingService` + single `applyUserInput()` private method on the component.
2. Reduce branching between native picker vs. text input vs. inline.

## Phase 4 — Touch / positioning (optional)

1. Confirm `TouchGestureHandlerService` and `PopoverPositioningService` own all DOM measurements; component emits intents only.

## Verification

- `npm run test` (ngxsmk-datepicker project)
- `npm run e2e` with demo-app smoke + playground scenarios
- Bundle size check script if touching public exports

See also [FEATURE_SCOPING.md](./FEATURE_SCOPING.md) for upcoming API additions.
