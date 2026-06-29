import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

/* ----- Row models for each table variant ----- */
interface BasicRow {
  customer: string;
  email: string;
  amount: string;
  status: 'paid' | 'pending';
  platform: string;
}
interface UserRow {
  name: string;
  email: string;
  roleIcon: string;
  roleTone: string;
  role: string;
  plan: string;
  billing: string;
  status: 'active' | 'pending' | 'inactive';
}
interface TicketRow {
  name: string;
  email: string;
  subject: string;
  department: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: string;
}
interface EmployeeRow {
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'active' | 'on leave';
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
interface ContractRow {
  vendor: string;
  email: string;
  contract: string;
  category: string;
  renews: string;
  cost: string;
  status: 'active' | 'review due' | 'expired' | 'negotiating';
}
interface LaunchRow {
  launch: string;
  code: string;
  lead: string;
  leadEmail: string;
  market: string;
  date: string;
  status: 'on track' | 'at risk' | 'launched' | 'delayed';
}
interface CourseRow {
  course: string;
  author: string;
  icon: string;
  time: string;
  percent: number;
  done: number;
  total: number;
  s1: number;
  s2: number;
  s3: number;
}
interface ProductRow {
  name: string;
  brand: string;
  image: string;
  catIcon: string;
  category: string;
  amount: string;
  qty: number;
  status: 'publish' | 'inactive';
}
interface GraphRow {
  name: string;
  brand: string;
  image: string;
  spark: string;
  price: string;
  arrow: 'up' | 'down';
  orders: number;
  delta: string;
}

/**
 * AdminCN — pixel-faithful clone of the shadcn admin "Data Table" page.
 * Eleven stacked table cards (basic, column-visibility, filters, resizable,
 * pinnable, page-size, draggable, expandable, progress, export, graph) each
 * with a toolbar/header and pagination footer. Reuses the AdmincnShell + the
 * acn-* table primitives. Light mode, Geist font, responsive (tables scroll
 * horizontally on smaller screens).
 */
@Component({
  selector: 'app-tpl-admincn-datatable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Lucide, AdmincnShell],
  templateUrl: './admincn-datatable.html',
})
export class AdmincnDatatable {
  protected readonly img = '/admincn';
  protected readonly avatars = [
    '/admincn/avatars/avatar-1.webp',
    '/admincn/avatars/avatar-2.webp',
    '/admincn/avatars/avatar-3.webp',
    '/admincn/avatars/avatar-4.webp',
    '/admincn/avatars/avatar-5.webp',
    '/admincn/avatars/avatar-6.webp',
    '/admincn/avatars/avatar-16.webp',
  ];

  /* 1 — Basic Data Table */
  protected readonly basic: BasicRow[] = [
    {
      customer: 'Jack Alfredo',
      email: 'jack@shadcnstudio.com',
      amount: '$316.00',
      status: 'paid',
      platform: this.avatars[0],
    },
    {
      customer: 'Maria Gonzalez',
      email: 'maria.g@shadcnstudio.com',
      amount: '$253.40',
      status: 'pending',
      platform: this.avatars[1],
    },
    {
      customer: 'John Doe',
      email: 'john.doe@shadcnstudio.com',
      amount: '$852.00',
      status: 'paid',
      platform: this.avatars[0],
    },
    {
      customer: 'Emily Carter',
      email: 'emily.carter@shadcnstudio.com',
      amount: '$889.00',
      status: 'pending',
      platform: this.avatars[1],
    },
    {
      customer: 'David Lee',
      email: 'david.lee@shadcnstudio.com',
      amount: '$723.16',
      status: 'paid',
      platform: this.avatars[0],
    },
  ];

