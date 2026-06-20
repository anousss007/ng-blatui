import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A veil with a spinner shown over its projected content while `show` is true. */
@Component({
  selector: 'bui-loading-overlay',
  host: {
    'data-slot': 'loading-overlay',
    '[class]': 'computedClass()',
    '[attr.aria-busy]': 'show()',
  },
  template: `
    <ng-content />
    @if (show()) {
      <div
        role="status"
        aria-live="polite"
        class="absolute inset-0 z-10 grid place-items-center bg-background/70"
        [class.backdrop-blur-sm]="blur()"
      >
        <div class="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <svg
            class="size-6 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <span>{{ message() || 'Loading…' }}</span>
        </div>
      </div>
    }
  `,
})
export class BuiLoadingOverlay {
  readonly show = input(false);
  readonly message = input('');
  readonly blur = input(true);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn('relative block', this.userClass()));
}
