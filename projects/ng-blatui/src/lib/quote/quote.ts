import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A styled blockquote / testimonial with optional attribution (author, role, avatar). */
@Component({
  selector: 'bui-quote',
  host: { 'data-slot': 'quote', '[class]': 'computedClass()' },
  template: `
    <svg
      class="mb-3 size-8 text-muted-foreground/25"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M9.5 4C6.46 4 4 6.46 4 9.5c0 3.04 2.46 5.5 5.5 5.5.17 0 .33-.01.5-.03V15c0 2.21-1.79 4-4 4a1 1 0 1 0 0 2c3.31 0 6-2.69 6-6V9.5C12 6.46 9.54 4 9.5 4Zm10 0C16.46 4 14 6.46 14 9.5c0 3.04 2.46 5.5 5.5 5.5.17 0 .33-.01.5-.03V15c0 2.21-1.79 4-4 4a1 1 0 1 0 0 2c3.31 0 6-2.69 6-6V9.5C22 6.46 19.54 4 19.5 4Z"
      />
    </svg>
    <blockquote
      [attr.cite]="cite() || null"
      class="text-lg leading-relaxed font-medium text-balance sm:text-xl"
    >
      <ng-content />
    </blockquote>
    @if (author() || role() || avatar()) {
      <figcaption class="mt-5 flex items-center gap-3">
        @if (avatar()) {
          <img
            [src]="avatar()"
            [alt]="author()"
            loading="lazy"
            class="size-10 shrink-0 rounded-full object-cover"
          />
        }
        <div class="text-sm">
          @if (author()) {
            <div class="font-semibold">{{ author() }}</div>
          }
          @if (role()) {
            <div class="text-muted-foreground">{{ role() }}</div>
          }
        </div>
      </figcaption>
    }
  `,
})
export class BuiQuote {
  /** Name of the person credited in the attribution. */
  readonly author = input('');
  /** Role or title shown beneath the author. */
  readonly role = input('');
  /** URL of the author's avatar image. */
  readonly avatar = input('');
  /** Source URL for the quote, set as the blockquote's `cite` attribute. */
  readonly cite = input('');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('relative block max-w-2xl text-foreground', this.userClass()),
  );
}
