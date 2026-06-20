import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const DIRECTIONS = { col: 'flex-col', row: 'flex-row' } as const;
const GAPS: Record<string, string> = {
  '0': 'gap-0',
  '1': 'gap-1',
  '2': 'gap-2',
  '3': 'gap-3',
  '4': 'gap-4',
  '5': 'gap-5',
  '6': 'gap-6',
  '8': 'gap-8',
  '10': 'gap-10',
  '12': 'gap-12',
};
const ALIGN: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};
const JUSTIFY: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

/** A flexbox stack layout helper (direction, gap, alignment). */
@Directive({
  selector: '[buiStack]',
  host: { 'data-slot': 'stack', '[class]': 'computedClass()' },
})
export class BuiStack {
  readonly direction = input<keyof typeof DIRECTIONS>('col');
  readonly gap = input('4');
  readonly align = input('');
  readonly justify = input('');
  readonly wrap = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(
      'flex',
      DIRECTIONS[this.direction()],
      GAPS[this.gap()],
      ALIGN[this.align()],
      JUSTIFY[this.justify()],
      this.wrap() && 'flex-wrap',
      this.userClass(),
    ),
  );
}
