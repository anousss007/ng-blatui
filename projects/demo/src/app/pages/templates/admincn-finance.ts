import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

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

  /* Users data-table */
  protected readonly users: UserRow[] = [
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
}
