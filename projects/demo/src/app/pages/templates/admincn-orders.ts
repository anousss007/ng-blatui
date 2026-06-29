import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

interface Kpi {
  icon: string;
  value: string;
  label: string;
  delta: string;
  deltaTone: 'up' | 'down';
}
interface Metric {
  icon: string;
  tile: 'teal' | 'amber' | 'orange' | 'muted';
  label: string;
  value: string;
}
interface Earning {
  logo: string;
  name: string;
  tech: string;
  amount: string;
  progress: number;
}
interface OrderRow {
  name: string;
  email: string;
  avatar: string;
  amount: string;
  status: string;
  card: string;
}

/**
 * AdminCN — pixel-faithful clone of the shadcn admin "Orders" dashboard.
 * Inset sidebar layout (shared shell) + 3 KPI cards + product-insight/earning
 * column + sales-metrics/revenue-goal/sales-plan block + orders table.
 */
@Component({
  selector: 'app-tpl-admincn-orders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Lucide, AdmincnShell],
  templateUrl: './admincn-orders.html',
})
export class AdmincnOrders {
  protected readonly img = '/admincn';

  /* Top KPI cards --------------------------------------------------------- */
  protected readonly kpis: Kpi[] = [
    { icon: 'truck', value: '42', label: 'Shipped Orders', delta: '+18.2%', deltaTone: 'up' },
    {
      icon: 'triangle-alert',
      value: '8',
      label: 'Damaged Returns',
      delta: '-8.7%',
      deltaTone: 'down',
    },
    {
      icon: 'calendar',
      value: '27',
      label: 'Missed Delivery Slots',
      delta: '+4.3%',
      deltaTone: 'up',
    },
  ];

  /* Product insight mini bar charts --------------------------------------- */
  protected readonly reachBars = [40, 64, 52, 78, 96];
  protected readonly placedBars = [30, 48, 38, 60, 44];

  /* Total Earning rows ---------------------------------------------------- */
  protected readonly earnings: Earning[] = [
    {
      logo: '/admincn/avatars/avatar-16.webp',
      name: 'Zipcar',
      tech: 'Vuejs & HTML',
      amount: '-$23,569.26',
      progress: 75,
    },
    {
      logo: '/admincn/avatars/avatar-6.webp',
      name: 'Bitbank',
      tech: 'Figma & React',
      amount: '-$12,650.31',
      progress: 50,
    },
  ];

  /* Sales metrics 4 boxes ------------------------------------------------- */
  protected readonly metrics: Metric[] = [
    { icon: 'trending-up', tile: 'teal', label: 'Sales trend', value: '$11,548' },
    { icon: 'pie-chart', tile: 'amber', label: 'Discount offers', value: '$1,326' },
    { icon: 'dollar-sign', tile: 'orange', label: 'Net profit', value: '$17,356' },
    { icon: 'shopping-bag', tile: 'muted', label: 'Total orders', value: '248' },
  ];

  /* Revenue goal radial (multi-segment donut) ----------------------------- */
  // Three stacked arcs over a faint track. Values are percent of circle.
  protected readonly revenueArcs = [
    { pct: 30, color: 'var(--primary)' },
    { pct: 16, color: 'color-mix(in oklab, var(--primary) 60%, transparent)' },
    { pct: 10, color: 'color-mix(in oklab, var(--primary) 20%, transparent)' },
  ];

  /* Cohort analysis indicator bars ---------------------------------------- */
  // First ~16 of 26 filled (primary), the rest muted.
  protected readonly cohortBars = Array.from({ length: 26 }, (_, index) => ({
    h: [
      22, 30, 18, 34, 26, 38, 24, 32, 20, 36, 28, 34, 22, 30, 26, 32, 18, 24, 20, 28, 22, 30, 18,
      26, 22, 16,
    ][index],
    on: index < 16,
  }));

  /* Orders table ---------------------------------------------------------- */
  protected readonly orders: OrderRow[] = [
    {
      name: 'Jack Alfredo',
      email: 'jack@shadcnstudio.com',
      avatar: '/admincn/avatars/avatar-1.webp',
      amount: '$316.00',
      status: 'paid',
      card: '/admincn/widgets/master-card.webp',
    },
    {
      name: 'Maria Gonzalez',
      email: 'maria.g@shadcnstudio.com',
      avatar: '/admincn/avatars/avatar-2.webp',
      amount: '$253.40',
      status: 'pending',
      card: '/admincn/widgets/visa.webp',
    },
    {
      name: 'John Doe',
      email: 'john.doe@shadcnstudio.com',
      avatar: '/admincn/avatars/avatar-3.webp',
      amount: '$852.00',
      status: 'paid',
      card: '/admincn/widgets/master-card.webp',
    },
    {
      name: 'Emily Carter',
      email: 'emily.carter@shadcnstudio.com',
      avatar: '/admincn/avatars/avatar-4.webp',
      amount: '$889.00',
      status: 'pending',
      card: '/admincn/widgets/visa.webp',
    },
    {
      name: 'David Lee',
      email: 'david.lee@shadcnstudio.com',
      avatar: '/admincn/avatars/avatar-5.webp',
      amount: '$723.16',
      status: 'paid',
      card: '/admincn/widgets/master-card.webp',
    },
  ];

  /** Cumulative dash-offset start for stacked radial arcs (circumference 251.3). */
  protected arcOffset(index: number): number {
    let accumulator = 0;
    for (let index_ = 0; index_ < index; index_++) accumulator += this.revenueArcs[index_].pct;
    return -(accumulator / 100) * 251.3;
  }
  protected arcDash(pct: number): string {
    return `${(pct / 100) * 251.3} 251.3`;
  }
}
