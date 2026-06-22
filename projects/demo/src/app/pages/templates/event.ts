import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { BuiAvatar } from 'ng-blatui';

import { Lucide } from './lucide';

type Tone = 'neutral' | 'primary' | 'info' | 'success' | 'warning';

interface Session {
  time: string;
  title: string;
  who: string;
  track: string;
  tone: Tone;
}
interface Day {
  key: string;
  label: string;
  sessions: Session[];
}
interface Ticket {
  name: string;
  price: number;
  tag: string | null;
  sold: boolean;
  feats: string[];
}

/** Event — "ShipConf 2026" conference landing: hero + speakers + schedule + tickets + sponsors + FAQ. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-event',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, Lucide],
  templateUrl: './event.html',
  styleUrl: './event.css',
})
export class EventTemplate {
  protected readonly nav = ['Speakers', 'Schedule', 'Tickets', 'Venue'];

  protected readonly speakers = [
    { n: 'Mara Quinn', r: 'CTO, Northwind', i: 'MQ' },
    { n: 'Leo Fontaine', r: 'Principal, Globex', i: 'LF' },
    { n: 'Ines Park', r: 'Design Lead, Acme', i: 'IP' },
    { n: 'Theo Vance', r: 'Founder, Forge', i: 'TV' },
    { n: 'Sofia Davis', r: 'VP Eng, Umbrella', i: 'SD' },
    { n: 'Marcus Chen', r: 'Staff Eng, Hooli', i: 'MC' },
    { n: 'Priya Nair', r: 'CISO, Stark', i: 'PN' },
    { n: 'Ada Lovelace', r: 'Author', i: 'AL' },
  ];

  protected readonly schedule: Day[] = [
    {
      key: 'day1',
      label: 'Day 1 · Sep 24',
      sessions: [
        {
          time: '9:00',
          title: 'Registration & coffee',
          who: 'Atrium',
          track: 'break',
          tone: 'neutral',
        },
        {
          time: '10:00',
          title: 'Opening keynote: The next decade of the web',
          who: 'Mara Quinn',
          track: 'keynote',
          tone: 'primary',
        },
        {
          time: '11:00',
          title: 'Designing systems that scale',
          who: 'Ines Park',
          track: 'design',
          tone: 'info',
        },
        { time: '12:30', title: 'Lunch', who: 'Hall B', track: 'break', tone: 'neutral' },
        {
          time: '14:00',
          title: 'Shipping fast without breaking things',
          who: 'Theo Vance',
          track: 'eng',
          tone: 'success',
        },
        {
          time: '15:30',
          title: 'Security for the rest of us',
          who: 'Priya Nair',
          track: 'security',
          tone: 'warning',
        },
      ],
    },
    {
      key: 'day2',
      label: 'Day 2 · Sep 25',
      sessions: [
        {
          time: '9:30',
          title: 'Morning lightning talks',
          who: 'Various',
          track: 'talks',
          tone: 'info',
        },
        {
          time: '10:30',
          title: 'Building a design system your team uses',
          who: 'Leo Fontaine',
          track: 'design',
          tone: 'info',
        },
        {
          time: '12:00',
          title: 'Lunch & networking',
          who: 'Hall B',
          track: 'break',
          tone: 'neutral',
        },
        {
          time: '13:30',
          title: 'Performance at the edge',
          who: 'Marcus Chen',
          track: 'eng',
          tone: 'success',
        },
        {
          time: '15:00',
          title: 'Closing keynote & panel',
          who: 'All speakers',
          track: 'keynote',
          tone: 'primary',
        },
      ],
    },
  ];

  protected readonly tickets: Ticket[] = [
    {
      name: 'Early bird',
      price: 199,
      tag: 'Sold out',
      sold: true,
      feats: ['2-day pass', 'All talks', 'Lunch included'],
    },
    {
      name: 'Standard',
      price: 349,
      tag: 'Popular',
      sold: false,
      feats: ['2-day pass', 'All talks & workshops', 'Lunch + after-party', 'Recordings'],
    },
    {
      name: 'VIP',
      price: 599,
      tag: null,
      sold: false,
      feats: ['Everything in Standard', 'Front-row seating', 'Speaker dinner', 'Swag bag'],
    },
  ];

  protected readonly sponsors = [
    'Vercel',
    'Stripe',
    'Linear',
    'Supabase',
    'Resend',
    'Raycast',
    'Fly.io',
  ];

  protected readonly faqs = [
    {
      q: 'Where is the venue?',
      a: "The Pier Pavilion, 88 Harbor Way, San Francisco. It's a 10-minute walk from the Embarcadero BART station.",
    },
    {
      q: 'Will talks be recorded?',
      a: 'Yes — Standard and VIP ticket holders get access to all recordings within two weeks of the event.',
    },
    {
      q: 'Can I get a refund?',
      a: 'Tickets are refundable up to 30 days before the event, and transferable any time.',
    },
  ];
}
