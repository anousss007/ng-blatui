import { afterNextRender, computed, Directive, ElementRef, inject, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const BASE =
  'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 flex w-full resize-none overflow-hidden rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50';
const SIZES = {
  sm: 'min-h-14 px-2.5 py-1.5 text-sm',
  default: 'min-h-16 px-3 py-2 text-base md:text-sm',
  lg: 'min-h-20 px-4 py-2.5 text-base',
} as const;

/**
 * A textarea that grows with its content. SSR-safe — the height is measured only in the
 * browser (via `afterNextRender` and the `input` event).
 */
@Directive({
  selector: 'textarea[buiAutosizeTextarea]',
  host: {
    'data-slot': 'autosize-textarea',
    '[attr.data-size]': 'size()',
    '[class]': 'computedClass()',
    '(input)': 'resize()',
  },
})
export class BuiAutosizeTextarea {
  /** Size preset controlling minimum height, padding and text size. */
  readonly size = input<keyof typeof SIZES>('default');
  /** Maximum number of rows before the textarea scrolls instead of growing (null = unlimited). */
  readonly maxRows = input<number | null>(null);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly host = inject<ElementRef<HTMLTextAreaElement>>(ElementRef);
  protected readonly computedClass = computed(() => cn(BASE, SIZES[this.size()], this.userClass()));

  constructor() {
    afterNextRender(() => {
      this.resize();
    });
  }

  protected resize(): void {
    const element = this.host.nativeElement;
    element.style.height = 'auto';
    let target = element.scrollHeight;
    const maxRows = this.maxRows();
    if (maxRows !== null) {
      const styles = getComputedStyle(element);
      let lineHeight = Number.parseFloat(styles.lineHeight);
      if (Number.isNaN(lineHeight)) {
        lineHeight = Number.parseFloat(styles.fontSize) * 1.2;
      }
      const padding =
        Number.parseFloat(styles.paddingTop) + Number.parseFloat(styles.paddingBottom);
      const border =
        Number.parseFloat(styles.borderTopWidth) + Number.parseFloat(styles.borderBottomWidth);
      const cap = lineHeight * maxRows + padding + border;
      if (target > cap) {
        target = cap;
        element.style.overflowY = 'auto';
      } else {
        element.style.overflowY = 'hidden';
      }
    }
    element.style.height = `${target}px`;
  }
}