  /* 2 & 3 — Column Visibility + Filters (same user dataset) */
  protected readonly users: UserRow[] = [
    {
      name: 'Jack Alfredo',
      email: 'jack.alfredo@shadcnstudio.com',
      roleIcon: 'pencil',
      roleTone: 'text-chart-3',
      role: 'maintainer',
      plan: 'enterprise',
      billing: 'Auto debit',
      status: 'active',
    },
    {
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@company.com',
      roleIcon: 'user',
      roleTone: 'text-green-600',
      role: 'admin',
      plan: 'enterprise',
      billing: 'Auto debit',
      status: 'active',
    },
    {
      name: 'Robert Chen',
      email: 'robert.chen@startup.io',
      roleIcon: 'pen-tool',
      roleTone: 'text-chart-2',
      role: 'editor',
      plan: 'team',
      billing: 'Manual - PayPal',
      status: 'pending',
    },
    {
      name: 'Emily Wilson',
      email: 'emily.wilson@freelance.com',
      roleIcon: 'pen-line',
      roleTone: 'text-chart-1',
      role: 'author',
      plan: 'basic',
      billing: 'Manual - cash',
      status: 'inactive',
    },
    {
      name: 'David Garcia',
      email: 'david.garcia@agency.net',
      roleIcon: 'crown',
      roleTone: 'text-chart-5',
      role: 'subscriber',
      plan: 'company',
      billing: 'Auto debit',
      status: 'active',
    },
  ];

  /* 4 — Resizable Columns (support tickets) */
  protected readonly tickets: TicketRow[] = [
    {
      name: 'Morgan Walsh',
      email: 'morgan.walsh@helixcorp.com',
      subject: 'SSO login redirect loop on staging',
      department: 'engineering',
      priority: 'urgent',
      status: 'in progress',
    },
    {
      name: 'Aiden Reyes',
      email: 'aiden.reyes@northwind.io',
      subject: 'Invoice PDF missing tax breakdown',
      department: 'billing',
      priority: 'high',
      status: 'open',
    },
    {
      name: 'Sofia Kaur',
      email: 'sofia.kaur@brightlane.co',
      subject: 'Request role change for finance workspace',
      department: 'operations',
      priority: 'medium',
      status: 'resolved',
    },
    {
      name: 'Jonah Tate',
      email: 'jonah.tate@pixelops.dev',
      subject: 'Webhook retries failing after deploy',
      department: 'engineering',
      priority: 'high',
      status: 'in progress',
    },
    {
      name: 'Lena Cho',
      email: 'lena.cho@marketgrid.com',
      subject: 'Export CSV truncates long product names',
      department: 'product',
      priority: 'low',
      status: 'closed',
    },
  ];

  /* 5 — Pinnable Columns (employees) */
  protected readonly employees: EmployeeRow[] = [
    {
      name: 'Keira Lawson',
      email: 'keira.lawson@company.com',
      department: 'engineering',
      role: 'Tech Lead',
      status: 'active',
    },
    {
      name: 'Marco Reyes',
      email: 'marco.reyes@company.com',
      department: 'design',
      role: 'UI Designer',
      status: 'active',
    },
    {
      name: 'Aisha Ndiaye',
      email: 'aisha.ndiaye@company.com',
      department: 'marketing',
      role: 'SEO Specialist',
      status: 'on leave',
    },
    {
      name: 'Theo Chen',
      email: 'theo.chen@company.com',
      department: 'engineering',
      role: 'Developer',
      status: 'active',
    },
    {
      name: 'Elena Vargas',
      email: 'elena.vargas@company.com',
      department: 'sales',
      role: 'Account Executive',
      status: 'active',
    },
  ];

  /* 6 — Page Size Selector (invoices) */
  protected readonly invoices: Invoice[] = [
    {
      id: '#5099',
      statusIcon: 'mail',
      statusTone: 'green',
      name: 'Jack Alfredo',
      role: 'UI/UX designer',
      avatar: this.avatars[0],
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
      avatar: this.avatars[1],
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
      avatar: this.avatars[2],
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
      avatar: this.avatars[3],
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
      avatar: this.avatars[4],
      total: '$3,120.00',
      date: '07 Aug 2025',
      paid: true,
    },
  ];

