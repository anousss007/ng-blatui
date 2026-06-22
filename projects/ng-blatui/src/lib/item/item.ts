import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const ITEM_BASE =
  'group/item flex flex-wrap items-center rounded-md border border-transparent text-sm outline-none transition-colors duration-100 [a&]:transition-colors [a&]:hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]';
const ITEM_VARIANTS = {
  default: 'bg-transparent',
  outline: 'border-border',
  muted: 'bg-muted/50',
} as const;
const ITEM_SIZES = {
  default: 'gap-4 p-4',
  sm: 'gap-2.5 px-4 py-3',
} as const;

/** A list/row item; use on a `<div>` or an `<a>`. */
@Directive({
  selector: '[buiItem]',
  host: {
    'data-slot': 'item',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[class]': 'computedClass()',
  },
})
export class BuiItem {
  /** Visual style of the item: transparent, outlined, or muted background. */
  readonly variant = input<keyof typeof ITEM_VARIANTS>('default');
  /** Item density: standard padding or a more compact `sm` size. */
  readonly size = input<keyof typeof ITEM_SIZES>('default');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(ITEM_BASE, ITEM_VARIANTS[this.variant()], ITEM_SIZES[this.size()], this.userClass()),
  );
}

const MEDIA_VARIANTS = {
  default: 'bg-transparent',
  icon: "bg-muted size-8 rounded-sm border [&_svg:not([class*='size-'])]:size-4",
  image: 'size-10 overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover',
} as const;

@Directive({
  selector: '[buiItemMedia]',
  host: {
    'data-slot': 'item-media',
    '[attr.data-variant]': 'variant()',
    '[class]': 'computedClass()',
  },
})
export class BuiItemMedia {
  /** Media presentation: plain, an icon tile, or a cropped image thumbnail. */
  readonly variant = input<keyof typeof MEDIA_VARIANTS>('default');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none',
      MEDIA_VARIANTS[this.variant()],
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[buiItemContent]',
  host: { 'data-slot': 'item-content', '[class]': 'computedClass()' },
})
export class BuiItemContent {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none', this.userClass()),
  );
}

@Directive({
  selector: '[buiItemTitle]',
  host: { 'data-slot': 'item-title', '[class]': 'computedClass()' },
})
export class BuiItemTitle {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('flex w-fit items-center gap-2 text-sm leading-snug font-medium', this.userClass()),
  );
}

@Directive({
  selector: 'p[buiItemDescription]',
  host: { 'data-slot': 'item-description', '[class]': 'computedClass()' },
})
export class BuiItemDescription {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'line-clamp-2 text-sm leading-normal font-normal text-balance text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[buiItemActions]',
  host: { 'data-slot': 'item-actions', '[class]': 'computedClass()' },
})
export class BuiItemActions {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('flex items-center gap-2', this.userClass()),
  );
}

@Directive({
  selector: '[buiItemGroup]',
  host: { 'data-slot': 'item-group', '[class]': 'computedClass()' },
})
export class BuiItemGroup {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('group/item-group flex flex-col', this.userClass()),
  );
}
