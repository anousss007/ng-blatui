import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** Keyboard key styling, applied to a native `<kbd>` element. */
@Directive({
  selector: 'kbd[buiKbd]',
  host: { 'data-slot': 'kbd', '[class]': 'computedClass()' },
})
export class BuiKbd {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground select-none',
      this.userClass(),
    ),
  );
}
