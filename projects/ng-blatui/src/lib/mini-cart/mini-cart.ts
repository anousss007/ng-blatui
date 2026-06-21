import { Component, computed, input, model } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export interface CartItem {
  name: string;
  variant?: string;
  price: number;
  qty: number;
  image?: string;
}

/** A cart trigger with an item-count badge and a dropdown with line items + subtotal. */
@Component({
  selector: 'bui-mini-cart',
  host: { 'data-slot': 'mini-cart', '[class]': 'computedClass()' },
  template: `
    <button
      type="button"
      class="relative inline-flex size-9 items-center justify-center rounded-md border border-input hover:bg-accent"
      [attr.aria-expanded]="open()"
      aria-label="Cart"
      (click)="open.set(!open())"
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
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      @if (count() > 0) {
        <span
          class="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground"
        >
          {{ count() }}
        </span>
      }
    </button>
    @if (open()) {
      <div
        class="absolute end-0 z-50 mt-2 w-80 rounded-lg border bg-popover text-popover-foreground shadow-md"
        role="dialog"
        aria-label="Shopping cart"
      >
        <div class="border-b p-3 text-sm font-medium">Your cart</div>
        @if (items().length === 0) {
          <p class="p-6 text-center text-sm text-muted-foreground">Your cart is empty.</p>
        } @else {
          <ul class="max-h-72 overflow-auto">
            @for (item of items(); track $index) {
              <li class="flex items-center gap-3 border-b p-3 last:border-0">
                <span class="size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                  @if (item.image) {
                    <img [src]="item.image" alt="" class="size-full object-cover" />
                  }
                </span>
                <div class="min-w-0 flex-1">
                  <div class="truncate text-sm font-medium">{{ item.name }}</div>
                  @if (item.variant) {
                    <div class="text-xs text-muted-foreground">{{ item.variant }}</div>
                  }
                  <div class="text-xs text-muted-foreground">Qty {{ item.qty }}</div>
                </div>
                <span class="text-sm font-medium tabular-nums">{{
                  format(item.price * item.qty)
                }}</span>
              </li>
            }
          </ul>
          <div class="flex items-center justify-between border-t p-3">
            <span class="text-sm font-medium">Subtotal</span>
            <span class="text-sm font-semibold tabular-nums">{{ format(subtotal()) }}</span>
          </div>
          <div class="p-3 pt-0">
            <button
              type="button"
              class="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground"
            >
              Checkout
            </button>
          </div>
        }
      </div>
    }
  `,
})
export class BuiMiniCart {
  readonly items = input<readonly CartItem[]>([]);
  readonly currency = input('$');
  readonly open = model(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly count = computed(() =>
    this.items().reduce((total, item) => total + item.qty, 0),
  );
  protected readonly subtotal = computed(() =>
    this.items().reduce((total, item) => total + item.price * item.qty, 0),
  );
  protected readonly computedClass = computed(() => cn('relative inline-block', this.userClass()));

  protected format(value: number): string {
    return (
      this.currency() +
      value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    );
  }
}
