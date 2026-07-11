import { Directive, forwardRef } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Directive({
  selector: 'ngxsmk-datepicker[ngxsmkMatFormFieldControl]',
  standalone: true,
  providers: [{ provide: MatFormFieldControl, useExisting: forwardRef(() => NgxsmkDatepickerComponent) }],
})
export class NgxsmkDatepickerMatFormFieldControlDirective {}
