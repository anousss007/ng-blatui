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
  {
    path: 'blocks',
    loadComponent: async () => (await import('./pages/blocks-index')).BlocksIndex,
    title: 'Blocks · ng-blatui',
  },
  {
    path: 'blocks/:slug',
    loadComponent: async () => (await import('./pages/blocks')).BlocksPage,
    title: 'Blocks · ng-blatui',
  },
  {
    path: 'templates',
    loadComponent: async () => (await import('./pages/templates-index')).TemplatesIndex,
    title: 'Templates · ng-blatui',
  },
  {
    path: 'templates/aurora',
    loadComponent: async () => (await import('./pages/templates/aurora')).AuroraTemplate,
    title: 'Aurora · ng-blatui',
  },
  {
    path: 'templates/:slug',
    loadComponent: async () => (await import('./pages/templates')).TemplatesPage,
    title: 'Templates · ng-blatui',
  },
  {
    path: 'charts',
    loadComponent: async () => (await import('./pages/charts-index')).ChartsIndex,
    title: 'Charts · ng-blatui',
  },
  {
    path: 'charts/:slug',
    loadComponent: async () => (await import('./pages/charts')).ChartViewer,
    title: 'Charts · ng-blatui',
  },
  {
    path: 'themes',
    loadComponent: async () => (await import('./pages/themes')).Themes,
    title: 'Themes · ng-blatui',
  },
  { path: '**', redirectTo: '' },
];
