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

type AutocompleteValue = string | readonly string[];

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

/** Height and font size of the autocomplete input. */
export type AutocompleteSize = 'sm' | 'default' | 'lg';
const AC_SIZE: Record<AutocompleteSize, string> = {
  sm: 'h-8 text-xs',
  default: 'h-9 text-sm',
  lg: 'h-11 text-base',
};

/** A free-text input with a filtered suggestion list. */
@Component({
  selector: 'bui-autocomplete',
  host: {
    'data-slot': 'autocomplete',
    '[class]': 'computedClass()',
    '(document:click)': 'onDocumentClick($event)',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BuiAutocomplete), multi: true },
  ],
  template: `
    @if (multiple()) {
      <div [class]="boxClass()">
        @for (chip of values(); track chip) {
          <span
            class="inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground"
          >
            {{ chip }}
            <button
              type="button"
              class="text-muted-foreground hover:text-foreground"
              [attr.aria-label]="'Remove ' + chip"
              (click)="removeChip(chip); $event.stopPropagation()"
            >
              <svg
                class="size-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </span>
        }
        <input
          type="text"
          role="combobox"
          aria-autocomplete="list"
          [attr.aria-expanded]="open()"
          [attr.aria-controls]="listId"
          [value]="value()"
          [placeholder]="values().length > 0 ? '' : placeholder()"
          [disabled]="disabled()"
          [attr.name]="name() || null"
          class="min-w-24 flex-1 bg-transparent text-sm outline-none disabled:cursor-not-allowed"
          (input)="onInput($event)"
          (focus)="open.set(true)"
          (keydown)="onKeydown($event)"
        />
      </div>
    } @else {
      @if (icon(); as icon) {
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        >
          <path [attr.d]="icon" />
        </svg>
      }
      <input
        type="text"
        role="combobox"
        aria-autocomplete="list"
        [attr.aria-expanded]="open()"
        [attr.aria-controls]="listId"
        [value]="value()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [attr.name]="name() || null"
        [class]="inputClass()"
        (input)="onInput($event)"
        (focus)="open.set(true)"
        (keydown)="onKeydown($event)"
      />
    }
    @if (open() && filtered().length > 0) {
      <ul
        [id]="listId"
        role="listbox"
        [attr.aria-multiselectable]="multiple() ? true : null"
        class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md"
      >
        @for (option of filtered(); track option; let i = $index) {
          <li
            role="option"
            [attr.aria-selected]="i === active()"
            class="cursor-default rounded-sm px-2 py-1.5 text-sm"
            [class]="i === active() ? 'bg-accent text-accent-foreground' : ''"
            (click)="choose(option)"
            (mouseenter)="active.set(i)"
          >
            {{ option }}
          </li>
        }
      </ul>
    } @else if (open() && value() !== '') {
      <div
        class="absolute z-50 mt-1 w-full rounded-md border bg-popover p-3 text-sm text-muted-foreground shadow-md"
      >
        {{ empty() }}
      </div>
    }
  `,
})
export class BuiAutocomplete implements ControlValueAccessor {
  /** Current text in the input. Two-way bindable with `[(value)]`. */
  readonly value = model('');
  /** Pick several values, shown as removable chips; binds `values`. */
  readonly multiple = input(false);
  /** Selected values shown as chips (multiple mode). Two-way bindable with `[(values)]`. */
  readonly values = model<readonly string[]>([]);
  /** Suggestions to filter against the typed text. */
  readonly options = input<readonly string[]>([]);
  /** Placeholder text for the input. */
  readonly placeholder = input('Search...');
  /** Message shown when no suggestion matches. */
  readonly empty = input('No results found.');
  /** Whether the input is disabled. Two-way bindable with `[(disabled)]`. */
  readonly disabled = model(false);
  /** Native `name` attribute for the input. */
  readonly name = input('');
  /** Height and font size of the input. */
  readonly size = input<AutocompleteSize>('default');
  /** Optional leading icon, given as an SVG path `d` string. */
  readonly icon = input('');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly inputClass = computed(() =>
    cn(
      'w-full rounded-md border border-input bg-transparent shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
      AC_SIZE[this.size()],
      this.icon() ? 'pr-3 pl-9' : 'px-3',
    ),
  );
  protected readonly boxClass = computed(() =>
    cn(
      'flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-transparent px-2 py-1 shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
    ),
  );

  private onChange: (value: AutocompleteValue) => void = noop;
  protected onTouched: () => void = noop;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly listId = inject(_IdGenerator).getId('bui-autocomplete-');
  protected readonly open = signal(false);
  protected readonly active = signal(0);
  protected readonly filtered = computed(() => {
    const query = this.value().trim().toLowerCase();
    const picked = this.values();
    const pool = this.multiple()
      ? this.options().filter((option) => !picked.includes(option))
      : this.options();
    if (query === '') {
      return pool;
    }
    return pool.filter((option) => option.toLowerCase().includes(query));
  });
  protected readonly computedClass = computed(() => cn('relative block', this.userClass()));

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
    this.open.set(true);
    this.active.set(0);
    if (!this.multiple()) {
      this.onChange(this.value());
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    const options = this.filtered();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.open.set(true);
      this.active.set(Math.min(options.length - 1, this.active() + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.active.set(Math.max(0, this.active() - 1));
    } else if (event.key === 'Enter' && this.open() && options.length > 0) {
      event.preventDefault();
      this.choose(options[this.active()]);
    } else if (event.key === 'Escape') {
      this.open.set(false);
    } else if (event.key === 'Backspace' && this.multiple() && this.value() === '') {
      const picked = this.values();
      if (picked.length > 0) {
        this.values.set(picked.slice(0, -1));
        this.onChange(this.values());
      }
    }
  }

  protected choose(option: string): void {
    if (this.multiple()) {
      if (!this.values().includes(option)) {
        this.values.set([...this.values(), option]);
      }
      this.value.set('');
      this.active.set(0);
      this.onChange(this.values());
      return;
    }
    this.value.set(option);
    this.open.set(false);
    this.onChange(option);
  }

  protected removeChip(chip: string): void {
    this.values.set(this.values().filter((value) => value !== chip));
    this.onChange(this.values());
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (!(this.open() && !this.host.nativeElement.contains(event.target as Node))) {
      return;
    }

    this.open.set(false);
    this.onTouched();
  }

  writeValue(value: AutocompleteValue | null): void {
    if (this.multiple()) {
      this.values.set(Array.isArray(value) ? [...(value as readonly string[])] : []);
    } else {
      this.value.set(typeof value === 'string' ? value : '');
    }
  }

  registerOnChange(callback: (value: AutocompleteValue) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
