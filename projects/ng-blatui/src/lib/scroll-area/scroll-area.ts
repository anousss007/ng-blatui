import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A scrollable region with a thin, themed scrollbar and a focusable viewport. */
@Component({
  selector: 'bui-scroll-area',
  host: { 'data-slot': 'scroll-area', '[class]': 'computedClass()' },
  template: `
    <div
      data-slot="scroll-area-viewport"
      tabindex="0"
      role="region"
      class="size-full [scrollbar-width:thin] [scrollbar-color:var(--border)_transparent] overflow-auto rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
    >
      <ng-content />
    </div>
  `,
})
export class BuiScrollArea {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn('relative block', this.userClass()));
}
