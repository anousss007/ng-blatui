import { Component, computed, inject, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

import { BuiDescriptionList } from './description-list';

/** A term/description row. Inherits horizontal/bordered layout from its parent list. */
@Component({
  selector: 'bui-description-item',
  host: { 'data-slot': 'description-item', '[class]': 'computedClass()' },
  template: `
    <dt [class]="termClass()">{{ term() }}</dt>
    <dd [class]="descriptionClass()"><ng-content /></dd>
  `,
})
export class BuiDescriptionItem {
  readonly term = input('');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly list = inject(BuiDescriptionList, { optional: true });
  protected readonly horizontal = computed(
    () => (this.list?.layout() ?? 'horizontal') === 'horizontal',
  );
  protected readonly termClass = computed(() =>
    cn('text-sm text-muted-foreground', this.horizontal() && 'sm:col-span-1'),
  );
  protected readonly descriptionClass = computed(() =>
    cn('text-sm text-foreground', this.horizontal() && 'sm:col-span-2'),
  );
  protected readonly computedClass = computed(() =>
    cn(
      this.horizontal() ? 'grid gap-1 sm:grid-cols-3 sm:gap-4' : 'flex flex-col gap-1',
      this.list?.bordered() && 'px-4 py-3',
      this.userClass(),
    ),
  );
}
