import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page">
      <h2>Issue reproduction app</h2>
      <p>
        This app is used to manually verify fixes for filed issues in
        <code>ngxsmk-datepicker</code>.
      </p>
      <ul>
        <li>
          <a routerLink="/month-navigation">Month navigation</a> – Range mode:
          view should stay on end month after selecting a range spanning two
          months (e.g. Jan 31 → Feb 3).
        </li>
        <li>
          <a routerLink="/range-reselection">Range reselection</a> – Range
          mode: clicking start clears end; clicking end makes it new start;
          clicking inside range sets new start and clears end.
        </li>
      </ul>
    </div>
  `,
})
export class HomeComponent {}
