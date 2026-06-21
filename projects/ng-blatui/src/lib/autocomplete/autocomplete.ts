import { _IdGenerator } from '@angular/cdk/a11y';
import { Component, computed, ElementRef, inject, input, model, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

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
  template: `
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
    @if (open() && filtered().length > 0) {
      <ul
        [id]="listId"
        role="listbox"
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
export class BuiAutocomplete {
  readonly value = model('');
  readonly options = input<readonly string[]>([]);
  readonly placeholder = input('Search...');
  readonly empty = input('No results found.');
  readonly disabled = input(false);
  readonly name = input('');
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

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly listId = inject(_IdGenerator).getId('bui-autocomplete-');
  protected readonly open = signal(false);
  protected readonly active = signal(0);
  protected readonly filtered = computed(() => {
    const query = this.value().trim().toLowerCase();
    if (query === '') {
      return this.options();
    }
    return this.options().filter((option) => option.toLowerCase().includes(query));
  });
  protected readonly computedClass = computed(() => cn('relative block', this.userClass()));

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
    this.open.set(true);
    this.active.set(0);
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
    }
  }

  protected choose(option: string): void {
    this.value.set(option);
    this.open.set(false);
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
