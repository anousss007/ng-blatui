import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export interface ChartSeries {
  /** Optional series name (used for legends/identification). */
  name?: string;
  /** Y-axis values plotted in order along the series. */
  data: number[];
  /** Optional explicit stroke/fill colour; falls back to the palette. */
  color?: string;
}

const PALETTE = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#06b6d4'];
const WIDTH = 600;
const PAD = 8;
/** Circumference of the donut ring (2·π·r with r = 40 in the 100×100 viewBox). */
const DONUT_C = 251.33;

/** A lightweight SVG chart (line / area / bar / donut). Pure + SSR-safe. */
@Component({
  selector: 'bui-chart',
  host: { 'data-slot': 'chart', '[class]': 'computedClass()' },
  template: `
    @if (type() === 'donut') {
      <div class="relative mx-auto aspect-square" [style.height.px]="height()">
        <svg
          viewBox="0 0 100 100"
          class="size-full -rotate-90"
          role="img"
          [attr.aria-label]="label()"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            class="stroke-muted"
            [attr.stroke-width]="thickness()"
          />
          @for (seg of donutSegments(); track seg.id) {
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke-linecap="round"
              [attr.stroke]="seg.color"
              [attr.stroke-width]="thickness()"
              [attr.stroke-dasharray]="seg.dash + ' ' + donutC"
              [attr.stroke-dashoffset]="seg.offset"
            />
          }
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center leading-none">
          <ng-content />
        </div>
      </div>
    } @else {
      <svg
        [attr.viewBox]="'0 0 ' + width + ' ' + height()"
        [attr.height]="height()"
        class="w-full"
        role="img"
        [attr.aria-label]="label()"
        preserveAspectRatio="none"
      >
        @if (type() === 'bar') {
          @for (bar of bars(); track bar.id) {
            <rect
              [attr.x]="bar.x"
              [attr.y]="bar.y"
              [attr.width]="bar.w"
              [attr.height]="bar.h"
              [attr.fill]="bar.color"
              rx="3"
            />
          }
        } @else {
          @for (path of paths(); track path.id) {
            @if (type() === 'area') {
              <path [attr.d]="path.area" [attr.fill]="path.color" fill-opacity="0.12" />
            }
            <path
              [attr.d]="path.line"
              fill="none"
              [attr.stroke]="path.color"
              stroke-width="2"
              stroke-linejoin="round"
              stroke-linecap="round"
            />
          }
        }
      </svg>
      @if (labels().length > 0) {
        <div class="mt-1 flex justify-between text-xs text-muted-foreground">
          @for (tick of labels(); track $index) {
            <span>{{ tick }}</span>
          }
        </div>
      }
    }
  `,
})
export class BuiChart {
  /** Chart render style: line, bar, filled area, or a donut ring. */
  readonly type = input<'line' | 'bar' | 'area' | 'donut'>('line');
  /** Series to plot; bar/donut use only the first series. */
  readonly series = input<readonly ChartSeries[]>([]);
  /** X-axis tick labels rendered below the chart. */
  readonly labels = input<readonly string[]>([]);
  /** Chart height in pixels (SVG viewBox height / donut diameter). */
  readonly height = input(220);
  /**
   * Override for the value the chart scales against. For a donut it defines the
   * full ring (e.g. `max=100` with data `[62]` fills 62%); otherwise the max of
   * the series data is used.
   */
  readonly max = input<number | null>(null);
  /** Donut ring thickness, in the 100×100 viewBox units. */
  readonly thickness = input(12);
  /** Accessible label for the chart's `aria-label`. */
  readonly label = input('Chart');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly width = WIDTH;
  protected readonly donutC = DONUT_C;
  private readonly scaleMax = computed(
    () => this.max() ?? Math.max(1, ...this.series().flatMap((s) => s.data)),
  );

  protected readonly bars = computed(() => {
    const series = this.series().at(0);
    if (!series) {
      return [];
    }
    const height = this.height();
    const count = series.data.length;
    const gap = 8;
    const barWidth = (WIDTH - gap * (count + 1)) / Math.max(1, count);
    return series.data.map((value, index) => {
      const barHeight = (value / this.scaleMax()) * (height - PAD * 2);
      return {
        id: index,
        x: gap + index * (barWidth + gap),
        y: height - PAD - barHeight,
        w: barWidth,
        h: barHeight,
        color: series.color ?? PALETTE[0],
      };
    });
  });

  protected readonly paths = computed(() =>
    this.series().map((series, seriesIndex) => {
      const data = series.data;
      const height = this.height();
      const step = data.length > 1 ? (WIDTH - PAD * 2) / (data.length - 1) : 0;
      const points = data.map((value, index) => ({
        x: PAD + index * step,
        y: height - PAD - (value / this.scaleMax()) * (height - PAD * 2),
      }));
      const coords = points
        .map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
        .join(' L');
      const first = points.at(0);
      const last = points.at(-1);
      const area =
        first && last
          ? `M${first.x.toFixed(1)},${height - PAD} L${coords} L${last.x.toFixed(1)},${height - PAD} Z`
          : '';
      return {
        id: seriesIndex,
        color: series.color ?? PALETTE[seriesIndex % PALETTE.length],
        line: coords === '' ? '' : `M${coords}`,
        area,
      };
    }),
  );

  /** Donut arcs: each value in the first series becomes a ring segment. */
  protected readonly donutSegments = computed(() => {
    const series = this.series().at(0);
    if (!series) {
      return [];
    }
    const total = this.scaleMax();
    let accumulated = 0;
    return series.data.map((value, index) => {
      const fraction = Math.max(0, value) / total;
      const segment = {
        id: index,
        dash: (fraction * DONUT_C).toFixed(2),
        offset: (-accumulated * DONUT_C).toFixed(2),
        color: series.color ?? PALETTE[index % PALETTE.length],
      };
      accumulated += fraction;
      return segment;
    });
  });

  protected readonly computedClass = computed(() => cn('block', this.userClass()));
}
