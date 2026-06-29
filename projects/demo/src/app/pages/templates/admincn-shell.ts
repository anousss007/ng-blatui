import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Lucide } from './lucide';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  chevron?: boolean;
  external?: boolean;
}
interface NavGroup {
  label: string;
  items: NavItem[];
}

const BASE = '/templates/admincn';

/**
 * AdminCN shared app-shell: inset sidebar (with active-nav highlight) + topbar
 * + footer, projecting page content. Reused by every cloned AdminCN page.
 */
@Component({
  selector: 'app-admincn-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Lucide, RouterLink],
  templateUrl: './admincn-shell.html',
  styleUrl: './admincn.css',
})
export class AdmincnShell {
  /** Label of the active nav item (e.g. "Sales"). */
  readonly active = input<string>('Sales');

  /** Mobile off-canvas sidebar open state. */
  protected readonly sidebarOpen = signal(false);

  protected readonly nav: NavGroup[] = [
    {
      label: 'Dashboard',
      items: [
        { label: 'Sales', icon: 'trending-up', route: BASE },
        { label: 'Finance', icon: 'wallet', route: BASE + '/finance' },
        { label: 'Logistics', icon: 'truck', route: BASE + '/logistics' },
        { label: 'Productivity', icon: 'briefcase', route: BASE + '/productivity' },
        { label: 'Campaign', icon: 'megaphone', route: BASE + '/campaign' },
        { label: 'Analytics', icon: 'chart-column', route: BASE + '/analytics' },
        { label: 'Payments', icon: 'credit-card', route: BASE + '/payments' },
        { label: 'eCommerce', icon: 'shopping-cart', route: BASE + '/ecommerce' },
        { label: 'Orders', icon: 'package', route: BASE + '/orders' },
      ],
    },
    {
      label: 'Apps',
      items: [
        { label: 'Mail', icon: 'mail', route: BASE + '/mail' },
        { label: 'Chat', icon: 'message-circle', route: BASE + '/chat' },
        { label: 'Kanban', icon: 'square-kanban', route: BASE + '/kanban' },
        { label: 'Calendar', icon: 'calendar', route: BASE + '/calendar' },
        { label: 'Contact', icon: 'contact-round', route: BASE + '/contact' },
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
        { label: 'User Profile', icon: 'user', chevron: true },
        { label: 'Pricing', icon: 'dollar-sign', route: BASE + '/pricing' },
        { label: 'FAQ', icon: 'circle-help', route: BASE + '/faq' },
        { label: 'Onboarding', icon: 'footprints', chevron: true },
        { label: 'Authentication', icon: 'lock', chevron: true },
        { label: 'Error Pages', icon: 'triangle-alert', chevron: true },
        { label: 'Empty State', icon: 'file-text', chevron: true },
      ],
    },
    {
      label: 'Forms & Tables',
      items: [
        { label: 'Form Layouts', icon: 'layout-dashboard', chevron: true },
        { label: 'Form Validation', icon: 'badge-check', route: BASE + '/form-validation' },
        { label: 'Form Wizard', icon: 'clipboard-list', chevron: true },
        { label: 'Data Table', icon: 'grid-3x3', route: BASE + '/datatable' },
      ],
    },
    {
      label: 'Components & Charts',
      items: [
        { label: 'Components', icon: 'box', external: true },
        { label: 'Charts', icon: 'chart-line', external: true },
        { label: 'Statistics', icon: 'chart-column', external: true },
        { label: 'Card Nav', icon: 'panel-left', external: true },
        { label: 'Widgets', icon: 'layers', external: true },
      ],
    },
    {
      label: 'Miscellaneous',
      items: [
        { label: 'Menu Level', icon: 'menu', chevron: true },
        { label: 'Support', icon: 'info', external: true },
        { label: 'Documentation', icon: 'book-open', external: true },
      ],
    },
  ];
}
