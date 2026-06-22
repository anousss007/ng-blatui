import { _IdGenerator } from '@angular/cdk/a11y';
import { Component, computed, inject, input, model } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A collapsible "reasoning" / chain-of-thought disclosure. */
@Component({
  selector: 'bui-reasoning',
  host: { 'data-slot': 'reasoning', '[class]': 'computedClass()' },
  template: `
    <button
      type="button"
      data-slot="reasoning-trigger"
      class="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      [attr.aria-expanded]="open()"
      [attr.aria-controls]="bodyId"
      (click)="open.set(!open())"
    >
      <svg
        class="size-4 transition-transform"
        [class.rotate-90]="open()"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
      {{ headerLabel() }}
    </button>
    @if (open()) {
      <div [id]="bodyId" class="mt-2 border-s-2 border-border ps-4 text-sm text-muted-foreground">
        <ng-content />
      </div>
    }
  `,
})
export class BuiReasoning {
  /** Whether the disclosure is expanded. Two-way bindable with `[(open)]`. */
  readonly open = model(false);
  /** Trigger label shown when no `duration` is set. */
  readonly label = input('Reasoning');
  /** When set, the trigger reads "Thought for {duration}" instead of `label`. */
  readonly duration = input('');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly bodyId = inject(_IdGenerator).getId('bui-reasoning-');
  protected readonly headerLabel = computed(() =>
    this.duration() ? `Thought for ${this.duration()}` : this.label(),
  );
  protected readonly computedClass = computed(() => cn('block w-full text-sm', this.userClass()));
}
