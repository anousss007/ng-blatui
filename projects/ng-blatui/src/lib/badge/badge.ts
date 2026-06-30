import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const BASE =
  'inline-flex items-center justify-center rounded-md border font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden';

const SIZES = {
  sm: 'px-1.5 py-px text-[0.625rem]',
  default: 'px-2 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm [&>svg]:size-3.5',
} as const;

const VARIANTS = {
  default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
  secondary: 'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
  destructive:
    'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
  outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
} as const;

const TONES = {
  primary: {
    soft: 'border-transparent bg-primary/10 text-primary dark:bg-primary/15',
    solid: 'border-transparent bg-primary text-primary-foreground',
    outline: 'text-primary border-primary/40',
  },
  success: {
    soft: 'border-transparent bg-success/10 text-success dark:bg-success/15',
    solid: 'border-transparent bg-success text-success-foreground',
    outline: 'text-success border-success/40',
  },
  warning: {
    soft: 'border-transparent bg-warning/10 text-warning dark:bg-warning/15',
    solid: 'border-transparent bg-warning text-warning-foreground',
    outline: 'text-warning border-warning/40',
  },
  danger: {
    soft: 'border-transparent bg-destructive/10 text-destructive dark:bg-destructive/15',
    solid: 'border-transparent bg-destructive text-destructive-foreground',
    outline: 'text-destructive border-destructive/40',
  },
  info: {
    soft: 'border-transparent bg-info/10 text-info dark:bg-info/15',
    solid: 'border-transparent bg-info text-info-foreground',
    outline: 'text-info border-info/40',
  },
  neutral: {
    soft: 'border-transparent bg-muted text-muted-foreground',
    solid: 'border-transparent bg-foreground/85 text-background',
    outline: 'text-muted-foreground border-border',
  },
} as const;

/** Badge size preset controlling padding and font size. */
export type BadgeSize = keyof typeof SIZES;
/** Badge brand style, or `soft`/`solid` intensity when a `tone` is set. */
export type BadgeVariant = keyof typeof VARIANTS | 'soft' | 'solid';
/** Semantic color tone for the badge. */
export type BadgeTone = keyof typeof TONES;
/** Fill intensity applied to a toned badge. */
export type BadgeIntensity = keyof (typeof TONES)['success'];

function brandClass(variant: BadgeVariant): string {
  switch (variant) {
    case 'secondary': {
      return VARIANTS.secondary;
    }
    case 'destructive': {
      return VARIANTS.destructive;
    }
    case 'outline': {
      return VARIANTS.outline;
    }
    default: {
      return VARIANTS.default;
    }
  }
}

function intensityFor(variant: BadgeVariant): BadgeIntensity {
  return variant === 'solid' || variant === 'outline' ? variant : 'soft';
}

/**
 * BlatUI badge. Brand variants (`default | secondary | destructive | outline`)
 * or semantic `tone` (`primary | success | warning | danger | info | neutral`) where
 * `variant` then selects intensity (`soft | solid | outline`). Built on a native
 * element so it stays in the document flow and screen-reader friendly.
 */
@Directive({
  selector: '[buiBadge]',
  host: {
    'data-slot': 'badge',
    '[class]': 'computedClass()',
  },
})
export class BuiBadge {
  /** Brand variant, or the intensity (`soft`/`solid`/`outline`) when a `tone` is set. */
  readonly variant = input<BadgeVariant>('default');
  /** Optional semantic tone; when set it overrides the brand variant's color. */
  readonly tone = input<BadgeTone | null>(null);
  /** Badge size preset. */
  readonly size = input<BadgeSize>('default');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() => {
    const tone = this.tone();
    const toneOrVariant =
      tone === null ? brandClass(this.variant()) : TONES[tone][intensityFor(this.variant())];
    return cn(BASE, SIZES[this.size()], toneOrVariant, this.userClass());
  });
}
