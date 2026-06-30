import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import {
  BuiAvatar,
  BuiBadge,
  BuiButton,
  BuiCard,
  BuiChart,
  BuiCheckbox,
  BuiIconTile,
  BuiPagination,
  BuiPaginationContent,
  BuiPaginationEllipsis,
  BuiPaginationItem,
  BuiPaginationLink,
  BuiTable,
  BuiTableBody,
  BuiTableCell,
  BuiTableContainer,
  BuiTableHead,
  BuiTableHeader,
  BuiTableRow,
} from 'ng-blatui';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

/** AdminCN status tone → ng-blatui semantic tone for the round status badge. */
const STATUS_TONE = { green: 'success', amber: 'warning', sky: 'info' } as const;

interface NavItem {
  label: string;
  icon: string;
  active?: boolean;
  chevron?: boolean;
  external?: boolean;
}
interface NavGroup {
  label: string;
  items: NavItem[];
}
interface Bar {
  label: string;
  value: number;
  display: string;
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

/**
 * AdminCN — pixel-faithful clone of the shadcn admin "Sales" dashboard.
 * Inset sidebar layout + topbar + 6 KPI cards + charts + earning/plan/course
 * cards + invoice table. Light mode, Geist font, responsive to mobile.
 */
@Component({
  selector: 'app-tpl-admincn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    Lucide,
    AdmincnShell,
    BuiCard,
    BuiIconTile,
    BuiBadge,
    BuiChart,
    BuiAvatar,
    BuiButton,
    BuiCheckbox,
    BuiTableContainer,
    BuiTable,
    BuiTableHeader,
    BuiTableBody,
    BuiTableRow,
    BuiTableHead,
    BuiTableCell,
    BuiPagination,
    BuiPaginationContent,
    BuiPaginationItem,
    BuiPaginationLink,
    BuiPaginationEllipsis,
  ],
  templateUrl: './admincn.html',
  styleUrl: './admincn.css',
})
export class AdmincnTemplate {
  protected readonly img = '/admincn';
  protected readonly statusTone = STATUS_TONE;

  protected readonly nav: NavGroup[] = [
    {
      label: 'Dashboard',
      items: [
        { label: 'Sales', icon: 'trending-up', active: true },
        { label: 'Finance', icon: 'wallet' },
        { label: 'Logistics', icon: 'truck' },
        { label: 'Productivity', icon: 'briefcase' },
        { label: 'Campaign', icon: 'megaphone' },
        { label: 'Analytics', icon: 'chart-column' },
        { label: 'Payments', icon: 'credit-card' },
        { label: 'eCommerce', icon: 'shopping-cart' },
        { label: 'Orders', icon: 'package' },
      ],
    },
    {
      label: 'Apps',
      items: [
        { label: 'Mail', icon: 'mail' },
        { label: 'Chat', icon: 'message-circle' },
        { label: 'Kanban', icon: 'square-kanban' },
        { label: 'Calendar', icon: 'calendar' },
        { label: 'Contact', icon: 'contact-round' },
        { label: 'Users', icon: 'users', chevron: true },
        { label: 'Roles & Permissions', icon: 'shield-check', chevron: true },
        { label: 'PropXYZ', icon: 'map-pin', external: true },
      ],
    },
    {
      label: 'Pages',
      items: [
        { label: 'Landing Page', icon: 'rocket', external: true },
        { label: 'User Settings', icon: 'user-cog', chevron: true },
      ],
    },
  ];

  /* KPI mini-chart datasets ------------------------------------------------ */
  // Card 1 — Total Profit: stacked amber (body) + teal cap per bar.
  protected readonly profitBars = [
    { amber: 30, teal: 8 },
    { amber: 41, teal: 9 },
    { amber: 22, teal: 7 },
    { amber: 36, teal: 8 },
    { amber: 45, teal: 10 },
  ];
  // Card 1 — Total Profit: stacked amber (body) + teal (cap) per bar.
  protected readonly profitSeries = [
    { data: this.profitBars.map((b) => b.amber), color: 'var(--chart-4)' },
    { data: this.profitBars.map((b) => b.teal), color: 'var(--chart-2)' },
  ];
  // Card 2 — Order: orange bars over a faint full-height track.
  protected readonly orderBars = [62, 90, 74, 96, 58, 80, 70];
  protected readonly orderSeries = [{ data: this.orderBars, color: 'var(--chart-1)' }];
  // Card 3 — Profit: teal line + dots (data inverted from the original 56-tall viewBox).
  protected readonly profitSparkSeries = [
    { data: [8, 34, 20, 48, 32, 58, 70], color: 'var(--chart-2)' },
  ];
  // Card 4 — User reach donut: amber arc, ~62% sweep.
  protected readonly donutDash = 62; // percent filled

