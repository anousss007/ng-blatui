import { Component, computed, input, ViewEncapsulation } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

import { BuiOrgChartNode } from './org-chart-node';

export interface OrgNode {
  name: string;
  title?: string;
  avatar?: string;
  children?: OrgNode[];
}

/** A top-down organizational chart with pure-CSS connectors. Recursively renders nodes. */
@Component({
  selector: 'bui-org-chart',
  imports: [BuiOrgChartNode],
  encapsulation: ViewEncapsulation.None,
  host: { 'data-slot': 'org-chart', '[class]': 'computedClass()' },
  styles: [
    `
      [data-slot='org-chart'] ul {
        display: flex;
        justify-content: center;
        gap: 1rem;
        padding-top: 1.25rem;
        list-style: none;
        margin: 0;
        padding-inline-start: 0;
      }
      [data-slot='org-chart'] li {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.25rem 0.5rem 0;
      }
      [data-slot='org-chart'] li::before,
      [data-slot='org-chart'] li::after {
        content: '';
        position: absolute;
        top: 0;
        width: 50%;
        height: 1.25rem;
        border-top: 1px solid var(--border);
      }
      [data-slot='org-chart'] li::before {
        inset-inline-end: 50%;
      }
      [data-slot='org-chart'] li::after {
        inset-inline-start: 50%;
        border-inline-start: 1px solid var(--border);
      }
      [data-slot='org-chart'] li:only-child {
        padding-top: 0.5rem;
      }
      [data-slot='org-chart'] li:only-child::before,
      [data-slot='org-chart'] li:only-child::after {
        display: none;
      }
      [data-slot='org-chart'] li:first-child::before,
      [data-slot='org-chart'] li:last-child::after {
        border: 0;
      }
      [data-slot='org-chart'] li:last-child::before {
        border-inline-end: 1px solid var(--border);
      }
      [data-slot='org-chart'] ul ul::before {
        content: '';
        position: absolute;
        top: 0;
        inset-inline-start: 50%;
        height: 1.25rem;
        border-inline-start: 1px solid var(--border);
      }
      [data-slot='org-chart'] > ul {
        padding-top: 0;
      }
      [data-slot='org-chart'] > ul > li {
        padding-top: 0;
      }
      [data-slot='org-chart'] > ul > li::before,
      [data-slot='org-chart'] > ul > li::after {
        display: none;
      }
    `,
  ],
  template: `
    <ul>
      @if (node()) {
        <li buiOrgChartNode [node]="node()!"></li>
      }
    </ul>
  `,
})
export class BuiOrgChart {
  readonly node = input<OrgNode | null>(null);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn('block overflow-x-auto', this.userClass()));
}
