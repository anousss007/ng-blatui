import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export interface ChartSeries {
  name?: string;
  data: number[];
  color?: string;
}

const PALETTE = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#06b6d4'];
const WIDTH = 600;
const PAD = 8;

/** A lightweight SVG chart (line / area / bar). Pure + SSR-safe. */
@Component({
  selector: 'bui-chart',
  host: { 'data-slot': 'chart', '[class]': 'computedClass()' },
  template: `
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
  `,
})
export class BuiChart {
  readonly type = input<'line' | 'bar' | 'area'>('line');
  readonly series = input<readonly ChartSeries[]>([]);
  readonly labels = input<readonly string[]>([]);
  readonly height = input(220);
  readonly label = input('Chart');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly width = WIDTH;
  private readonly max = computed(() => Math.max(1, ...this.series().flatMap((s) => s.data)));
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
      const barHeight = (value / this.max()) * (height - PAD * 2);
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
        y: height - PAD - (value / this.max()) * (height - PAD * 2),
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
  protected readonly computedClass = computed(() => cn('block', this.userClass()));
}
