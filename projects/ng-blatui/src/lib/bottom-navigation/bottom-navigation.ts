import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A mobile bottom tab bar. Use `[buiBottomNavItem]` on each `<a>`/`<button>`. */
@Directive({
  selector: 'nav[buiBottomNavigation]',
  host: {
    'data-slot': 'bottom-navigation',
    '[class]': 'computedClass()',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class BuiBottomNavigation {
  /** Accessible label applied to the navigation element. */
  readonly ariaLabel = input('Bottom navigation');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('flex h-16 w-full items-stretch border-t border-border bg-background', this.userClass()),
  );
}
