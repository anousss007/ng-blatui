import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export interface GanttTask {
  name: string;
  start: string;
  end: string;
  progress?: number;
  color?: string;
}
export interface GanttMilestone {
  name: string;
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
function label(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
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
        <p class="text-sm text-muted-foreground">No tasks.</p>
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
  readonly tasks = input<readonly GanttTask[]>([]);
  readonly milestones = input<readonly GanttMilestone[]>([]);
  readonly start = input('');
  readonly end = input('');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

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
    return { tasks, min, max, span: Math.max(1, max - min) };
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
    return label(start === '' ? (this.tasks().at(0)?.start ?? '') : start);
  });
  protected readonly rangeEnd = computed(() => {
    const { tasks, max } = this.bounds();
    const end = this.end();
    if (end !== '') {
      return label(end);
    }
    return tasks.length > 0
      ? new Date(max * 86_400_000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : '';
  });
  protected readonly computedClass = computed(() => cn('block', this.userClass()));
}
