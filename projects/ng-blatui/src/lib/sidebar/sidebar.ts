import { Component, computed, Directive, input, model } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A collapsible vertical navigation sidebar. Toggle width with the `open` model. */
@Component({
  selector: 'bui-sidebar',
  host: {
    'data-slot': 'sidebar',
    '[attr.data-state]': "open() ? 'expanded' : 'collapsed'",
    '[attr.data-side]': 'side()',
    '[class]': 'computedClass()',
  },
  template: `<ng-content />`,
})
export class BuiSidebar {
  /** Whether the sidebar is expanded. Two-way bindable with `[(open)]`. */
  readonly open = model(true);
  /** Edge the sidebar is docked to, which sets its border side. */
  readonly side = input<'left' | 'right'>('left');
  /** Collapse behavior: hide entirely (`offcanvas`) or shrink to an icon rail (`icon`). */
  readonly collapsible = input<'offcanvas' | 'icon'>('offcanvas');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly collapsedWidth = computed(() =>
    this.collapsible() === 'icon' ? 'w-14' : 'w-0 border-0 p-0',
  );
  protected readonly computedClass = computed(() =>
    cn(
      'flex h-full flex-col gap-2 overflow-hidden bg-card p-2 text-card-foreground transition-[width] duration-200',
      this.side() === 'left' ? 'border-r' : 'border-l',
      this.open() ? 'w-64' : this.collapsedWidth(),
      this.userClass(),
    ),
  );
}

/** A styled, accessible item button for a {@link BuiSidebar} menu. */
@Directive({
  selector: '[buiSidebarMenuButton]',
  host: {
    'data-slot': 'sidebar-menu-button',
    '[class]': 'computedClass()',
    '[attr.aria-current]': "isActive() ? 'page' : null",
  },
})
export class BuiSidebarMenuButton {
  /** Whether this item is the current page; sets active styling and `aria-current`. */
  readonly isActive = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(
      'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent',
      this.isActive() ? 'bg-accent font-medium' : '',
      this.userClass(),
    ),
  );
}