  /* Total Transaction bar chart ------------------------------------------- */
  protected readonly txBars: Bar[] = [
    { label: 'Jan', value: 38, display: '38K' },
    { label: 'Feb', value: 52, display: '52K' },
    { label: 'Mar', value: 32, display: '32K' },
    { label: 'Apr', value: 12, display: '12K' },
    { label: 'May', value: 35, display: '35K' },
    { label: 'Jun', value: 28, display: '28K' },
    { label: 'Jul', value: 33, display: '33K' },
    { label: 'Aug', value: 25, display: '25K' },
  ];
  protected readonly txHighlight = 'Feb';
  protected readonly txMax = 60;
  protected readonly txSeries = [
    { data: this.txBars.map((b) => b.value), color: 'var(--chart-2)' },
  ];
  protected readonly txDisplays = this.txBars.map((b) => b.display);
  protected readonly txAxis = this.txBars.map((b) => b.label);
  protected readonly txActive = this.txBars.findIndex((b) => b.label === this.txHighlight);

  /* Total sales area chart ------------------------------------------------- */
  // y-values from the original 130-tall viewBox inverted to data magnitudes
  // (flat pairs + diagonal connectors give the characteristic stepped profile).
  protected readonly salesSeries = [
    {
      data: [55.44, 55.44, 90.72, 90.72, 68.67, 68.67, 39.06, 39.06, 90.72, 90.72, 126, 126],
      color: 'var(--chart-2)',
    },
  ];
  protected readonly salesTimes = ['11:00', '14:00', '17:00', '20:00'];

  /* Earning Report bar chart ---------------------------------------------- */
  protected readonly earnBars: Bar[] = [
    { label: 'Mo', value: 48, display: '' },
    { label: 'Tu', value: 127, display: '' },
    { label: 'We', value: 94, display: '' },
    { label: 'Th', value: 153, display: '' },
    { label: 'Fr', value: 70, display: '' },
    { label: 'Sa', value: 58, display: '' },
    { label: 'Su', value: 112, display: '' },
  ];
  protected readonly earnHighlight = 'Th';
  protected readonly earnMax = 165;
  protected readonly earnSeries = [
    { data: this.earnBars.map((b) => b.value), color: 'var(--chart-2)' },
  ];
  protected readonly earnAxis = this.earnBars.map((b) => b.label);
  protected readonly earnActive = this.earnBars.findIndex((b) => b.label === this.earnHighlight);

  /* Invoice table --------------------------------------------------------- */
  // First 5 rows are the originally-shown invoices (page 1); the remaining 20
  // are varied duplicates so pagination is meaningful (25 total entries).
  private readonly baseInvoices: Invoice[] = [
    {
      id: '#5099',
      statusIcon: 'mail',
      statusTone: 'green',
      name: 'Jack Alfredo',
      role: 'UI/UX designer',
      avatar: '/admincn/avatars/avatar-1.webp',
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
      avatar: '/admincn/avatars/avatar-2.webp',
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
      avatar: '/admincn/avatars/avatar-3.webp',
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
      avatar: '/admincn/avatars/avatar-4.webp',
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
      avatar: '/admincn/avatars/avatar-5.webp',
      total: '$3,120.00',
      date: '07 Aug 2025',
      paid: true,
    },
  ];

  protected readonly allInvoices: Invoice[] = this.seedInvoices();

