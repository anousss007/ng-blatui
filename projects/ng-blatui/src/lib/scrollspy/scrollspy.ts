import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  signal,
} from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { type ClassValue, cn } from '../utils/cn';

export interface ScrollspyItem {
  /** In-page anchor (e.g. `#section`) linked to and observed for visibility. */
  href: string;
  /** Text shown for this entry in the navigation list. */
  label: string;
}

/** A "on this page" nav that highlights the section currently in view (IntersectionObserver). */
@Component({
  selector: 'bui-scrollspy',
  host: { 'data-slot': 'scrollspy', '[class]': 'computedClass()' },
  template: `
    <nav [attr.aria-label]="labelText()">
      <ul class="space-y-1 text-sm">
        @for (item of items(); track item.href) {
          <li>
            <a
              [href]="item.href"
              [class]="linkClass(item)"
              [attr.aria-current]="isActive(item) ? 'true' : null"
            >
              {{ item.label }}
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
})
export class BuiScrollspy implements OnDestroy {
  /** Sections to track; each item links to and observes its `href` anchor. */
  readonly items = input<readonly ScrollspyItem[]>([]);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  /** Accessible label for the nav element; falls back to a localized default. */
  readonly label = input<string>();

  protected readonly labelText = buiLabel('scrollspy', this.label);

  private readonly document =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.ownerDocument;
  protected readonly active = signal('');
  private observer: IntersectionObserver | undefined;
  protected readonly computedClass = computed(() => cn('block', this.userClass()));

  constructor() {
    afterNextRender(() => {
      this.observe();
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  protected isActive(item: ScrollspyItem): boolean {
    return this.active() === item.href;
  }

  protected linkClass(item: ScrollspyItem): string {
    return cn(
      'block rounded px-2 py-1 transition-colors',
      this.isActive(item)
        ? 'border-s-2 border-primary font-medium text-primary'
        : 'border-s-2 border-transparent text-muted-foreground hover:text-foreground',
    );
  }

  private observe(): void {
    const targets = this.items()
      .map((item) => this.document.querySelector(item.href))
      .filter((element): element is Element => element !== null);
    if (targets.length === 0) {
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id) {
            this.active.set(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: '0px 0px -70% 0px' },
    );
    for (const target of targets) {
      this.observer.observe(target);
    }
  }
}
