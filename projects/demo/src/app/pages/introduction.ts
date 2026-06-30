import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  BuiBadge,
  BuiButton,
  BuiCard,
  BuiCardContent,
  BuiCardHeader,
  BuiCardTitle,
} from 'ng-blatui';

interface Feature {
  title: string;
  body: string;
}
interface Explore {
  label: string;
  count: string;
  blurb: string;
  path: string;
}
interface Flagship {
  slug: string;
  name: string;
  kind: string;
}

/** Showcase landing — mirrors the BlatUI home: hero, install, stats, features, explore, flagships. */
@Component({
  selector: 'app-introduction',
  imports: [RouterLink, BuiBadge, BuiButton, BuiCard, BuiCardContent, BuiCardHeader, BuiCardTitle],
  template: `
    <!-- ───────── Hero ───────── -->
    <section class="relative overflow-hidden border-b">
      <div
        class="pointer-events-none absolute inset-x-0 -top-32 -z-10 flex justify-center"
        aria-hidden="true"
      >
        <div class="h-[420px] w-[760px] rounded-full bg-primary/10 blur-3xl"></div>
      </div>
      <div
        class="mx-auto grid max-w-screen-xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24"
      >
        <div>
          <a
            routerLink="/components"
            class="mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium shadow-sm"
          >
            <span class="inline-block size-1.5 animate-pulse rounded-full bg-primary"></span>
            <span class="font-mono">v1.23 · 155 components · 200+ variants</span>
          </a>
          <h1 class="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Beautiful Angular UI.<br />
            <span class="text-primary">Signals, accessible, yours.</span>
          </h1>
          <p class="mt-5 max-w-xl text-lg text-pretty text-muted-foreground">
            The complete BlatUI experience — faithfully ported to Angular 22, Angular Aria, the CDK
            &amp; Tailwind v4. Accessible by default, SSR-safe, no lock-in.
          </p>
          <div class="mt-7">
            <p
              class="mb-2 font-mono text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase"
            >
              // install
            </p>
            <div
              class="flex max-w-md items-center gap-2 rounded-lg border bg-card p-1.5 pl-3 shadow-sm"
            >
              <span class="shrink-0 font-mono text-sm text-primary">$</span>
              <span class="min-w-0 flex-1 truncate font-mono text-sm">npm i ng-blatui</span>
              <button
                type="button"
                class="inline-flex size-7 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Copy install command"
                (click)="copy()"
              >
                <span class="text-xs">{{ copied() ? '✓' : '⧉' }}</span>
              </button>
            </div>
          </div>
          <div class="mt-7 flex flex-wrap items-center gap-3">
            <a buiButton size="lg" routerLink="/components">Browse components →</a>
            <a buiButton size="lg" variant="outline" routerLink="/docs/installation"
              >Read the docs</a
            >
          </div>
          <ul
            class="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
          >
            @for (highlight of highlights; track highlight) {
              <li class="inline-flex items-center gap-1.5">
                <span class="text-primary">✓</span> {{ highlight }}
              </li>
            }
          </ul>
        </div>
        <!-- Terminal mockup -->
        <div class="relative">
          <div class="overflow-hidden rounded-xl border bg-zinc-950 shadow-2xl">
            <div class="flex items-center gap-2 border-b border-white/10 px-3.5 py-2.5">
              <span class="size-3 rounded-full bg-[#ff5f57]"></span>
              <span class="size-3 rounded-full bg-[#febc2e]"></span>
              <span class="size-3 rounded-full bg-[#28c840]"></span>
              <span class="ml-3 font-mono text-xs text-zinc-500">~/app — ng-blatui</span>
            </div>
            <div class="space-y-1 px-4 py-4 font-mono text-[13px] leading-relaxed text-zinc-300">
              <div><span class="text-emerald-400">~/app $</span> npm i ng-blatui</div>
              <div class="text-zinc-500">&nbsp;&nbsp;added 1 package · 155 components</div>
              <div>
                <span class="text-emerald-400">~/app $</span> import &#123; BuiButton &#125; from
                'ng-blatui'
              </div>
              <div>
                <span class="text-emerald-400">&nbsp;&nbsp;✓</span>
                <span class="text-zinc-400">standalone, signal-based</span>
              </div>
              <div>
                <span class="text-emerald-400">&nbsp;&nbsp;✓</span>
                <span class="text-zinc-400">Angular Aria + CDK a11y</span>
              </div>
              <div>
                <span class="text-emerald-400">&nbsp;&nbsp;✓</span>
                <span class="text-cyan-400">you own the code.</span>
              </div>
              <div class="pt-1">
                <span class="text-emerald-400">~/app $</span> <span class="animate-pulse">▋</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ───────── Stats ───────── -->
    <section class="border-b bg-muted/30">
      <div class="mx-auto grid max-w-5xl grid-cols-2 px-6 sm:grid-cols-4">
        @for (stat of stats; track stat.label) {
          <div class="border-r px-6 py-8 text-center last:border-r-0">
            <div class="text-3xl font-bold tracking-tight tabular-nums">{{ stat.value }}</div>
            <div class="mt-1 text-sm text-muted-foreground">{{ stat.label }}</div>
          </div>
        }
      </div>
    </section>

    <!-- ───────── Features ───────── -->
    <section class="border-b">
      <div class="mx-auto max-w-screen-xl px-6 py-16">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need. Nothing you don't.
          </h2>
          <p class="mt-3 text-lg text-muted-foreground">
            Built the Angular way — standalone components, signals, Angular Aria & CDK, Tailwind v4.
          </p>
        </div>
        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (feature of features; track feature.title) {
            <div buiCard variant="sectioned">
              <div buiCardContent class="pt-6">
                <h3 class="font-semibold">{{ feature.title }}</h3>
                <p class="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {{ feature.body }}
                </p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ───────── Explore ───────── -->
    <section class="border-b bg-muted/30">
      <div class="mx-auto max-w-screen-xl px-6 py-16">
        <div class="grid gap-4 sm:grid-cols-3">
          @for (item of explore; track item.label) {
            <a [routerLink]="item.path" class="group block">
              <div
                buiCard
                variant="sectioned"
                class="h-full transition-shadow group-hover:shadow-md"
              >
                <div buiCardHeader>
                  <h3 buiCardTitle class="flex items-center justify-between">
                    {{ item.label }}
                    <span class="text-sm font-normal text-muted-foreground">{{ item.count }}</span>
                  </h3>
                </div>
                <div buiCardContent>
                  <p class="text-sm text-muted-foreground">{{ item.blurb }}</p>
                  <span class="mt-3 inline-flex text-sm font-medium text-primary">Explore →</span>
                </div>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- ───────── Flagship templates ───────── -->
    <section class="border-b">
      <div class="mx-auto max-w-screen-xl px-6 py-16">
        <div class="mx-auto max-w-2xl text-center">
          <span buiBadge variant="secondary">Templates</span>
          <h2 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Art-directed, ready to ship
          </h2>
          <p class="mt-3 text-muted-foreground">
            Full-page starters with their own visual identity — clone a look in one click and make
            it yours.
          </p>
        </div>
        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          @for (flagship of flagships; track flagship.slug) {
            <a
              [routerLink]="['/templates', flagship.slug]"
              class="group block focus-visible:outline-none"
              [attr.aria-label]="flagship.name + ' template — ' + flagship.kind"
            >
              <div
                buiCard
                variant="sectioned"
                class="h-full overflow-hidden transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-ring"
              >
                @switch (flagship.slug) {
                  @case ('aurora') {
                    <!-- Gradient hero on deep space -->
                    <div class="relative h-32 overflow-hidden bg-[#06070f]">
                      <div
                        class="absolute -top-6 -left-6 h-20 w-20 rounded-full bg-[#3b82f6] opacity-60 blur-2xl"
                      ></div>
                      <div
                        class="absolute top-2 -right-4 h-16 w-16 rounded-full bg-[#ec4899] opacity-60 blur-2xl"
                      ></div>
                      <div
                        class="absolute bottom-2 left-1/2 h-12 w-24 -translate-x-1/2 rounded-full bg-[#22d3ee] opacity-40 blur-2xl"
                      ></div>
                      <div
                        class="relative flex h-full flex-col items-center justify-center gap-1.5"
                      >
                        <div class="h-1.5 w-20 rounded-full bg-white/80"></div>
                        <div class="h-1.5 w-14 rounded-full bg-white/40"></div>
                        <div
                          class="mt-1 h-4 w-16 rounded-md bg-gradient-to-r from-[#60a5fa] to-[#f472b6]"
                        ></div>
                      </div>
                    </div>
                  }
                  @case ('cosmos') {
                    <!-- Dark analytics dashboard -->
                    <div class="h-32 bg-[#05060f] p-3">
                      <div class="grid grid-cols-3 gap-1.5">
                        <div class="h-7 rounded bg-[#0a0e24] ring-1 ring-white/5"></div>
                        <div class="h-7 rounded bg-[#0a0e24] ring-1 ring-white/5"></div>
                        <div class="h-7 rounded bg-[#0a0e24] ring-1 ring-white/5"></div>
                      </div>
                      <div
                        class="mt-1.5 flex h-14 items-end gap-1 rounded bg-[#0a0e24] p-1.5 ring-1 ring-white/5"
                      >
                        <div class="h-[40%] w-full rounded-sm bg-[#4338ca]"></div>
                        <div class="h-[70%] w-full rounded-sm bg-[#7c3aed]"></div>
                        <div class="h-[50%] w-full rounded-sm bg-[#db2777]"></div>
                        <div class="h-[85%] w-full rounded-sm bg-[#06b6d4]"></div>
                        <div class="h-[60%] w-full rounded-sm bg-[#fbbf24]"></div>
                      </div>
                    </div>
                  }
                  @case ('vinyl') {
                    <!-- Neon retro record shop -->
                    <div
                      class="relative h-32 overflow-hidden bg-gradient-to-br from-[#1b0a3b] to-[#120726] p-3"
                    >
                      <div
                        class="absolute top-1/2 -right-6 grid h-24 w-24 -translate-y-1/2 place-items-center rounded-full bg-black ring-2 ring-[#ff2d95]/60"
                      >
                        <div class="h-16 w-16 rounded-full ring-1 ring-[#00e5ff]/30"></div>
                        <div class="absolute h-5 w-5 rounded-full bg-[#ff8a00]"></div>
                      </div>
                      <div class="relative flex h-full flex-col justify-end gap-1.5">
                        <div class="h-1.5 w-16 rounded-full bg-[#ffd23f]"></div>
                        <div class="h-1.5 w-10 rounded-full bg-[#ff2d95]"></div>
                      </div>
                    </div>
                  }
                  @case ('brut') {
                    <!-- Brutalist blocks -->
                    <div class="h-32 bg-[#f4f1e8] p-3">
                      <div class="flex h-full flex-col justify-between">
                        <div class="flex gap-1.5">
                          <div class="h-4 w-4 border-2 border-[#111] bg-[#ff4d2e]"></div>
                          <div class="h-4 w-4 border-2 border-[#111] bg-[#2b50ff]"></div>
                          <div class="h-4 w-4 border-2 border-[#111] bg-[#ffd400]"></div>
                          <div class="h-4 w-4 border-2 border-[#111] bg-[#b6ff3c]"></div>
                        </div>
                        <div
                          class="border-2 border-[#111] bg-white px-2 py-1.5 shadow-[3px_3px_0_#111]"
                        >
                          <div class="h-1.5 w-16 bg-[#111]"></div>
                          <div class="mt-1 h-1.5 w-10 bg-[#111]/40"></div>
                        </div>
                      </div>
                    </div>
                  }
                }
                <div buiCardContent class="flex items-center justify-between pt-4">
                  <div>
                    <p class="font-medium">{{ flagship.name }}</p>
                    <p class="text-xs text-muted-foreground">{{ flagship.kind }}</p>
                  </div>
                  <span
                    class="text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                    >→</span
                  >
                </div>
              </div>
            </a>
          }
        </div>
        <div class="mt-8 text-center">
          <a buiButton variant="outline" routerLink="/templates">Browse all 34 templates →</a>
        </div>
      </div>
    </section>

    <!-- ───────── Stack ───────── -->
    <section class="py-12">
      <p
        class="mb-5 text-center font-mono text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase"
      >
        // works with your stack
      </p>
      <div
        class="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 text-sm font-semibold text-muted-foreground/70"
      >
        @for (tech of stack; track tech) {
          <span>{{ tech }}</span>
        }
      </div>
    </section>
  `,
})
export class Introduction {
  protected readonly copied = signal(false);
  protected readonly highlights = [
    'WAI-ARIA',
    'Keyboard & focus',
    'WCAG AA contrast',
    'Light + dark',
    'SSR-safe',
  ];
  protected readonly stats = [
    { value: '155', label: 'Components' },
    { value: '200+', label: 'Variants' },
    { value: '16', label: 'Blocks' },
    { value: '34', label: 'Templates' },
  ];
  protected readonly features: Feature[] = [
    {
      title: 'Accessible by default',
      body: 'Behaviour and ARIA from Angular Aria + the CDK — keyboard, focus and roles handled for you (WCAG AA).',
    },
    {
      title: 'Signals & zoneless',
      body: 'Built with input()/model()/computed() on Angular 22, zoneless-ready and OnPush throughout.',
    },
    {
      title: 'Themeable to the core',
      body: 'Every token is a CSS variable (oklch). Recolor, restyle radius, fonts and shadows live.',
    },
    {
      title: 'SSR-safe',
      body: 'Components render on the server (Angular Universal) without touching browser globals at render time.',
    },
    {
      title: 'You own the code',
      body: 'MIT-licensed, published to npm. Standalone components you can read, fork and extend.',
    },
    {
      title: 'Dark mode built-in',
      body: 'Every component ships light + dark, switchable instantly and persisted across visits.',
    },
  ];
  protected readonly explore: Explore[] = [
    {
      label: 'Components',
      count: '155',
      blurb: 'Buttons, inputs, overlays, data, charts and more — every one accessible.',
      path: '/components',
    },
    {
      label: 'Blocks',
      count: '16',
      blurb: 'Full-section layouts: auth, pricing, dashboards, sidebars and calendars.',
      path: '/blocks',
    },
    {
      label: 'Templates',
      count: '34',
      blurb: 'Art-directed full pages you can drop in and theme.',
      path: '/templates',
    },
  ];
  protected readonly flagships: Flagship[] = [
    { slug: 'aurora', name: 'Aurora', kind: 'Gradient hero' },
    { slug: 'cosmos', name: 'Cosmos', kind: 'Dark dashboard' },
    { slug: 'vinyl', name: 'Vinyl', kind: 'Retro shop' },
    { slug: 'brut', name: 'Brut', kind: 'Brutalist' },
  ];
  protected readonly stack = [
    'Angular 22',
    'Signals',
    'Angular Aria',
    'Angular CDK',
    'Tailwind CSS v4',
    'Vitest',
    'SSR',
  ];

  protected copy(): void {
    if (typeof navigator !== 'undefined') {
      void navigator.clipboard.writeText('npm i ng-blatui');
    }
    this.copied.set(true);
    setTimeout(() => {
      this.copied.set(false);
    }, 1500);
  }
}
