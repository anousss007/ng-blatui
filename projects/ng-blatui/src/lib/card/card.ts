import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const CARD_VARIANTS = {
  // Simple padded box — the dominant use case.
  default: 'bg-card text-card-foreground rounded-xl border p-6 shadow-sm',
  // Sectioned layout for card-header / card-content / card-footer (each supplies its own px-6).
  sectioned: 'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
} as const;

export type CardVariant = keyof typeof CARD_VARIANTS;

/** BlatUI card container. Use `variant="sectioned"` with the header/content/footer parts. */
@Directive({
  selector: '[buiCard]',
  host: { 'data-slot': 'card', '[class]': 'computedClass()' },
})
export class BuiCard {
  readonly variant = input<CardVariant>('default');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(CARD_VARIANTS[this.variant()], this.userClass()),
  );
}

@Directive({
  selector: '[buiCardHeader]',
  host: { 'data-slot': 'card-header', '[class]': 'computedClass()' },
})
export class BuiCardHeader {
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(
      '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[buiCardTitle]',
  host: { 'data-slot': 'card-title', '[class]': 'computedClass()' },
})
export class BuiCardTitle {
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn('leading-none font-semibold', this.userClass()),
  );
}

@Directive({
  selector: '[buiCardDescription]',
  host: { 'data-slot': 'card-description', '[class]': 'computedClass()' },
})
export class BuiCardDescription {
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn('text-sm text-muted-foreground', this.userClass()),
  );
}

@Directive({
  selector: '[buiCardAction]',
  host: { 'data-slot': 'card-action', '[class]': 'computedClass()' },
})
export class BuiCardAction {
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', this.userClass()),
  );
}

@Directive({
  selector: '[buiCardContent]',
  host: { 'data-slot': 'card-content', '[class]': 'computedClass()' },
})
export class BuiCardContent {
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() => cn('px-6', this.userClass()));
}

@Directive({
  selector: '[buiCardFooter]',
  host: { 'data-slot': 'card-footer', '[class]': 'computedClass()' },
})
export class BuiCardFooter {
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn('flex items-center px-6 [.border-t]:pt-6', this.userClass()),
  );
}
