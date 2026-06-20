import { Component, computed, ElementRef, inject, input, model } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A two-panel resizable group. Hosts the shared size; the handle drags it. */
@Component({
  selector: 'bui-resizable-panel-group',
  host: {
    'data-slot': 'resizable-panel-group',
    '[class]': 'computedClass()',
    '[attr.data-direction]': 'direction()',
    '(document:pointermove)': 'onMove($event)',
    '(document:pointerup)': 'onUp()',
  },
  template: `<ng-content />`,
})
export class BuiResizablePanelGroup {
  readonly direction = input<'horizontal' | 'vertical'>('horizontal');
  readonly size = model(50);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private dragging = false;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly computedClass = computed(() =>
    cn('flex', this.direction() === 'vertical' ? 'flex-col' : 'flex-row', this.userClass()),
  );

  startDrag(): void {
    this.dragging = true;
  }

  onMove(event: PointerEvent): void {
    if (!this.dragging) {
      return;
    }
    const rect = this.host.nativeElement.getBoundingClientRect();
    const ratio =
      this.direction() === 'horizontal'
        ? (event.clientX - rect.left) / rect.width
        : (event.clientY - rect.top) / rect.height;
    this.size.set(this.clamp(ratio * 100));
  }

  onUp(): void {
    this.dragging = false;
  }

  nudge(delta: number): void {
    this.size.set(this.clamp(this.size() + delta));
  }

  private clamp(value: number): number {
    return Math.min(90, Math.max(10, value));
  }
}
