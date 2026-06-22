import { Component, computed, ElementRef, inject, input, model } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const DIMS = {
  sm: { box: 'size-16', text: 'text-sm' },
  default: { box: 'size-24', text: 'text-base' },
  lg: { box: 'size-32', text: 'text-lg' },
} as const;
const RADIUS = 46;
const CIRC = 2 * Math.PI * RADIUS;
const ARC = CIRC * 0.75;

/** A rotary dial input (role="slider"). Drag, scroll, or use the keyboard. 270° sweep. */
@Component({
  selector: 'bui-knob',
  host: {
    'data-slot': 'knob',
    '[class]': 'computedClass()',
    '(document:pointermove)': 'onMove($event)',
    '(document:pointerup)': 'onUp()',
  },
  template: `
    <div
      role="slider"
      [attr.aria-valuemin]="min()"
      [attr.aria-valuemax]="max()"
      [attr.aria-valuenow]="value()"
      [attr.aria-label]="label()"
      [attr.aria-disabled]="disabled()"
      [attr.tabindex]="disabled() ? -1 : 0"
      class="relative rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      [class]="boxClass()"
      (pointerdown)="onDown($event)"
      (wheel)="onWheel($event)"
      (keydown)="onKeydown($event)"
    >
      <svg viewBox="0 0 100 100" class="size-full" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          [attr.r]="radius"
          fill="none"
          class="stroke-muted"
          stroke-width="8"
          [attr.stroke-dasharray]="dashArray"
          stroke-linecap="round"
          transform="rotate(135 50 50)"
        />
        <circle
          cx="50"
          cy="50"
          [attr.r]="radius"
          fill="none"
          class="stroke-primary transition-[stroke-dashoffset]"
          stroke-width="8"
          [attr.stroke-dasharray]="dashArray"
          [attr.stroke-dashoffset]="dashOffset()"
          stroke-linecap="round"
          transform="rotate(135 50 50)"
        />
      </svg>
      <span
        class="absolute inset-0 flex items-center justify-center font-medium tabular-nums"
        [class]="textClass()"
      >
        {{ display() }}
      </span>
    </div>
  `,
})
export class BuiKnob {
  readonly value = model(50);
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly size = input<keyof typeof DIMS>('default');
  readonly label = input('Value');
  readonly disabled = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly radius = RADIUS;
  protected readonly dashArray = `${ARC} ${CIRC}`;
  private dragging = false;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly ratio = computed(() => {
    const span = this.max() - this.min() || 1;
    return Math.min(1, Math.max(0, (this.value() - this.min()) / span));
  });
  protected readonly dashOffset = computed(() => ARC * (1 - this.ratio()));
  protected readonly display = computed(() =>
    Number.isSafeInteger(this.step())
      ? Math.round(this.value())
      : Number.parseFloat(this.value().toFixed(3)),
  );
  protected readonly boxClass = computed(() => DIMS[this.size()].box);
  protected readonly textClass = computed(() => DIMS[this.size()].text);
  protected readonly computedClass = computed(() => cn('inline-block', this.userClass()));

  protected onDown(event: PointerEvent): void {
    if (this.disabled()) {
      return;
    }
    this.dragging = true;
    this.setFromPointer(event);
  }

  protected onMove(event: PointerEvent): void {
    if (this.dragging) {
      this.setFromPointer(event);
    }
  }

  protected onUp(): void {
    this.dragging = false;
  }

  protected onWheel(event: WheelEvent): void {
    if (this.disabled()) {
      return;
    }
    event.preventDefault();
    this.bump(event.deltaY < 0 ? 1 : -1);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }
    let isHandled = true;
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowRight': {
        this.bump(1);
        break;
      }
      case 'ArrowDown':
      case 'ArrowLeft': {
        this.bump(-1);
        break;
      }
      case 'Home': {
        this.value.set(this.min());
        break;
      }
      case 'End': {
        this.value.set(this.max());
        break;
      }
      case 'PageUp': {
        this.value.set(this.clamp(this.value() + this.bigStep()));
        break;
      }
      case 'PageDown': {
        this.value.set(this.clamp(this.value() - this.bigStep()));
        break;
      }
      default: {
        isHandled = false;
      }
    }
    if (isHandled) {
      event.preventDefault();
    }
  }

  private setFromPointer(event: PointerEvent): void {
    const dial = this.host.nativeElement.querySelector('[role="slider"]');
    if (!dial) {
      return;
    }
    const rect = dial.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = (Math.atan2(event.clientX - cx, cy - event.clientY) * 180) / Math.PI;
    const ratio = Math.min(1, Math.max(0, (angle + 135) / 270));
    this.value.set(this.snap(this.min() + ratio * (this.max() - this.min())));
  }

  private bump(direction: number): void {
    this.value.set(this.clamp(this.value() + direction * this.step()));
  }

  private bigStep(): number {
    return Math.max(this.step(), (this.max() - this.min()) / 10);
  }

  private clamp(value: number): number {
    return Math.max(this.min(), Math.min(this.max(), value));
  }

  private snap(value: number): number {
    const snapped = Math.round((value - this.min()) / this.step()) * this.step() + this.min();
    return Number.parseFloat(this.clamp(snapped).toFixed(6));
  }
}
