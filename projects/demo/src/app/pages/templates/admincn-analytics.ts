import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';

import {
  BuiAvatar,
  BuiBadge,
  BuiButton,
  BuiChart,
  BuiCheckbox,
  BuiIconTile,
  BuiPagination,
  BuiPaginationContent,
  BuiPaginationItem,
  BuiPaginationLink,
  BuiTable,
  BuiTableBody,
  BuiTableCell,
  BuiTableContainer,
  BuiTableHead,
  BuiTableHeader,
  BuiTableRow,
} from 'ng-blatui';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

interface ServiceBar {
  label: string;
  percent: number;
  color: string;
  dot: string;
}
interface ConvRow {
  label: string;
  sub: string;
  pct: string;
  dir: 'up' | 'down';
}
interface EarnRow {
  icon: string;
  tone: 'chart-1' | 'chart-2' | 'chart-5';
  title: string;
  sub: string;
  amount: string;
  pct: string;
}
interface PayRow {
  img: string;
  card: string;
  type: string;
  date: string;
  spend: string;
  balance: string;
}
interface CourseRow {
  icon: string;
  tileClass: string;
  title: string;
  instructor: string;
  avatar: string;
  time: string;
  progress: number;
  done: number;
  total: number;
  stats: [number, number, number];
}

/**
 * AdminCN — pixel-faithful clone of the shadcn admin "Analytics" dashboard.
 * Inset sidebar shell + 6 KPI cards (profit/revenue/impression + 3 stat tiles),
 * Top Services horizontal bars, Conversion-rate spark area, Performance tabs,
 * Earning report, Payment history table and a "Course you are taking" table.
 */
@Component({
  selector: 'app-tpl-admincn-analytics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    Lucide,
    AdmincnShell,
    BuiChart,
    BuiIconTile,
    BuiBadge,
    BuiButton,
    BuiAvatar,
    BuiCheckbox,
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
  templateUrl: './admincn-analytics.html',
})
export class AdmincnAnalytics {
  protected readonly img = '/admincn';

  /* KPI 1 — Total Profit: stacked amber body + teal cap (same shape as Sales). */
  protected readonly profitBars = [
    { amber: 30, teal: 8 },
    { amber: 41, teal: 9 },
    { amber: 22, teal: 7 },
    { amber: 36, teal: 8 },
    { amber: 45, teal: 10 },
  ];
  protected readonly profitSeries = [
    { data: this.profitBars.map((b) => b.amber), color: 'var(--chart-4)' },
    { data: this.profitBars.map((b) => b.teal), color: 'var(--chart-2)' },
  ];

  /* KPI 2 — Total Revenue: teal bars over a faint full-height track. */
  protected readonly revenueBars = [78, 96, 64, 100, 52, 41, 70];
  protected readonly revenueSeries = [{ data: this.revenueBars, color: 'var(--chart-2)' }];

  /* KPI 3 — Impression: orange step-line over a year (data inverted from the 84-tall viewBox). */
  protected readonly impressionSeries = [
    { data: [14, 14, 35, 35, 21, 21, 3.5, 3.5, 35, 35, 73.5, 73.5], color: 'var(--chart-1)' },
  ];

  /* Top Services by Sales — horizontal bars. */
  protected readonly services: ServiceBar[] = [
    { label: 'UI design', percent: 99, color: 'var(--chart-1)', dot: 'var(--chart-1)' },
    { label: 'UX design', percent: 94, color: 'var(--chart-2)', dot: 'var(--chart-2)' },
    { label: 'Music', percent: 80, color: 'var(--chart-3)', dot: 'var(--chart-3)' },
    { label: 'Animation', percent: 68, color: 'var(--chart-4)', dot: 'var(--chart-4)' },
    { label: 'React', percent: 52, color: 'var(--chart-5)', dot: 'var(--chart-5)' },
    { label: 'SEO', percent: 45, color: 'var(--primary)', dot: 'var(--primary)' },
  ];

