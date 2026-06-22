import { afterNextRender, Component, computed, input, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/**
 * Animates a number counting up to its target on first render. The animated digits are
 * `aria-hidden`; an sr-only span carries the final value (SSR/no-JS read the real number).
 */
@Component({
  selector: 'bui-number-ticker',
  host: { 'data-slot': 'number-ticker', '[class]': 'computedClass()' },
  template: `
    <span aria-hidden="true">{{ format(current()) }}</span>
    <span class="sr-only">{{ format(value()) }}</span>
  `,
})
export class BuiNumberTicker {
  /** Target value to count up to. */
  readonly value = input(0);
  /** Starting value the animation counts from. */
  readonly from = input(0);
  /** Animation length in milliseconds; 0 snaps instantly. */
  readonly duration = input(1500);
  /** Number of decimal places to display. */
  readonly decimals = input(0);
  /** Text prepended before the number. */
  readonly prefix = input('');
  /** Text appended after the number. */
  readonly suffix = input('');
  /** Thousands-group separator character. */
  readonly separator = input(',');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly current = signal(0);
  protected readonly computedClass = computed(() => cn('tabular-nums', this.userClass()));

  constructor() {
    afterNextRender(() => {
      this.animate();
    });
  }

  protected format(value: number): string {
    const fixed = value.toFixed(Math.max(0, this.decimals()));
    const [integer, decimal] = fixed.split('.');
    const decimalPart = decimal ? `.${decimal}` : '';
    return this.prefix() + this.group(integer) + decimalPart + this.suffix();
  }

  private group(value: string): string {
    return value.length <= 3
      ? value
      : this.group(value.slice(0, -3)) + this.separator() + value.slice(-3);
  }

  private animate(): void {
    const start = this.from();
    const end = this.value();
    const duration = this.duration();
    if (duration <= 0) {
      this.current.set(end);
      return;
    }
    this.current.set(start);
    const startTime = performance.now();
    const step = (time: number): void => {
      const progress = Math.min(1, (time - startTime) / duration);
      this.current.set(start + (end - start) * progress);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }
}
