import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

import { BuiJsonViewerNode } from './json-viewer-node';

/** A collapsible JSON tree viewer. Accepts an object/array or a JSON string. */
@Component({
  selector: 'bui-json-viewer',
  imports: [BuiJsonViewerNode],
  host: { 'data-slot': 'json-viewer', '[class]': 'computedClass()' },
  template: `<bui-json-viewer-node [value]="parsed()" [expanded]="expanded()" />`,
})
export class BuiJsonViewer {
  /** Arbitrary JSON value to render; a string is parsed as JSON when possible. */
  readonly data = input<unknown>(null);
  /** Whether nodes start expanded. */
  readonly expanded = input(true);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly parsed = computed(() => {
    const data = this.data();
    if (typeof data === 'string') {
      try {
        return JSON.parse(data) as unknown;
      } catch {
        return data;
      }
    }
    return data;
  });
  protected readonly computedClass = computed(() =>
    cn('block overflow-auto rounded-lg border bg-card p-3 font-mono text-xs', this.userClass()),
  );
}
