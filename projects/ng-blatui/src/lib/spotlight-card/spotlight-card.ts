import { Component, computed, ElementRef, inject, input, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A card with a radial spotlight glow that follows the cursor on hover. */
@Component({
  selector: 'bui-spotlight-card',
  host: {
    'data-slot': 'spotlight-card',
    '[class]': 'computedClass()',
    '(mousemove)': 'track($event)',
    '(mouseenter)': 'hover.set(true)',
    '(mouseleave)': 'hover.set(false)',
  },
  template: `
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
      [style.opacity]="hover() ? 1 : 0"
      [style.background]="glowStyle()"
    ></div>
    <div class="relative z-10"><ng-content /></div>
  `,
})
export class BuiSpotlightCard {
  readonly color = input<string | null>(null);
  readonly size = input(350);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly hover = signal(false);
  protected readonly glowStyle = computed(() => {
    const glow = this.color() ?? 'color-mix(in oklab, var(--foreground) 14%, transparent)';
    return `radial-gradient(circle ${this.size()}px at var(--x, 50%) var(--y, 50%), ${glow}, transparent 80%)`;
  });
  protected readonly computedClass = computed(() =>
    cn(
      'relative overflow-hidden rounded-xl border bg-card p-6 text-card-foreground shadow-sm',
      this.userClass(),
    ),
  );

  protected track(event: MouseEvent): void {
    const element = this.host.nativeElement;
    const rect = element.getBoundingClientRect();
    element.style.setProperty('--x', `${event.clientX - rect.left}px`);
    element.style.setProperty('--y', `${event.clientY - rect.top}px`);
  }
}
