import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A single timeline entry: a dot + connector line and a content area. */
@Component({
  selector: 'li[buiTimelineItem]',
  host: { 'data-slot': 'timeline-item', '[class]': 'computedClass()' },
  template: `
    <div class="relative flex flex-col items-center">
      <span
        data-slot="timeline-dot"
        class="z-10 flex size-8 shrink-0 items-center justify-center rounded-full border"
        [class]="dotClass()"
      >
        <span
          class="size-2 rounded-full"
          [class]="active() ? 'bg-primary-foreground' : 'bg-muted-foreground'"
        ></span>
      </span>
      <span data-slot="timeline-line" class="mt-1 w-px flex-1 bg-border" aria-hidden="true"></span>
    </div>
    <div class="flex-1 pt-1 pb-1">
      @if (time()) {
        <div
          data-slot="timeline-time"
          class="text-xs font-medium text-muted-foreground tabular-nums"
        >
          {{ time() }}
        </div>
      }
      @if (title()) {
        <h3 data-slot="timeline-title" class="text-sm font-semibold">{{ title() }}</h3>
      }
      <ng-content />
    </div>
  `,
})
export class BuiTimelineItem {
  readonly time = input('');
  readonly title = input('');
  readonly active = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly dotClass = computed(() =>
    this.active()
      ? 'bg-primary text-primary-foreground border-primary'
      : 'bg-background text-muted-foreground',
  );
  protected readonly computedClass = computed(() =>
    cn('relative flex gap-4 pb-8 last:pb-0', this.userClass()),
  );
}
