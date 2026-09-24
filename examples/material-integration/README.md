# Material Integration Example

This project tests the fix for [Issue #187](https://github.com/NGXSMK/ngxsmk-datepicker/issues/187) —
`mat-form-field must contain a MatFormFieldControl`.

## Root Cause

`mat-form-field` discovers its control via an Angular `@ContentChild(MatFormFieldControl)` query.
This query looks for a component that is **provided as `MatFormFieldControl` in its own injector** —
not in the parent component's injector.

The old approach (`provideMaterialFormFieldControl` in the parent's `providers`) **does not work**
because Angular's content-child resolution does not walk up to the parent's providers.

## Recommended fix: `ngxsmk-datepicker/material`

Import **`NgxsmkDatepickerMatFormFieldControlDirective`** from the optional secondary entry and put
**`ngxsmkMatFormFieldControl`** on the datepicker. This keeps `@angular/material` out of the main
library bundle. See [INTEGRATION.md § Angular Material](../../projects/ngxsmk-datepicker/docs/INTEGRATION.md#angular-material).

```typescript
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { NgxsmkDatepickerMatFormFieldControlDirective } from 'ngxsmk-datepicker/material';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  imports: [
    MatFormFieldModule,
    NgxsmkDatepickerComponent,
    NgxsmkDatepickerMatFormFieldControlDirective,
    // ...
  ],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>Select Date</mat-label>
      <ngxsmk-datepicker ngxsmkMatFormFieldControl formControlName="date" mode="single" />
      <mat-hint>Click to open calendar</mat-hint>
    </mat-form-field>
  `
})
```

No `main.ts` or `withMaterialSupport` needed.

## Old (Broken) Approach

```typescript
// This does NOT work — the provider is on the parent, not the datepicker itself
@Component({
  providers: [provideMaterialFormFieldControl(MatFormFieldControl)]
})
export class MyComponent {}
```

## Running

```bash
# From the workspace root
npx ng serve material-integration
```

Navigate to `http://localhost:4200` to see three test cases:
1. Outline appearance (single date)
2. Fill appearance (date range)
3. Required validation with error message
