import {
  Component,
  computed,
  type ElementRef,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

type Thumb = 'start' | 'end';

/**
 * A slider (`role="slider"`) with pointer drag and full keyboard support
 * (arrows, Home/End, PageUp/PageDown). Single value, or a two-thumb `range`
 * (binds `value` + `endValue`). Horizontal or vertical. SSR-safe — geometry is
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
        [class]="orientation() === 'vertical' ? 'w-full' : 'h-full'"
        [style.bottom.%]="orientation() === 'vertical' ? fillStart() : null"
        [style.height.%]="orientation() === 'vertical' ? fillSize() : null"
        [style.left.%]="orientation() === 'vertical' ? null : fillStart()"
        [style.width.%]="orientation() === 'vertical' ? null : fillSize()"
      ></span>
    </span>
    <span
      data-slot="slider-thumb"
      role="slider"
      [attr.aria-orientation]="orientation()"
      [attr.aria-label]="range() ? ariaLabel() + ' minimum' : ariaLabel()"
      [attr.aria-valuemin]="min()"
      [attr.aria-valuemax]="range() ? endValue() : max()"
      [attr.aria-valuenow]="value()"
      [attr.aria-disabled]="disabled()"
      [attr.tabindex]="disabled() ? -1 : 0"
      [class]="thumbClass()"
      [style.bottom.%]="orientation() === 'vertical' ? pct() : null"
      [style.left.%]="orientation() === 'vertical' ? null : pct()"
      (keydown)="onKeydown($event, 'start')"
    ></span>
    @if (range()) {
      <span
        data-slot="slider-thumb"
        role="slider"
        [attr.aria-orientation]="orientation()"
        [attr.aria-label]="ariaLabel() + ' maximum'"
        [attr.aria-valuemin]="value()"
        [attr.aria-valuemax]="max()"
        [attr.aria-valuenow]="endValue()"
        [attr.aria-disabled]="disabled()"
        [attr.tabindex]="disabled() ? -1 : 0"
        [class]="thumbClass()"
        [style.bottom.%]="orientation() === 'vertical' ? endPct() : null"
        [style.left.%]="orientation() === 'vertical' ? null : endPct()"
        (keydown)="onKeydown($event, 'end')"
      ></span>
    }
  `,
})
export class BuiSlider {
  readonly value = model(0);
  /** Enable a second thumb; binds `endValue` as the upper handle. */
  readonly range = input(false);
  readonly endValue = model(100);
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly disabled = input(false);
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly ariaLabel = input('Value');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly active = signal<Thumb>('start');
  private dragging = false;

  protected readonly pct = computed(() => this.toPct(this.value()));
  protected readonly endPct = computed(() => this.toPct(this.endValue()));
  protected readonly fillStart = computed(() =>
    this.range() ? Math.min(this.pct(), this.endPct()) : 0,
  );
  protected readonly fillSize = computed(() =>
    this.range() ? Math.abs(this.endPct() - this.pct()) : this.pct(),
  );
  protected readonly thumbClass = computed(() =>
    cn(
      'absolute block size-4 shrink-0 rounded-full border border-primary bg-background shadow-sm ring-ring/50 transition-[color,box-shadow] outline-none hover:ring-4 focus-visible:ring-4',
      this.orientation() === 'vertical'
        ? 'left-1/2 -translate-x-1/2 translate-y-1/2'
        : 'top-1/2 -translate-x-1/2 -translate-y-1/2',
    ),
  );
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
    const next = this.valueFromPointer(event);
    if (this.range()) {
      const toStart = Math.abs(next - this.value());
      const toEnd = Math.abs(next - this.endValue());
      this.active.set(toEnd < toStart ? 'end' : 'start');
    }
    this.setThumb(next);
  }

  protected onMove(event: PointerEvent): void {
    if (this.dragging) {
      this.setThumb(this.valueFromPointer(event));
    }
  }

  protected onUp(): void {
    this.dragging = false;
  }

  protected onKeydown(event: KeyboardEvent, thumb: Thumb): void {
    if (this.disabled()) {
      return;
    }
    const current = thumb === 'end' ? this.endValue() : this.value();
    const big = Math.max(this.step(), (this.max() - this.min()) / 10);
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp': {
        next = current + this.step();
        break;
      }
      case 'ArrowLeft':
      case 'ArrowDown': {
        next = current - this.step();
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
        next = current + big;
        break;
      }
      case 'PageDown': {
        next = current - big;
        break;
      }
      default: {
        return;
      }
    }
    event.preventDefault();
    this.writeThumb(thumb, this.clamp(next));
  }

  private setThumb(next: number): void {
    this.writeThumb(this.range() ? this.active() : 'start', next);
  }

  private writeThumb(thumb: Thumb, next: number): void {
    if (thumb === 'end') {
      this.endValue.set(next);
    } else {
      this.value.set(next);
    }
  }

  private toPct(value: number): number {
    const range = this.max() - this.min() || 1;
    return ((value - this.min()) / range) * 100;
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
