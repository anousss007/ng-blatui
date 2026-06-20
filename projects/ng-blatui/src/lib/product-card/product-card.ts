import { Component, computed, input, signal } from '@angular/core';

import { BuiBadge } from '../badge/badge';
import { BuiButton } from '../button/button';
import { BuiPrice } from '../price/price';
import { type ClassValue, cn } from '../utils/cn';

/** A product card: image, badge, wishlist, title, rating, price, and an action slot. */
@Component({
  selector: 'bui-product-card',
  imports: [BuiBadge, BuiButton, BuiPrice],
  host: { 'data-slot': 'product-card', '[class]': 'computedClass()' },
  template: `
    <div class="relative aspect-square overflow-hidden bg-muted">
      <img
        [src]="image()"
        [alt]="alt()"
        loading="lazy"
        class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      @if (badge()) {
        <div class="absolute start-2 top-2">
          <span buiBadge variant="solid" [class]="badgeClass()">{{ badge() }}</span>
        </div>
      }
      @if (wishlist()) {
        <button
          type="button"
          class="absolute end-2 top-2 inline-flex size-8 items-center justify-center rounded-full border bg-background/80 shadow-sm backdrop-blur transition-colors hover:bg-background"
          [attr.aria-pressed]="wished()"
          aria-label="Add to wishlist"
          (click)="wished.set(!wished())"
        >
          <svg
            class="size-4"
            [class]="wished() ? 'fill-red-500 text-red-500' : 'fill-none'"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path
              d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"
            />
          </svg>
        </button>
      }
    </div>
    <div class="flex flex-1 flex-col gap-2 p-4">
      @if (category()) {
        <p class="text-xs text-muted-foreground">{{ category() }}</p>
      }
      <h3 class="text-sm leading-snug font-medium">
        @if (href()) {
          <a [href]="href()" class="rounded-sm outline-none hover:underline">{{ title() }}</a>
        } @else {
          {{ title() }}
        }
      </h3>
      @if (rating() !== null) {
        <div class="flex items-center gap-1.5 text-sm">
          <span class="text-amber-500" aria-hidden="true">★</span>
          <span class="font-medium">{{ rating() }}</span>
          @if (reviews() !== null) {
            <span class="text-muted-foreground">({{ reviews() }})</span>
          }
        </div>
      }
      @if (price() !== null) {
        <div class="mt-auto pt-1">
          <bui-price
            [amount]="price() ?? 0"
            [compareAt]="compareAt()"
            [currency]="currency()"
            size="lg"
          />
        </div>
      }
      <div class="mt-3">
        <ng-content>
          <button buiButton class="w-full">Add to cart</button>
        </ng-content>
      </div>
    </div>
  `,
})
export class BuiProductCard {
  readonly title = input('');
  readonly href = input('');
  readonly image = input('');
  readonly imageAlt = input('');
  readonly price = input<number | null>(null);
  readonly compareAt = input<number | null>(null);
  readonly currency = input('$');
  readonly badge = input('');
  readonly category = input('');
  readonly rating = input<number | null>(null);
  readonly reviews = input<number | null>(null);
  readonly wishlist = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly wished = signal(false);
  protected readonly alt = computed(() => this.imageAlt() || this.title());
  protected readonly badgeClass = computed(() => {
    const badge = this.badge().toLowerCase();
    if (badge.includes('sale') || badge.includes('off') || badge.includes('%')) {
      return 'border-transparent bg-red-700 text-white';
    }
    if (badge.includes('new')) {
      return 'border-transparent bg-emerald-700 text-white';
    }
    return '';
  });
  protected readonly computedClass = computed(() =>
    cn(
      'group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm',
      this.userClass(),
    ),
  );
}
