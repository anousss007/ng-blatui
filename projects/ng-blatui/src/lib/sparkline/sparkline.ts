import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A tiny inline SVG trend chart (line + optional area). Pure, SSR-safe. */
@Component({
  selector: 'bui-sparkline',
  host: { 'data-slot': 'sparkline', '[class]': 'computedClass()' },
  template: `
    <svg
      [attr.viewBox]="'0 0 ' + width() + ' ' + height()"
      [attr.width]="width()"
      [attr.height]="height()"
      [attr.aria-label]="ariaLabel()"
      role="img"
      fill="none"
      preserveAspectRatio="none"
    >
      @if (area() && areaPath()) {
        <path [attr.d]="areaPath()" class="fill-primary/10" />
      }
      @if (linePath()) {
        <path
          [attr.d]="linePath()"
          class="stroke-primary"
          [attr.stroke-width]="strokeWidth()"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
      }
    </svg>
  `,
})
export class BuiSparkline {
  /** Numeric series to plot; needs at least two points to render. */
  readonly data = input<readonly number[]>([]);
  /** SVG width in pixels. */
  readonly width = input(100);
  /** SVG height in pixels. */
  readonly height = input(28);
  /** Whether to draw the translucent area fill under the line. */
  readonly area = input(true);
  /** Line stroke width in pixels (also used as edge padding). */
  readonly strokeWidth = input(1.5);
  /** Accessible label for the sparkline's `aria-label`. */
  readonly ariaLabel = input('Trend');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly coords = computed(() => {
    const values = this.data();
    if (values.length < 2) {
      return [] as { x: number; y: number }[];
    }
    const width = this.width();
    const height = this.height();
    const pad = this.strokeWidth();
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    return values.map((value, index) => ({
      x: pad + (index / (values.length - 1)) * (width - 2 * pad),
      y: pad + (1 - (value - min) / range) * (height - 2 * pad),
    }));
  });
  protected readonly linePath = computed(() => {
    const points = this.coords();
    if (points.length === 0) {
      return '';
    }
    return 'M' + points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' L');
  });
  protected readonly areaPath = computed(() => {
    const points = this.coords();
    if (points.length === 0) {
      return '';
    }
    const first = points.at(0);
    const last = points.at(-1);
    if (!first || !last) {
      return '';
    }
    const baseline = (this.height() - this.strokeWidth()).toFixed(2);
    const line = points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' L');
    return `M${first.x.toFixed(2)},${baseline} L${line} L${last.x.toFixed(2)},${baseline} Z`;
  });
  protected readonly computedClass = computed(() => cn('inline-block', this.userClass()));
}
