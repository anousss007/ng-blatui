import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  type Signal,
  ViewEncapsulation,
} from '@angular/core';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

/* ----- Row models for each table variant ----- */
interface BasicRow {
  customer: string;
  email: string;
  amount: string;
  status: 'paid' | 'pending';
  platform: string;
}
interface UserRow {
  name: string;
  email: string;
  roleIcon: string;
  roleTone: string;
  role: string;
  plan: string;
  billing: string;
  status: 'active' | 'pending' | 'inactive';
}
interface TicketRow {
  name: string;
  email: string;
  subject: string;
  department: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: string;
}
interface EmployeeRow {
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'active' | 'on leave';
}
interface Invoice {
  id: string;
  statusIcon: string;
  statusTone: 'green' | 'amber' | 'sky';
  name: string;
  role: string;
  avatar: string;
  total: string;
  date: string;
  paid: boolean;
  balance?: string;
}
interface ContractRow {
  vendor: string;
  email: string;
  contract: string;
  category: string;
  renews: string;
  cost: string;
  status: 'active' | 'review due' | 'expired' | 'negotiating';
}
interface LaunchRow {
  launch: string;
  code: string;
  lead: string;
  leadEmail: string;
  market: string;
  date: string;
  status: 'on track' | 'at risk' | 'launched' | 'delayed';
}
interface CourseRow {
  course: string;
  author: string;
  icon: string;
  time: string;
  percent: number;
  done: number;
  total: number;
  s1: number;
  s2: number;
  s3: number;
}
interface ProductRow {
  name: string;
  brand: string;
  image: string;
  catIcon: string;
  category: string;
  amount: string;
  qty: number;
  status: 'publish' | 'inactive';
}
interface GraphRow {
  name: string;
  brand: string;
  image: string;
  spark: string;
  price: string;
  arrow: 'up' | 'down';
  orders: number;
  delta: string;
}

/** Sort direction cycled by clicking a header: none → asc → desc → none. */
type SortDirection = 'asc' | 'desc' | null;

/**
 * Generic client-side table controller built on Angular signals.
 *
 * Owns search / sort / pagination / row-selection state for one table and
 * exposes computed views (`paged`, `total`, `showingFrom` …) the template
 * binds to. Construct one per table card with:
 *  - `rows`      the full dataset,
 *  - `searchText` a fn returning the searchable text for a row,
 *  - `sortValue` (optional) a fn returning a sortable value for a column key,
 *  - `pageSize`  initial page size,
 *  - `id`        a stable identity fn for selection tracking.
 */
class DataTable<T> {
  readonly query = signal('');
  readonly sortKey = signal<string | null>(null);
  readonly sortDir = signal<SortDirection>(null);
  readonly pageSize = signal(5);
  readonly page = signal(0);
  readonly selected = signal<ReadonlySet<unknown>>(new Set());

  /** Extra row-level predicate (used by the Filters demo). */
  readonly extraFilter = signal<(row: T) => boolean>(() => true);

  constructor(
    private readonly rows: Signal<readonly T[]>,
    private readonly searchText: (row: T) => string,
    private readonly id: (row: T) => unknown,
    private readonly sortValue: (row: T, key: string) => string | number = () => '',
    initialPageSize = 5,
  ) {
    this.pageSize.set(initialPageSize);
  }

  /** Rows after search + extra filter, before sorting/pagination. */
  readonly filtered = computed<readonly T[]>(() => {
    const q = this.query().trim().toLowerCase();
    const extra = this.extraFilter();
    return this.rows().filter(
      (r) => extra(r) && (q === '' || this.searchText(r).toLowerCase().includes(q)),
    );
  });

  readonly sorted = computed<readonly T[]>(() => {
    const key = this.sortKey();
    const direction = this.sortDir();
    const rows = this.filtered();
    if (!key || !direction) {
      return rows;
    }
    const factor = direction === 'asc' ? 1 : -1;
    // toSorted() requires ES2023 lib; copy-then-sort keeps this non-mutating.
    // eslint-disable-next-line unicorn/no-array-sort
    return [...rows].sort((a, b) => {
      const av = this.sortValue(a, key);
      const bv = this.sortValue(b, key);
      if (typeof av === 'number' && typeof bv === 'number') {
        return (av - bv) * factor;
      }
      return String(av).localeCompare(String(bv)) * factor;
    });
  });

