import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const TONES = {
  good: 'bg-emerald-600',
  warning: 'bg-amber-500',
  danger: 'bg-destructive',
  default: 'bg-primary',
} as const;

/** A labelled meter (`role="meter"`) for a measurement within a known range. */
@Component({
  selector: 'bui-meter',
  host: { 'data-slot': 'meter', '[class]': 'computedClass()' },
  template: `
    @if (label() || showValue()) {
      <div class="flex items-center justify-between gap-2 text-sm">
        @if (label()) {
          <span class="font-medium text-foreground">{{ label() }}</span>
        } @else {
          <span aria-hidden="true"></span>
        }
        @if (showValue()) {
          <span class="text-muted-foreground tabular-nums">{{ valueText() }}</span>
        }
      </div>
    }
    <div
      role="meter"
      [attr.aria-label]="label() ?? 'Meter'"
      [attr.aria-valuenow]="clamped()"
      [attr.aria-valuemin]="min()"
      [attr.aria-valuemax]="max()"
      [attr.aria-valuetext]="valueText()"
      class="relative h-2 w-full overflow-hidden rounded-full bg-muted"
    >
      <div
        class="absolute inset-y-0 start-0 rounded-full transition-[width] duration-500 ease-out"
        [class]="fillClass()"
        [style.width.%]="pct()"
      ></div>
    </div>
  `,
})
export class BuiMeter {
  readonly value = input(0);
  readonly min = input(0);
  readonly max = input(100);
  readonly label = input<string | null>(null);
  readonly tone = input<keyof typeof TONES>('default');
  readonly showValue = input(true);
  readonly unit = input('%');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly clamped = computed(() =>
    Math.max(this.min(), Math.min(this.max(), this.value())),
  );
  protected readonly pct = computed(() => {
    const range = this.max() - this.min() || 1;
    return ((this.clamped() - this.min()) / range) * 100;
  });
  protected readonly valueText = computed(() => `${this.value()}${this.unit()}`);
  protected readonly fillClass = computed(() => TONES[this.tone()]);
  protected readonly computedClass = computed(() => cn('grid w-full gap-1.5', this.userClass()));
}
