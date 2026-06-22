import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A bordered group that composes inputs with addons (icons, text, buttons). */
@Directive({
  selector: '[buiInputGroup]',
  host: { 'data-slot': 'input-group', role: 'group', '[class]': 'computedClass()' },
})
export class BuiInputGroup {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'group/input-group relative flex h-9 w-full min-w-0 items-center rounded-md border border-input shadow-xs transition-[color,box-shadow] outline-none has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[>textarea]:h-auto dark:bg-input/30',
      this.userClass(),
    ),
  );
}

const ADDON_ALIGN = {
  'inline-start': 'order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]',
  'inline-end': 'order-last pr-3 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]',
  'block-start': 'order-first w-full justify-start px-3 pt-3',
  'block-end': 'order-last w-full justify-start px-3 pb-3',
} as const;

@Directive({
  selector: '[buiInputGroupAddon]',
  host: {
    'data-slot': 'input-group-addon',
    '[attr.data-align]': 'align()',
    '[class]': 'computedClass()',
  },
})
export class BuiInputGroupAddon {
  /** Where the addon sits relative to the input (inline or block, start or end). */
  readonly align = input<keyof typeof ADDON_ALIGN>('inline-start');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
      ADDON_ALIGN[this.align()],
      this.userClass(),
    ),
  );
}

@Directive({
  selector: 'input[buiInputGroupInput], textarea[buiInputGroupInput]',
  host: { 'data-slot': 'input-group-control', '[class]': 'computedClass()' },
})
export class BuiInputGroupInput {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'w-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-3 py-1 text-base shadow-none outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[buiInputGroupText]',
  host: { 'data-slot': 'input-group-text', '[class]': 'computedClass()' },
})
export class BuiInputGroupText {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      "flex items-center gap-2 text-sm text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
      this.userClass(),
    ),
  );
}

const IG_BUTTON_BASE =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";
const IG_BUTTON_VARIANTS = {
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  outline: 'bg-background hover:bg-accent hover:text-accent-foreground border shadow-xs',
  default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs',
} as const;
const IG_BUTTON_SIZES = {
  xs: 'h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 text-xs',
  sm: 'h-8 gap-1.5 px-2.5',
  'icon-xs': 'size-6 rounded-[calc(var(--radius)-5px)] p-0',
  'icon-sm': 'size-8 p-0',
} as const;

@Directive({
  selector: 'button[buiInputGroupButton]',
  host: { type: 'button', 'data-slot': 'input-group-button', '[class]': 'computedClass()' },
})
export class BuiInputGroupButton {
  /** Visual style of the addon button. */
  readonly variant = input<keyof typeof IG_BUTTON_VARIANTS>('ghost');
  /** Size preset for the addon button (text or icon variants). */
  readonly size = input<keyof typeof IG_BUTTON_SIZES>('xs');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      IG_BUTTON_BASE,
      IG_BUTTON_VARIANTS[this.variant()],
      IG_BUTTON_SIZES[this.size()],
      this.userClass(),
    ),
  );
}
