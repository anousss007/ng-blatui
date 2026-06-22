import { Component, computed, input, signal } from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { type ClassValue, cn } from '../utils/cn';

/** A macOS-style dock with a cursor-following fisheye magnify. Use `bui-dock-item` tiles. */
@Component({
  selector: 'bui-dock',
  host: {
    'data-slot': 'dock',
    '[class]': 'computedClass()',
    '(mousemove)': 'mouseX.set($event.clientX)',
    '(mouseleave)': 'mouseX.set(null)',
  },
  template: `
    <nav
      [attr.aria-label]="labelText()"
      class="flex items-end gap-2 rounded-2xl border bg-card/80 p-2 shadow-lg backdrop-blur"
    >
      <ng-content />
    </nav>
  `,
})
export class BuiDock {
  /** Maximum scale factor applied to the tile directly under the cursor. */
  readonly magnify = input(1.6);
  /** Pixel radius around the cursor within which tiles are magnified. */
  readonly distance = input(120);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  /** Accessible label for the dock navigation; falls back to the i18n default. */
  readonly label = input<string>();

  protected readonly labelText = buiLabel('dock', this.label);

  readonly mouseX = signal<number | null>(null);
  protected readonly computedClass = computed(() => cn('inline-block', this.userClass()));

  scaleFor(centerX: number): number {
    const mouseX = this.mouseX();
    if (mouseX === null) {
      return 1;
    }
    const distance = Math.abs(mouseX - centerX);
    if (distance > this.distance()) {
      return 1;
    }
    return 1 + (this.magnify() - 1) * (1 - distance / this.distance());
  }
}
