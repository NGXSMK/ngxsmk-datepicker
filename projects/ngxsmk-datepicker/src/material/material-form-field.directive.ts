import { Directive, forwardRef } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

/** Provides MatFormFieldControl on the host so mat-form-field finds the datepicker. Requires @angular/material. */
@Directive({
  selector: 'ngxsmk-datepicker[ngxsmkMatFormFieldControl]',
  standalone: true,
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => NgxsmkDatepickerComponent),
    },
  ],
})
export class NgxsmkDatepickerMatFormFieldControlDirective {}
