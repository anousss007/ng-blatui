import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';

import { BuiAvatar, BuiTypewriter } from 'ng-blatui';

import { Lucide } from './lucide';

interface Spotlight {
  key: string;
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

/** SaaS — "Nimbus" marketing landing: hero + logo wall + features + spotlight + testimonials + pricing + FAQ + CTA. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-saas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, BuiTypewriter, Lucide],
  templateUrl: './saas.html',
  styleUrl: './saas.css',
})
export class SaasTemplate {
  protected readonly yearly = signal(false);

  protected readonly nav = [
    { label: 'Features', href: '#features' },
    { label: 'Solutions', href: '#spotlight' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  protected readonly typeWords = ['faster', 'smarter', 'together'];
  protected readonly logos = [
    'Acme',
    'Globex',
    'Initech',
    'Umbrella',
    'Soylent',
    'Hooli',
    'Stark',
    'Wayne',
  ];
  protected readonly heroAvatars = [
    '1494790108377-be9c29b29330',
    '1500648767791-00dcc994a43e',
    '1438761681033-6461ffad8d80',
    '1472099645785-5658abf4ff4e',
  ];
  protected readonly mockKpis = [
    { l: 'Revenue', v: '$84.2k', d: '+12.5%' },
    { l: 'Active', v: '5,210', d: '+4.1%' },
    { l: 'Churn', v: '1.8%', d: '-0.6%' },
  ];
  protected readonly mockBars = [40, 55, 48, 70, 62, 85, 78, 95, 88, 100, 92, 76];

  protected readonly features = [
    {
      icon: 'gauge',
      title: 'Real-time analytics',
      desc: 'Live dashboards that update the moment your data does — no refresh, no waiting.',
    },
    {
      icon: 'workflow',
      title: 'Visual automations',
      desc: 'Wire up triggers and actions on a canvas. Ship workflows without touching code.',
    },
    {
      icon: 'users',
      title: 'Built for teams',
      desc: 'Roles, comments and shared views so everyone stays on the same page.',
    },
    {
      icon: 'shield-check',
      title: 'SOC 2 secure',
      desc: 'Encryption at rest and in transit, SSO, and audit logs out of the box.',
    },
    {
      icon: 'zap',
      title: 'Fast by default',
      desc: 'A snappy UI on an edge network, anywhere your customers are.',
    },
    {
      icon: 'layers',
      title: '80+ integrations',
      desc: 'Connect the tools you already use — or build your own with the API.',
    },
  ];

  protected readonly spotlight: Spotlight[] = [
    {
      key: 'dashboards',
      label: 'Dashboards',
      icon: 'chart-column',
      title: 'See everything at a glance',
      desc: 'Drag-and-drop widgets, saved views and scheduled reports keep your whole team aligned around the numbers that matter.',
      points: ['Drag-and-drop layout', 'Saved & shared views', 'Scheduled email reports'],
    },
    {
      key: 'automations',
      label: 'Automations',
      icon: 'workflow',
      title: 'Put the busywork on autopilot',
      desc: 'Trigger actions from any event, branch on conditions, and let Nimbus handle the rest — 24/7.',
      points: ['Event triggers', 'Conditional branching', 'Retries & alerts'],
    },
    {
      key: 'collaboration',
      label: 'Collaboration',
      icon: 'message-circle',
      title: 'Decide together, faster',
      desc: 'Comment in context, @mention teammates and resolve threads without leaving the data.',
      points: ['Inline comments', '@mentions & notifications', 'Read/edit permissions'],
    },
  ];

  protected readonly stats = [
    { v: '12k+', l: 'Teams onboard' },
    { v: '99.99%', l: 'Uptime SLA' },
    { v: '4.9/5', l: 'Average rating' },
    { v: '180+', l: 'Countries' },
  ];

  protected readonly testimonials = [
    {
      q: 'We replaced three tools with Nimbus and shipped our first automated report in an afternoon. The team actually enjoys using it.',
      a: 'Sofia Davis',
      r: 'VP Operations, Acme',
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80',
    },
    {
      q: 'The dashboards are gorgeous and fast. Onboarding our analysts took minutes, not weeks.',
      a: 'Marcus Chen',
      r: 'Head of Data, Globex',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80',
    },
    {
      q: 'Security review passed on the first try. SSO, audit logs, SOC 2 — it was all just there.',
      a: 'Priya Nair',
      r: 'CISO, Umbrella',
      img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&q=80',
    },
  ];

  protected readonly plans: Plan[] = [
    {
      name: 'Starter',
      m: 0,
      y: 0,
      tag: 'For side projects',
      cta: 'Start free',
      highlight: false,
      features: ['Up to 3 dashboards', '1 automation', 'Community support', '7-day history'],
    },
    {
      name: 'Pro',
      m: 29,
      y: 24,
      tag: 'For growing teams',
      cta: 'Start free trial',
      highlight: true,
      features: [
        'Unlimited dashboards',
        '50 automations',
        'Priority support',
        '1-year history',
        'SSO & roles',
      ],
    },
    {
      name: 'Enterprise',
      m: 99,
      y: 82,
      tag: 'For organizations',
      cta: 'Contact sales',
      highlight: false,
      features: [
        'Everything in Pro',
        'Unlimited automations',
        'SAML & SCIM',
        'Audit logs',
        'Dedicated CSM',
      ],
    },
  ];

  protected readonly faqs = [
    {
      q: 'Is there a free plan?',
      a: 'Yes — the Starter plan is free forever and includes up to 3 dashboards and 1 automation. No credit card required.',
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Absolutely. Plans are month-to-month (or save ~17% annually). Cancel from settings with one click — no calls, no emails.',
    },
    {
      q: 'Do you support SSO?',
      a: 'SSO via Google and Microsoft is available on Pro; SAML and SCIM provisioning ship with Enterprise.',
    },
    {
      q: 'How does pricing scale?',
      a: 'Pricing is per workspace, not per seat, so adding teammates never increases your bill.',
    },
    {
      q: 'Where is my data hosted?',
      a: 'On an SOC 2 Type II compliant edge network with encryption at rest and in transit. Choose your data region on Enterprise.',
    },
  ];

  protected readonly footer = [
    { heading: 'Product', links: ['Features', 'Integrations', 'Pricing', 'Changelog', 'Roadmap'] },
    { heading: 'Company', links: ['About', 'Careers', 'Blog', 'Customers', 'Contact'] },
    {
      heading: 'Resources',
      links: ['Documentation', 'Guides', 'API reference', 'Status', 'Community'],
    },
    { heading: 'Legal', links: ['Privacy', 'Terms', 'Security', 'DPA', 'Cookies'] },
  ];
  protected readonly socials = ['github', 'twitter', 'linkedin', 'youtube'];
}
