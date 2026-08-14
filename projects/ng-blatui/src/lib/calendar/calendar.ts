import { Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { buiLabel } from '../i18n/labels';
import { BUI_GRID_CALENDAR, buiLocale, buiWeekInfo } from '../i18n/locale';
import { type ClassValue, cn } from '../utils/cn';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

/** Selection behavior of the calendar. */
export type CalendarMode = 'single' | 'range' | 'multiple';
export interface CalendarRange {
  /** Start date of the range, as `yyyy-mm-dd`. */
  start: string;
  /** End date of the range, as `yyyy-mm-dd`. */
  end: string;
}

interface Day {
  iso: string;
  /** Day number rendered in the locale's numbering system — `16` in `fr`, `١٦` in `ar-EG`. */
  num: string;
  inMonth: boolean;
  isToday: boolean;
  disabled: boolean;
}
interface MonthGrid {
  key: string;
  label: string;
  weeks: Day[][];
}
interface Weekday {
  /** Day index, `0` = Sunday. Stable across locales, so it is the `@for` track key. */
  day: number;
  /** Abbreviation shown in the column header. */
  label: string;
  /** Full name, exposed to assistive tech since the abbreviation can be ambiguous. */
  name: string;
}

/** How weekday column headers are abbreviated. `short` is each locale's native abbreviation. */
export type WeekdayFormat = 'narrow' | 'short' | 'long';

/** Pattern of the month caption ("July 2026") — matches the pre-locale rendering in `en-US`. */
const DEFAULT_MONTH_FORMAT: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };

/** 2000-01-02 was a Sunday, so `+ day` lands on the weekday with index `day`. */
function dateOfWeekday(day: number): Date {
  return new Date(2000, 0, 2 + day);
}

const WEEK_MS = 7 * 86_400_000;

/** The `firstDay`-aligned week that a UTC date falls in. */
function startOfWeek(date: Date, firstDay: number): Date {
  const offset = (((date.getUTCDay() - firstDay) % 7) + 7) % 7;
  const start = new Date(date);
  start.setUTCDate(date.getUTCDate() - offset);
  return start;
}

/**
 * Week-of-year under the locale's own rule rather than a hardcoded ISO-8601.
 *
 * Week 1 is the first week holding at least `minimalDays` days of January, which is the same as
 * saying it is the week containing January `minimalDays` — that yields the ISO rule at
 * `minimalDays: 4` (week of Jan 4) and the US rule at `minimalDays: 1` (week of Jan 1).
 */
