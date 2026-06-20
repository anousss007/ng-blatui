import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** Shifts its content relative to scroll for a depth/parallax effect. SSR-safe. */
@Component({
  selector: 'bui-parallax',
  host: {
    'data-slot': 'parallax',
    '[class]': 'computedClass()',
    '[style.transform]': 'transform()',
    '(window:scroll)': 'update()',
    '(window:resize)': 'update()',
  },
  template: `<ng-content />`,
})
export class BuiParallax {
  readonly speed = input(0.3);
  readonly axis = input<'x' | 'y'>('y');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly offset = signal(0);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly transform = computed(() => {
    const offset = this.offset();
    return this.axis() === 'x' ? `translateX(${offset}px)` : `translateY(${offset}px)`;
  });
  protected readonly computedClass = computed(() =>
    cn('block will-change-transform', this.userClass()),
  );

  constructor() {
    afterNextRender(() => {
      this.update();
    });
  }

  protected update(): void {
    const rect = this.host.nativeElement.getBoundingClientRect();
    const viewport = globalThis.innerHeight || 0;
    const center = rect.top + rect.height / 2 - viewport / 2;
    this.offset.set(Math.round(-center * this.speed()));
  }
}
