import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import {
  type BadgeTone,
  BuiAvatar,
  BuiBadge,
  BuiButton,
  BuiCard,
  BuiChart,
  BuiCheckbox,
  BuiIconTile,
  BuiPagination,
  BuiPaginationContent,
  BuiPaginationItem,
  BuiPaginationLink,
  BuiSelect,
  BuiTable,
  BuiTableBody,
  BuiTableCell,
  BuiTableContainer,
  BuiTableHead,
  BuiTableHeader,
  BuiTableRow,
  type IconTileTone,
  type SelectOption,
} from 'ng-blatui';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

/** AdminCN user status → ng-blatui badge tone. */
const STATUS_TONE: Record<UserRow['status'], BadgeTone> = {
  active: 'success',
  pending: 'warning',
  inactive: 'danger',
};

interface Kpi {
  icon: string;
  tile: IconTileTone; // icon-tile tone key, e.g. 'chart-1'
  delta: string;
  up: boolean;
  value: string;
  label: string;
  period: string;
}
interface CampaignRow {
  icon: string;
  tile: IconTileTone;
  label: string;
  value: string;
  rate: string;
}
interface Plan {
  label: string;
  price: string;
  /** numeric price for total computation */
  amount: number;
  checked: boolean;
}
interface Condition {
  pct: number; // 0..100 ring fill
  display: string;
  color: string; // donut ring colour, e.g. 'var(--chart-1)'
  label: string;
  sub: string;
  delta: string;
}
interface UserRow {
  avatar: string;
  user: string;
  email: string;
  roleIcon: string;
  roleColor: string;
  role: string;
  plan: string;
  billing: string;
  status: 'active' | 'pending' | 'inactive';
}

/**
 * AdminCN — pixel-faithful clone of the shadcn admin "Campaign" dashboard.
 * Inset shell + KPI strip, Customers card, Total Income area chart + Report,
 * Monthly campaign state, Total earning bar chart, For Business Shark plan
 * selector, Vehicles Condition rings and a filterable users table.
 */
@Component({
  selector: 'app-tpl-admincn-campaign',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    Lucide,
    AdmincnShell,
    BuiCard,
    BuiIconTile,
    BuiBadge,
    BuiButton,
    BuiChart,
    BuiAvatar,
    BuiCheckbox,
    BuiSelect,
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
  ],
  templateUrl: './admincn-campaign.html',
  host: { '(document:click)': 'closeMenus()' },
})
export class AdmincnCampaign {
  protected readonly img = '/admincn';

  /* KPI strip ------------------------------------------------------------- */
  protected readonly kpis: Kpi[] = [
    {
      icon: 'ticket',
      tile: 'chart-1',
      delta: '+38%',
      up: true,
      value: '$13.4k',
      label: 'Total Sales',
      period: 'Last 6 months',
    },
    {
      icon: 'shopping-cart',
      tile: 'chart-2',
      delta: '+22%',
      up: true,
      value: '155K',
      label: 'Total Orders',
      period: 'Last 4 months',
    },
    {
      icon: 'dollar-sign',
      tile: 'chart-3',
      delta: '-16%',
      up: false,
      value: '$89.34k',
      label: 'Total Profit',
      period: 'Last One year',
    },
    {
      icon: 'book-open',
      tile: 'chart-4',
      delta: '+38%',
      up: true,
      value: '$1,200',
      label: 'Bookmarks',
      period: 'Last 6 months',
    },
  ];

  /* Total Income area chart ---------------------------------------------- */
  // y-values from the original 266-tall viewBox inverted to data magnitudes
  // (flat pairs + a final rise give the stepped weekly income profile).
  protected readonly incomeSeries = [
    { data: [131.62, 131.62, 211.8, 211.8, 169.6, 169.6, 250.624], color: 'var(--chart-2)' },
  ];
  protected readonly incomeDays = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
  protected readonly incomeAxis = ['$6k', '$5k', '$4k', '$3k', '$2k', '$1k'];

