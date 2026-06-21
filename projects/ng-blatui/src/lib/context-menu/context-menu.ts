import { Component, computed, input, output, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export interface ContextMenuItem {
  label?: string;
  value?: string;
  shortcut?: string;
  danger?: boolean;
  separator?: boolean;
}

/** A right-click context menu. Project the target; pass menu `items`. */
@Component({
  selector: 'bui-context-menu',
  host: {
    'data-slot': 'context-menu',
    '[class]': 'computedClass()',
    '(contextmenu)': 'onContext($event)',
    '(document:click)': 'open.set(false)',
    '(document:keydown.escape)': 'open.set(false)',
  },
  template: `
    <ng-content />
    @if (open()) {
      <div
        role="menu"
        class="fixed z-50 min-w-44 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        [style.left.px]="x()"
        [style.top.px]="y()"
      >
        @for (item of items(); track $index) {
          @if (item.separator) {
            <div role="separator" class="-mx-1 my-1 h-px bg-border"></div>
          } @else {
            <button
              type="button"
              role="menuitem"
              class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus-visible:bg-accent"
              [class.text-destructive]="item.danger"
              (click)="select(item)"
            >
              <span>{{ item.label }}</span>
              @if (item.shortcut) {
                <span class="ms-auto text-xs text-muted-foreground">{{ item.shortcut }}</span>
              }
            </button>
          }
        }
      </div>
    }
  `,
})
export class BuiContextMenu {
  readonly items = input<readonly ContextMenuItem[]>([]);
  readonly selected = output<ContextMenuItem>();
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly open = signal(false);
  protected readonly x = signal(0);
  protected readonly y = signal(0);
  protected readonly computedClass = computed(() => cn('block', this.userClass()));

  protected onContext(event: MouseEvent): void {
    event.preventDefault();
    this.x.set(event.clientX);
    this.y.set(event.clientY);
    this.open.set(true);
  }

  protected select(item: ContextMenuItem): void {
    this.selected.emit(item);
    this.open.set(false);
  }
}
