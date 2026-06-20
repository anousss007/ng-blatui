import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  type OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const TONES = {
  default: 'bg-muted text-foreground border-border',
  primary: 'bg-primary text-primary-foreground border-transparent',
  info: 'bg-info/10 text-info border-info/25',
  success: 'bg-success/10 text-success border-success/25',
  warning: 'bg-warning/10 text-warning border-warning/25',
  danger: 'bg-destructive/10 text-destructive border-destructive/25',
} as const;

/**
 * Full-width announcement bar. Optionally dismissible and (with `persistKey`) remembers
 * the dismissal in localStorage. SSR-safe — localStorage is only touched in the browser.
 */
@Component({
  selector: 'bui-banner',
  host: {
    'data-slot': 'banner',
    role: 'region',
    'aria-label': 'Announcement',
    '[hidden]': '!show()',
    '[class]': 'computedClass()',
  },
  template: `
    <div class="flex flex-1 flex-wrap items-center justify-center gap-x-3 gap-y-1">
      <ng-content />
    </div>
    @if (dismissible()) {
      <button
        type="button"
        aria-label="Dismiss"
        class="shrink-0 rounded-md p-1 opacity-70 transition-opacity outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-current/40"
        (click)="dismiss()"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="size-4"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    }
  `,
})
export class BuiBanner implements OnInit {
  readonly tone = input<keyof typeof TONES>('default');
  readonly dismissible = input(true);
  readonly persistKey = input<string | undefined>(undefined);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly show = signal(true);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly computedClass = computed(() =>
    cn(
      'relative flex w-full items-center gap-3 border-b px-4 py-2.5 text-sm',
      TONES[this.tone()],
      this.userClass(),
    ),
  );

  ngOnInit(): void {
    const key = this.persistKey();
    if (this.isBrowser && key && localStorage.getItem(`bui-banner-${key}`) === '1') {
      this.show.set(false);
    }
  }

  protected dismiss(): void {
    this.show.set(false);
    const key = this.persistKey();
    if (this.isBrowser && key) {
      localStorage.setItem(`bui-banner-${key}`, '1');
    }
  }
}