  readonly total = computed(() => this.filtered().length);
  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));

  /** Rows on the current page. */
  readonly paged = computed<readonly T[]>(() => {
    const size = this.pageSize();
    const start = this.page() * size;
    return this.sorted().slice(start, start + size);
  });

  readonly showingFrom = computed(() =>
    this.total() === 0 ? 0 : this.page() * this.pageSize() + 1,
  );
  readonly showingTo = computed(() => Math.min(this.total(), (this.page() + 1) * this.pageSize()));

  /** Page numbers to render (1-based), capped so the bar stays compact. */
  readonly pageNumbers = computed<number[]>(() => {
    const count = this.pageCount();
    const max = Math.min(count, 5);
    const current = this.page();
    const start = Math.max(0, Math.min(current - 2, count - max));
    return Array.from({ length: max }, (_, index) => start + index + 1);
  });

  /* ----- mutations ----- */
  setQuery(value: string): void {
    this.query.set(value);
    this.page.set(0);
  }

  toggleSort(key: string): void {
    if (this.sortKey() === key) {
      let next: SortDirection;
      if (this.sortDir() === 'asc') {
        next = 'desc';
      } else if (this.sortDir() === 'desc') {
        next = null;
      } else {
        next = 'asc';
      }
      this.sortDir.set(next);
      if (next === null) {
        this.sortKey.set(null);
      }
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
    this.page.set(0);
  }

  dirFor(key: string): SortDirection {
    return this.sortKey() === key ? this.sortDir() : null;
  }

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.page.set(0);
  }

  goTo(page1: number): void {
    const lastPage = this.pageCount() - 1;
    this.page.set(Math.max(0, Math.min(page1 - 1, lastPage)));
  }
  prev(): void {
    this.page.set(Math.max(0, this.page() - 1));
  }
  next(): void {
    this.page.set(Math.min(this.pageCount() - 1, this.page() + 1));
  }

  setExtraFilter(shouldInclude: (row: T) => boolean): void {
    this.extraFilter.set(shouldInclude);
    this.page.set(0);
  }

  /* ----- selection ----- */
  isSelected(row: T): boolean {
    return this.selected().has(this.id(row));
  }
  toggleRow(row: T): void {
    const next = new Set(this.selected());
    const key = this.id(row);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    this.selected.set(next);
  }
  readonly allOnPageSelected = computed(() => {
    const page = this.paged();
    return page.length > 0 && page.every((r) => this.selected().has(this.id(r)));
  });
  toggleAllOnPage(): void {
    const page = this.paged();
    const next = new Set(this.selected());
    if (this.allOnPageSelected()) {
      for (const r of page) next.delete(this.id(r));
    } else {
      for (const r of page) next.add(this.id(r));
    }
    this.selected.set(next);
  }
}

/** Duplicate a 5-row seed up to `count` rows so pagination is demonstrable. */
function expand<T>(seed: readonly T[], count: number, clone: (row: T, index: number) => T): T[] {
  const out: T[] = [...seed];
  for (let index = seed.length; index < count; index++) {
    out.push(clone(seed[index % seed.length], index));
  }
  return out;
}

/**
 * AdminCN — pixel-faithful clone of the shadcn admin "Data Table" page,
 * now fully interactive: live search, column sort, pagination (page size +
 * prev/next + numbered pages), row selection, column visibility, filters and
 * expandable rows — all client-side via Angular signals.
 */
@Component({
  selector: 'app-tpl-admincn-datatable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Lucide, AdmincnShell],
  templateUrl: './admincn-datatable.html',
})
export class AdmincnDatatable {
  protected readonly img = '/admincn';
  protected readonly avatars = [
    '/admincn/avatars/avatar-1.webp',
    '/admincn/avatars/avatar-2.webp',
    '/admincn/avatars/avatar-3.webp',
    '/admincn/avatars/avatar-4.webp',
    '/admincn/avatars/avatar-5.webp',
    '/admincn/avatars/avatar-6.webp',
    '/admincn/avatars/avatar-16.webp',
  ];

  protected readonly pageSizes = [5, 10, 25];

