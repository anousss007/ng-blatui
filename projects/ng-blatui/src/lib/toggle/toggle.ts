import { Component, computed, input, model } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

import { type ClassValue, cn } from '../utils/cn';

export const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none hover:bg-muted hover:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline:
          'border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-9 min-w-9 px-2',
        sm: 'h-8 min-w-8 px-1.5',
        lg: 'h-10 min-w-10 px-2.5',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);
type ToggleVariants = VariantProps<typeof toggleVariants>;

/** A two-state toggle button (`aria-pressed`). */
@Component({
  selector: 'button[buiToggle]',
  host: {
    type: 'button',
    'data-slot': 'toggle',
    '[attr.aria-pressed]': 'pressed()',
    '[attr.data-state]': "pressed() ? 'on' : 'off'",
    '[class]': 'computedClass()',
    '(click)': 'toggle()',
  },
  template: `<ng-content />`,
})
export class BuiToggle {
  readonly pressed = model(false);
  readonly variant = input<ToggleVariants['variant']>('default');
  readonly size = input<ToggleVariants['size']>('default');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(toggleVariants({ variant: this.variant(), size: this.size() }), this.userClass()),
  );

  protected toggle(): void {
    this.pressed.update((value) => !value);
  }
}
