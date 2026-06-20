import { Component, computed, input, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A card that tilts in 3D toward the cursor. SSR-safe (geometry read on mousemove). */
@Component({
  selector: 'bui-tilt-card',
  host: { 'data-slot': 'tilt-card', '[class]': 'computedClass()' },
  template: `
    <div
      class="relative block overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm [transform-style:preserve-3d]"
      [class]="active() ? 'transition-none' : 'transition-transform duration-500 ease-out'"
      [style.transform]="cardTransform()"
      (mousemove)="move($event)"
      (mouseleave)="leave()"
    >
      <ng-content />
    </div>
  `,
})
export class BuiTiltCard {
  readonly max = input(10);
  readonly scaleTo = input(1.05);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly active = signal(false);
  private readonly rx = signal(0);
  private readonly ry = signal(0);
  protected readonly cardTransform = computed(() => {
    const scale = this.active() ? this.scaleTo() : 1;
    return `rotateX(${this.rx()}deg) rotateY(${this.ry()}deg) scale(${scale})`;
  });
  protected readonly computedClass = computed(() =>
    cn('block [perspective:1000px]', this.userClass()),
  );

  protected move(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    this.active.set(true);
    this.ry.set((px - 0.5) * 2 * this.max());
    this.rx.set(-(py - 0.5) * 2 * this.max());
  }

  protected leave(): void {
    this.active.set(false);
    this.rx.set(0);
    this.ry.set(0);
  }
}