  /* Conversion rate spark area (endpoints inverted from the 80-tall viewBox). */
  protected readonly convSeries = [
    { data: [32, 36, 50.667, 30.667, 60, 76, 41.333], color: 'var(--chart-2)' },
  ];
  protected readonly convRows: ConvRow[] = [
    { label: 'Impressions', sub: '12.2K Visits', pct: '20.3', dir: 'up' },
    { label: 'Added to cart', sub: '32 product in cart', pct: '6.3', dir: 'up' },
    { label: 'Checkout', sub: '15 Product checkout', pct: '9.56', dir: 'down' },
    { label: 'Purchased', sub: '12 orders', pct: '2.62', dir: 'up' },
  ];

  /* Performance — avatar stack. */
  protected readonly perfAvatars = [
    '/admincn/avatars/avatar-3.webp',
    '/admincn/avatars/avatar-6.webp',
    '/admincn/avatars/avatar-5.webp',
    '/admincn/avatars/avatar-16.webp',
  ];

  /* Earning Report rows + weekly bars. */
  protected readonly earnRows: EarnRow[] = [
    {
      icon: 'pie-chart',
      tone: 'chart-1',
      title: 'Net profit',
      sub: 'Sales',
      amount: '$1,623',
      pct: '20.3%',
    },
    {
      icon: 'dollar-sign',
      tone: 'chart-2',
      title: 'Total income',
      sub: 'Sales, Affiliation',
      amount: '$5,600',
      pct: '16.2%',
    },
    {
      icon: 'wallet',
      tone: 'chart-5',
      title: 'Total expense',
      sub: 'ADVT, Marketing',
      amount: '$3,200',
      pct: '10.5%',
    },
  ];
  protected readonly earnBars = [
    { label: 'Mo', value: 37 },
    { label: 'Tu', value: 133 },
    { label: 'We', value: 93 },
    { label: 'Th', value: 165 },
    { label: 'Fr', value: 63 },
    { label: 'Sa', value: 48 },
    { label: 'Su', value: 115 },
  ];
  protected readonly earnHighlight = 'Th';
  protected readonly earnMax = 165;
  protected readonly earnSeries = [
    { data: this.earnBars.map((b) => b.value), color: 'var(--chart-2)' },
  ];
  protected readonly earnAxis = this.earnBars.map((b) => b.label);
  protected readonly earnActive = this.earnBars.findIndex((b) => b.label === this.earnHighlight);

  /* Payment History table. */
  protected readonly payments: PayRow[] = [
    {
      img: 'master-card',
      card: '*5688',
      type: 'Credit Card',
      date: '05/Jan',
      spend: '-$2,820',
      balance: '$10,020',
    },
    {
      img: 'visa',
      card: '*8562',
      type: 'Debit Card',
      date: '15/Feb',
      spend: '-$1,450',
      balance: '$8,570',
    },
    {
      img: 'master-card',
      card: '*5238',
      type: 'ATM card',
      date: '20/Mar',
      spend: '-$500',
      balance: '$7,070',
    },
    {
      img: 'visa',
      card: '*8562',
      type: 'Debit card',
      date: '10/Mar',
      spend: '-$750',
      balance: '$5,120',
    },
    {
      img: 'master-card',
      card: '*5688',
      type: 'Credit Card',
      date: '25/May',
      spend: '-$1,200',
      balance: '$5,870',
    },
    {
      img: 'visa',
      card: '*8562',
      type: 'Credit card',
      date: '10/Mar',
      spend: '-$950',
      balance: '$4920',
    },
  ];

