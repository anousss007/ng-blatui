import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A step indicator. The `value` (1-based) marks the active step. Use `li[buiStepperItem]`. */
@Component({
  selector: 'bui-stepper',
  host: {
    'data-slot': 'stepper',
    '[class]': 'computedClass()',
    '[attr.data-orientation]': 'orientation()',
  },
  template: `
    <ol
      class="flex gap-3"
      [class.flex-col]="orientation() === 'vertical'"
      [class.items-center]="orientation() === 'horizontal'"
    >
      <ng-content />
    </ol>
  `,
})
export class BuiStepper {
  readonly value = input(1);
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn('block', this.userClass()));
}
