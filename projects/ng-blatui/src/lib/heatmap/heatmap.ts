import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A contribution-style heatmap grid (7 rows). Pass `data` or get a deterministic demo. */
@Component({
  selector: 'bui-heatmap',
  host: { 'data-slot': 'heatmap', '[class]': 'computedClass()' },
  template: `
    <div class="grid grid-flow-col grid-rows-7 gap-1">
      @for (cell of cells(); track $index) {
        <span
          class="size-3 rounded-[2px]"
          [class]="levelClass(cell)"
          [attr.title]="cell + ' contributions'"
        ></span>
      }
    </div>
  `,
})
export class BuiHeatmap {
  readonly data = input<readonly number[]>([]);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly cells = computed(() => {
    const data = this.data();
    if (data.length > 0) {
      return [...data];
    }
    return Array.from({ length: 17 * 7 }, (_, index) => {
      const weekend = index % 7 === 0 || index % 7 === 6 ? -2 : 0;
      return Math.max(0, Math.round(2.5 + 2.5 * Math.sin(index / 9)) + (index % 3) + weekend);
    });
  });
  private readonly max = computed(() => Math.max(1, ...this.cells()));
  protected readonly computedClass = computed(() => cn('inline-block', this.userClass()));

  protected levelClass(count: number): string {
    if (count <= 0) {
      return 'bg-muted';
    }
    const ratio = count / this.max();
    if (ratio < 0.25) {
      return 'bg-emerald-200 dark:bg-emerald-900';
    }
    if (ratio < 0.5) {
      return 'bg-emerald-300 dark:bg-emerald-700';
    }
    if (ratio < 0.75) {
      return 'bg-emerald-400 dark:bg-emerald-600';
    }
    return 'bg-emerald-500 dark:bg-emerald-400';
  }
}