  /* 1 — Basic Data Table */
  private readonly basicSeed: BasicRow[] = [
    {
      customer: 'Jack Alfredo',
      email: 'jack@shadcnstudio.com',
      amount: '$316.00',
      status: 'paid',
      platform: this.avatars[0],
    },
    {
      customer: 'Maria Gonzalez',
      email: 'maria.g@shadcnstudio.com',
      amount: '$253.40',
      status: 'pending',
      platform: this.avatars[1],
    },
    {
      customer: 'John Doe',
      email: 'john.doe@shadcnstudio.com',
      amount: '$852.00',
      status: 'paid',
      platform: this.avatars[0],
    },
    {
      customer: 'Emily Carter',
      email: 'emily.carter@shadcnstudio.com',
      amount: '$889.00',
      status: 'pending',
      platform: this.avatars[1],
    },
    {
      customer: 'David Lee',
      email: 'david.lee@shadcnstudio.com',
      amount: '$723.16',
      status: 'paid',
      platform: this.avatars[0],
    },
  ];
  protected readonly basicRows = signal<BasicRow[]>(
    expand(this.basicSeed, 25, (r, index) => ({
      ...r,
      customer: `${r.customer} ${index + 1}`,
      email: r.email.replace('@', () => `+${index + 1}@`),
    })),
  );
  protected readonly basic = new DataTable<BasicRow>(
    this.basicRows,
    (r) => `${r.customer} ${r.email} ${r.amount} ${r.status}`,
    (r) => r.email,
    (r, k) =>
      k === 'amount'
        ? Number(r.amount.replaceAll(/[^0-9.]/g, ''))
        : ({ status: r.status }[k] ?? r.customer),
  );

  /* 2 & 3 — Column Visibility + Filters (same user dataset) */
  private readonly usersSeed: UserRow[] = [
    {
      name: 'Jack Alfredo',
      email: 'jack.alfredo@shadcnstudio.com',
      roleIcon: 'pencil',
      roleTone: 'text-chart-3',
      role: 'maintainer',
      plan: 'enterprise',
      billing: 'Auto debit',
      status: 'active',
    },
    {
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@company.com',
      roleIcon: 'user',
      roleTone: 'text-green-600',
      role: 'admin',
      plan: 'enterprise',
      billing: 'Auto debit',
      status: 'active',
    },
    {
      name: 'Robert Chen',
      email: 'robert.chen@startup.io',
      roleIcon: 'pen-tool',
      roleTone: 'text-chart-2',
      role: 'editor',
      plan: 'team',
      billing: 'Manual - PayPal',
      status: 'pending',
    },
    {
      name: 'Emily Wilson',
      email: 'emily.wilson@freelance.com',
      roleIcon: 'pen-line',
      roleTone: 'text-chart-1',
      role: 'author',
      plan: 'basic',
      billing: 'Manual - cash',
      status: 'inactive',
    },
    {
      name: 'David Garcia',
      email: 'david.garcia@agency.net',
      roleIcon: 'crown',
      roleTone: 'text-chart-5',
      role: 'subscriber',
      plan: 'company',
      billing: 'Auto debit',
      status: 'active',
    },
  ];
  protected readonly usersRows = signal<UserRow[]>(
    expand(this.usersSeed, 15, (r, index) => ({
      ...r,
      name: `${r.name} ${index + 1}`,
      email: r.email.replace('@', () => `+${index + 1}@`),
    })),
  );
  protected readonly users = new DataTable<UserRow>(
    this.usersRows,
    (r) => `${r.name} ${r.email} ${r.role} ${r.plan} ${r.billing} ${r.status}`,
    (r) => r.email,
    (r, k) => {
      if (k === 'role') return r.role;
      if (k === 'plan') return r.plan;
      if (k === 'status') return r.status;
      return r.name;
    },
  );

  /* Column-visibility demo state (table 2). */
  protected readonly userColumns = [
    { key: 'role', label: 'Role' },
    { key: 'plan', label: 'Plan' },
    { key: 'billing', label: 'Billing' },
    { key: 'status', label: 'Status' },
  ];
  protected readonly visibleCols = signal<ReadonlySet<string>>(
    new Set(['role', 'plan', 'billing', 'status']),
  );
  protected readonly columnsMenuOpen = signal(false);
  protected colVisible(key: string): boolean {
    return this.visibleCols().has(key);
  }
  protected toggleCol(key: string): void {
    const next = new Set(this.visibleCols());
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    this.visibleCols.set(next);
  }

