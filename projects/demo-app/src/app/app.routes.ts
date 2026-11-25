import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Angular Datepicker and Date Range Picker | NGXSMK',
    data: {
      description:
        'Try an open-source Angular datepicker with single dates, date ranges, and multiple selections. Supports standalone components, Signals, and zoneless apps.',
    },
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'installation',
    title: 'Install ngxsmk-datepicker in Angular | NGXSMK',
    data: {
      description:
        'Install ngxsmk-datepicker with npm or ng add, import the standalone Angular component, and connect it to your first form.',
    },
    loadComponent: () => import('./pages/installation/installation.component').then((m) => m.InstallationComponent),
  },
  {
    path: 'integrations',
    title: 'Angular Datepicker Integrations | NGXSMK',
    data: {
      description:
        'Integrate ngxsmk-datepicker with Angular Material, Ionic, and Angular forms. Explore SSR setup and examples for other frameworks.',
    },
    loadComponent: () => import('./pages/integrations/integrations.component').then((m) => m.IntegrationsComponent),
  },
  {
    path: 'examples',
    title: 'Angular Datepicker Examples | NGXSMK',
    data: {
      description:
        'Try live Angular examples for single dates, ranges, multiple dates, time selection, and presets, with code you can reuse.',
    },
    loadComponent: () => import('./pages/examples/examples.component').then((m) => m.ExamplesComponent),
  },
  {
    path: 'advanced',
    title: 'Angular Datepicker Timezones and Advanced Features | NGXSMK',
    data: {
      description:
        'Configure time zones, holiday providers, availability rules, input masking, and secondary calendars in ngxsmk-datepicker.',
    },
    loadComponent: () => import('./pages/advanced/advanced.component').then((m) => m.AdvancedFeaturesComponent),
  },
  {
    path: 'theming',
    title: 'Angular Datepicker CSS Theming | NGXSMK',
    data: {
      description:
        'Customize the Angular datepicker with CSS variables, light and dark themes, Tailwind, and the runtime ThemeBuilderService.',
    },
    loadComponent: () => import('./pages/theming/theming.component').then((m) => m.ThemingComponent),
  },
  {
    path: 'architecture',
    title: 'Datepicker Signals and Plugin Architecture | NGXSMK',
    data: {
      description:
        'Learn how ngxsmk-datepicker uses Angular Signals and how to extend its behavior with plugins and lifecycle hooks.',
    },
    loadComponent: () => import('./pages/architecture/architecture.component').then((m) => m.ArchitectureComponent),
  },
  {
    path: 'api',
    title: 'ngxsmk-datepicker API Reference | NGXSMK',
    data: {
      description:
        'Look up ngxsmk-datepicker inputs, outputs, public methods, directives, and TypeScript types for Angular projects.',
    },
    loadComponent: () => import('./pages/api/api.component').then((m) => m.ApiComponent),
  },
  {
    path: 'playground',
    title: 'Angular Datepicker Playground | NGXSMK',
    data: {
      description:
        'Configure a live Angular datepicker, preview your changes, and copy the generated Angular template.',
    },
    loadComponent: () => import('./pages/playground/playground.component').then((m) => m.PlaygroundComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
