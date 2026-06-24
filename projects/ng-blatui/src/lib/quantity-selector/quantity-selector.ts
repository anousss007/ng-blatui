import { Component, computed, input, model } from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { type ClassValue, cn } from '../utils/cn';

const FIELD_HEIGHT = { sm: 'h-7 text-xs', default: 'h-8 text-sm', lg: 'h-9 text-base' } as const;
const BTN_SIZE = {
  sm: 'w-7 [&_svg]:size-3',
  default: 'w-8 [&_svg]:size-3.5',
  lg: 'w-9 [&_svg]:size-4',
} as const;
const FIELD_WIDTH = { sm: 'w-9', default: 'w-10', lg: 'w-12' } as const;

/**
 * @deprecated Use `<bui-number-input [min]="1" size="sm">` instead — it is the same numeric
 * stepper, so this duplicate was dropped from the registry and docs. Still exported as a thin
 * compatibility shim; existing usages keep working.
 *
 * A compact − [n] + quantity stepper (`role="group"` with a `spinbutton` field).
 */
@Component({
  selector: 'bui-quantity-selector',
  host: { 'data-slot': 'quantity-selector', role: 'group', '[class]': 'computedClass()' },
  template: `
    <button
      type="button"
      [attr.aria-label]="decreaseText()"
      [disabled]="disabled() || atMin()"
      [class]="btnClass('e')"
      (click)="dec()"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
      </svg>
    </button>
    <input
      type="text"
      inputmode="numeric"
      role="spinbutton"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-valuenow]="value()"
      [attr.aria-valuemin]="min()"
      [attr.aria-valuemax]="max()"
      [disabled]="disabled()"
      [value]="value()"
      [class]="fieldClass()"
      (input)="onInput($event)"
      (blur)="onBlur()"
    />
    <button
      type="button"
      [attr.aria-label]="increaseText()"
      [disabled]="disabled() || atMax()"
      [class]="btnClass('s')"
      (click)="inc()"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
    </button>
  `,
})
export class BuiQuantitySelector {
  /** Current quantity. Two-way bindable with `[(value)]`. */
  readonly value = model(1);
  /** Minimum allowed quantity. */
  readonly min = input(1);
  /** Maximum allowed quantity; unbounded when null. */
  readonly max = input<number | null>(null);
  /** Increment/decrement applied per button press. */
  readonly step = input(1);
  /** Size preset controlling height and button width. */
  readonly size = input<keyof typeof FIELD_HEIGHT>('default');
  /** Whether the whole control is disabled. */
  readonly disabled = input(false);
  /** Accessible label for the numeric input field. */
  readonly ariaLabel = input('Quantity');
  /** Accessible label override for the decrease button. */
  readonly decreaseLabel = input<string>();
  /** Accessible label override for the increase button. */
  readonly increaseLabel = input<string>();
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly decreaseText = buiLabel('quantitySelectorDecrease', this.decreaseLabel);
  protected readonly increaseText = buiLabel('quantitySelectorIncrease', this.increaseLabel);

  protected readonly atMin = computed(() => this.value() <= this.min());
  protected readonly atMax = computed(() => {
    const max = this.max();
    return max !== null && this.value() >= max;
  });
  protected readonly computedClass = computed(() =>
    cn(
      'inline-flex items-stretch overflow-hidden rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-[input:disabled]:pointer-events-none has-[input:disabled]:opacity-50 dark:bg-input/30',
      this.userClass(),
    ),
  );

  protected btnClass(side: 'e' | 's'): string {
    return cn(
      'flex shrink-0 items-center justify-center text-muted-foreground transition-colors outline-none not-disabled:cursor-pointer hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
      side === 'e' ? 'border-e' : 'border-s',
      'border-input',
      BTN_SIZE[this.size()],
      FIELD_HEIGHT[this.size()],
    );
  }

  protected fieldClass(): string {
    return cn(
      'min-w-0 border-0 bg-transparent text-center font-medium tabular-nums outline-none',
      FIELD_HEIGHT[this.size()],
      FIELD_WIDTH[this.size()],
    );
  }

  protected inc(): void {
    if (!this.disabled() && !this.atMax()) {
      this.value.set(this.clamp(this.value() + this.step()));
    }
  }

  protected dec(): void {
    if (!this.disabled() && !this.atMin()) {
      this.value.set(this.clamp(this.value() - this.step()));
    }
  }

  protected onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.replaceAll(/[^\d-]/g, '');
    this.value.set(raw === '' ? this.min() : Number(raw));
  }

  protected onBlur(): void {
    const current = this.value();
    this.value.set(this.clamp(Number.isNaN(current) ? this.min() : current));
  }

  private clamp(value: number): number {
    let result = Math.max(this.min(), value);
    const max = this.max();
    if (max !== null && result > max) {
      result = max;
    }
    return result;
  }
}
