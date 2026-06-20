import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/**
 * BlatUI label. Apply to a native `<label>` (use `for`/`id` to associate it with
 * a control) so the click-to-focus and screen-reader association work natively.
 */
@Directive({
  selector: 'label[buiLabel]',
  host: {
    'data-slot': 'label',
    '[class]': 'computedClass()',
  },
})
export class BuiLabel {
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(
      'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      this.userClass(),
    ),
  );
}
