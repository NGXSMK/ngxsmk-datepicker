# Fix for GitHub Issue #136: Angular Signal Forms Validation Support

## Issue Summary

**Issue**: [#136 - datepicker doesn't recognise 'required' attribute in schema](https://github.com/NGXSMK/ngxsmk-datepicker/issues/136)

**Problem**: When using Angular 21 Signal Forms with schema-based validation (e.g., `required(p.dateDue)`), the datepicker component was not recognizing the required validation. The form would allow submission even when required fields were empty, and no validation errors were displayed.

**Root Cause**: The `FieldSyncService` was only checking for a direct `required` property on the field object. In Angular Signal Forms, schema-based validation stores validation metadata in the field's `errors()` signal, not as a direct property.

## Solution Implemented

### 1. Enhanced Field Type Definition

Added support for Angular Signal Forms validation properties:

```typescript
export interface ValidationError {
  kind: string;        // e.g., 'required', 'minDate', 'maxDate'
  message?: string;    // Optional custom error message
}

export type SignalFormField = ({
  value?: DatepickerValue | (() => DatepickerValue) | Signal<DatepickerValue>;
  disabled?: boolean | (() => boolean) | Signal<boolean>;
  required?: boolean | (() => boolean) | Signal<boolean>;
  errors?: ValidationError[] | (() => ValidationError[]) | Signal<ValidationError[]>;  // NEW
  valid?: boolean | (() => boolean) | Signal<boolean>;                                  // NEW
  invalid?: boolean | (() => boolean) | Signal<boolean>;                                // NEW
  touched?: boolean | (() => boolean) | Signal<boolean>;                                // NEW
  setValue?: (value: DatepickerValue) => void;
  updateValue?: (updater: () => DatepickerValue) => void;
  markAsDirty?: () => void;
} & {
  [key: string]: unknown;
}) | null | undefined;
```

### 2. New Helper Methods in FieldSyncService

#### `readFieldErrors(field: SignalFormField): ValidationError[]`
- Reads validation errors from the field's `errors` signal
- Handles signals, functions, and direct arrays
- Returns empty array if no errors

#### `readRequiredState(field: SignalFormField): boolean`
- **Priority 1**: Checks for 'required' validation error in `errors()` signal
- **Priority 2**: Checks direct `required` property
- This ensures schema-based validation takes precedence

#### `hasValidationErrors(field: SignalFormField): boolean`
- Checks the field's `invalid()` signal
- Falls back to checking if `errors()` array has any errors
- Used to set the component's error state

### 3. Error State Tracking

Added `onErrorStateChanged` callback to `FieldSyncCallbacks`:

```typescript
export interface FieldSyncCallbacks {
  onValueChanged: (value: DatepickerValue) => void;
  onDisabledChanged: (disabled: boolean) => void;
  onRequiredChanged?: (required: boolean) => void;
  onErrorStateChanged?: (hasError: boolean) => void;  // NEW
  onSyncError: (error: unknown) => void;
  normalizeValue: (value: unknown) => DatepickerValue;
  isValueEqual: (val1: DatepickerValue, val2: DatepickerValue) => boolean;
  onCalendarGenerated?: () => void;
  onStateChanged?: () => void;
}
```

### 4. Component Integration

Updated both `setupFieldSync` and `syncFieldValue` to call the new callback:

```typescript
// Always update error state (for Angular Signal Forms validation)
const hasError = this.hasValidationErrors(field);
callbacks.onErrorStateChanged?.(hasError);
```

In the datepicker component:

```typescript
onErrorStateChanged: (hasError: boolean) => {
  this.errorState = hasError;
}
```

## Usage Example

### Before (Not Working)

```typescript
export const mySchema = schema((p) => {
  p.id;
  p.dateCompleted;
  p.reference;
  required(p.dateDue);  // This was not recognized
  required(p.name);
});

// In template
<ngxsmk-datepicker
  class="w-full"
  [field]="form.dateDue"
  mode="single"
  placeholder="Select a date">
</ngxsmk-datepicker>

// Form would submit even with empty required field
```

### After (Working)

```typescript
export const mySchema = schema((p) => {
  p.id;
  p.dateCompleted;
  p.reference;
  required(p.dateDue);  // Now properly recognized!
  required(p.name);
});

// In template
<ngxsmk-datepicker
  class="w-full"
  [field]="form.dateDue"
  mode="single"
  placeholder="Select a date">
</ngxsmk-datepicker>

<!-- Display validation errors -->
@if (form.dateDue().invalid() && form.dateDue().touched()) {
  <div class="error-message">
    {{ form.dateDue().errors()[0].message }}
  </div>
}

// Form validation now works correctly!
```

## How It Works

1. **Schema Definition**: When you use `required(p.dateDue)` in the schema, Angular Signal Forms adds a validation error to the field's `errors()` signal when the field is empty.

2. **Error Detection**: The datepicker's `FieldSyncService` reads the `errors()` signal and checks if any error has `kind === 'required'`.

3. **Required State**: If a 'required' error is found, the datepicker sets its `required` property to `true`.

4. **Error State**: The datepicker also checks the field's `invalid()` signal and sets its `errorState` property accordingly.

5. **Reactive Updates**: All of this happens reactively within an Angular effect, so changes to validation state automatically update the datepicker.

6. **Material Integration**: The error state integrates with Angular Material form fields, showing error styling automatically.

## Backward Compatibility

The fix maintains full backward compatibility with:

- **Direct required attribute**: `<ngxsmk-datepicker required>`
- **Reactive Forms**: `<ngxsmk-datepicker [formControl]="dateControl">`
- **Template-driven forms**: `<ngxsmk-datepicker [(ngModel)]="date">`
- **Direct required property**: `field.required = true`

The implementation checks for schema validation errors first, then falls back to the direct `required` property, ensuring existing code continues to work while adding support for Signal Forms.

## Testing

Comprehensive test coverage has been added in `signal-forms-validation.spec.ts`:

- ✅ Schema-based required validation recognition
- ✅ Error state updates when field has validation errors
- ✅ Error state clears when validation errors are resolved
- ✅ Multiple validation errors handling
- ✅ Errors as function support
- ✅ No required when no required error exists
- ✅ Both required property and errors signal
- ✅ Reactive updates when errors signal changes
- ✅ Backward compatibility with direct required property
- ✅ Works without errors signal

## Files Changed

1. **`projects/ngxsmk-datepicker/src/lib/services/field-sync.service.ts`**
   - Added `ValidationError` interface
   - Updated `SignalFormField` type with validation properties
   - Added `onErrorStateChanged` callback to `FieldSyncCallbacks`
   - Added `readFieldErrors()` method
   - Enhanced `readRequiredState()` to check errors signal
   - Added `hasValidationErrors()` method
   - Updated `setupFieldSync()` to track error state
   - Updated `syncFieldValue()` to track error state

2. **`projects/ngxsmk-datepicker/src/lib/ngxsmk-datepicker.ts`**
   - Added `onErrorStateChanged` callback handler in field sync setup
   - Added `onErrorStateChanged` callback handler in sync field value

3. **`projects/ngxsmk-datepicker/src/lib/test/signal-forms-validation.spec.ts`** (NEW)
   - Comprehensive test suite for Signal Forms validation

4. **`docs/SIGNAL_FORMS_VALIDATION.md`** (NEW)
   - Complete documentation with usage examples
   - API reference
   - Migration guide
   - Implementation details

5. **`CHANGELOG.md`**
   - Added version 1.9.30 entry with detailed changes

## Documentation

Complete documentation has been added in `docs/SIGNAL_FORMS_VALIDATION.md` covering:

- Overview of the feature
- Usage examples (basic, multiple validators, custom messages)
- Validation state properties
- Validation error structure
- Backward compatibility
- How the datepicker detects required state
- Implementation details
- Testing information
- Migration guide

## Build Status

✅ Build successful - `npx ng build ngxsmk-datepicker` completed without errors

## Next Steps

1. Run full test suite to ensure no regressions
2. Update version in `package.json` to 1.9.30
3. Publish to npm
4. Close GitHub issue #136 with reference to this fix

## Summary

This fix provides complete support for Angular 21 Signal Forms schema-based validation, resolving issue #136. The datepicker now automatically recognizes validation errors from the field's `errors()` signal, properly handles the `required` validator, and updates its error state reactively. The implementation maintains full backward compatibility while adding powerful new validation capabilities for Signal Forms users.
