# Angular Signal Forms Validation Support

**Last updated:** February 25, 2026 · **Current stable:** v2.1.9

## Overview

Starting from version 2.0.5, `ngxsmk-datepicker` fully supports Angular 21's Signal Forms validation, including schema-based validation with the `required()` function and other validators.

## Issue Reference

This feature resolves [GitHub Issue #136](https://github.com/NGXSMK/ngxsmk-datepicker/issues/136) - "datepicker doesn't recognise 'required' attribute in schema"

## How It Works

The datepicker now automatically detects and responds to:

1. **Schema-based validation errors** - Checks the field's `errors()` signal for validation errors
2. **Required validation** - Recognizes when a field has a 'required' validation error
3. **Error state** - Updates the component's error state based on the field's `invalid()` signal
4. **Reactive updates** - Automatically updates when validation state changes

## Usage Examples

### Basic Required Validation

```typescript
import { Component, signal } from '@angular/core';
import { form, schema, required } from '@angular/forms/signals';

@Component({
  selector: 'app-example',
  template: `
    <ngxsmk-datepicker
      class="w-full"
      [field]="form.dateDue"
      mode="single"
      placeholder="Select a date">
    </ngxsmk-datepicker>

    @if (form.dateDue().invalid() && form.dateDue().touched()) {
      <div class="error-message">
        {{ form.dateDue().errors()[0].message }}
      </div>
    }
  `
})
export class ExampleComponent {
  // Define your data model
  objFormModel = signal({
    id: '',
    name: '',
    reference: '',
    dateDue: null as Date | null,
    dateCompleted: null as Date | null,
  });

  // Define your schema with validation
  mySchema = schema((p) => {
    p.id;
    p.dateCompleted;
    p.reference;
    required(p.dateDue);  // This field is required
    required(p.name);
  });

  // Create the form
  protected readonly form = form(this.objFormModel, this.mySchema);

  onSubmit() {
    // The form will automatically validate
    if (this.form.valid()) {
      console.log('Form is valid!', this.form.value());
    } else {
      console.log('Form has errors');
    }
  }
}
```

### Multiple Validators

```typescript
import { minDate, maxDate, required } from '@angular/forms/signals';

mySchema = schema((p) => {
  // Required with date range validation
  required(p.startDate);
  minDate(p.startDate, new Date('2024-01-01'));
  maxDate(p.startDate, new Date('2024-12-31'));
});
```

### Custom Error Messages

```typescript
import { required } from '@angular/forms/signals';

mySchema = schema((p) => {
  required(p.dateDue, {
    message: 'Please select a due date for this task'
  });
});
```

### Displaying Validation Errors

```typescript
@Component({
  template: `
    <ngxsmk-datepicker
      [field]="form.dateDue"
      mode="single">
    </ngxsmk-datepicker>

    <!-- Show errors only after user has touched the field -->
    @if (form.dateDue().invalid() && form.dateDue().touched()) {
      <div class="error-messages">
        @for (error of form.dateDue().errors(); track error.kind) {
          <p class="error">{{ error.message || error.kind }}</p>
        }
      </div>
    }
  `
})
```

### Material Form Field Integration

The datepicker automatically integrates with Angular Material form fields and will show error states:

```typescript
@Component({
  template: `
    <mat-form-field>
      <mat-label>Due Date</mat-label>
      <ngxsmk-datepicker
        [field]="form.dateDue"
        placeholder="Select due date">
      </ngxsmk-datepicker>
      
      @if (form.dateDue().invalid() && form.dateDue().touched()) {
        <mat-error>
          {{ form.dateDue().errors()[0].message }}
        </mat-error>
      }
    </mat-form-field>
  `
})
```

## Validation State Properties

The datepicker automatically reads and responds to these Signal Forms properties:

| Property | Type | Description |
|----------|------|-------------|
| `errors()` | `Signal<ValidationError[]>` | Array of validation errors |
| `invalid()` | `Signal<boolean>` | True if field has validation errors |
| `valid()` | `Signal<boolean>` | True if field passes all validations |
| `touched()` | `Signal<boolean>` | True if user has interacted with field |
| `dirty()` | `Signal<boolean>` | True if value has changed |
| `required` | `boolean \| Signal<boolean>` | True if field is required |

## Validation Error Structure

```typescript
interface ValidationError {
  kind: string;        // e.g., 'required', 'minDate', 'maxDate'
  message?: string;    // Optional custom error message
}
```

## Backward Compatibility

The datepicker maintains full backward compatibility with:

- **Direct `required` attribute**: `<ngxsmk-datepicker required>`
- **Reactive Forms**: `<ngxsmk-datepicker [formControl]="dateControl">`
- **Template-driven forms**: `<ngxsmk-datepicker [(ngModel)]="date">`
- **Direct `required` property on field**: `field.required = true`

## How the Datepicker Detects Required State

The datepicker checks for required state in this order:

1. **Schema validation errors** - Checks if `errors()` signal contains a 'required' error
2. **Direct required property** - Checks `field.required` property
3. **Required attribute** - Checks the `required` input property

This ensures that schema-based validation takes precedence while maintaining backward compatibility.

## Implementation Details

### Field Sync Service

The `FieldSyncService` has been enhanced with:

- `readFieldErrors()` - Reads validation errors from the field's `errors` signal
- `readRequiredState()` - Checks for required validation in errors or direct property
- `hasValidationErrors()` - Determines if field has any validation errors
- `onErrorStateChanged` callback - Notifies component of error state changes

### Component Integration

The datepicker component:

- Automatically updates `required` property when schema validation changes
- Updates `errorState` property based on field's `invalid()` signal
- Triggers change detection when validation state changes
- Integrates with Material Form Field error display

## Testing

Comprehensive test coverage has been added in `signal-forms-validation.spec.ts`:

- Schema-based required validation
- Error state management
- Multiple validation errors
- Reactive error updates
- Backward compatibility
- Edge cases and error handling

## Migration Guide

If you're currently using workarounds for Signal Forms validation:

### Before (Workaround)

```typescript
// Manual required handling
<ngxsmk-datepicker
  [field]="form.dateDue"
  [required]="true">  <!-- Manual required -->
</ngxsmk-datepicker>
```

### After (Automatic)

```typescript
// Automatic detection from schema
<ngxsmk-datepicker
  [field]="form.dateDue">  <!-- Required detected automatically -->
</ngxsmk-datepicker>
```

## Known Limitations

None. The implementation fully supports all Angular Signal Forms validation features.

## Related Documentation

- [Angular Signal Forms Guide](https://angular.dev/guide/forms/signal-forms)
- [Signal Forms Validation](https://angular.dev/guide/forms/signal-forms#validation)
- [ngxsmk-datepicker Signal Forms Integration](./SIGNAL_FORMS.md)

## Support

If you encounter any issues with Signal Forms validation, please:

1. Check that you're using Angular 21+ with Signal Forms enabled
2. Verify your schema is correctly defined
3. Check the browser console for any errors
4. Report issues at: https://github.com/NGXSMK/ngxsmk-datepicker/issues
