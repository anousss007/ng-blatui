import { Component, computed, forwardRef, input, model } from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { type ClassValue, cn } from '../utils/cn';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

const PLACEHOLDERS = new Set(['9', 'a', '*']);

function isTokenChar(char: string, token: string): boolean {
  if (token === '9') {
    return char >= '0' && char <= '9';
  }
  if (token === 'a') {
    return /[a-z]/i.test(char);
  }
  return /[a-z0-9]/i.test(char);
}

function applyMask(value: string, mask: string): string {
  let out = '';
  let valueIndex = 0;
  const nextDataChar = (token: string): string => {
    while (valueIndex < value.length) {
      const char = value[valueIndex];
      valueIndex += 1;
      if (isTokenChar(char, token)) {
        return char;
      }
    }
    return '';
  };
  for (let maskIndex = 0; maskIndex < mask.length && valueIndex < value.length; maskIndex += 1) {
    const token = mask[maskIndex];
    if (PLACEHOLDERS.has(token)) {
      const char = nextDataChar(token);
      if (char === '') {
        break;
      }
      out += char;
    } else {
      out += token;
      if (value[valueIndex] === token) {
        valueIndex += 1;
      }
    }
  }
  return out;
}

/** A text input that formats its value against a mask (9 = digit, a = letter, * = alnum). */
@Component({
  selector: 'bui-input-mask',
  host: { 'data-slot': 'input-mask', '[class]': 'computedClass()' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BuiInputMask), multi: true },
  ],
  template: `
    <input
      [value]="value()"
      [placeholder]="placeholder()"
      [attr.inputmode]="inputmode() || null"
      [attr.name]="name() || null"
      [disabled]="disabled()"
      class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
      (input)="onInput($event)"
      (blur)="onTouched()"
    />
  `,
})
export class BuiInputMask implements ControlValueAccessor {
  /** Mask pattern where `9` accepts a digit, `a` a letter, `*` an alphanumeric, and other chars are literals. */
  readonly mask = input('');
  /** Current masked value. Two-way bindable with `[(value)]`. */
  readonly value = model('');
  /** Placeholder text shown when the input is empty. */
  readonly placeholder = input('');
  /** Value for the native `inputmode` attribute hinting the virtual keyboard. */
  readonly inputmode = input('');
  /** Name attribute applied to the underlying input for form submission. */
  readonly name = input('');
  /** Whether the input is disabled. Two-way bindable with `[(disabled)]`. */
  readonly disabled = model(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private onChange: (value: string) => void = noop;
  protected onTouched: () => void = noop;
  protected readonly computedClass = computed(() => cn('block', this.userClass()));

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const masked = this.mask() === '' ? target.value : applyMask(target.value, this.mask());
    target.value = masked;
    this.value.set(masked);
    this.onChange(masked);
  }

  writeValue(value: string | null | undefined): void {
    this.value.set(typeof value === 'string' ? value : '');
  }

  registerOnChange(callback: (value: string) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
