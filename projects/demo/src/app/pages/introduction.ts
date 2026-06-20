import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BuiBadge, BuiButton } from 'ng-blatui';

@Component({
  selector: 'app-introduction',
  imports: [RouterLink, BuiBadge, BuiButton],
  template: `
    <div class="max-w-3xl space-y-10">
      <div class="space-y-4">
        <span buiBadge tone="info" variant="soft">v1.0 · MIT · Angular 22</span>
        <h1 class="text-4xl font-bold tracking-tight">ng-blatui</h1>
        <p class="text-lg text-muted-foreground">
          BlatUI, ported to Angular. Accessible, themeable components built on signals, Angular Aria
          &amp; the CDK and styled with Tailwind CSS v4 — you own the code.
        </p>
        <div class="flex flex-wrap gap-3">
          <a buiButton routerLink="/docs/installation">Get started</a>
          <a buiButton variant="outline" routerLink="/components">Browse components</a>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        @for (f of features; track f.title) {
          <div class="rounded-lg border bg-card p-5">
            <h3 class="font-semibold">{{ f.title }}</h3>
            <p class="mt-1 text-sm text-muted-foreground">{{ f.body }}</p>
          </div>
        }
      </div>
    </div>
  `,
})
export class Introduction {
  protected readonly features = [
    {
      title: 'Accessible by default',
      body: 'Behaviour and ARIA come from Angular Aria + the CDK — keyboard, focus and roles handled for you (WCAG AA).',
    },
    {
      title: 'Signals & zoneless',
      body: 'Built with input()/model()/computed() on Angular 22, zoneless-ready and OnPush by default.',
    },
    {
      title: 'Themeable',
      body: 'Every token is a CSS variable (oklch). Switch base color, accent, radius, fonts live and export the CSS.',
    },
    {
      title: 'SSR-safe',
      body: 'Components render on the server (Angular Universal) without touching browser globals at render time.',
    },
  ];
}
