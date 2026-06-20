import { Component, computed, type ElementRef, input, model, viewChild } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/**
 * A single-value slider (`role="slider"`) with pointer drag and full keyboard support
 * (arrows, Home/End, PageUp/PageDown). Horizontal or vertical. SSR-safe — geometry is
 * only read inside browser event handlers.
 */
@Component({
  selector: 'bui-slider',
  host: {
    'data-slot': 'slider',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-disabled]': "disabled() ? '' : null",
    '[class]': 'computedClass()',
    '(document:pointermove)': 'onMove($event)',
    '(document:pointerup)': 'onUp()',
  },
  template: `
    <span
      #track
      data-slot="slider-track"
      class="relative grow overflow-hidden rounded-full bg-muted"
      [class]="orientation() === 'vertical' ? 'h-full w-1.5' : 'h-1.5 w-full'"
      (pointerdown)="onPointerDown($event)"
    >
      <span
        data-slot="slider-range"
        class="absolute bg-primary"
        [class]="orientation() === 'vertical' ? 'bottom-0 w-full' : 'left-0 h-full'"
        [style.height.%]="orientation() === 'vertical' ? pct() : null"
        [style.width.%]="orientation() === 'vertical' ? null : pct()"
      ></span>
    </span>
    <span
      data-slot="slider-thumb"
      role="slider"
      [attr.aria-orientation]="orientation()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-valuemin]="min()"
      [attr.aria-valuemax]="max()"
      [attr.aria-valuenow]="value()"
      [attr.aria-disabled]="disabled()"
      [attr.tabindex]="disabled() ? -1 : 0"
      class="absolute block size-4 shrink-0 rounded-full border border-primary bg-background shadow-sm ring-ring/50 transition-[color,box-shadow] outline-none hover:ring-4 focus-visible:ring-4"
      [class]="
        orientation() === 'vertical'
          ? 'left-1/2 -translate-x-1/2 translate-y-1/2'
          : 'top-1/2 -translate-x-1/2 -translate-y-1/2'
      "
      [style.bottom.%]="orientation() === 'vertical' ? pct() : null"
      [style.left.%]="orientation() === 'vertical' ? null : pct()"
      (keydown)="onKeydown($event)"
    ></span>
  `,
})
export class BuiSlider {
  readonly value = model(0);
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly disabled = input(false);
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly ariaLabel = input('Value');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private dragging = false;

  protected readonly pct = computed(() => {
    const range = this.max() - this.min() || 1;
    return ((this.value() - this.min()) / range) * 100;
  });
  protected readonly computedClass = computed(() =>
    cn(
      'relative flex touch-none items-center select-none data-disabled:pointer-events-none data-disabled:opacity-50',
      this.orientation() === 'vertical' ? 'h-40 w-fit flex-col' : 'w-full',
      this.userClass(),
    ),
  );

  protected onPointerDown(event: PointerEvent): void {
    if (this.disabled()) {
      return;
    }
    this.dragging = true;
    this.value.set(this.valueFromPointer(event));
  }

  protected onMove(event: PointerEvent): void {
    if (this.dragging) {
      this.value.set(this.valueFromPointer(event));
    }
  }

  protected onUp(): void {
    this.dragging = false;
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }
    const big = Math.max(this.step(), (this.max() - this.min()) / 10);
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp': {
        next = this.value() + this.step();
        break;
      }
      case 'ArrowLeft':
      case 'ArrowDown': {
        next = this.value() - this.step();
        break;
      }
      case 'Home': {
        next = this.min();
        break;
      }
      case 'End': {
        next = this.max();
        break;
      }
      case 'PageUp': {
        next = this.value() + big;
        break;
      }
      case 'PageDown': {
        next = this.value() - big;
        break;
      }
      default: {
        return;
      }
    }
    event.preventDefault();
    this.value.set(this.clamp(next));
  }

  private valueFromPointer(event: PointerEvent): number {
    const rect = this.track().nativeElement.getBoundingClientRect();
    const ratioRaw =
      this.orientation() === 'vertical'
        ? 1 - (event.clientY - rect.top) / rect.height
        : (event.clientX - rect.left) / rect.width;
    const ratio = Math.max(0, Math.min(1, ratioRaw));
    return this.snap(this.min() + ratio * (this.max() - this.min()));
  }

  private snap(raw: number): number {
    return this.clamp(Math.round(raw / this.step()) * this.step());
  }

  private clamp(value: number): number {
    return Math.max(this.min(), Math.min(this.max(), value));
  }
}
