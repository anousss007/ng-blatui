import { Menu } from '@angular/aria/menu';
import { computed, Directive, inject, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/**
 * Dropdown menu styling on top of Angular Aria's menu primitives (re-exported below).
 * Behaviour, roving focus, typeahead and ARIA roles come from `ngMenu` / `ngMenuItem` /
 * `ngMenuTrigger`. Wrap the trigger + menu in a `relative` element so the menu anchors.
 *
 * ```html
 * <div class="relative inline-block">
 *   <button buiButton ngMenuTrigger [menu]="m">Open</button>
 *   <div ngMenu #m="ngMenu" buiDropdownMenu>
 *     <div ngMenuItem value="edit" buiDropdownMenuItem>Edit</div>
 *   </div>
 * </div>
 * ```
 */
export { Menu, MenuBar, MenuContent, MenuItem, MenuTrigger } from '@angular/aria/menu';

@Directive({
  selector: '[buiDropdownMenu]',
  host: {
    'data-slot': 'dropdown-menu',
    '[hidden]': '!menu.visible()',
    '[class]': 'computedClass()',
  },
})
export class BuiDropdownMenu {
  protected readonly menu = inject(Menu);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'absolute z-50 mt-1 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[buiDropdownMenuItem]',
  host: { 'data-slot': 'dropdown-menu-item', '[class]': 'computedClass()' },
})
export class BuiDropdownMenuItem {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[buiDropdownMenuLabel]',
  host: { 'data-slot': 'dropdown-menu-label', '[class]': 'computedClass()' },
})
export class BuiDropdownMenuLabel {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('px-2 py-1.5 text-sm font-medium', this.userClass()),
  );
}

@Directive({
  selector: '[buiDropdownMenuSeparator]',
  host: { 'data-slot': 'dropdown-menu-separator', role: 'separator', '[class]': 'computedClass()' },
})
export class BuiDropdownMenuSeparator {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('-mx-1 my-1 h-px bg-border', this.userClass()),
  );
}
