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
        [attr.aria-multiselectable]="multiple() ? true : null"
        class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
      >
        @for (option of filtered(); track option.value; let i = $index) {
          <li
            [id]="listId + '-' + i"
            role="option"
            [attr.aria-selected]="isSelected(option.value)"
            class="relative flex cursor-default items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none"
            [class]="i === active() ? 'bg-accent text-accent-foreground' : ''"
            (click)="select(option)"
            (mouseenter)="active.set(i)"
          >
            <span class="flex min-w-0 items-center truncate">
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
                class="size-4 shrink-0"
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
export class BuiCombobox {
  readonly value = model('');
  /** Select several options; binds `values` instead of `value`. */
  readonly multiple = input(false);
  readonly values = model<readonly string[]>([]);
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
  protected readonly selectedLabel = computed(() => {
    if (this.multiple()) {
      const chosen = this.values();
      return this.options()
        .filter((option) => chosen.includes(option.value))
        .map((option) => option.label)
        .join(', ');
    }
    return this.options().find((option) => option.value === this.value())?.label ?? '';
  });
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

  protected isSelected(value: string): boolean {
    return this.multiple() ? this.values().includes(value) : value === this.value();
  }

  protected select(option: ComboboxOption): void {
    if (this.multiple()) {
      const next = new Set(this.values());
      if (next.has(option.value)) {
        next.delete(option.value);
      } else {
        next.add(option.value);
      }
      this.values.set([...next]);
      this.query.set('');
      return;
    }
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
