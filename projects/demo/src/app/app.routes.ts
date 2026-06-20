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
    loadComponent: async () => (await import('./pages/components')).Components,
    title: 'Components · ng-blatui',
  },
  { path: '**', redirectTo: '' },
];
