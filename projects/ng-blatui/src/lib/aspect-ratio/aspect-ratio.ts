import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** Constrains projected content to a given aspect ratio (e.g. `16 / 9`). */
@Component({
  selector: 'bui-aspect-ratio',
  host: {
    'data-slot': 'aspect-ratio',
    '[style.aspect-ratio]': 'ratio()',
    '[class]': 'computedClass()',
  },
  template: `<ng-content />`,
})
export class BuiAspectRatio {
  /** Aspect ratio for the content, as a CSS `aspect-ratio` value (e.g. `16 / 9`). */
  readonly ratio = input('1 / 1');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn('relative block', this.userClass()));
}
