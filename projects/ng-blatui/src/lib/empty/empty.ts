import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** Empty-state container. */
@Directive({
  selector: '[buiEmpty]',
  host: { 'data-slot': 'empty', '[class]': 'computedClass()' },
})
export class BuiEmpty {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border border-dashed p-6 text-center text-balance md:p-12',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[buiEmptyHeader]',
  host: { 'data-slot': 'empty-header', '[class]': 'computedClass()' },
})
export class BuiEmptyHeader {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('flex max-w-sm flex-col items-center gap-2 text-center', this.userClass()),
  );
}

@Directive({
  selector: '[buiEmptyMedia]',
  host: {
    'data-slot': 'empty-media',
    '[attr.data-variant]': 'variant()',
    '[class]': 'computedClass()',
  },
})
export class BuiEmptyMedia {
  /** Media style; `icon` renders a muted rounded badge sized for an icon. */
  readonly variant = input<'default' | 'icon'>('default');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'mb-2 flex shrink-0 items-center justify-center',
      this.variant() === 'icon' &&
        "size-10 rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-6",
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[buiEmptyTitle]',
  host: { 'data-slot': 'empty-title', '[class]': 'computedClass()' },
})
export class BuiEmptyTitle {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('text-lg font-medium tracking-tight', this.userClass()),
  );
}

@Directive({
  selector: '[buiEmptyDescription]',
  host: { 'data-slot': 'empty-description', '[class]': 'computedClass()' },
})
export class BuiEmptyDescription {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[buiEmptyContent]',
  host: { 'data-slot': 'empty-content', '[class]': 'computedClass()' },
})
export class BuiEmptyContent {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance',
      this.userClass(),
    ),
  );
}
