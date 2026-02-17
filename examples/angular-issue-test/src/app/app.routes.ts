import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'month-navigation',
    loadComponent: () =>
      import('./pages/month-navigation/month-navigation.component').then(
        (m) => m.MonthNavigationComponent
      ),
  },
  {
    path: 'range-reselection',
    loadComponent: () =>
      import('./pages/range-reselection/range-reselection.component').then(
        (m) => m.RangeReselectionComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
