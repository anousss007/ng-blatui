import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** An animated aurora / northern-lights gradient background with content overlaid. */
@Component({
  selector: 'bui-aurora',
  host: { 'data-slot': 'aurora', '[class]': 'computedClass()', '[style]': 'styleVars()' },
  styles: [
    `
      @keyframes bui-aurora-drift {
        0% {
          transform: translate3d(-6%, -4%, 0) rotate(0) scale(1.15);
        }
        33% {
          transform: translate3d(6%, 3%, 0) rotate(40deg) scale(1.3);
        }
        66% {
          transform: translate3d(-4%, 5%, 0) rotate(-30deg) scale(1.2);
        }
        100% {
          transform: translate3d(-6%, -4%, 0) rotate(0) scale(1.15);
        }
      }
      .bui-aurora-layer {
        position: absolute;
        inset: -20%;
        filter: blur(var(--bui-aurora-blur, 60px));
        animation: bui-aurora-drift var(--bui-aurora-speed, 12s) ease-in-out infinite;
        background:
          radial-gradient(30% 40% at 20% 30%, #6366f1aa, transparent 60%),
          radial-gradient(25% 35% at 70% 40%, #a855f7aa, transparent 60%),
          radial-gradient(30% 40% at 50% 70%, #22d3eeaa, transparent 60%),
          radial-gradient(25% 30% at 80% 75%, #ec4899aa, transparent 60%);
      }
      @media (prefers-reduced-motion: reduce) {
        .bui-aurora-layer {
          animation: none;
        }
      }
    `,
  ],
  template: `
    <div class="bui-aurora-layer" aria-hidden="true"></div>
    <div class="absolute inset-0 bg-background/20" aria-hidden="true"></div>
    <div class="relative z-10"><ng-content /></div>
  `,
})
export class BuiAurora {
  /** Blur radius of the aurora layer in pixels. */
  readonly blur = input(60);
  /** Seconds for one full drift animation cycle. */
  readonly speed = input(12);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly styleVars = computed(
    () => `--bui-aurora-blur:${this.blur()}px;--bui-aurora-speed:${this.speed()}s;`,
  );
  protected readonly computedClass = computed(() =>
    cn('relative block overflow-hidden rounded-xl', this.userClass()),
  );
}
