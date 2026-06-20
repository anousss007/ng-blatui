import { Component, computed, input, type OnDestroy, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** An inline citation marker that reveals a source popover on hover / focus / click. */
@Component({
  selector: 'bui-citation',
  host: {
    'data-slot': 'citation',
    '[class]': 'computedClass()',
    '(mouseenter)': 'show()',
    '(mouseleave)': 'scheduleHide()',
    '(keydown.escape)': 'open.set(false)',
  },
  template: `
    <button
      type="button"
      class="rounded px-0.5 align-super text-[0.7em] leading-none font-medium text-primary hover:bg-primary/10"
      [attr.aria-expanded]="open()"
      [attr.aria-label]="ariaLabel()"
      (click)="open.set(!open())"
      (focus)="show()"
      (blur)="scheduleHide()"
    >
      [{{ index() }}]
    </button>
    @if (open()) {
      <span
        role="tooltip"
        class="absolute z-50 mt-1 block w-64 rounded-md border bg-popover p-3 text-start text-sm font-normal text-popover-foreground normal-case shadow-md"
      >
        @if (title()) {
          <span class="block font-medium">{{ title() }}</span>
        }
        @if (hostname()) {
          <span class="mt-0.5 block text-xs text-muted-foreground">{{ hostname() }}</span>
        }
        @if (snippet()) {
          <span class="mt-1 block text-xs text-muted-foreground">{{ snippet() }}</span>
        }
      </span>
    }
  `,
})
export class BuiCitation implements OnDestroy {
  readonly index = input(1);
  readonly title = input('');
  readonly url = input('');
  readonly snippet = input('');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly open = signal(false);
  private timer: ReturnType<typeof setTimeout> | undefined;
  protected readonly hostname = computed(() => {
    let host = this.url();
    const scheme = host.indexOf('://');
    if (scheme !== -1) {
      host = host.slice(scheme + 3);
    }
    if (host.startsWith('www.')) {
      host = host.slice(4);
    }
    const slash = host.indexOf('/');
    return slash === -1 ? host : host.slice(0, slash);
  });
  protected readonly ariaLabel = computed(() => {
    const suffix = this.title() ? `: ${this.title()}` : '';
    return `Source ${this.index()}${suffix}`;
  });
  protected readonly computedClass = computed(() => cn('relative inline-block', this.userClass()));

  protected show(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.open.set(true);
  }

  protected scheduleHide(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.open.set(false);
    }, 150);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}
