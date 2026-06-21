import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BuiInput } from 'ng-blatui';

import { COMPONENTS } from '../app';

function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/** Gallery index for /components — a searchable grid of every component. */
@Component({
  selector: 'app-components-index',
  imports: [RouterLink, BuiInput],
  template: `
    <div class="space-y-6">
      <header class="space-y-2">
        <h1 class="text-3xl font-bold tracking-tight">Components</h1>
        <p class="text-muted-foreground">
          {{ all.length }} accessible Angular components — open any to see it live with its code.
        </p>
      </header>

      <input
        buiInput
        type="search"
        class="max-w-sm"
        placeholder="Search components…"
        [value]="query()"
        (input)="onSearch($event)"
      />

      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        @for (item of filtered(); track item.slug) {
          <a
            [routerLink]="['/components', item.slug]"
            class="flex flex-col gap-0.5 rounded-lg border bg-card p-4 transition-colors hover:border-foreground/20 hover:bg-accent"
          >
            <span class="font-medium">{{ item.label }}</span>
            <span class="font-mono text-xs text-muted-foreground">{{ item.slug }}</span>
          </a>
        } @empty {
          <p class="col-span-full py-10 text-center text-sm text-muted-foreground">
            No components match “{{ query() }}”.
          </p>
        }
      </div>
    </div>
  `,
})
export class ComponentsIndex {
  protected readonly query = signal('');
  protected readonly all = COMPONENTS.map((slug) => ({ slug, label: titleCase(slug) }));
  protected readonly filtered = computed(() => {
    const query = this.query().trim().toLowerCase();
    if (query === '') {
      return this.all;
    }
    return this.all.filter(
      (item) => item.slug.includes(query) || item.label.toLowerCase().includes(query),
    );
  });

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
