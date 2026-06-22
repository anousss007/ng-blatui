import { Component, computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const FIELD_ORIENT = {
  vertical: 'flex-col [&>*]:w-full [&>.sr-only]:w-auto',
  horizontal: 'flex-row items-center [&>[data-slot=field-label]]:flex-auto',
  responsive:
    'flex-col [&>*]:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto',
} as const;

/** A form field row grouping a label, control, description and error. */
@Directive({
  selector: '[buiField]',
  host: {
    role: 'group',
    'data-slot': 'field',
    '[attr.data-orientation]': 'orientation()',
    '[class]': 'computedClass()',
  },
})
export class BuiField {
  /** How the label and control are arranged within the field. */
  readonly orientation = input<keyof typeof FIELD_ORIENT>('vertical');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'group/field flex w-full gap-2 data-[invalid=true]:text-destructive',
      FIELD_ORIENT[this.orientation()],
      this.userClass(),
    ),
  );
}

@Directive({
  selector: 'fieldset[buiFieldSet]',
  host: { 'data-slot': 'field-set', '[class]': 'computedClass()' },
})
export class BuiFieldSet {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('flex flex-col gap-6 has-[>[data-slot=radio-group]]:gap-3', this.userClass()),
  );
}

@Directive({
  selector: 'legend[buiFieldLegend]',
  host: {
    'data-slot': 'field-legend',
    '[attr.data-variant]': 'variant()',
    '[class]': 'computedClass()',
  },
})
export class BuiFieldLegend {
  /** Whether the legend is styled as a section legend or a smaller label. */
  readonly variant = input<'legend' | 'label'>('legend');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'mb-3 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[buiFieldGroup]',
  host: { 'data-slot': 'field-group', '[class]': 'computedClass()' },
})
export class BuiFieldGroup {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('group/field-group @container/field-group flex w-full flex-col gap-7', this.userClass()),
  );
}

@Directive({
  selector: 'label[buiFieldLabel]',
  host: { 'data-slot': 'field-label', '[attr.for]': 'forId()', '[class]': 'computedClass()' },
})
export class BuiFieldLabel {
  /** Id of the control this label is associated with (maps to the `for` attribute). */
  readonly forId = input<string | undefined>(undefined, { alias: 'for' });
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'flex w-fit gap-2 text-sm leading-snug font-medium select-none group-data-[disabled=true]/field:opacity-50',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[buiFieldTitle]',
  host: { 'data-slot': 'field-title', '[class]': 'computedClass()' },
})
export class BuiFieldTitle {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('flex w-fit items-center gap-2 text-sm leading-snug font-medium', this.userClass()),
  );
}

@Directive({
  selector: 'p[buiFieldDescription]',
  host: { 'data-slot': 'field-description', '[class]': 'computedClass()' },
})
export class BuiFieldDescription {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('text-sm leading-normal font-normal text-muted-foreground', this.userClass()),
  );
}

@Directive({
  selector: '[buiFieldContent]',
  host: { 'data-slot': 'field-content', '[class]': 'computedClass()' },
})
export class BuiFieldContent {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('group/field-content flex flex-1 flex-col gap-1.5 leading-snug', this.userClass()),
  );
}

/** Field validation message (`role="alert"`). */
@Directive({
  selector: '[buiFieldError]',
  host: { role: 'alert', 'data-slot': 'field-error', '[class]': 'computedClass()' },
})
export class BuiFieldError {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('text-sm font-normal text-destructive', this.userClass()),
  );
}

/** Labelled divider between fields. */
@Component({
  selector: 'bui-field-separator',
  host: { 'data-slot': 'field-separator', '[class]': 'computedClass()' },
  template: `
    <div class="absolute inset-0 top-1/2 h-px bg-border"></div>
    <span class="relative mx-auto block w-fit bg-background px-2 text-muted-foreground">
      <ng-content />
    </span>
  `,
})
export class BuiFieldSeparator {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('relative -my-2 block h-5 text-sm', this.userClass()),
  );
}
