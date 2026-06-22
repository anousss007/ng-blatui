import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** Decorative dotted background layer. Drop inside a `relative` container. */
@Component({
  selector: 'bui-dot-pattern',
  host: {
    'data-slot': 'dot-pattern',
    'aria-hidden': 'true',
    '[class]': 'computedClass()',
    '[style.background-image]': 'bgImage()',
    '[style.background-size]': 'bgSize()',
    '[style.mask-image]': 'maskImage()',
  },
  template: '',
})
export class BuiDotPattern {
  /** Dot radius in pixels. */
  readonly size = input(1);
  /** Spacing between dots in pixels. */
  readonly gap = input(16);
  /** Whether to fade the pattern with a radial mask toward the edges. */
  readonly mask = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly bgImage = computed(
    () => `radial-gradient(currentColor ${this.size()}px, transparent 0)`,
  );
  protected readonly bgSize = computed(() => `${this.gap()}px ${this.gap()}px`);
  protected readonly maskImage = computed(() =>
    this.mask() ? 'radial-gradient(ellipse at center, #000 40%, transparent 75%)' : null,
  );
  protected readonly computedClass = computed(() =>
    cn('pointer-events-none absolute inset-0 block text-foreground/15', this.userClass()),
  );
}
