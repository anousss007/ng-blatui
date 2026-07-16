import { Component, computed, input } from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { BUI_GRID_CALENDAR, buiLocale } from '../i18n/locale';
import { type ClassValue, cn } from '../utils/cn';

/** Pattern of the axis bound labels ("Jul 16") — matches the pre-locale rendering in `en-US`. */
const DEFAULT_DATE_FORMAT: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

export interface GanttTask {
  /** Task label shown in the left-hand row gutter. */
  name: string;
  /** Task start date as an ISO `YYYY-MM-DD` string; empty strings are ignored. */
  start: string;
  /** Task end date as an ISO `YYYY-MM-DD` string; empty strings are ignored. */
  end: string;
  /** Completion percentage (0-100) shown as a darker overlay on the bar. */
  progress?: number;
  /** Tailwind background class for the bar; defaults to `bg-primary`. */
  color?: string;
}
export interface GanttMilestone {
  /** Milestone label shown in the left-hand row gutter and as the marker title. */
  name: string;
  /** Milestone date as an ISO `YYYY-MM-DD` string; empty strings are ignored. */
  date: string;
}
interface GanttRow {
  name: string;
  left: number;
  width: number;
  progress: number;
  color: string;
}

function toDay(iso: string): number {
  return Math.floor(new Date(`${iso}T00:00:00`).getTime() / 86_400_000);
}

/** A horizontal Gantt chart positioning task bars over a date range. SSR-safe. */
@Component({
  selector: 'bui-gantt',
  host: { 'data-slot': 'gantt', '[class]': 'computedClass()' },
  template: `
    <div class="space-y-2">
      @for (row of rows(); track row.name) {
        <div class="grid grid-cols-[8rem_1fr] items-center gap-3">
          <span class="truncate text-sm text-muted-foreground">{{ row.name }}</span>
          <div class="relative h-6 rounded bg-muted">
            <div
              class="absolute inset-y-0 overflow-hidden rounded"
              [class]="row.color"
              [style.left.%]="row.left"
              [style.width.%]="row.width"
            >
              @if (row.progress > 0) {
                <div class="h-full bg-black/25" [style.width.%]="row.progress"></div>
              }
            </div>
          </div>
        </div>
      } @empty {
        <p class="text-sm text-muted-foreground">{{ emptyText() }}</p>
      }
      @for (milestone of milestoneRows(); track milestone.name) {
        <div class="grid grid-cols-[8rem_1fr] items-center gap-3">
          <span class="truncate text-sm text-muted-foreground">{{ milestone.name }}</span>
          <div class="relative h-6">
            <span
              class="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[2px] bg-amber-500"
              [style.left.%]="milestone.left"
              [attr.title]="milestone.name"
            ></span>
          </div>
        </div>
      }
    </div>
    @if (rows().length > 0) {
      <div class="mt-2 grid grid-cols-[8rem_1fr] gap-3 text-xs text-muted-foreground">
        <span></span>
        <div class="flex justify-between">
          <span>{{ rangeStart() }}</span
          ><span>{{ rangeEnd() }}</span>
        </div>
      </div>
    }
  `,
})
export class BuiGantt {
  /** Tasks to plot as horizontal bars across the date range. */
  readonly tasks = input<readonly GanttTask[]>([]);
  /** Milestones to plot as diamond markers below the task bars. */
  readonly milestones = input<readonly GanttMilestone[]>([]);
  /** ISO start date overriding the computed range minimum; empty derives it from tasks. */
  readonly start = input('');
  /** ISO end date overriding the computed range maximum; empty derives it from tasks. */
  readonly end = input('');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  /** BCP 47 locale used for the axis bound labels. Defaults to the app's `LOCALE_ID`. */
  readonly locale = input<string>();
  /**
   * `Intl.DateTimeFormat` options for the axis bound labels. Replaces the default wholesale, so
   * `{ dateStyle: 'short' }` is valid (its options cannot be mixed with `month`/`day`).
   */
  readonly dateFormat = input<Intl.DateTimeFormatOptions>(DEFAULT_DATE_FORMAT);
  /** Text shown when there are no tasks to plot. Falls back to `provideBuiLabels`. */
  readonly emptyLabel = input<string>();

  protected readonly emptyText = buiLabel('ganttEmpty', this.emptyLabel);
  private readonly resolvedLocale = buiLocale(this.locale);
  private readonly formatter = computed(
    () =>
      // Gregorian by default so the bounds agree with the day-indexed axis; caller's options win.
      new Intl.DateTimeFormat(this.resolvedLocale(), {
        calendar: BUI_GRID_CALENDAR,
        ...this.dateFormat(),
      }),
  );

  protected readonly milestoneRows = computed(() => {
    const { min, span } = this.bounds();
    return this.milestones()
      .filter((milestone) => milestone.date !== '')
      .map((milestone) => ({
        name: milestone.name,
        left: ((toDay(milestone.date) - min) / span) * 100,
      }));
  });

  private readonly bounds = computed(() => {
    const tasks = this.tasks().filter((task) => task.start !== '' && task.end !== '');
    const starts = tasks.map((task) => toDay(task.start));
    const ends = tasks.map((task) => toDay(task.end));
    const min = this.start() === '' ? Math.min(...starts) : toDay(this.start());
    const max = this.end() === '' ? Math.max(...ends) : toDay(this.end());
    // Keep the latest end as its ISO string: `toDay` counts days from a *local* midnight, so
    // turning a day index back into a Date resolves to the day before east of UTC.
    // No tasks -> `Math.max()` is -Infinity -> `indexOf` misses -> empty label, no throw.
    const maxIso = tasks[ends.indexOf(Math.max(...ends))]?.end ?? '';
    return { tasks, min, max, maxIso, span: Math.max(1, max - min) };
  });
  protected readonly rows = computed<GanttRow[]>(() => {
    const { tasks, min, span } = this.bounds();
    return tasks.map((task) => {
      const startDay = toDay(task.start);
      const endDay = toDay(task.end);
      return {
        name: task.name,
        left: ((startDay - min) / span) * 100,
        width: Math.max(2, ((endDay - startDay) / span) * 100),
        progress: task.progress ?? 0,
        color: task.color ?? 'bg-primary',
      };
    });
  });
  protected readonly rangeStart = computed(() => {
    const start = this.start();
    return this.label(start === '' ? (this.tasks().at(0)?.start ?? '') : start);
  });
  protected readonly rangeEnd = computed(() => {
    const { maxIso } = this.bounds();
    const end = this.end();
    return this.label(end === '' ? maxIso : end);
  });
  protected readonly computedClass = computed(() => cn('block', this.userClass()));

  private label(iso: string): string {
    return this.format(new Date(`${iso}T00:00:00`));
  }

  /** `Intl` throws on an invalid date where `toLocaleDateString` returned "Invalid Date"; an
   *  empty bound (a task with no `start`) is a caller mistake, not a reason to break the chart. */
  private format(date: Date): string {
    return Number.isNaN(date.getTime()) ? '' : this.formatter().format(date);
  }
}
