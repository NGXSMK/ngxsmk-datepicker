import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'installation',
        loadComponent: () => import('./pages/installation/installation.component').then(m => m.InstallationComponent)
    },
    {
        path: 'integrations',
        loadComponent: () => import('./pages/integrations/integrations.component').then(m => m.IntegrationsComponent)
    },
    {
        path: 'examples',
        loadComponent: () => import('./pages/examples/examples.component').then(m => m.ExamplesComponent)
    },
    {
        path: 'advanced',
        loadComponent: () => import('./pages/advanced/advanced.component').then(m => m.AdvancedFeaturesComponent)
    },
    {
        path: 'theming',
        loadComponent: () => import('./pages/theming/theming.component').then(m => m.ThemingComponent)
    },
    {
        path: 'architecture',
        loadComponent: () => import('./pages/architecture/architecture.component').then(m => m.ArchitectureComponent)
    },
    {
        path: 'api',
        loadComponent: () => import('./pages/api/api.component').then(m => m.ApiComponent)
    },
    {
        path: 'playground',
        loadComponent: () => import('./pages/playground/playground.component').then(m => m.PlaygroundComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
