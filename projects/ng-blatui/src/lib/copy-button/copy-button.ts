import { Component, computed, input, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** Copy-to-clipboard button: copies `value`, flips to a check, announces "Copied". */
@Component({
  selector: 'button[buiCopyButton]',
  host: {
    type: 'button',
    'data-slot': 'copy-button',
    '[attr.aria-label]': "copied() ? 'Copied' : label()",
    '[class]': 'computedClass()',
    '(click)': 'copy()',
  },
  template: `
    <span class="grid size-4 place-items-center *:col-start-1 *:row-start-1">
      @if (copied()) {
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="size-4 text-success"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      } @else {
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
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      }
    </span>
    <ng-content />
    <span class="sr-only" aria-live="polite">{{ copied() ? 'Copied' : '' }}</span>
  `,
})
export class BuiCopyButton {
  readonly value = input('');
  readonly label = input('Copy');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly copied = signal(false);
  protected readonly computedClass = computed(() =>
    cn(
      'inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-sm font-medium text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
      this.userClass(),
    ),
  );

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.value());
      this.copied.set(true);
      setTimeout(() => {
        this.copied.set(false);
      }, 1500);
    } catch {
      // Clipboard unavailable — ignore.
    }
  }
}
