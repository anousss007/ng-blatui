import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TEMPLATES } from './templates';

function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/** Gallery index for /templates — a grid of cards linking to each template. */
@Component({
  selector: 'app-templates-index',
  imports: [RouterLink],
  template: `
    <div class="space-y-6">
      <header class="space-y-2">
        <h1 class="text-3xl font-bold tracking-tight">Templates</h1>
        <p class="text-muted-foreground">Art-directed full pages you can drop in and theme.</p>
      </header>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (item of all; track item.slug) {
          <a
            [routerLink]="['/templates', item.slug]"
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
export class TemplatesIndex {
  protected readonly all = TEMPLATES.map((slug) => ({ slug, label: titleCase(slug) }));
}
