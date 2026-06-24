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

// Vertical padding (top + bottom) baked into each size preset, used to compute the `maxRows`
// height cap. Mirrors the `py-*` utilities in TEXTAREA_SIZES.
const TEXTAREA_PADDING_Y: Record<TextareaSize, string> = {
  sm: '0.75rem',
  default: '1rem',
  lg: '1.25rem',
} as const;

/**
 * Applies BlatUI textarea styling to a native `<textarea>`. Auto-grows with its content via CSS
 * `field-sizing-content` (no JS). Set `[maxRows]` to cap the growth — past it the field scrolls.
 */
@Directive({
  selector: 'textarea[buiTextarea]',
  host: {
    'data-slot': 'textarea',
    '[attr.data-size]': 'size()',
    '[class]': 'computedClass()',
    '[style.max-height]': 'maxHeight()',
    '[style.overflow-y]': "maxRows() === null ? null : 'auto'",
  },
})
export class BuiTextarea {
  /** Size preset controlling minimum height, padding and text size. */
  readonly size = input<TextareaSize>('default');
  /** Maximum number of rows before the textarea scrolls instead of growing (null = unlimited). */
  readonly maxRows = input<number | null>(null);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(TEXTAREA_BASE, TEXTAREA_SIZES[this.size()], this.userClass()),
  );

  // Cap the auto-grow at `maxRows` lines using the `lh` unit (one line-height) plus the size's
  // vertical padding and the 1px borders — purely declarative, so it stays SSR-safe.
  protected readonly maxHeight = computed(() => {
    const rows = this.maxRows();
    return rows === null ? null : `calc(${rows} * 1lh + ${TEXTAREA_PADDING_Y[this.size()]} + 2px)`;
  });
}
