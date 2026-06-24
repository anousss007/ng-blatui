import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/**
 * Application menu bar styling on Angular Aria's `ngMenuBar`. Each top-level entry is a
 * `ngMenuTrigger` opening a `ngMenu` (style the menus with `buiDropdownMenu` /
 * `buiDropdownMenuItem`). `MenuBar` is re-exported from `ng-blatui`.
 *
 * Wrap each trigger + its menu in a `relative` element so the menu anchors under its own
 * trigger (otherwise the absolutely-positioned panel lands over the bar itself).
 *
 * ```html
 * <div ngMenuBar buiMenubar>
 *   <div class="relative">
 *     <button ngMenuTrigger [menu]="file" buiMenubarTrigger>File</button>
 *     <div ngMenu #file="ngMenu" buiDropdownMenu>
 *       <div ngMenuItem value="new" buiDropdownMenuItem>New</div>
 *     </div>
 *   </div>
 * </div>
 * ```
 */
@Directive({
  selector: '[buiMenubar]',
  host: { 'data-slot': 'menubar', '[class]': 'computedClass()' },
})
export class BuiMenubar {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-xs',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[buiMenubarTrigger]',
  host: { 'data-slot': 'menubar-trigger', '[class]': 'computedClass()' },
})
export class BuiMenubarTrigger {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-none select-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
      this.userClass(),
    ),
  );
}
