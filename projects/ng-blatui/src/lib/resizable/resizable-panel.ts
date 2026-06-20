import { computed, Directive, inject, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

import { BuiResizablePanelGroup } from './resizable-panel-group';

/** A panel inside a `bui-resizable-panel-group`. Mark one `primary` to make it the sized panel. */
@Directive({
  selector: '[buiResizablePanel]',
  host: {
    'data-slot': 'resizable-panel',
    '[class]': 'computedClass()',
    '[style.flex-basis]': "primary() ? group.size() + '%' : null",
  },
})
export class BuiResizablePanel {
  readonly primary = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly group = inject(BuiResizablePanelGroup);
  protected readonly computedClass = computed(() =>
    cn(
      this.primary() ? 'shrink-0 grow-0 overflow-hidden' : 'flex-1 overflow-hidden',
      this.userClass(),
    ),
  );
}
