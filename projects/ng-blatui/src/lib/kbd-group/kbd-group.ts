import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** Groups several `<kbd>` keys into one inline cluster. */
@Directive({
  selector: 'kbd[buiKbdGroup]',
  host: { 'data-slot': 'kbd-group', '[class]': 'computedClass()' },
})
export class BuiKbdGroup {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('inline-flex items-center gap-1', this.userClass()),
  );
}
