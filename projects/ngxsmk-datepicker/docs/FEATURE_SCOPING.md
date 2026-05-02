# Feature scoping: Enhanced Localization & Enhanced Time Selection

**Last updated:** May 2, 2026 · Aligns with [ROADMAP.md](../../../ROADMAP.md) (Current Focus).

This document defines **concrete inputs and behaviors** for roadmap items *Enhanced Localization* and *Enhanced Time Selection* so implementations can proceed without API ambiguity. Until shipped, treat these as **design proposals**; minor renames may occur in minor releases with changelog notes.

---

## Enhanced Localization

### Existing building blocks

- `@Input() locale: string` — BCP 47 locale tag.
- `@Input() displayFormat` / `dateFormatPattern` — custom format strings (see README).
- `@Input() weekStart` — override first day of week.
- `@Input() rtl` — explicit RTL override.

### Proposed additions (backlog)

| Input | Type | Purpose |
|-------|------|---------|
| `numberingSystem` | `'latn' \| 'arab' \| 'arabext' \| ... \| undefined` | Pass-through to `Intl` / formatting where supported; `undefined` = locale default. |
| `calendarPreference` | `'gregory' \| 'iso8601' \| undefined` | Opt-in calendar system for display (browser capability dependent). |
| `currencyDisplayForAddons` | `'symbol' \| 'narrowSymbol' \| 'code'` | If future price/booking templates show currency beside dates. |

### Non-input work

- Expand **preset format tokens** documentation table (mirror Angular `DatePipe` where aligned).
- Optional **`Intl.NumberFormat`** wrapper for footer chips / custom templates.

---

## Enhanced Time Selection

### Existing building blocks

- `@Input() showTime`, `showSeconds`, `use24Hour`, `minuteInterval`, `secondInterval`
- `@Input() timezone` — IANA zone for “today” and conversions ([timezone.utils](../src/lib/utils/timezone.utils.ts))
- `@Input() timeRangeMode` — paired times in range mode
- `@Input() mobileTimePickerStyle`

### Proposed additions (backlog)

| Input | Type | Purpose |
|-------|------|---------|
| `timeZoneDisplay` | `'short' \| 'long' \| 'shortOffset' \| 'longOffset'` | How zone appears next to time when `timezone` is set (Intl-dependent). |
| `showTimezoneSelector` | `boolean` | Future: opt-in UI to pick among a bounded list of zones (requires design). |
| `timeStepRounding` | `'floor' \| 'ceil' \| 'nearest'` | When snapping typed times to `minuteInterval`. |

### Behaviors to clarify in docs

- **Range + time**: document ordering of date vs. time commit when `showTime` is true (single source of truth in component today).
- **DST transitions**: document that normalization uses the configured `timezone` utilities.

---

## Versioning

- New `@Input()` names land in **minor** releases with defaults preserving current behavior.
- Breaking renames only in **major** releases per [MIGRATION.md](../../../MIGRATION.md).
