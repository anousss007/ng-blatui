import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

interface StackBar {
  label: string;
  profit: number;
  income: number;
  expense: number;
}
interface ReportRow {
  label: string;
  value: string;
  icon: string;
  tone: 'teal' | 'orange' | 'amber';
}
interface Visitor {
  label: string;
  percent: string;
  value: string;
  height: number;
  fill: string;
}
interface Product {
  name: string;
  brand: string;
  icon: string;
  value: string;
  delta?: string;
  up?: boolean;
}
interface UserRow {
  name: string;
  email: string;
  avatar: string;
  role: string;
  roleIcon: string;
  plan: string;
  billing: string;
  status: 'active' | 'pending' | 'inactive';
}

/**
 * AdminCN — pixel-faithful clone of the shadcn admin "Finance" dashboard.
 * Inset shell + yearly stacked-bar report, report breakdown, 4 KPI tiles
 * (orders / profit / revenue / impression), visitors split, two product
 * lists, and a users data-table. Reuses the shared acn-* card system.
 */
@Component({
  selector: 'app-tpl-admincn-finance',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Lucide, AdmincnShell],
  templateUrl: './admincn-finance.html',
})
export class AdmincnFinance {
  protected readonly img = '/admincn';

  /* Yearly report — stacked bars (profit teal / income orange / expense amber).
     Raw SVG-unit heights mined from the reference; chart height = 321. */
  protected readonly chartH = 321;
  protected readonly financeBars: StackBar[] = [
    { label: 'Jan', profit: 128.4, income: 0, expense: 0 },
    { label: 'Feb', profit: 128.4, income: 51.36, expense: 0 },
    { label: 'Mar', profit: 115.56, income: 141.24, expense: 0 },
    { label: 'Apr', profit: 77.04, income: 83.46, expense: 0 },
    { label: 'May', profit: 141.24, income: 115.56, expense: 25.68 },
    { label: 'Jun', profit: 96.3, income: 141.24, expense: 83.46 },
    { label: 'Jul', profit: 160.5, income: 44.94, expense: 77.04 },
  ];
  protected readonly chartGrid = [0, 80.25, 160.5, 240.75];

  /* Report breakdown rows */
  protected readonly reportRows: ReportRow[] = [
    { label: 'Total Profit', value: '$48,568.20', icon: 'pie-chart', tone: 'teal' },
    { label: 'Total Income', value: '$38,453.25', icon: 'circle-dollar-sign', tone: 'orange' },
    { label: 'Total Expense', value: '$2,453.45', icon: 'wallet', tone: 'amber' },
  ];

  /* Revenue mini bar chart (desktop teal / mobile light teal pairs) */
  protected readonly revenueBars = [40, 70, 55, 90, 60];

  /* Impression mini line/area chart */
  protected readonly impressionLine = '0,40 18,28 36,34 54,16 72,30 90,10 108,22 120,6';
  protected readonly impressionArea =
    'M0,40 L18,28 L36,34 L54,16 L72,30 L90,10 L108,22 L120,6 L120,48 L0,48 Z';

  /* Visitors split */
  protected readonly visitors: Visitor[] = [
    { label: 'Desktop', percent: '17%', value: '23.8', height: 17, fill: 'var(--chart-1)' },
    {
      label: 'Tablet',
      percent: '65%',
      value: '13.604',
      height: 65,
      fill: 'color-mix(in oklab, var(--chart-1) 20%, transparent)',
    },
    {
      label: 'Mobile',
      percent: '18%',
      value: '47.146',
      height: 18,
      fill: 'color-mix(in oklab, var(--chart-1) 50%, transparent)',
    },
  ];

  /* Top products by sales — placeholder icons for unavailable product images */
  protected readonly salesProducts: Product[] = [
    { name: 'Samsung galaxy S25', brand: 'Samsung', icon: 'message-circle', value: '$32,203' },
    { name: 'Apple MacBook Pro', brand: 'Apple', icon: 'briefcase', value: '$1,299' },
    { name: 'Sony WH-1000XM4', brand: 'Sony', icon: 'message-circle', value: '$348' },
    { name: 'Dell XPS 13', brand: 'Dell', icon: 'briefcase', value: '$999' },
    { name: 'Smart band 4', brand: 'Xiaomi', icon: 'activity', value: '$749' },
  ];

  /* Top products by volume */
  protected readonly volumeProducts: Product[] = [
    {
      name: 'Dell XPS 13',
      brand: 'Dell',
      icon: 'briefcase',
      value: '200k',
      delta: '+5%',
      up: true,
    },
    {
      name: 'Apple iPad',
      brand: 'Apple',
      icon: 'square-kanban',
      value: '80K',
      delta: '+10%',
      up: true,
    },
    {
      name: 'Sony PlayStation 5',
      brand: 'Sony',
      icon: 'square-kanban',
      value: '30k',
      delta: '-20%',
      up: false,
    },
    { name: 'IMac pro', brand: 'Apple', icon: 'briefcase', value: '15k', delta: '+12%', up: true },
    {
      name: 'Samsung galaxy S25',
      brand: 'Samsung',
      icon: 'message-circle',
      value: '12.4k',
      delta: '-15%',
      up: false,
    },
  ];

