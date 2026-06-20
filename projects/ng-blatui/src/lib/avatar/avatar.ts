import { Component, computed, input, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/**
 * BlatUI avatar. Renders the image when `src` is set and loads; otherwise shows
 * the projected fallback (initials, icon). Falls back automatically on load error.
 */
@Component({
  selector: 'bui-avatar',
  host: {
    'data-slot': 'avatar',
    '[class]': 'computedClass()',
  },
  template: `
    @if (src() && !error()) {
      <img
        data-slot="avatar-image"
        class="aspect-square size-full"
        [src]="src()"
        [alt]="alt()"
        (error)="error.set(true)"
      />
    } @else {
      <span
        data-slot="avatar-fallback"
        class="flex size-full items-center justify-center rounded-full bg-muted text-sm"
      >
        <ng-content />
      </span>
    }
  `,
})
export class BuiAvatar {
  readonly src = input<string | null>(null);
  readonly alt = input('');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly error = signal(false);
  protected readonly computedClass = computed(() =>
    cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', this.userClass()),
  );
}
