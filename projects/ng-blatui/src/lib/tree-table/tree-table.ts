import { Component, computed, input, type OnDestroy, signal } from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { type ClassValue, cn } from '../utils/cn';

export interface TreeTableColumn {
  /** Row data key whose value fills this column's cells. */
  key: string;
  /** Column header text. */
  label: string;
  /** Horizontal text alignment for the column's cells. */
  align?: 'left' | 'center' | 'right';
}
export interface TreeTableRow {
  /** Nested child rows shown when this row is expanded. */
  children?: TreeTableRow[];
  /** Whether the row starts expanded. */
  expanded?: boolean;
  /** Arbitrary column values keyed by `TreeTableColumn.key`. */
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
    @if (copyable()) {
      <div class="mb-2 flex justify-end">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-md border border-input px-2.5 py-1 text-xs font-medium hover:bg-accent"
          (click)="copyTree()"
        >
          @if (copied()) {
            <svg
              class="size-3.5 text-emerald-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {{ copiedText() }}
          } @else {
            <svg
              class="size-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
            {{ copyText() }}
          }
        </button>
      </div>
    }
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
                        [attr.aria-label]="toggleText()"
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
export class BuiTreeTable implements OnDestroy {
  /** Column definitions in display order. */
  readonly columns = input<readonly TreeTableColumn[]>([]);
  /** Top-level rows, each able to nest children via `children`. */
  readonly rows = input<readonly TreeTableRow[]>([]);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  /** Accessible label for the expand/collapse toggle button. */
  readonly toggleLabel = input<string>();
  /** Show a button that copies the full hierarchy as a markdown ASCII tree. */
  readonly copyable = input(false);
  /** Label override for the copy button (idle state). */
  readonly copyLabel = input<string>();
  /** Label override for the copy button after copying. */
  readonly copiedLabel = input<string>();

  protected readonly toggleText = buiLabel('treeTableToggle', this.toggleLabel);
  protected readonly copyText = buiLabel('treeTableCopy', this.copyLabel);
  protected readonly copiedText = buiLabel('treeTableCopied', this.copiedLabel);
  protected readonly copied = signal(false);
  private copiedTimer: ReturnType<typeof setTimeout> | undefined;

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

  /**
   * Render the full row hierarchy as a markdown ASCII tree (`├──`/`└──`), using the first
   * column's value as each node's label and a trailing `/` for rows that have children.
   */
  toMarkdownTree(): string {
    const key = this.columns()[0]?.key ?? '';
    const lines: string[] = [];
    const render = (rows: readonly TreeTableRow[], prefix: string, isRoot: boolean): void => {
      for (const [index, row] of rows.entries()) {
        const children = row.children ?? [];
        const hasChildren = children.length > 0;
        const label = this.cell(row, key) + (hasChildren ? '/' : '');
        if (isRoot) {
          lines.push(label);
          if (hasChildren) {
            render(children, '', false);
          }
          continue;
        }
        const isLast = index === rows.length - 1;
        lines.push(`${prefix}${isLast ? '└── ' : '├── '}${label}`);
        if (hasChildren) {
          const childIndent = isLast ? ' '.repeat(4) : `│${' '.repeat(3)}`;
          render(children, prefix + childIndent, false);
        }
      }
    };
    render(this.rows(), '', true);
    return lines.join('\n');
  }

  protected copyTree(): void {
    void navigator.clipboard.writeText(this.toMarkdownTree());
    this.copied.set(true);
    clearTimeout(this.copiedTimer);
    this.copiedTimer = setTimeout(() => {
      this.copied.set(false);
    }, 1500);
  }

  ngOnDestroy(): void {
    clearTimeout(this.copiedTimer);
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
