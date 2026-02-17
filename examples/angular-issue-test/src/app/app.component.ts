import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="app-nav">
      <h1>ngxsmk-datepicker issue reproduction</h1>
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
      <a routerLink="/month-navigation" routerLinkActive="active">Month navigation</a>
      <a routerLink="/range-reselection" routerLinkActive="active">Range reselection</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`.active { font-weight: bold; }`],
})
export class AppComponent {}
