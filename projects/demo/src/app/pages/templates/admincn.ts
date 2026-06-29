import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

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
  imports: [Lucide, AdmincnShell],
  templateUrl: './admincn.html',
  styleUrl: './admincn.css',
})
export class AdmincnTemplate {
  protected readonly img = '/admincn';

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
  // Card 2 — Order: orange bars over a faint full-height track.
  protected readonly orderBars = [62, 90, 74, 96, 58, 80, 70];
  // Card 3 — Profit: teal line points (0..100 each axis).
  protected readonly profitLine = '4,70 20,44 36,58 52,30 68,46 84,20 100,8';
  protected readonly profitDots = [
    [4, 70],
    [20, 44],
    [36, 58],
    [52, 30],
    [68, 46],
    [84, 20],
    [100, 8],
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

  /* Total sales step-area chart ------------------------------------------- */
  protected readonly salesPath =
    '12.875,74.56 38.625,74.56 64.375,39.28 90.125,39.28 115.875,61.33 141.625,61.33 167.375,90.94 193.125,90.94 218.875,39.28 244.625,39.28 270.375,4 296.125,4';
  protected readonly salesArea =
    'M12.875,74.56 L38.625,74.56 L64.375,39.28 L90.125,39.28 L115.875,61.33 L141.625,61.33 L167.375,90.94 L193.125,90.94 L218.875,39.28 L244.625,39.28 L270.375,4 L296.125,4 L296.125,130 L12.875,130 Z';
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

  /* Invoice table --------------------------------------------------------- */
  protected readonly invoices: Invoice[] = [
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

  protected barH(value: number, max: number): number {
    return Math.round((value / max) * 1000) / 10;
  }
}