  private seedInvoices(): Invoice[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const rows: Invoice[] = [...this.baseInvoices];
    for (let index = rows.length; index < 25; index++) {
      const b = this.baseInvoices[index % this.baseInvoices.length];
      const day = ((index * 3) % 28) + 1;
      const isPaid = index % 3 !== 0;
      rows.push({
        ...b,
        id: `#${4300 + index * 17}`,
        total: '$' + (1000 + ((index * 137) % 4000)).toLocaleString() + '.00',
        date: String(day).padStart(2, '0') + ' ' + months[index % months.length] + ' 2025',
        paid: isPaid,
        balance: isPaid ? undefined : `-$${((index * 23) % 90) + 10}.00`,
      });
    }
    return rows;
  }

  /* Table interactivity (signals) ----------------------------------------- */
  protected readonly search = signal('');
  protected readonly statusFilter = signal<'all' | 'paid' | 'unpaid'>('all');
  protected readonly pageSize = signal(5);
  protected readonly page = signal(1);
  protected readonly sortKey = signal<'id' | 'name' | 'total' | 'date' | 'status' | ''>('');
  protected readonly sortDir = signal<'asc' | 'desc'>('asc');
  protected readonly checked = signal<Set<string>>(new Set());

  protected readonly statusOptions = ['all', 'paid', 'unpaid'] as const;
  protected readonly pageSizeOptions = [5, 10, 25];

  protected readonly filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    const sf = this.statusFilter();
    let rows = this.allInvoices.filter((inv) => {
      if (sf === 'paid' && !inv.paid) return false;
      if (sf === 'unpaid' && inv.paid) return false;
      if (!q) return true;
      const status = inv.paid ? 'paid' : 'unpaid';
      return [inv.id, inv.name, inv.role, inv.total, status].join(' ').toLowerCase().includes(q);
    });
    const key = this.sortKey();
    if (key) {
      const direction = this.sortDir() === 'asc' ? 1 : -1;
      // toSorted() requires ES2023 lib; copy-then-sort keeps this non-mutating.
      // eslint-disable-next-line unicorn/no-array-sort
      rows = [...rows].sort((a, b) => this.cmp(a, b, key) * direction);
    }
    return rows;
  });

  private cmp(a: Invoice, b: Invoice, key: 'id' | 'name' | 'total' | 'date' | 'status'): number {
    if (key === 'total') {
      return this.num(a.total) - this.num(b.total);
    }
    if (key === 'status') {
      return Number(a.paid) - Number(b.paid);
    }
    if (key === 'date') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return a[key].localeCompare(b[key]);
  }
  private num(s: string): number {
    return Number(s.replaceAll(/[^0-9.-]/g, '')) || 0;
  }

  protected readonly total = computed(() => this.filtered().length);
  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.total() / this.pageSize())),
  );
  protected readonly currentPage = computed(() => Math.min(this.page(), this.totalPages()));
  protected readonly pageRows = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });
  protected readonly rangeStart = computed(() =>
    this.total() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1,
  );
  protected readonly rangeEnd = computed(() =>
    Math.min(this.currentPage() * this.pageSize(), this.total()),
  );
  protected readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );

  protected onSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }
  protected setStatus(value: 'all' | 'paid' | 'unpaid'): void {
    this.statusFilter.set(value);
    this.page.set(1);
  }
  protected setPageSize(value: number): void {
    this.pageSize.set(value);
    this.page.set(1);
  }
  protected sortBy(key: 'id' | 'name' | 'total' | 'date' | 'status'): void {
    if (this.sortKey() === key) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
  }
  protected goTo(p: number): void {
    this.page.set(Math.min(Math.max(1, p), this.totalPages()));
  }
  protected prev(): void {
    this.goTo(this.currentPage() - 1);
  }
  protected next(): void {
    this.goTo(this.currentPage() + 1);
  }
  protected toggleRow(id: string): void {
    const set = new Set(this.checked());
    if (set.has(id)) set.delete(id);
    else set.add(id);
    this.checked.set(set);
  }
  protected isChecked(id: string): boolean {
    return this.checked().has(id);
  }
  protected readonly allChecked = computed(() => {
    const rows = this.pageRows();
    return rows.length > 0 && rows.every((r) => this.checked().has(r.id));
  });
  protected toggleAll(): void {
    const set = new Set(this.checked());
    const rows = this.pageRows();
    if (this.allChecked()) for (const r of rows) set.delete(r.id);
    else for (const r of rows) set.add(r.id);
    this.checked.set(set);
  }
}