function weekOfYear(date: Date, firstDay: number, minimalDays: number): number {
  const start = startOfWeek(date, firstDay);
  const weekOneOf = (year: number): Date =>
    startOfWeek(new Date(Date.UTC(year, 0, minimalDays)), firstDay);
  const year = date.getUTCFullYear();
  // A late-December week can already belong to next year's week 1, and an early-January one to
  // last year's final week.
  if (start.getTime() >= weekOneOf(year + 1).getTime()) {
    return 1;
  }
  let weekOne = weekOneOf(year);
  if (start.getTime() < weekOne.getTime()) {
    weekOne = weekOneOf(year - 1);
  }
  return 1 + Math.round((start.getTime() - weekOne.getTime()) / WEEK_MS);
}

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
  host: { 'data-slot': 'calendar', '[class]': 'computedClass()', '(focusout)': 'onTouched()' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BuiCalendar), multi: true },
  ],
  template: `
    <div class="flex items-center justify-between pb-2">
      <button
        type="button"
        class="inline-flex size-7 items-center justify-center rounded-md hover:bg-accent"
        [attr.aria-label]="previousMonthText()"
        (click)="changeMonth(-1)"
      >
        <svg
          class="blat-rtl-flip size-4"
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
            [attr.aria-label]="monthText()"
            class="rounded-md border-0 bg-transparent py-1 text-sm font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            [value]="viewMonth()"
            (change)="setMonth($event)"
          >
            @for (month of monthOptions(); track month.value) {
              <option [value]="month.value">{{ month.label }}</option>
            }
          </select>
          <select
            [attr.aria-label]="yearText()"
            class="rounded-md border-0 bg-transparent py-1 text-sm font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            [value]="viewYear()"
            (change)="setYear($event)"
          >
            @for (year of years(); track year.value) {
              <option [value]="year.value">{{ year.label }}</option>
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
        [attr.aria-label]="nextMonthText()"
        (click)="changeMonth(1)"
      >
        <svg
          class="blat-rtl-flip size-4"
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
                  <th
                    scope="col"
                    class="h-9 min-w-9 text-xs font-normal text-muted-foreground"
                    [attr.aria-label]="weekText()"
                  >
                    #
                  </th>
                }
                @for (weekday of weekdays(); track weekday.day) {
                  <th
                    scope="col"
                    class="h-9 min-w-9 px-1 text-xs font-normal text-muted-foreground"
                    [attr.aria-label]="weekday.name"
                  >
                    {{ weekday.label }}
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
                          [disabled]="day.disabled || disabled()"
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
export class BuiCalendar implements ControlValueAccessor {
  /** Selected day (mode="single") as `yyyy-mm-dd`. Two-way bindable with `[(value)]`. */
  readonly value = model('');
  /** Selection mode: `single` | `range` | `multiple`. */
  readonly mode = input<CalendarMode>('single');
  /** Selected range (mode="range"). */
  readonly range = model<CalendarRange>({ start: '', end: '' });
  /** Selected days (mode="multiple"). */
  readonly values = model<readonly string[]>([]);
  /** Number of month grids to render side by side. */
  readonly months = input(1);
  /**
   * First day of the week (0 = Sunday). Defaults to the locale's own convention — Sunday in
   * `en-US`, Monday in `fr`, Saturday in `ar-EG`.
   */
  readonly weekStart = input<number>();
  /** Earliest selectable date (`yyyy-mm-dd`). */
  readonly minDate = input('');
  /** Latest selectable date (`yyyy-mm-dd`). */
  readonly maxDate = input('');
  /** Specific ISO dates (yyyy-mm-dd) to disable. */
  readonly disabledDates = input<readonly string[]>([]);
  /** Disable the locale's weekend days — Saturday/Sunday in `en-US`, Friday/Saturday in `ar-EG`. */
  readonly disableWeekends = input(false);
  /** Show an ISO week-number column on the left. */
  readonly showWeekNumbers = input(false);
  /** `dropdown` swaps the month label for month + year selects (single month only). */
  readonly captionLayout = input<'label' | 'dropdown'>('label');
  /** Hide days that fall outside the current month. */
  readonly hideOutsideDays = input(false);
  /** Whether the whole calendar is disabled. Two-way bindable with `[(disabled)]`. */
  readonly disabled = model(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  /** BCP 47 locale used for the month captions. Defaults to the app's `LOCALE_ID`. */
  readonly locale = input<string>();
  /**
   * `Intl.DateTimeFormat` options for the month caption. Replaces the default wholesale, so
   * `{ dateStyle: 'short' }` and `{ month: 'long' }` are both valid (they cannot be mixed).
   */
  readonly monthFormat = input<Intl.DateTimeFormatOptions>(DEFAULT_MONTH_FORMAT);
  /** How weekday column headers are abbreviated: each locale's own `short` form by default. */
  readonly weekdayFormat = input<WeekdayFormat>('short');
  /**
   * Override the weekday column headers outright — 7 entries, **Sunday first**, regardless of
   * `weekStart`. For when a locale's `Intl` abbreviation is not what your design wants.
   */
  readonly weekdayLabels = input<readonly string[]>();
  /** Accessible label for the previous-month button. */
  readonly previousMonthLabel = input<string>();
  /** Accessible label for the month dropdown. */
  readonly monthSelectLabel = input<string>();
  /** Accessible label for the year dropdown. */
  readonly yearLabel = input<string>();
  /** Accessible label for the next-month button. */
  readonly nextMonthLabel = input<string>();
  /** Accessible label for the week-number column. */
  readonly weekLabel = input<string>();

  protected readonly previousMonthText = buiLabel('calendarPreviousMonth', this.previousMonthLabel);
  protected readonly monthText = buiLabel('calendarMonth', this.monthSelectLabel);
  protected readonly yearText = buiLabel('calendarYear', this.yearLabel);
  protected readonly nextMonthText = buiLabel('calendarNextMonth', this.nextMonthLabel);
  protected readonly weekText = buiLabel('calendarWeek', this.weekLabel);

  private onChange: (value: string) => void = noop;
  protected onTouched: () => void = noop;
  private readonly view = signal(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  protected readonly resolvedLocale = buiLocale(this.locale);
  private readonly weekInfo = buiWeekInfo(this.resolvedLocale);
  /** The locale's first day unless the caller pinned one. */
  private readonly resolvedWeekStart = computed(() => {
    const start = this.weekStart() ?? this.weekInfo().firstDay;
    return ((start % 7) + 7) % 7;
  });
  protected readonly weekdays = computed<Weekday[]>(() => {
    const override = this.weekdayLabels();
    const locale = this.resolvedLocale();
    const abbreviated = new Intl.DateTimeFormat(locale, { weekday: this.weekdayFormat() });
    const full = new Intl.DateTimeFormat(locale, { weekday: 'long' });
    const start = this.resolvedWeekStart();
    return Array.from({ length: 7 }, (_, index) => {
      // `override` is Sunday-first, so it is indexed by the absolute day, not the column.
      const day = (start + index) % 7;
      const date = dateOfWeekday(day);
      return {
        day,
        label: override?.[day] ?? abbreviated.format(date),
        name: full.format(date),
      };
    });
  });
  private readonly monthFormatter = computed(
    () =>
      // Pinned, not defaulted: the caption labels the grid, so it cannot name another calendar.
      new Intl.DateTimeFormat(this.resolvedLocale(), {
        ...this.monthFormat(),
        calendar: BUI_GRID_CALENDAR,
      }),
  );
  /** Day/week/year numbers follow the locale's numbering system; never group a year as "2,026". */
  private readonly numberFormatter = computed(
    () => new Intl.NumberFormat(this.resolvedLocale(), { useGrouping: false }),
  );
  protected readonly monthLabel = computed(() => this.monthFormatter().format(this.view()));
  protected readonly viewMonth = computed(() => this.view().getMonth());
  protected readonly viewYear = computed(() => this.view().getFullYear());
  protected readonly monthOptions = computed(() => {
    // Month names only — the caption's `monthFormat` may carry a year, which a picker must not.
    const names = new Intl.DateTimeFormat(this.resolvedLocale(), { month: 'long' });
    return Array.from({ length: 12 }, (_, index) => ({
      value: index,
      label: names.format(new Date(2000, index, 1)),
    }));
  });
  protected readonly years = computed(() => {
    const current = this.viewYear();
    const format = this.numberFormatter();
    return Array.from({ length: 21 }, (_, index) => {
      const value = current - 10 + index;
      return { value, label: format.format(value) };
    });
  });
  protected readonly monthGrids = computed<MonthGrid[]>(() => {
    const view = this.view();
    return Array.from({ length: Math.max(1, this.months()) }, (_, index) => {
      const base = new Date(view.getFullYear(), view.getMonth() + index, 1);
      return {
        key: `${base.getFullYear()}-${base.getMonth()}`,
        label: this.monthFormatter().format(base),
        weeks: this.weeksFor(base),
      };
    });
  });
  protected readonly computedClass = computed(() =>
    cn('inline-block rounded-lg bg-card p-3', this.userClass()),
  );

  /**
   * Week number for a row, under the locale's rule and aligned on the same first day as the grid
   * — a row cannot be labelled with a week it does not span.
   */
  protected weekNum(iso: string): string {
    const [year, month, day] = iso.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const week = weekOfYear(date, this.resolvedWeekStart(), this.weekInfo().minimalDays);
    return this.numberFormatter().format(week);
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
    this.onChange(iso);
  }

  writeValue(value: string | null | undefined): void {
    this.value.set(typeof value === 'string' ? value : '');
  }

  registerOnChange(callback: (value: string) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
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
    const offset = (((new Date(year, month, 1).getDay() - this.resolvedWeekStart()) % 7) + 7) % 7;
    const today = isoOf(new Date());
    const format = this.numberFormatter();
    return Array.from({ length: 6 }, (_, w) =>
      Array.from({ length: 7 }, (_, d) => {
        const date = new Date(year, month, 1 - offset + w * 7 + d);
        const iso = isoOf(date);
        return {
          iso,
          num: format.format(date.getDate()),
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
      // The weekend is not Saturday/Sunday everywhere — `ar-EG` rests on Friday/Saturday.
      return this.weekInfo().weekend.includes(date.getDay());
    }
    return false;
  }
}
