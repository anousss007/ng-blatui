import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

interface Kpi {
  icon: string;
  tile: string;
  badge: string;
  up: boolean;
  value: string;
  label: string;
  period: string;
}
interface SubStat {
  icon: string;
  tile: string;
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
  tile: string;
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
  imports: [Lucide, AdmincnShell],
  templateUrl: './admincn-ecommerce.html',
})
export class AdmincnEcommerce {
  protected readonly img = '/admincn';

  /* ---- KPI tiles ---- */
  protected readonly kpis: Kpi[] = [
    {
      icon: 'badge-check',
      tile: 'acn-tile-teal',
      badge: '+38%',
      up: true,
      value: '$13.4k',
      label: 'Total Sales',
      period: 'Last 6 months',
    },
    {
      icon: 'shopping-cart',
      tile: 'acn-tile-orange',
      badge: '+22%',
      up: true,
      value: '155K',
      label: 'Total Orders',
      period: 'Last 4 months',
    },
    {
      icon: 'dollar-sign',
      tile: 'acn-tile-amber',
      badge: '-16%',
      up: false,
      value: '$89.34k',
      label: 'Total Profit',
      period: 'Last One year',
    },
    {
      icon: 'shopping-bag',
      tile: 'acn-tile-muted',
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
  protected readonly earnSubStats: SubStat[] = [
    { icon: 'wallet', tile: 'acn-tile-amber', label: 'Earning', value: '$1,236' },
    { icon: 'dollar-sign', tile: 'acn-tile-teal', label: 'Profit', value: '$2,300' },
    { icon: 'credit-card', tile: 'acn-tile-orange', label: 'Expense', value: '$1,500' },
  ];

  /* ---- Packing / profile card ---- */
  protected readonly packTabs = [
    { icon: 'package', label: 'Packed' },
    { icon: 'truck', label: 'Shipped' },
    { icon: 'box', label: 'Received' },
  ];
  protected readonly packRows: PackRow[] = [
    { label: 'Packing Pending', value: 4250, pct: 88 },
    { label: 'Packing in Progress', value: 2150, pct: 60 },
    { label: 'Packing Complete', value: 1750, pct: 40, buy: true },
  ];

  /* ---- Orders ---- */
  protected readonly orderTabs = ['New', 'Pending', 'Shipping'];
  protected readonly orders: OrderRow[] = [
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
  ];

  /* ---- Popular products ---- */
  protected readonly products: Product[] = [
    {
      icon: 'footprints',
      tile: 'acn-tile-muted',
      name: 'Nike Vision Low Shoes',
      price: '$5,600',
      stat: '10.6K',
    },
    {
      icon: 'footprints',
      tile: 'acn-tile-muted',
      name: 'Adidas Ultraboost 21',
      price: '$4,500',
      stat: '4.5K',
    },
    {
      icon: 'footprints',
      tile: 'acn-tile-muted',
      name: 'Puma RS-X Toys',
      price: '$3,200',
      stat: '2K',
    },
    {
      icon: 'footprints',
      tile: 'acn-tile-muted',
      name: 'New Balance 550',
      price: '$2,800',
      stat: '1.8K',
    },
    {
      icon: 'footprints',
      tile: 'acn-tile-muted',
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
}
