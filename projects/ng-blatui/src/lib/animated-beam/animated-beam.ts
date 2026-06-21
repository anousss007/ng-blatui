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

/** An SVG beam connecting two elements (by selector) with a travelling light. SSR-safe. */
@Component({
  selector: 'bui-animated-beam',
  host: {
    'data-slot': 'animated-beam',
    '[class]': 'computedClass()',
    '(window:resize)': 'measure()',
  },
  styles: [
    `
      @keyframes bui-beam-travel {
        to {
          stroke-dashoffset: -1000;
        }
      }
      .bui-beam-line {
        animation: bui-beam-travel var(--bui-beam-dur, 3s) linear infinite;
      }
      @media (prefers-reduced-motion: reduce) {
        .bui-beam-line {
          animation: none;
        }
      }
    `,
  ],
  template: `
    <svg
      class="pointer-events-none absolute inset-0 size-full"
      aria-hidden="true"
      [attr.viewBox]="viewBox()"
      fill="none"
      preserveAspectRatio="none"
    >
      <path [attr.d]="path()" class="stroke-border" stroke-width="2" fill="none" />
      <path
        [attr.d]="path()"
        class="bui-beam-line stroke-primary"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-dasharray="60 940"
        [style.--bui-beam-dur]="duration() + 's'"
      />
    </svg>
    <ng-content />
  `,
})
export class BuiAnimatedBeam {
  readonly from = input('');
  readonly to = input('');
  readonly curvature = input(0);
  readonly duration = input(3);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly path = signal('');
  protected readonly viewBox = signal('0 0 0 0');
  protected readonly computedClass = computed(() => cn('relative block', this.userClass()));

  constructor() {
    afterNextRender(() => {
      this.measure();
    });
  }

  protected measure(): void {
    const root = this.host.nativeElement;
    const start = this.from() ? root.querySelector(this.from()) : null;
    const end = this.to() ? root.querySelector(this.to()) : null;
    if (!start || !end) {
      return;
    }
    const rect = root.getBoundingClientRect();
    const a = start.getBoundingClientRect();
    const b = end.getBoundingClientRect();
    const x1 = a.left + a.width / 2 - rect.left;
    const y1 = a.top + a.height / 2 - rect.top;
    const x2 = b.left + b.width / 2 - rect.left;
    const y2 = b.top + b.height / 2 - rect.top;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2 - this.curvature();
    this.viewBox.set(`0 0 ${rect.width} ${rect.height}`);
    this.path.set(`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`);
  }
}
