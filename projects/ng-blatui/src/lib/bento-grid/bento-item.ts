import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const COL_SPAN: Record<number, string> = { 1: '', 2: 'lg:col-span-2', 3: 'lg:col-span-3' };
const ROW_SPAN: Record<number, string> = { 1: '', 2: 'row-span-2' };

/** A bento grid cell with optional title/description and configurable span. */
@Component({
  selector: 'bui-bento-item',
  host: { 'data-slot': 'bento-item', '[class]': 'computedClass()' },
  template: `
    @if (title()) {
      <h3 class="font-semibold">{{ title() }}</h3>
    }
    @if (description()) {
      <p class="text-sm text-muted-foreground">{{ description() }}</p>
    }
    <ng-content />
  `,
})
export class BuiBentoItem {
  /** Optional heading rendered above the projected content. */
  readonly title = input('');
  /** Optional muted description rendered below the title. */
  readonly description = input('');
  /** How many grid columns the cell spans (1-3). */
  readonly colSpan = input(1);
  /** How many grid rows the cell spans (1-2). */
  readonly rowSpan = input(1);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'flex flex-col gap-3 rounded-xl border bg-card p-6 text-card-foreground transition-colors hover:bg-muted/40',
      COL_SPAN[this.colSpan()],
      ROW_SPAN[this.rowSpan()],
      this.userClass(),
    ),
  );
}
