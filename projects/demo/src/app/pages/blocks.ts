import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  BuiBadge,
  BuiButton,
  BuiCalendar,
  BuiCard,
  BuiCardContent,
  BuiCardDescription,
  BuiCardHeader,
  BuiCardTitle,
  BuiChart,
  BuiDataTable,
  BuiField,
  BuiFieldDescription,
  BuiFieldLabel,
  BuiInput,
  BuiSeparator,
  BuiSidebar,
  BuiSidebarMenuButton,
  BuiStat,
  type DataTableColumn,
} from 'ng-blatui';

export const BLOCKS = [
  'login-01',
  'login-02',
  'login-03',
  'login-04',
  'login-05',
  'signup-01',
  'signup-02',
  'signup-03',
  'marketing-01',
  'pricing-01',
  'dashboard-01',
  'dashboard-02',
  'sidebar-01',
  'sidebar-07',
  'calendar-01',
  'calendar-02',
];

const META: Record<string, { title: string; description: string }> = {
  'login-01': { title: 'Login 01', description: 'A centered card login form.' },
  'login-02': { title: 'Login 02', description: 'A split-screen login with a side panel.' },
  'login-03': { title: 'Login 03', description: 'A login card with social providers.' },
  'login-04': { title: 'Login 04', description: 'A two-column card with form and image.' },
  'login-05': { title: 'Login 05', description: 'An email + social sign-in stack.' },
  'signup-01': { title: 'Sign up 01', description: 'A create-account card form.' },
  'signup-02': { title: 'Sign up 02', description: 'A split-screen create-account form.' },
  'signup-03': { title: 'Sign up 03', description: 'A centered create-account card.' },
  'marketing-01': { title: 'Marketing 01', description: 'A landing hero with logos.' },
  'pricing-01': { title: 'Pricing 01', description: 'A three-tier pricing section.' },
  'dashboard-01': {
    title: 'Dashboard 01',
    description: 'An app shell with sidebar, stats and a table.',
  },
  'dashboard-02': { title: 'Dashboard 02', description: 'An analytics overview with a chart.' },
  'sidebar-01': { title: 'Sidebar 01', description: 'A classic app sidebar with content.' },
  'sidebar-07': { title: 'Sidebar 07', description: 'A grouped-navigation sidebar.' },
  'calendar-01': { title: 'Calendar 01', description: 'A date-picker calendar card.' },
  'calendar-02': { title: 'Calendar 02', description: 'A calendar with an events list.' },
};

/** Pre-composed BlatUI blocks (full sections built from ng-blatui components). */
@Component({
  selector: 'app-blocks',
  imports: [
    RouterLink,
    BuiBadge,
    BuiButton,
    BuiCalendar,
    BuiCard,
    BuiCardContent,
    BuiCardDescription,
    BuiCardHeader,
    BuiCardTitle,
    BuiChart,
    BuiDataTable,
    BuiField,
    BuiFieldDescription,
    BuiFieldLabel,
    BuiInput,
    BuiSeparator,
    BuiSidebar,
    BuiSidebarMenuButton,
    BuiStat,
  ],
  templateUrl: './blocks.html',
})
export class BlocksPage {
  readonly slug = input('');
  protected readonly title = computed(() =>
    Object.hasOwn(META, this.slug()) ? META[this.slug()].title : this.slug(),
  );
  protected readonly description = computed(() =>
    Object.hasOwn(META, this.slug()) ? META[this.slug()].description : '',
  );

  protected readonly dashColumns: DataTableColumn[] = [
    { key: 'order', label: 'Order' },
    { key: 'customer', label: 'Customer' },
    { key: 'status', label: 'Status' },
    { key: 'total', label: 'Total', align: 'right' },
  ];
  protected readonly dashRows = [
    { order: '#1042', customer: 'Ada Lovelace', status: 'Paid', total: '$220.00' },
    { order: '#1041', customer: 'Grace Hopper', status: 'Pending', total: '$98.50' },
    { order: '#1040', customer: 'Alan Turing', status: 'Paid', total: '$540.00' },
    { order: '#1039', customer: 'Edsger Dijkstra', status: 'Refunded', total: '$12.00' },
    { order: '#1038', customer: 'Linus Torvalds', status: 'Paid', total: '$310.75' },
  ];
  protected readonly dashSeries = [{ data: [12, 19, 14, 23, 21, 30, 28] }];
  protected readonly dashLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  protected readonly calValue = signal('');
}
