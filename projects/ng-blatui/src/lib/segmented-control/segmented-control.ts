import { Component, computed, ElementRef, inject, input, model } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export interface SegmentOption {
  value: string;
  label: string;
}

/** A single-select segmented control (`role="radiogroup"`) with arrow-key navigation. */
@Component({
  selector: 'bui-segmented-control',
  host: {
    'data-slot': 'segmented-control',
    role: 'radiogroup',
    '[class]': 'computedClass()',
    '(keydown)': 'onKeydown($event)',
  },
  template: `
    @for (option of normalized(); track option.value) {
      <button
        type="button"
        role="radio"
        [attr.aria-checked]="value() === option.value"
        [attr.tabindex]="tabindexFor(option.value)"
        [disabled]="disabled()"
        class="rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
        [class]="
          value() === option.value
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        "
        (click)="select(option.value)"
      >
        {{ option.label }}
      </button>
    }
  `,
})
export class BuiSegmentedControl {
  readonly value = model('');
  readonly options = input<readonly (SegmentOption | string)[]>([]);
  readonly disabled = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly normalized = computed<SegmentOption[]>(() =>
    this.options().map((option) =>
      typeof option === 'string' ? { value: option, label: option } : option,
    ),
  );
  protected readonly computedClass = computed(() =>
    cn('inline-flex items-center gap-1 rounded-lg bg-muted p-1', this.userClass()),
  );

  protected select(next: string): void {
    if (!this.disabled()) {
      this.value.set(next);
    }
  }

  protected tabindexFor(optionValue: string): number {
    if (this.value() === optionValue) {
      return 0;
    }
    return this.value() === '' && this.normalized().at(0)?.value === optionValue ? 0 : -1;
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (
      this.disabled() ||
      !['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(event.key)
    ) {
      return;
    }
    event.preventDefault();
    const items = this.normalized();
    if (items.length === 0) {
      return;
    }
    const current = Math.max(
      0,
      items.findIndex((option) => option.value === this.value()),
    );
    const isForward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
    const nextIndex = (current + (isForward ? 1 : -1) + items.length) % items.length;
    this.value.set(items[nextIndex].value);
    const buttons = this.host.nativeElement.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    buttons[nextIndex].focus();
  }
}
