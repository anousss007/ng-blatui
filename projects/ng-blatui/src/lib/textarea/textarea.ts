import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const TEXTAREA_BASE =
  'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content w-full rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50';

const TEXTAREA_SIZES = {
  sm: 'min-h-14 px-2.5 py-1.5 text-sm',
  default: 'min-h-16 px-3 py-2 text-base md:text-sm',
  lg: 'min-h-20 px-4 py-2.5 text-base',
} as const;

/** Size preset controlling minimum height, padding and text size. */
export type TextareaSize = keyof typeof TEXTAREA_SIZES;

/** Applies BlatUI textarea styling to a native `<textarea>` (auto-grows via field-sizing). */
@Directive({
  selector: 'textarea[buiTextarea]',
  host: {
    'data-slot': 'textarea',
    '[attr.data-size]': 'size()',
    '[class]': 'computedClass()',
  },
})
export class BuiTextarea {
  /** Size preset controlling minimum height, padding and text size. */
  readonly size = input<TextareaSize>('default');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(TEXTAREA_BASE, TEXTAREA_SIZES[this.size()], this.userClass()),
  );
}
