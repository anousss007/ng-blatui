import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TEMPLATES } from './templates';

/** Display-name overrides for slugs that title-casing would mangle. */
const LABEL_OVERRIDES: Record<string, string> = {
  admincn: 'AdminCN',
};

function titleCase(slug: string): string {
  return (
    LABEL_OVERRIDES[slug] ??
    slug
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  );
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
            <div class="aspect-[16/10] overflow-hidden bg-muted">
              <img
                [src]="'previews/templates/' + item.slug + '.jpg'"
                [alt]="item.label + ' template preview'"
                width="1280"
                height="800"
                loading="lazy"
                decoding="async"
                class="size-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
              />
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
