import { Component, computed, input, model, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const STAR_SIZE = { sm: 'size-4', default: 'size-5', lg: 'size-6' } as const;

/** A star rating (`role="radiogroup"`) with hover preview and keyboard support. */
@Component({
  selector: 'bui-rating',
  host: {
    'data-slot': 'rating',
    role: 'radiogroup',
    '[attr.aria-label]': 'ariaLabel()',
    '[class]': 'computedClass()',
    '(mouseleave)': 'hover.set(0)',
    '(keydown)': 'onKeydown($event)',
  },
  template: `
    @for (star of stars(); track star) {
      <button
        type="button"
        role="radio"
        [attr.aria-checked]="value() === star"
        [attr.aria-label]="star + ' / ' + max()"
        [attr.tabindex]="tabindexFor(star)"
        [disabled]="readonly()"
        class="rounded-sm transition-colors outline-none not-disabled:cursor-pointer focus-visible:ring-[3px] focus-visible:ring-ring/50"
        [class]="current() >= star ? color() : 'text-muted-foreground/30'"
        (click)="set(star)"
        (mouseenter)="onHover(star)"
        (focus)="onHover(star)"
      >
        <svg
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          [class]="sizeClass()"
          [attr.fill]="current() >= star ? 'currentColor' : 'none'"
        >
          <polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          />
        </svg>
      </button>
    }
  `,
})
export class BuiRating {
  readonly value = model(0);
  readonly max = input(5);
  readonly readonly = input(false);
  readonly size = input<keyof typeof STAR_SIZE>('default');
  readonly color = input('text-amber-500');
  readonly ariaLabel = input<string | null>(null);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly hover = signal(0);
  protected readonly current = computed(() => this.hover() || this.value());
  protected readonly stars = computed(() =>
    Array.from({ length: this.max() }, (_, index) => index + 1),
  );
  protected readonly sizeClass = computed(() => STAR_SIZE[this.size()]);
  protected readonly computedClass = computed(() =>
    cn('inline-flex items-center gap-0.5', this.userClass()),
  );

  protected set(next: number): void {
    if (!this.readonly()) {
      this.value.set(next);
    }
  }
  protected onHover(next: number): void {
    if (!this.readonly()) {
      this.hover.set(next);
    }
  }
  protected tabindexFor(star: number): number {
    if (this.readonly()) {
      return -1;
    }
    return star === (this.value() || 1) ? 0 : -1;
  }
  protected onKeydown(event: KeyboardEvent): void {
    if (this.readonly()) {
      return;
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.set(Math.min(this.max(), this.value() + 1));
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.set(Math.max(0, this.value() - 1));
    }
  }
}