  /* Report ---------------------------------------------------------------- */
  protected readonly report = [
    { icon: 'wallet', color: 'chart-2', label: 'Income', value: '$5,550' },
    { icon: 'credit-card', color: 'chart-1', label: 'Expense', value: '$3,520' },
    { icon: 'circle-dollar-sign', color: 'chart-5', label: 'Profit', value: '$2,350' },
  ];

  /* Monthly campaign state ------------------------------------------------ */
  protected readonly campaign: CampaignRow[] = [
    { icon: 'mail', tile: 'chart-1', label: 'Emails', value: '14,250', rate: '0.3%' },
    { icon: 'mail', tile: 'chart-2', label: 'Opened', value: '4,523', rate: '3.1%' },
    { icon: 'target', tile: 'chart-4', label: 'Clicked', value: '1,250', rate: '1.3%' },
    { icon: 'bell', tile: 'chart-3', label: 'Subscribed', value: '750', rate: '9.8%' },
    { icon: 'triangle-alert', tile: 'chart-5', label: 'Errors', value: '20', rate: '1.5%' },
    { icon: 'circle', tile: 'primary', label: 'Unsubscribed', value: '86', rate: '0.6%' },
  ];

  /* Total earning stacked bar chart -------------------------------------- */
  // Original diverging bars (baseline y=88.5 of a 177-tall vbox): chart-3 below
  // the baseline, chart-5 (amber) above. As a bottom-up stack the lower segment
  // is chart-3 (the original downward height) and the upper is chart-5.
  protected readonly earnSeries = [
    { data: [62.54, 50.74, 83.81, 50.74, 64.9, 64.9, 35.4, 64.9], color: 'var(--chart-3)' },
    { data: [61.36, 46.02, 68.44, 61.36, 34.22, 73.16, 79.12, 28.32], color: 'var(--chart-5)' },
  ];

  /* For Business Shark — plan selector ------------------------------------ */
  protected readonly taxes = 32;
  protected readonly plans = signal<Plan[]>([
    { label: 'Branding', price: '$60', amount: 60, checked: false },
    { label: 'Marketing', price: '$120', amount: 120, checked: true },
    { label: 'Web Development', price: '$250', amount: 250, checked: false },
    { label: 'App Development', price: '$320', amount: 320, checked: false },
  ]);
  /** Total = checked plan prices + flat taxes. */
  protected readonly planTotal = computed(() => {
    const subtotal = this.plans()
      .filter((plan) => plan.checked)
      .reduce((sum, plan) => sum + plan.amount, 0);
    return subtotal + this.taxes;
  });
  protected togglePlan(label: string): void {
    this.plans.update((list) =>
      list.map((plan) => (plan.label === label ? { ...plan, checked: !plan.checked } : plan)),
    );
  }

  /* Per-card ellipsis menus ----------------------------------------------- */
  protected readonly openMenu = signal<string | null>(null);
  protected toggleMenu(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenu.update((current) => (current === id ? null : id));
  }
  protected closeMenus(): void {
    this.openMenu.set(null);
  }

  /* Vehicles Condition donut rings --------------------------------------- */
  protected readonly conditions: Condition[] = [
    {
      pct: 55,
      display: '55%',
      color: 'var(--chart-1)',
      label: 'Excellent',
      sub: '12% increase',
      delta: '+25%',
    },
    {
      pct: 20,
      display: '20%',
      color: 'var(--chart-2)',
      label: 'Good',
      sub: '24 vehicles',
      delta: '+30%',
    },
    {
      pct: 12,
      display: '12%',
      color: 'var(--chart-3)',
      label: 'Average',
      sub: '182 Tasks',
      delta: '-15%',
    },
    {
      pct: 7,
      display: '7%',
      color: 'var(--chart-4)',
      label: 'Bad',
      sub: '9 vehicles',
      delta: '+35%',
    },
    {
      pct: 4,
      display: '4%',
      color: 'var(--chart-5)',
      label: 'Not Working',
      sub: '3 vehicles',
      delta: '-2%',
    },
    {
      pct: 2,
      display: '2%',
      color: 'var(--primary)',
      label: 'Scraped',
      sub: '2 vehicles',
      delta: '+1%',
    },
  ];

