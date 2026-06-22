import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A card whose border has a light beam continuously travelling around it. */
@Component({
  selector: 'bui-border-beam',
  host: { 'data-slot': 'border-beam', '[class]': 'computedClass()', '[style]': 'styleVars()' },
  styles: [
    `
      @keyframes bui-border-beam-spin {
        to {
          transform: rotate(1turn);
        }
      }
      .bui-beam {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        padding: var(--bui-beam-size, 2px);
        pointer-events: none;
        -webkit-mask:
          linear-gradient(#000 0 0) content-box,
          linear-gradient(#000 0 0);
        -webkit-mask-composite: xor;
        mask:
          linear-gradient(#000 0 0) content-box,
          linear-gradient(#000 0 0);
        mask-composite: exclude;
      }
      .bui-beam::before {
        content: '';
        position: absolute;
        inset: -50%;
        background: conic-gradient(
          from 0deg,
          transparent 0 70%,
          var(--bui-beam-color, var(--color-primary)) 85%,
          transparent 100%
        );
        animation: bui-border-beam-spin var(--bui-beam-duration, 6s) linear infinite;
      }
      @media (prefers-reduced-motion: reduce) {
        .bui-beam::before {
          animation: none;
        }
      }
    `,
  ],
  template: `
    <span class="bui-beam" aria-hidden="true"></span>
    <div class="relative"><ng-content /></div>
  `,
})
export class BuiBorderBeam {
  /** Seconds for the beam to complete one full lap. */
  readonly duration = input(6);
  /** Beam colour; defaults to the primary theme colour. */
  readonly color = input<string | null>(null);
  /** Border/beam thickness in pixels. */
  readonly size = input(2);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly styleVars = computed(() => {
    const color = this.color();
    return (
      `--bui-beam-size:${this.size()}px;--bui-beam-duration:${this.duration()}s;` +
      (color ? `--bui-beam-color:${color};` : '')
    );
  });
  protected readonly computedClass = computed(() =>
    cn('relative block rounded-xl bg-card p-6 text-card-foreground shadow-sm', this.userClass()),
  );
}
