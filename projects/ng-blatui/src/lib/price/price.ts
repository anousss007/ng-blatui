import { Component, computed, input } from '@angular/core';

import { buiLocale } from '../i18n/locale';
import { type ClassValue, cn } from '../utils/cn';

const SIZES = { sm: 'text-sm', default: 'text-base', lg: 'text-2xl' } as const;
const COMPARE_SIZES = { sm: 'text-xs', default: 'text-sm', lg: 'text-base' } as const;

/** Two fraction digits ("1,234.50") — matches the pre-locale rendering in `en-US`. */
const DEFAULT_NUMBER_FORMAT: Intl.NumberFormatOptions = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

/** A price display with optional compare-at (strikethrough) and a discount badge. */
@Component({
  selector: 'bui-price',
  host: { 'data-slot': 'price', '[class]': 'computedClass()' },
  template: `
    <span [class]="currentClass()">{{ format(amount()) }}</span>
    @if (onSale()) {
      <s [class]="compareClass()"
        ><span class="sr-only">was </span>{{ format(compareAt() ?? 0) }}</s
      >
      @if (showDiscount() && discount() > 0) {
        <span
          class="inline-flex items-center rounded-md bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
        >
          <span class="sr-only">save </span>-{{ discount() }}%
        </span>
      }
    }
  `,
})
export class BuiPrice {
  /** Current price amount to display. */
  readonly amount = input(0);
  /** Original price; when higher than amount, shows as struck-through. */
  readonly compareAt = input<number | null>(null);
  /** Currency symbol prefixed to each value. */
  readonly currency = input('$');
  /** Text size preset for the price. */
  readonly size = input<keyof typeof SIZES>('default');
  /** Whether to show the percentage-off discount badge when on sale. */
  readonly showDiscount = input(true);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  /** BCP 47 locale for number formatting. Defaults to the app's `LOCALE_ID`. */
  readonly locale = input<string>();
  /**
   * `Intl.NumberFormat` options for the amounts. Replaces the default wholesale — pass
   * `{ style: 'currency', currency: 'EUR' }` to let ICU place the symbol itself.
   */
  readonly numberFormat = input<Intl.NumberFormatOptions>(DEFAULT_NUMBER_FORMAT);

  private readonly resolvedLocale = buiLocale(this.locale);
  private readonly formatter = computed(
    () => new Intl.NumberFormat(this.resolvedLocale(), this.numberFormat()),
  );

  protected readonly onSale = computed(() => {
    const compareAt = this.compareAt();
    return compareAt !== null && compareAt > this.amount();
  });
  protected readonly discount = computed(() => {
    const compareAt = this.compareAt();
    return this.onSale() && compareAt !== null && compareAt > 0
      ? Math.round(((compareAt - this.amount()) / compareAt) * 100)
      : 0;
  });
  protected readonly currentClass = computed(() =>
    cn(
      SIZES[this.size()],
      this.onSale() ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground',
    ),
  );
  protected readonly compareClass = computed(() =>
    cn(COMPARE_SIZES[this.size()], 'text-muted-foreground'),
  );
  protected readonly computedClass = computed(() =>
    cn('inline-flex items-baseline gap-2 font-medium tabular-nums', this.userClass()),
  );

  protected format(value: number): string {
    return this.currency() + this.formatter().format(value);
  }
}
