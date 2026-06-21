import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BuiChart } from 'ng-blatui';

import { PieChart, RadarChart, RadialChart } from './chart-svg';
import { CHART_FAMILIES, type ChartExample, CHARTS } from './charts';

/** Gallery index for /charts — a grid of chart previews, grouped by family, like BlatUI. */
@Component({
  selector: 'app-charts-index',
  imports: [RouterLink, BuiChart, PieChart, RadialChart, RadarChart],
  template: `
    <div class="space-y-3">
      <h1 class="text-4xl font-bold tracking-tight">Charts</h1>
      <p class="text-lg text-muted-foreground">
        {{ all.length }} ready-to-use charts — open any to see it full size with its data.
      </p>
    </div>

    @for (group of groups; track group.label) {
      <section class="mt-10">
        <h2 class="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {{ group.label }}
        </h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (chart of group.items; track chart.slug) {
            <a
              [routerLink]="['/charts', chart.slug]"
              class="group block overflow-hidden rounded-xl border bg-card p-4 transition-colors hover:border-ring"
            >
              @switch (chart.kind) {
                @case ('xy') {
                  <bui-chart
                    [type]="$any(chart.type)"
                    [series]="chart.series ?? []"
                    [labels]="chart.labels ?? []"
                    [height]="120"
                    [label]="chart.title"
                  />
                }
                @case ('pie') {
                  <app-pie-chart
                    [slices]="chart.slices ?? []"
                    [donut]="chart.slug.includes('donut')"
                    [showLegend]="false"
                    [label]="chart.title"
                  />
                }
                @case ('radial') {
                  <app-radial-chart
                    [slices]="chart.slices ?? []"
                    [showLegend]="false"
                    [label]="chart.title"
                  />
                }
                @case ('radar') {
                  <app-radar-chart
                    [axes]="chart.axes ?? []"
                    [series]="chart.radar ?? []"
                    [showLegend]="false"
                    [label]="chart.title"
                  />
                }
              }
              <div class="mt-3">
                <p class="text-sm font-medium">{{ chart.title }}</p>
                <p class="text-xs text-muted-foreground">{{ chart.description }}</p>
              </div>
            </a>
          }
        </div>
      </section>
    }
  `,
})
export class ChartsIndex {
  protected readonly all = CHARTS;
  protected readonly groups: readonly { label: string; items: ChartExample[] }[] =
    CHART_FAMILIES.map((label) => ({
      label,
      items: CHARTS.filter((c) => c.family === label),
    })).filter((g) => g.items.length > 0);
}
