/* eslint-disable sonarjs/pseudo-random -- particle jitter is decorative, not security-sensitive */
import { Component, computed, input, type OnDestroy, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const PALETTE = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

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
    <div class="pointer-events-none absolute top-1/2 left-1/2 size-0" aria-hidden="true">
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
  /** Particle colours; defaults to the built-in palette. */
  readonly colors = input<readonly string[] | null>(null);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly particles = signal<{ id: number; style: string }[]>([]);
  private timer: ReturnType<typeof setTimeout> | undefined;
  private seq = 0;
  protected readonly computedClass = computed(() => cn('relative inline-block', this.userClass()));

  protected fire(): void {
    const colors = this.colors() ?? PALETTE;
    const batch = Array.from({ length: this.count() }, () => {
      const dx = (Math.random() - 0.5) * this.spread() * 4;
      const dy = 80 + Math.random() * 120;
      const rot = Math.random() * 720 - 360;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const delay = (Math.random() * 0.1).toFixed(2);
      this.seq += 1;
      return {
        id: this.seq,
        style: `--dx:${dx.toFixed(0)}px;--dy:${dy.toFixed(0)}px;--rot:${rot.toFixed(0)}deg;background:${color};animation-delay:${delay}s`,
      };
    });
    this.particles.set(batch);
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.particles.set([]);
    }, 1200);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}
