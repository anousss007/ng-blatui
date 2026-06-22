import { Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { type ClassValue, cn } from '../utils/cn';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

/** A free-text tags input: type and press Enter (or comma) to add chips; Backspace removes. */
@Component({
  selector: 'bui-tags-input',
  host: { 'data-slot': 'tags-input', '[class]': 'computedClass()', '(focusout)': 'onTouched()' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BuiTagsInput), multi: true },
  ],
  template: `
    @for (tag of tags(); track tag; let i = $index) {
      <span
        class="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-sm text-secondary-foreground"
      >
        {{ tag }}
        <button
          type="button"
          class="leading-none opacity-70 hover:text-foreground"
          [attr.aria-label]="'Remove ' + tag"
          [disabled]="disabled()"
          (click)="removeAt(i)"
        >
          ×
        </button>
      </span>
    }
    <input
      [value]="draft()"
      [placeholder]="placeholder()"
      [disabled]="disabled() || atMax()"
      class="min-w-24 flex-1 bg-transparent text-sm outline-none"
      (input)="onInput($event)"
      (keydown)="onKeydown($event)"
    />
  `,
})
export class BuiTagsInput implements ControlValueAccessor {
  readonly tags = model<string[]>([]);
  readonly placeholder = input('Add tag…');
  readonly max = input<number | null>(null);
  readonly disabled = model(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private onChange: (value: readonly string[]) => void = noop;
  protected onTouched: () => void = noop;
  protected readonly draft = signal('');
  protected readonly atMax = computed(() => {
    const max = this.max();
    return max !== null && this.tags().length >= max;
  });
  protected readonly computedClass = computed(() =>
    cn(
      'flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1.5 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
      this.userClass(),
    ),
  );

  protected onInput(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.add();
      return;
    }
    if (event.key === 'Backspace' && this.draft() === '' && this.tags().length > 0) {
      this.removeAt(this.tags().length - 1);
    }
  }

  protected removeAt(index: number): void {
    const next = [...this.tags()];
    next.splice(index, 1);
    this.tags.set(next);
    this.onChange(next);
  }

  private add(): void {
    const value = this.draft().trim();
    this.draft.set('');
    if (value === '' || this.atMax() || this.tags().includes(value)) {
      return;
    }
    const next = [...this.tags(), value];
    this.tags.set(next);
    this.onChange(next);
  }

  writeValue(value: readonly string[] | null): void {
    this.tags.set(Array.isArray(value) ? [...(value as readonly string[])] : []);
  }

  registerOnChange(callback: (value: readonly string[]) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