  /* Filters demo state (table 3) — a separate DataTable over the same rows. */
  protected readonly usersFiltered = new DataTable<UserRow>(
    this.usersRows,
    (r) => `${r.name} ${r.email} ${r.role} ${r.plan} ${r.billing} ${r.status}`,
    (r) => r.email,
  );
  protected readonly roleFilter = signal('all');
  protected readonly planFilter = signal('all');
  protected readonly statusFilter = signal('all');
  protected readonly openFilterMenu = signal<string | null>(null);
  protected readonly roleOptions = ['all', 'maintainer', 'admin', 'editor', 'author', 'subscriber'];
  protected readonly planOptions = ['all', 'enterprise', 'team', 'basic', 'company'];
  protected readonly statusOptions = ['all', 'active', 'pending', 'inactive'];
  private applyUserFilters(): void {
    const role = this.roleFilter();
    const plan = this.planFilter();
    const status = this.statusFilter();
    this.usersFiltered.setExtraFilter(
      (u) =>
        (role === 'all' || u.role === role) &&
        (plan === 'all' || u.plan === plan) &&
        (status === 'all' || u.status === status),
    );
  }
  protected pickFilter(kind: 'role' | 'plan' | 'status', value: string): void {
    switch (kind) {
      case 'role': {
        this.roleFilter.set(value);
        break;
      }
      case 'plan': {
        this.planFilter.set(value);
        break;
      }
      case 'status': {
        this.statusFilter.set(value);
        break;
      }
    }
    this.openFilterMenu.set(null);
    this.applyUserFilters();
  }
  protected toggleFilterMenu(kind: string): void {
    this.openFilterMenu.set(this.openFilterMenu() === kind ? null : kind);
  }

  /* 4 — Resizable Columns (support tickets) */
  private readonly ticketsSeed: TicketRow[] = [
    {
      name: 'Morgan Walsh',
      email: 'morgan.walsh@helixcorp.com',
      subject: 'SSO login redirect loop on staging',
      department: 'engineering',
      priority: 'urgent',
      status: 'in progress',
    },
    {
      name: 'Aiden Reyes',
      email: 'aiden.reyes@northwind.io',
      subject: 'Invoice PDF missing tax breakdown',
      department: 'billing',
      priority: 'high',
      status: 'open',
    },
    {
      name: 'Sofia Kaur',
      email: 'sofia.kaur@brightlane.co',
      subject: 'Request role change for finance workspace',
      department: 'operations',
      priority: 'medium',
      status: 'resolved',
    },
    {
      name: 'Jonah Tate',
      email: 'jonah.tate@pixelops.dev',
      subject: 'Webhook retries failing after deploy',
      department: 'engineering',
      priority: 'high',
      status: 'in progress',
    },
    {
      name: 'Lena Cho',
      email: 'lena.cho@marketgrid.com',
      subject: 'Export CSV truncates long product names',
      department: 'product',
      priority: 'low',
      status: 'closed',
    },
  ];
  protected readonly ticketsRows = signal<TicketRow[]>(
    expand(this.ticketsSeed, 15, (r, index) => ({
      ...r,
      name: `${r.name} ${index + 1}`,
      email: r.email.replace('@', () => `+${index + 1}@`),
    })),
  );
  protected readonly tickets = new DataTable<TicketRow>(
    this.ticketsRows,
    (r) => `${r.name} ${r.email} ${r.subject} ${r.department} ${r.priority} ${r.status}`,
    (r) => r.email,
    (r, k) => {
      if (k === 'department') return r.department;
      if (k === 'priority') return r.priority;
      if (k === 'status') return r.status;
      return r.name;
    },
  );