  /* 7 — Draggable Columns (contracts) */
  protected readonly dragCols = [
    'Vendor',
    'Contract ID',
    'Category',
    'Renews On',
    'Annual Cost',
    'Status',
  ];
  protected readonly contracts: ContractRow[] = [
    {
      vendor: 'Atlas Cloud',
      email: 'contracts@atlascloud.io',
      contract: 'CTR-4821',
      category: 'infrastructure',
      renews: 'Apr 12, 2026',
      cost: '$42,800.00',
      status: 'active',
    },
    {
      vendor: 'Northfield Analytics',
      email: 'billing@northfield.io',
      contract: 'CTR-4817',
      category: 'software',
      renews: 'Mar 28, 2026',
      cost: '$18,600.00',
      status: 'review due',
    },
    {
      vendor: 'Lumen Security',
      email: 'renewals@lumnsec.com',
      contract: 'CTR-4813',
      category: 'security',
      renews: 'Jan 15, 2026',
      cost: '$31,200.00',
      status: 'expired',
    },
    {
      vendor: 'Papertrail HR',
      email: 'accounts@papertrail.co',
      contract: 'CTR-4809',
      category: 'hr platform',
      renews: 'Jun 01, 2026',
      cost: '$9,400.00',
      status: 'negotiating',
    },
    {
      vendor: 'Verdant Grid',
      email: 'ops@verdantgrid.com',
      contract: 'CTR-4805',
      category: 'infrastructure',
      renews: 'May 19, 2026',
      cost: '$55,700.00',
      status: 'active',
    },
  ];

  /* 8 — Expandable Rows (launches) */
  protected readonly launches: LaunchRow[] = [
    {
      launch: 'NovaPay Wallet',
      code: 'LNH-2401',
      lead: 'Keira Lawson',
      leadEmail: 'keira.lawson@northpeak.co',
      market: 'north america',
      date: 'Apr 18, 2026',
      status: 'on track',
    },
    {
      launch: 'Helix Analytics Suite',
      code: 'LNH-2397',
      lead: 'Marco Reyes',
      leadEmail: 'marco.reyes@brightfield.io',
      market: 'europe',
      date: 'May 06, 2026',
      status: 'at risk',
    },
    {
      launch: 'Summit CRM Mobile',
      code: 'LNH-2393',
      lead: 'Aisha Ndiaye',
      leadEmail: 'aisha.ndiaye@lumora.health',
      market: 'global',
      date: 'Mar 30, 2026',
      status: 'launched',
    },
    {
      launch: 'Verdant Inventory Hub',
      code: 'LNH-2389',
      lead: 'Theo Chen',
      leadEmail: 'theo.chen@stacklane.dev',
      market: 'apac',
      date: 'Jun 12, 2026',
      status: 'on track',
    },
    {
      launch: 'Atlas Identity Portal',
      code: 'LNH-2385',
      lead: 'Elena Vargas',
      leadEmail: 'elena.vargas@verdant.co',
      market: 'north america',
      date: 'Apr 25, 2026',
      status: 'delayed',
    },
  ];

  /* 9 — Progress (courses) */
  protected readonly courses: CourseRow[] = [
    {
      course: 'UI/UX design',
      author: 'John cartal',
      icon: 'code',
      time: '19h 17m',
      percent: 50,
      done: 50,
      total: 100,
      s1: 14,
      s2: 23,
      s3: 26,
    },
    {
      course: 'Web development',
      author: 'Sara Mitchell',
      icon: 'layout-dashboard',
      time: '20h 5m',
      percent: 22,
      done: 11,
      total: 50,
      s1: 15,
      s2: 24,
      s3: 27,
    },
    {
      course: 'Product management',
      author: 'Alex Johnson',
      icon: 'pen-tool',
      time: '21h 38m',
      percent: 10,
      done: 1,
      total: 10,
      s1: 16,
      s2: 25,
      s3: 28,
    },
    {
      course: 'Graphic design',
      author: 'Emily Chen',
      icon: 'brain-circuit',
      time: '22h 12m',
      percent: 52,
      done: 26,
      total: 50,
      s1: 17,
      s2: 26,
      s3: 29,
    },
    {
      course: 'Data analysis',
      author: 'Mark Robinson',
      icon: 'brain-circuit',
      time: '23h 45m',
      percent: 76,
      done: 76,
      total: 100,
      s1: 18,
      s2: 27,
      s3: 30,
    },
  ];

