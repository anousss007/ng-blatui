import { Component, computed, input, type OnDestroy, output, signal } from '@angular/core';

import { buttonVariants } from '../button/button';
import { type ClassValue, cn } from '../utils/cn';

/** Size preset controlling button height and padding. */
export type AddToCartSize = 'sm' | 'default' | 'lg';

/** A stateful add-to-cart button: idle → adding → added → idle. Emits `triggered` on click. */
@Component({
  selector: 'bui-add-to-cart',
  host: { 'data-slot': 'add-to-cart' },
  template: `
    <button
      type="button"
      [class]="btnClass()"
      [disabled]="state() !== 'idle'"
      aria-live="polite"
      (click)="add()"
    >
      @switch (state()) {
        @case ('adding') {
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
          {{ label() }}
        }
        @case ('added') {
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
            <path d="M20 6 9 17l-5-5" />
          </svg>
          {{ addedLabel() }}
        }
        @default {
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
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path
              d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
            />
          </svg>
          {{ label() }}
        }
      }
    </button>
  `,
})
export class BuiAddToCart implements OnDestroy {
  /** Button text shown in the idle and adding states. */
  readonly label = input('Add to cart');
  /** Button text shown briefly in the added (success) state. */
  readonly addedLabel = input('Added');
  /** Size preset controlling height and padding. */
  readonly size = input<AddToCartSize>('default');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  /** Emitted when the button is clicked to add the item. */
  readonly triggered = output();

  protected readonly state = signal<'idle' | 'adding' | 'added'>('idle');
  private readonly timers: ReturnType<typeof setTimeout>[] = [];
  // Composes the button's styling (single source of truth via `buttonVariants`); the busy/added
  // states only recolor on top — tailwind-merge drops the conflicting base background.
  protected readonly btnClass = computed(() =>
    cn(
      buttonVariants({ size: this.size() }),
      'disabled:opacity-90',
      this.state() === 'added' ? 'bg-emerald-600 text-white hover:bg-emerald-600' : '',
      this.userClass(),
    ),
  );

  protected add(): void {
    if (this.state() !== 'idle') {
      return;
    }
    this.state.set('adding');
    this.triggered.emit();
    this.timers.push(
      setTimeout(() => {
        this.state.set('added');
      }, 800),
      setTimeout(() => {
        this.state.set('idle');
      }, 2300),
    );
  }

  ngOnDestroy(): void {
    for (const timer of this.timers) {
      clearTimeout(timer);
    }
  }
}