  /* 5 — Pinnable Columns (employees) */
  private readonly employeesSeed: EmployeeRow[] = [
    {
      name: 'Keira Lawson',
      email: 'keira.lawson@company.com',
      department: 'engineering',
      role: 'Tech Lead',
      status: 'active',
    },
    {
      name: 'Marco Reyes',
      email: 'marco.reyes@company.com',
      department: 'design',
      role: 'UI Designer',
      status: 'active',
    },
    {
      name: 'Aisha Ndiaye',
      email: 'aisha.ndiaye@company.com',
      department: 'marketing',
      role: 'SEO Specialist',
      status: 'on leave',
    },
    {
      name: 'Theo Chen',
      email: 'theo.chen@company.com',
      department: 'engineering',
      role: 'Developer',
      status: 'active',
    },
    {
      name: 'Elena Vargas',
      email: 'elena.vargas@company.com',
      department: 'sales',
      role: 'Account Executive',
      status: 'active',
    },
  ];
  protected readonly employeesRows = signal<EmployeeRow[]>(
    expand(this.employeesSeed, 15, (r, index) => ({
      ...r,
      name: `${r.name} ${index + 1}`,
      email: r.email.replace('@', () => `+${index + 1}@`),
    })),
  );
  protected readonly employees = new DataTable<EmployeeRow>(
    this.employeesRows,
    (r) => `${r.name} ${r.email} ${r.department} ${r.role} ${r.status}`,
    (r) => r.email,
    (r, k) => {
      if (k === 'department') return r.department;
      if (k === 'role') return r.role;
      if (k === 'status') return r.status;
      return r.name;
    },
  );

  /* 6 — Page Size Selector (invoices) */
  private readonly invoicesSeed: Invoice[] = [
    {
      id: '#5099',
      statusIcon: 'mail',
      statusTone: 'green',
      name: 'Jack Alfredo',
      role: 'UI/UX designer',
      avatar: this.avatars[0],
      total: '$3,120.00',
      date: '03 Apr 2025',
      paid: true,
    },
    {
      id: '#5008',
      statusIcon: 'check',
      statusTone: 'amber',
      name: 'Maria Gonzalez',
      role: 'Frontend developer',
      avatar: this.avatars[1],
      total: '$1,450.00',
      date: '12 May 2025',
      paid: true,
    },
    {
      id: '#5101',
      statusIcon: 'check',
      statusTone: 'amber',
      name: 'John Doe',
      role: 'Graphic designer',
      avatar: this.avatars[2],
      total: '$1,200.00',
      date: '26 Jun 2025',
      paid: true,
    },
    {
      id: '#4586',
      statusIcon: 'download',
      statusTone: 'sky',
      name: 'Emily Carter',
      role: 'UI/UX designer',
      avatar: this.avatars[3],
      total: '$2,680.00',
      date: '05 Jul 2025',
      paid: false,
      balance: '-$78.00',
    },
    {
      id: '#4360',
      statusIcon: 'mail',
      statusTone: 'green',
      name: 'David Lee',
      role: 'Backend developer',
      avatar: this.avatars[4],
      total: '$3,120.00',
      date: '07 Aug 2025',
      paid: true,
    },
  ];
  protected readonly invoicesRows = signal<Invoice[]>(
    expand(this.invoicesSeed, 25, (r, index) => ({
      ...r,
      id: `#${4000 + index}`,
      name: `${r.name} ${index + 1}`,
    })),
  );
  protected readonly invoices = new DataTable<Invoice>(
    this.invoicesRows,
    (r) => `${r.id} ${r.name} ${r.role} ${r.total} ${r.date}`,
    (r) => r.id,
    (r, k) =>
      k === 'total' ? Number(r.total.replaceAll(/[^0-9.]/g, '')) : ({ id: r.id }[k] ?? r.name),
  );
  protected readonly invoiceStatusFilter = signal('all');
  protected readonly invoiceStatusOptions = ['all', 'paid', 'unpaid'];
  protected readonly invoiceStatusMenuOpen = signal(false);
  protected pickInvoiceStatus(value: string): void {
    this.invoiceStatusFilter.set(value);
    this.invoiceStatusMenuOpen.set(false);
    this.invoices.setExtraFilter((inv) => {
      if (value === 'all') return true;
      return value === 'paid' ? inv.paid : !inv.paid;
    });
  }

