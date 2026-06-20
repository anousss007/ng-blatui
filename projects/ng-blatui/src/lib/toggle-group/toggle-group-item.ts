import { Component, computed, inject, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

import { BuiToggleGroup } from './toggle-group';

/** A single item within a `bui-toggle-group`. */
@Component({
  selector: 'button[buiToggleGroupItem]',
  host: {
    'data-slot': 'toggle-group-item',
    type: 'button',
    '[class]': 'computedClass()',
    '[attr.data-state]': "on() ? 'on' : 'off'",
    '[attr.aria-pressed]': 'on()',
    '[disabled]': 'disabled()',
    '(click)': 'group.toggle(value())',
  },
  template: `<ng-content />`,
})
export class BuiToggleGroupItem {
  readonly value = input('');
  readonly disabled = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly group = inject(BuiToggleGroup);
  protected readonly on = computed(() => this.group.isOn(this.value()));
  protected readonly computedClass = computed(() =>
    cn(
      'inline-flex h-9 min-w-9 items-center justify-center gap-2 border border-input px-2.5 text-sm font-medium transition-colors outline-none not-first:border-l-0 first:rounded-l-md last:rounded-r-md hover:bg-muted focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
      this.userClass(),
    ),
  );
}
