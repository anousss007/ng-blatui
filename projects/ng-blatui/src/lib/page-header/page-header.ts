import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/**
 * A page title block with optional description and a slot for actions (`[buiPageHeaderActions]`).
 * Provide the title via the `heading` input or by projecting content.
 */
@Component({
  selector: 'bui-page-header',
  host: { 'data-slot': 'page-header', '[class]': 'computedClass()' },
  template: `
    <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-col gap-1.5">
        <h1 class="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
          {{ heading() }}<ng-content />
        </h1>
        @if (description()) {
          <p class="text-balance text-muted-foreground">{{ description() }}</p>
        }
      </div>
      <div class="flex shrink-0 flex-wrap items-center gap-2">
        <ng-content select="[buiPageHeaderActions]" />
      </div>
    </div>
  `,
})
export class BuiPageHeader {
  /** Title text rendered in the heading (alternative to projecting content). */
  readonly heading = input('');
  /** Optional supporting text shown beneath the heading. */
  readonly description = input('');
  /** Whether to render a bottom border separating the header from the page. */
  readonly separator = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('flex flex-col gap-4', this.separator() && 'border-b pb-6', this.userClass()),
  );
}
