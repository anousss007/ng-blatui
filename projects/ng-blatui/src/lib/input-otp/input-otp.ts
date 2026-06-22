import { Component, computed, ElementRef, forwardRef, inject, input, model } from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { type ClassValue, cn } from '../utils/cn';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

/** A one-time-password input: a row of single-character boxes with focus management + paste. */
@Component({
  selector: 'bui-input-otp',
  host: { 'data-slot': 'input-otp', '[class]': 'computedClass()', '(focusout)': 'onTouched()' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BuiInputOtp), multi: true },
  ],
  template: `
    @for (slot of slots(); track slot) {
      <input
        type="text"
        [attr.inputmode]="alphanumeric() ? 'text' : 'numeric'"
        autocomplete="one-time-code"
        maxlength="1"
        [value]="charAt(slot)"
        [disabled]="disabled()"
        [attr.aria-label]="ariaLabel() + ' character ' + (slot + 1)"
        class="size-10 rounded-md border border-input bg-transparent text-center text-sm font-medium shadow-xs outline-none focus-visible:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
        (input)="onInput(slot, $event)"
        (keydown)="onKeydown(slot, $event)"
        (paste)="onPaste($event)"
        (focus)="onFocus($event)"
      />
      @if (isSeparator(slot)) {
        <span aria-hidden="true" class="text-muted-foreground select-none">-</span>
      }
    }
  `,
})
export class BuiInputOtp implements ControlValueAccessor {
  /** Current code. Two-way bindable with `[(value)]`. */
  readonly value = model('');
  /** Number of character boxes (length of the code). */
  readonly maxlength = input(6);
  /** Whether the input is disabled. Two-way bindable with `[(disabled)]`. */
  readonly disabled = model(false);
  /** Whether to allow letters as well as digits. */
  readonly alphanumeric = input(false);
  /** Insert a visual separator after every N boxes (0 = none). */
  readonly groupSize = input(0);
  /** Base accessible label; each box appends its position. */
  readonly ariaLabel = input('One-time password');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private onChange: (value: string) => void = noop;
  protected onTouched: () => void = noop;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly slots = computed(() =>
    Array.from({ length: this.maxlength() }, (_, index) => index),
  );
  protected readonly computedClass = computed(() =>
    cn('inline-flex items-center gap-2', this.userClass()),
  );

  protected charAt(index: number): string {
    return this.value().charAt(index);
  }

  protected isSeparator(index: number): boolean {
    const size = this.groupSize();
    return size > 0 && (index + 1) % size === 0 && index < this.maxlength() - 1;
  }

  protected onInput(index: number, event: Event): void {
    const element = event.target as HTMLInputElement;
    const char = this.sanitize(element.value).slice(-1);
    const next = (this.value().slice(0, index) + char + this.value().slice(index + 1)).slice(
      0,
      this.maxlength(),
    );
    this.value.set(next);
    this.onChange(next);
    element.value = char;
    if (char !== '' && index < this.maxlength() - 1) {
      this.focusBox(index + 1);
    }
  }

  protected onKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && this.charAt(index) === '' && index > 0) {
      this.focusBox(index - 1);
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.focusBox(index - 1);
    } else if (event.key === 'ArrowRight' && index < this.maxlength() - 1) {
      event.preventDefault();
      this.focusBox(index + 1);
    }
  }

  protected onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = this.sanitize(event.clipboardData?.getData('text') ?? '').slice(
      0,
      this.maxlength(),
    );
    this.value.set(text);
    this.onChange(text);
    this.focusBox(Math.min(text.length, this.maxlength() - 1));
  }

  protected onFocus(event: Event): void {
    (event.target as HTMLInputElement).select();
  }

  writeValue(value: string | null | undefined): void {
    this.value.set(typeof value === 'string' ? value : '');
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

  private sanitize(raw: string): string {
    return this.alphanumeric() ? raw.replaceAll(/[^a-zA-Z0-9]/g, '') : raw.replaceAll(/\D/g, '');
  }

  private focusBox(index: number): void {
    const boxes = this.host.nativeElement.querySelectorAll<HTMLInputElement>('input');
    boxes.item(index).focus();
  }
}
