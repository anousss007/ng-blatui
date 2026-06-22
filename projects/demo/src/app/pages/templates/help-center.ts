import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { Lucide } from './lucide';

interface Category {
  icon: string;
  title: string;
  desc: string;
  n: number;
}
interface Contact {
  icon: string;
  title: string;
  desc: string;
  cta: string;
}

/** HelpCenter — "Helix Help" support hub: search hero + topic cards + popular articles + FAQ + contact. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-help-center',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Lucide],
  templateUrl: './help-center.html',
  styleUrl: './help-center.css',
})
export class HelpCenterTemplate {
  protected readonly nav = ['Help Center', 'Community', 'Status', 'Blog'];
  protected readonly popularTags = ['Billing', 'SSO', 'API keys', 'Export data'];

  protected readonly categories: Category[] = [
    {
      icon: 'rocket',
      title: 'Getting started',
      desc: 'Set up your account and ship your first project.',
      n: 18,
    },
    {
      icon: 'credit-card',
      title: 'Account & billing',
      desc: 'Plans, invoices, payment methods and refunds.',
      n: 24,
    },
    { icon: 'plug', title: 'Integrations', desc: 'Connect Slack, GitHub, Zapier and more.', n: 31 },
    {
      icon: 'shield',
      title: 'Security & privacy',
      desc: 'SSO, data handling and compliance.',
      n: 12,
    },
    {
      icon: 'wrench',
      title: 'Troubleshooting',
      desc: 'Fix common errors and known issues.',
      n: 27,
    },
    {
      icon: 'code',
      title: 'API & developers',
      desc: 'Authentication, webhooks and the SDK.',
      n: 40,
    },
  ];

  protected readonly popular = [
    'How do I reset my password?',
    'Upgrading or downgrading your plan',
    'Inviting teammates to your workspace',
    'Setting up single sign-on (SSO)',
    'Exporting your data',
  ];

  protected readonly faqs = [
    {
      q: 'How do I contact support?',
      a: 'Start a live chat from the widget in the bottom-right of any page, or email support@helix.io. Pro and Business plans get priority response times.',
    },
    {
      q: 'Where can I see my invoices?',
      a: 'Open Settings → Billing. Every invoice is downloadable as a PDF, and you can update your billing email there too.',
    },
    {
      q: 'Is there a status page?',
      a: 'Yes — status.helix.io shows real-time uptime and incident history. Subscribe to get notified of any disruptions.',
    },
  ];

  protected readonly contacts: Contact[] = [
    { icon: 'message-circle', title: 'Live chat', desc: 'Replies in ~2 min', cta: 'Start chat' },
    { icon: 'mail', title: 'Email us', desc: 'support@helix.io', cta: 'Send email' },
    { icon: 'users', title: 'Community', desc: '12k+ members', cta: 'Visit forum' },
  ];
}
