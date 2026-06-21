import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BuiInput } from 'ng-blatui';

import { COMPONENTS } from '../app';

import { CATEGORIES, labelFor } from './categories';

/** Gallery index for /components — searchable, grouped by category like BlatUI. */
@Component({
  selector: 'app-components-index',
  imports: [RouterLink, BuiInput],
  template: `
    <div class="space-y-3">
      <h1 class="text-4xl font-bold tracking-tight">Components</h1>
      <p class="text-lg text-muted-foreground">
        {{ total }} accessible Angular components, faithfully ported from BlatUI. Open any to see it
        live with its code.
      </p>
      <div class="flex flex-wrap gap-2 pt-1 text-sm">
        <a
          routerLink="/blocks"
          class="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 font-medium text-secondary-foreground hover:bg-secondary/80"
          >Blocks</a
        >
        <a
          routerLink="/charts"
          class="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 font-medium text-secondary-foreground hover:bg-secondary/80"
          >Charts</a
        >
        <a
          routerLink="/templates"
          class="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 font-medium text-secondary-foreground hover:bg-secondary/80"
          >Templates</a
        >
      </div>
    </div>

    <input
      buiInput
      type="search"
      class="mt-6 max-w-sm"
      placeholder="Search components…"
      [value]="query()"
      (input)="onSearch($event)"
    />

    @if (query().trim()) {
      <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        @for (item of searchResults(); track item.slug) {
          <a
            [routerLink]="['/components', item.slug]"
            class="flex items-center justify-between rounded-lg border bg-card p-3 text-sm transition-colors hover:border-ring hover:bg-accent/30"
          >
            <span class="font-medium">{{ item.label }}</span>
          </a>
        } @empty {
          <p class="col-span-full py-10 text-center text-sm text-muted-foreground">
            No components match “{{ query() }}”.
          </p>
        }
      </div>
    } @else {
      @for (group of groups; track group.label) {
        <section class="mt-10">
          <h2 class="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {{ group.label }}
          </h2>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
            @for (item of group.items; track item.slug) {
              <a
                [routerLink]="['/components', item.slug]"
                class="flex items-center justify-between rounded-lg border bg-card p-3 text-sm transition-colors hover:border-ring hover:bg-accent/30"
              >
                <span class="font-medium">{{ item.label }}</span>
              </a>
            }
          </div>
        </section>
      }
    }
  `,
})
export class ComponentsIndex {
  protected readonly query = signal('');
  protected readonly total = COMPONENTS.length;

  private readonly present = new Set(COMPONENTS);
  private readonly categorized = new Set(CATEGORIES.flatMap((c) => c.slugs));

  protected readonly groups = (() => {
    const out = CATEGORIES.map((c) => ({
      label: c.label,
      items: c.slugs
        .filter((slug) => this.present.has(slug))
        .map((slug) => ({ slug, label: labelFor(slug) })),
    })).filter((g) => g.items.length > 0);
    const others = COMPONENTS.filter((slug) => !this.categorized.has(slug));
    if (others.length > 0) {
      out.push({ label: 'Other', items: others.map((slug) => ({ slug, label: labelFor(slug) })) });
    }
    return out;
  })();

  private readonly all = COMPONENTS.map((slug) => ({ slug, label: labelFor(slug) }));
  protected readonly searchResults = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.all.filter(
      (index) => index.slug.includes(q) || index.label.toLowerCase().includes(q),
    );
  });

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
