import { forwardRef, Provider } from '@angular/core';
import { NgxsmkDatepickerComponent } from './ngxsmk-datepicker';

/**
 * Helper function to provide Angular Material form field control token
 * Use this when using ngxsmk-datepicker inside mat-form-field in non-standalone components
 * 
 * IMPORTANT: This requires @angular/material to be installed. Import MAT_FORM_FIELD_CONTROL
 * from @angular/material/form-field and pass it to this function.
 * 
 * @example For NgModule (non-standalone):
 * ```typescript
 * import { NgModule } from '@angular/core';
 * import { MAT_FORM_FIELD_CONTROL } from '@angular/material/form-field';
 * import { NgxsmkDatepickerComponent, provideMaterialFormFieldControl } from 'ngxsmk-datepicker';
 * 
 * @NgModule({
 *   imports: [NgxsmkDatepickerComponent],
 *   providers: [provideMaterialFormFieldControl(MAT_FORM_FIELD_CONTROL)]
 * })
 * export class MyModule { }
 * ```
 * 
 * @example For standalone component:
 * ```typescript
 * import { Component } from '@angular/core';
 * import { MAT_FORM_FIELD_CONTROL } from '@angular/material/form-field';
 * import { NgxsmkDatepickerComponent, provideMaterialFormFieldControl } from 'ngxsmk-datepicker';
 * 
 * @Component({
 *   standalone: true,
 *   imports: [NgxsmkDatepickerComponent],
 *   providers: [provideMaterialFormFieldControl(MAT_FORM_FIELD_CONTROL)]
 * })
 * export class MyComponent { }
 * ```
 * 
 * ### Troubleshooting
 * If you see the error `mat-form-field must contain a MatFormFieldControl`:
 * 1. Ensure you are passing `MAT_FORM_FIELD_CONTROL` (not `MAT_FORM_FIELD`) to this function.
 * 2. Ensure you have added the provider to the `providers` array of your component or module.
 * 3. In standalone components, make sure `NgxsmkDatepickerComponent` is in the `imports` array.
 */
export function provideMaterialFormFieldControl(matFormFieldControlToken: unknown): Provider {
  if (!matFormFieldControlToken) {
    console.warn(
      'NgxsmkDatepicker: provideMaterialFormFieldControl was called without a token. ' +
      'Please pass MAT_FORM_FIELD_CONTROL from @angular/material/form-field.'
    );
  } else if (matFormFieldControlToken.toString().includes('MatFormField') && !matFormFieldControlToken.toString().includes('Control')) {
    console.warn(
      'NgxsmkDatepicker: provideMaterialFormFieldControl was passed MAT_FORM_FIELD instead of MAT_FORM_FIELD_CONTROL. ' +
      'Please ensure you are using the correct token for the form field control.'
    );
  }

  return {
    provide: matFormFieldControlToken || 'MAT_FORM_FIELD_CONTROL_MISSING',
    useExisting: forwardRef(() => NgxsmkDatepickerComponent),
    multi: false
  };
}

