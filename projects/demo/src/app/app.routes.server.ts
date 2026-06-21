import { RenderMode, type ServerRoute } from '@angular/ssr';

import { COMPONENTS } from './app';
import { BLOCKS } from './pages/blocks';
import { CHARTS } from './pages/charts';
import { TEMPLATES } from './pages/templates';

/**
 * Server render config — every route is prerendered to static HTML at build time
 * (outputMode: static). Parameterised routes enumerate their slugs so each page
 * is rendered server-side, which also validates SSR-safety of every component.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: 'components/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => Promise.resolve(COMPONENTS.map((slug) => ({ slug }))),
  },
  {
    path: 'blocks/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => Promise.resolve(BLOCKS.map((slug) => ({ slug }))),
  },
  {
    path: 'templates/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => Promise.resolve(TEMPLATES.map((slug) => ({ slug }))),
  },
  {
    path: 'charts/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => Promise.resolve(CHARTS.map((chart) => ({ slug: chart.slug }))),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
