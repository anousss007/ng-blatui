import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const SIZES = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  prose: 'max-w-prose',
  full: 'max-w-full',
} as const;

/** Centered, padded page container with a max-width scale. */
@Directive({
  selector: '[buiContainer]',
  host: { 'data-slot': 'container', '[class]': 'computedClass()' },
})
export class BuiContainer {
  readonly size = input<keyof typeof SIZES>('lg');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('mx-auto w-full px-4 sm:px-6 lg:px-8', SIZES[this.size()], this.userClass()),
  );
}
