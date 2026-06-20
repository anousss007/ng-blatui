import { Component, computed, input, model } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A styled native time input (`<input type="time">`). */
@Component({
  selector: 'bui-time-field',
  host: { 'data-slot': 'time-field', '[class]': 'computedClass()' },
  template: `
    <input
      type="time"
      [value]="value()"
      [attr.name]="name() || null"
      [attr.id]="id() || null"
      [attr.min]="min() || null"
      [attr.max]="max() || null"
      [attr.step]="seconds() ? 1 : null"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel() || null"
      class="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
      (input)="onInput($event)"
    />
  `,
})
export class BuiTimeField {
  readonly value = model('');
  readonly name = input('');
  readonly id = input('');
  readonly min = input('');
  readonly max = input('');
  readonly seconds = input(false);
  readonly disabled = input(false);
  readonly ariaLabel = input('');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn('inline-block', this.userClass()));

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
