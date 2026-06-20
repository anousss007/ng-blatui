import { Component, computed, input, type OnDestroy, output, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const SIZES = { default: 'h-9 px-4 py-2', sm: 'h-8 gap-1.5 px-3', lg: 'h-10 px-6' } as const;

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
  readonly label = input('Add to cart');
  readonly addedLabel = input('Added');
  readonly size = input<keyof typeof SIZES>('default');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  readonly triggered = output();

  protected readonly state = signal<'idle' | 'adding' | 'added'>('idle');
  private readonly timers: ReturnType<typeof setTimeout>[] = [];
  protected readonly btnClass = computed(() =>
    cn(
      'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-90',
      SIZES[this.size()],
      this.state() === 'added'
        ? 'bg-emerald-600 text-white'
        : 'bg-primary text-primary-foreground hover:bg-primary/90',
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