  /* 7 — Draggable Columns (contracts) */
  protected readonly dragCols = [
    'Vendor',
    'Contract ID',
    'Category',
    'Renews On',
    'Annual Cost',
    'Status',
  ];
  private readonly contractsSeed: ContractRow[] = [
    {
      vendor: 'Atlas Cloud',
      email: 'contracts@atlascloud.io',
      contract: 'CTR-4821',
      category: 'infrastructure',
      renews: 'Apr 12, 2026',
      cost: '$42,800.00',
      status: 'active',
    },
    {
      vendor: 'Northfield Analytics',
      email: 'billing@northfield.io',
      contract: 'CTR-4817',
      category: 'software',
      renews: 'Mar 28, 2026',
      cost: '$18,600.00',
      status: 'review due',
    },
    {
      vendor: 'Lumen Security',
      email: 'renewals@lumnsec.com',
      contract: 'CTR-4813',
      category: 'security',
      renews: 'Jan 15, 2026',
      cost: '$31,200.00',
      status: 'expired',
    },
    {
      vendor: 'Papertrail HR',
      email: 'accounts@papertrail.co',
      contract: 'CTR-4809',
      category: 'hr platform',
      renews: 'Jun 01, 2026',
      cost: '$9,400.00',
      status: 'negotiating',
    },
    {
      vendor: 'Verdant Grid',
      email: 'ops@verdantgrid.com',
      contract: 'CTR-4805',
      category: 'infrastructure',
      renews: 'May 19, 2026',
      cost: '$55,700.00',
      status: 'active',
    },
  ];
  protected readonly contractsRows = signal<ContractRow[]>(
    expand(this.contractsSeed, 15, (r, index) => ({
      ...r,
      vendor: `${r.vendor} ${index + 1}`,
      contract: `CTR-${4900 + index}`,
    })),
  );
  protected readonly contracts = new DataTable<ContractRow>(
    this.contractsRows,
    (r) => `${r.vendor} ${r.email} ${r.contract} ${r.category} ${r.renews} ${r.cost} ${r.status}`,
    (r) => r.contract,
    (r, k) =>
      k === 'cost'
        ? Number(r.cost.replaceAll(/[^0-9.]/g, ''))
        : ({ category: r.category, status: r.status }[k] ?? r.vendor),
  );

  /* 8 — Expandable Rows (launches) */
  private readonly launchesSeed: LaunchRow[] = [
    {
      launch: 'NovaPay Wallet',
      code: 'LNH-2401',
      lead: 'Keira Lawson',
      leadEmail: 'keira.lawson@northpeak.co',
      market: 'north america',
      date: 'Apr 18, 2026',
      status: 'on track',
    },
    {
      launch: 'Helix Analytics Suite',
      code: 'LNH-2397',
      lead: 'Marco Reyes',
      leadEmail: 'marco.reyes@brightfield.io',
      market: 'europe',
      date: 'May 06, 2026',
      status: 'at risk',
    },
    {
      launch: 'Summit CRM Mobile',
      code: 'LNH-2393',
      lead: 'Aisha Ndiaye',
      leadEmail: 'aisha.ndiaye@lumora.health',
      market: 'global',
      date: 'Mar 30, 2026',
      status: 'launched',
    },
    {
      launch: 'Verdant Inventory Hub',
      code: 'LNH-2389',
      lead: 'Theo Chen',
      leadEmail: 'theo.chen@stacklane.dev',
      market: 'apac',
      date: 'Jun 12, 2026',
      status: 'on track',
    },
    {
      launch: 'Atlas Identity Portal',
      code: 'LNH-2385',
      lead: 'Elena Vargas',
      leadEmail: 'elena.vargas@verdant.co',
      market: 'north america',
      date: 'Apr 25, 2026',
      status: 'delayed',
    },
  ];
  protected readonly launchesRows = signal<LaunchRow[]>(
    expand(this.launchesSeed, 15, (r, index) => ({
      ...r,
      launch: `${r.launch} ${index + 1}`,
      code: `LNH-${2500 + index}`,
    })),
  );
  protected readonly launches = new DataTable<LaunchRow>(
    this.launchesRows,
    (r) => `${r.launch} ${r.code} ${r.lead} ${r.leadEmail} ${r.market} ${r.date} ${r.status}`,
    (r) => r.code,
    (r, k) => {
      if (k === 'market') return r.market;
      if (k === 'status') return r.status;
      return r.launch;
    },
  );
  protected readonly expandedRows = signal<ReadonlySet<string>>(new Set());
  protected isExpanded(l: LaunchRow): boolean {
    return this.expandedRows().has(l.code);
  }
  protected toggleExpand(l: LaunchRow): void {
    const next = new Set(this.expandedRows());
    if (next.has(l.code)) {
      next.delete(l.code);
    } else {
      next.add(l.code);
    }
    this.expandedRows.set(next);
  }

