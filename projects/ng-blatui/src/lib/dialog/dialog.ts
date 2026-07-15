import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/**
 * Overlay, backdrop, focus-trap, scroll-block, Escape-to-close, `role="dialog"`
 * and `aria-modal` all come from Angular CDK's `Dialog` service (re-exported below).
 * Open a `TemplateRef`/component whose root carries `buiDialogContent`:
 *
 * ```ts
 * private dialog = inject(Dialog);
 * open(tpl: TemplateRef<unknown>) { this.dialog.open(tpl); }
 * ```
 */
export { Dialog, DialogRef, DialogModule, DIALOG_DATA } from '@angular/cdk/dialog';

// The pane the CDK creates around the content is auto-sized to its child, so a `w-full`
// (width:100%) would resolve against that intrinsic width and collapse. Size the content in
// viewport units instead so it fills small screens (minus a gutter) and caps on larger ones.
// `max-h`/`overflow-y-auto` keep tall forms scrollable inside the modal instead of running off
// screen while the CDK blocks the background scroll.
const DIALOG_CONTENT =
  'bg-background relative grid max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] gap-4 overflow-y-auto rounded-lg border p-6 shadow-lg';

/** Caps the dialog width from the `sm` breakpoint up. On smaller screens the dialog always
 *  spans `calc(100vw - 2rem)` so it never collapses to its intrinsic width. */
const DIALOG_SIZE = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  full: 'sm:max-w-[calc(100vw-4rem)]',
} as const;

/** Dialog width preset. Controls the max width from the `sm` breakpoint up. */
export type DialogSize = keyof typeof DIALOG_SIZE;

@Directive({
  selector: '[buiDialogContent]',
  host: { 'data-slot': 'dialog-content', '[class]': 'computedClass()' },
})
export class BuiDialogContent {
  /** Width preset: `sm` | `md` | `lg` | `xl` | `2xl` | `full`. Defaults to `lg`. */
  readonly size = input<DialogSize>('lg');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(DIALOG_CONTENT, DIALOG_SIZE[this.size()], this.userClass()),
  );
}

@Directive({
  selector: '[buiDialogHeader]',
  host: { 'data-slot': 'dialog-header', '[class]': 'computedClass()' },
})
export class BuiDialogHeader {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('flex flex-col gap-2 text-center sm:text-left', this.userClass()),
  );
}

@Directive({
  selector: '[buiDialogTitle]',
  host: { 'data-slot': 'dialog-title', '[class]': 'computedClass()' },
})
export class BuiDialogTitle {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('text-lg leading-none font-semibold', this.userClass()),
  );
}

@Directive({
  selector: '[buiDialogDescription]',
  host: { 'data-slot': 'dialog-description', '[class]': 'computedClass()' },
})
export class BuiDialogDescription {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('text-sm text-muted-foreground', this.userClass()),
  );
}

@Directive({
  selector: '[buiDialogFooter]',
  host: { 'data-slot': 'dialog-footer', '[class]': 'computedClass()' },
})
export class BuiDialogFooter {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', this.userClass()),
  );
}
