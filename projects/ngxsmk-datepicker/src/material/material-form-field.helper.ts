import { forwardRef, Provider } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

/** Registers MatFormFieldControl so mat-form-field finds the datepicker. Pass MatFormFieldControl from @angular/material/form-field. Prefer NgxsmkDatepickerMatFormFieldControlDirective on the host. */
function isWrongToken(token: unknown): boolean {
  if (!token) return true;
  const s = String(token);
  return s.includes('MatFormField') && !s.includes('Control');
}

export function provideMaterialFormFieldControl(matFormFieldControlToken: unknown): Provider {
  if (!matFormFieldControlToken) {
    throw new Error(
      '[NgxsmkDatepicker] provideMaterialFormFieldControl was called without a token. ' +
        "Pass MatFormFieldControl from '@angular/material/form-field'. " +
        'Alternatively call NgxsmkDatepickerComponent.withMaterialSupport(MatFormFieldControl) once at app startup (e.g. in main.ts).'
    );
  }
  if (isWrongToken(matFormFieldControlToken)) {
    throw new Error(
      '[NgxsmkDatepicker] Wrong token: use MatFormFieldControl from "@angular/material/form-field", not MAT_FORM_FIELD. ' +
        "Example: import { MatFormFieldControl } from '@angular/material/form-field'; " +
        'then provideMaterialFormFieldControl(MatFormFieldControl) or NgxsmkDatepickerComponent.withMaterialSupport(MatFormFieldControl) in main.ts.'
    );
  }

  NgxsmkDatepickerComponent.withMaterialSupport(matFormFieldControlToken);

  return {
    provide: matFormFieldControlToken,
    useExisting: forwardRef(() => NgxsmkDatepickerComponent),
    multi: false,
  };
}
