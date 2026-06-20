import { Component, computed, effect, ElementRef, inject, input, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

import { BuiDock } from './dock';

/** A magnifying tile inside a `bui-dock`. */
@Component({
  selector: 'bui-dock-item',
  host: {
    'data-slot': 'dock-item',
    '[class]': 'computedClass()',
    '[style.transform]': 'transformValue()',
  },
  template: `
    <ng-content />
    @if (active()) {
      <span
        class="absolute -bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-foreground"
        aria-hidden="true"
      ></span>
    }
  `,
})
export class BuiDockItem {
  readonly active = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly group = inject(BuiDock);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly scale = signal(1);
  protected readonly transformValue = computed(() => `scale(${this.scale()})`);
  protected readonly computedClass = computed(() =>
    cn('relative inline-flex origin-bottom items-end transition-transform', this.userClass()),
  );

  constructor() {
    effect(() => {
      const mouseX = this.group.mouseX();
      if (mouseX === null) {
        this.scale.set(1);
        return;
      }
      const rect = this.host.nativeElement.getBoundingClientRect();
      this.scale.set(this.group.scaleFor(rect.left + rect.width / 2));
    });
  }
}
