import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

interface PerformanceStat {
  role: string;
  name: string;
  avatar: string;
  badge: string;
  badgeValue: string;
  productLabel: string;
  productValue: string;
  delta: string;
  footerLead: string;
}

interface TimelineBar {
  label: string;
  /** start offset as % of the 12-month track */
  start: number;
  /** width as % of the 12-month track */
  width: number;
  tone: 'teal' | 'amber' | 'dark' | 'orange';
}
interface Project {
  name: string;
  task: string;
  icon: string;
  tone: 'teal' | 'amber' | 'cyan' | 'orange';
}
interface ConvRow {
  label: string;
  meta: string;
  delta: string;
  icon: string;
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
 * AdminCN — pixel-faithful clone of the shadcn admin "Productivity" dashboard.
 * Project timeline (Gantt) + project list, weekly overview area chart, conversion
 * rate funnel, upgrade plan, performance tabs and a users data-table.
 */
@Component({
  selector: 'app-tpl-admincn-productivity',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Lucide, AdmincnShell],
  templateUrl: './admincn-productivity.html',
  host: { '(document:click)': 'closeMenus()' },
})
export class AdmincnProductivity {
  protected readonly img = '/admincn';

  /* Project Timeline — Gantt rows over a 12-month (Jan..Dec) track ---------- */
  protected readonly months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  protected readonly timeline: TimelineBar[] = [
    { label: 'In Progress', start: 8, width: 46, tone: 'teal' },
    { label: 'Planning', start: 25, width: 40, tone: 'amber' },
    { label: 'Review', start: 33, width: 30, tone: 'dark' },
    { label: 'Animation', start: 16, width: 42, tone: 'dark' },
    { label: 'Onboarding', start: 30, width: 45, tone: 'orange' },
  ];

  /* Project List ----------------------------------------------------------- */
  protected readonly projects: Project[] = [
    { name: 'IOS Application', task: 'Task 840/2.5K', icon: 'square-kanban', tone: 'teal' },
    { name: 'Web Application', task: 'Task 99/1.42K', icon: 'globe', tone: 'amber' },
    { name: 'Brand Dashboard', task: 'Task 58/100', icon: 'chart-column', tone: 'cyan' },
    { name: 'UI Kit Design', task: 'Task 120/350', icon: 'palette', tone: 'orange' },
  ];

  /* Weekly overview — area chart (chart-2 teal) ---------------------------- */
  protected readonly weeklyPath = '8,70 48,46 88,52 128,18 168,40 208,62 248,30 288,48 328,22';
  protected readonly weeklyArea =
    'M8,70 L48,46 L88,52 L128,18 L168,40 L208,62 L248,30 L288,48 L328,22 L328,96 L8,96 Z';
  // faint background bars behind the line
  protected readonly weeklyBars = [60, 78, 70, 92, 66, 48, 84, 58, 88];

  /* Conversion rate funnel ------------------------------------------------- */
  protected readonly convSpark = '0,28 30,22 60,26 95,12 130,20 170,8 210,16 250,4';
  protected readonly convRows: ConvRow[] = [
    { label: 'Impressions', meta: '12.2K Visits', delta: '20.3%', icon: 'arrow-up' },
    { label: 'Added to cart', meta: '32 product in cart', delta: '6.3%', icon: 'arrow-up' },
    { label: 'Checkout', meta: '15 Product checkout', delta: '9.56%', icon: 'arrow-down' },
    { label: 'Purchased', meta: '12 orders', delta: '2.62%', icon: 'arrow-up' },
  ];

  /* Performance tabs ------------------------------------------------------- */
  protected readonly perfTabs = ['New Users', 'Online Sales', 'Daily Sales'];
  protected readonly perfAvatars = [
    '/admincn/avatars/avatar-3.webp',
    '/admincn/avatars/avatar-6.webp',
    '/admincn/avatars/avatar-5.webp',
    '/admincn/avatars/avatar-16.webp',
  ];
  /** Active performance tab index. */
  protected readonly perfTab = signal(0);
  /** Per-tab stat sets (one per perfTabs entry). */
  protected readonly perfStats: PerformanceStat[] = [
    {
      role: 'Product Manager',
      name: 'Angel George',
      avatar: '/admincn/avatars/avatar-5.webp',
      badge: 'Daily purchase',
      badgeValue: '10 Items',
      productLabel: 'Physical product',
      productValue: '$78,263',
      delta: '14.78%',
      footerLead: 'Increase 24% ',
    },
    {
      role: 'Sales Lead',
      name: 'Brian Carter',
      avatar: '/admincn/avatars/avatar-6.webp',
      badge: 'Online orders',
      badgeValue: '42 Items',
      productLabel: 'Online product',
      productValue: '$124,980',
      delta: '21.40%',
      footerLead: 'Increase 31% ',
    },
    {
      role: 'Account Manager',
      name: 'Sophia Reed',
      avatar: '/admincn/avatars/avatar-16.webp',
      badge: 'Daily sales',
      badgeValue: '7 Items',
      productLabel: 'Daily product',
      productValue: '$45,120',
      delta: '8.92%',
      footerLead: 'Increase 12% ',
    },
  ];
  protected setPerfTab(index: number): void {
    this.perfTab.set(index);
  }

  /* Per-card ellipsis menus ------------------------------------------------ */
  /** id of the currently open card menu, or null. */
  protected readonly openMenu = signal<string | null>(null);
  protected toggleMenu(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenu.update((current) => (current === id ? null : id));
  }
  protected closeMenus(): void {
    this.openMenu.set(null);
  }

  /* Users table ------------------------------------------------------------ */
  protected readonly users: UserRow[] = [
    {
      name: 'Jack Alfredo',
      email: 'jack.alfredo@shadcnstudio.com',
      avatar: '/admincn/avatars/avatar-1.webp',
      role: 'maintainer',
      roleIcon: 'user-cog',
      plan: 'enterprise',
      billing: 'Auto debit',
      status: 'active',
    },
    {
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@company.com',
      avatar: '/admincn/avatars/avatar-2.webp',
      role: 'admin',
      roleIcon: 'shield-check',
      plan: 'enterprise',
      billing: 'Auto debit',
      status: 'active',
    },
    {
      name: 'Robert Chen',
      email: 'robert.chen@startup.io',
      avatar: '/admincn/avatars/avatar-3.webp',
      role: 'editor',
      roleIcon: 'user-cog',
      plan: 'team',
      billing: 'Manual - PayPal',
      status: 'pending',
    },
    {
      name: 'Emily Wilson',
      email: 'emily.wilson@freelance.com',
      avatar: '/admincn/avatars/avatar-4.webp',
      role: 'author',
      roleIcon: 'users',
      plan: 'basic',
      billing: 'Manual - cash',
      status: 'inactive',
    },
    {
      name: 'David Garcia',
      email: 'david.garcia@agency.net',
      avatar: '/admincn/avatars/avatar-5.webp',
      role: 'subscriber',
      roleIcon: 'contact-round',
      plan: 'company',
      billing: 'Auto debit',
      status: 'active',
    },
  ];
}
