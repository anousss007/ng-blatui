import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { BuiAvatar, BuiBadge, BuiRating } from 'ng-blatui';

import { Lucide } from './lucide';

interface Artist {
  name: string;
  genre: string;
  time: string;
  day: number;
  seed: string;
  bio: string;
}
interface SetTime {
  time: string;
  act: string;
  stage: string;
  genre: string;
}
interface Ticket {
  tier: string;
  price: string;
  badge: string;
  badgeTone: 'success' | 'warning' | null;
  rating: number;
  perks: string[];
  highlight: boolean;
}

/** Vinyl — "Wavelength 2026" music festival, retro-poster indigo + magenta/orange/yellow. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-vinyl',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, BuiBadge, BuiRating, Lucide],
  templateUrl: './vinyl.html',
  styleUrl: './vinyl.css',
})
export class VinylTemplate {
  protected readonly navLinks = [
    { label: 'Line-Up', href: '#lineup' },
    { label: 'Schedule', href: '#schedule' },
    { label: 'Tickets', href: '#tickets' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'FAQ', href: '#faq' },
  ];

  protected readonly ticker = [
    'WAVELENGTH 2026',
    'BRUSSELS · JULY 18–20',
    'SOLARA',
    'KRYPT',
    'NOVA VEGA',
    'THRENODY',
    'PULSE UNIT',
    'MARIGOLD',
    'CIRCUIT BOY',
    'SERAPHINE',
    '60+ ARTISTS',
    '3 STAGES',
    '3 DAYS',
  ];
  protected readonly heroBadges = ['3 DAYS', '60+ ARTISTS', '3 STAGES'];

  protected readonly artists: Artist[] = [
    {
      name: 'SOLARA',
      genre: 'Electronic',
      time: '22:00',
      day: 1,
      seed: 'solara1',
      bio: 'Solara blends hyper-textured bass with ethereal synths, forging a sound that feels both ancient and alien.',
    },
    {
      name: 'KRYPT',
      genre: 'Techno',
      time: '00:30',
      day: 1,
      seed: 'krypt22',
      bio: "Berlin-trained selector and producer, Krypt's sets unfold like brutalist architecture — relentless and hypnotic.",
    },
    {
      name: 'NOVA VEGA',
      genre: 'Indie Pop',
      time: '20:00',
      day: 2,
      seed: 'novavega3',
      bio: 'Nova Vega writes love songs for collapsing stars. Four acclaimed albums and a sold-out world tour in 2025.',
    },
    {
      name: 'THRENODY',
      genre: 'Post-Rock',
      time: '21:30',
      day: 2,
      seed: 'threnody4',
      bio: 'Cinematic post-rock from Dublin. Guitars, cello, and found sounds woven into forty-minute soundscapes.',
    },
    {
      name: 'PULSE UNIT',
      genre: 'Synth-Pop',
      time: '19:00',
      day: 1,
      seed: 'pulseunit5',
      bio: 'Pulse Unit resurrects the best of 80s synth-pop and electrifies it with modern production muscle.',
    },
    {
      name: 'MARIGOLD',
      genre: 'R&B / Soul',
      time: '21:00',
      day: 3,
      seed: 'marigold6',
      bio: "Marigold's voice is raw honey. Her debut album topped charts in 27 countries; the follow-up drops June 2026.",
    },
    {
      name: 'CIRCUIT BOY',
      genre: 'Hyperpop',
      time: '23:00',
      day: 3,
      seed: 'circuitboy7',
      bio: 'Chaotic, glitchy, irresistible — Circuit Boy is the act everyone talks about the morning after.',
    },
    {
      name: 'SERAPHINE',
      genre: 'Dream Pop',
      time: '18:30',
      day: 2,
      seed: 'seraphine8',
      bio: "Seraphine's hazy, reverb-soaked dream pop is the perfect opener for a festival sunset.",
    },
  ];

  protected readonly scheduleDays = [
    {
      day: 1,
      label: 'Day 1',
      sets: [
        { time: '16:00', act: 'DOORS OPEN', stage: '—', genre: '' },
        { time: '17:00', act: 'DJ WARMUP', stage: 'Stage B', genre: 'House' },
        { time: '19:00', act: 'PULSE UNIT', stage: 'Main Stage', genre: 'Synth-Pop' },
        { time: '21:00', act: 'SOLARA', stage: 'Main Stage', genre: 'Electronic' },
        { time: '23:00', act: 'KRYPT', stage: 'Stage B', genre: 'Techno' },
      ] as SetTime[],
    },
    {
      day: 2,
      label: 'Day 2',
      sets: [
        { time: '16:00', act: 'DOORS OPEN', stage: '—', genre: '' },
        { time: '17:30', act: 'OPEN DECKS', stage: 'Stage B', genre: 'Various' },
        { time: '18:30', act: 'SERAPHINE', stage: 'Main Stage', genre: 'Dream Pop' },
        { time: '20:00', act: 'NOVA VEGA', stage: 'Main Stage', genre: 'Indie Pop' },
        { time: '21:30', act: 'THRENODY', stage: 'Stage B', genre: 'Post-Rock' },
      ] as SetTime[],
    },
    {
      day: 3,
      label: 'Day 3',
      sets: [
        { time: '16:00', act: 'DOORS OPEN', stage: '—', genre: '' },
        { time: '18:00', act: 'RISING ACTS', stage: 'Stage B', genre: 'Various' },
        { time: '21:00', act: 'MARIGOLD', stage: 'Main Stage', genre: 'R&B / Soul' },
        { time: '23:00', act: 'CIRCUIT BOY', stage: 'Stage B', genre: 'Hyperpop' },
        { time: '00:30', act: 'CLOSING SET', stage: 'Main Stage', genre: 'Electronic' },
      ] as SetTime[],
    },
  ];

  protected readonly tickets: Ticket[] = [
    {
      tier: 'General Admission',
      price: '€89',
      badge: 'Available',
      badgeTone: 'success',
      rating: 4,
      perks: [
        '3-day festival access',
        'Camping included',
        'Late-night zones',
        'Food-market access',
      ],
      highlight: false,
    },
    {
      tier: 'VIP',
      price: '€219',
      badge: 'Popular',
      badgeTone: null,
      rating: 5,
      perks: [
        'GA + VIP fast-track entry',
        'Private viewing platform',
        'Artist meet & greet ballot',
        'Lounge bar & concierge',
      ],
      highlight: true,
    },
    {
      tier: 'Backstage Pass',
      price: '€499',
      badge: 'Limited',
      badgeTone: 'warning',
      rating: 5,
      perks: [
        'Everything in VIP',
        'Backstage access all 3 days',
        'Exclusive merchandise box',
        'Post-show dinner with artists',
      ],
      highlight: false,
    },
  ];

  protected readonly gallery = [
    { thumb: 'https://picsum.photos/seed/wl-g1/400/400', alt: 'Crowd at night stage' },
    { thumb: 'https://picsum.photos/seed/wl-g2/400/400', alt: 'DJ performing under lasers' },
    { thumb: 'https://picsum.photos/seed/wl-g3/400/400', alt: 'Festival crowd from above' },
    {
      thumb: 'https://picsum.photos/seed/wl-g4/400/400',
      alt: 'Colourful light show on main stage',
    },
    { thumb: 'https://picsum.photos/seed/wl-g5/400/400', alt: 'Artist backstage moment' },
    { thumb: 'https://picsum.photos/seed/wl-g6/400/400', alt: 'Sunset over the festival grounds' },
  ];

  protected readonly listeners = ['wl-l1', 'wl-l2', 'wl-l3', 'wl-l4', 'wl-l5'];

  protected readonly faqs = [
    {
      q: 'Where is Wavelength 2026 held?',
      a: 'The festival takes place at Parc des Ondes, Brussels — accessible by metro, train and dedicated shuttle buses from Brussels Central.',
    },
    {
      q: 'Is camping included in the ticket?',
      a: 'Yes — all General Admission and VIP tickets include camping. Upgrade to a glamping pod for an extra fee at checkout.',
    },
    {
      q: 'Can I bring my own food and drinks?',
      a: 'Sealed water bottles are welcome. Outside alcohol is not permitted, but our food-market and zero-waste bars cover every taste.',
    },
    {
      q: 'Are tickets transferable?',
      a: 'GA and VIP tickets can be transferred once via your account dashboard up to 7 days before the event. Backstage Passes are non-transferable.',
    },
    {
      q: 'What is the minimum age?',
      a: 'All ages welcome until 22:00. Late-night zones (Stage B after midnight) are 18+ with valid ID.',
    },
  ];

  protected readonly footerCols = [
    { heading: 'Festival', links: ['Line-Up', 'Schedule', 'Stages', 'Artists', 'Gallery'] },
    { heading: 'Info', links: ['Tickets', 'Getting There', 'Camping', 'Accessibility', 'FAQ'] },
  ];
  protected readonly socials = ['instagram', 'twitter', 'youtube', 'music'];

  /** Static player first-state. */
  protected readonly nowPlaying = {
    title: 'Ultraviolet',
    artist: 'SOLARA',
    duration: '6:42',
    progress: 34,
    volume: 72,
  };
}
