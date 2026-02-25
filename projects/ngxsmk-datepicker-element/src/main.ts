import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

(async () => {
  const app = await createApplication({
    providers: [
      // Add any global providers if needed
    ]
  });

  const DatepickerElement = createCustomElement(NgxsmkDatepickerComponent, {
    injector: app.injector
  });

  customElements.define('ngxsmk-datepicker', DatepickerElement);
})().catch(err => console.error(err));
