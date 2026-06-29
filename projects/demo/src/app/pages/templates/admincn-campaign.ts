import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

interface Kpi {
  icon: string;
  tile: string; // text/bg chart colour key, e.g. 'chart-1'
  delta: string;
  up: boolean;
  value: string;
  label: string;
  period: string;
}
interface CampaignRow {
  icon: string;
  tile: string;
  label: string;
  value: string;
  rate: string;
}
interface Plan {
  label: string;
  price: string;
  checked: boolean;
}
interface Condition {
  pct: number; // 0..100 ring fill
  display: string;
  ring: string; // stroke-* class
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
  imports: [Lucide, AdmincnShell],
  templateUrl: './admincn-campaign.html',
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
  protected readonly incomeArea =
    'M42,134.38L108.167,134.38L174.333,54.2L240.5,54.2L306.667,96.4L372.833,96.4L439,15.376L439,265.2L372.833,265.2L306.667,265.2L240.5,265.2L174.333,265.2L108.167,265.2L42,265.2Z';
  protected readonly incomeLine =
    '42,134.38 108.167,134.38 174.333,54.2 240.5,54.2 306.667,96.4 372.833,96.4 439,15.376';
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

  /* Total earning grouped bar chart (baseline y=88.5 of 177 vbox) -------- */
  // pv = amber (chart-5) up; uv = chart-3 down. x is left edge of 12-wide bar.
  protected readonly earnBars = [
    { x: 13, pvY: 27.14, pvH: 61.36, uvH: 62.54 },
    { x: 52.375, pvY: 42.48, pvH: 46.02, uvH: 50.74 },
    { x: 91.75, pvY: 20.06, pvH: 68.44, uvH: 83.81 },
    { x: 131.125, pvY: 27.14, pvH: 61.36, uvH: 50.74 },
    { x: 170.5, pvY: 54.28, pvH: 34.22, uvH: 64.9 },
    { x: 209.875, pvY: 15.34, pvH: 73.16, uvH: 64.9 },
    { x: 249.25, pvY: 9.381, pvH: 79.119, uvH: 35.4 },
    { x: 288.625, pvY: 60.18, pvH: 28.32, uvH: 64.9 },
  ];

  /* For Business Shark ---------------------------------------------------- */
  protected readonly plans: Plan[] = [
    { label: 'Branding', price: '$60', checked: false },
    { label: 'Marketing', price: '$120', checked: true },
    { label: 'Web Development', price: '$250', checked: false },
    { label: 'App Development', price: '$320', checked: false },
  ];

  /* Vehicles Condition (ring r=23.5 => circumference 147.65) -------------- */
  protected readonly conditions: Condition[] = [
    {
      pct: 55,
      display: '55%',
      ring: 'stroke-chart-1',
      label: 'Excellent',
      sub: '12% increase',
      delta: '+25%',
    },
    {
      pct: 20,
      display: '20%',
      ring: 'stroke-chart-2',
      label: 'Good',
      sub: '24 vehicles',
      delta: '+30%',
    },
    {
      pct: 12,
      display: '12%',
      ring: 'stroke-chart-3',
      label: 'Average',
      sub: '182 Tasks',
      delta: '-15%',
    },
    {
      pct: 7,
      display: '7%',
      ring: 'stroke-chart-4',
      label: 'Bad',
      sub: '9 vehicles',
      delta: '+35%',
    },
    {
      pct: 4,
      display: '4%',
      ring: 'stroke-chart-5',
      label: 'Not Working',
      sub: '3 vehicles',
      delta: '-2%',
    },
    {
      pct: 2,
      display: '2%',
      ring: 'stroke-primary',
      label: 'Scraped',
      sub: '2 vehicles',
      delta: '+1%',
    },
  ];
  protected readonly ringCirc = 147.65;
  protected ringDash(pct: number): string {
    const fill = (pct / 100) * this.ringCirc;
    return `${fill} ${this.ringCirc}`;
  }

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

  protected statusClass(status: string): string {
    if (status === 'pending')
      return 'bg-amber-600/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400';
    if (status === 'inactive') return 'bg-destructive/10 text-destructive';
    return 'bg-green-600/10 text-green-600 dark:bg-green-400/10 dark:text-green-400';
  }
}
