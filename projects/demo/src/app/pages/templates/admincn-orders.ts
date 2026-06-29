import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

interface Kpi {
  icon: string;
  value: string;
  label: string;
  delta: string;
  deltaTone: 'up' | 'down';
}
interface Metric {
  icon: string;
  tile: 'teal' | 'amber' | 'orange' | 'muted';
  label: string;
  value: string;
}
interface Earning {
  logo: string;
  name: string;
  tech: string;
  amount: string;
  progress: number;
}
interface OrderRow {
  name: string;
  email: string;
  avatar: string;
  amount: string;
  status: string;
  card: string;
}

/**
 * AdminCN — pixel-faithful clone of the shadcn admin "Orders" dashboard.
 * Inset sidebar layout (shared shell) + 3 KPI cards + product-insight/earning
 * column + sales-metrics/revenue-goal/sales-plan block + orders table.
 */
@Component({
  selector: 'app-tpl-admincn-orders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Lucide, AdmincnShell],
  templateUrl: './admincn-orders.html',
})
export class AdmincnOrders {
  protected readonly img = '/admincn';

  /* Top KPI cards --------------------------------------------------------- */
  protected readonly kpis: Kpi[] = [
    { icon: 'truck', value: '42', label: 'Shipped Orders', delta: '+18.2%', deltaTone: 'up' },
    {
      icon: 'triangle-alert',
      value: '8',
      label: 'Damaged Returns',
      delta: '-8.7%',
      deltaTone: 'down',
    },
    {
      icon: 'calendar',
      value: '27',
      label: 'Missed Delivery Slots',
      delta: '+4.3%',
      deltaTone: 'up',
    },
  ];

  /* Product insight mini bar charts --------------------------------------- */
  protected readonly reachBars = [40, 64, 52, 78, 96];
  protected readonly placedBars = [30, 48, 38, 60, 44];

  /* Total Earning rows ---------------------------------------------------- */
  protected readonly earnings: Earning[] = [
    {
      logo: '/admincn/avatars/avatar-16.webp',
      name: 'Zipcar',
      tech: 'Vuejs & HTML',
      amount: '-$23,569.26',
      progress: 75,
    },
    {
      logo: '/admincn/avatars/avatar-6.webp',
      name: 'Bitbank',
      tech: 'Figma & React',
      amount: '-$12,650.31',
      progress: 50,
    },
  ];

  /* Sales metrics 4 boxes ------------------------------------------------- */
  protected readonly metrics: Metric[] = [
    { icon: 'trending-up', tile: 'teal', label: 'Sales trend', value: '$11,548' },
    { icon: 'pie-chart', tile: 'amber', label: 'Discount offers', value: '$1,326' },
    { icon: 'dollar-sign', tile: 'orange', label: 'Net profit', value: '$17,356' },
    { icon: 'shopping-bag', tile: 'muted', label: 'Total orders', value: '248' },
  ];

  /* Revenue goal radial (multi-segment donut) ----------------------------- */
  // Three stacked arcs over a faint track. Values are percent of circle.
  protected readonly revenueArcs = [
    { pct: 30, color: 'var(--primary)' },
    { pct: 16, color: 'color-mix(in oklab, var(--primary) 60%, transparent)' },
    { pct: 10, color: 'color-mix(in oklab, var(--primary) 20%, transparent)' },
  ];

  /* Cohort analysis indicator bars ---------------------------------------- */
  // First ~16 of 26 filled (primary), the rest muted.
  protected readonly cohortBars = Array.from({ length: 26 }, (_, index) => ({
    h: [
      22, 30, 18, 34, 26, 38, 24, 32, 20, 36, 28, 34, 22, 30, 26, 32, 18, 24, 20, 28, 22, 30, 18,
      26, 22, 16,
    ][index],
    on: index < 16,
  }));

