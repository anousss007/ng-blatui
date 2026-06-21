import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/**
 * BlatUI linear progress bar. Exposes the full `progressbar` ARIA contract
 * (valuemin/max/now/text). Set `[indeterminate]="true"` for an unknown-duration bar.
 */
@Component({
  selector: 'bui-progress',
  host: {
    'data-slot': 'progress',
    role: 'progressbar',
    'aria-valuemin': '0',
    'aria-valuemax': '100',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-valuenow]': 'indeterminate() ? null : rounded()',
    '[attr.aria-valuetext]': 'indeterminate() ? null : valueText()',
    '[class]': 'computedClass()',
  },
  template: `
    @if (circular()) {
      <svg
        [attr.width]="size()"
        [attr.height]="size()"
        [attr.viewBox]="'0 0 ' + size() + ' ' + size()"
        class="-rotate-90"
        aria-hidden="true"
      >
        <circle
          [attr.cx]="size() / 2"
          [attr.cy]="size() / 2"
          [attr.r]="radius()"
          [attr.stroke-width]="thickness()"
          fill="none"
          class="stroke-primary/20"
        />
        <circle
          data-slot="progress-indicator"
          [attr.cx]="size() / 2"
          [attr.cy]="size() / 2"
          [attr.r]="radius()"
          [attr.stroke-width]="thickness()"
          [attr.stroke-dasharray]="circumference()"
          [attr.stroke-dashoffset]="dashOffset()"
          fill="none"
          stroke-linecap="round"
          class="stroke-primary transition-all"
        />
      </svg>
    } @else if (indeterminate()) {
      <span
        data-slot="progress-indicator"
        class="absolute inset-y-0 w-2/5 animate-progress-indeterminate rounded-full bg-primary"
      ></span>
    } @else {
      <span
        data-slot="progress-indicator"
        class="block h-full w-full rounded-full bg-primary transition-all"
        [style.transform]="indicatorTransform()"
      ></span>
    }
  `,
})
export class BuiProgress {
  readonly value = input(0);
  readonly indeterminate = input(false);
  /** Render a circular ring instead of a linear bar. */
  readonly circular = input(false);
  /** Diameter of the circular ring, in pixels. */
  readonly size = input(40);
  /** Stroke width of the circular ring, in pixels. */
  readonly thickness = input(4);
  readonly ariaLabel = input('Progress');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly pct = computed(() => Math.max(0, Math.min(100, this.value())));
  protected readonly rounded = computed(() => Math.round(this.pct()));
  protected readonly valueText = computed(() => `${this.rounded()}%`);
  protected readonly indicatorTransform = computed(() => `translateX(-${100 - this.pct()}%)`);
  protected readonly radius = computed(() => (this.size() - this.thickness()) / 2);
  protected readonly circumference = computed(() => 2 * Math.PI * this.radius());
  protected readonly dashOffset = computed(() => this.circumference() * (1 - this.pct() / 100));
  protected readonly computedClass = computed(() =>
    cn(
      this.circular()
        ? 'inline-block'
        : 'relative block h-2 w-full overflow-hidden rounded-full bg-primary/20',
      this.userClass(),
    ),
  );
}
