import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewEncapsulation,
} from '@angular/core';

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

interface Segment {
  label: string;
  pct: string;
  fill: string; // bg-* class for the bar segment
}
interface VehicleStat {
  icon: string;
  label: string;
  time: string;
  pct: string;
}
interface PackingBar {
  label: string;
  count: string;
  value: number;
}
interface ConditionRow {
  label: string;
  sub: string;
  ring: number; // 0..100 sweep
  color: string; // var(--chart-*) for the ring arc
  delta: string;
}
interface RouteRow {
  vol: string;
  start: string;
  end: string;
  warning: string;
  progress: number;
  bar: string; // bg-chart-* class for indicator
}

/**
 * AdminCN — pixel-faithful clone of the shadcn admin "Logistics" dashboard.
 * Vehicle overview (segmented bar + stat rows), order packing card, sales
 * performance bars, vehicles-condition rings, customer ratings area chart and
 * the on-route vehicle table. Reuses the shared app-shell + acn-* utilities.
 */
@Component({
  selector: 'app-tpl-admincn-logistics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    Lucide,
    AdmincnShell,
    BuiChart,
    BuiBadge,
    BuiButton,
    BuiIconTile,
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
  templateUrl: './admincn-logistics.html',
  host: { '(document:click)': 'closeMenus()' },
})
export class AdmincnLogistics {
  protected readonly img = '/admincn';

  /* Vehicle overview — segmented bar ------------------------------------- */
  protected readonly segments: Segment[] = [
    { label: 'On the way', pct: '33.3%', fill: 'bg-primary/10 text-primary' },
    { label: 'Unloading', pct: '23.5%', fill: 'bg-chart-1' },
    { label: 'Loading', pct: '22.1%', fill: 'bg-chart-2' },
    { label: 'Waiting', pct: '21.1%', fill: 'bg-chart-3' },
  ];
  protected readonly vehicleStats: VehicleStat[] = [
    { icon: 'car', label: 'On the way', time: '2hr 10min', pct: '33.3%' },
    { icon: 'download', label: 'Unloading', time: '3hr 15min', pct: '23.5%' },
    { icon: 'upload', label: 'Loading', time: '1hr 24min', pct: '22.1%' },
    { icon: 'clock', label: 'Waiting', time: '5hr 19min', pct: '21.1%' },
  ];

  /* Order / packing card -------------------------------------------------- */
  protected readonly packTabs = ['Packed', 'Shipped', 'Received'];
  protected readonly packIcons = ['package', 'truck', 'package'];
  /** Active order toggle index (0=Packed, 1=Shipped, 2=Received). */
  protected readonly packTab = signal(0);
  /** Per-toggle progress-bar sets. */
  protected readonly packingSets: PackingBar[][] = [
    [
      { label: 'Packing Pending', count: '4250', value: 80 },
      { label: 'Packing in Progress', count: '2150', value: 60 },
      { label: 'Packing Complete', count: '1750', value: 40 },
    ],
    [
      { label: 'Awaiting Pickup', count: '3120', value: 70 },
      { label: 'In Transit', count: '2680', value: 55 },
      { label: 'Out for Delivery', count: '1340', value: 30 },
    ],
    [
      { label: 'Delivered', count: '5120', value: 90 },
      { label: 'Signed', count: '4380', value: 65 },
      { label: 'Returned', count: '420', value: 15 },
    ],
  ];
  protected readonly packing = computed(() => this.packingSets[this.packTab()]);
  protected setPackTab(index: number): void {
    this.packTab.set(index);
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

  /* Sales performance — twin bar columns ---------------------------------- */
  protected readonly perfBars = [40, 70, 55, 90, 48, 75, 62, 85, 52, 68];

  /* Vehicles condition — rings ------------------------------------------- */
  protected readonly conditions: ConditionRow[] = [
    { label: 'Excellent', sub: '12% increase', ring: 55, color: 'var(--chart-1)', delta: '+25%' },
    { label: 'Good', sub: '24 vehicles', ring: 20, color: 'var(--chart-2)', delta: '+30%' },
    { label: 'Average', sub: '182 Tasks', ring: 12, color: 'var(--chart-3)', delta: '-15%' },
    { label: 'Bad', sub: '9 vehicles', ring: 8, color: 'var(--chart-5)', delta: '+35%' },
    { label: 'Not Working', sub: '3 vehicles', ring: 5, color: 'var(--chart-5)', delta: '-2%' },
  ];

  /* Customer ratings — area chart ---------------------------------------- */
  // y-values from the original 96-tall viewBox inverted to data magnitudes.
  protected readonly ratingMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  protected readonly ratingSeries = [
    { data: [26, 38, 56, 34, 66, 44, 88], color: 'var(--chart-2)' },
  ];

  /* On route vehicle table ----------------------------------------------- */
  protected readonly routes: RouteRow[] = [
    {
      vol: 'VOL-159145',
      start: 'Paris 19, France',
      end: 'Dresdon, Germany',
      warning: 'No warning',
      progress: 50,
      bar: 'bg-chart-1',
    },
    {
      vol: 'VOL-163825',
      start: 'Tokyo 23, Japan',
      end: 'Budapest, Hungary',
      warning: 'Fuel problems',
      progress: 75,
      bar: 'bg-chart-2',
    },
    {
      vol: 'VOL-182624',
      start: 'New York City, USA',
      end: 'Kyoto, Japan',
      warning: 'Temperature not optimal',
      progress: 25,
      bar: 'bg-chart-1',
    },
    {
      vol: 'VOL-27568',
      start: 'Berlin, Germany',
      end: 'Cape Town, South Africa',
      warning: 'Ecu not responding',
      progress: 50,
      bar: 'bg-chart-2',
    },
    {
      vol: 'VOL-300168',
      start: 'Sydney, Australia',
      end: 'Buenos Aires, Argentina',
      warning: 'Oil leakage',
      progress: 25,
      bar: 'bg-chart-1',
    },
  ];

  /* Table row selection --------------------------------------------------- */
  protected readonly checked = signal<Set<string>>(new Set());
  protected toggleRow(id: string): void {
    const set = new Set(this.checked());
    if (set.has(id)) set.delete(id);
    else set.add(id);
    this.checked.set(set);
  }
  protected isChecked(id: string): boolean {
    return this.checked().has(id);
  }
  protected readonly allChecked = computed(
    () => this.routes.length > 0 && this.routes.every((r) => this.checked().has(r.vol)),
  );
  protected toggleAll(): void {
    const set = new Set(this.checked());
    if (this.allChecked()) for (const r of this.routes) set.delete(r.vol);
    else for (const r of this.routes) set.add(r.vol);
    this.checked.set(set);
  }

  /* Pagination (static — 25 entries across 2 visible pages) --------------- */
  protected readonly page = signal(1);
  protected readonly pageNumbers = [1, 2];
  protected goTo(p: number): void {
    this.page.set(p);
  }
}
