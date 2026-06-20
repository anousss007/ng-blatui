import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A seamless infinite scroll of `items` (logos, badges, testimonials…). */
@Component({
  selector: 'bui-marquee',
  host: {
    'data-slot': 'marquee',
    '[attr.data-direction]': 'direction()',
    '[class]': 'computedClass()',
    '[style.--bui-marquee-gap]': 'gap()',
  },
  styles: [
    `
      @keyframes bui-marquee-x {
        to {
          transform: translateX(-50%);
        }
      }
      @keyframes bui-marquee-y {
        to {
          transform: translateY(-50%);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .bui-marquee-track {
          animation: none !important;
        }
      }
    `,
  ],
  template: `
    <div
      class="bui-marquee-track flex w-max"
      [class]="trackClass()"
      [style.animation]="animation()"
    >
      <div
        class="flex shrink-0 items-center justify-around gap-[var(--bui-marquee-gap)] pe-[var(--bui-marquee-gap)]"
        [class.flex-col]="vertical()"
      >
        @for (item of items(); track $index) {
          <span>{{ item }}</span>
        }
      </div>
      <div
        class="flex shrink-0 items-center justify-around gap-[var(--bui-marquee-gap)] pe-[var(--bui-marquee-gap)]"
        aria-hidden="true"
        [class.flex-col]="vertical()"
      >
        @for (item of items(); track $index) {
          <span>{{ item }}</span>
        }
      </div>
    </div>
  `,
})
export class BuiMarquee {
  readonly items = input<readonly string[]>([]);
  readonly direction = input<'left' | 'right' | 'up' | 'down'>('left');
  readonly duration = input('40s');
  readonly gap = input('1rem');
  readonly pauseOnHover = input(true);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly vertical = computed(
    () => this.direction() === 'up' || this.direction() === 'down',
  );
  private readonly reverse = computed(
    () => this.direction() === 'right' || this.direction() === 'down',
  );
  protected readonly animation = computed(() => {
    const name = this.vertical() ? 'bui-marquee-y' : 'bui-marquee-x';
    return `${name} ${this.duration()} linear infinite${this.reverse() ? ' reverse' : ''}`;
  });
  protected readonly trackClass = computed(() =>
    cn(
      this.vertical() ? 'h-max flex-col' : 'flex-row',
      this.pauseOnHover() && 'hover:[animation-play-state:paused]',
    ),
  );
  protected readonly computedClass = computed(() =>
    cn(
      'relative flex overflow-hidden',
      this.vertical() ? 'flex-col' : 'flex-row',
      this.userClass(),
    ),
  );
}
