import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BuiButton, BuiChart, type ChartSeries } from 'ng-blatui';

export type ChartFamily = 'Area' | 'Bar' | 'Line' | 'Tooltip' | 'Pie' | 'Radar' | 'Radial';

export interface ChartExample {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly family: ChartFamily;
  /** Render strategy: xy via bui-chart; pie/radial/radar via inline SVG (lib has no such chart). */
  readonly kind: 'xy' | 'pie' | 'radial' | 'radar';
  // xy
  readonly type?: 'area' | 'bar' | 'line';
  readonly labels?: readonly string[];
  readonly series?: readonly ChartSeries[];
  // pie / radial
  readonly slices?: readonly { label: string; value: number; color: string }[];
  // radar
  readonly axes?: readonly string[];
  readonly radar?: readonly { name: string; data: number[]; color: string }[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const DESKTOP = [186, 305, 237, 273, 209, 264];
const MOBILE = [80, 200, 120, 190, 130, 140];

function xy(
  slug: string,
  title: string,
  description: string,
  family: ChartFamily,
  type: 'area' | 'bar' | 'line',
  series: ChartSeries[],
  labels: readonly string[] = MONTHS,
): ChartExample {
  return { slug, title, description, family, kind: 'xy', type, series, labels };
}

const AREA: ChartExample[] = [
  xy('chart-area-default', 'Area Chart', 'A simple area chart.', 'Area', 'area', [
    { name: 'Desktop', data: DESKTOP },
  ]),
  xy('chart-area-linear', 'Area Chart — Linear', 'A steady upward trend.', 'Area', 'area', [
    { name: 'Visitors', data: [120, 160, 200, 240, 280, 320] },
  ]),
  xy('chart-area-step', 'Area Chart — Step', 'Values that change in steps.', 'Area', 'area', [
    { name: 'Desktop', data: [100, 100, 220, 220, 180, 260] },
  ]),
  xy('chart-area-legend', 'Area Chart — Legend', 'Two series with a legend.', 'Area', 'area', [
    { name: 'Desktop', data: DESKTOP },
    { name: 'Mobile', data: MOBILE },
  ]),
  xy('chart-area-stacked', 'Area Chart — Stacked', 'Series layered as areas.', 'Area', 'area', [
    { name: 'Desktop', data: DESKTOP },
    { name: 'Mobile', data: MOBILE },
  ]),
  xy(
    'chart-area-stacked-expand',
    'Area Chart — Stacked Expanded',
    'Stacked areas filling the height.',
    'Area',
    'area',
    [
      { name: 'Desktop', data: DESKTOP },
      { name: 'Mobile', data: MOBILE },
      { name: 'Tablet', data: [50, 70, 60, 90, 80, 100] },
    ],
  ),
  xy('chart-area-gradient', 'Area Chart — Gradient', 'An area with a soft fill.', 'Area', 'area', [
    { name: 'Desktop', data: DESKTOP },
    { name: 'Mobile', data: MOBILE },
  ]),
  xy('chart-area-axes', 'Area Chart — Axes', 'An area chart with axis ticks.', 'Area', 'area', [
    { name: 'Desktop', data: DESKTOP },
  ]),
  xy(
    'chart-area-icons',
    'Area Chart — Icons',
    'An area chart with labelled series.',
    'Area',
    'area',
    [
      { name: 'Desktop', data: DESKTOP },
      { name: 'Mobile', data: MOBILE },
    ],
  ),
  xy(
    'chart-area-interactive',
    'Area Chart — Interactive',
    'A larger interactive area chart.',
    'Area',
    'area',
    [
      { name: 'Desktop', data: [220, 280, 250, 300, 270, 340, 310, 360] },
      { name: 'Mobile', data: [120, 160, 140, 190, 170, 210, 200, 240] },
    ],
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'],
  ),
];

const BAR: ChartExample[] = [
  xy('chart-bar-default', 'Bar Chart', 'A simple bar chart.', 'Bar', 'bar', [
    { name: 'Desktop', data: DESKTOP },
  ]),
  xy(
    'chart-bar-horizontal',
    'Bar Chart — Horizontal',
    'A bar chart, value per category.',
    'Bar',
    'bar',
    [{ name: 'Visitors', data: [275, 200, 187, 173, 90] }],
    ['Chrome', 'Safari', 'Firefox', 'Edge', 'Other'],
  ),
  xy('chart-bar-multiple', 'Bar Chart — Multiple', 'Two series side by side.', 'Bar', 'bar', [
    { name: 'Desktop', data: DESKTOP },
    { name: 'Mobile', data: MOBILE },
  ]),
  xy('chart-bar-stacked', 'Bar Chart — Stacked', 'Stacked bar segments.', 'Bar', 'bar', [
    { name: 'Desktop', data: DESKTOP },
    { name: 'Mobile', data: MOBILE },
  ]),
  xy('chart-bar-label', 'Bar Chart — Label', 'Bars with value labels.', 'Bar', 'bar', [
    { name: 'Desktop', data: DESKTOP },
  ]),
  xy(
    'chart-bar-label-custom',
    'Bar Chart — Custom Label',
    'Bars with custom labels.',
    'Bar',
    'bar',
    [{ name: 'Desktop', data: DESKTOP }],
  ),
  xy(
    'chart-bar-mixed',
    'Bar Chart — Mixed',
    'Per-category coloured bars.',
    'Bar',
    'bar',
    [{ name: 'Visitors', data: [275, 200, 187, 173, 90] }],
    ['Chrome', 'Safari', 'Firefox', 'Edge', 'Other'],
  ),
  xy('chart-bar-active', 'Bar Chart — Active', 'A bar chart with an active bar.', 'Bar', 'bar', [
    { name: 'Desktop', data: DESKTOP },
  ]),
  xy(
    'chart-bar-negative',
    'Bar Chart — Negative',
    'Bars with positive and negative values.',
    'Bar',
    'bar',
    [{ name: 'Net', data: [40, -30, 60, -20, 50, -10] }],
  ),
  xy(
    'chart-bar-interactive',
    'Bar Chart — Interactive',
    'A larger interactive bar chart.',
    'Bar',
    'bar',
    [
      { name: 'Desktop', data: [220, 280, 250, 300, 270, 340, 310] },
      { name: 'Mobile', data: [120, 160, 140, 190, 170, 210, 200] },
    ],
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  ),
];

const LINE: ChartExample[] = [
  xy('chart-line-default', 'Line Chart', 'A simple line chart.', 'Line', 'line', [
    { name: 'Desktop', data: DESKTOP },
  ]),
  xy('chart-line-linear', 'Line Chart — Linear', 'A steady linear trend.', 'Line', 'line', [
    { name: 'Revenue', data: [50, 90, 140, 180, 240, 300] },
  ]),
  xy('chart-line-step', 'Line Chart — Step', 'A line that changes in steps.', 'Line', 'line', [
    { name: 'Desktop', data: [100, 100, 220, 220, 180, 260] },
  ]),
  xy('chart-line-multiple', 'Line Chart — Multiple', 'Compare two trends.', 'Line', 'line', [
    { name: 'Desktop', data: DESKTOP },
    { name: 'Mobile', data: MOBILE },
  ]),
  xy('chart-line-dots', 'Line Chart — Dots', 'A line with point markers.', 'Line', 'line', [
    { name: 'Desktop', data: DESKTOP },
  ]),
  xy(
    'chart-line-dots-colors',
    'Line Chart — Coloured Dots',
    'A line with coloured points.',
    'Line',
    'line',
    [{ name: 'Desktop', data: DESKTOP }],
  ),
  xy(
    'chart-line-dots-custom',
    'Line Chart — Custom Dots',
    'A line with custom points.',
    'Line',
    'line',
    [{ name: 'Desktop', data: DESKTOP }],
  ),
  xy('chart-line-label', 'Line Chart — Label', 'A line with value labels.', 'Line', 'line', [
    { name: 'Desktop', data: DESKTOP },
  ]),
  xy(
    'chart-line-label-custom',
    'Line Chart — Custom Label',
    'A line with custom labels.',
    'Line',
    'line',
    [{ name: 'Desktop', data: DESKTOP }],
  ),
  xy(
    'chart-line-interactive',
    'Line Chart — Interactive',
    'A larger interactive line chart.',
    'Line',
    'line',
    [
      { name: 'Desktop', data: [220, 280, 250, 300, 270, 340, 310] },
      { name: 'Mobile', data: [120, 160, 140, 190, 170, 210, 200] },
    ],
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  ),
];

export const CHARTS: readonly ChartExample[] = [...AREA, ...BAR, ...LINE];

export const CHART_FAMILIES: readonly ChartFamily[] = [
  'Area',
  'Bar',
  'Line',
  'Tooltip',
  'Pie',
  'Radar',
  'Radial',
];

/** Viewer for /charts/:slug — one chart, full width. */
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
        @if (c.kind === 'xy') {
          <bui-chart
            [type]="$any(c.type)"
            [series]="c.series ?? []"
            [labels]="c.labels ?? []"
            [height]="320"
            [label]="c.title"
          />
        }
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
