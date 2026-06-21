import { Component, computed, input, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export interface TreeTableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}
export interface TreeTableRow {
  children?: TreeTableRow[];
  expanded?: boolean;
  [key: string]: unknown;
}

interface FlatRow {
  path: string;
  depth: number;
  hasChildren: boolean;
  data: TreeTableRow;
}

const ALIGN: Record<string, string> = {
  left: 'text-start',
  center: 'text-center',
  right: 'text-end',
};

/** A table whose rows can nest and expand/collapse (flattened to visible rows). */
@Component({
  selector: 'bui-tree-table',
  host: { 'data-slot': 'tree-table', '[class]': 'computedClass()' },
  template: `
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b">
          @for (column of columns(); track column.key) {
            <th class="px-3 py-2 font-medium" [class]="alignClass(column.align)">
              {{ column.label }}
            </th>
          }
        </tr>
      </thead>
      <tbody>
        @for (row of visibleRows(); track row.path) {
          <tr class="border-b last:border-0">
            @for (column of columns(); track column.key; let first = $first) {
              <td class="px-3 py-2" [class]="alignClass(column.align)">
                @if (first) {
                  <span
                    class="inline-flex items-center gap-1"
                    [style.padding-inline-start.rem]="row.depth * 1.25"
                  >
                    @if (row.hasChildren) {
                      <button
                        type="button"
                        class="text-muted-foreground hover:text-foreground"
                        [attr.aria-expanded]="isOpen(row.path)"
                        aria-label="Toggle row"
                        (click)="toggle(row.path)"
                      >
                        <svg
                          class="size-4 transition-transform"
                          [class.rotate-90]="isOpen(row.path)"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          aria-hidden="true"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                    } @else {
                      <span class="size-4 shrink-0"></span>
                    }
                    <span>{{ cell(row.data, column.key) }}</span>
                  </span>
                } @else {
                  {{ cell(row.data, column.key) }}
                }
              </td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class BuiTreeTable {
  readonly columns = input<readonly TreeTableColumn[]>([]);
  readonly rows = input<readonly TreeTableRow[]>([]);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly overrides = signal<ReadonlyMap<string, boolean>>(new Map());
  private readonly defaults = computed(() => {
    const map = new Map<string, boolean>();
    const walk = (rows: readonly TreeTableRow[], prefix: string): void => {
      for (const [index, row] of rows.entries()) {
        const path = prefix === '' ? String(index) : `${prefix}.${index}`;
        map.set(path, row.expanded === true);
        if (row.children) {
          walk(row.children, path);
        }
      }
    };
    walk(this.rows(), '');
    return map;
  });
  protected readonly visibleRows = computed<FlatRow[]>(() => {
    const out: FlatRow[] = [];
    const walk = (rows: readonly TreeTableRow[], prefix: string, depth: number): void => {
      for (const [index, row] of rows.entries()) {
        const path = prefix === '' ? String(index) : `${prefix}.${index}`;
        const children = row.children ?? [];
        const hasChildren = children.length > 0;
        out.push({ path, depth, hasChildren, data: row });
        if (hasChildren && this.isOpen(path)) {
          walk(children, path, depth + 1);
        }
      }
    };
    walk(this.rows(), '', 0);
    return out;
  });
  protected readonly computedClass = computed(() => cn('block overflow-x-auto', this.userClass()));

  protected isOpen(path: string): boolean {
    return this.overrides().get(path) ?? this.defaults().get(path) ?? false;
  }

  toggle(path: string): void {
    const next = new Map(this.overrides());
    next.set(path, !this.isOpen(path));
    this.overrides.set(next);
  }

  protected alignClass(align: string | undefined): string {
    return ALIGN[align ?? 'left'];
  }

  protected cell(row: TreeTableRow, key: string): string {
    const value = row[key];
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    return '';
  }
}
