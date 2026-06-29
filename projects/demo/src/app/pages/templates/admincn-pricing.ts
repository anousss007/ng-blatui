import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

interface Plan {
  name: string;
  icon: string;
  price: string;
  period: string;
  cta: string;
  popular?: boolean;
  badge?: string;
}

/** A single comparison-table cell: a check, a dash, or a plain text value. */
type Cell = { kind: 'check' } | { kind: 'dash' } | { kind: 'text'; value: string };

interface FeatureRow {
  label: string;
  cells: [Cell, Cell, Cell];
}

interface FeatureSection {
  title: string;
  icon: string;
  rows: FeatureRow[];
}

const CHECK: Cell = { kind: 'check' };
const DASH: Cell = { kind: 'dash' };
const txt = (value: string): Cell => ({ kind: 'text', value });

/**
 * AdminCN — pixel-faithful clone of the shadcn admin "Pricing" page.
 * Centered heading + billing toggle, a flat-discount promo card alongside three
 * pricing tiers (the middle "Advanced" plan is highlighted/Trending), then a
 * feature comparison table grouped into sections, and a floating Buy Now CTA.
 */
@Component({
  selector: 'app-tpl-admincn-pricing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Lucide, AdmincnShell],
  templateUrl: './admincn-pricing.html',
})
export class AdmincnPricing {
  protected readonly plans: Plan[] = [
    { name: 'Essential Plan', icon: 'sprout', price: '29', period: '/month', cta: 'Basic Access' },
    {
      name: 'Advanced Plan',
      icon: 'flower-2',
      price: '49',
      period: '/month',
      cta: 'Premium Access',
      popular: true,
      badge: 'Trending',
    },
    { name: 'Pro Plan', icon: 'flower-2', price: '99', period: '/month', cta: 'Elite Access' },
  ];

  /** Billing period; drives per-plan price + period display. */
  protected readonly billing = signal<'monthly' | 'yearly'>('monthly');

  /** CTA-selected plan name (highlighted with a ring, in addition to the popular plan). */
  protected readonly selected = signal<string | null>(null);

  /** Expanded comparison sections (all open by default); rows collapse via header toggle. */
  protected readonly openSections = signal<Set<string>>(new Set());

  /** Plans with prices/periods recomputed for the active billing period (yearly = 10x monthly). */
  protected readonly displayPlans = computed<Plan[]>(() => {
    const isYearly = this.billing() === 'yearly';
    return this.plans.map((p) => {
      if (!isYearly) return p;
      const monthly = Number(p.price);
      const yearlyPrice = Number.isFinite(monthly) ? String(monthly * 10) : p.price;
      return { ...p, price: yearlyPrice, period: '/year' };
    });
  });

  protected setBilling(period: 'monthly' | 'yearly'): void {
    this.billing.set(period);
  }

  protected selectPlan(name: string): void {
    this.selected.set(name);
  }

  protected toggleSection(title: string): void {
    this.openSections.update((set) => {
      const next = new Set(set);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  protected isOpen(title: string): boolean {
    // Sections start expanded: a title is "open" unless it's been explicitly collapsed.
    return !this.openSections().has(title);
  }

  protected readonly footerCtas: string[] = ['Basic Access', 'Premium Access', 'Elite Access'];

  protected readonly sections: FeatureSection[] = [
    {
      title: 'Core Analytics',
      icon: 'chart-line',
      rows: [
        { label: 'Real-time dashboard', cells: [CHECK, CHECK, CHECK] },
        { label: 'Key metrics', cells: [CHECK, CHECK, CHECK] },
        { label: 'Custom date range & filters', cells: [CHECK, CHECK, CHECK] },
        { label: 'Product performance insights', cells: [CHECK, CHECK, CHECK] },
        { label: 'Growth trends', cells: [DASH, CHECK, CHECK] },
        {
          label: 'Goal & target tracking',
          cells: [txt('Basic'), txt('Advanced'), txt('Advanced')],
        },
        {
          label: 'Data export (CSV / PDF)',
          cells: [txt('CSV'), txt('CSV + PDF'), txt('CSV + PDF')],
        },
      ],
    },
    {
      title: 'Growth Insights',
      icon: 'rocket',
      rows: [
        {
          label: 'User engagement insights',
          cells: [txt('Basic'), txt('Advanced'), txt('Advanced')],
        },
        { label: 'Conversion funnels', cells: [DASH, CHECK, CHECK] },
        {
          label: 'Audience segmentation',
          cells: [DASH, txt('Limited'), txt('Unlimited')],
        },
        { label: 'Performance comparisons', cells: [DASH, DASH, CHECK] },
        { label: 'Retention & cohort analysis', cells: [DASH, CHECK, CHECK] },
      ],
    },
    {
      title: 'Team & Support',
      icon: 'users',
      rows: [
        { label: 'Team members', cells: [txt('1'), txt('Up to 3'), txt('10+')] },
        {
          label: 'Integrations & API',
          cells: [txt('Limited'), txt('Standard'), txt('Unlimited')],
        },
        {
          label: 'Support level',
          cells: [txt('Email'), txt('Priority'), txt('Dedicated')],
        },
      ],
    },
  ];
}
