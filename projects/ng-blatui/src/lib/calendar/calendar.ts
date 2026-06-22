import { Component, computed, input, model, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export type CalendarMode = 'single' | 'range' | 'multiple';
export interface CalendarRange {
  start: string;
  end: string;
}

interface Day {
  iso: string;
  num: number;
  inMonth: boolean;
  isToday: boolean;
  disabled: boolean;
}
interface MonthGrid {
  key: string;
  label: string;
  weeks: Day[][];
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function pad(value: number): string {
  return String(value).padStart(2, '0');
}
function isoOf(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * A date calendar. Modes: `single` (one day), `range` (start–end), `multiple` (a set of days).
 * Render several months side by side with `months`. SSR-safe.
 */
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
      @if (months() === 1 && captionLayout() === 'dropdown') {
        <div class="flex items-center gap-1">
          <select
            aria-label="Month"
            class="rounded-md border-0 bg-transparent py-1 text-sm font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            [value]="viewMonth()"
            (change)="setMonth($event)"
          >
            @for (month of monthOptions(); track month.value) {
              <option [value]="month.value">{{ month.label }}</option>
            }
          </select>
          <select
            aria-label="Year"
            class="rounded-md border-0 bg-transparent py-1 text-sm font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            [value]="viewYear()"
            (change)="setYear($event)"
          >
            @for (year of years(); track year) {
              <option [value]="year">{{ year }}</option>
            }
          </select>
        </div>
      } @else if (months() === 1) {
        <div class="text-sm font-medium" aria-live="polite">{{ monthLabel() }}</div>
      } @else {
        <span aria-hidden="true"></span>
      }
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
    <div class="flex flex-col gap-4 sm:flex-row">
      @for (grid of monthGrids(); track grid.key) {
        <div>
          @if (months() > 1) {
            <div class="pb-2 text-center text-sm font-medium" aria-live="polite">
              {{ grid.label }}
            </div>
          }
          <table role="grid" class="w-full border-collapse">
            <thead>
              <tr>
                @if (showWeekNumbers()) {
                  <th scope="col" class="size-9 text-xs font-normal text-muted-foreground">#</th>
                }
                @for (weekday of weekdays(); track weekday) {
                  <th scope="col" class="size-9 text-xs font-normal text-muted-foreground">
                    {{ weekday }}
                  </th>
                }
              </tr>
            </thead>
            <tbody>
              @for (week of grid.weeks; track $index) {
                <tr>
                  @if (showWeekNumbers()) {
                    <td class="size-9 text-center text-xs text-muted-foreground/70 tabular-nums">
                      {{ weekNum(week[0].iso) }}
                    </td>
                  }
                  @for (day of week; track day.iso) {
                    <td class="p-0 text-center">
                      @if (day.inMonth || !hideOutsideDays()) {
                        <button
                          type="button"
                          class="size-9 text-sm"
                          [class]="dayClass(day)"
                          [attr.aria-pressed]="isSelected(day.iso)"
                          [attr.aria-current]="day.isToday ? 'date' : null"
                          [disabled]="day.disabled"
                          (click)="select(day.iso)"
                        >
                          {{ day.num }}
                        </button>
                      } @else {
                        <span class="block size-9"></span>
                      }
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class BuiCalendar {
  readonly value = model('');
  /** Selection mode: `single` | `range` | `multiple`. */
  readonly mode = input<CalendarMode>('single');
  /** Selected range (mode="range"). */
  readonly range = model<CalendarRange>({ start: '', end: '' });
  /** Selected days (mode="multiple"). */
  readonly values = model<readonly string[]>([]);
  /** Number of month grids to render side by side. */
  readonly months = input(1);
  readonly weekStart = input(0);
  readonly minDate = input('');
  readonly maxDate = input('');
  /** Specific ISO dates (yyyy-mm-dd) to disable. */
  readonly disabledDates = input<readonly string[]>([]);
  /** Disable Saturdays and Sundays. */
  readonly disableWeekends = input(false);
  /** Show an ISO week-number column on the left. */
  readonly showWeekNumbers = input(false);
  /** `dropdown` swaps the month label for month + year selects (single month only). */
  readonly captionLayout = input<'label' | 'dropdown'>('label');
  /** Hide days that fall outside the current month. */
  readonly hideOutsideDays = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly view = signal(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  protected readonly weekdays = computed(() => {
    const start = ((this.weekStart() % 7) + 7) % 7;
    return [...WEEKDAYS.slice(start), ...WEEKDAYS.slice(0, start)];
  });
  protected readonly monthLabel = computed(() =>
    this.view().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  );
  protected readonly viewMonth = computed(() => this.view().getMonth());
  protected readonly viewYear = computed(() => this.view().getFullYear());
  protected readonly monthOptions = computed(() =>
    Array.from({ length: 12 }, (_, index) => ({
      value: index,
      label: new Date(2000, index, 1).toLocaleDateString('en-US', { month: 'long' }),
    })),
  );
  protected readonly years = computed(() => {
    const current = this.viewYear();
    return Array.from({ length: 21 }, (_, index) => current - 10 + index);
  });
  protected readonly monthGrids = computed<MonthGrid[]>(() => {
    const view = this.view();
    return Array.from({ length: Math.max(1, this.months()) }, (_, index) => {
      const base = new Date(view.getFullYear(), view.getMonth() + index, 1);
      return {
        key: `${base.getFullYear()}-${base.getMonth()}`,
        label: base.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        weeks: this.weeksFor(base),
      };
    });
  });
  protected readonly computedClass = computed(() =>
    cn('inline-block rounded-lg bg-card p-3', this.userClass()),
  );

  protected weekNum(iso: string): number {
    const [year, month, day] = iso.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const dayNumber = (date.getUTCDay() + 6) % 7;
    date.setUTCDate(date.getUTCDate() - dayNumber + 3);
    const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
    return 1 + Math.round((date.getTime() - firstThursday.getTime()) / (7 * 24 * 3600 * 1000));
  }

  protected changeMonth(delta: number): void {
    const view = this.view();
    this.view.set(new Date(view.getFullYear(), view.getMonth() + delta, 1));
  }

  protected setMonth(event: Event): void {
    const month = Number((event.target as HTMLSelectElement).value);
    this.view.set(new Date(this.viewYear(), month, 1));
  }

  protected setYear(event: Event): void {
    const year = Number((event.target as HTMLSelectElement).value);
    this.view.set(new Date(year, this.viewMonth(), 1));
  }

  protected select(iso: string): void {
    const mode = this.mode();
    if (mode === 'range') {
      const { start, end } = this.range();
      if (start === '' || end !== '') {
        this.range.set({ start: iso, end: '' });
      } else if (iso < start) {
        this.range.set({ start: iso, end: start });
      } else {
        this.range.set({ start, end: iso });
      }
      return;
    }
    if (mode === 'multiple') {
      const next = new Set(this.values());
      if (next.has(iso)) {
        next.delete(iso);
      } else {
        next.add(iso);
      }
      this.values.set([...next]);
      return;
    }
    this.value.set(iso);
  }

  protected isSelected(iso: string): boolean {
    if (iso === '') {
      return false;
    }
    switch (this.mode()) {
      case 'range': {
        const { start, end } = this.range();
        return iso === start || iso === end;
      }
      case 'multiple': {
        return this.values().includes(iso);
      }
      default: {
        return iso === this.value();
      }
    }
  }

  private inRangeMiddle(iso: string): boolean {
    if (this.mode() !== 'range') {
      return false;
    }
    const { start, end } = this.range();
    return start !== '' && end !== '' && iso > start && iso < end;
  }

  protected dayClass(day: Day): string {
    if (this.isSelected(day.iso)) {
      return 'rounded-md bg-primary text-primary-foreground font-medium';
    }
    if (this.inRangeMiddle(day.iso)) {
      return 'bg-accent text-accent-foreground';
    }
    return cn(
      'rounded-md hover:bg-accent disabled:pointer-events-none disabled:opacity-40',
      day.inMonth ? '' : 'text-muted-foreground/50',
      day.isToday ? 'border border-primary' : '',
    );
  }

  private weeksFor(base: Date): Day[][] {
    const year = base.getFullYear();
    const month = base.getMonth();
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
          disabled: this.isDisabled(iso, date),
        };
      }),
    );
  }

  private isDisabled(iso: string, date: Date): boolean {
    const min = this.minDate();
    const max = this.maxDate();
    if ((min !== '' && iso < min) || (max !== '' && iso > max)) {
      return true;
    }
    if (this.disabledDates().includes(iso)) {
      return true;
    }
    if (this.disableWeekends()) {
      const day = date.getDay();
      return day === 0 || day === 6;
    }
    return false;
  }
}
