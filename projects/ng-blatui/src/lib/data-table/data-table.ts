import { Component, computed, input, signal } from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { type ClassValue, cn } from '../utils/cn';

export interface DataTableColumn {
  /** Row property key whose value is rendered and used for sorting/searching. */
  key: string;
  /** Column header text shown in the table head. */
  label: string;
  /** Whether the header is a sort toggle; `false` disables sorting for this column. */
  sortable?: boolean;
  /** Horizontal text alignment for the column's header and cells. */
  align?: 'left' | 'center' | 'right';
}
type DataRow = Record<string, unknown>;

const ALIGN: Record<string, string> = {
  left: 'text-start',
  center: 'text-center',
  right: 'text-end',
};

function cellText(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return '';
}

/** A data table with search, sortable columns, row selection and pagination. */
@Component({
  selector: 'bui-data-table',
  host: { 'data-slot': 'data-table', '[class]': 'computedClass()' },
  template: `
    @if (searchable()) {
      <input
        type="search"
        [value]="query()"
        [placeholder]="searchPlaceholder()"
        class="mb-3 h-9 w-full max-w-xs rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        [attr.aria-label]="searchText()"
        (input)="onSearch($event)"
      />
    }
    <div class="overflow-x-auto rounded-lg border">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b">
            @if (selectable()) {
              <th class="w-10 p-3">
                <input
                  type="checkbox"
                  [checked]="allSelected()"
                  [indeterminate]="someSelected()"
                  [attr.aria-label]="selectAllText()"
                  (change)="toggleAll($event)"
                />
              </th>
            }
            @for (column of columns(); track column.key) {
              <th class="p-3 font-medium" [class]="alignClass(column.align)">
                @if (column.sortable !== false) {
                  <button
                    type="button"
                    class="inline-flex items-center gap-1"
                    (click)="sortBy(column.key)"
                  >
                    {{ column.label }}
                    <span class="text-xs text-muted-foreground">{{
                      sortIndicator(column.key)
                    }}</span>
                  </button>
                } @else {
                  {{ column.label }}
                }
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of pageRows(); track $index) {
            <tr class="border-b last:border-0" [class]="isSelected(row) ? 'bg-muted/30' : ''">
              @if (selectable()) {
                <td class="p-3">
                  <input
                    type="checkbox"
                    [checked]="isSelected(row)"
                    [attr.aria-label]="selectRowText()"
                    (change)="toggleRow(row)"
                  />
                </td>
              }
              @for (column of columns(); track column.key) {
                <td class="p-3" [class]="alignClass(column.align)">{{ cell(row, column.key) }}</td>
              }
            </tr>
          } @empty {
            <tr>
              <td [attr.colspan]="colspan()" class="p-6 text-center text-muted-foreground">
                No results.
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
    <div class="mt-3 flex items-center justify-between text-sm">
      <span class="text-muted-foreground">
        {{ filtered().length }} row(s){{
          selectable() && selectedCount() > 0 ? ', ' + selectedCount() + ' selected' : ''
        }}
      </span>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex h-8 items-center rounded-md border border-input px-3 hover:bg-accent disabled:opacity-50"
          [disabled]="page() === 0"
          (click)="page.set(page() - 1)"
        >
          Previous
        </button>
        <span class="text-muted-foreground">Page {{ page() + 1 }} of {{ pageCount() }}</span>
        <button
          type="button"
          class="inline-flex h-8 items-center rounded-md border border-input px-3 hover:bg-accent disabled:opacity-50"
          [disabled]="page() >= pageCount() - 1"
          (click)="page.set(page() + 1)"
        >
          Next
        </button>
      </div>
    </div>
  `,
})
export class BuiDataTable {
  /** Column definitions that drive the headers, cell lookup and sort/search keys. */
  readonly columns = input<readonly DataTableColumn[]>([]);
  /** Source data rows; each is a key/value map indexed by column keys. */
  readonly rows = input<readonly DataRow[]>([]);
  /** Whether to show the search box that filters rows across all columns. */
  readonly searchable = input(true);
  /** Placeholder text for the search input. */
  readonly searchPlaceholder = input('Search...');
  /** Whether to render row checkboxes and the select-all header checkbox. */
  readonly selectable = input(true);
  /** Number of rows displayed per page. */
  readonly pageSize = input(5);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  /** Accessible label override for the search input. */
  readonly searchLabel = input<string>();
  /** Accessible label override for the select-all checkbox. */
  readonly selectAllLabel = input<string>();
  /** Accessible label override for each row's select checkbox. */
  readonly selectRowLabel = input<string>();

  protected readonly searchText = buiLabel('dataTableSearch', this.searchLabel);
  protected readonly selectAllText = buiLabel('dataTableSelectAll', this.selectAllLabel);
  protected readonly selectRowText = buiLabel('dataTableSelectRow', this.selectRowLabel);

  protected readonly query = signal('');
  protected readonly sortKey = signal('');
  protected readonly sortDir = signal<'asc' | 'desc'>('asc');
  protected readonly page = signal(0);
  private readonly selectedRows = signal<ReadonlySet<DataRow>>(new Set());

  protected readonly filtered = computed(() => {
    const query = this.query().trim().toLowerCase();
    const keys = this.columns().map((column) => column.key);
    let result = this.rows().filter(
      (row) => query === '' || keys.some((key) => cellText(row[key]).toLowerCase().includes(query)),
    );
    const sortKey = this.sortKey();
    if (sortKey !== '') {
      const direction = this.sortDir() === 'asc' ? 1 : -1;
      // eslint-disable-next-line unicorn/no-array-sort -- toSorted is not in the lib target
      result = [...result].sort(
        (a, b) =>
          cellText(a[sortKey]).localeCompare(cellText(b[sortKey]), undefined, { numeric: true }) *
          direction,
      );
    }
    return result;
  });
  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.filtered().length / this.pageSize())),
  );
  protected readonly pageRows = computed(() => {
    const start = Math.min(this.page(), this.pageCount() - 1) * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });
  protected readonly selectedCount = computed(() => this.selectedRows().size);
  protected readonly allSelected = computed(
    () =>
      this.filtered().length > 0 && this.filtered().every((row) => this.selectedRows().has(row)),
  );
  protected readonly someSelected = computed(() => this.selectedCount() > 0 && !this.allSelected());
  protected readonly computedClass = computed(() => cn('block', this.userClass()));

  protected colspan(): number {
    return this.columns().length + (this.selectable() ? 1 : 0);
  }

  protected alignClass(align: string | undefined): string {
    return ALIGN[align ?? 'left'];
  }

  protected cell(row: DataRow, key: string): string {
    return cellText(row[key]);
  }

  protected sortIndicator(key: string): string {
    if (this.sortKey() !== key) {
      return '↕';
    }
    return this.sortDir() === 'asc' ? '↑' : '↓';
  }

  protected sortBy(key: string): void {
    if (this.sortKey() === key) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.page.set(0);
  }

  protected isSelected(row: DataRow): boolean {
    return this.selectedRows().has(row);
  }

  protected toggleRow(row: DataRow): void {
    const next = new Set(this.selectedRows());
    if (next.has(row)) {
      next.delete(row);
    } else {
      next.add(row);
    }
    this.selectedRows.set(next);
  }

  protected toggleAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedRows.set(isChecked ? new Set(this.filtered()) : new Set());
  }
}
