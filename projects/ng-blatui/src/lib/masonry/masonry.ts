import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const COLUMNS: Record<number, string> = {
  1: 'columns-1',
  2: 'columns-1 sm:columns-2',
  3: 'columns-1 sm:columns-2 lg:columns-3',
  4: 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4',
  5: 'columns-1 sm:columns-2 lg:columns-3 xl:columns-5',
  6: 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-6',
};
const GAPS: Record<string, string> = {
  '0': 'gap-0 [&>*]:mb-0',
  '2': 'gap-2 [&>*]:mb-2',
  '3': 'gap-3 [&>*]:mb-3',
  '4': 'gap-4 [&>*]:mb-4',
  '6': 'gap-6 [&>*]:mb-6',
  '8': 'gap-8 [&>*]:mb-8',
};

/** A Pinterest-style masonry grid using native CSS multi-column layout. */
@Directive({
  selector: '[buiMasonry]',
  host: { 'data-slot': 'masonry', '[class]': 'computedClass()' },
})
export class BuiMasonry {
  readonly columns = input(3);
  readonly gap = input('4');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(COLUMNS[this.columns()], '[&>*]:break-inside-avoid', GAPS[this.gap()], this.userClass()),
  );
}
