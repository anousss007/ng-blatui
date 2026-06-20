import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A description list (`<dl>`). Children should be `bui-description-item`. */
@Directive({
  selector: 'dl[buiDescriptionList]',
  host: { 'data-slot': 'description-list', '[class]': 'computedClass()' },
})
export class BuiDescriptionList {
  readonly layout = input<'horizontal' | 'vertical'>('horizontal');
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
