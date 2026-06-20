import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export type SeparatorOrientation = 'horizontal' | 'vertical';

/**
 * BlatUI separator. `decorative` (default) renders `role="none"`; set
 * `[decorative]="false"` for a semantic `role="separator"` with `aria-orientation`.
 */
@Directive({
  selector: '[buiSeparator]',
  host: {
    'data-slot': 'separator',
    '[attr.role]': "decorative() ? 'none' : 'separator'",
    '[attr.aria-orientation]': 'decorative() ? null : orientation()',
    '[attr.data-orientation]': 'orientation()',
    '[class]': 'computedClass()',
  },
})
export class BuiSeparator {
  readonly orientation = input<SeparatorOrientation>('horizontal');
  readonly decorative = input(true);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(
      'shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
      this.userClass(),
    ),
  );
}
