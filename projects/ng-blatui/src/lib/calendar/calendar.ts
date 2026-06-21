import { Component, computed, input, model, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

interface Day {
  iso: string;
  num: number;
  inMonth: boolean;
  isToday: boolean;
  disabled: boolean;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function pad(value: number): string {
  return String(value).padStart(2, '0');
}
function isoOf(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** A single-month date calendar. Pick a day; navigate months. SSR-safe. */
@Component({
  selector: 'bui-calendar',
  host: { 'data-slot': 'calendar', '[class]': 'computedClass()' },
  template: `
    <div class="flex items-center justify-between pb-2">
      <button
        type="button"
        class="inline-flex size-7 items-center justify-center rounded-md hover:bg-accent"
        aria-label="Previous month"
        (click)="changeMonth(-1)"
      >
        <svg
          class="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <div class="text-sm font-medium" aria-live="polite">{{ monthLabel() }}</div>
      <button
        type="button"
        class="inline-flex size-7 items-center justify-center rounded-md hover:bg-accent"
        aria-label="Next month"
        (click)="changeMonth(1)"
      >
        <svg
          class="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
    <table role="grid" class="w-full border-collapse">
      <thead>
        <tr>
          @for (weekday of weekdays(); track weekday) {
            <th scope="col" class="size-9 text-xs font-normal text-muted-foreground">
              {{ weekday }}
            </th>
          }
        </tr>
      </thead>
      <tbody>
        @for (week of weeks(); track $index) {
          <tr>
            @for (day of week; track day.iso) {
              <td class="p-0 text-center">
                <button
                  type="button"
                  class="size-9 rounded-md text-sm"
                  [class]="dayClass(day)"
                  [attr.aria-pressed]="day.iso === value()"
                  [attr.aria-current]="day.isToday ? 'date' : null"
                  [disabled]="day.disabled"
                  (click)="select(day.iso)"
                >
                  {{ day.num }}
                </button>
              </td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class BuiCalendar {
  readonly value = model('');
  readonly weekStart = input(0);
  readonly minDate = input('');
  readonly maxDate = input('');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly view = signal(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  protected readonly weekdays = computed(() => {
    const start = ((this.weekStart() % 7) + 7) % 7;
    return [...WEEKDAYS.slice(start), ...WEEKDAYS.slice(0, start)];
  });
  protected readonly monthLabel = computed(() =>
    this.view().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  );
  protected readonly weeks = computed<Day[][]>(() => {
    const view = this.view();
    const year = view.getFullYear();
    const month = view.getMonth();
    const offset = (((new Date(year, month, 1).getDay() - this.weekStart()) % 7) + 7) % 7;
    const today = isoOf(new Date());
    return Array.from({ length: 6 }, (_, w) =>
      Array.from({ length: 7 }, (_, d) => {
        const date = new Date(year, month, 1 - offset + w * 7 + d);
        const iso = isoOf(date);
        return {
          iso,
          num: date.getDate(),
          inMonth: date.getMonth() === month,
          isToday: iso === today,
          disabled: this.isDisabled(iso),
        };
      }),
    );
  });
  protected readonly computedClass = computed(() =>
    cn('inline-block rounded-lg bg-card p-3', this.userClass()),
  );

  protected changeMonth(delta: number): void {
    const view = this.view();
    this.view.set(new Date(view.getFullYear(), view.getMonth() + delta, 1));
  }

  protected select(iso: string): void {
    this.value.set(iso);
  }

  protected dayClass(day: Day): string {
    if (day.iso === this.value()) {
      return 'bg-primary text-primary-foreground font-medium';
    }
    return cn(
      'hover:bg-accent disabled:pointer-events-none disabled:opacity-40',
      day.inMonth ? '' : 'text-muted-foreground/50',
      day.isToday ? 'border border-primary' : '',
    );
  }

  private isDisabled(iso: string): boolean {
    const min = this.minDate();
    const max = this.maxDate();
    return (min !== '' && iso < min) || (max !== '' && iso > max);
  }
}
