# ngxsmk-datepicker

Domain language for the datepicker library: how dates are constrained, selected, and interpreted from user input.

## Language

**Datepicker Host**:
The Angular shell that owns inputs, outputs, lifecycle, CVA/signal forms wiring, and template composition. Behaviour algorithms live elsewhere.
_Avoid_: God component, facade (when meaning the shell)

**Constraints**:
The rules that decide whether a calendar day is allowed — min/max, disabled dates/ranges, holidays, async disabled sets, and custom predicates.
_Avoid_: Validation (overloaded with forms validators), DateValidationService

**Selection**:
The rules that turn a user intent (day click, typed apply, AI apply, range preset) plus current value and mode into the next datepicker value and follow-on intents.
_Avoid_: DateSelectionService, click handler

**Input Interpretation**:
Turning raw text into a candidate value (and a value into display text), including mask, format, natural language, and optional AI resolve.
_Avoid_: Parsing service, display formatting (as separate concepts)

**AiDateResolver**:
An external adapter that resolves a free-text prompt into dates; the default fallback is natural-language rules inside Input Interpretation.
_Avoid_: AI service, chatbot

**Positioning**:
Computing where the popover sits relative to the trigger and viewport.
_Avoid_: Overlay (as a second competing module name), DatepickerOverlayService, PopoverPositioningService (as the lasting public name)

**Selection Effect**:
A follow-on action Selection describes but does not perform (announce, navigate month, close popover, emit invalid range, emit value) — the Datepicker Host executes it.
_Avoid_: callback, side effect hook

**Content View-Model**:
The narrow presentation state and intent channel the calendar chrome consumes, instead of a large bag of individual bindings.
_Avoid_: Input property bag, bound predicates

**Range Preset**:
A named start/end (or factory) offered in the UI to apply a range through Selection.
_Avoid_: DatePresetsService, stored preset

**Stored Preset**:
A user-saved preset persisted outside the calendar (e.g. localStorage), distinct from Range Preset.
_Avoid_: Range preset, DatePresetsService (as if it meant Range Preset)

**Day Selection**:
Selection behaviour for `single`, `range`, and `multiple` modes. Period and time-range modes are outside this term until deepened later.
_Avoid_: All modes (when meaning only day-based)

**Constraints Snapshot**:
An immutable build of Constraints for the current inputs; the Datepicker Host rebuilds it when those inputs change (including async disabled updates).
_Avoid_: Live mutable validator, per-call rebuild

**Day Verdict**:
The result of asking a Constraints Snapshot about one day: allowed, or not allowed with a Constraint Denial.
_Avoid_: isDateDisabled boolean (as the sole truth)

**Constraint Denial**:
A structured reason a day is not allowed (min, max, disabled date/range, async disabled, holiday, invalid date). Forms validators map these to public error keys.
_Avoid_: Generic validation error, unexplained blocked flag
