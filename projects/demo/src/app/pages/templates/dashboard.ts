import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { BuiAvatar } from 'ng-blatui';

import { Lucide } from './lucide';

type Tone = 'success' | 'info' | 'warning' | 'danger';

interface Kpi {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  spark: string;
}
interface Order {
  id: string;
  name: string;
  init: string;
  status: string;
  tone: Tone;
  date: string;
  amount: string;
}
interface NavSection {
  section: string;
  items: { label: string; icon: string; active: boolean }[];
}

/** Dashboard — "Acme" admin app-shell: sidebar + topbar + KPI cards + charts + recent-orders table. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, Lucide],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardTemplate {
  protected readonly nav: NavSection[] = [
    {
      section: 'Main',
      items: [
        { label: 'Dashboard', icon: 'layout-dashboard', active: true },
        { label: 'Analytics', icon: 'chart-column', active: false },
        { label: 'Orders', icon: 'shopping-cart', active: false },
        { label: 'Customers', icon: 'users', active: false },
        { label: 'Products', icon: 'package', active: false },
      ],
    },
    {
      section: 'Workspace',
      items: [
        { label: 'Integrations', icon: 'plug', active: false },
        { label: 'Settings', icon: 'settings', active: false },
        { label: 'Help', icon: 'circle-help', active: false },
      ],
    },
  ];

  protected readonly kpis: Kpi[] = [
    {
      label: 'Revenue',
      value: '$84,254',
      delta: '+12.5%',
      up: true,
      spark: '0,28 16,22 32,24 48,16 64,18 80,8 96,12 112,4',
    },
    {
      label: 'Orders',
      value: '1,329',
      delta: '+4.1%',
      up: true,
      spark: '0,20 16,24 32,18 48,20 64,12 80,16 96,10 112,8',
    },
    {
      label: 'Customers',
      value: '3,872',
      delta: '+8.2%',
      up: true,
      spark: '0,26 16,20 32,22 48,14 64,16 80,12 96,8 112,6',
    },
    {
      label: 'Conversion',
      value: '3.6%',
      delta: '-0.4%',
      up: false,
      spark: '0,8 16,12 32,10 48,16 64,14 80,20 96,18 112,24',
    },
  ];

  protected readonly traffic: { label: string; pct: number }[] = [
    { label: 'Direct', pct: 42 },
    { label: 'Organic search', pct: 28 },
    { label: 'Referral', pct: 18 },
    { label: 'Social', pct: 12 },
  ];

  protected readonly orders: Order[] = [
    {
      id: '#3201',
      name: 'Olivia Martin',
      init: 'OM',
      status: 'Completed',
      tone: 'success',
      date: 'Jun 8',
      amount: '$429.00',
    },
    {
      id: '#3200',
      name: 'Jackson Lee',
      init: 'JL',
      status: 'Processing',
      tone: 'info',
      date: 'Jun 8',
      amount: '$129.00',
    },
    {
      id: '#3199',
      name: 'Isabella Nguyen',
      init: 'IN',
      status: 'Pending',
      tone: 'warning',
      date: 'Jun 7',
      amount: '$89.00',
    },
    {
      id: '#3198',
      name: 'William Kim',
      init: 'WK',
      status: 'Refunded',
      tone: 'danger',
      date: 'Jun 7',
      amount: '$249.00',
    },
    {
      id: '#3197',
      name: 'Sofia Davis',
      init: 'SD',
      status: 'Completed',
      tone: 'success',
      date: 'Jun 6',
      amount: '$599.00',
    },
  ];
}
