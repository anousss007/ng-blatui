import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const BASE =
  'inline rounded-xs underline-offset-4 outline-none transition-colors focus-visible:ring-ring/50 focus-visible:ring-[3px]';

const VARIANTS = {
  default: 'text-primary underline decoration-primary/40 hover:decoration-primary',
  muted: 'text-muted-foreground underline decoration-muted-foreground/30 hover:text-foreground',
  subtle: 'text-current no-underline hover:underline',
} as const;

/** A styled anchor. Set `external` for `target=_blank` + safe `rel`. */
@Directive({
  selector: 'a[buiLink]',
  host: {
    'data-slot': 'link',
    '[class]': 'computedClass()',
    '[attr.target]': "external() ? '_blank' : null",
    '[attr.rel]': "external() ? 'noopener noreferrer' : null",
  },
})
export class BuiLink {
  /** Visual style of the link: default, muted, or subtle. */
  readonly variant = input<keyof typeof VARIANTS>('default');
  /** Whether the link is external, adding `target=_blank` and safe `rel`. */
  readonly external = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(BASE, VARIANTS[this.variant()], this.userClass()),
  );
}
