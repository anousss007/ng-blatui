import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A single bottom-navigation tab. Project the icon; pass `label`, `active`, `badge`. */
@Component({
  selector: 'a[buiBottomNavItem], button[buiBottomNavItem]',
  host: {
    'data-slot': 'bottom-navigation-item',
    '[class]': 'computedClass()',
    '[attr.aria-current]': "active() ? 'page' : null",
  },
  template: `
    <span class="relative">
      <ng-content />
      @if (badge() === true) {
        <span class="absolute -end-1 -top-1 size-2 rounded-full bg-primary"></span>
      } @else if (badge()) {
        <span
          class="absolute -end-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground"
        >
          {{ badge() }}
        </span>
      }
    </span>
    @if (label()) {
      <span class="text-[10px] font-medium">{{ label() }}</span>
    }
  `,
})
export class BuiBottomNavigationItem {
  /** Caption shown beneath the projected icon; hidden when empty. */
  readonly label = input('');
  /** Whether this tab is the current page; sets `aria-current="page"`. */
  readonly active = input(false);
  /** Badge content; `true` renders a dot, a string/number renders a count, `null` shows nothing. */
  readonly badge = input<boolean | string | number | null>(null);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'group relative flex flex-1 flex-col items-center justify-center gap-1 px-1 text-center transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset',
      this.active() ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
      this.userClass(),
    ),
  );
}
