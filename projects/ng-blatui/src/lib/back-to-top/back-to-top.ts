import { afterNextRender, Component, computed, input, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const VARIANTS = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  subtle: 'bg-card text-foreground hover:bg-accent hover:text-accent-foreground border',
} as const;

/**
 * A floating "scroll to top" button that reveals itself once the page scrolls past
 * `threshold` px. SSR-safe — the scroll position is only read in the browser.
 */
@Component({
  selector: 'bui-back-to-top',
  host: {
    'data-slot': 'back-to-top',
    '[hidden]': '!shown()',
    '[class]': 'computedClass()',
    '(window:scroll)': 'onScroll()',
  },
  template: `
    <button
      type="button"
      aria-label="Back to top"
      class="inline-flex size-10 items-center justify-center rounded-full shadow-md transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      [class]="variantClass()"
      (click)="toTop()"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="size-5"
      >
        <path d="m5 12 7-7 7 7" />
        <path d="M12 19V5" />
      </svg>
    </button>
  `,
})
export class BuiBackToTop {
  readonly threshold = input(300);
  readonly variant = input<keyof typeof VARIANTS>('primary');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly shown = signal(false);
  protected readonly variantClass = computed(() => VARIANTS[this.variant()]);
  protected readonly computedClass = computed(() =>
    cn('fixed end-6 bottom-6 z-40 block', this.userClass()),
  );

  constructor() {
    afterNextRender(() => {
      this.onScroll();
    });
  }

  protected onScroll(): void {
    this.shown.set(globalThis.scrollY > this.threshold());
  }

  protected toTop(): void {
    globalThis.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