  /* Orders table — first 5 rows are the original customers (page 1); the rest
     are varied duplicates so pagination is meaningful (25 total). */
  private readonly baseOrders: OrderRow[] = [
    {
      name: 'Jack Alfredo',
      email: 'jack@shadcnstudio.com',
      avatar: '/admincn/avatars/avatar-1.webp',
      amount: '$316.00',
      status: 'paid',
      card: '/admincn/widgets/master-card.webp',
    },
    {
      name: 'Maria Gonzalez',
      email: 'maria.g@shadcnstudio.com',
      avatar: '/admincn/avatars/avatar-2.webp',
      amount: '$253.40',
      status: 'pending',
      card: '/admincn/widgets/visa.webp',
    },
    {
      name: 'John Doe',
      email: 'john.doe@shadcnstudio.com',
      avatar: '/admincn/avatars/avatar-3.webp',
      amount: '$852.00',
      status: 'paid',
      card: '/admincn/widgets/master-card.webp',
    },
    {
      name: 'Emily Carter',
      email: 'emily.carter@shadcnstudio.com',
      avatar: '/admincn/avatars/avatar-4.webp',
      amount: '$889.00',
      status: 'pending',
      card: '/admincn/widgets/visa.webp',
    },
    {
      name: 'David Lee',
      email: 'david.lee@shadcnstudio.com',
      avatar: '/admincn/avatars/avatar-5.webp',
      amount: '$723.16',
      status: 'paid',
      card: '/admincn/widgets/master-card.webp',
    },
  ];

  protected readonly allOrders: OrderRow[] = this.seedOrders();

  private seedOrders(): OrderRow[] {
    const rows: OrderRow[] = [...this.baseOrders];
    for (let index = rows.length; index < 25; index++) {
      const b = this.baseOrders[index % this.baseOrders.length];
      rows.push({
        ...b,
        email: b.email.replace('@', () => `+${index}@`),
        amount: `$${200 + ((index * 71) % 800)}.00`,
        status: index % 2 === 0 ? 'paid' : 'pending',
      });
    }
    return rows;
  }

  /* Table interactivity (signals) ----------------------------------------- */
  protected readonly search = signal('');
  protected readonly statusFilter = signal('all');
  protected readonly pageSize = signal(5);
  protected readonly page = signal(1);
  protected readonly sortKey = signal<'name' | 'amount' | 'status' | ''>('');
  protected readonly sortDir = signal<'asc' | 'desc'>('asc');
  protected readonly checked = signal<Set<string>>(new Set());

  protected readonly statusOptions = ['all', 'paid', 'pending'];
  protected readonly pageSizeOptions = [5, 10, 25];

  protected readonly filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    const sf = this.statusFilter();
    let rows = this.allOrders.filter((o) => {
      if (sf !== 'all' && o.status !== sf) return false;
      if (!q) return true;
      return [o.name, o.email, o.amount, o.status].join(' ').toLowerCase().includes(q);
    });
    const key = this.sortKey();
    if (key) {
      const direction = this.sortDir() === 'asc' ? 1 : -1;
      // toSorted() requires ES2023 lib; copy-then-sort keeps this non-mutating.
      // eslint-disable-next-line unicorn/no-array-sort
      rows = [...rows].sort((a, b) => {
        if (key === 'amount') {
          return (this.num(a.amount) - this.num(b.amount)) * direction;
        }
        return a[key].localeCompare(b[key]) * direction;
      });
    }
    return rows;
  });
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

  protected onSearch(v: string): void {
    this.search.set(v);
    this.page.set(1);
  }
  protected setStatus(v: string): void {
    this.statusFilter.set(v);
    this.page.set(1);
  }
  protected setPageSize(v: number): void {
    this.pageSize.set(v);
    this.page.set(1);
  }
  protected sortBy(key: 'name' | 'amount' | 'status'): void {
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
    return rows.length > 0 && rows.every((r) => this.checked().has(r.email));
  });
  protected toggleAll(): void {
    const set = new Set(this.checked());
    const rows = this.pageRows();
    if (this.allChecked()) for (const r of rows) set.delete(r.email);
    else for (const r of rows) set.add(r.email);
    this.checked.set(set);
  }

  /** Cumulative dash-offset start for stacked radial arcs (circumference 251.3). */
  protected arcOffset(index: number): number {
    let accumulator = 0;
    for (let index_ = 0; index_ < index; index_++) accumulator += this.revenueArcs[index_].pct;
    return -(accumulator / 100) * 251.3;
  }
  protected arcDash(pct: number): string {
    return `${(pct / 100) * 251.3} 251.3`;
  }
}