  /* 9 — Progress (courses) */
  private readonly coursesSeed: CourseRow[] = [
    {
      course: 'UI/UX design',
      author: 'John cartal',
      icon: 'code',
      time: '19h 17m',
      percent: 50,
      done: 50,
      total: 100,
      s1: 14,
      s2: 23,
      s3: 26,
    },
    {
      course: 'Web development',
      author: 'Sara Mitchell',
      icon: 'layout-dashboard',
      time: '20h 5m',
      percent: 22,
      done: 11,
      total: 50,
      s1: 15,
      s2: 24,
      s3: 27,
    },
    {
      course: 'Product management',
      author: 'Alex Johnson',
      icon: 'pen-tool',
      time: '21h 38m',
      percent: 10,
      done: 1,
      total: 10,
      s1: 16,
      s2: 25,
      s3: 28,
    },
    {
      course: 'Graphic design',
      author: 'Emily Chen',
      icon: 'brain-circuit',
      time: '22h 12m',
      percent: 52,
      done: 26,
      total: 50,
      s1: 17,
      s2: 26,
      s3: 29,
    },
    {
      course: 'Data analysis',
      author: 'Mark Robinson',
      icon: 'brain-circuit',
      time: '23h 45m',
      percent: 76,
      done: 76,
      total: 100,
      s1: 18,
      s2: 27,
      s3: 30,
    },
  ];
  protected readonly coursesRows = signal<CourseRow[]>(
    expand(this.coursesSeed, 25, (r, index) => ({
      ...r,
      course: `${r.course} ${index + 1}`,
    })),
  );
  protected readonly courses = new DataTable<CourseRow>(
    this.coursesRows,
    (r) => `${r.course} ${r.author} ${r.time}`,
    (r) => r.course,
    (r, k) => (k === 'progress' ? r.percent : ({ time: r.time }[k] ?? r.course)),
  );

  /* 10 — Export Buttons (products) */
  private readonly productsSeed: ProductRow[] = [
    {
      name: 'Samsung galaxy s35',
      brand: 'Samsung',
      image: this.img + '/widgets/image-6.webp',
      catIcon: 'smartphone',
      category: 'smartphone',
      amount: '$312',
      qty: 45,
      status: 'publish',
    },
    {
      name: 'Apple MacBook Pro',
      brand: 'Apple',
      image: this.img + '/widgets/image-6.webp',
      catIcon: 'monitor',
      category: 'laptop',
      amount: '$890',
      qty: 634,
      status: 'publish',
    },
    {
      name: 'Sony WH-1000XM4',
      brand: 'Sony',
      image: this.img + '/widgets/image-6.webp',
      catIcon: 'headphones',
      category: 'headphone',
      amount: '$120',
      qty: 456,
      status: 'inactive',
    },
    {
      name: 'Dell XPS 13',
      brand: 'Dell',
      image: this.img + '/widgets/image-6.webp',
      catIcon: 'monitor',
      category: 'laptop',
      amount: '$112',
      qty: 4,
      status: 'publish',
    },
    {
      name: 'Smart band 4',
      brand: 'Xiaomi',
      image: this.img + '/widgets/image-6.webp',
      catIcon: 'clock',
      category: 'smartwatch',
      amount: '$150',
      qty: 45,
      status: 'inactive',
    },
  ];
  protected readonly productsRows = signal<ProductRow[]>(
    expand(this.productsSeed, 25, (r, index) => ({
      ...r,
      name: `${r.name} ${index + 1}`,
    })),
  );
  protected readonly products = new DataTable<ProductRow>(
    this.productsRows,
    (r) => `${r.name} ${r.brand} ${r.category} ${r.amount} ${r.status}`,
    (r) => r.name,
    (r, k) =>
      ({
        category: r.category,
        amount: Number(r.amount.replaceAll(/[^0-9.]/g, '')),
        qty: r.qty,
        status: r.status,
      })[k] ?? r.name,
  );
  protected readonly productCategoryFilter = signal('all');
  protected readonly productStockFilter = signal('all');
  protected readonly productStatusFilter = signal('all');
  protected readonly productMenuOpen = signal<string | null>(null);
  protected readonly productCategoryOptions = [
    'all',
    'smartphone',
    'laptop',
    'headphone',
    'smartwatch',
  ];
  protected readonly productStockOptions = ['all', 'in stock', 'low stock'];
  protected readonly productStatusOptions = ['all', 'publish', 'inactive'];
  private applyProductFilters(): void {
    const cat = this.productCategoryFilter();
    const stock = this.productStockFilter();
    const status = this.productStatusFilter();
    this.products.setExtraFilter(
      (p) =>
        (cat === 'all' || p.category === cat) &&
        (stock === 'all' || (stock === 'low stock' ? p.qty < 50 : p.qty >= 50)) &&
        (status === 'all' || p.status === status),
    );
  }
  protected pickProductFilter(kind: 'category' | 'stock' | 'status', value: string): void {
    switch (kind) {
      case 'category': {
        this.productCategoryFilter.set(value);
        break;
      }
      case 'stock': {
        this.productStockFilter.set(value);
        break;
      }
      case 'status': {
        this.productStatusFilter.set(value);
        break;
      }
    }
    this.productMenuOpen.set(null);
    this.applyProductFilters();
  }
  protected toggleProductMenu(kind: string): void {
    this.productMenuOpen.set(this.productMenuOpen() === kind ? null : kind);
  }

