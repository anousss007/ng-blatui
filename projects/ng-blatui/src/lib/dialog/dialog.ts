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

const DIALOG_CONTENT =
  'bg-background relative grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg';

@Directive({
  selector: '[buiDialogContent]',
  host: { 'data-slot': 'dialog-content', '[class]': 'computedClass()' },
})
export class BuiDialogContent {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn(DIALOG_CONTENT, this.userClass()));
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
