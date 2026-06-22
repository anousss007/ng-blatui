import { Component, computed, forwardRef, input, model } from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { type ClassValue, cn } from '../utils/cn';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

const SWITCH_BASE =
  'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50';

const SWITCH_TRACK = {
  sm: 'h-4 w-7',
  default: 'h-[1.15rem] w-8',
  lg: 'h-6 w-10',
} as const;

const SWITCH_THUMB = {
  sm: 'size-3.5',
  default: 'size-4',
  lg: 'size-5',
} as const;

const THUMB_BASE =
  'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0';

export type SwitchSize = keyof typeof SWITCH_TRACK;

/**
 * BlatUI switch. A native `<button role="switch">` with `[(checked)]` two-way
 * binding; keyboard activation (Space/Enter) and focus come from the native button.
 */
@Component({
  selector: 'button[buiSwitch]',
  host: {
    type: 'button',
    role: 'switch',
    'data-slot': 'switch',
    '[attr.aria-checked]': 'checked()',
    '[attr.data-state]': 'state()',
    '[disabled]': 'disabled()',
    '[class]': 'computedClass()',
    '(click)': 'toggle()',
    '(blur)': 'onTouched()',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BuiSwitch), multi: true },
  ],
  template: `
    <span data-slot="switch-thumb" [attr.data-state]="state()" [class]="thumbClass()">
      @if (activeIcon(); as icon) {
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="size-full p-[3px] text-muted-foreground"
        >
          <path [attr.d]="icon" />
        </svg>
      }
    </span>
  `,
})
export class BuiSwitch implements ControlValueAccessor {
  readonly checked = model(false);
  readonly disabled = model(false);
  readonly size = input<SwitchSize>('default');
  /** Optional SVG path `d` shown inside the thumb when checked. */
  readonly iconOn = input('');
  /** Optional SVG path `d` shown inside the thumb when unchecked. */
  readonly iconOff = input('');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private onChange: (isChecked: boolean) => void = noop;
  protected onTouched: () => void = noop;

  protected readonly state = computed(() => (this.checked() ? 'checked' : 'unchecked'));
  protected readonly activeIcon = computed(() => (this.checked() ? this.iconOn() : this.iconOff()));
  protected readonly computedClass = computed(() =>
    cn(SWITCH_BASE, SWITCH_TRACK[this.size()], this.userClass()),
  );
  protected readonly thumbClass = computed(() =>
    cn(THUMB_BASE, 'grid place-items-center', SWITCH_THUMB[this.size()]),
  );

  protected toggle(): void {
    if (this.disabled()) {
      return;
    }
    this.checked.update((value) => !value);
    this.onChange(this.checked());
    this.onTouched();
  }

  writeValue(isChecked: boolean | null | undefined): void {
    this.checked.set(!!isChecked);
  }

  registerOnChange(callback: (isChecked: boolean) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
