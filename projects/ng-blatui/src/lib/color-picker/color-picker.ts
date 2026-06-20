import { Component, computed, input, model } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const DEFAULT_SWATCHES = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#3b82f6',
  '#6366f1',
  '#a855f7',
  '#ec4899',
  '#64748b',
];

/** A colour picker: a native colour well, a hex field, and a swatch palette. */
@Component({
  selector: 'bui-color-picker',
  host: { 'data-slot': 'color-picker', '[class]': 'computedClass()' },
  template: `
    <div class="flex items-center gap-2">
      <label
        class="relative size-9 shrink-0 overflow-hidden rounded-md border border-input"
        [style.background]="value()"
      >
        <input
          type="color"
          [value]="value()"
          [disabled]="disabled()"
          class="absolute inset-0 size-full cursor-pointer opacity-0"
          aria-label="Pick a color"
          (input)="onPick($event)"
        />
      </label>
      <input
        type="text"
        [value]="value()"
        [disabled]="disabled()"
        class="h-9 w-28 rounded-md border border-input bg-transparent px-2 font-mono text-sm uppercase outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        aria-label="Color hex value"
        (input)="onText($event)"
      />
    </div>
    <div class="mt-2 flex flex-wrap gap-1.5">
      @for (swatch of palette(); track swatch) {
        <button
          type="button"
          class="size-6 rounded-md border outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          [style.background]="swatch"
          [attr.aria-label]="swatch"
          [attr.aria-pressed]="swatch === value()"
          (click)="value.set(swatch)"
        ></button>
      }
    </div>
  `,
})
export class BuiColorPicker {
  readonly value = model('#6366f1');
  readonly swatches = input<readonly string[] | null>(null);
  readonly disabled = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly palette = computed(() => this.swatches() ?? DEFAULT_SWATCHES);
  protected readonly computedClass = computed(() => cn('inline-block', this.userClass()));

  protected onPick(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  protected onText(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
