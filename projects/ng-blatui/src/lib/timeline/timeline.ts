import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A vertical timeline list. Use `li[buiTimelineItem]` for each entry. */
@Directive({
  selector: 'ol[buiTimeline]',
  host: { 'data-slot': 'timeline', '[class]': 'computedClass()' },
})
export class BuiTimeline {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'relative flex flex-col [&>li:last-child_[data-slot=timeline-line]]:hidden',
      this.userClass(),
    ),
  );
}
