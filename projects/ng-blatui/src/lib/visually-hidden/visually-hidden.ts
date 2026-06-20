import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** Visually hides content while keeping it available to assistive tech (sr-only). */
@Directive({
  selector: '[buiVisuallyHidden]',
  host: { 'data-slot': 'visually-hidden', '[class]': 'computedClass()' },
})
export class BuiVisuallyHidden {
  readonly focusable = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'sr-only',
      this.focusable() &&
        'focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-md',
      this.userClass(),
    ),
  );
}
