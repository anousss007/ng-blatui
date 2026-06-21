import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export interface SchedulerEvent {
  title: string;
  day: number;
  start: string;
  end: string;
  color?: string;
}
interface PlacedEvent {
  title: string;
  dayIndex: number;
  top: number;
  height: number;
  color: string;
}

const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function toMinutes(value: string): number {
  const parts = value.split(':');
  return Number(parts.at(0) ?? '0') * 60 + Number(parts.at(1) ?? '0');
}

/** A week/day calendar grid with positioned events. SSR-safe. */
@Component({
  selector: 'bui-scheduler',
  host: { 'data-slot': 'scheduler', '[class]': 'computedClass()' },
  template: `
    <div role="grid" [attr.aria-label]="label()" class="overflow-hidden rounded-lg border text-sm">
      <div class="flex border-b">
        <div class="w-12 shrink-0"></div>
        @for (day of dayLabels(); track $index) {
          <div class="flex-1 border-l p-2 text-center text-xs font-medium">{{ day }}</div>
        }
      </div>
      <div class="flex">
        <div class="w-12 shrink-0">
          @for (hour of hours(); track hour) {
            <div class="h-14 pt-0.5 pr-1 text-right text-[10px] text-muted-foreground">
              {{ formatHour(hour) }}
            </div>
          }
        </div>
        @for (day of dayLabels(); track $index; let di = $index) {
          <div class="relative flex-1 border-l">
            @for (hour of hours(); track hour) {
              <div class="h-14 border-b border-dashed last:border-b-0"></div>
            }
            @for (event of eventsFor(di); track $index) {
              <div
                class="absolute inset-x-0.5 overflow-hidden rounded px-1.5 py-0.5 text-[11px] leading-tight text-white"
                [class]="event.color"
                [style.top.%]="event.top"
                [style.height.%]="event.height"
              >
                {{ event.title }}
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class BuiScheduler {
  readonly events = input<readonly SchedulerEvent[]>([]);
  readonly days = input<readonly string[]>([]);
  readonly startHour = input(8);
  readonly endHour = input(18);
  readonly view = input<'week' | 'day'>('week');
  readonly label = input('Schedule');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly span = computed(() => Math.max(1, this.endHour() - this.startHour()));
  protected readonly hours = computed(() =>
    Array.from({ length: this.span() }, (_, index) => this.startHour() + index),
  );
  protected readonly dayLabels = computed<readonly string[]>(() => {
    if (this.days().length > 0) {
      return this.days();
    }
    return this.view() === 'day' ? ['Today'] : WEEK;
  });
  private readonly placed = computed<PlacedEvent[]>(() => {
    const startMinutes = this.startHour() * 60;
    const total = this.span() * 60;
    return this.events().map((event) => ({
      title: event.title,
      dayIndex: event.day,
      top: ((toMinutes(event.start) - startMinutes) / total) * 100,
      height: ((toMinutes(event.end) - toMinutes(event.start)) / total) * 100,
      color: event.color ?? 'bg-primary',
    }));
  });
  protected readonly computedClass = computed(() => cn('block', this.userClass()));

  protected eventsFor(dayIndex: number): PlacedEvent[] {
    return this.placed().filter((event) => event.dayIndex === dayIndex);
  }

  protected formatHour(hour: number): string {
    if (hour === 0) {
      return '12 AM';
    }
    if (hour < 12) {
      return `${hour} AM`;
    }
    if (hour === 12) {
      return '12 PM';
    }
    return `${hour - 12} PM`;
  }
}
