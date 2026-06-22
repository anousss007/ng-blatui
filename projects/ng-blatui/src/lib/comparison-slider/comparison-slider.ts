import { Component, computed, input, model } from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { type ClassValue, cn } from '../utils/cn';

/** A before/after image comparison with a draggable, keyboard-operable divider. */
@Component({
  selector: 'bui-comparison-slider',
  host: { 'data-slot': 'comparison-slider', '[class]': 'computedClass()' },
  template: `
    <div class="relative overflow-hidden rounded-lg select-none">
      <img [src]="after()" [alt]="afterAlt()" class="block w-full" draggable="false" />
      <div class="absolute inset-0 overflow-hidden" [style.clip-path]="clip()">
        <img [src]="before()" [alt]="beforeAlt()" class="block w-full" draggable="false" />
      </div>
      @if (afterLabel()) {
        <span class="absolute end-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">{{
          afterLabel()
        }}</span>
      }
      @if (beforeLabel()) {
        <span class="absolute start-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">{{
          beforeLabel()
        }}</span>
      }
      <div
        class="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow"
        [style.left.%]="value()"
        aria-hidden="true"
      >
        <div
          class="absolute top-1/2 left-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white/20 backdrop-blur"
        ></div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        [value]="value()"
        [attr.aria-label]="positionText()"
        class="absolute inset-0 size-full cursor-ew-resize opacity-0"
        (input)="onInput($event)"
      />
    </div>
  `,
})
export class BuiComparisonSlider {
  /** Source URL of the "before" image (revealed on the left of the divider). */
  readonly before = input('');
  /** Source URL of the "after" image (shown on the right of the divider). */
  readonly after = input('');
  /** Caption badge shown over the "before" image; hidden when empty. */
  readonly beforeLabel = input('');
  /** Caption badge shown over the "after" image; hidden when empty. */
  readonly afterLabel = input('');
  /** Alt text for the "before" image. */
  readonly beforeAlt = input('Before');
  /** Alt text for the "after" image. */
  readonly afterAlt = input('After');
  /** Divider position as a percentage (0-100); two-way bindable. */
  readonly value = model(50);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  /** Accessible label override for the range slider. */
  readonly positionLabel = input<string>();

  protected readonly positionText = buiLabel('comparisonSliderPosition', this.positionLabel);

  protected readonly clip = computed(() => `inset(0 ${100 - this.value()}% 0 0)`);
  protected readonly computedClass = computed(() => cn('block', this.userClass()));

  protected onInput(event: Event): void {
    this.value.set(Number((event.target as HTMLInputElement).value));
  }
}
