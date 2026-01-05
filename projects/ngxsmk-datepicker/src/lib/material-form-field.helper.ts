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
 */
export function provideMaterialFormFieldControl(matFormFieldControlToken: unknown): Provider {
  return {
    provide: matFormFieldControlToken,
    useExisting: forwardRef(() => NgxsmkDatepickerComponent),
    multi: false
  };
}

