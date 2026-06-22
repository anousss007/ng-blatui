import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';

import { Lucide } from './lucide';

interface Plan {
  name: string;
  m: number | null;
  y: number | null;
  tag: string;
  cta: string;
  highlight: boolean;
}
interface MatrixRow {
  feature: string;
  vals: (boolean | string)[];
}
interface MatrixGroup {
  group: string;
  rows: MatrixRow[];
}

/** Pricing — "Nimbus" tiered pricing page with monthly/yearly toggle, comparison table and FAQ. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-pricing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Lucide],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css',
})
export class PricingTemplate {
  protected readonly yearly = signal(false);

  protected readonly plans: Plan[] = [
    {
      name: 'Free',
      m: 0,
      y: 0,
      tag: 'For individuals getting started',
      cta: 'Start free',
      highlight: false,
    },
    {
      name: 'Team',
      m: 19,
      y: 16,
      tag: 'For small teams shipping fast',
      cta: 'Start trial',
      highlight: true,
    },
    {
      name: 'Business',
      m: 49,
      y: 41,
      tag: 'For scaling organizations',
      cta: 'Start trial',
      highlight: false,
    },
    {
      name: 'Enterprise',
      m: null,
      y: null,
      tag: 'For custom needs at scale',
      cta: 'Contact sales',
      highlight: false,
    },
  ];

  protected readonly matrix: MatrixGroup[] = [
    {
      group: 'Usage',
      rows: [
        { feature: 'Projects', vals: ['3', 'Unlimited', 'Unlimited', 'Unlimited'] },
        { feature: 'Team members', vals: ['1', '10', '50', 'Unlimited'] },
        { feature: 'History retention', vals: ['7 days', '1 year', '3 years', 'Custom'] },
        { feature: 'API requests / mo', vals: ['1k', '100k', '1M', 'Custom'] },
      ],
    },
    {
      group: 'Features',
      rows: [
        { feature: 'Automations', vals: [false, true, true, true] },
        { feature: 'Advanced analytics', vals: [false, true, true, true] },
        { feature: 'Audit logs', vals: [false, false, true, true] },
        { feature: 'Custom roles', vals: [false, false, true, true] },
      ],
    },
    {
      group: 'Security & support',
      rows: [
        { feature: 'SSO (Google / Microsoft)', vals: [false, true, true, true] },
        { feature: 'SAML & SCIM', vals: [false, false, false, true] },
        { feature: 'Priority support', vals: [false, true, true, true] },
        { feature: 'Dedicated CSM', vals: [false, false, false, true] },
      ],
    },
  ];

  protected readonly faqs = [
    {
      q: 'Can I change plans later?',
      a: 'Yes — upgrade or downgrade anytime from billing. Changes are prorated to the day.',
    },
    {
      q: 'Do you offer annual billing?',
      a: 'Yes, save about 15% when you pay yearly. Toggle the switch above to see annual prices.',
    },
    {
      q: 'Is there a discount for nonprofits?',
      a: 'We offer 50% off for registered nonprofits and free access for open-source projects. Contact sales.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'All major cards via Stripe. Enterprise customers can pay by invoice and ACH.',
    },
  ];

  protected isBool(v: boolean | string): v is boolean {
    return typeof v === 'boolean';
  }
}
