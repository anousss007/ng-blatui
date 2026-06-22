import { Component, computed, Directive, input } from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { type ClassValue, cn } from '../utils/cn';

/** Breadcrumb navigation landmark (`<nav aria-label="breadcrumb">`). */
@Directive({
  selector: 'nav[buiBreadcrumb]',
  host: { '[attr.aria-label]': 'labelText()', 'data-slot': 'breadcrumb' },
})
export class BuiBreadcrumb {
  readonly label = input<string>();
  protected readonly labelText = buiLabel('breadcrumb', this.label);
}

@Directive({
  selector: 'ol[buiBreadcrumbList]',
  host: { 'data-slot': 'breadcrumb-list', '[class]': 'computedClass()' },
})
export class BuiBreadcrumbList {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground sm:gap-2.5',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: 'li[buiBreadcrumbItem]',
  host: { 'data-slot': 'breadcrumb-item', '[class]': 'computedClass()' },
})
export class BuiBreadcrumbItem {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('inline-flex items-center gap-1.5', this.userClass()),
  );
}

@Directive({
  selector: 'a[buiBreadcrumbLink]',
  host: { 'data-slot': 'breadcrumb-link', '[class]': 'computedClass()' },
})
export class BuiBreadcrumbLink {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('transition-colors hover:text-foreground', this.userClass()),
  );
}

/** The current page in a breadcrumb — non-interactive, `aria-current="page"`. */
@Directive({
  selector: '[buiBreadcrumbPage]',
  host: {
    'data-slot': 'breadcrumb-page',
    role: 'link',
    'aria-disabled': 'true',
    'aria-current': 'page',
    '[class]': 'computedClass()',
  },
})
export class BuiBreadcrumbPage {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('font-normal text-foreground', this.userClass()),
  );
}

/** Separator between breadcrumb items (defaults to a chevron). */
@Component({
  selector: 'li[buiBreadcrumbSeparator]',
  host: {
    'data-slot': 'breadcrumb-separator',
    role: 'presentation',
    'aria-hidden': 'true',
    '[class]': 'computedClass()',
  },
  template: `
    <ng-content>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-3.5"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </ng-content>
  `,
})
export class BuiBreadcrumbSeparator {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn('[&>svg]:size-3.5', this.userClass()));
}

/** Collapsed breadcrumb indicator (ellipsis). */
@Component({
  selector: 'li[buiBreadcrumbEllipsis]',
  host: {
    'data-slot': 'breadcrumb-ellipsis',
    role: 'presentation',
    'aria-hidden': 'true',
    '[class]': 'computedClass()',
  },
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
export class BuiBreadcrumbEllipsis {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  readonly moreLabel = input<string>();
  protected readonly moreText = buiLabel('breadcrumbMore', this.moreLabel);
  protected readonly computedClass = computed(() =>
    cn('flex size-9 items-center justify-center', this.userClass()),
  );
}
