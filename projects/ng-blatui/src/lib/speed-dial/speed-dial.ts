import { Component, computed, ElementRef, inject, input, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export interface SpeedDialAction {
  label: string;
  href?: string;
}

/** A floating action button that expands to a stack of actions. Closes on Escape / outside click. */
@Component({
  selector: 'bui-speed-dial',
  host: {
    'data-slot': 'speed-dial',
    '[class]': 'computedClass()',
    '(document:click)': 'onDocumentClick($event)',
    '(keydown.escape)': 'close()',
  },
  template: `
    <div
      class="absolute flex items-center gap-2"
      [class]="stackClass()"
      [class.pointer-events-none]="!open()"
    >
      @for (action of actions(); track $index) {
        <a
          [href]="action.href || '#'"
          class="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm whitespace-nowrap text-foreground shadow-sm transition-opacity hover:bg-accent"
          [attr.tabindex]="open() ? 0 : -1"
          [style.opacity]="open() ? 1 : 0"
          (click)="close()"
        >
          {{ action.label }}
        </a>
      }
    </div>
    <button
      type="button"
      class="inline-flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      [attr.aria-expanded]="open()"
      [attr.aria-label]="label()"
      (click)="toggle()"
    >
      <svg
        class="size-5 transition-transform"
        [class.rotate-45]="open()"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
    </button>
  `,
})
export class BuiSpeedDial {
  readonly actions = input<readonly SpeedDialAction[]>([]);
  readonly direction = input<'up' | 'down'>('up');
  readonly label = input('Open actions');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly open = signal(false);
  protected readonly stackClass = computed(() =>
    this.direction() === 'up' ? 'bottom-full mb-3 flex-col-reverse' : 'top-full mt-3 flex-col',
  );
  protected readonly computedClass = computed(() =>
    cn('relative inline-flex flex-col items-center', this.userClass()),
  );

  protected toggle(): void {
    this.open.update((value) => !value);
  }

  protected close(): void {
    this.open.set(false);
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }
}
