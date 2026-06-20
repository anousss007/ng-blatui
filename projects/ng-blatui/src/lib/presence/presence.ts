import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const COLORS = {
  online: 'bg-emerald-500',
  away: 'bg-amber-500',
  busy: 'bg-red-500',
  offline: 'bg-gray-400',
} as const;
const LABELS = { online: 'Online', away: 'Away', busy: 'Busy', offline: 'Offline' } as const;
const SIZES = { sm: 'size-2', default: 'size-2.5', lg: 'size-3' } as const;

/** A small status dot (online/away/busy/offline). Status is never colour-only — the label is always present. */
@Component({
  selector: 'bui-presence',
  host: { 'data-slot': 'presence', '[class]': 'computedClass()' },
  styles: [
    `
      @media (prefers-reduced-motion: reduce) {
        .bui-presence-ping {
          animation: none;
        }
      }
    `,
  ],
  template: `
    <span class="relative flex" [class]="sizeClass()">
      @if (pulse() && status() === 'online') {
        <span
          class="bui-presence-ping absolute inline-flex size-full animate-ping rounded-full opacity-75"
          [class]="colorClass()"
          aria-hidden="true"
        ></span>
      }
      <span
        class="relative inline-flex size-full rounded-full ring-2 ring-background"
        [class]="colorClass()"
        aria-hidden="true"
      ></span>
    </span>
    <span [class]="showLabel() ? 'text-sm' : 'sr-only'">{{ labelText() }}</span>
  `,
})
export class BuiPresence {
  readonly status = input<keyof typeof COLORS>('online');
  readonly size = input<keyof typeof SIZES>('default');
  readonly pulse = input(false);
  readonly label = input('');
  readonly showLabel = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly colorClass = computed(() => COLORS[this.status()]);
  protected readonly sizeClass = computed(() => SIZES[this.size()]);
  protected readonly labelText = computed(() => this.label() || LABELS[this.status()]);
  protected readonly computedClass = computed(() =>
    cn('inline-flex items-center gap-1.5', this.userClass()),
  );
}
