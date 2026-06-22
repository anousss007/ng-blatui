import { Component, computed, forwardRef, input, model } from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { type ClassValue, cn } from '../utils/cn';

export type TimeFieldMode = 'input' | 'select';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

const SELECT_CLASS =
  'h-9 rounded-md border border-input bg-background px-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50';

/** A styled time field: a native `<input type="time">`, or hour/minute selects in `select` mode. */
@Component({
  selector: 'bui-time-field',
  host: {
    'data-slot': 'time-field',
    '[class]': 'computedClass()',
    '(focusout)': 'onTouched()',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BuiTimeField), multi: true },
  ],
  template: `
    @if (mode() === 'select') {
      <div class="inline-flex items-center gap-1">
        <select
          [class]="selectClass"
          [value]="hourPart()"
          [disabled]="disabled()"
          [attr.aria-label]="(ariaLabel() || 'Time') + ' hours'"
          (change)="setHour($event)"
        >
          @for (hour of hours(); track hour) {
            <option [value]="hour">{{ hour }}</option>
          }
        </select>
        <span aria-hidden="true" class="text-muted-foreground">:</span>
        <select
          [class]="selectClass"
          [value]="minutePart()"
          [disabled]="disabled()"
          [attr.aria-label]="(ariaLabel() || 'Time') + ' minutes'"
          (change)="setMinute($event)"
        >
          @for (minute of minutes(); track minute) {
            <option [value]="minute">{{ minute }}</option>
          }
        </select>
      </div>
    } @else {
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
    }
  `,
})
export class BuiTimeField implements ControlValueAccessor {
  readonly value = model('');
  readonly name = input('');
  readonly id = input('');
  readonly min = input('');
  readonly max = input('');
  readonly seconds = input(false);
  readonly disabled = model(false);
  /** `select` renders hour + minute dropdowns instead of a native time input. */
  readonly mode = input<TimeFieldMode>('input');
  /** Minute step used in `select` mode. */
  readonly minuteStep = input(5);
  readonly ariaLabel = input('');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private onChange: (value: string) => void = noop;
  protected onTouched: () => void = noop;
  protected readonly selectClass = SELECT_CLASS;
  protected readonly hourPart = computed(() =>
    (this.value().split(':', 1)[0] || '12').padStart(2, '0'),
  );
  protected readonly minutePart = computed(() =>
    (this.value().split(':', 2)[1] || '00').padStart(2, '0'),
  );
  protected readonly hours = computed(() =>
    Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, '0')),
  );
  protected readonly minutes = computed(() => {
    const step = Math.max(1, this.minuteStep());
    return Array.from({ length: Math.ceil(60 / step) }, (_, index) =>
      String(index * step).padStart(2, '0'),
    );
  });
  protected readonly computedClass = computed(() => cn('inline-block', this.userClass()));

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
    this.onChange(this.value());
  }

  protected setHour(event: Event): void {
    this.value.set(`${(event.target as HTMLSelectElement).value}:${this.minutePart()}`);
    this.onChange(this.value());
  }

  protected setMinute(event: Event): void {
    this.value.set(`${this.hourPart()}:${(event.target as HTMLSelectElement).value}`);
    this.onChange(this.value());
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
