import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

// Deterministic pseudo-random in [0,1) so server and client render identically (SSR-safe).
function pseudo(seed: number): number {
  const value = Math.sin(seed) * 10_000;
  return value - Math.floor(value);
}

/** Animated falling meteor streaks behind content. Decorative + SSR-safe. */
@Component({
  selector: 'bui-meteors',
  host: {
    'data-slot': 'meteors',
    '[class]': 'computedClass()',
    '[style.--bui-meteor-color]': 'color()',
  },
  styles: [
    `
      @keyframes bui-meteor-fall {
        0% {
          transform: translate3d(0, 0, 0) rotate(215deg);
          opacity: 1;
        }
        70% {
          opacity: 1;
        }
        100% {
          transform: translate3d(-700px, 700px, 0) rotate(215deg);
          opacity: 0;
        }
      }
      .bui-meteor {
        position: absolute;
        top: 0;
        height: 2px;
        width: 2px;
        border-radius: 9999px;
        background: var(
          --bui-meteor-color,
          color-mix(in oklab, var(--foreground) 60%, transparent)
        );
        animation: bui-meteor-fall linear infinite;
      }
      .bui-meteor::before {
        content: '';
        position: absolute;
        top: 50%;
        width: 50px;
        height: 1px;
        transform: translateY(-50%);
        background: linear-gradient(
          90deg,
          var(--bui-meteor-color, color-mix(in oklab, var(--foreground) 60%, transparent)),
          transparent
        );
      }
      @media (prefers-reduced-motion: reduce) {
        .bui-meteor {
          animation: none;
          opacity: 0;
        }
      }
    `,
  ],
  template: `
    <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true" dir="ltr">
      @for (meteor of meteors(); track meteor.id) {
        <span
          class="bui-meteor"
          [style.left]="meteor.left"
          [style.animation-delay]="meteor.delay"
          [style.animation-duration]="meteor.duration"
        ></span>
      }
    </div>
    <div class="relative z-10"><ng-content /></div>
  `,
})
export class BuiMeteors {
  readonly count = input(20);
  readonly color = input<string | null>(null);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly meteors = computed(() => {
    const count = this.count();
    return Array.from({ length: count }, (_, index) => {
      const a = pseudo(index * 2 + 1);
      const b = pseudo(index * 2 + 2);
      return {
        id: index,
        left: `${Math.round((index / count) * 100 + a * 8)}%`,
        delay: `${(a * 5).toFixed(2)}s`,
        duration: `${(4 + b * 4).toFixed(2)}s`,
      };
    });
  });
  protected readonly computedClass = computed(() =>
    cn('relative block overflow-hidden', this.userClass()),
  );
}
