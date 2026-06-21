import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BuiButton, BuiChart, type ChartSeries } from 'ng-blatui';

export interface ChartExample {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly family: 'Area' | 'Bar' | 'Line';
  readonly type: 'area' | 'bar' | 'line';
  readonly labels: readonly string[];
  readonly series: readonly ChartSeries[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

/** Chart examples — mirrors BlatUI's /charts. Area / bar / line variants via bui-chart. */
export const CHARTS: readonly ChartExample[] = [
  {
    slug: 'chart-area-default',
    title: 'Area Chart',
    description: 'A simple area chart.',
    family: 'Area',
    type: 'area',
    labels: MONTHS,
    series: [{ name: 'Desktop', data: [186, 305, 237, 273, 209, 264] }],
  },
  {
    slug: 'chart-area-stacked',
    title: 'Area Chart — Stacked',
    description: 'Two series layered as areas.',
    family: 'Area',
    type: 'area',
    labels: MONTHS,
    series: [
      { name: 'Desktop', data: [186, 305, 237, 273, 209, 264] },
      { name: 'Mobile', data: [80, 200, 120, 190, 130, 140] },
    ],
  },
  {
    slug: 'chart-area-linear',
    title: 'Area Chart — Linear',
    description: 'An area chart with a steady trend.',
    family: 'Area',
    type: 'area',
    labels: MONTHS,
    series: [{ name: 'Visitors', data: [120, 160, 200, 240, 280, 320] }],
  },
  {
    slug: 'chart-bar-default',
    title: 'Bar Chart',
    description: 'A simple bar chart.',
    family: 'Bar',
    type: 'bar',
    labels: MONTHS,
    series: [{ name: 'Desktop', data: [186, 305, 237, 273, 209, 264] }],
  },
  {
    slug: 'chart-bar-multiple',
    title: 'Bar Chart — Multiple',
    description: 'Two series shown side by side.',
    family: 'Bar',
    type: 'bar',
    labels: MONTHS,
    series: [
      { name: 'Desktop', data: [186, 305, 237, 273, 209, 264] },
      { name: 'Mobile', data: [80, 200, 120, 190, 130, 140] },
    ],
  },
  {
    slug: 'chart-line-default',
    title: 'Line Chart',
    description: 'A simple line chart.',
    family: 'Line',
    type: 'line',
    labels: MONTHS,
    series: [{ name: 'Desktop', data: [186, 305, 237, 273, 209, 264] }],
  },
  {
    slug: 'chart-line-multiple',
    title: 'Line Chart — Multiple',
    description: 'Compare two trends over time.',
    family: 'Line',
    type: 'line',
    labels: MONTHS,
    series: [
      { name: 'Desktop', data: [186, 305, 237, 273, 209, 264] },
      { name: 'Mobile', data: [80, 200, 120, 190, 130, 140] },
    ],
  },
  {
    slug: 'chart-line-step',
    title: 'Line Chart — Trend',
    description: 'A rising trend line.',
    family: 'Line',
    type: 'line',
    labels: MONTHS,
    series: [{ name: 'Revenue', data: [50, 90, 140, 180, 240, 300] }],
  },
];

export const CHART_SLUGS = CHARTS.map((c) => c.slug);

/** Viewer for /charts/:slug — one chart, full width, with its source-ish config. */
@Component({
  selector: 'app-chart-viewer',
  imports: [RouterLink, BuiButton, BuiChart],
  template: `
    <a
      routerLink="/charts"
      class="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >← All charts</a
    >
    @if (chart(); as c) {
      <header class="mb-6 space-y-1">
        <h1 class="text-3xl font-bold tracking-tight">{{ c.title }}</h1>
        <p class="text-muted-foreground">{{ c.description }}</p>
      </header>
      <div class="rounded-xl border bg-card p-6">
        <bui-chart
          [type]="c.type"
          [series]="c.series"
          [labels]="c.labels"
          [height]="320"
          [label]="c.title"
        />
      </div>
      <div class="mt-6 flex gap-2">
        <a buiButton variant="outline" size="sm" routerLink="/charts">Back to gallery</a>
      </div>
    } @else {
      <p class="text-muted-foreground">Chart not found.</p>
    }
  `,
})
export class ChartViewer {
  readonly slug = input('');
  protected readonly chart = computed(() => CHARTS.find((c) => c.slug === this.slug()));
}
