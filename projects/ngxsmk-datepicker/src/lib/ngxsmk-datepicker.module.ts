import { NgModule } from '@angular/core';
import { NgxsmkDatepickerComponent } from './ngxsmk-datepicker';

/**
 * Wrapper NgModule for the standalone datepicker component.
 * Use this in your `imports` array if you see NG1010 ("imports must be an array...
 * Value could not be determined statically") when using the Angular compiler plugin
 * or in strict AOT builds.
 *
 * @example
 * ```typescript
 * import { NgxsmkDatepickerModule } from 'ngxsmk-datepicker';
 *
 * @Component({
 *   standalone: true,
 *   imports: [NgxsmkDatepickerModule],  // single static reference
 *   template: '<ngxsmk-datepicker></ngxsmk-datepicker>'
 * })
 * export class MyComponent {}
 * ```
 *
 * For NgModule-based apps:
 * ```typescript
 * @NgModule({
 *   imports: [NgxsmkDatepickerModule],
 *   exports: [NgxsmkDatepickerModule]
 * })
 * export class MyFeatureModule {}
 * ```
 */
@NgModule({
  imports: [NgxsmkDatepickerComponent],
  exports: [NgxsmkDatepickerComponent],
})
export class NgxsmkDatepickerModule {}
