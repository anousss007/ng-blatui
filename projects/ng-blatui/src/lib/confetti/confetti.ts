/* eslint-disable sonarjs/pseudo-random -- particle jitter is decorative, not security-sensitive */
import { Component, computed, input, type OnDestroy, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const PALETTE = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

/** Burst direction of the confetti particles. */
export type ConfettiDirection = 'down' | 'up' | 'left' | 'right' | 'radial';

/** A celebratory particle burst. Project a trigger (or use the default button) to fire it. */
@Component({
  selector: 'bui-confetti',
  host: { 'data-slot': 'confetti', '[class]': 'computedClass()' },
  styles: [
    `
      @keyframes bui-confetti-fall {
        to {
          transform: translate(var(--dx), var(--dy)) rotate(var(--rot));
          opacity: 0;
        }
      }
      .bui-confetti-particle {
        animation: bui-confetti-fall 1s ease-out forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .bui-confetti-particle {
          animation: none;
          opacity: 0;
        }
      }
    `,
  ],
  template: `
    <span (click)="fire()" (keydown.enter)="fire()" (keydown.space)="fire()">
      <ng-content>
        <button
          type="button"
          class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Celebrate 🎉
        </button>
      </ng-content>
    </span>
    <div [class]="layerClass()" aria-hidden="true">
      @for (particle of particles(); track particle.id) {
        <span
          class="bui-confetti-particle absolute size-2 rounded-sm"
          [style]="particle.style"
        ></span>
      }
    </div>
  `,
})
export class BuiConfetti implements OnDestroy {
  /** Number of particles emitted per burst. */
  readonly count = input(80);
  /** Horizontal spread factor of the burst. */
  readonly spread = input(70);
  /** Direction the particles fly out from the origin. */
  readonly direction = input<ConfettiDirection>('down');
  /** Rain confetti across the whole viewport instead of bursting from the trigger. */
  readonly fullscreen = input(false);
  /** Particle colours; defaults to the built-in palette. */
  readonly colors = input<readonly string[] | null>(null);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly particles = signal<{ id: number; style: string }[]>([]);
  private timer: ReturnType<typeof setTimeout> | undefined;
  private seq = 0;
  protected readonly computedClass = computed(() => cn('relative inline-block', this.userClass()));
  // Fullscreen rains over a fixed, viewport-covering layer; otherwise particles burst from the
  // trigger's centre (a zero-size anchor at 50%/50%).
  protected readonly layerClass = computed(() =>
    this.fullscreen()
      ? 'pointer-events-none fixed inset-0 z-[100]'
      : 'pointer-events-none absolute top-1/2 left-1/2 size-0',
  );

  protected fire(): void {
    const colors = this.colors() ?? PALETTE;
    const isFullscreen = this.fullscreen();
    const direction = this.direction();
    const batch = Array.from({ length: this.count() }, () => {
      const rot = (Math.random() * 720 - 360).toFixed(0);
      const color = colors[Math.floor(Math.random() * colors.length)];
      const delay = (Math.random() * 0.15).toFixed(2);
      this.seq += 1;
      const motion = isFullscreen ? this.rain() : this.burst(direction);
      return {
        id: this.seq,
        style: `${motion}--rot:${rot}deg;background:${color};animation-delay:${delay}s`,
      };
    });
    this.particles.set(batch);
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(
      () => {
        this.particles.set([]);
      },
      isFullscreen ? 2600 : 1200,
    );
  }

  /** Translation vars for a burst from the origin, by direction. */
  private burst(direction: ConfettiDirection): string {
    const spread = this.spread();
    const rand = Math.random;
    let dx: number;
    let dy: number;
    switch (direction) {
      case 'up': {
        dx = (rand() - 0.5) * spread * 4;
        dy = -(80 + rand() * 120);
        break;
      }
      case 'left': {
        dx = -(100 + rand() * spread * 3);
        dy = (rand() - 0.5) * spread * 2;
        break;
      }
      case 'right': {
        dx = 100 + rand() * spread * 3;
        dy = (rand() - 0.5) * spread * 2;
        break;
      }
      case 'radial': {
        const angle = rand() * Math.PI * 2;
        const distance = 80 + rand() * 120;
        dx = Math.cos(angle) * distance;
        dy = Math.sin(angle) * distance;
        break;
      }
      default: {
        dx = (rand() - 0.5) * spread * 4;
        dy = 80 + rand() * 120;
      }
    }
    return `--dx:${dx.toFixed(0)}px;--dy:${dy.toFixed(0)}px;`;
  }

  /** Position + fall vars for a particle raining from the top of the viewport. */
  private rain(): string {
    const startX = (Math.random() * 100).toFixed(2);
    const drift = ((Math.random() - 0.5) * 160).toFixed(0);
    return `left:${startX}vw;top:-5vh;--dx:${drift}px;--dy:110vh;animation-duration:2.4s;`;
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}
