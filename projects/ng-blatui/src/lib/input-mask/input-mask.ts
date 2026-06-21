import { Component, computed, input, model } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

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
  template: `
    <input
      [value]="value()"
      [placeholder]="placeholder()"
      [attr.inputmode]="inputmode() || null"
      [attr.name]="name() || null"
      class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      (input)="onInput($event)"
    />
  `,
})
export class BuiInputMask {
  readonly mask = input('');
  readonly value = model('');
  readonly placeholder = input('');
  readonly inputmode = input('');
  readonly name = input('');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() => cn('block', this.userClass()));

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const masked = this.mask() === '' ? target.value : applyMask(target.value, this.mask());
    target.value = masked;
    this.value.set(masked);
  }
}
