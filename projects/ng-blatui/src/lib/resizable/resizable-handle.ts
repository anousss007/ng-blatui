import { Component, computed, inject, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

import { BuiResizablePanelGroup } from './resizable-panel-group';

/** The draggable divider between two resizable panels. */
@Component({
  selector: 'bui-resizable-handle',
  host: {
    'data-slot': 'resizable-handle',
    role: 'separator',
    tabindex: '0',
    'aria-label': 'Resize panel',
    'aria-valuemin': '10',
    'aria-valuemax': '90',
    '[attr.aria-orientation]': "group.direction() === 'horizontal' ? 'vertical' : 'horizontal'",
    '[attr.aria-valuenow]': 'roundedSize()',
    '[class]': 'computedClass()',
    '(pointerdown)': 'group.startDrag()',
    '(keydown)': 'onKeydown($event)',
  },
  template: `
    @if (withHandle()) {
      <span
        class="absolute top-1/2 left-1/2 flex h-4 w-1 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-border"
      ></span>
    }
  `,
})
export class BuiResizableHandle {
  readonly withHandle = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly group = inject(BuiResizablePanelGroup);
  protected readonly roundedSize = computed(() => Math.round(this.group.size()));
  protected readonly computedClass = computed(() =>
    cn(
      'relative shrink-0 bg-border outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
      this.group.direction() === 'horizontal' ? 'w-px cursor-col-resize' : 'h-px cursor-row-resize',
      this.userClass(),
    ),
  );

  protected onKeydown(event: KeyboardEvent): void {
    const isHorizontal = this.group.direction() === 'horizontal';
    const decrease = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    const increase = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    if (event.key === decrease) {
      event.preventDefault();
      this.group.nudge(-2);
    } else if (event.key === increase) {
      event.preventDefault();
      this.group.nudge(2);
    }
  }
}
