import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const TYPOGRAPHY = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight text-balance',
  h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  p: 'leading-7 [&:not(:first-child)]:mt-6',
  lead: 'text-muted-foreground text-xl',
  large: 'text-lg font-semibold',
  small: 'text-sm leading-none font-medium',
  muted: 'text-muted-foreground text-sm',
  blockquote: 'mt-6 border-l-2 pl-6 italic',
  'inline-code':
    'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
  list: 'my-6 ml-6 list-disc [&>li]:mt-2',
  gradient:
    'bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent',
} as const;

/** Applies a typographic style. Put it on the matching element (e.g. `<h1 buiTypography variant="h1">`). */
@Directive({
  selector: '[buiTypography]',
  host: {
    'data-slot': 'typography',
    '[attr.data-variant]': 'variant()',
    '[class]': 'computedClass()',
  },
})
export class BuiTypography {
  readonly variant = input<keyof typeof TYPOGRAPHY>('p');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(TYPOGRAPHY[this.variant()], this.userClass()),
  );
}
