import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** Scroll/border wrapper around a table. `variant="card"` adds a bordered card. */
@Directive({
  selector: '[buiTableContainer]',
  host: {
    'data-slot': 'table-container',
    '[attr.data-variant]': 'variant()',
    '[class]': 'computedClass()',
  },
})
export class BuiTableContainer {
  readonly variant = input<'default' | 'card'>('default');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'relative w-full overflow-x-auto',
      this.variant() === 'card' && 'rounded-lg border bg-card shadow-xs',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: 'table[buiTable]',
  host: { 'data-slot': 'table', '[class]': 'computedClass()' },
})
export class BuiTable {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('w-full caption-bottom text-sm', this.userClass()),
  );
}

@Directive({
  selector: 'thead[buiTableHeader]',
  host: { 'data-slot': 'table-header', '[class]': 'computedClass()' },
})
export class BuiTableHeader {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn('[&_tr]:border-b', this.userClass()));
}

@Directive({
  selector: 'tbody[buiTableBody]',
  host: { 'data-slot': 'table-body', '[class]': 'computedClass()' },
})
export class BuiTableBody {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('[&_tr:last-child]:border-0', this.userClass()),
  );
}

@Directive({
  selector: 'tfoot[buiTableFooter]',
  host: { 'data-slot': 'table-footer', '[class]': 'computedClass()' },
})
export class BuiTableFooter {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', this.userClass()),
  );
}

@Directive({
  selector: 'tr[buiTableRow]',
  host: { 'data-slot': 'table-row', '[class]': 'computedClass()' },
})
export class BuiTableRow {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: 'th[buiTableHead]',
  host: { 'data-slot': 'table-head', scope: 'col', '[class]': 'computedClass()' },
})
export class BuiTableHead {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: 'td[buiTableCell]',
  host: { 'data-slot': 'table-cell', '[class]': 'computedClass()' },
})
export class BuiTableCell {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0', this.userClass()),
  );
}

@Directive({
  selector: 'caption[buiTableCaption]',
  host: { 'data-slot': 'table-caption', '[class]': 'computedClass()' },
})
export class BuiTableCaption {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('mt-4 text-sm text-muted-foreground', this.userClass()),
  );
}
