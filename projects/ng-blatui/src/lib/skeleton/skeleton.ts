import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/**
 * BlatUI skeleton placeholder. Marked `aria-hidden` so assistive tech ignores the
 * shimmering placeholder; announce real loading state separately (e.g. aria-busy).
 */
@Directive({
  selector: '[buiSkeleton]',
  host: {
    'data-slot': 'skeleton',
    'aria-hidden': 'true',
    '[class]': 'computedClass()',
  },
})
export class BuiSkeleton {
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn('animate-pulse rounded-md bg-accent', this.userClass()),
  );
}
