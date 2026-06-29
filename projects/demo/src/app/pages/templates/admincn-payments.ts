import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

interface PayHistory {
  /** masked card label incl. leading asterisks, e.g. "*5688" or "**5688" */
  card: string;
  type: string;
  logo?: string;
  icon?: string;
  date: string;
  spend: string;
  balance: string;
}
interface CountrySale {
  amount: string;
  country: string;
  pct: string;
  up: boolean;
  tone: 'red' | 'amber' | 'teal' | 'orange' | 'green';
  initial: string;
}
interface Txn {
  label: string;
  sub: string;
  icon: string;
  tone: 'teal' | 'amber' | 'orange' | 'muted';
  amount: string;
  positive: boolean;
}
interface Earning {
  name: string;
  sub: string;
  amount: string;
  width: number;
  initial: string;
  tone: 'teal' | 'amber' | 'orange';
}
interface RevBar {
  label: string;
  y2024: number;
  y2023: number;
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
 * AdminCN — pixel-faithful clone of the shadcn admin "Payments" dashboard.
 * Inset sidebar shell + 3 KPI cards (income/expense/orders), payment-history
 * table, total-revenue bar chart with growth gauge, sales-by-countries list,
 * transactions list, total-earning list and the invoice table.
 */
@Component({
  selector: 'app-tpl-admincn-payments',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Lucide, AdmincnShell],
  templateUrl: './admincn-payments.html',
})
export class AdmincnPayments {
  protected readonly img = '/admincn';

  /* KPI mini area charts (income teal, expense amber) ---------------------- */
  protected readonly incomeArea =
    'M0,40 L20,30 L40,34 L60,18 L80,26 L100,12 L120,20 L140,8 L160,16';
  protected readonly expenseArea =
    'M0,18 L20,26 L40,14 L60,24 L80,16 L100,30 L120,22 L140,34 L160,24';

  /* Payment History -------------------------------------------------------- */
  protected readonly payments: PayHistory[] = [
    {
      card: '*5688',
      type: 'Credit Card',
      logo: '/admincn/widgets/master-card.webp',
      date: '05/Jan',
      spend: '-$2,820',
      balance: '$10,020',
    },
    {
      card: '*8562',
      type: 'Debit Card',
      logo: '/admincn/widgets/visa.webp',
      date: '15/Feb',
      spend: '-$1,450',
      balance: '$8,570',
    },
    {
      card: '*5238',
      type: 'ATM card',
      icon: 'credit-card',
      date: '20/Mar',
      spend: '-$500',
      balance: '$7,070',
    },
    {
      card: '*8562',
      type: 'Debit card',
      logo: '/admincn/widgets/visa.webp',
      date: '10/Mar',
      spend: '-$750',
      balance: '$5,120',
    },
    {
      card: '**5688',
      type: 'Credit Card',
      logo: '/admincn/widgets/master-card.webp',
      date: '25/May',
      spend: '-$1,200',
      balance: '$5,870',
    },
  ];

  /* Total Revenue grouped bar chart (2024 dark, 2023 muted) ---------------- */
  protected readonly revBars: RevBar[] = [
    { label: 'Jan', y2024: 24, y2023: 14 },
    { label: 'Feb', y2024: 28, y2023: 12 },
    { label: 'Mar', y2024: 20, y2023: 16 },
    { label: 'Apr', y2024: 30, y2023: 18 },
    { label: 'May', y2024: 22, y2023: 10 },
    { label: 'Jun', y2024: 26, y2023: 15 },
    { label: 'Jul', y2024: 30, y2023: 13 },
  ];
  protected readonly revYAxis = ['30', '20', '10', '0', '-10', '-20'];
  protected readonly revMax = 32;

  /* Report growth gauge (78% of a 180° arc) -------------------------------- */
  protected readonly gaugePct = 78;
  // semicircle path length used for stroke-dasharray (r = 80, half-circle).
  protected readonly gaugeLen = Math.PI * 80;

  /* Sales by countries ----------------------------------------------------- */
  protected readonly countries: CountrySale[] = [
    { amount: '$867k', country: 'Austria', pct: '20.3%', up: true, tone: 'red', initial: 'AT' },
    { amount: '$1.2M', country: 'China', pct: '15.7%', up: true, tone: 'amber', initial: 'CN' },
    {
      amount: '$750k',
      country: 'Switzerland',
      pct: '18.2%',
      up: false,
      tone: 'teal',
      initial: 'CH',
    },
    { amount: '$1.5M', country: 'India', pct: '22.1%', up: true, tone: 'orange', initial: 'IN' },
    { amount: '$980k', country: 'Brazil', pct: '19.6%', up: false, tone: 'green', initial: 'BR' },
  ];

  /* Transactions ----------------------------------------------------------- */
  protected readonly txns: Txn[] = [
    {
      label: 'Credit Card',
      sub: 'Digital Ocean',
      icon: 'credit-card',
      tone: 'muted',
      amount: '-$2820',
      positive: false,
    },
    {
      label: 'Bank account',
      sub: 'Received money',
      icon: 'building-2',
      tone: 'teal',
      amount: '+$1,260',
      positive: true,
    },
    {
      label: 'Credit Card',
      sub: 'Netflix',
      icon: 'credit-card',
      tone: 'muted',
      amount: '-$149',
      positive: false,
    },
    {
      label: 'Wallet',
      sub: 'Starbucks',
      icon: 'wallet',
      tone: 'amber',
      amount: '-$49',
      positive: false,
    },
    {
      label: 'Bank account',
      sub: 'Received money',
      icon: 'building-2',
      tone: 'teal',
      amount: '+$268',
      positive: true,
    },
  ];

  /* Total Earning ---------------------------------------------------------- */
  protected readonly earnings: Earning[] = [
    {
      name: 'Zipcar',
      sub: 'Vuejs & HTML',
      amount: '-$23,569.26',
      width: 75,
      initial: 'Z',
      tone: 'teal',
    },
    {
      name: 'Bitbank',
      sub: 'Figma & React',
      amount: '-$12,650.31',
      width: 25,
      initial: 'B',
      tone: 'amber',
    },
    {
      name: 'Aviato',
      sub: 'HTML & Angular',
      amount: '-$55,699.50',
      width: 50,
      initial: 'A',
      tone: 'orange',
    },
  ];

  /* Invoice table — first 5 rows are the original invoices (page 1); the rest
     are varied duplicates so pagination is meaningful (25 total). */
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

  protected barH(value: number, max: number): number {
    return Math.round((value / max) * 1000) / 10;
  }
}
