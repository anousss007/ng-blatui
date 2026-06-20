import { Component, computed, input, model } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

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
  },
  template: `
    <span data-slot="switch-thumb" [attr.data-state]="state()" [class]="thumbClass()"></span>
  `,
})
export class BuiSwitch {
  readonly checked = model(false);
  readonly disabled = input(false);
  readonly size = input<SwitchSize>('default');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly state = computed(() => (this.checked() ? 'checked' : 'unchecked'));
  protected readonly computedClass = computed(() =>
    cn(SWITCH_BASE, SWITCH_TRACK[this.size()], this.userClass()),
  );
  protected readonly thumbClass = computed(() => cn(THUMB_BASE, SWITCH_THUMB[this.size()]));

  protected toggle(): void {
    if (this.disabled()) {
      return;
    }
    this.checked.update((value) => !value);
  }
}
