import { Component, computed, ElementRef, inject, input, model } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export interface VariantOption {
  /** Unique value used as the selection identity. */
  value: string;
  /** Display text; defaults to the value when omitted. */
  label?: string;
  /** CSS colour for the swatch when type is `color`. */
  color?: string;
  /** Whether this option cannot be selected. */
  disabled?: boolean;
}

interface NormalizedVariant {
  value: string;
  label: string;
  color?: string;
  disabled?: boolean;
}

/** A radio-group of product variants, rendered as pills or colour swatches. */
@Component({
  selector: 'bui-variant-selector',
  host: {
    'data-slot': 'variant-selector',
    role: 'radiogroup',
    '[attr.aria-label]': 'label()',
    '[class]': 'computedClass()',
    '(keydown)': 'onKeydown($event)',
  },
  template: `
    @for (option of normalized(); track option.value; let i = $index) {
      <button
        type="button"
        role="radio"
        [attr.aria-checked]="option.value === value()"
        [attr.aria-label]="option.label"
        [attr.title]="type() === 'color' ? option.label : null"
        [attr.tabindex]="i === activeIndex() ? 0 : -1"
        [disabled]="option.disabled || disabled()"
        [class]="optionClass(option)"
        (click)="select(option)"
      >
        @if (type() === 'color') {
          <span class="size-5 rounded-full" [style.background]="option.color"></span>
        } @else {
          {{ option.label }}
        }
      </button>
    }
  `,
})
export class BuiVariantSelector {
  /** Selected variant value. Two-way bindable with `[(value)]`. */
  readonly value = model('');
  /** Available options, as plain strings or `VariantOption` objects. */
  readonly options = input<readonly (string | VariantOption)[]>([]);
  /** Render style: text pills or colour swatches. */
  readonly type = input<'pill' | 'color'>('pill');
  /** Accessible label for the radio group. */
  readonly label = input('Variant');
  /** Whether the whole group is disabled. */
  readonly disabled = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly normalized = computed<NormalizedVariant[]>(() =>
    this.options().map((option) =>
      typeof option === 'string'
        ? { value: option, label: option }
        : {
            value: option.value,
            label: option.label ?? option.value,
            color: option.color,
            disabled: option.disabled,
          },
    ),
  );
  protected readonly activeIndex = computed(() => {
    const index = this.normalized().findIndex((option) => option.value === this.value());
    return index === -1 ? 0 : index;
  });
  protected readonly computedClass = computed(() =>
    cn('inline-flex flex-wrap items-center gap-2', this.userClass()),
  );

  protected select(option: NormalizedVariant): void {
    if (!option.disabled && !this.disabled()) {
      this.value.set(option.value);
    }
  }

  protected optionClass(option: NormalizedVariant): string {
    const isSelected = option.value === this.value();
    if (this.type() === 'color') {
      return cn(
        'inline-flex items-center justify-center rounded-full p-0.5 transition-shadow outline-none disabled:opacity-50',
        isSelected
          ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
          : 'ring-1 ring-border',
      );
    }
    return cn(
      'inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium transition-colors outline-none disabled:opacity-50',
      isSelected ? 'border-primary bg-primary/5 text-primary' : 'border-input hover:bg-accent',
    );
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) {
      return;
    }
    event.preventDefault();
    const options = this.normalized();
    const enabled = options
      .map((option, index) => ({ option, index }))
      .filter((entry) => !entry.option.disabled && !this.disabled())
      .map((entry) => entry.index);
    if (enabled.length === 0) {
      return;
    }
    const delta = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
    const current = enabled.indexOf(this.activeIndex());
    const base = current === -1 ? 0 : current;
    const nextPosition = (base + delta + enabled.length) % enabled.length;
    const targetIndex = enabled[nextPosition];
    this.value.set(options[targetIndex].value);
    this.host.nativeElement
      .querySelectorAll<HTMLButtonElement>('[role="radio"]')
      .item(targetIndex)
      .focus();
  }
}
