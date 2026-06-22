import { Component, computed, Directive, input } from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { type ClassValue, cn } from '../utils/cn';

/** Pagination navigation landmark. */
@Directive({
  selector: 'nav[buiPagination]',
  host: {
    role: 'navigation',
    '[attr.aria-label]': 'ariaLabelText()',
    'data-slot': 'pagination',
    '[class]': 'computedClass()',
  },
})
export class BuiPagination {
  /** Accessible label for the navigation landmark; falls back to a localized default. */
  readonly ariaLabel = input<string>();
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly ariaLabelText = buiLabel('pagination', this.ariaLabel);
  protected readonly computedClass = computed(() =>
    cn('mx-auto flex w-full justify-center', this.userClass()),
  );
}

@Directive({
  selector: 'ul[buiPaginationContent]',
  host: { 'data-slot': 'pagination-content', '[class]': 'computedClass()' },
})
export class BuiPaginationContent {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('flex flex-row items-center gap-1', this.userClass()),
  );
}

@Directive({
  selector: 'li[buiPaginationItem]',
  host: { 'data-slot': 'pagination-item' },
})
export class BuiPaginationItem {}

const LINK_BASE =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";
const LINK_SIZES = {
  default: 'h-9 px-4 py-2 has-[>svg]:px-3',
  sm: 'h-8 gap-1.5 px-3',
  lg: 'h-10 px-6',
  icon: 'size-9',
} as const;

/** A pagination link; set `active` for the current page. */
@Directive({
  selector: 'a[buiPaginationLink]',
  host: {
    'data-slot': 'pagination-link',
    '[attr.aria-current]': "active() ? 'page' : null",
    '[attr.data-active]': "active() ? 'true' : null",
    '[class]': 'computedClass()',
  },
})
export class BuiPaginationLink {
  /** Whether this link represents the current page; sets `aria-current="page"`. */
  readonly active = input(false);
  /** Size variant controlling link dimensions and padding. */
  readonly size = input<keyof typeof LINK_SIZES>('icon');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      LINK_BASE,
      this.active()
        ? 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground'
        : 'hover:bg-accent hover:text-accent-foreground',
      LINK_SIZES[this.size()],
      this.userClass(),
    ),
  );
}

/** Ellipsis indicator for skipped pages. */
@Component({
  selector: 'bui-pagination-ellipsis',
  host: { 'data-slot': 'pagination-ellipsis', 'aria-hidden': 'true', '[class]': 'computedClass()' },
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="size-4"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
    <span class="sr-only">{{ moreText() }}</span>
  `,
})
export class BuiPaginationEllipsis {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  /** Visually-hidden label announcing skipped pages; falls back to a localized default. */
  readonly moreLabel = input<string>();
  protected readonly moreText = buiLabel('paginationMore', this.moreLabel);
  protected readonly computedClass = computed(() =>
    cn('flex size-9 items-center justify-center', this.userClass()),
  );
}
