import { Component, computed, input, model } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const CHECKBOX_BASE =
  'peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground data-[state=indeterminate]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center';

/**
 * BlatUI checkbox. A native `<button role="checkbox">` (Space/Enter toggle for free)
 * with `[(checked)]` two-way binding and tri-state `[(indeterminate)]`.
 */
@Component({
  selector: 'button[buiCheckbox]',
  host: {
    type: 'button',
    role: 'checkbox',
    'data-slot': 'checkbox',
    '[attr.aria-checked]': 'ariaChecked()',
    '[attr.data-state]': 'state()',
    '[disabled]': 'disabled()',
    '[class]': 'computedClass()',
    '(click)': 'toggle()',
  },
  template: `
    @if (checked() || indeterminate()) {
      <span data-slot="checkbox-indicator" class="flex items-center justify-center text-current">
        @if (indeterminate()) {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
          </svg>
        } @else {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        }
      </span>
    }
  `,
})
export class BuiCheckbox {
  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly disabled = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly state = computed(() => {
    if (this.indeterminate()) {
      return 'indeterminate';
    }
    return this.checked() ? 'checked' : 'unchecked';
  });
  protected readonly ariaChecked = computed(() =>
    this.indeterminate() ? 'mixed' : String(this.checked()),
  );
  protected readonly computedClass = computed(() => cn(CHECKBOX_BASE, this.userClass()));

  protected toggle(): void {
    if (this.disabled()) {
      return;
    }
    if (this.indeterminate()) {
      this.indeterminate.set(false);
      this.checked.set(true);
    } else {
      this.checked.update((value) => !value);
    }
  }
}
