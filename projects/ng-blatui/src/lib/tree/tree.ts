import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

import { BuiTreeNode } from './tree-node';

export interface TreeItem {
  /** Text displayed for the node. */
  label: string;
  /** Nested child nodes, if any. */
  children?: TreeItem[];
  /** Whether the node starts expanded. */
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
  /** Root nodes of the tree to render. */
  readonly items = input<readonly TreeItem[]>([]);
  /** Accessible label for the tree's root element. */
  readonly ariaLabel = input('Tree');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn('block', this.userClass()));
}
