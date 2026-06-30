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
    } @else if (type() === 'gauge') {
      <div class="relative mx-auto w-full" [style.maxWidth.px]="height() * 1.9">
        <svg viewBox="0 0 100 56" class="w-full" role="img" [attr.aria-label]="label()">
          <path
            d="M10,50 A40,40 0 0 1 90,50"
            fill="none"
            class="stroke-muted"
            stroke-linecap="round"
            [attr.stroke-width]="thickness()"
          />
          <path
            d="M10,50 A40,40 0 0 1 90,50"
            fill="none"
            stroke-linecap="round"
            [attr.stroke]="gauge().color"
            [attr.stroke-width]="thickness()"
            [attr.stroke-dasharray]="gauge().dash + ' ' + gauge().gap"
          />
        </svg>
        <div class="absolute inset-x-0 bottom-0 flex flex-col items-center leading-none">
          <ng-content />
        </div>
      </div>
    } @else if (type() === 'bar' && grouped()) {
      <div
        class="flex items-end gap-2"
        [style.height.px]="height()"
        role="img"
        [attr.aria-label]="label()"
      >
        @for (group of barGroups(); track group.id) {
          <div class="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <div class="flex w-full flex-1 items-end justify-center gap-1">
              @for (sub of group.bars; track sub.id) {
                <div
                  class="min-h-1 w-2 max-w-3 rounded-t-[4px] rounded-b-[2px] transition-[height]"
                  [style.height.%]="sub.pct"
                  [style.background]="sub.fill"
                ></div>
              }
            </div>
            @if (group.label) {
              <span class="text-xs text-muted-foreground">{{ group.label }}</span>
            }
          </div>
        }
      </div>
    } @else if (type() === 'bar') {
      <div
        class="flex items-end gap-1"
        [style.height.px]="height()"
        role="img"
        [attr.aria-label]="label()"
      >
        @for (bar of barColumns(); track bar.id) {
          <div class="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <div class="relative flex w-full flex-1 items-end justify-center">
              @if (track()) {
                <div class="absolute inset-y-0 w-[70%] max-w-9 rounded-[6px] bg-muted"></div>
              }
              <div
                class="relative flex min-h-1 w-[70%] max-w-9 flex-col-reverse overflow-hidden rounded-t-[10px] rounded-b-[4px] transition-[height]"
                [style.height.%]="bar.pct"
              >
                @for (seg of bar.segments; track seg.id) {
                  <div [style.height.%]="seg.share" [style.background]="seg.fill"></div>
                }
                @if (bar.value) {
                  <span
                    class="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-semibold whitespace-nowrap text-foreground"
                    >{{ bar.value }}</span
                  >
                }
              </div>
            </div>
            @if (bar.label) {
              <span class="text-xs text-muted-foreground">{{ bar.label }}</span>
            }
          </div>
        }
      </div>
    } @else {
      <div class="relative w-full" [style.height.px]="height()">
        <svg
          [attr.viewBox]="'0 0 ' + width + ' ' + height()"
          [attr.height]="height()"
          class="w-full"
          role="img"
          [attr.aria-label]="label()"
          preserveAspectRatio="none"
        >
          @for (x of gridLines(); track x) {
            <line
              [attr.x1]="x"
              y1="2"
              [attr.x2]="x"
              [attr.y2]="height() - 2"
              class="stroke-border"
              stroke-width="1"
              stroke-dasharray="2 3"
              vector-effect="non-scaling-stroke"
            />
          }
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
        </svg>
        @for (dot of lineDots(); track dot.id) {
          <span
            class="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-background"
            [style.left.%]="dot.x"
            [style.top.%]="dot.y"
            [style.border-color]="dot.color"
          ></span>
        }
      </div>
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
  /** Chart render style: line, bar, filled area, a donut ring, or a half-ring gauge. */
  readonly type = input<'line' | 'bar' | 'area' | 'donut' | 'gauge'>('line');
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
  /**
   * Index of the highlighted bar (bar charts). When set, the active bar renders
   * solid and the rest are tinted; when `null` every bar renders solid.
   */
  readonly activeIndex = input<number | null>(null);
  /** Value text shown above each bar (bar charts); pass one entry per data point. */
  readonly barLabels = input<readonly string[]>([]);
  /** Stack every series into one bar per data point, bottom-to-top (bar charts). */
  readonly stacked = input(false);
  /** Render every series side-by-side within each data slot (grouped bar charts). */
  readonly grouped = input(false);
  /** Per-bar fill colors (bar charts); index-aligned with the first series' data. Overrides the series color. */
  readonly barColors = input<readonly string[]>([]);
  /** Draw a faint full-height track behind each bar (bar charts). */
  readonly track = input(false);
  /** Render a dot marker at each data point (line/area charts). */
  readonly dots = input(false);
  /** Number of evenly-spaced vertical grid lines (line/area charts; 0 hides them). */
  readonly gridX = input(0);
  /** Accessible label for the chart's `aria-label`. */
  readonly label = input('Chart');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly width = WIDTH;
  protected readonly donutC = DONUT_C;
  private readonly scaleMax = computed(
    () => this.max() ?? Math.max(1, ...this.series().flatMap((s) => s.data)),
  );

  /**
   * HTML bar columns. Each column has an overall height (`pct`, scaled against the
   * max) plus one or more stacked `segments` (a single segment in the common case,
   * several when `stacked`). Inactive bars are tinted when `activeIndex` is set.
   */
  protected readonly barColumns = computed(() => {
    const seriesList = this.series();
    const first = seriesList.at(0);
    if (!first || first.data.length === 0) {
      return [];
    }
    const axisLabels = this.labels();
    const count = first.data.length;

    if (this.stacked() && seriesList.length > 1) {
      const totals = Array.from({ length: count }, (_, index) =>
        seriesList.reduce((sum, s) => sum + Math.max(0, s.data[index] ?? 0), 0),
      );
      const max = this.max() ?? Math.max(1, ...totals);
      return Array.from({ length: count }, (_, index) => ({
        id: index,
        pct: (totals[index] / max) * 100,
        segments: seriesList
          .map((s, si) => ({
            id: si,
            share: totals[index] > 0 ? (Math.max(0, s.data[index] ?? 0) / totals[index]) * 100 : 0,
            fill: s.color ?? PALETTE[si % PALETTE.length],
          }))
          .filter((seg) => seg.share > 0),
        value: '',
        label: axisLabels[index] ?? '',
      }));
    }

    const total = this.scaleMax();
    const active = this.activeIndex();
    const valueLabels = this.barLabels();
    const perBar = this.barColors();
    const color = first.color ?? PALETTE[0];
    return first.data.map((value, index) => {
      const base = perBar[index] ?? color;
      const isDimmed = active !== null && active !== index;
      const fill = isDimmed ? `color-mix(in oklab, ${base} 20%, transparent)` : base;
      return {
        id: index,
        pct: Math.max(0, (Math.max(0, value) / total) * 100),
        segments: [{ id: 0, share: 100, fill }],
        value: valueLabels[index] ?? '',
        label: axisLabels[index] ?? '',
      };
    });
  });

  /** Grouped bars: one slot per data point, each holding a side-by-side sub-bar per series. */
  protected readonly barGroups = computed(() => {
    const seriesList = this.series();
    const first = seriesList.at(0);
    if (!first || first.data.length === 0) {
      return [];
    }
    const axisLabels = this.labels();
    const total = this.scaleMax();
    return first.data.map((_, index) => ({
      id: index,
      label: axisLabels[index] ?? '',
      bars: seriesList.map((s, si) => ({
        id: si,
        pct: Math.max(0, (Math.max(0, s.data[index] ?? 0) / total) * 100),
        fill: s.color ?? PALETTE[si % PALETTE.length],
      })),
    }));
  });

  /** Half-ring gauge geometry: a 180° arc filled to the first value's share of `max`. */
  protected readonly gauge = computed(() => {
    const value = this.series().at(0)?.data.at(0) ?? 0;
    const total = this.max() ?? 100;
    const fraction = Math.min(1, Math.max(0, value / total));
    // Semicircle path length for r=40 in the 100×60 viewBox (π·r).
    const arc = Math.PI * 40;
    return {
      dash: (fraction * arc).toFixed(2),
      gap: arc.toFixed(2),
      color: this.series().at(0)?.color,
    };
  });

  /** Dot markers (line/area) as viewBox-relative percentages, immune to the non-uniform SVG scale. */
  protected readonly lineDots = computed(() => {
    const series = this.series().at(0);
    if (!series || !this.dots()) {
      return [];
    }
    const height = this.height();
    const data = series.data;
    const step = data.length > 1 ? (WIDTH - PAD * 2) / (data.length - 1) : 0;
    const color = series.color ?? PALETTE[0];
    return data.map((value, index) => ({
      id: index,
      x: ((PAD + index * step) / WIDTH) * 100,
      y: ((height - PAD - (value / this.scaleMax()) * (height - PAD * 2)) / height) * 100,
      color,
    }));
  });

  /** Evenly-spaced vertical grid line x-positions (in viewBox units). */
  protected readonly gridLines = computed(() => {
    const n = this.gridX();
    if (n <= 0) {
      return [];
    }
    const span = WIDTH - PAD * 2;
    return Array.from({ length: n }, (_, index) => PAD + ((index + 1) / (n + 1)) * span);
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
