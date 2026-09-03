import {
  Component,
  computed,
  type ElementRef,
  forwardRef,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { type ClassValue, cn } from '../utils/cn';
import { buiSnap, buiStep } from '../utils/number';

type Thumb = 'start' | 'end';

/** What a `range` slider reads and writes through a form binding: `[low, high]`. */
export type SliderRange = readonly [number, number];

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

/**
 * A slider (`role="slider"`) with pointer drag and full keyboard support
 * (arrows, Home/End, PageUp/PageDown). Single value, or a two-thumb `range`
 * (binds `value` + `endValue`). Horizontal or vertical. SSR-safe — geometry is
 * only read inside browser event handlers.
 *
 * Through a form binding (`formControl`, `ngModel`) a single slider is a `number`, and a
 * `range` slider is the **whole** `[low, high]` pair — both thumbs write it, so the control
 * is never holding one end from before a drag and the other from after.
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
    '(focusout)': 'onTouched()',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BuiSlider), multi: true },
  ],
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
export class BuiSlider implements ControlValueAccessor {
  /** Current value (lower thumb in range mode). Two-way bindable with `[(value)]`. */
  readonly value = model(0);
  /** Enable a second thumb; binds `endValue` as the upper handle. */
  readonly range = input(false);
  /** Upper thumb value in range mode. Two-way bindable with `[(endValue)]`. */
  readonly endValue = model(100);
  /** Minimum selectable value. */
  readonly min = input(0);
  /** Maximum selectable value. */
  readonly max = input(100);
  /** Increment between selectable values. */
  readonly step = input(1);
  /** Whether the slider is disabled. Two-way bindable with `[(disabled)]`. */
  readonly disabled = model(false);
  /** Layout direction of the slider. */
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  /** Accessible label for the thumb(s). */
  readonly ariaLabel = input('Value');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private onChange: (value: number | SliderRange) => void = noop;
  protected onTouched: () => void = noop;
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
        next = buiStep(current, this.step());
        break;
      }
      case 'ArrowLeft':
      case 'ArrowDown': {
        next = buiStep(current, -this.step());
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
        next = buiStep(current, big);
        break;
      }
      case 'PageDown': {
        next = buiStep(current, -big);
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
    // Both thumbs report. The upper one used to move on screen while the form control heard
    // nothing at all, so a range slider bound to a form only ever reported its lower half.
    this.onChange(this.range() ? [this.value(), this.endValue()] : this.value());
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
    return this.clamp(buiSnap(raw, this.min(), this.step()));
  }

  private clamp(value: number): number {
    return Math.max(this.min(), Math.min(this.max(), value));
  }

  /** Accepts a `number`, or the `[low, high]` pair a `range` slider reads and writes. */
  writeValue(value: number | SliderRange | null | undefined): void {
    if (value === null || value === undefined) {
      this.value.set(0);
      return;
    }
    if (typeof value === 'number') {
      this.value.set(value);
      return;
    }
    this.value.set(value[0]);
    this.endValue.set(value[1]);
  }

  registerOnChange(callback: (value: number | SliderRange) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