  /* Course you are taking table. */
  protected readonly courses: CourseRow[] = [
    {
      icon: 'palette',
      tileClass: 'bg-green-600/10 text-green-600',
      title: 'UI/UX design',
      instructor: 'John cartal',
      avatar: '/admincn/avatars/avatar-1.webp',
      time: '19h 17m',
      progress: 50,
      done: 50,
      total: 100,
      stats: [14, 23, 26],
    },
    {
      icon: 'square-kanban',
      tileClass: 'bg-amber-600/10 text-amber-600',
      title: 'Web development',
      instructor: 'Sara Mitchell',
      avatar: '/admincn/avatars/avatar-2.webp',
      time: '20h 5m',
      progress: 22,
      done: 11,
      total: 50,
      stats: [15, 24, 27],
    },
    {
      icon: 'briefcase',
      tileClass: 'bg-destructive/10 text-destructive',
      title: 'Product management',
      instructor: 'Alex Johnson',
      avatar: '/admincn/avatars/avatar-3.webp',
      time: '21h 38m',
      progress: 10,
      done: 1,
      total: 10,
      stats: [16, 25, 28],
    },
    {
      icon: 'pie-chart',
      tileClass: 'bg-sky-600/10 text-sky-600',
      title: 'Graphic design',
      instructor: 'Emily Chen',
      avatar: '/admincn/avatars/avatar-4.webp',
      time: '22h 12m',
      progress: 52,
      done: 26,
      total: 50,
      stats: [17, 26, 29],
    },
    {
      icon: 'chart-column',
      tileClass: 'bg-primary/10 text-primary',
      title: 'Data analysis',
      instructor: 'Mark Robinson',
      avatar: '/admincn/avatars/avatar-5.webp',
      time: '23h 45m',
      progress: 76,
      done: 76,
      total: 100,
      stats: [18, 27, 30],
    },
  ];

  /* ---- Course table checkbox state ---- */
  protected readonly checkedCourses = signal<Set<string>>(new Set());
  protected isCourseChecked(title: string): boolean {
    return this.checkedCourses().has(title);
  }
  protected toggleCourse(title: string): void {
    const set = new Set(this.checkedCourses());
    if (set.has(title)) set.delete(title);
    else set.add(title);
    this.checkedCourses.set(set);
  }
  protected allCoursesChecked(): boolean {
    return this.courses.length > 0 && this.courses.every((c) => this.checkedCourses().has(c.title));
  }
  protected toggleAllCourses(): void {
    if (this.allCoursesChecked()) {
      this.checkedCourses.set(new Set());
    } else {
      this.checkedCourses.set(new Set(this.courses.map((c) => c.title)));
    }
  }

  /* ---- Course table pagination (static demo controls) ---- */
  protected readonly coursePages = [1, 2];
  protected readonly currentCoursePage = signal(1);
  protected goToCoursePage(p: number): void {
    this.currentCoursePage.set(p);
  }

  /* ---- Performance card tabs ---- */
  protected readonly perfTabs = ['New Users', 'Online Sales', 'Daily Sales'];
  protected readonly activePerfTab = signal('New Users');
  /** Seeded per-tab figures so the card content reflects the active tab. */
  protected readonly perfData: Record<
    string,
    {
      items: string;
      role: string;
      name: string;
      badge: string;
      metric: string;
      value: string;
      delta: string;
    }
  > = {
    'New Users': {
      items: '10 Items',
      role: 'Product Manager',
      name: 'Angel George',
      badge: 'Daily purchase',
      metric: 'Physical product',
      value: '$78,263',
      delta: '+14.78%',
    },
    'Online Sales': {
      items: '24 Items',
      role: 'Sales Lead',
      name: 'Marcus Reyes',
      badge: 'Online orders',
      metric: 'Digital product',
      value: '$52,940',
      delta: '+9.21%',
    },
    'Daily Sales': {
      items: '7 Items',
      role: 'Account Exec',
      name: 'Priya Sharma',
      badge: 'Daily revenue',
      metric: 'Subscription',
      value: '$12,408',
      delta: '+5.36%',
    },
  };
  protected readonly perf = () => this.perfData[this.activePerfTab()];
  protected setPerfTab(tab: string): void {
    this.activePerfTab.set(tab);
  }

  /* ---- Per-card ellipsis menus (one open at a time) ---- */
  protected readonly openMenu = signal<string | null>(null);
  protected readonly menuItems = ['View', 'Refresh', 'Export', 'Remove'];
  protected toggleMenu(id: string): void {
    this.openMenu.set(this.openMenu() === id ? null : id);
  }
  protected closeMenu(): void {
    this.openMenu.set(null);
  }
}