  /* 10 — Export Buttons (products) */
  protected readonly products: ProductRow[] = [
    {
      name: 'Samsung galaxy s35',
      brand: 'Samsung',
      image: this.img + '/widgets/image-6.webp',
      catIcon: 'smartphone',
      category: 'smartphone',
      amount: '$312',
      qty: 45,
      status: 'publish',
    },
    {
      name: 'Apple MacBook Pro',
      brand: 'Apple',
      image: this.img + '/widgets/image-6.webp',
      catIcon: 'monitor',
      category: 'laptop',
      amount: '$890',
      qty: 634,
      status: 'publish',
    },
    {
      name: 'Sony WH-1000XM4',
      brand: 'Sony',
      image: this.img + '/widgets/image-6.webp',
      catIcon: 'headphones',
      category: 'headphone',
      amount: '$120',
      qty: 456,
      status: 'inactive',
    },
    {
      name: 'Dell XPS 13',
      brand: 'Dell',
      image: this.img + '/widgets/image-6.webp',
      catIcon: 'monitor',
      category: 'laptop',
      amount: '$112',
      qty: 4,
      status: 'publish',
    },
    {
      name: 'Smart band 4',
      brand: 'Xiaomi',
      image: this.img + '/widgets/image-6.webp',
      catIcon: 'clock',
      category: 'smartwatch',
      amount: '$150',
      qty: 45,
      status: 'inactive',
    },
  ];

  /* 11 — Graph (products with sparkline) */
  protected readonly graphs: GraphRow[] = [
    {
      name: 'Samsung galaxy s35',
      brand: 'Samsung',
      image: this.img + '/widgets/image-6.webp',
      spark: '0,16 12,10 24,18 36,6 48,12 60,4 72,9',
      price: '$32',
      arrow: 'up',
      orders: 132,
      delta: '+23',
    },
    {
      name: 'Apple MacBook Pro',
      brand: 'Apple',
      image: this.img + '/widgets/image-6.webp',
      spark: '0,14 12,18 24,8 36,12 48,6 60,10 72,5',
      price: '$280',
      arrow: 'up',
      orders: 116,
      delta: '+10',
    },
    {
      name: 'Sony WH-1000XM4',
      brand: 'Sony',
      image: this.img + '/widgets/image-6.webp',
      spark: '0,6 12,9 24,5 36,12 48,8 60,16 72,18',
      price: '$120',
      arrow: 'down',
      orders: 250,
      delta: '-8',
    },
    {
      name: 'Dell XPS 13',
      brand: 'Dell',
      image: this.img + '/widgets/image-6.webp',
      spark: '0,15 12,9 24,14 36,7 48,11 60,5 72,8',
      price: '$250',
      arrow: 'up',
      orders: 23,
      delta: '+12',
    },
    {
      name: 'Smart band 4',
      brand: 'Xiaomi',
      image: this.img + '/widgets/image-6.webp',
      spark: '0,16 12,12 24,15 36,8 48,11 60,6 72,4',
      price: '$12',
      arrow: 'up',
      orders: 592,
      delta: '+6',
    },
  ];

  /* Map a status/role string to a badge tone class. */
  protected badgeTone(value: string): string {
    switch (value) {
      case 'active':
      case 'paid':
      case 'publish':
      case 'on track':
      case 'launched':
      case 'resolved': {
        return 'acn-badge-green';
      }
      case 'inactive':
      case 'expired':
      case 'delayed':
      case 'closed':
      case 'urgent': {
        return 'acn-badge-red';
      }
      case 'pending':
      case 'review due':
      case 'at risk':
      case 'high':
      case 'in progress':
      case 'negotiating': {
        return 'acn-badge-amber';
      }
      case 'open':
      case 'medium': {
        return 'acn-badge-sky';
      }
      default: {
        return 'acn-badge-primary';
      }
    }
  }
}
