import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A description list (`<dl>`). Children should be `bui-description-item`. */
@Directive({
  selector: 'dl[buiDescriptionList]',
  host: { 'data-slot': 'description-list', '[class]': 'computedClass()' },
})
export class BuiDescriptionList {
  /** Arrangement of each item's term and description, side by side or stacked. */
  readonly layout = input<'horizontal' | 'vertical'>('horizontal');
  /** Whether to render a bordered card with dividers between items. */
  readonly bordered = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      this.bordered()
        ? 'divide-y divide-border rounded-xl border bg-card text-card-foreground'
        : 'flex flex-col gap-4',
      this.userClass(),
    ),
  );
}
