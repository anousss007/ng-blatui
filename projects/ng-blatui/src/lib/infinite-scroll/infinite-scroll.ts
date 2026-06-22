import {
  afterNextRender,
  Component,
  computed,
  type ElementRef,
  input,
  type OnDestroy,
  output,
  viewChild,
} from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/**
 * Emits `more` when a sentinel scrolls into view (IntersectionObserver) or the fallback
 * "Load more" button is pressed. Drive `loading` / `finished` from the consumer. SSR-safe.
 */
@Component({
  selector: 'bui-infinite-scroll',
  host: {
    'data-slot': 'infinite-scroll',
    '[class]': 'computedClass()',
    '[attr.aria-busy]': 'loading()',
  },
  template: `
    <ng-content />
    @if (loading()) {
      <div
        role="status"
        aria-live="polite"
        class="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground"
      >
        <svg
          class="size-4 animate-spin"
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
        Loading…
      </div>
    } @else if (finished()) {
      <div role="status" class="py-4 text-center text-xs text-muted-foreground">
        You have reached the end.
      </div>
    } @else {
      <button
        type="button"
        class="mx-auto my-4 block rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent"
        (click)="emitMore()"
      >
        Load more
      </button>
    }
    <div #sentinel aria-hidden="true" class="h-px w-full"></div>
  `,
})
export class BuiInfiniteScroll implements OnDestroy {
  /** Whether a load is in progress; shows the spinner and suppresses new emits. */
  readonly loading = input(false);
  /** Whether all items are loaded; shows the end message and suppresses emits. */
  readonly finished = input(false);
  /** Pixel margin below the viewport at which the sentinel triggers loading. */
  readonly threshold = input(200);
  /** Emits when the sentinel scrolls into view or the fallback button is pressed. */
  readonly more = output();
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly sentinel = viewChild<ElementRef<HTMLElement>>('sentinel');
  private observer: IntersectionObserver | undefined;
  protected readonly computedClass = computed(() => cn('block', this.userClass()));

  constructor() {
    afterNextRender(() => {
      this.observe();
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  protected emitMore(): void {
    if (!this.loading() && !this.finished()) {
      this.more.emit();
    }
  }

  private observe(): void {
    const element = this.sentinel()?.nativeElement;
    if (!element) {
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.emitMore();
          }
        }
      },
      { rootMargin: `0px 0px ${this.threshold()}px 0px` },
    );
    this.observer.observe(element);
  }
}
