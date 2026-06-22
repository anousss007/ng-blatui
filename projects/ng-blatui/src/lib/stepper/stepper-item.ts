import { Component, computed, inject, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

import { BuiStepper } from './stepper';

const INDICATOR: Record<string, string> = {
  completed: 'bg-primary text-primary-foreground border-primary',
  active: 'border-primary text-primary',
  inactive: 'text-muted-foreground',
};

/** A single step within a `bui-stepper`. Resolves completed/active/inactive from the parent. */
@Component({
  selector: 'li[buiStepperItem]',
  host: {
    'data-slot': 'stepper-item',
    '[class]': 'computedClass()',
    '[attr.data-state]': 'state()',
  },
  template: `
    <span
      class="flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium"
      [class]="indicatorClass()"
    >
      @if (state() === 'completed') {
        <svg
          class="size-4"
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
      } @else {
        {{ step() }}
      }
    </span>
    <span
      class="ms-2 text-sm"
      [class]="state() === 'inactive' ? 'text-muted-foreground' : 'font-medium'"
    >
      <ng-content />
    </span>
  `,
})
export class BuiStepperItem {
  /** This item's 1-based position; compared against the parent's value to derive its state. */
  readonly step = input(1);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly stepper = inject(BuiStepper);
  protected readonly state = computed(() => {
    const current = this.stepper.value();
    if (current > this.step()) {
      return 'completed';
    }
    if (current === this.step()) {
      return 'active';
    }
    return 'inactive';
  });
  protected readonly indicatorClass = computed(() => INDICATOR[this.state()]);
  protected readonly computedClass = computed(() => cn('flex items-center', this.userClass()));
}
