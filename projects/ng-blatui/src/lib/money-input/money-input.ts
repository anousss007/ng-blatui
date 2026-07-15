import { _IdGenerator } from '@angular/cdk/a11y';
import { Component, computed, forwardRef, inject, input, model, signal } from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { type ClassValue, cn } from '../utils/cn';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

/** How the currency is shown: local symbol, narrow symbol, ISO code, or full name. */
export type CurrencyDisplay = 'symbol' | 'narrowSymbol' | 'code' | 'name';

/**
 * A localized currency input backed by `Intl.NumberFormat`. Stores a numeric amount and displays
 * it formatted while unfocused; while focused it shows a plain editable number so the caret and
 * typing behave predictably. Works with template-driven and reactive forms (ControlValueAccessor).
 *
 * When ICU has no local glyph for a currency (so it renders the ISO code, e.g. `MAD`), pass a
 * `symbol` to override it in the locale's correct position — `symbol="DH"` shows `DH`.
 */
@Component({
  selector: 'bui-money-input',
  host: { 'data-slot': 'money-input', '[class]': 'computedClass()' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BuiMoneyInput), multi: true },
  ],
  template: `
    <input
      type="text"
      inputmode="decimal"
      [attr.name]="name() || null"
      [attr.id]="id() || resolvedId"
      [attr.aria-label]="ariaLabel() || null"
      [disabled]="disabled()"
      [placeholder]="placeholder()"
      [value]="text()"
      [class]="inputClass()"
      (focus)="onFocus()"
      (input)="onInput($event)"
      (blur)="onBlur()"
    />
  `,
})
export class BuiMoneyInput implements ControlValueAccessor {
  /** The numeric amount. Two-way bindable with `[(value)]`. `null` when the field is empty. */
  readonly value = model<number | null>(null);
  /** BCP 47 locale for formatting/parsing. Defaults to the runtime locale. */
  readonly locale = input<string>('');
  /** ISO 4217 currency code, e.g. `USD`, `EUR`, `MAD`. */
  readonly currency = input('USD');
  /** How the currency is shown. `narrowSymbol` renders the local symbol when ICU has one. */
  readonly currencyDisplay = input<CurrencyDisplay>('narrowSymbol');
  /**
   * Custom currency symbol that overrides the one ICU would render, kept in the locale's correct
   * position and spacing. Use it when the ISO data has no local glyph — e.g. `symbol="DH"` shows
   * `DH` instead of the `MAD` code for Moroccan dirham.
   */
  readonly symbol = input('');
  /** Minimum fraction digits shown when formatted. Defaults to the currency's own default. */
  readonly minimumFractionDigits = input<number | null>(null);
  /** Maximum fraction digits shown when formatted. Defaults to the currency's own default. */
  readonly maximumFractionDigits = input<number | null>(null);
  /** Placeholder shown when the field is empty. */
  readonly placeholder = input('');
  /** Whether the field is disabled. Two-way bindable with `[(disabled)]`. */
  readonly disabled = model(false);
  /** Native `name` attribute for the input. */
  readonly name = input('');
  /** Native `id` attribute; falls back to a generated id. */
  readonly id = input('');
  /** Accessible name, applied to the inner input. */
  readonly ariaLabel = input<string>('', { alias: 'aria-label' });
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly resolvedId = inject(_IdGenerator).getId('bui-money-');
  private onChange: (value: number | null) => void = noop;
  private onTouched: () => void = noop;

  private readonly focused = signal(false);
  /** Literal string shown in the input (formatted while blurred, raw while focused/typing). */
  private readonly editText = signal('');

  private readonly formatter = computed(() => {
    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: this.currency(),
      currencyDisplay: this.currencyDisplay(),
    };
    const min = this.minimumFractionDigits();
    if (min !== null) {
      options.minimumFractionDigits = min;
    }
    const max = this.maximumFractionDigits();
    if (max !== null) {
      options.maximumFractionDigits = max;
    }
    return new Intl.NumberFormat(this.locale() || undefined, options);
  });

  private readonly formatted = computed(() => {
    const amount = this.value();
    if (amount === null || Number.isNaN(amount)) {
      return '';
    }
    const custom = this.symbol();
    if (!custom) {
      return this.formatter().format(amount);
    }
    // Swap the currency token for the custom symbol while keeping the locale's placement/spacing.
    return this.formatter()
      .formatToParts(amount)
      .map((part) => (part.type === 'currency' ? custom : part.value))
      .join('');
  });

  protected readonly text = computed(() => (this.focused() ? this.editText() : this.formatted()));

  protected readonly inputClass = computed(() =>
    cn(
      'h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm tabular-nums shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
    ),
  );
  protected readonly computedClass = computed(() => cn('block', this.userClass()));

  protected onFocus(): void {
    const amount = this.value();
    // Show a plain, period-decimal number for editing so the caret and typing behave predictably.
    this.editText.set(amount === null || Number.isNaN(amount) ? '' : String(amount));
    this.focused.set(true);
  }

  protected onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.editText.set(raw);
    const parsed = this.parse(raw);
    this.value.set(parsed);
    this.onChange(parsed);
  }

  protected onBlur(): void {
    this.focused.set(false);
    this.onTouched();
  }

  /** Parse a user-typed string into a number, tolerating currency symbols, grouping and either
   *  `.` or `,` as the decimal separator. Returns `null` for an empty or non-numeric entry. */
  private parse(raw: string): number | null {
    let cleaned = raw.replaceAll(/[^\d.,-]/g, '');
    if (cleaned === '' || cleaned === '-') {
      return null;
    }
    const lastDot = cleaned.lastIndexOf('.');
    const lastComma = cleaned.lastIndexOf(',');
    // The right-most separator is the decimal point; the other kind is grouping and is dropped.
    if (lastDot !== -1 && lastComma !== -1) {
      const isDecimalComma = lastComma > lastDot;
      cleaned = isDecimalComma
        ? cleaned.replaceAll('.', '').replaceAll(',', '.')
        : cleaned.replaceAll(',', '');
    } else if (lastComma !== -1) {
      cleaned = cleaned.replaceAll(',', '.');
    }
    const parsed = Number.parseFloat(cleaned);
    return Number.isNaN(parsed) ? null : parsed;
  }

  writeValue(value: number | null): void {
    this.value.set(typeof value === 'number' ? value : null);
  }

  registerOnChange(callback: (value: number | null) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
