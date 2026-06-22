import { Component, computed, input } from '@angular/core';

import type { OrgNode } from './org-chart';

/** A single org-chart node (a card + recursive children). Rendered on an `<li>`. */
@Component({
  selector: 'li[buiOrgChartNode]',

  imports: [BuiOrgChartNode],
  host: { 'data-slot': 'org-chart-node' },
  template: `
    <div
      class="relative z-10 flex w-40 flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center text-card-foreground shadow-sm"
    >
      <span
        class="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-medium"
      >
        @if (node().avatar) {
          <img [src]="node().avatar" alt="" class="size-full object-cover" />
        } @else {
          {{ initials() }}
        }
      </span>
      <span class="text-sm font-medium">{{ node().name }}</span>
      @if (node().title) {
        <span class="text-xs text-muted-foreground">{{ node().title }}</span>
      }
    </div>
    @if (children().length > 0) {
      <ul>
        @for (child of children(); track $index) {
          <li buiOrgChartNode [node]="child"></li>
        }
      </ul>
    }
  `,
})
export class BuiOrgChartNode {
  /** Node rendered as a card, with its `children` recursed into nested `<li>`s. */
  readonly node = input.required<OrgNode>();
  protected readonly children = computed(() => this.node().children ?? []);
  protected readonly initials = computed(() =>
    this.node()
      .name.split(/\s+/)
      .filter((part) => part.length > 0)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join(''),
  );
}
