import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const ALERT_BASE =
  'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current';

const ALERT_VARIANTS = {
  default: 'bg-card text-card-foreground',
  destructive:
    'text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive',
} as const;

const ALERT_TONES = {
  success:
    'border-success/20 bg-success/10 text-success [&>svg]:text-success *:data-[slot=alert-description]:text-success',
  warning:
    'border-warning/20 bg-warning/10 text-warning [&>svg]:text-warning *:data-[slot=alert-description]:text-warning',
  danger:
    'border-destructive/20 bg-destructive/10 text-destructive [&>svg]:text-destructive *:data-[slot=alert-description]:text-destructive',
  info: 'border-info/20 bg-info/10 text-info [&>svg]:text-info *:data-[slot=alert-description]:text-info',
  neutral:
    'border-border bg-muted text-foreground [&>svg]:text-foreground *:data-[slot=alert-description]:text-muted-foreground',
} as const;

/** Brand style of the alert (`default` or `destructive`). */
export type AlertVariant = keyof typeof ALERT_VARIANTS;
/** Semantic tone of the alert (`success | warning | danger | info | neutral`). */
export type AlertTone = keyof typeof ALERT_TONES;

/**
 * BlatUI alert. `role="alert"` for assistive tech. Brand `variant`
 * (`default | destructive`) or semantic `tone` (`success | warning | danger | info | neutral`).
 */
@Directive({
  selector: '[buiAlert]',
  host: { 'data-slot': 'alert', role: 'alert', '[class]': 'computedClass()' },
})
export class BuiAlert {
  /** Brand style; ignored when `tone` is set. */
  readonly variant = input<AlertVariant>('default');
  /** Semantic tone; when set, overrides `variant`. */
  readonly tone = input<AlertTone | null>(null);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() => {
    const tone = this.tone();
    const toneOrVariant = tone === null ? ALERT_VARIANTS[this.variant()] : ALERT_TONES[tone];
    return cn(ALERT_BASE, toneOrVariant, this.userClass());
  });
}

@Directive({
  selector: '[buiAlertTitle]',
  host: { 'data-slot': 'alert-title', '[class]': 'computedClass()' },
})
export class BuiAlertTitle {
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', this.userClass()),
  );
}

@Directive({
  selector: '[buiAlertDescription]',
  host: { 'data-slot': 'alert-description', '[class]': 'computedClass()' },
})
export class BuiAlertDescription {
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(
      'col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed',
      this.userClass(),
    ),
  );
}
