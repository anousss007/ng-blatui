import {
  Component,
  computed,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { type ClassValue, cn } from '../utils/cn';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

/**
 * BlatUI radio group. `role="radiogroup"` with arrow-key roving focus across the
 * `buiRadioItem` buttons; `[(value)]` two-way binds the selected value.
 */
@Directive({
  selector: '[buiRadioGroup]',
  exportAs: 'buiRadioGroup',
  host: {
    role: 'radiogroup',
    'data-slot': 'radio-group',
    '[class]': 'computedClass()',
    '(keydown)': 'onKeydown($event)',
    '(focusout)': 'onTouched()',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BuiRadioGroup), multi: true },
  ],
})
export class BuiRadioGroup implements ControlValueAccessor {
  readonly value = model<string | null>(null);
  readonly disabled = model(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private onChange: (value: string | null) => void = noop;
  protected onTouched: () => void = noop;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly computedClass = computed(() => cn('grid gap-3', this.userClass()));

  select(next: string): void {
    this.value.set(next);
    this.onChange(next);
  }

  writeValue(value: string | null): void {
    this.value.set(typeof value === 'string' ? value : null);
  }

  registerOnChange(callback: (value: string | null) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) {
      return;
    }
    event.preventDefault();
    const items = [
      ...this.host.nativeElement.querySelectorAll<HTMLButtonElement>(
        '[role="radio"]:not([disabled])',
      ),
    ];
    if (items.length === 0) {
      return;
    }
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    const isForward = event.key === 'ArrowDown' || event.key === 'ArrowRight';
    const next = items[(current + (isForward ? 1 : -1) + items.length) % items.length];
    next.focus();
    next.click();
  }
}

const ITEM =
  'border-input text-primary dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex aspect-square size-4 shrink-0 items-center justify-center rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50';

@Component({
  selector: 'button[buiRadioItem]',
  host: {
    type: 'button',
    role: 'radio',
    'data-slot': 'radio-group-item',
    '[attr.aria-checked]': 'checked()',
    '[attr.data-state]': "checked() ? 'checked' : 'unchecked'",
    '[attr.tabindex]': 'tabIndex()',
    '[disabled]': 'isDisabled()',
    '[class]': 'computedClass()',
    '(click)': 'select()',
  },
  template: `
    @if (checked()) {
      <span data-slot="radio-group-indicator" class="flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="currentColor" class="size-2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
        </svg>
      </span>
    }
  `,
})
export class BuiRadioGroupItem {
  readonly value = input.required<string>();
  readonly disabled = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly group = inject(BuiRadioGroup);
  protected readonly checked = computed(() => this.group.value() === this.value());
  protected readonly isDisabled = computed(() => this.disabled() || this.group.disabled());
  protected readonly tabIndex = computed(() =>
    this.checked() || this.group.value() === null ? 0 : -1,
  );
  protected readonly computedClass = computed(() => cn(ITEM, this.userClass()));

  protected select(): void {
    if (!this.isDisabled()) {
      this.group.select(this.value());
    }
  }
}
