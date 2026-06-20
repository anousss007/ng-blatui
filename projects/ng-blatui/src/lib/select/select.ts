import { _IdGenerator } from '@angular/cdk/a11y';
import { Component, computed, ElementRef, inject, input, model, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
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
      <span class="truncate">{{ selectedLabel() || placeholder() }}</span>
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
        class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
      >
        @for (option of options(); track option.value; let i = $index) {
          <li
            [id]="listId + '-' + i"
            role="option"
            [attr.aria-selected]="option.value === value()"
            [attr.aria-disabled]="option.disabled ? true : null"
            class="relative flex cursor-default items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none"
            [class]="i === active() ? 'bg-accent text-accent-foreground' : ''"
            (click)="select(option)"
            (mouseenter)="active.set(i)"
          >
            <span class="truncate">{{ option.label }}</span>
            @if (option.value === value()) {
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
export class BuiSelect {
  readonly value = model('');
  readonly options = input<readonly SelectOption[]>([]);
  readonly placeholder = input('Select…');
  readonly disabled = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly listId = inject(_IdGenerator).getId('bui-select-');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly open = signal(false);
  protected readonly active = signal(0);
  protected readonly selectedLabel = computed(
    () => this.options().find((option) => option.value === this.value())?.label ?? '',
  );
  protected readonly computedClass = computed(() => cn('relative block', this.userClass()));

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
    this.value.set(option.value);
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
    this.open.set(false);
  }
}
