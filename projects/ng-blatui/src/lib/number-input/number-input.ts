import { Component, computed, input, model } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export type NumberInputSize = 'sm' | 'default' | 'lg';

const BTN =
  'border-input text-foreground hover:bg-accent inline-flex items-center justify-center border bg-transparent outline-none transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4';
const INPUT =
  'w-16 [appearance:textfield] border-y border-input bg-transparent text-center tabular-nums outline-none focus-visible:relative focus-visible:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';
const BTN_SIZE: Record<NumberInputSize, string> = {
  sm: 'size-8',
  default: 'size-9',
  lg: 'size-10',
};
const INPUT_SIZE: Record<NumberInputSize, string> = {
  sm: 'h-8 text-xs',
  default: 'h-9 text-sm',
  lg: 'h-10 text-base',
};

/** A numeric stepper: − / + buttons around a number field, with min/max/step clamping. */
@Component({
  selector: 'bui-number-input',
  host: { 'data-slot': 'number-input', '[class]': 'computedClass()' },
  template: `
    <button
      type="button"
      [class]="btnClass() + ' rounded-l-md'"
      (click)="step(-1)"
      [disabled]="disabled() || atMin()"
      aria-label="Decrease"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
      </svg>
    </button>
    <input
      type="number"
      inputmode="numeric"
      [value]="value()"
      [attr.min]="min()"
      [attr.max]="max()"
      [step]="stepBy()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel() || null"
      [class]="inputClass()"
      (input)="onInput($event)"
      (change)="onInput($event)"
    />
    <button
      type="button"
      [class]="btnClass() + ' rounded-r-md'"
      (click)="step(1)"
      [disabled]="disabled() || atMax()"
      aria-label="Increase"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
    </button>
  `,
})
export class BuiNumberInput {
  readonly value = model(0);
  readonly min = input<number | null>(null);
  readonly max = input<number | null>(null);
  readonly stepBy = input(1, { alias: 'step' });
  readonly disabled = input(false);
  readonly size = input<NumberInputSize>('default');
  readonly ariaLabel = input('');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly btnClass = computed(() => cn(BTN, BTN_SIZE[this.size()]));
  protected readonly inputClass = computed(() => cn(INPUT, INPUT_SIZE[this.size()]));
  protected readonly atMin = computed(() => {
    const min = this.min();
    return min !== null && this.value() <= min;
  });
  protected readonly atMax = computed(() => {
    const max = this.max();
    return max !== null && this.value() >= max;
  });
  protected readonly computedClass = computed(() =>
    cn('inline-flex items-stretch', this.userClass()),
  );

  protected step(direction: number): void {
    this.commit(this.value() + direction * this.stepBy());
  }

  protected onInput(event: Event): void {
    const raw = Number.parseFloat((event.target as HTMLInputElement).value);
    this.commit(Number.isNaN(raw) ? 0 : raw);
  }

  private commit(next: number): void {
    let value = next;
    const min = this.min();
    const max = this.max();
    if (min !== null && value < min) {
      value = min;
    }
    if (max !== null && value > max) {
      value = max;
    }
    this.value.set(value);
  }
}
