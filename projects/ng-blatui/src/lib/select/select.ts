import { _IdGenerator } from '@angular/cdk/a11y';
import {
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { type ClassValue, cn } from '../utils/cn';

type SelectValue = string | readonly string[];

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

export interface SelectOption {
  /** Value stored when this option is selected. */
  value: string;
  /** Text shown for this option. */
  label: string;
  /** Whether this option cannot be selected. */
  disabled?: boolean;
  /** Optional leading icon, given as an SVG path `d` string. */
  icon?: string;
  /** Optional group label; consecutive options sharing a group get a header. */
  group?: string;
}

/**
 * An accessible select (combobox + listbox) using the `aria-activedescendant` pattern:
 * focus stays on the trigger while arrows move the active option. Full keyboard support
 * (arrows, Home/End, Enter, Escape) and outside-click close. SSR-safe.
 */
@Component({
  selector: 'bui-select',
  host: {
    'data-slot': 'select',
    '[class]': 'computedClass()',
    '(document:click)': 'onDocumentClick($event)',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BuiSelect), multi: true },
  ],
  template: `
    <button
      type="button"
      role="combobox"
      [attr.aria-expanded]="open()"
      aria-haspopup="listbox"
      [attr.aria-controls]="listId"
      [attr.aria-activedescendant]="open() ? listId + '-' + active() : null"
      [attr.data-placeholder]="selectedLabel() ? null : ''"
      [disabled]="disabled()"
      class="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground"
      (click)="toggle()"
      (keydown)="onKeydown($event)"
    >
      <span class="flex min-w-0 items-center gap-2 truncate">
        @if (selectedOption()?.icon; as icon) {
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            class="size-4 shrink-0"
          >
            <path [attr.d]="icon" />
          </svg>
        }
        {{ selectedLabel() || placeholder() }}
      </span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="size-4 opacity-50"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
    @if (open()) {
      <ul
        [id]="listId"
        role="listbox"
        [attr.aria-multiselectable]="multiple() ? true : null"
        class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
      >
        @for (option of options(); track option.value; let i = $index) {
          @if (option.group && option.group !== options()[i - 1]?.group) {
            <li role="presentation" class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              {{ option.group }}
            </li>
          }
          <li
            [id]="listId + '-' + i"
            role="option"
            [attr.aria-selected]="isSelected(option.value)"
            [attr.aria-disabled]="option.disabled ? true : null"
            class="relative flex cursor-default items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none"
            [class]="i === active() ? 'bg-accent text-accent-foreground' : ''"
            (click)="select(option)"
            (mouseenter)="active.set(i)"
          >
            <span class="flex min-w-0 items-center gap-2 truncate">
              @if (option.icon; as icon) {
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  class="size-4 shrink-0"
                >
                  <path [attr.d]="icon" />
                </svg>
              }
              {{ option.label }}
            </span>
            @if (isSelected(option.value)) {
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
                class="size-4"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            }
          </li>
        }
      </ul>
    }
  `,
})
export class BuiSelect implements ControlValueAccessor {
  /** Selected option value (single mode). Two-way bindable with `[(value)]`. */
  readonly value = model('');
  /** Select several options; binds `values` instead of `value`. */
  readonly multiple = input(false);
  /** Selected option values (multiple mode). Two-way bindable with `[(values)]`. */
  readonly values = model<readonly string[]>([]);
  /** Available options to choose from. */
  readonly options = input<readonly SelectOption[]>([]);
  /** Text shown on the trigger when nothing is selected. */
  readonly placeholder = input('Select…');
  /** Whether the select is disabled. Two-way bindable with `[(disabled)]`. */
  readonly disabled = model(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private onChange: (value: SelectValue) => void = noop;
  private onTouched: () => void = noop;

  protected readonly listId = inject(_IdGenerator).getId('bui-select-');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly open = signal(false);
  protected readonly active = signal(0);
  protected readonly selectedOption = computed(() =>
    this.options().find((option) => option.value === this.value()),
  );
  protected readonly selectedLabel = computed(() => {
    if (this.multiple()) {
      const chosen = this.values();
      return this.options()
        .filter((option) => chosen.includes(option.value))
        .map((option) => option.label)
        .join(', ');
    }
    return this.selectedOption()?.label ?? '';
  });
  protected readonly computedClass = computed(() => cn('relative block', this.userClass()));

  protected isSelected(value: string): boolean {
    return this.multiple() ? this.values().includes(value) : value === this.value();
  }

  protected toggle(): void {
    if (this.open()) {
      this.close();
    } else {
      this.openList();
    }
  }

  protected select(option: SelectOption): void {
    if (option.disabled) {
      return;
    }
    if (this.multiple()) {
      const next = new Set(this.values());
      if (next.has(option.value)) {
        next.delete(option.value);
      } else {
        next.add(option.value);
      }
      this.values.set([...next]);
      this.onChange([...next]);
      return;
    }
    this.value.set(option.value);
    this.onChange(option.value);
    this.close();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }
    if (!this.open()) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        this.openList();
      }
      return;
    }
    const options = this.options();
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        this.active.set(Math.min(options.length - 1, this.active() + 1));
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        this.active.set(Math.max(0, this.active() - 1));
        break;
      }
      case 'Home': {
        event.preventDefault();
        this.active.set(0);
        break;
      }
      case 'End': {
        event.preventDefault();
        this.active.set(options.length - 1);
        break;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        if (options.length > 0) {
          this.select(options[this.active()]);
        }
        break;
      }
      case 'Escape': {
        event.preventDefault();
        this.close();
        break;
      }
      default: {
        break;
      }
    }
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  private openList(): void {
    const current = this.options().findIndex((option) => option.value === this.value());
    this.active.set(current === -1 ? 0 : current);
    this.open.set(true);
  }

  private close(): void {
    if (this.open()) {
      this.onTouched();
    }
    this.open.set(false);
  }

  writeValue(value: SelectValue | null): void {
    if (this.multiple()) {
      this.values.set(Array.isArray(value) ? [...(value as readonly string[])] : []);
    } else {
      this.value.set(typeof value === 'string' ? value : '');
    }
  }

  registerOnChange(callback: (value: SelectValue) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
