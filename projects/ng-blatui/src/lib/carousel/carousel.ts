import {
  afterNextRender,
  Component,
  computed,
  type ElementRef,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A slide carousel. Project slides as direct children; arrows + dots navigate. SSR-safe. */
@Component({
  selector: 'bui-carousel',
  host: {
    'data-slot': 'carousel',
    role: 'region',
    'aria-roledescription': 'carousel',
    '[class]': 'computedClass()',
  },
  template: `
    <div class="overflow-hidden rounded-lg">
      <div
        #track
        class="flex transition-transform duration-300 [&>*]:w-full [&>*]:shrink-0 [&>*]:grow-0"
        [style.transform]="'translateX(-' + index() * 100 + '%)'"
      >
        <ng-content />
      </div>
    </div>
    <button
      type="button"
      class="absolute start-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full border bg-background shadow-sm disabled:opacity-40"
      [disabled]="index() === 0"
      aria-label="Previous slide"
      (click)="prev()"
    >
      <svg
        class="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
    </button>
    <button
      type="button"
      class="absolute end-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full border bg-background shadow-sm disabled:opacity-40"
      [disabled]="index() >= count() - 1"
      aria-label="Next slide"
      (click)="next()"
    >
      <svg
        class="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </button>
    @if (count() > 1) {
      <div class="mt-3 flex justify-center gap-1.5">
        @for (dot of dots(); track dot) {
          <button
            type="button"
            class="size-2 rounded-full transition-colors"
            [class]="dot === index() ? 'bg-primary' : 'bg-muted'"
            [attr.aria-label]="'Go to slide ' + (dot + 1)"
            [attr.aria-current]="dot === index() ? 'true' : null"
            (click)="index.set(dot)"
          ></button>
        }
      </div>
    }
  `,
})
export class BuiCarousel {
  readonly index = model(0);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly track = viewChild<ElementRef<HTMLElement>>('track');
  protected readonly count = signal(0);
  protected readonly dots = computed(() =>
    Array.from({ length: this.count() }, (_, index) => index),
  );
  protected readonly computedClass = computed(() => cn('relative block', this.userClass()));

  constructor() {
    afterNextRender(() => {
      this.count.set(this.track()?.nativeElement.children.length ?? 0);
    });
  }

  protected prev(): void {
    this.index.set(Math.max(0, this.index() - 1));
  }

  protected next(): void {
    this.index.set(Math.min(this.count() - 1, this.index() + 1));
  }
}
