import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const TREND_CLASS = {
  up: 'text-emerald-600 font-medium',
  down: 'text-destructive font-medium',
  neutral: 'text-muted-foreground font-medium',
} as const;

/** A KPI / statistic card: label, big value, and a trend-coloured change. */
@Component({
  selector: 'bui-stat',
  host: { 'data-slot': 'stat', '[class]': 'computedClass()' },
  template: `
    @if (label()) {
      <span class="text-sm font-medium text-muted-foreground">{{ label() }}</span>
    }
    <span class="text-2xl font-semibold tabular-nums">{{ value() }}</span>
    @if (change()) {
      <span class="flex items-center gap-1.5 text-sm">
        <span [class]="trendClass()">{{ change() }}</span>
        @if (caption()) {
          <span class="text-muted-foreground">{{ caption() }}</span>
        }
      </span>
    }
  `,
})
export class BuiStat {
  readonly label = input<string | null>(null);
  readonly value = input<string | number>('');
  readonly change = input<string | null>(null);
  readonly trend = input<'up' | 'down' | 'neutral' | null>(null);
  readonly caption = input<string | null>(null);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly resolvedTrend = computed<'up' | 'down' | 'neutral'>(() => {
    const explicit = this.trend();
    if (explicit) {
      return explicit;
    }
    const change = (this.change() ?? '').trim();
    if (change.startsWith('+')) {
      return 'up';
    }
    if (change.startsWith('-') || change.startsWith('−')) {
      return 'down';
    }
    return 'neutral';
  });
  protected readonly trendClass = computed(() => TREND_CLASS[this.resolvedTrend()]);
  protected readonly computedClass = computed(() =>
    cn('flex flex-col gap-1 rounded-lg border bg-card p-4', this.userClass()),
  );
}
