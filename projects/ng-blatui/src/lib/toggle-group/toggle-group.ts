import { Component, computed, input, model } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

type ToggleValue = string | string[] | null;

/** A group of toggle buttons (single or multiple selection). Use `button[buiToggleGroupItem]`. */
@Component({
  selector: 'bui-toggle-group',
  host: {
    'data-slot': 'toggle-group',
    role: 'group',
    '[class]': 'computedClass()',
    '[attr.data-orientation]': 'orientation()',
  },
  template: `<ng-content />`,
})
export class BuiToggleGroup {
  readonly type = input<'single' | 'multiple'>('single');
  readonly value = model<ToggleValue>(null);
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'inline-flex w-fit',
      this.orientation() === 'vertical' ? 'flex-col' : 'flex-row',
      this.userClass(),
    ),
  );

  isOn(value: string): boolean {
    const current = this.value();
    return this.type() === 'multiple'
      ? Array.isArray(current) && current.includes(value)
      : current === value;
  }

  toggle(value: string): void {
    if (this.type() === 'multiple') {
      const current = Array.isArray(this.value()) ? [...(this.value() as string[])] : [];
      const index = current.indexOf(value);
      if (index === -1) {
        current.push(value);
      } else {
        current.splice(index, 1);
      }
      this.value.set(current);
      return;
    }
    this.value.set(this.value() === value ? null : value);
  }
}
