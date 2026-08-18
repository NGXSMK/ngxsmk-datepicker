import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: '#1 Angular DatePicker | NGXSMK Elite Signal-Based Date Selection',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'installation',
    title: 'Installation & Setup Guide | NGXSMK DatePicker',
    loadComponent: () => import('./pages/installation/installation.component').then((m) => m.InstallationComponent),
  },
  {
    path: 'integrations',
    title: 'Framework Integrations (Angular Material, Ionic, React) | NGXSMK DatePicker',
    loadComponent: () => import('./pages/integrations/integrations.component').then((m) => m.IntegrationsComponent),
  },
  {
    path: 'examples',
    title: 'Interactive Code Examples & Selection Modes | NGXSMK DatePicker',
    loadComponent: () => import('./pages/examples/examples.component').then((m) => m.ExamplesComponent),
  },
  {
    path: 'advanced',
    title: 'Advanced Features (Signals, Holidays, Masking, Timezones) | NGXSMK DatePicker',
    loadComponent: () => import('./pages/advanced/advanced.component').then((m) => m.AdvancedFeaturesComponent),
  },
  {
    path: 'theming',
    title: 'Custom CSS Theming & ThemeBuilderService | NGXSMK DatePicker',
    loadComponent: () => import('./pages/theming/theming.component').then((m) => m.ThemingComponent),
  },
  {
    path: 'architecture',
    title: 'Signal Architecture & Plugin System | NGXSMK DatePicker',
    loadComponent: () => import('./pages/architecture/architecture.component').then((m) => m.ArchitectureComponent),
  },
  {
    path: 'api',
    title: 'Complete API Reference & Component Specs | NGXSMK DatePicker',
    loadComponent: () => import('./pages/api/api.component').then((m) => m.ApiComponent),
  },
  {
    path: 'playground',
    title: 'Live Interactive Playground | NGXSMK DatePicker',
    loadComponent: () => import('./pages/playground/playground.component').then((m) => m.PlaygroundComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
