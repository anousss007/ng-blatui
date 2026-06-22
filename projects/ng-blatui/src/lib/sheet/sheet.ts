import { Component, computed, input, model } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const SIDE: Record<string, string> = {
  right: 'inset-y-0 right-0 h-full w-80 max-w-[85vw] border-l',
  left: 'inset-y-0 left-0 h-full w-80 max-w-[85vw] border-r',
  top: 'inset-x-0 top-0 max-h-[85vh] border-b',
  bottom: 'inset-x-0 bottom-0 max-h-[85vh] border-t',
};

/** A sheet overlay sliding in from a screen edge. Toggle with the `open` model. */
@Component({
  selector: 'bui-sheet',
  host: { 'data-slot': 'sheet', '(document:keydown.escape)': 'open.set(false)' },
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-50 bg-black/50"
        (click)="open.set(false)"
        aria-hidden="true"
      ></div>
      <div role="dialog" aria-modal="true" [attr.aria-label]="ariaLabel()" [class]="panelClass()">
        <ng-content />
      </div>
    }
  `,
})
export class BuiSheet {
  /** Whether the sheet is open. Two-way bindable with `[(open)]`. */
  readonly open = model(false);
  /** Screen edge the sheet slides in from. */
  readonly side = input<'left' | 'right' | 'top' | 'bottom'>('right');
  /** Accessible label applied to the sheet dialog. */
  readonly ariaLabel = input('Sheet');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly panelClass = computed(() =>
    cn(
      'fixed z-50 flex flex-col gap-4 border bg-background p-6 shadow-lg',
      SIDE[this.side()],
      this.userClass(),
    ),
  );
}
