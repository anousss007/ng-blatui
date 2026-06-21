import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BLOCKS } from './blocks';

function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/** Gallery index for /blocks — a grid of cards linking to each block. */
@Component({
  selector: 'app-blocks-index',
  imports: [RouterLink],
  template: `
    <div class="space-y-6">
      <header class="space-y-2">
        <h1 class="text-3xl font-bold tracking-tight">Blocks</h1>
        <p class="text-muted-foreground">
          Full-section layouts — auth, marketing, pricing, dashboards, sidebars and calendars.
        </p>
      </header>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (item of all; track item.slug) {
          <a
            [routerLink]="['/blocks', item.slug]"
            class="group block overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
          >
            <div class="grid h-32 place-items-center bg-muted text-sm font-medium">
              {{ item.label }}
            </div>
            <div class="flex items-center justify-between border-t px-4 py-3">
              <span class="font-medium">{{ item.label }}</span>
              <span class="text-sm text-muted-foreground group-hover:text-foreground">View →</span>
            </div>
          </a>
        }
      </div>
    </div>
  `,
})
export class BlocksIndex {
  protected readonly all = BLOCKS.map((slug) => ({ slug, label: titleCase(slug) }));
}
