import { afterNextRender, Component, computed, input, type OnDestroy, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A live countdown to a target time (`role="timer"`). SSR-safe — ticks only in the browser. */
@Component({
  selector: 'bui-countdown',
  host: {
    'data-slot': 'countdown',
    role: 'timer',
    'aria-live': 'off',
    '[class]': 'computedClass()',
  },
  template: `
    @if (done()) {
      <span data-slot="countdown-expired" class="text-sm font-medium text-muted-foreground">
        {{ expired() }}
      </span>
    } @else {
      <div class="flex items-center gap-2">
        @for (unit of units(); track unit.key) {
          <div
            data-slot="countdown-unit"
            class="flex min-w-[3.25rem] flex-col items-center rounded-lg border bg-card px-2 py-1.5 shadow-xs"
          >
            <span class="text-xl font-bold tabular-nums">{{ unit.value }}</span>
            <span class="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              {{ unit.label }}
            </span>
          </div>
        }
      </div>
    }
  `,
})
export class BuiCountdown implements OnDestroy {
  readonly to = input.required<string | number | Date>();
  readonly expired = input('Expired');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly now = signal(Date.now());
  private timer: ReturnType<typeof setInterval> | undefined;
  private readonly targetMs = computed(() => new Date(this.to()).getTime());
  private readonly diff = computed(() => Math.max(0, this.targetMs() - this.now()));
  protected readonly done = computed(() => this.diff() <= 0);
  protected readonly units = computed(() => {
    const diff = this.diff();
    const pad = (value: number): string => String(value).padStart(2, '0');
    return [
      { key: 'days', label: 'Days', value: pad(Math.floor(diff / 86_400_000)) },
      { key: 'hours', label: 'Hrs', value: pad(Math.floor(diff / 3_600_000) % 24) },
      { key: 'minutes', label: 'Min', value: pad(Math.floor(diff / 60_000) % 60) },
      { key: 'seconds', label: 'Sec', value: pad(Math.floor(diff / 1000) % 60) },
    ];
  });
  protected readonly computedClass = computed(() =>
    cn('inline-flex items-center gap-2', this.userClass()),
  );

  constructor() {
    afterNextRender(() => {
      this.timer = setInterval(() => {
        this.now.set(Date.now());
      }, 1000);
    });
  }

  ngOnDestroy(): void {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
    }
  }
}
