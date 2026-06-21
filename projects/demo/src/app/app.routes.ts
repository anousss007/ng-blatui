import { type Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: async () => (await import('./pages/introduction')).Introduction,
    title: 'ng-blatui — accessible Angular UI components',
  },
  {
    path: 'docs/installation',
    loadComponent: async () => (await import('./pages/installation')).Installation,
    title: 'Installation · ng-blatui',
  },
  {
    path: 'docs/theming',
    loadComponent: async () => (await import('./pages/theming')).Theming,
    title: 'Theming · ng-blatui',
  },
  {
    path: 'components',
    loadComponent: async () => (await import('./pages/components-index')).ComponentsIndex,
    title: 'Components · ng-blatui',
  },
  {
    path: 'components/:slug',
    loadComponent: async () => (await import('./pages/components')).ComponentPage,
    title: 'Components · ng-blatui',
  },
  { path: 'blocks', redirectTo: 'blocks/login-01', pathMatch: 'full' },
  {
    path: 'blocks/:slug',
    loadComponent: async () => (await import('./pages/blocks')).BlocksPage,
    title: 'Blocks · ng-blatui',
  },
  { path: 'templates', redirectTo: 'templates/auth', pathMatch: 'full' },
  {
    path: 'templates/:slug',
    loadComponent: async () => (await import('./pages/templates')).TemplatesPage,
    title: 'Templates · ng-blatui',
  },
  { path: '**', redirectTo: '' },
];
