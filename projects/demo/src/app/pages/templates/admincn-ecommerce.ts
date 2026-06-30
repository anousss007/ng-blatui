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
  BuiCard,
  BuiChart,
  BuiCheckbox,
  BuiIconTile,
  BuiInputGroup,
  BuiInputGroupAddon,
  BuiInputGroupInput,
  BuiPagination,
  BuiPaginationContent,
  BuiPaginationItem,
  BuiPaginationLink,
  BuiSelect,
  BuiTable,
  BuiTableBody,
  BuiTableCell,
  BuiTableContainer,
  BuiTableHead,
  BuiTableHeader,
  BuiTableRow,
  type SelectOption,
} from 'ng-blatui';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

/** ng-blatui icon-tile tone values used by this page. */
type Tone = 'chart-1' | 'chart-2' | 'chart-5' | 'muted';

interface Kpi {
  icon: string;
  tile: Tone;
  badge: string;
  up: boolean;
  value: string;
  label: string;
  period: string;
}
interface SubStat {
  icon: string;
  tile: Tone;
  label: string;
  value: string;
}
interface PackRow {
  label: string;
  value: number;
  pct: number;
  buy?: boolean;
}
interface OrderRow {
  role: 'Sender' | 'Receiver';
  icon: string;
  name: string;
  address: string;
}
interface Product {
  icon: string;
  tile: Tone;
  name: string;
  price: string;
  stat: string;
}
interface Row {
  icon: string;
  name: string;
  brand: string;
  category: string;
  amount: string;
  qty: string;
  stock: boolean;
  status: 'publish' | 'inactive';
}

/**
 * AdminCN — pixel-faithful clone of the shadcn admin "eCommerce" dashboard.
 * Inset shell + 4 KPI tiles, earning insights, packing/profile card, orders,
 * popular products, filters toolbar and a product table with pagination.
 */
@Component({
  selector: 'app-tpl-admincn-ecommerce',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    Lucide,
    AdmincnShell,
    BuiIconTile,
    BuiBadge,
    BuiButton,
    BuiCard,
    BuiChart,
    BuiAvatar,
    BuiCheckbox,
    BuiInputGroup,
    BuiInputGroupAddon,
    BuiInputGroupInput,
    BuiSelect,
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
  templateUrl: './admincn-ecommerce.html',
})
export class AdmincnEcommerce {
  protected readonly img = '/admincn';

  /* ---- KPI tiles ---- */
  protected readonly kpis: Kpi[] = [
    {
      icon: 'badge-check',
      tile: 'chart-2',
      badge: '+38%',
      up: true,
      value: '$13.4k',
      label: 'Total Sales',
      period: 'Last 6 months',
    },
    {
      icon: 'shopping-cart',
      tile: 'chart-1',
      badge: '+22%',
      up: true,
      value: '155K',
      label: 'Total Orders',
      period: 'Last 4 months',
    },
    {
      icon: 'dollar-sign',
      tile: 'chart-5',
      badge: '-16%',
      up: false,
      value: '$89.34k',
      label: 'Total Profit',
      period: 'Last One year',
    },
    {
      icon: 'shopping-bag',
      tile: 'muted',
      badge: '+38%',
      up: true,
      value: '$1,200',
      label: 'Bookmarks',
      period: 'Last 6 months',
    },
  ];

  /* ---- Earning insights ---- */
  protected readonly earnBars = [
    { label: 'Mo', value: 58 },
    { label: 'Tu', value: 82 },
    { label: 'We', value: 70 },
    { label: 'Th', value: 100 },
    { label: 'Fr', value: 64 },
    { label: 'Sa', value: 88 },
    { label: 'Su', value: 74 },
  ];
  protected readonly earnHighlight = 'Th';
  // Weekly earning bars: chart-2 fill, the highlighted day (Th) is solid.
  // Original bar heights are percentages of the 130px track (max 100).
  protected readonly earnSeries = [
    { data: this.earnBars.map((b) => b.value), color: 'var(--chart-2)' },
  ];
  protected readonly earnAxis = this.earnBars.map((b) => b.label);
  protected readonly earnActive = this.earnBars.findIndex((b) => b.label === this.earnHighlight);
  protected readonly earnSubStats: SubStat[] = [
    { icon: 'wallet', tile: 'chart-5', label: 'Earning', value: '$1,236' },
    { icon: 'dollar-sign', tile: 'chart-2', label: 'Profit', value: '$2,300' },
    { icon: 'credit-card', tile: 'chart-1', label: 'Expense', value: '$1,500' },
  ];

  /* ---- Packing / profile card ---- */
  protected readonly packTabs = [
    { icon: 'package', label: 'Packed' },
    { icon: 'truck', label: 'Shipped' },
    { icon: 'box', label: 'Received' },
  ];
  protected readonly activePackTab = signal('Packed');
  /** Seeded pack-progress rows per tab. */
  private readonly packData: Record<string, PackRow[]> = {
    Packed: [
      { label: 'Packing Pending', value: 4250, pct: 88 },
      { label: 'Packing in Progress', value: 2150, pct: 60 },
      { label: 'Packing Complete', value: 1750, pct: 40, buy: true },
    ],
    Shipped: [
      { label: 'In Transit', value: 3120, pct: 72 },
      { label: 'Out for Delivery', value: 1840, pct: 48 },
      { label: 'Delivery Complete', value: 980, pct: 30, buy: true },
    ],
    Received: [
      { label: 'Awaiting Inspection', value: 2210, pct: 64 },
      { label: 'Inspection in Progress', value: 1320, pct: 42 },
      { label: 'Stocked', value: 760, pct: 22, buy: true },
    ],
  };
  protected readonly packRows = (): PackRow[] => this.packData[this.activePackTab()];
  protected setPackTab(label: string): void {
    this.activePackTab.set(label);
  }