  /* Users table ----------------------------------------------------------- */
  protected readonly users: UserRow[] = [
    {
      avatar: '/admincn/avatars/avatar-1.webp',
      user: 'Jack Alfredo',
      email: 'jack.alfredo@shadcnstudio.com',
      roleIcon: 'pencil',
      roleColor: 'text-chart-3',
      role: 'maintainer',
      plan: 'enterprise',
      billing: 'Auto debit',
      status: 'active',
    },
    {
      avatar: '/admincn/avatars/avatar-2.webp',
      user: 'Sarah Mitchell',
      email: 'sarah.mitchell@company.com',
      roleIcon: 'user',
      roleColor: 'text-green-600 dark:text-green-400',
      role: 'admin',
      plan: 'enterprise',
      billing: 'Auto debit',
      status: 'active',
    },
    {
      avatar: '/admincn/avatars/avatar-3.webp',
      user: 'Robert Chen',
      email: 'robert.chen@startup.io',
      roleIcon: 'pen-tool',
      roleColor: 'text-chart-2',
      role: 'editor',
      plan: 'team',
      billing: 'Manual - PayPal',
      status: 'pending',
    },
    {
      avatar: '/admincn/avatars/avatar-4.webp',
      user: 'Emily Wilson',
      email: 'emily.wilson@freelance.com',
      roleIcon: 'pen-line',
      roleColor: 'text-chart-1',
      role: 'author',
      plan: 'basic',
      billing: 'Manual - cash',
      status: 'inactive',
    },
    {
      avatar: '/admincn/avatars/avatar-5.webp',
      user: 'David Garcia',
      email: 'david.garcia@agency.net',
      roleIcon: 'crown',
      roleColor: 'text-chart-5',
      role: 'subscriber',
      plan: 'company',
      billing: 'Auto debit',
      status: 'active',
    },
  ];

  protected statusTone(status: UserRow['status']): BadgeTone {
    return STATUS_TONE[status];
  }

  /* Filters (display-only) ------------------------------------------------- */
  protected readonly roleOptions: SelectOption[] = [
    { value: 'all', label: 'All' },
    { value: 'admin', label: 'Admin' },
    { value: 'author', label: 'Author' },
    { value: 'editor', label: 'Editor' },
    { value: 'maintainer', label: 'Maintainer' },
    { value: 'subscriber', label: 'Subscriber' },
  ];
  protected readonly planOptions: SelectOption[] = [
    { value: 'all', label: 'All' },
    { value: 'basic', label: 'Basic' },
    { value: 'team', label: 'Team' },
    { value: 'company', label: 'Company' },
    { value: 'enterprise', label: 'Enterprise' },
  ];
  protected readonly statusOptions: SelectOption[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'inactive', label: 'Inactive' },
  ];
  protected readonly role = signal('all');
  protected readonly plan = signal('all');
  protected readonly statusFilter = signal('all');

  /* Table selection + pagination (display-only) --------------------------- */
  protected readonly page = signal(1);
  protected goTo(p: number): void {
    this.page.set(p);
  }

  private readonly checked = signal<Set<string>>(new Set());
  protected isChecked(email: string): boolean {
    return this.checked().has(email);
  }
  protected toggleRow(email: string): void {
    const set = new Set(this.checked());
    if (set.has(email)) set.delete(email);
    else set.add(email);
    this.checked.set(set);
  }
  protected readonly allChecked = computed(
    () => this.users.length > 0 && this.users.every((u) => this.checked().has(u.email)),
  );
  protected toggleAll(): void {
    const set = new Set(this.checked());
    if (this.allChecked()) for (const u of this.users) set.delete(u.email);
    else for (const u of this.users) set.add(u.email);
    this.checked.set(set);
  }
}