  /* 11 — Graph (products with sparkline) */
  private readonly graphsSeed: GraphRow[] = [
    {
      name: 'Samsung galaxy s35',
      brand: 'Samsung',
      image: this.img + '/widgets/image-6.webp',
      spark: '0,16 12,10 24,18 36,6 48,12 60,4 72,9',
      price: '$32',
      arrow: 'up',
      orders: 132,
      delta: '+23',
    },
    {
      name: 'Apple MacBook Pro',
      brand: 'Apple',
      image: this.img + '/widgets/image-6.webp',
      spark: '0,14 12,18 24,8 36,12 48,6 60,10 72,5',
      price: '$280',
      arrow: 'up',
      orders: 116,
      delta: '+10',
    },
    {
      name: 'Sony WH-1000XM4',
      brand: 'Sony',
      image: this.img + '/widgets/image-6.webp',
      spark: '0,6 12,9 24,5 36,12 48,8 60,16 72,18',
      price: '$120',
      arrow: 'down',
      orders: 250,
      delta: '-8',
    },
    {
      name: 'Dell XPS 13',
      brand: 'Dell',
      image: this.img + '/widgets/image-6.webp',
      spark: '0,15 12,9 24,14 36,7 48,11 60,5 72,8',
      price: '$250',
      arrow: 'up',
      orders: 23,
      delta: '+12',
    },
    {
      name: 'Smart band 4',
      brand: 'Xiaomi',
      image: this.img + '/widgets/image-6.webp',
      spark: '0,16 12,12 24,15 36,8 48,11 60,6 72,4',
      price: '$12',
      arrow: 'up',
      orders: 592,
      delta: '+6',
    },
  ];
  protected readonly graphsRows = signal<GraphRow[]>(
    expand(this.graphsSeed, 25, (r, index) => ({
      ...r,
      name: `${r.name} ${index + 1}`,
    })),
  );
  protected readonly graphs = new DataTable<GraphRow>(
    this.graphsRows,
    (r) => `${r.name} ${r.brand} ${r.price}`,
    (r) => r.name,
    (r, k) =>
      ({
        price: Number(r.price.replaceAll(/[^0-9.]/g, '')),
        orders: r.orders,
      })[k] ?? r.name,
  );

  /** Filled-checkbox inline fill (CSS is shared & must not be edited). */
  protected checkboxFill(isOn: boolean): string | null {
    return isOn ? 'var(--primary)' : null;
  }

  /** Map a status/role string to a badge tone class. */
  protected badgeTone(value: string): string {
    switch (value) {
      case 'active':
      case 'paid':
      case 'publish':
      case 'on track':
      case 'launched':
      case 'resolved': {
        return 'acn-badge-green';
      }
      case 'inactive':
      case 'expired':
      case 'delayed':
      case 'closed':
      case 'urgent': {
        return 'acn-badge-red';
      }
      case 'pending':
      case 'review due':
      case 'at risk':
      case 'high':
      case 'in progress':
      case 'negotiating': {
        return 'acn-badge-amber';
      }
      case 'open':
      case 'medium': {
        return 'acn-badge-sky';
      }
      default: {
        return 'acn-badge-primary';
      }
    }
  }
}
