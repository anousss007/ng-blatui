import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const COLUMNS: Record<number, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
};

/** A bento grid container. Use `bui-bento-item` for cells. */
@Directive({
  selector: '[buiBentoGrid]',
  host: { 'data-slot': 'bento-grid', '[class]': 'computedClass()' },
})
export class BuiBentoGrid {
  /** Number of columns at the largest breakpoint (2, 3 or 4). */
  readonly columns = input(3);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'grid auto-rows-[minmax(10rem,auto)] grid-cols-1 gap-4',
      COLUMNS[this.columns()],
      this.userClass(),
    ),
  );
}
