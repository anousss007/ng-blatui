import { _IdGenerator } from '@angular/cdk/a11y';
import { Component, computed, forwardRef, inject, input, model } from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BuiField, BuiFieldDescription, BuiFieldError, BuiFieldLabel } from '../field/field';
import { BuiInput, type InputSize } from '../input/input';
import { type ClassValue, cn } from '../utils/cn';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

/**
 * A batteries-included text field: label, control, hint and error wired together with the right
 * `for` / `id` / `aria-describedby` / `aria-invalid` relationships, on top of the `buiField` +
 * `buiInput` primitives. Reach for the primitives directly when you need a custom layout.
 *
 * ```html
 * <bui-input-field label="Email" hint="We'll never share it." type="email" [(value)]="email" />
 * ```
 */
@Component({
  selector: 'bui-input-field',
  host: { 'data-slot': 'input-field', '[class]': 'computedClass()' },
  imports: [BuiField, BuiFieldLabel, BuiFieldDescription, BuiFieldError, BuiInput],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BuiInputField), multi: true },
  ],
  template: `
    <div buiField [attr.data-invalid]="error() ? true : null">
      @if (label()) {
        <label buiFieldLabel [for]="resolvedId">
          {{ label() }}
          @if (required()) {
            <span class="text-destructive" aria-hidden="true">*</span>
          }
        </label>
      }
      <input
        buiInput
        [id]="resolvedId"
        [type]="type()"
        [size]="size()"
        [value]="value()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [required]="required()"
        [attr.name]="name() || null"
        [attr.autocomplete]="autocomplete() || null"
        [attr.inputmode]="inputmode() || null"
        [attr.aria-label]="!label() && ariaLabel() ? ariaLabel() : null"
        [attr.aria-invalid]="error() ? true : null"
        [attr.aria-describedby]="describedBy()"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />
      @if (error()) {
        <p buiFieldError [id]="errorId">{{ error() }}</p>
      } @else if (hint()) {
        <p buiFieldDescription [id]="hintId">{{ hint() }}</p>
      }
    </div>
  `,
})
export class BuiInputField implements ControlValueAccessor {
  /** The field value. Two-way bindable with `[(value)]`. */
  readonly value = model('');
  /** Visible label. When empty, pass `aria-label` for an accessible name. */
  readonly label = input('');
  /** Helper text shown below the control while there is no error. */
  readonly hint = input('');
  /** Error message; when set, the control is marked invalid and this replaces the hint. */
  readonly error = input('');
  /** Native input type (`text`, `email`, `password`, `number`, …). */
  readonly type = input('text');
  /** Placeholder shown when the field is empty. */
  readonly placeholder = input('');
  /** Whether the field is required (adds a marker and the `required` attribute). */
  readonly required = input(false);
  /** Whether the field is disabled. Two-way bindable with `[(disabled)]`. */
  readonly disabled = model(false);
  /** Size preset controlling input height, padding and text size. */
  readonly size = input<InputSize>('default');
  /** Native `name` attribute. */
  readonly name = input('');
  /** Native `autocomplete` attribute. */
  readonly autocomplete = input('');
  /** Native `inputmode` attribute. */
  readonly inputmode = input('');
  /** Accessible name applied to the input when there is no visible `label`. */
  readonly ariaLabel = input<string>('', { alias: 'aria-label' });
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly ids = inject(_IdGenerator);
  protected readonly resolvedId = this.ids.getId('bui-input-field-');
  protected readonly hintId = this.ids.getId('bui-input-field-hint-');
  protected readonly errorId = this.ids.getId('bui-input-field-error-');

  protected onChange: (value: string) => void = noop;
  protected onTouched: () => void = noop;

  protected readonly describedBy = computed(() => {
    if (this.error()) {
      return this.errorId;
    }
    return this.hint() ? this.hintId : null;
  });
  protected readonly computedClass = computed(() => cn('block', this.userClass()));

  protected onInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this.value.set(next);
    this.onChange(next);
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(callback: (value: string) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
