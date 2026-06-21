import { Component, computed, input } from '@angular/core';

import {
  BuiAvatar,
  BuiBadge,
  BuiButton,
  BuiCard,
  BuiCardContent,
  BuiCardDescription,
  BuiCardHeader,
  BuiCardTitle,
  BuiField,
  BuiFieldLabel,
  BuiInput,
  BuiSeparator,
  BuiSidebar,
  BuiSidebarMenuButton,
  BuiStat,
} from 'ng-blatui';

export const TEMPLATES = [
  'auth',
  'pricing',
  'dashboard',
  'blog',
  'store',
  'saas',
  'docs-site',
  'help-center',
];

const META: Record<string, { title: string; description: string }> = {
  auth: { title: 'Auth', description: 'A full authentication page.' },
  pricing: { title: 'Pricing', description: 'A marketing pricing page.' },
  dashboard: { title: 'Dashboard', description: 'An application dashboard shell.' },
  blog: { title: 'Blog', description: 'A blog index with article cards.' },
  store: { title: 'Store', description: 'An e-commerce product grid.' },
  saas: { title: 'SaaS', description: 'A SaaS landing page with features.' },
  'docs-site': { title: 'Docs site', description: 'A documentation layout.' },
  'help-center': { title: 'Help center', description: 'A support search and categories.' },
};

/** Full-page BlatUI templates, composed from ng-blatui components. */
@Component({
  selector: 'app-templates',
  imports: [
    BuiAvatar,
    BuiBadge,
    BuiButton,
    BuiCard,
    BuiCardContent,
    BuiCardDescription,
    BuiCardHeader,
    BuiCardTitle,
    BuiField,
    BuiFieldLabel,
    BuiInput,
    BuiSeparator,
    BuiSidebar,
    BuiSidebarMenuButton,
    BuiStat,
  ],
  templateUrl: './templates.html',
})
export class TemplatesPage {
  readonly slug = input('');
  protected readonly title = computed(() =>
    Object.hasOwn(META, this.slug()) ? META[this.slug()].title : this.slug(),
  );
  protected readonly description = computed(() =>
    Object.hasOwn(META, this.slug()) ? META[this.slug()].description : '',
  );
  protected readonly posts = [
    { title: 'Designing accessible components', tag: 'Design', author: 'Ada', initials: 'AL' },
    {
      title: 'Server-side rendering in Angular',
      tag: 'Engineering',
      author: 'Grace',
      initials: 'GH',
    },
    { title: 'Theming with design tokens', tag: 'Design', author: 'Alan', initials: 'AT' },
    { title: 'Shipping a component library', tag: 'Product', author: 'Edsger', initials: 'ED' },
  ];
  protected readonly products = [
    { name: 'Wireless headphones', price: '$199', tag: 'New' },
    { name: 'Mechanical keyboard', price: '$129', tag: '' },
    { name: 'USB-C hub', price: '$59', tag: 'Sale' },
    { name: '4K webcam', price: '$89', tag: '' },
    { name: 'Desk mat', price: '$29', tag: '' },
    { name: 'Laptop stand', price: '$45', tag: 'New' },
  ];
}
