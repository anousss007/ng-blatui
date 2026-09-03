import { OverlayModule } from '@angular/cdk/overlay';
import { Component, computed, contentChild, Directive, input, model, signal } from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { type ClassValue, cn } from '../utils/cn';
import { PANEL_POSITIONS } from '../utils/panel-positions';

export interface DataTableColumn {
  /** Row property key whose value is rendered and used for sorting/searching. */
  key: string;
  /** Column header text shown in the table head. */
  label: string;
  /** Whether the header is a sort toggle; `false` disables sorting for this column. */
  sortable?: boolean;
  /** Horizontal text alignment for the column's header and cells. */
  align?: 'left' | 'center' | 'right';
  /**
   * Whether the column may be hidden from the `toggleableColumns` menu. `false` keeps it out of
   * the menu and always on screen — for the one column a row is unreadable without.
   */
  hideable?: boolean;
}
type DataRow = Record<string, unknown>;

/** One page-size choice: the number of rows, and what the option reads. */
interface PerPageOption {
  value: number;
  label: string;
}

/**
 * Marks content for the data table's toolbar row, dropped in after the search box and before the
 * built-in controls — the filters no input will ever cover (a status select, a date range, a bulk
 * action). The toolbar row appears whenever anything wants to be in it.
 *
 * ```html
 * <bui-data-table [columns]="columns" [rows]="rows">
 *   <bui-select buiDataTableToolbar [options]="statuses" [(value)]="status" />
 * </bui-data-table>
 * ```
 */
@Directive({
  selector: '[buiDataTableToolbar]',
  host: { 'data-slot': 'data-table-toolbar' },
})
export class BuiDataTableToolbar {}

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

/**
 * A data table with search, sortable columns, row selection and pagination. Its toolbar row also
 * takes a page-size select (`perPageOptions`), a column-visibility menu (`toggleableColumns`) and
 * anything of your own marked {@link BuiDataTableToolbar}.
 */
