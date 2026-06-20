import { computed, Directive, input } from '@angular/core';

import { buttonVariants } from '../button/button';
import { type ClassValue, cn } from '../utils/cn';

/**
 * Confirm dialog styling (`role="alertdialog"`). Open it with the CDK `Dialog` service
 * (re-exported from `ng-blatui`) on a template whose root carries `buiAlertDialogContent`.
 */
@Directive({
  selector: '[buiAlertDialogContent]',
  host: { 'data-slot': 'alert-dialog-content', role: 'alertdialog', '[class]': 'computedClass()' },
})
export class BuiAlertDialogContent {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'relative grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border bg-background p-6 shadow-lg sm:max-w-lg',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[buiAlertDialogHeader]',
  host: { 'data-slot': 'alert-dialog-header', '[class]': 'computedClass()' },
})
export class BuiAlertDialogHeader {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('flex flex-col gap-2 text-center sm:text-left', this.userClass()),
  );
}

@Directive({
  selector: '[buiAlertDialogTitle]',
  host: { 'data-slot': 'alert-dialog-title', '[class]': 'computedClass()' },
})
export class BuiAlertDialogTitle {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn('text-lg font-semibold', this.userClass()));
}

@Directive({
  selector: '[buiAlertDialogDescription]',
  host: { 'data-slot': 'alert-dialog-description', '[class]': 'computedClass()' },
})
export class BuiAlertDialogDescription {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('text-sm text-muted-foreground', this.userClass()),
  );
}

@Directive({
  selector: '[buiAlertDialogFooter]',
  host: { 'data-slot': 'alert-dialog-footer', '[class]': 'computedClass()' },
})
export class BuiAlertDialogFooter {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', this.userClass()),
  );
}

/** Primary confirm action button. */
@Directive({
  selector: 'button[buiAlertDialogAction]',
  host: { type: 'button', 'data-slot': 'alert-dialog-action', '[class]': 'computedClass()' },
})
export class BuiAlertDialogAction {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn(buttonVariants(), this.userClass()));
}

/** Cancel (dismiss) button. */
@Directive({
  selector: 'button[buiAlertDialogCancel]',
  host: { type: 'button', 'data-slot': 'alert-dialog-cancel', '[class]': 'computedClass()' },
})
export class BuiAlertDialogCancel {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(buttonVariants({ variant: 'outline' }), this.userClass()),
  );
}
