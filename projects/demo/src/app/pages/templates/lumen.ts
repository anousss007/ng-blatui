import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';

import { BuiAvatar, BuiBadge, BuiMarquee, BuiRating, BuiSeparator } from 'ng-blatui';

import { Lucide } from './lucide';

interface Episode {
  num: string;
  title: string;
  show: string;
  duration: string;
  date: string;
  img: string;
  plays: string;
  tag: string;
}
interface Show {
  title: string;
  host: string;
  category: string;
  rating: number;
  eps: number;
  img: string;
  bio: string;
}
interface Plan {
  name: string;
  desc: string;
  m: number;
  y: number;
  cta: string;
  highlight: boolean;
  features: string[];
}

/** Lumen — "Listen louder", a hi-fi podcast streaming platform. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-lumen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, BuiBadge, BuiMarquee, BuiRating, BuiSeparator, Lucide],
  templateUrl: './lumen.html',
  styleUrl: './lumen.css',
})
export class LumenTemplate {
  protected readonly yearly = signal(false);

  protected readonly nav = [
    { label: 'Shows', href: '#shows' },
    { label: 'Episodes', href: '#episodes' },
    { label: 'Categories', href: '#categories' },
    { label: 'Creators', href: '#creators' },
    { label: 'Pricing', href: '#pricing' },
  ];

  protected readonly listenOn = [
    { label: 'Spotify', icon: 'music' },
    { label: 'Apple Podcasts', icon: 'headphones' },
    { label: 'YouTube', icon: 'youtube' },
    { label: 'RSS Feed', icon: 'rss' },
  ];

  protected readonly waveHeights = [
    30, 55, 42, 70, 35, 88, 60, 45, 75, 50, 90, 38, 65, 80, 42, 58, 72, 35, 95, 48, 62, 85, 40, 68,
  ];
  protected readonly waveColors = ['var(--coral)', 'var(--amber)', 'var(--teal)', 'var(--purple)'];
  protected readonly duotones = [
    'lumen-duotone-coral',
    'lumen-duotone-amber',
    'lumen-duotone-teal',
    'lumen-duotone-purple',
    'lumen-duotone-coral',
    'lumen-duotone-purple',
  ];
  protected readonly ringColors = ['var(--coral)', 'var(--teal)', 'var(--amber)', 'var(--purple)'];

  protected readonly marqueeShows = [
    'Mind & Flow',
    'Startup Pulse',
    'Tech Unfiltered',
    'Dark Archives',
    'Wealth Lens',
    'Elite Edge',
    'Night Frequency',
    'Culture Shift',
    'Body Rx',
    'AI Daily',
    'Gut Feeling',
    'Code & Coffee',
  ];

  protected readonly episodes: Episode[] = [
    {
      num: 'EP 142',
      title: 'The Art of Deep Focus',
      show: 'Mind & Flow',
      duration: '58 min',
      date: 'Jun 10',
      img: 'https://picsum.photos/seed/ep142/400/400',
      plays: '84K',
      tag: 'Mindfulness',
    },
    {
      num: 'EP 089',
      title: 'Building Billion-Dollar Brands',
      show: 'Startup Pulse',
      duration: '72 min',
      date: 'Jun 8',
      img: 'https://picsum.photos/seed/ep089/400/400',
      plays: '121K',
      tag: 'Business',
    },
    {
      num: 'EP 211',
      title: 'AI Is Eating the World',
      show: 'Tech Unfiltered',
      duration: '45 min',
      date: 'Jun 7',
      img: 'https://picsum.photos/seed/ep211/400/400',
      plays: '203K',
      tag: 'Technology',
    },
    {
      num: 'EP 037',
      title: 'Rituals of High Performers',
      show: 'Elite Edge',
      duration: '61 min',
      date: 'Jun 6',
      img: 'https://picsum.photos/seed/ep037/400/400',
      plays: '67K',
      tag: 'Lifestyle',
    },
    {
      num: 'EP 174',
      title: 'Money, Risk & Regret',
      show: 'Wealth Lens',
      duration: '53 min',
      date: 'Jun 5',
      img: 'https://picsum.photos/seed/ep174/400/400',
      plays: '98K',
      tag: 'Finance',
    },
  ];

  protected readonly shows: Show[] = [
    {
      title: 'Mind & Flow',
      host: 'Dr. Aria Senn',
      category: 'Mindfulness',
      rating: 4.9,
      eps: 142,
      img: 'https://picsum.photos/seed/show1/600/600',
      bio: 'Neuroscientist turned meditation guide. Hosts Mind & Flow to bridge science and inner peace.',
    },
    {
      title: 'Startup Pulse',
      host: 'Marcus Webb',
      category: 'Business',
      rating: 4.8,
      eps: 89,
      img: 'https://picsum.photos/seed/show2/600/600',
      bio: 'Serial founder of three exits. Weekly conversations with the builders rewriting the rules.',
    },
    {
      title: 'Tech Unfiltered',
      host: 'Priya Chandra',
      category: 'Technology',
      rating: 4.9,
      eps: 211,
      img: 'https://picsum.photos/seed/show3/600/600',
      bio: "Ex-Google engineer. Unfiltered analysis on AI, dev culture and what big tech won't say.",
    },
    {
      title: 'Wealth Lens',
      host: 'Leon Farrow',
      category: 'Finance',
      rating: 4.7,
      eps: 174,
      img: 'https://picsum.photos/seed/show4/600/600',
      bio: 'Portfolio manager. Breaks down macro economics so anyone can invest with confidence.',
    },
    {
      title: 'Elite Edge',
      host: 'Simone Park',
      category: 'Lifestyle',
      rating: 4.8,
      eps: 37,
      img: 'https://picsum.photos/seed/show5/600/600',
      bio: 'Olympic coach turned life optimizer. Daily habits, mental toughness and peak output.',
    },
    {
      title: 'Dark Archives',
      host: 'James Hollow',
      category: 'True Crime',
      rating: 4.6,
      eps: 58,
      img: 'https://picsum.photos/seed/show6/600/600',
      bio: 'Investigative journalist. Cold cases, unsolved mysteries, and the stories that haunt.',
    },
  ];

  protected readonly categories = [
    {
      key: 'trending',
      label: 'Trending',
      items: [
        'Mind & Flow',
        'Tech Unfiltered',
        'Startup Pulse',
        'Dark Archives',
        'Wealth Lens',
        'Elite Edge',
      ],
    },
    {
      key: 'technology',
      label: 'Technology',
      items: [
        'Tech Unfiltered',
        'AI Daily',
        'Dev Unlocked',
        'Future Stack',
        'Open Source Now',
        'Code & Coffee',
      ],
    },
    {
      key: 'business',
      label: 'Business',
      items: [
        'Startup Pulse',
        'Wealth Lens',
        'Scale Fast',
        'Founder Mode',
        'B2B Decoded',
        'Revenue Machine',
      ],
    },
    {
      key: 'wellness',
      label: 'Wellness',
      items: [
        'Mind & Flow',
        'Elite Edge',
        'Sleep Science',
        'Body Rx',
        'Gut Feeling',
        'Move With Intent',
      ],
    },
  ];

  protected readonly creators = [
    {
      name: 'Dr. Aria Senn',
      show: 'Mind & Flow',
      img: 'https://picsum.photos/seed/cr1/200/200',
      followers: '412K',
    },
    {
      name: 'Marcus Webb',
      show: 'Startup Pulse',
      img: 'https://picsum.photos/seed/cr2/200/200',
      followers: '387K',
    },
    {
      name: 'Priya Chandra',
      show: 'Tech Unfiltered',
      img: 'https://picsum.photos/seed/cr3/200/200',
      followers: '614K',
    },
    {
      name: 'Leon Farrow',
      show: 'Wealth Lens',
      img: 'https://picsum.photos/seed/cr4/200/200',
      followers: '298K',
    },
    {
      name: 'Simone Park',
      show: 'Elite Edge',
      img: 'https://picsum.photos/seed/cr5/200/200',
      followers: '231K',
    },
    {
      name: 'James Hollow',
      show: 'Dark Archives',
      img: 'https://picsum.photos/seed/cr6/200/200',
      followers: '509K',
    },
    {
      name: 'Yuki Tanaka',
      show: 'Night Frequency',
      img: 'https://picsum.photos/seed/cr7/200/200',
      followers: '178K',
    },
    {
      name: 'Nia Osei',
      show: 'Culture Shift',
      img: 'https://picsum.photos/seed/cr8/200/200',
      followers: '334K',
    },
  ];

  protected readonly plans: Plan[] = [
    {
      name: 'Free',
      desc: 'Casual listening',
      m: 0,
      y: 0,
      cta: 'Start free',
      highlight: false,
      features: [
        'Ad-supported streaming',
        '5 downloads/month',
        'Standard audio quality',
        'Access to all shows',
      ],
    },
    {
      name: 'Lumen+',
      desc: 'For the devoted listener',
      m: 9,
      y: 7,
      cta: 'Try 30 days free',
      highlight: true,
      features: [
        'Ad-free listening',
        'Unlimited downloads',
        'High-fidelity audio',
        'Early access episodes',
        'Exclusive creator Q&As',
      ],
    },
    {
      name: 'Studio',
      desc: 'For creators',
      m: 29,
      y: 24,
      cta: 'Start creating',
      highlight: false,
      features: [
        'Everything in Lumen+',
        'Unlimited uploads',
        'Analytics dashboard',
        'Monetisation tools',
        'Custom RSS & embed',
      ],
    },
  ];

  protected readonly testimonials = [
    {
      q: 'Lumen is the only app that gets out of the way and lets me lose myself in a show. The audio quality alone is worth every penny.',
      a: 'Karan Mehta',
      r: 'Product Designer',
      img: 'https://picsum.photos/seed/tm1/160/160',
    },
    {
      q: 'I launched my podcast here three months ago and hit 50K listeners. The discovery algorithm actually works for indie creators.',
      a: 'Sofia Ruiz',
      r: 'Independent Creator',
      img: 'https://picsum.photos/seed/tm2/160/160',
    },
    {
      q: 'The waveform player is addictive. I clip and share episodes to social every single day — engagement has never been higher.',
      a: 'David Chen',
      r: 'Marketing Lead',
      img: 'https://picsum.photos/seed/tm3/160/160',
    },
  ];

  protected readonly testimonialRings = ['var(--coral)', 'var(--teal)', 'var(--amber)'];

  protected readonly faqs = [
    {
      q: 'Can I listen offline?',
      a: 'Yes. Lumen+ and Studio subscribers can download unlimited episodes. Free listeners get 5 downloads per month, perfect for commutes.',
    },
    {
      q: 'What audio quality does Lumen offer?',
      a: 'Free tier streams at 128 kbps AAC. Lumen+ delivers up to 320 kbps AAC and lossless FLAC for supported shows — audiophile-grade sound.',
    },
    {
      q: 'How do I start my own podcast?',
      a: 'Sign up for a Studio plan, upload your first episode and your RSS feed is live within minutes. Distribute to every major platform automatically.',
    },
    {
      q: 'Do you support video podcasts?',
      a: 'Absolutely. Upload video-first episodes and Lumen hosts both the audio and video versions, auto-generating chapter markers and transcripts.',
    },
    {
      q: 'Can I cancel my subscription anytime?',
      a: 'Yes, cancel any time from your account settings. Your subscription continues until the end of the billing period — no hidden fees, no calls.',
    },
  ];

  protected readonly footer = [
    {
      heading: 'Platform',
      links: ['Browse Shows', 'Top Episodes', 'Categories', 'New Releases', 'Live Events'],
    },
    {
      heading: 'Creators',
      links: ['Start Podcasting', 'Analytics', 'Monetise', 'Distribution', 'Creator Docs'],
    },
    { heading: 'Company', links: ['About', 'Careers', 'Blog', 'Press', 'Contact'] },
  ];

  protected readonly social = ['twitter', 'instagram', 'youtube', 'rss'];
  protected readonly miniWave = [30, 55, 42, 70, 35, 88, 60, 45, 75, 50];
}
