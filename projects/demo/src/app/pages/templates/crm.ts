import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { BuiAvatar } from 'ng-blatui';

import { Lucide } from './lucide';

type Tone = 'neutral' | 'info' | 'primary' | 'warning' | 'success' | 'danger';

interface Deal {
  co: string;
  title: string;
  value: string;
  tag: string;
  tone: Tone;
  who: string;
}
interface Stage {
  name: string;
  tone: Tone;
  total: number;
  deals: Deal[];
}

/** CRM — "Forge" sales pipeline board: app bar + KPI toolbar + kanban deal stages. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-crm',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, Lucide],
  templateUrl: './crm.html',
  styleUrl: './crm.css',
})
export class CrmTemplate {
  protected readonly navItems = ['Deals', 'Contacts', 'Companies', 'Reports'];
  protected readonly stats: [string, string][] = [
    ['Open pipeline', '$412k'],
    ['Weighted', '$168k'],
    ['Win rate', '32%'],
    ['Avg. deal', '$8.4k'],
  ];
  protected readonly teamAvatars = ['MQ', 'LF', 'IP', 'TV'];
  protected readonly sortOpts = [
    'Value: High to Low',
    'Value: Low to High',
    'Recently updated',
    'Closing soon',
  ];

  protected readonly stages: Stage[] = [
    {
      name: 'Lead',
      tone: 'neutral',
      total: 37,
      deals: [
        {
          co: 'Northwind',
          title: 'Annual plan — 40 seats',
          value: '$24k',
          tag: 'Inbound',
          tone: 'info',
          who: 'MQ',
        },
        {
          co: 'Globex',
          title: 'Pilot expansion',
          value: '$9k',
          tag: 'New',
          tone: 'primary',
          who: 'LF',
        },
        {
          co: 'Soylent',
          title: 'Starter → Pro',
          value: '$4k',
          tag: 'Inbound',
          tone: 'info',
          who: 'IP',
        },
      ],
    },
    {
      name: 'Contacted',
      tone: 'info',
      total: 49,
      deals: [
        {
          co: 'Initech',
          title: 'Team plan rollout',
          value: '$18k',
          tag: 'Warm',
          tone: 'warning',
          who: 'TV',
        },
        {
          co: 'Umbrella',
          title: 'Security add-on',
          value: '$31k',
          tag: 'Enterprise',
          tone: 'primary',
          who: 'MQ',
        },
      ],
    },
    {
      name: 'Proposal',
      tone: 'warning',
      total: 138,
      deals: [
        {
          co: 'Stark Industries',
          title: 'Platform license',
          value: '$96k',
          tag: 'Enterprise',
          tone: 'primary',
          who: 'LF',
        },
        {
          co: 'Hooli',
          title: 'Annual renewal',
          value: '$42k',
          tag: 'Renewal',
          tone: 'success',
          who: 'IP',
        },
      ],
    },
    {
      name: 'Negotiation',
      tone: 'primary',
      total: 120,
      deals: [
        {
          co: 'Wayne Ent.',
          title: 'Multi-year deal',
          value: '$120k',
          tag: 'Hot',
          tone: 'danger',
          who: 'TV',
        },
      ],
    },
    {
      name: 'Won',
      tone: 'success',
      total: 43,
      deals: [
        {
          co: 'Acme',
          title: 'Business plan',
          value: '$28k',
          tag: 'Closed',
          tone: 'success',
          who: 'MQ',
        },
        {
          co: 'Cyberdyne',
          title: 'Pro — 25 seats',
          value: '$15k',
          tag: 'Closed',
          tone: 'success',
          who: 'LF',
        },
      ],
    },
  ];
}
