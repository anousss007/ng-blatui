import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

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
  tile: string;
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
  imports: [Lucide, AdmincnShell],
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

  /* KPI 2 — Total Revenue: teal bars over a faint full-height track. */
  protected readonly revenueBars = [78, 96, 64, 100, 52, 41, 70];

  /* KPI 3 — Impression: orange step-line over a year. */
  protected readonly impressionLine =
    '4,70 31.909,70 59.818,49 87.727,49 115.636,63 143.545,63 171.455,80.5 199.364,80.5 227.273,49 255.182,49 283.091,10.5 311,10.5';

  /* Top Services by Sales — horizontal bars. */
  protected readonly services: ServiceBar[] = [
    { label: 'UI design', percent: 99, color: 'var(--chart-1)', dot: 'var(--chart-1)' },
    { label: 'UX design', percent: 94, color: 'var(--chart-2)', dot: 'var(--chart-2)' },
    { label: 'Music', percent: 80, color: 'var(--chart-3)', dot: 'var(--chart-3)' },
    { label: 'Animation', percent: 68, color: 'var(--chart-4)', dot: 'var(--chart-4)' },
    { label: 'React', percent: 52, color: 'var(--chart-5)', dot: 'var(--chart-5)' },
    { label: 'SEO', percent: 45, color: 'var(--primary)', dot: 'var(--primary)' },
  ];

  /* Conversion rate spark area (viewBox 0 0 341 80). */
  protected readonly convLine =
    'M4,48C22.5,48.766,41,49.533,59.5,44C78,38.467,96.5,26.635,115,29.333C133.5,32.031,152,49.259,170.5,49.333C189,49.407,207.5,32.328,226,20C244.5,7.672,263,0.097,281.5,4C300,7.903,318.5,23.285,337,38.667';
  protected readonly convArea =
    'M4,48C22.5,48.766,41,49.533,59.5,44C78,38.467,96.5,26.635,115,29.333C133.5,32.031,152,49.259,170.5,49.333C189,49.407,207.5,32.328,226,20C244.5,7.672,263,0.097,281.5,4C300,7.903,318.5,23.285,337,38.667L337,80L4,80Z';
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
      tile: 'acn-tile-orange',
      title: 'Net profit',
      sub: 'Sales',
      amount: '$1,623',
      pct: '20.3%',
    },
    {
      icon: 'dollar-sign',
      tile: 'acn-tile-teal',
      title: 'Total income',
      sub: 'Sales, Affiliation',
      amount: '$5,600',
      pct: '16.2%',
    },
    {
      icon: 'wallet',
      tile: 'acn-tile-amber',
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

  protected barH(value: number, max: number): number {
    return Math.round((value / max) * 1000) / 10;
  }
}
