import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** Groups buttons (and inputs) into a single segmented control. */
@Directive({
  selector: '[buiButtonGroup]',
  host: {
    role: 'group',
    'data-slot': 'button-group',
    '[attr.data-orientation]': 'orientation()',
    '[class]': 'computedClass()',
  },
})
export class BuiButtonGroup {
  /** Layout direction of the grouped controls. */
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 data-[orientation=vertical]:flex-col [&>*]:focus-within:z-10 [&>*]:focus-visible:z-10 data-[orientation=horizontal]:[&>*:not(:first-child)]:rounded-l-none data-[orientation=horizontal]:[&>*:not(:first-child)]:border-l-0 data-[orientation=vertical]:[&>*:not(:first-child)]:rounded-t-none data-[orientation=vertical]:[&>*:not(:first-child)]:border-t-0 data-[orientation=horizontal]:[&>*:not(:last-child)]:rounded-r-none data-[orientation=vertical]:[&>*:not(:last-child)]:rounded-b-none',
      this.userClass(),
    ),
  );
}

/** A non-button text segment inside a button group. */
@Directive({
  selector: '[buiButtonGroupText]',
  host: { 'data-slot': 'button-group-text', '[class]': 'computedClass()' },
})
export class BuiButtonGroupText {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'flex items-center gap-2 rounded-md border bg-muted px-4 text-sm font-medium shadow-xs',
      this.userClass(),
    ),
  );
}
