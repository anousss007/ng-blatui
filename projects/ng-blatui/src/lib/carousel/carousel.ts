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

export type CarouselOrientation = 'horizontal' | 'vertical';

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
    <div [class]="viewportClass()">
      <div
        #track
        [class]="trackClass()"
        [style.--bui-per]="perView()"
        [style.transform]="trackTransform()"
      >
        <ng-content />
      </div>
    </div>
    <button
      type="button"
      [class]="prevClass()"
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
        <path [attr.d]="vertical() ? 'm18 15-6-6-6 6' : 'm15 18-6-6 6-6'" />
      </svg>
    </button>
    <button
      type="button"
      [class]="nextClass()"
      [disabled]="index() >= maxIndex()"
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
        <path [attr.d]="vertical() ? 'm6 9 6 6 6-6' : 'm9 18 6-6-6-6'" />
      </svg>
    </button>
    @if (maxIndex() > 0) {
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
  readonly orientation = input<CarouselOrientation>('horizontal');
  /** Slides visible at once (e.g. 2 or 3 for a multi-item carousel). */
  readonly perView = input(1);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly track = viewChild<ElementRef<HTMLElement>>('track');
  protected readonly count = signal(0);
  protected readonly vertical = computed(() => this.orientation() === 'vertical');
  protected readonly maxIndex = computed(() => Math.max(0, this.count() - this.perView()));
  protected readonly dots = computed(() =>
    Array.from({ length: this.maxIndex() + 1 }, (_, index) => index),
  );
  protected readonly computedClass = computed(() => cn('relative block', this.userClass()));
  protected readonly viewportClass = computed(() =>
    cn('overflow-hidden rounded-lg', this.vertical() && 'h-full'),
  );
  protected readonly trackClass = computed(() =>
    cn(
      'flex transition-transform duration-300 [&>*]:shrink-0 [&>*]:grow-0',
      this.vertical()
        ? 'h-full flex-col [&>*]:h-[calc(100%/var(--bui-per,1))] [&>*]:w-full'
        : '[&>*]:w-[calc(100%/var(--bui-per,1))]',
    ),
  );
  protected readonly trackTransform = computed(() => {
    const offset = this.index() * (100 / this.perView());
    return this.vertical() ? `translateY(-${offset}%)` : `translateX(-${offset}%)`;
  });
  protected readonly prevClass = computed(() =>
    cn(
      'absolute inline-flex size-8 items-center justify-center rounded-full border bg-background shadow-sm disabled:opacity-40',
      this.vertical() ? 'top-2 left-1/2 -translate-x-1/2' : 'start-2 top-1/2 -translate-y-1/2',
    ),
  );
  protected readonly nextClass = computed(() =>
    cn(
      'absolute inline-flex size-8 items-center justify-center rounded-full border bg-background shadow-sm disabled:opacity-40',
      this.vertical() ? 'bottom-2 left-1/2 -translate-x-1/2' : 'end-2 top-1/2 -translate-y-1/2',
    ),
  );

  constructor() {
    afterNextRender(() => {
      this.count.set(this.track()?.nativeElement.children.length ?? 0);
    });
  }

  protected prev(): void {
    this.index.set(Math.max(0, this.index() - 1));
  }

  protected next(): void {
    this.index.set(Math.min(this.maxIndex(), this.index() + 1));
  }
}
