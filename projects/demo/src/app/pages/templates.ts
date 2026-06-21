import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  BuiAvatar,
  BuiBadge,
  BuiButton,
  BuiCard,
  BuiCardContent,
  BuiCardDescription,
  BuiCardHeader,
  BuiCardTitle,
  BuiDataTable,
  BuiField,
  BuiFieldLabel,
  BuiInput,
  BuiSeparator,
  BuiSidebar,
  BuiSidebarMenuButton,
  BuiStat,
  type DataTableColumn,
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
  'product',
  'crm',
  'account',
  'agency',
  'startup',
  'event',
  'aurora',
  'cosmos',
  'prism',
  'lumen',
  'atlas',
  'bloom',
  'brew',
  'brut',
  'forge',
  'helix',
  'mono',
  'pulse',
  'quantum',
  'sprout',
  'terroir',
  'verdure',
  'vinyl',
  'arcade',
  'atelier',
  'estate',
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
  product: { title: 'Product', description: 'A product detail page.' },
  crm: { title: 'CRM', description: 'A contacts app shell.' },
  account: { title: 'Account', description: 'An account settings page.' },
  agency: { title: 'Agency', description: 'An agency landing page.' },
  startup: { title: 'Startup', description: 'A startup landing page.' },
  event: { title: 'Event', description: 'A conference / event landing page.' },
  aurora: { title: 'Aurora', description: 'A gradient-hero landing template.' },
  cosmos: { title: 'Cosmos', description: 'A dark, spacious landing template.' },
  prism: { title: 'Prism', description: 'A feature-grid landing template.' },
  lumen: { title: 'Lumen', description: 'A minimal, light landing template.' },
  atlas: { title: 'Atlas', description: 'A bold editorial landing template.' },
  bloom: { title: 'Bloom', description: 'A soft, rounded landing template.' },
  brew: { title: 'Brew', description: 'A warm, cozy landing template.' },
  brut: { title: 'Brut', description: 'A brutalist, high-contrast template.' },
  forge: { title: 'Forge', description: 'An industrial, slate landing template.' },
  helix: { title: 'Helix', description: 'A tech, gradient-accent template.' },
  mono: { title: 'Mono', description: 'A monochrome, typographic template.' },
  pulse: { title: 'Pulse', description: 'An energetic, stat-led template.' },
  quantum: { title: 'Quantum', description: 'A futuristic, dark-tech template.' },
  sprout: { title: 'Sprout', description: 'A fresh, green startup template.' },
  terroir: { title: 'Terroir', description: 'An earthy, artisanal template.' },
  verdure: { title: 'Verdure', description: 'A botanical, calm template.' },
  vinyl: { title: 'Vinyl', description: 'A retro, music-shop template.' },
  arcade: { title: 'Arcade', description: 'A playful, neon template.' },
  atelier: { title: 'Atelier', description: 'A refined, gallery template.' },
  estate: { title: 'Estate', description: 'A real-estate listing template.' },
};

/** Full-page BlatUI templates, composed from ng-blatui components. */
@Component({
  selector: 'app-templates',
  imports: [
    RouterLink,
    BuiAvatar,
    BuiBadge,
    BuiButton,
    BuiCard,
    BuiCardContent,
    BuiCardDescription,
    BuiCardHeader,
    BuiCardTitle,
    BuiDataTable,
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
  protected readonly pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      tag: 'For individuals getting started',
      cta: 'Start free',
      highlight: false,
      features: ['3 projects', '1 member', '7-day history', 'Community support'],
    },
    {
      name: 'Team',
      price: '$19',
      tag: 'For small teams shipping fast',
      cta: 'Start trial',
      highlight: true,
      features: ['Unlimited projects', '10 members', 'Automations', 'Priority support'],
    },
    {
      name: 'Business',
      price: '$49',
      tag: 'For scaling organizations',
      cta: 'Start trial',
      highlight: false,
      features: ['Everything in Team', '50 members', 'Audit logs', 'Custom roles'],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      tag: 'For custom needs at scale',
      cta: 'Contact sales',
      highlight: false,
      features: ['Unlimited members', 'SAML & SCIM', 'Dedicated CSM', '99.99% SLA'],
    },
  ];
  protected readonly pricingFaqs = [
    {
      q: 'Can I change plans later?',
      a: 'Yes — upgrade or downgrade anytime from billing. Changes are prorated to the day.',
    },
    { q: 'Do you offer annual billing?', a: 'Yes, save about 15% when you pay yearly.' },
    {
      q: 'Is there a nonprofit discount?',
      a: '50% off for registered nonprofits and free access for open-source projects.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'All major cards via Stripe. Enterprise can pay by invoice and ACH.',
    },
  ];
  protected readonly saasFeatures = [
    {
      icon: '⚡',
      title: 'Blazing fast',
      body: 'Sub-second interactions with signals and zoneless change detection.',
    },
    {
      icon: '♿',
      title: 'Accessible',
      body: 'WCAG-ready components built on Angular Aria and the CDK.',
    },
    {
      icon: '🎨',
      title: 'Themeable',
      body: 'Design tokens in oklch, light & dark, customised at runtime.',
    },
    {
      icon: '🔒',
      title: 'Secure',
      body: 'SSR-safe by default with encrypted, audited infrastructure.',
    },
    {
      icon: '🧩',
      title: 'Composable',
      body: 'Copy-paste primitives you own and adapt to any product.',
    },
    { icon: '📈', title: 'Observable', body: 'Real-time dashboards and insights, out of the box.' },
  ];
  protected readonly products = [
    { name: 'Wireless headphones', price: '$199', tag: 'New' },
    { name: 'Mechanical keyboard', price: '$129', tag: '' },
    { name: 'USB-C hub', price: '$59', tag: 'Sale' },
    { name: '4K webcam', price: '$89', tag: '' },
    { name: 'Desk mat', price: '$29', tag: '' },
    { name: 'Laptop stand', price: '$45', tag: 'New' },
  ];
  protected readonly crmColumns: DataTableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'company', label: 'Company' },
    { key: 'stage', label: 'Stage' },
    { key: 'value', label: 'Value', align: 'right' },
  ];
  protected readonly crmRows = [
    { name: 'Ada Lovelace', company: 'Analytical Co', stage: 'Lead', value: '$4,200' },
    { name: 'Grace Hopper', company: 'Naval Systems', stage: 'Proposal', value: '$12,000' },
    { name: 'Alan Turing', company: 'Enigma Ltd', stage: 'Won', value: '$8,500' },
    { name: 'Edsger Dijkstra', company: 'Shortest Path', stage: 'Lead', value: '$2,100' },
  ];
}
