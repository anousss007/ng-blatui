import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** Decorative grid background layer. Drop inside a `relative` container. */
@Component({
  selector: 'bui-grid-pattern',
  host: {
    'data-slot': 'grid-pattern',
    'aria-hidden': 'true',
    '[class]': 'computedClass()',
    '[style.background-image]': 'bgImage()',
    '[style.background-size]': 'bgSize()',
    '[style.mask-image]': 'maskImage()',
  },
  template: '',
})
export class BuiGridPattern {
  readonly gap = input(24);
  readonly lineWidth = input(1);
  readonly mask = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly bgImage = computed(() => {
    const width = this.lineWidth();
    return `linear-gradient(to right, currentColor ${width}px, transparent ${width}px), linear-gradient(to bottom, currentColor ${width}px, transparent ${width}px)`;
  });
  protected readonly bgSize = computed(() => `${this.gap()}px ${this.gap()}px`);
  protected readonly maskImage = computed(() =>
    this.mask() ? 'radial-gradient(ellipse at center, #000 0%, transparent 75%)' : null,
  );
  protected readonly computedClass = computed(() =>
    cn('pointer-events-none absolute inset-0 block text-foreground/10', this.userClass()),
  );
}
