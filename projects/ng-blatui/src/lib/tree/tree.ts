import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

import { BuiTreeNode } from './tree-node';

export interface TreeItem {
  label: string;
  children?: TreeItem[];
  expanded?: boolean;
}

/** A collapsible, data-driven hierarchical tree (`role="tree"`). */
@Component({
  selector: 'bui-tree',
  imports: [BuiTreeNode],
  host: { 'data-slot': 'tree', '[class]': 'computedClass()' },
  template: `
    <ul role="tree" [attr.aria-label]="ariaLabel()" class="text-sm">
      @for (item of items(); track $index) {
        <bui-tree-node [item]="item" [level]="1" />
      }
    </ul>
  `,
})
export class BuiTree {
  readonly items = input<readonly TreeItem[]>([]);
  readonly ariaLabel = input('Tree');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn('block', this.userClass()));
}
