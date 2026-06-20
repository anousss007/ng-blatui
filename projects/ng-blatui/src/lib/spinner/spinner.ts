import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A spinning loading indicator (`role="status"`). */
@Component({
  selector: 'bui-spinner',
  host: {
    'data-slot': 'spinner',
    role: 'status',
    'aria-label': 'Loading',
    '[class]': 'computedClass()',
  },
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      class="size-full"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  `,
})
export class BuiSpinner {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('inline-block size-4 animate-spin', this.userClass()),
  );
}
