import { _IdGenerator } from '@angular/cdk/a11y';
import { Component, computed, inject, input, output, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export interface CommandItem {
  label: string;
  value?: string;
  shortcut?: string;
}
export interface CommandGroup {
  label?: string;
  items: CommandItem[];
}
interface Row {
  kind: 'header' | 'item';
  label: string;
  item?: CommandItem;
  itemIndex: number;
}

/** A command palette: a filterable, keyboard-navigable list of grouped actions. */
@Component({
  selector: 'bui-command',
  host: { 'data-slot': 'command', '[class]': 'computedClass()' },
  template: `
    <div class="flex items-center gap-2 border-b px-3">
      <svg
        class="size-4 shrink-0 text-muted-foreground"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        role="combobox"
        aria-expanded="true"
        [attr.aria-controls]="listId"
        [attr.aria-activedescendant]="listId + '-' + active()"
        [value]="query()"
        [placeholder]="placeholder()"
        class="h-10 w-full bg-transparent text-sm outline-none"
        (input)="onInput($event)"
        (keydown)="onKeydown($event)"
      />
    </div>
    <ul [id]="listId" role="listbox" class="max-h-72 overflow-auto p-1">
      @for (row of rows(); track $index) {
        @if (row.kind === 'header') {
          <li role="presentation" class="px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground">
            {{ row.label }}
          </li>
        } @else {
          <li
            [id]="listId + '-' + row.itemIndex"
            role="option"
            [attr.aria-selected]="row.itemIndex === active()"
            class="flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
            [class]="row.itemIndex === active() ? 'bg-accent text-accent-foreground' : ''"
            (click)="choose(row.item!)"
            (mouseenter)="active.set(row.itemIndex)"
          >
            <span>{{ row.label }}</span>
            @if (row.item?.shortcut) {
              <kbd class="ms-auto text-xs text-muted-foreground">{{ row.item?.shortcut }}</kbd>
            }
          </li>
        }
      }
      @if (itemCount() === 0) {
        <li role="presentation" class="py-6 text-center text-sm text-muted-foreground">
          No results found.
        </li>
      }
    </ul>
  `,
})
export class BuiCommand {
  readonly groups = input<readonly CommandGroup[]>([]);
  readonly placeholder = input('Type a command or search…');
  readonly selected = output<CommandItem>();
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly listId = inject(_IdGenerator).getId('bui-command-');
  protected readonly query = signal('');
  protected readonly active = signal(0);
  protected readonly filtered = computed(() => {
    const query = this.query().trim().toLowerCase();
    if (query === '') {
      return this.groups();
    }
    return this.groups()
      .map((group) => ({
        label: group.label,
        items: group.items.filter((item) => item.label.toLowerCase().includes(query)),
      }))
      .filter((group) => group.items.length > 0);
  });
  protected readonly flatItems = computed(() => this.filtered().flatMap((group) => group.items));
  protected readonly itemCount = computed(() => this.flatItems().length);
  protected readonly rows = computed<Row[]>(() => {
    const out: Row[] = [];
    let index = 0;
    for (const group of this.filtered()) {
      if (group.label) {
        out.push({ kind: 'header', label: group.label, itemIndex: -1 });
      }
      for (const item of group.items) {
        out.push({ kind: 'item', label: item.label, item, itemIndex: index });
        index += 1;
      }
    }
    return out;
  });
  protected readonly computedClass = computed(() =>
    cn(
      'flex w-full flex-col overflow-hidden rounded-lg border bg-popover text-popover-foreground',
      this.userClass(),
    ),
  );

  protected onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.active.set(0);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.active.set(Math.min(this.itemCount() - 1, this.active() + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.active.set(Math.max(0, this.active() - 1));
    } else if (event.key === 'Enter' && this.itemCount() > 0) {
      event.preventDefault();
      this.choose(this.flatItems()[this.active()]);
    }
  }

  protected choose(item: CommandItem): void {
    this.selected.emit(item);
  }
}
