import { Component, computed, input, linkedSignal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

import type { TreeItem } from './tree';

/** A single tree row; renders its own children recursively. */
@Component({
  selector: 'bui-tree-node',

  imports: [BuiTreeNode],
  host: { 'data-slot': 'tree-node', '[class]': 'computedClass()' },
  template: `
    <li
      role="treeitem"
      aria-selected="false"
      [attr.aria-expanded]="hasChildren() ? open() : null"
      [attr.aria-level]="level()"
    >
      <button
        type="button"
        class="flex w-full items-center gap-1.5 rounded px-2 py-1 text-start outline-none hover:bg-accent"
        [style.padding-inline-start.rem]="level() * 0.75"
        (click)="toggle()"
      >
        @if (hasChildren()) {
          <svg
            class="size-4 shrink-0 transition-transform"
            [class.rotate-90]="open()"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        } @else {
          <span class="size-4 shrink-0"></span>
        }
        <span class="truncate">{{ item().label }}</span>
      </button>
      @if (hasChildren() && open()) {
        <ul role="group">
          @for (child of children(); track $index) {
            <bui-tree-node [item]="child" [level]="level() + 1" />
          }
        </ul>
      }
    </li>
  `,
})
export class BuiTreeNode {
  readonly item = input.required<TreeItem>();
  readonly level = input(1);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly open = linkedSignal(() => this.item().expanded ?? false);
  protected readonly children = computed(() => this.item().children ?? []);
  protected readonly hasChildren = computed(() => this.children().length > 0);
  protected readonly computedClass = computed(() => cn('block', this.userClass()));

  protected toggle(): void {
    this.open.update((value) => !value);
  }
}
