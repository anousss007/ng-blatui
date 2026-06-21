import { Component, computed, input, model } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const POSITION: Record<string, string> = {
  bottom: 'inset-x-0 bottom-0 max-h-[85vh] rounded-t-xl border-t',
  top: 'inset-x-0 top-0 max-h-[85vh] rounded-b-xl border-b',
  left: 'inset-y-0 left-0 h-full w-80 max-w-[85vw] border-r',
  right: 'inset-y-0 right-0 h-full w-80 max-w-[85vw] border-l',
};

/** A slide-in panel anchored to a screen edge. Toggle with the `open` model. */
@Component({
  selector: 'bui-drawer',
  host: { 'data-slot': 'drawer', '(document:keydown.escape)': 'open.set(false)' },
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-50 bg-black/50"
        (click)="open.set(false)"
        aria-hidden="true"
      ></div>
      <div role="dialog" aria-modal="true" [class]="panelClass()">
        <ng-content />
      </div>
    }
  `,
})
export class BuiDrawer {
  readonly open = model(false);
  readonly direction = input<'top' | 'bottom' | 'left' | 'right'>('bottom');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly panelClass = computed(() =>
    cn(
      'fixed z-50 flex flex-col gap-3 border bg-background p-4 shadow-lg',
      POSITION[this.direction()],
      this.userClass(),
    ),
  );
}
