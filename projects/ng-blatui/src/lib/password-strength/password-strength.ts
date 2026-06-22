import { Component, computed, input, model, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const STRENGTH = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'] as const;
const BAR_COLORS = [
  'bg-red-500',
  'bg-red-500',
  'bg-amber-500',
  'bg-yellow-500',
  'bg-emerald-500',
] as const;
const TEXT_COLORS = [
  'text-red-600',
  'text-red-600',
  'text-amber-600',
  'text-yellow-600',
  'text-emerald-600',
] as const;

/** A password field with a live strength meter and (optional) requirement checklist. */
@Component({
  selector: 'bui-password-strength',
  host: { 'data-slot': 'password-strength', '[class]': 'computedClass()' },
  template: `
    <div class="relative">
      <input
        [type]="show() ? 'text' : 'password'"
        [value]="password()"
        [attr.name]="name()"
        [id]="fieldId()"
        [placeholder]="placeholder()"
        [attr.aria-label]="label()"
        class="h-9 w-full rounded-md border border-input bg-transparent px-3 pe-10 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        (input)="onInput($event)"
      />
      <button
        type="button"
        class="absolute end-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        [attr.aria-label]="show() ? 'Hide password' : 'Show password'"
        (click)="show.set(!show())"
      >
        <svg
          class="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    </div>
    <div class="mt-2 flex gap-1" aria-hidden="true">
      @for (bar of bars; track bar) {
        <div
          class="h-1 flex-1 rounded-full transition-colors"
          [class]="bar < score() ? barColor() : 'bg-muted'"
        ></div>
      }
    </div>
    <p class="mt-1 text-xs" [class]="textColor()">{{ password() ? strengthLabel() : '' }}</p>
    @if (showChecklist()) {
      <ul class="mt-2 space-y-1 text-xs">
        @for (rule of rules(); track rule.label) {
          <li
            class="flex items-center gap-1.5"
            [class]="rule.met ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'"
          >
            <svg
              class="size-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {{ rule.label }}
          </li>
        }
      </ul>
    }
  `,
})
export class BuiPasswordStrength {
  /** Current password value. Two-way bindable with `[(password)]`. */
  readonly password = model('');
  /** Native `name` attribute for the input. */
  readonly name = input('password');
  /** Input `id`; defaults to `name` when empty. */
  readonly id = input('');
  /** Placeholder text for the input. */
  readonly placeholder = input('••••••••');
  /** Whether the requirement checklist is shown. */
  readonly showChecklist = input(true);
  /** Minimum length required to satisfy the length rule. */
  readonly minLength = input(8);
  /** Accessible label for the input. */
  readonly label = input('Password');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly show = signal(false);
  protected readonly bars = [0, 1, 2, 3];
  protected readonly fieldId = computed(() => this.id() || this.name());
  protected readonly rules = computed(() => {
    const value = this.password();
    return [
      { label: `At least ${this.minLength()} characters`, met: value.length >= this.minLength() },
      { label: 'An uppercase letter', met: /[A-Z]/.test(value) },
      { label: 'A number', met: /\d/.test(value) },
      { label: 'A symbol', met: /[^a-zA-Z0-9]/.test(value) },
    ];
  });
  protected readonly score = computed(() => this.rules().filter((rule) => rule.met).length);
  protected readonly strengthLabel = computed(() => STRENGTH[this.score()]);
  protected readonly barColor = computed(() => BAR_COLORS[this.score()]);
  protected readonly textColor = computed(() => TEXT_COLORS[this.score()]);
  protected readonly computedClass = computed(() => cn('block w-full max-w-sm', this.userClass()));

  protected onInput(event: Event): void {
    this.password.set((event.target as HTMLInputElement).value);
  }
}
