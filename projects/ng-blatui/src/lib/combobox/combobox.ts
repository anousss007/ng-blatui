import { _IdGenerator } from '@angular/cdk/a11y';
import { Component, computed, ElementRef, inject, input, model, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export interface ComboboxOption {
  value: string;
  label: string;
  /** Optional leading icon, given as an SVG path `d` string. */
  icon?: string;
}

/**
 * A filterable combobox: a text input (`role="combobox"`, `aria-autocomplete="list"`) over a
 * filtered listbox, using the `aria-activedescendant` pattern. Full keyboard + outside-click.
 */
@Component({
  selector: 'bui-combobox',
  host: {
    'data-slot': 'combobox',
    '[class]': 'computedClass()',
    '(document:click)': 'onDocumentClick($event)',
  },
  template: `
    <input
      type="text"
      role="combobox"
      aria-autocomplete="list"
      [attr.aria-expanded]="open()"
      [attr.aria-controls]="listId"
      [attr.aria-activedescendant]="open() ? listId + '-' + active() : null"
      [value]="display()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [readonly]="!searchable()"
      [class.cursor-pointer]="!searchable()"
      class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
      (input)="onInput($event)"
      (focus)="openList()"
      (keydown)="onKeydown($event)"
    />
    @if (open() && filtered().length > 0) {
      <ul
        [id]="listId"
        role="listbox"
        class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
      >
        @for (option of filtered(); track option.value; let i = $index) {
          <li
            [id]="listId + '-' + i"
            role="option"
            [attr.aria-selected]="option.value === value()"
            class="relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none"
            [class]="i === active() ? 'bg-accent text-accent-foreground' : ''"
            (click)="select(option)"
            (mouseenter)="active.set(i)"
          >
            @if (option.icon; as icon) {
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
                class="mr-2 size-4 shrink-0"
              >
                <path [attr.d]="icon" />
              </svg>
            }
            {{ option.label }}
          </li>
        }
      </ul>
    }
  `,
})
export class BuiCombobox {
  readonly value = model('');
  readonly options = input<readonly ComboboxOption[]>([]);
  readonly placeholder = input('Search…');
  readonly disabled = input(false);
  /** When false, the field can't be typed in — it just opens the full list (select-like). */
  readonly searchable = input(true);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly listId = inject(_IdGenerator).getId('bui-combobox-');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly open = signal(false);
  protected readonly active = signal(0);
  protected readonly query = signal('');
  protected readonly selectedLabel = computed(
    () => this.options().find((option) => option.value === this.value())?.label ?? '',
  );
  protected readonly display = computed(() => (this.open() ? this.query() : this.selectedLabel()));
  protected readonly filtered = computed(() => {
    if (!this.searchable()) {
      return this.options();
    }
    const query = this.query().trim().toLowerCase();
    return query === ''
      ? this.options()
      : this.options().filter((option) => option.label.toLowerCase().includes(query));
  });
  protected readonly computedClass = computed(() => cn('relative block', this.userClass()));

  protected onInput(event: Event): void {
    if (!this.searchable()) {
      return;
    }
    this.query.set((event.target as HTMLInputElement).value);
    this.active.set(0);
    this.open.set(true);
  }

  protected openList(): void {
    this.query.set('');
    this.active.set(0);
    this.open.set(true);
  }

  protected select(option: ComboboxOption): void {
    this.value.set(option.value);
    this.query.set('');
    this.open.set(false);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }
    if (event.key === 'Escape') {
      this.open.set(false);
      return;
    }
    if (!this.open() && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      this.openList();
      return;
    }
    const items = this.filtered();
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        this.active.set(Math.min(items.length - 1, this.active() + 1));
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        this.active.set(Math.max(0, this.active() - 1));
        break;
      }
      case 'Enter': {
        if (this.open() && items.length > 0) {
          event.preventDefault();
          this.select(items[this.active()]);
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (!(this.open() && !this.host.nativeElement.contains(event.target as Node))) {
      return;
    }

    this.open.set(false);
    this.query.set('');
  }
}
