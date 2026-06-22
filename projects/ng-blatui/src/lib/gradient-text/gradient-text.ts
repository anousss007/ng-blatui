import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const PRESETS = {
  brand: ['#6366f1', '#a855f7', '#ec4899'],
  sunset: ['#f97316', '#ef4444', '#ec4899'],
  ocean: ['#06b6d4', '#3b82f6', '#6366f1'],
  candy: ['#ec4899', '#d946ef', '#8b5cf6'],
  gold: ['#f59e0b', '#eab308', '#fbbf24'],
  aurora: ['#22d3ee', '#a78bfa', '#34d399'],
  flamingo: ['#fb7185', '#f472b6', '#c084fc'],
  mint: ['#34d399', '#10b981', '#059669'],
} as const;

/** Renders accessible text painted with a CSS gradient, with an optional shimmer. */
@Component({
  selector: 'bui-gradient-text',
  host: {
    'data-slot': 'gradient-text',
    '[class]': 'computedClass()',
    '[style.background-image]': 'gradient()',
    '[style.background-size]': "animate() ? '200% auto' : null",
    '[attr.data-animate]': 'animate()',
  },
  styles: [
    `
      :host {
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      :host([data-animate='true']) {
        animation: bui-gradient-shimmer 3s linear infinite;
      }
      @keyframes bui-gradient-shimmer {
        to {
          background-position: 200% center;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        :host([data-animate='true']) {
          animation: none;
        }
      }
    `,
  ],
  template: `<ng-content />`,
})
export class BuiGradientText {
  /** Named colour preset used when from/via/to are not set. */
  readonly preset = input<keyof typeof PRESETS>('brand');
  /** Gradient start colour; overrides the preset's first stop. */
  readonly from = input<string | null>(null);
  /** Gradient middle colour; overrides the preset's second stop. */
  readonly via = input<string | null>(null);
  /** Gradient end colour; overrides the preset's third stop. */
  readonly to = input<string | null>(null);
  /** Whether to animate a horizontal shimmer across the gradient. */
  readonly animate = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly gradient = computed(() => {
    const preset = PRESETS[this.preset()];
    const from = this.from() ?? preset[0];
    const via = this.via() ?? preset[1];
    const to = this.to() ?? preset[2];
    return `linear-gradient(to right, ${from}, ${via}, ${to})`;
  });
  protected readonly computedClass = computed(() =>
    cn('inline-block bg-clip-text font-bold', this.userClass()),
  );
}