@Component({
  selector: 'bui-data-table',
  host: { 'data-slot': 'data-table', '[class]': 'computedClass()' },
  imports: [OverlayModule],
  template: `
    <!-- Always rendered so the projected toolbar content has somewhere to land; it collapses
         to nothing when neither a control nor a consumer wants the row. -->
    <div [class]="toolbarClass()">
      @if (searchable()) {
        <input
          type="search"
          [value]="query()"
          [placeholder]="searchPlaceholder()"
          class="h-9 w-full max-w-xs rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          [attr.aria-label]="searchText()"
          (input)="onSearch($event)"
        />
      }
      <ng-content select="[buiDataTableToolbar]" />
      <div class="ms-auto flex items-center gap-2">
        @if (perPage().length > 0) {
          <select
            class="h-9 rounded-md border border-input bg-transparent px-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            [value]="pageSize()"
            [attr.aria-label]="perPageText()"
            (change)="setPageSize($event)"
          >
            @for (option of perPage(); track option.value) {
              <option [value]="option.value">{{ option.label }}</option>
            }
          </select>
        }
        @if (toggleableColumns()) {
          <button
            type="button"
            cdkOverlayOrigin
            #columnsOrigin="cdkOverlayOrigin"
            class="inline-flex h-9 items-center gap-1 rounded-md border border-input px-3 text-sm hover:bg-accent"
            aria-haspopup="true"
            [attr.aria-expanded]="columnsOpen()"
            (click)="columnsOpen.set(!columnsOpen())"
          >
            {{ columnsText() }}
            <svg
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <ng-template
            cdkConnectedOverlay
            [cdkConnectedOverlayOrigin]="columnsOrigin"
            [cdkConnectedOverlayOpen]="columnsOpen()"
            [cdkConnectedOverlayPositions]="columnsPositions"
            [cdkConnectedOverlayPush]="true"
            [cdkConnectedOverlayViewportMargin]="8"
            (overlayOutsideClick)="columnsOpen.set(false)"
            (detach)="columnsOpen.set(false)"
          >
            <div
              role="group"
              [attr.aria-label]="columnsText()"
              class="z-50 max-h-72 min-w-[10rem] overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
              (keydown.escape)="columnsOpen.set(false)"
            >
              @for (column of hideableColumns(); track column.key) {
                <label
                  class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                >
                  <input
                    type="checkbox"
                    [checked]="isVisible(column.key)"
                    (change)="toggleColumn(column.key)"
                  />
                  {{ column.label }}
                </label>
              }
            </div>
          </ng-template>
        }
      </div>
    </div>
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
            @for (column of shownColumns(); track column.key) {
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
              @for (column of shownColumns(); track column.key) {
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
  /** Number of rows displayed per page. Two-way bindable with `[(pageSize)]`. */
  readonly pageSize = model(5);
  /**
   * Page sizes offered in the toolbar. A plain list (`[10, 25, 50]`) labels each option with its
   * own number; a map (`{ 10: '10 per page' }`) uses your labels. Empty renders no select.
   */
  readonly perPageOptions = input<readonly number[] | Record<number, string>>([]);
  /** Whether to offer the column-visibility menu in the toolbar. */
  readonly toggleableColumns = input(false);
  /**
   * Which columns are on screen, by key. `null` means "not controlled, show everything"; an empty
   * array means every hideable column is hidden, which is a state the menu can reach. Columns
   * marked `hideable: false` are always shown whatever this holds. Two-way bindable, so the state
   * is yours to keep.
   */
  readonly visibleColumns = model<readonly string[] | null>(null);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  /** Accessible label override for the search input. */
  readonly searchLabel = input<string>();
  /** Accessible label override for the select-all checkbox. */
  readonly selectAllLabel = input<string>();
  /** Accessible label override for each row's select checkbox. */
  readonly selectRowLabel = input<string>();
  /** Label override for the column-visibility menu's trigger. */
  readonly columnsLabel = input<string>();
  /** Accessible label override for the page-size select. */
  readonly perPageLabel = input<string>();

  protected readonly searchText = buiLabel('dataTableSearch', this.searchLabel);
  protected readonly selectAllText = buiLabel('dataTableSelectAll', this.selectAllLabel);
  protected readonly selectRowText = buiLabel('dataTableSelectRow', this.selectRowLabel);
  protected readonly columnsText = buiLabel('dataTableColumns', this.columnsLabel);
  protected readonly perPageText = buiLabel('dataTablePerPage', this.perPageLabel);
  protected readonly columnsPositions = PANEL_POSITIONS;

  private readonly projectedToolbar = contentChild(BuiDataTableToolbar);

  protected readonly query = signal('');
  protected readonly sortKey = signal('');
  protected readonly sortDir = signal<'asc' | 'desc'>('asc');
  protected readonly page = signal(0);
  protected readonly columnsOpen = signal(false);
  private readonly selectedRows = signal<ReadonlySet<DataRow>>(new Set());

  protected readonly perPage = computed<readonly PerPageOption[]>(() => {
    const options = this.perPageOptions();
    if (Array.isArray(options)) {
      return (options as readonly number[]).map((value) => ({ value, label: String(value) }));
    }
    return Object.entries(options as Record<number, string>).map(([value, label]) => ({
      value: Number(value),
      label,
    }));
  });
  protected readonly hideableColumns = computed(() =>
    this.columns().filter((column) => column.hideable !== false),
  );
  protected readonly shownColumns = computed(() =>
    this.columns().filter((column) => this.isVisible(column.key)),
  );
  /**
   * The row is `hidden` until something wants to be in it — the `ng-content` outlet has to exist
   * unconditionally for the projection to land, so presence is decided in CSS rather than by an
   * `@if` around it.
   */
  protected readonly toolbarClass = computed(() =>
    this.searchable() ||
    this.toggleableColumns() ||
    this.perPage().length > 0 ||
    this.projectedToolbar() !== undefined
      ? 'mb-3 flex flex-wrap items-center gap-2'
      : 'hidden',
  );

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
    return this.shownColumns().length + (this.selectable() ? 1 : 0);
  }

  /** A column with no `visibleColumns` to answer to is shown, and so is a non-hideable one. */
  protected isVisible(key: string): boolean {
    const visible = this.visibleColumns();
    if (visible === null) {
      return true;
    }
    const column = this.columns().find((candidate) => candidate.key === key);
    return column?.hideable === false || visible.includes(key);
  }

  protected toggleColumn(key: string): void {
    // The uncontrolled `null` materialises into the list it stood for the moment one is unticked,
    // so the answer the consumer gets back is complete rather than a delta they have to apply.
    const visible = this.visibleColumns() ?? this.columns().map((column) => column.key);
    this.visibleColumns.set(
      visible.includes(key) ? visible.filter((existing) => existing !== key) : [...visible, key],
    );
  }

  protected setPageSize(event: Event): void {
    this.pageSize.set(Number((event.target as HTMLSelectElement).value));
    // Page 5 at 10-per-page lands past the end of the same result set at 50.
    this.page.set(0);
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
