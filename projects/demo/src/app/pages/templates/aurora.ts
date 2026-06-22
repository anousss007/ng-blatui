import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';

import {
  BuiAvatar,
  BuiBadge,
  BuiBanner,
  BuiChart,
  BuiKbd,
  BuiMarquee,
  BuiSeparator,
  BuiSwitch,
  BuiTypewriter,
  type ChartSeries,
} from 'ng-blatui';

import { Lucide } from './lucide';

interface Feature {
  icon: string;
  title: string;
  desc: string;
  glow: string;
}
interface Spotlight {
  label: string;
  icon: string;
  title: string;
  desc: string;
  points: string[];
}
interface Plan {
  name: string;
  m: number;
  y: number;
  tag: string;
  cta: string;
  highlight: boolean;
  features: string[];
}

/** Aurora — "Lumina", a vivid gradient-forward AI-workspace landing page. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-aurora',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    BuiAvatar,
    BuiBadge,
    BuiBanner,
    BuiChart,
    BuiKbd,
    BuiMarquee,
    BuiSeparator,
    BuiSwitch,
    BuiTypewriter,
    Lucide,
  ],
  templateUrl: './aurora.html',
  styleUrl: './aurora.css',
})
export class AuroraTemplate {
  protected readonly yearly = signal(false);
  protected readonly fiveStars = [0, 1, 2, 3, 4];

  protected readonly nav = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Integrations', href: '#integrations' },
    { label: 'Changelog', href: '#faq' },
  ];

  protected readonly logos = [
    'Linear',
    'Vercel',
    'Stripe',
    'Figma',
    'Notion',
    'Clerk',
    'PlanetScale',
    'Resend',
    'Lemon Squeezy',
    'Neon',
  ];

  protected readonly heroAvatars = ['aurora1', 'aurora2', 'aurora3', 'aurora4', 'aurora5'];

  protected readonly features: Feature[] = [
    {
      icon: 'brain-circuit',
      title: 'AI Copilot',
      desc: 'An LLM-powered assistant that drafts, edits and explains your work in context — no context switching.',
      glow: '#3b82f6',
    },
    {
      icon: 'workflow',
      title: 'Smart Workflows',
      desc: 'Chain actions across tools. Lumina handles the busywork so your team ships faster.',
      glow: '#6366f1',
    },
    {
      icon: 'shield-check',
      title: 'Zero-Trust Security',
      desc: 'End-to-end encryption, SAML SSO, and a SOC 2 Type II audit log baked in from day one.',
      glow: '#22d3ee',
    },
    {
      icon: 'zap',
      title: 'Real-time Sync',
      desc: 'Sub-100 ms live collaboration — every keystroke, every change, visible to the whole team instantly.',
      glow: '#8b5cf6',
    },
    {
      icon: 'layers',
      title: '120+ Integrations',
      desc: 'Connect Slack, GitHub, Notion, Linear, Figma and a hundred more in two clicks.',
      glow: '#ec4899',
    },
    {
      icon: 'chart-line',
      title: 'Deep Analytics',
      desc: 'Usage trends, team productivity scores, and AI-generated weekly digest — straight to your inbox.',
      glow: '#3b82f6',
    },
  ];

  protected readonly spotlight: Spotlight[] = [
    {
      label: 'Write',
      icon: 'pen-line',
      title: 'Write anything, faster',
      desc: 'The AI copilot understands your workspace context — tone, terminology, linked documents — so every draft lands closer to done.',
      points: ['In-context suggestions', 'Brand voice calibration', 'Multi-language support'],
    },
    {
      label: 'Analyze',
      icon: 'bar-chart-3',
      title: 'Turn data into decisions',
      desc: 'Ask questions in plain English. Get structured insights, charts, and recommended next steps — no SQL required.',
      points: ['Natural language queries', 'Auto-generated summaries', 'Exportable reports'],
    },
    {
      label: 'Automate',
      icon: 'cpu',
      title: 'Set it. Forget it.',
      desc: 'Visual workflow builder with conditional branching, retries and a live event log. Ship automation pipelines in minutes.',
      points: ['Visual drag-and-drop builder', 'Webhook + API triggers', 'Run-history & alerts'],
    },
  ];

  protected readonly stats = [
    { v: '4.2M', l: 'Documents created' },
    { v: '99.99%', l: 'Uptime SLA' },
    { v: '<80ms', l: 'Median latency' },
    { v: '4.9★', l: 'Customer rating' },
  ];

  protected readonly testimonials = [
    {
      q: 'Lumina replaced our entire documentation stack overnight. The AI copilot alone saves our team four hours a week — and counting.',
      a: 'Elena Marchetti',
      r: 'Head of Product, Vercel',
      seed: '101',
    },
    {
      q: 'The analytics are genuinely magical. I asked "what slowed us down last month?" and got a ranked list with charts in ten seconds.',
      a: 'James Okafor',
      r: 'CTO, Stripe',
      seed: '202',
    },
    {
      q: "Security review passed first try. SAML, audit logs, zero-trust — it's all just there, production-ready out of the box.",
      a: 'Sofia Lindqvist',
      r: 'CISO, Linear',
      seed: '303',
    },
    {
      q: 'We onboarded 80 people in a single afternoon. The UX is so clean nobody needed training, which has never happened before.',
      a: 'Tomás Herrera',
      r: 'VP Engineering, Figma',
      seed: '404',
    },
  ];

  protected readonly plans: Plan[] = [
    {
      name: 'Starter',
      m: 0,
      y: 0,
      tag: 'For solo builders',
      cta: 'Start free',
      highlight: false,
      features: [
        '5 AI documents / mo',
        '1 workspace',
        'Basic integrations',
        '7-day history',
        'Community support',
      ],
    },
    {
      name: 'Pro',
      m: 29,
      y: 23,
      tag: 'For growing teams',
      cta: 'Start free trial',
      highlight: true,
      features: [
        'Unlimited AI docs',
        '10 workspaces',
        'All integrations',
        '1-year history',
        'Priority support',
        'SSO & roles',
      ],
    },
    {
      name: 'Enterprise',
      m: 99,
      y: 79,
      tag: 'For organisations',
      cta: 'Talk to sales',
      highlight: false,
      features: [
        'Everything in Pro',
        'Unlimited workspaces',
        'SAML + SCIM',
        'Audit logs',
        'Dedicated CSM',
        'SLA guarantee',
      ],
    },
  ];

  protected readonly faqs = [
    {
      q: 'How does the AI copilot work?',
      a: 'Lumina embeds a context-aware language model directly in your workspace. It reads your linked documents, project terminology and past edits to surface suggestions that sound like you — not a generic AI.',
    },
    {
      q: 'Is there a free plan?',
      a: 'Yes — Starter is free forever with 5 AI documents per month and one workspace. No credit card required to sign up.',
    },
    {
      q: 'Can I use my own data region?',
      a: 'Enterprise customers can pin their data to EU (Frankfurt), US (Virginia) or APAC (Singapore) regions. SOC 2 Type II and GDPR controls apply in all regions.',
    },
    {
      q: 'How does the annual billing discount work?',
      a: 'Paying annually saves roughly 20 % vs the monthly rate. You can switch at any time; unused months are credited to your account.',
    },
    {
      q: 'What integrations are available on day one?',
      a: 'Slack, GitHub, Notion, Linear, Figma, Jira, Confluence, Google Drive, Dropbox, and Zapier are all ready to connect. Custom webhooks and a REST API are available on every plan.',
    },
    {
      q: 'Do you offer a migration service?',
      a: 'Pro and Enterprise customers get a complimentary migration audit and a 90-minute onboarding call with a Lumina solutions engineer.',
    },
  ];

  protected readonly footer = [
    { heading: 'Product', links: ['Features', 'Integrations', 'Pricing', 'Changelog', 'Roadmap'] },
    { heading: 'Company', links: ['About', 'Careers', 'Blog', 'Press', 'Contact'] },
    {
      heading: 'Resources',
      links: ['Documentation', 'API reference', 'Status', 'Community', 'Guides'],
    },
    { heading: 'Legal', links: ['Privacy', 'Terms', 'Security', 'DPA', 'Cookies'] },
  ];

  protected readonly social = [
    { name: 'github', label: 'Github' },
    { name: 'twitter', label: 'Twitter' },
    { name: 'linkedin', label: 'Linkedin' },
    { name: 'youtube', label: 'Youtube' },
  ];

  protected readonly chartLabels = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7', 'Wk 8'];
  protected readonly chartSeries: ChartSeries[] = [
    { name: 'Documents', data: [42, 58, 55, 71, 68, 89, 94, 112] },
    { name: 'Workflows', data: [18, 22, 27, 31, 38, 45, 52, 61] },
  ];
}
