import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/**
 * Behaviour + accessibility come from Angular Aria's tabs directives
 * (`ngTabs` / `ngTabList` / `ngTab` / `ngTabPanel` / `ngTabContent`): roles,
 * `aria-selected`, roving tabindex and arrow-key navigation. The `bui*` directives
 * add BlatUI's segmented styling (selected state keys off `aria-selected`):
 *
 * ```html
 * <div ngTabs buiTabs>
 *   <div ngTabList buiTabList selectedTab="a">
 *     <div ngTab value="a" buiTabTrigger>Account</div>
 *     <div ngTab value="b" buiTabTrigger>Password</div>
 *   </div>
 *   <div ngTabPanel value="a" buiTabPanel><ng-template ngTabContent>…</ng-template></div>
 *   <div ngTabPanel value="b" buiTabPanel><ng-template ngTabContent>…</ng-template></div>
 * </div>
 * ```
 */
export { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';

const TAB_TRIGGER =
  'text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 cursor-default items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-selected:bg-background aria-selected:shadow-sm dark:aria-selected:text-foreground dark:aria-selected:border-input dark:aria-selected:bg-input/30';

@Directive({
  selector: '[buiTabs]',
  host: { 'data-slot': 'tabs', '[class]': 'computedClass()' },
})
export class BuiTabs {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn('flex flex-col gap-2', this.userClass()));
}

@Directive({
  selector: '[buiTabList]',
  host: { 'data-slot': 'tabs-list', '[class]': 'computedClass()' },
})
export class BuiTabList {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[buiTabTrigger]',
  host: { 'data-slot': 'tabs-trigger', '[class]': 'computedClass()' },
})
export class BuiTabTrigger {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn(TAB_TRIGGER, this.userClass()));
}

@Directive({
  selector: '[buiTabPanel]',
  host: { 'data-slot': 'tabs-content', '[class]': 'computedClass()' },
})
export class BuiTabPanel {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn('flex-1 outline-none', this.userClass()));
}