  /* Users data-table — first 5 rows are the original users (page 1); the rest
     are varied duplicates so pagination is meaningful (25 total). */
  private readonly baseUsers: UserRow[] = [
    {
      name: 'Jack Alfredo',
      email: 'jack.alfredo@shadcnstudio.com',
      avatar: '/admincn/avatars/avatar-1.webp',
      role: 'maintainer',
      roleIcon: 'settings',
      plan: 'enterprise',
      billing: 'Auto debit',
      status: 'active',
    },
    {
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@company.com',
      avatar: '/admincn/avatars/avatar-2.webp',
      role: 'admin',
      roleIcon: 'user-cog',
      plan: 'enterprise',
      billing: 'Auto debit',
      status: 'active',
    },
    {
      name: 'Robert Chen',
      email: 'robert.chen@startup.io',
      avatar: '/admincn/avatars/avatar-3.webp',
      role: 'editor',
      roleIcon: 'palette',
      plan: 'team',
      billing: 'Manual - PayPal',
      status: 'pending',
    },
    {
      name: 'Emily Wilson',
      email: 'emily.wilson@freelance.com',
      avatar: '/admincn/avatars/avatar-4.webp',
      role: 'author',
      roleIcon: 'user-cog',
      plan: 'basic',
      billing: 'Manual - cash',
      status: 'inactive',
    },
    {
      name: 'David Garcia',
      email: 'david.garcia@agency.net',
      avatar: '/admincn/avatars/avatar-5.webp',
      role: 'subscriber',
      roleIcon: 'shield-check',
      plan: 'company',
      billing: 'Auto debit',
      status: 'active',
    },
  ];

  protected readonly allUsers: UserRow[] = this.seedUsers();

  private seedUsers(): UserRow[] {
    const statuses: UserRow['status'][] = ['active', 'pending', 'inactive'];
    const billings = ['Auto debit', 'Manual - PayPal', 'Manual - cash'];
    const rows: UserRow[] = [...this.baseUsers];
    for (let index = rows.length; index < 25; index++) {
      const b = this.baseUsers[index % this.baseUsers.length];
      rows.push({
        ...b,
        name: `${b.name} ${Math.floor(index / this.baseUsers.length) + 1}`,
        email: b.email.replace('@', () => `+${index}@`),
        status: statuses[index % statuses.length],
        billing: billings[index % billings.length],
      });
    }
    return rows;
  }

  /* Table interactivity (signals) ----------------------------------------- */
  protected readonly search = signal('');
  protected readonly roleFilter = signal('all');
  protected readonly planFilter = signal('all');
  protected readonly statusFilter = signal('all');
  protected readonly pageSize = signal(5);
  protected readonly page = signal(1);
  protected readonly sortKey = signal<'name' | 'role' | 'plan' | 'billing' | 'status' | ''>('');
  protected readonly sortDir = signal<'asc' | 'desc'>('asc');
  protected readonly checked = signal<Set<string>>(new Set());

  protected readonly roleOptions = computed(() => [
    'all',
    ...new Set(this.allUsers.map((u) => u.role)),
  ]);
  protected readonly planOptions = computed(() => [
    'all',
    ...new Set(this.allUsers.map((u) => u.plan)),
  ]);
  protected readonly statusOptions = ['all', 'active', 'pending', 'inactive'];

  protected readonly filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    const rf = this.roleFilter();
    const pf = this.planFilter();
    const sf = this.statusFilter();
    let rows = this.allUsers.filter((u) => {
      if (rf !== 'all' && u.role !== rf) return false;
      if (pf !== 'all' && u.plan !== pf) return false;
      if (sf !== 'all' && u.status !== sf) return false;
      if (!q) return true;
      return [u.name, u.email, u.role, u.plan, u.status].join(' ').toLowerCase().includes(q);
    });
    const key = this.sortKey();
    if (key) {
      const direction = this.sortDir() === 'asc' ? 1 : -1;
      // toSorted() requires ES2023 lib; copy-then-sort keeps this non-mutating.
      // eslint-disable-next-line unicorn/no-array-sort
      rows = [...rows].sort((a, b) => a[key].localeCompare(b[key]) * direction);
    }
    return rows;
  });

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

  protected setRole(v: string): void {
    this.roleFilter.set(v);
    this.page.set(1);
  }
  protected setPlan(v: string): void {
    this.planFilter.set(v);
    this.page.set(1);
  }
  protected setStatus(v: string): void {
    this.statusFilter.set(v);
    this.page.set(1);
  }
  protected sortBy(key: 'name' | 'role' | 'plan' | 'billing' | 'status'): void {
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
}
