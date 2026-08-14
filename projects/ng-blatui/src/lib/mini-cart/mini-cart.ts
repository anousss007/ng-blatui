import { OverlayModule } from '@angular/cdk/overlay';
import { Component, computed, input, model } from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { buiLocale } from '../i18n/locale';
import { type ClassValue, cn } from '../utils/cn';
import { PANEL_POSITIONS } from '../utils/panel-positions';

/** Two fraction digits ("1,234.50") — matches the pre-locale rendering in `en-US`. */
const DEFAULT_NUMBER_FORMAT: Intl.NumberFormatOptions = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

export interface CartItem {
  /** Product name shown as the line-item label. */
  name: string;
  /** Optional variant description shown under the name. */
  variant?: string;
  /** Unit price of the item. */
  price: number;
  /** Quantity in the cart. */
  qty: number;
  /** Optional thumbnail image URL. */
  image?: string;
}

/** A cart trigger with an item-count badge and a dropdown with line items + subtotal. */
@Component({
  selector: 'bui-mini-cart',
  imports: [OverlayModule],
  host: { 'data-slot': 'mini-cart', '[class]': 'computedClass()' },
  template: `
    <button
      type="button"
      cdkOverlayOrigin
      #trigger="cdkOverlayOrigin"
      class="relative inline-flex size-9 items-center justify-center rounded-md border border-input hover:bg-accent"
      [attr.aria-expanded]="open()"
      [attr.aria-label]="triggerText()"
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
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="trigger"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayPositions]="panelPositions"
      [cdkConnectedOverlayPush]="true"
      [cdkConnectedOverlayViewportMargin]="8"
      (overlayOutsideClick)="open.set(false)"
      (detach)="open.set(false)"
    >
      <div
        class="z-50 w-80 max-w-[calc(100vw-1rem)] rounded-lg border bg-popover text-popover-foreground shadow-md"
        role="dialog"
        [attr.aria-label]="labelText()"
      >
        <div class="border-b p-3 text-sm font-medium">{{ titleText() }}</div>
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
            <span class="text-sm font-medium">{{ subtotalText() }}</span>
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
    </ng-template>
  `,
})
export class BuiMiniCart {
  /** Line items in the cart, used for count and subtotal. */
  readonly items = input<readonly CartItem[]>([]);
  /** Currency symbol prefixed to prices and subtotal. */
  readonly currency = input('$');
  /** Whether the dropdown is open. Two-way bindable with `[(open)]`. */
  readonly open = model(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  /** Accessible label override for the cart trigger button. */
  readonly triggerLabel = input<string>();
  /** Accessible label override for the cart dropdown dialog. */
  readonly label = input<string>();
  /** Heading shown at the top of the cart panel. Falls back to `provideBuiLabels`. */
  readonly title = input<string>();
  /** Label for the subtotal row. Falls back to `provideBuiLabels`. */
  readonly subtotalLabel = input<string>();
  /** BCP 47 locale for number formatting. Defaults to the app's `LOCALE_ID`. */
  readonly locale = input<string>();
  /**
   * `Intl.NumberFormat` options for prices and subtotal. Replaces the default wholesale — pass
   * `{ style: 'currency', currency: 'EUR' }` to let ICU place the symbol itself.
   */
  readonly numberFormat = input<Intl.NumberFormatOptions>(DEFAULT_NUMBER_FORMAT);

  protected readonly panelPositions = PANEL_POSITIONS;
  private readonly resolvedLocale = buiLocale(this.locale);
  private readonly formatter = computed(
    () => new Intl.NumberFormat(this.resolvedLocale(), this.numberFormat()),
  );

  protected readonly triggerText = buiLabel('miniCartTrigger', this.triggerLabel);
  protected readonly labelText = buiLabel('miniCart', this.label);
  protected readonly titleText = buiLabel('miniCartTitle', this.title);
  protected readonly subtotalText = buiLabel('miniCartSubtotal', this.subtotalLabel);

  protected readonly count = computed(() =>
    this.items().reduce((total, item) => total + item.qty, 0),
  );
  protected readonly subtotal = computed(() =>
    this.items().reduce((total, item) => total + item.price * item.qty, 0),
  );
  protected readonly computedClass = computed(() => cn('inline-block', this.userClass()));

  protected format(value: number): string {
    return this.currency() + this.formatter().format(value);
  }
}