  /* ---- Orders ---- */
  protected readonly orderTabs = ['New', 'Pending', 'Shipping'];
  protected readonly activeOrderTab = signal('New');
  /** Seeded order lists per tab. */
  private readonly orderData: Record<string, OrderRow[]> = {
    New: [
      {
        role: 'Sender',
        icon: 'user',
        name: 'Mytrle Ullrich',
        address: '101 Boulder, California(CA), 959595',
      },
      {
        role: 'Receiver',
        icon: 'map-pin',
        name: 'Barry Schowalter',
        address: '939 orange, California(CA), 92118',
      },
      {
        role: 'Sender',
        icon: 'user',
        name: 'Lucas Smith',
        address: '203 Riverdale, New York(NY), 10001',
      },
      {
        role: 'Receiver',
        icon: 'map-pin',
        name: 'Emma Johnson',
        address: '305 Maple Avenue, Austin, Texas(TX), 73301',
      },
    ],
    Pending: [
      {
        role: 'Sender',
        icon: 'user',
        name: 'Olivia Bennett',
        address: '88 Pine Street, Seattle, Washington(WA), 98101',
      },
      {
        role: 'Receiver',
        icon: 'map-pin',
        name: 'Noah Williams',
        address: '412 Sunset Blvd, Los Angeles, California(CA), 90028',
      },
      {
        role: 'Sender',
        icon: 'user',
        name: 'Sophia Martinez',
        address: '27 Elm Court, Denver, Colorado(CO), 80014',
      },
    ],
    Shipping: [
      {
        role: 'Receiver',
        icon: 'map-pin',
        name: 'Liam Anderson',
        address: '910 Harbor Way, Miami, Florida(FL), 33101',
      },
      {
        role: 'Sender',
        icon: 'user',
        name: 'Ava Thompson',
        address: '53 Birch Lane, Portland, Oregon(OR), 97201',
      },
    ],
  };
  protected readonly orders = (): OrderRow[] => this.orderData[this.activeOrderTab()];
  protected setOrderTab(tab: string): void {
    this.activeOrderTab.set(tab);
  }

  /* ---- Popular products ---- */
  protected readonly products: Product[] = [
    {
      icon: 'footprints',
      tile: 'muted',
      name: 'Nike Vision Low Shoes',
      price: '$5,600',
      stat: '10.6K',
    },
    {
      icon: 'footprints',
      tile: 'muted',
      name: 'Adidas Ultraboost 21',
      price: '$4,500',
      stat: '4.5K',
    },
    {
      icon: 'footprints',
      tile: 'muted',
      name: 'Puma RS-X Toys',
      price: '$3,200',
      stat: '2K',
    },
    {
      icon: 'footprints',
      tile: 'muted',
      name: 'New Balance 550',
      price: '$2,800',
      stat: '1.8K',
    },
    {
      icon: 'footprints',
      tile: 'muted',
      name: 'Reebok Classic Leather',
      price: '$2,200',
      stat: '1.2K',
    },
  ];

  /* ---- Product table ---- */
  protected readonly rows: Row[] = [
    {
      icon: 'smartphone',
      name: 'Samsung galaxy s35',
      brand: 'Samsung',
      category: 'smartphone',
      amount: '$312',
      qty: '45',
      stock: true,
      status: 'publish',
    },
    {
      icon: 'monitor',
      name: 'Apple MacBook Pro',
      brand: 'Apple',
      category: 'laptop',
      amount: '$890',
      qty: '634',
      stock: false,
      status: 'publish',
    },
    {
      icon: 'headphones',
      name: 'Sony WH-1000XM4',
      brand: 'Sony',
      category: 'headphone',
      amount: '$120',
      qty: '456',
      stock: true,
      status: 'inactive',
    },
    {
      icon: 'monitor',
      name: 'Dell XPS 13',
      brand: 'Dell',
      category: 'laptop',
      amount: '$112',
      qty: '4',
      stock: false,
      status: 'publish',
    },
    {
      icon: 'clock',
      name: 'Smart band 4',
      brand: 'Xiaomi',
      category: 'smartwatch',
      amount: '$150',
      qty: '45',
      stock: false,
      status: 'inactive',
    },
  ];

  protected readonly selects = ['Category', 'Stock', 'Status'];

  /* ---- Filter + page-size selects ---- */
  protected readonly filterOptions: SelectOption[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];
  protected readonly filterValue = signal('all');
  protected readonly pageSizeOptions: SelectOption[] = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
  ];
  protected readonly pageSize = signal('5');

  /* ---- Per-card ellipsis menus (one open at a time) ---- */
  protected readonly openMenu = signal<string | null>(null);
  protected readonly menuItems = ['View', 'Refresh', 'Export', 'Remove'];
  protected toggleMenu(id: string): void {
    this.openMenu.set(this.openMenu() === id ? null : id);
  }
  protected closeMenu(): void {
    this.openMenu.set(null);
  }

  /* ---- Product table row selection ---- */
  protected readonly checked = signal<Set<string>>(new Set());
  protected isChecked(name: string): boolean {
    return this.checked().has(name);
  }
  protected toggleRow(name: string): void {
    const set = new Set(this.checked());
    if (set.has(name)) set.delete(name);
    else set.add(name);
    this.checked.set(set);
  }
  protected readonly allChecked = computed(
    () => this.rows.length > 0 && this.rows.every((r) => this.checked().has(r.name)),
  );
  protected toggleAll(): void {
    const set = new Set(this.checked());
    if (this.allChecked()) for (const r of this.rows) set.delete(r.name);
    else for (const r of this.rows) set.add(r.name);
    this.checked.set(set);
  }
}
