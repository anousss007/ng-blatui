import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';

import { BuiAvatar, BuiBadge, BuiRating, BuiSwitch } from 'ng-blatui';

import { Lucide } from './lucide';

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface Game {
  seed: string;
  title: string;
  genre: string;
  rating: number;
  players: string;
  tag: string;
  tagColor: Tone;
  price: string;
}
interface LeaderRow {
  rank: number;
  player: string;
  avatar: string;
  score: string;
  wins: string;
  badge: string;
  tone: Tone;
  variant: 'solid' | 'soft';
}
interface Plan {
  name: string;
  priceM: number;
  priceY: number;
  tag: string;
  cta: string;
  hot: boolean;
  color: string;
  perks: string[];
}
interface GameMode {
  key: string;
  label: string;
  icon: string;
  neon: string;
  title: string;
  desc: string;
  points: string[];
  img: string;
  check: string;
}

/** Arcade — "Neon Arcade", a retro-cyber gaming platform. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-arcade',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, BuiBadge, BuiRating, BuiSwitch, Lucide],
  templateUrl: './arcade.html',
  styleUrl: './arcade.css',
})
export class ArcadeTemplate {
  protected readonly yearly = signal(false);

  protected readonly nav = [
    { label: 'Games', href: '#games' },
    { label: 'Trending', href: '#trending' },
    { label: 'Leaderboard', href: '#leaderboard' },
    { label: 'Membership', href: '#membership' },
  ];

  protected readonly topTicker = [
    'INSERT COIN',
    'NEW DROP: CHROME PROTOCOL 2.4',
    'TOURNAMENT LIVE NOW',
    'SEASON 7 LAUNCHED',
    'NEW GAME: SYNTH WARS',
    '100,000 PLAYERS ONLINE',
    'DAILY REWARDS AVAILABLE',
    'WEEKEND DOUBLE XP',
  ];
  protected readonly footTicker = [
    'NEON ARCADE',
    'PLAY HARD',
    'LEVEL UP',
    'NO MERCY',
    'INSERT COIN',
    'HIGH SCORE',
    'PRESS START',
    'GG WP',
  ];
  protected readonly heroBadges: { label: string; tone: Tone; variant: 'solid' | 'soft' }[] = [
    { label: 'NEW DROP', tone: 'danger', variant: 'solid' },
    { label: 'SEASON 7', tone: 'info', variant: 'soft' },
    { label: '100K ONLINE', tone: 'success', variant: 'soft' },
  ];
  protected readonly heroStats = [
    { v: '12M+', l: 'PLAYERS' },
    { v: '300+', l: 'GAMES' },
    { v: '$500K', l: 'PRIZE POOL' },
  ];

  protected readonly games: Game[] = [
    {
      seed: 'neon1',
      title: 'VAPORWAVE RIDERS',
      genre: 'Racing',
      rating: 4,
      players: '2.1M',
      tag: 'HOT',
      tagColor: 'danger',
      price: 'FREE',
    },
    {
      seed: 'cyber2',
      title: 'CHROME PROTOCOL',
      genre: 'Action RPG',
      rating: 5,
      players: '4.7M',
      tag: 'NEW',
      tagColor: 'info',
      price: '$9.99',
    },
    {
      seed: 'arcade3',
      title: 'NEON DUNGEON',
      genre: 'Roguelite',
      rating: 4,
      players: '1.3M',
      tag: 'TOP',
      tagColor: 'success',
      price: '$4.99',
    },
    {
      seed: 'space4',
      title: 'VOID STRIKER',
      genre: 'Shoot-em-up',
      rating: 5,
      players: '3.9M',
      tag: 'SALE',
      tagColor: 'warning',
      price: '$2.99',
    },
    {
      seed: 'pixel5',
      title: 'GRID RUNNER X',
      genre: 'Platformer',
      rating: 4,
      players: '890K',
      tag: 'NEW',
      tagColor: 'info',
      price: 'FREE',
    },
    {
      seed: 'retro6',
      title: 'SYNTH WARS',
      genre: 'Strategy',
      rating: 5,
      players: '2.6M',
      tag: 'HOT',
      tagColor: 'danger',
      price: '$14.99',
    },
  ];

  protected readonly trending = [
    { seed: 'trend1', title: 'LASER DRIFT', genre: 'Racing', players: '5.2M' },
    { seed: 'trend2', title: 'MECHA CLASH', genre: 'Fighting', players: '3.1M' },
    { seed: 'trend3', title: 'PIXEL HEIST', genre: 'Stealth', players: '1.8M' },
    { seed: 'trend4', title: 'ASTRO BLITZ', genre: 'Shoot-em-up', players: '2.4M' },
    { seed: 'trend5', title: 'TURBO QUEST', genre: 'RPG', players: '4.0M' },
  ];

  protected readonly leaderboard: LeaderRow[] = [
    {
      rank: 1,
      player: 'NeonSlayer99',
      avatar: '10',
      score: '9,847,210',
      wins: '1,842',
      badge: 'LEGENDARY',
      tone: 'danger',
      variant: 'solid',
    },
    {
      rank: 2,
      player: 'CyberPhoenix',
      avatar: '20',
      score: '8,312,540',
      wins: '1,601',
      badge: 'MASTER',
      tone: 'info',
      variant: 'solid',
    },
    {
      rank: 3,
      player: 'VoidHunterX',
      avatar: '30',
      score: '7,990,005',
      wins: '1,488',
      badge: 'MASTER',
      tone: 'info',
      variant: 'solid',
    },
    {
      rank: 4,
      player: 'GlitchMaster',
      avatar: '40',
      score: '6,441,880',
      wins: '1,210',
      badge: 'ELITE',
      tone: 'warning',
      variant: 'soft',
    },
    {
      rank: 5,
      player: 'ArcadePrincess',
      avatar: '50',
      score: '5,999,120',
      wins: '1,099',
      badge: 'ELITE',
      tone: 'warning',
      variant: 'soft',
    },
    {
      rank: 6,
      player: 'PixelDemon',
      avatar: '60',
      score: '4,701,330',
      wins: '992',
      badge: 'PRO',
      tone: 'neutral',
      variant: 'soft',
    },
    {
      rank: 7,
      player: 'LaserKnight',
      avatar: '70',
      score: '3,888,900',
      wins: '870',
      badge: 'PRO',
      tone: 'neutral',
      variant: 'soft',
    },
  ];

  protected readonly gameModes: GameMode[] = [
    {
      key: 'solo',
      label: 'SOLO QUEST',
      icon: 'user',
      neon: 'arc-neon-m',
      title: 'SOLO QUEST',
      desc: 'Dive deep into single-player campaigns. 40+ hours of story content, procedural dungeons, and boss encounters that will test your limits.',
      points: [
        '40+ campaign hours',
        'Procedural dungeons',
        'Offline play supported',
        'Cloud save sync',
      ],
      img: 'mode-solo',
      check: '#aaff00',
    },
    {
      key: 'pvp',
      label: 'PVP ARENA',
      icon: 'swords',
      neon: 'arc-neon-c',
      title: 'PVP ARENA',
      desc: 'Go head-to-head with players worldwide. Ranked ladders, seasonal resets, and prestige rewards. Rise to the top of the global leaderboard.',
      points: [
        'Global ranked matchmaking',
        'Seasonal ladder resets',
        'Prestige badges & rewards',
        'Anti-cheat protection',
      ],
      img: 'mode-pvp',
      check: '#00f0ff',
    },
    {
      key: 'coop',
      label: 'CO-OP RAID',
      icon: 'users',
      neon: 'arc-neon-m',
      title: 'CO-OP RAID',
      desc: 'Squad up with up to 4 friends for massive raid bosses. Coordinate abilities, share loot, and earn exclusive raid-only cosmetics.',
      points: [
        'Up to 4-player squads',
        'Raid boss encounters',
        'Shared loot & XP',
        'Exclusive raid cosmetics',
      ],
      img: 'mode-coop',
      check: '#a855f7',
    },
    {
      key: 'tournament',
      label: 'TOURNAMENT',
      icon: 'trophy',
      neon: 'arc-neon-lime',
      title: 'TOURNAMENT',
      desc: 'Compete in weekly and monthly tournaments with real prize pools up to $50,000. Auto-entry for Pro+ members every single weekend.',
      points: [
        'Weekly prize pools $500+',
        'Monthly grand finals $50K',
        'Auto-entry for Pro+',
        'Spectator & broadcast mode',
      ],
      img: 'mode-tour',
      check: '#aaff00',
    },
  ];

  protected readonly achievements = [
    {
      icon: 'zap',
      label: 'Speed Runner',
      desc: 'Complete a level under 60s',
      pct: 78,
      xp: '780 XP',
      prog: 'arc-progress-m',
    },
    {
      icon: 'trophy',
      label: 'Tournament King',
      desc: 'Win 10 consecutive matches',
      pct: 55,
      xp: '550 XP',
      prog: 'arc-progress-c',
    },
    {
      icon: 'flame',
      label: 'Blaze Streak',
      desc: '30-day login streak',
      pct: 93,
      xp: '930 XP',
      prog: 'arc-progress-l',
    },
    {
      icon: 'sword',
      label: 'Boss Slayer',
      desc: 'Defeat all bosses on Hard',
      pct: 40,
      xp: '400 XP',
      prog: 'arc-progress-p',
    },
  ];

  protected readonly playerStats = [
    { v: '4,291', l: 'HOURS PLAYED', i: 'clock' },
    { v: '847', l: 'GAMES WON', i: 'trophy' },
    { v: '23', l: 'BADGES', i: 'award' },
    { v: 'Legendary', l: 'CURRENT RANK', i: 'star' },
  ];

  protected readonly community = [
    {
      seed: 'c1',
      name: 'NeonSlayer99',
      msg: "Chrome Protocol just dropped update 2.4 and it's absolutely insane. Best patch yet!",
      time: '2m ago',
      likes: 142,
    },
    {
      seed: 'c2',
      name: 'CyberPhoenix',
      msg: 'Finally hit Legendary rank after 6 months. The grind was worth every single second.',
      time: '15m ago',
      likes: 88,
    },
    {
      seed: 'c3',
      name: 'PixelDemon',
      msg: 'The new Neon Dungeon expansion has me absolutely hooked. 40 hours in and still going strong.',
      time: '1h ago',
      likes: 207,
    },
  ];
  protected readonly communityAvatars = ['p10', 'p20', 'p30', 'p40', 'p50', 'p60', 'p70', 'p80'];

  protected readonly plans: Plan[] = [
    {
      name: 'ARCADE',
      priceM: 0,
      priceY: 0,
      tag: 'For casual players',
      cta: 'Play Free',
      hot: false,
      color: '#00f0ff',
      perks: [
        'Access to 50+ free games',
        'Standard matchmaking',
        'Community forums',
        '5 GB cloud saves',
      ],
    },
    {
      name: 'NEON PRO',
      priceM: 12,
      priceY: 9,
      tag: 'For serious gamers',
      cta: 'Go Pro',
      hot: true,
      color: '#ff2bd6',
      perks: [
        'All free games + 120 Pro titles',
        'Priority matchmaking',
        'Exclusive cosmetics & badges',
        '100 GB cloud saves',
        'Early access drops',
      ],
    },
    {
      name: 'CHROME',
      priceM: 24,
      priceY: 18,
      tag: 'For the elite few',
      cta: 'Go Chrome',
      hot: false,
      color: '#aaff00',
      perks: [
        'Everything in Pro',
        'All 300+ games',
        'Exclusive Chrome badge',
        '500 GB cloud saves',
        'Beta access + dev streams',
        'Monthly merch drop',
      ],
    },
  ];

  protected readonly faqs = [
    {
      q: 'Can I play for free?',
      a: 'Absolutely. The Arcade tier is free forever with access to 50+ titles. No credit card needed — just create an account and dive in.',
    },
    {
      q: 'How often are new games added?',
      a: 'We ship new titles every two weeks. Pro and Chrome members get early access 72 hours before general release.',
    },
    {
      q: 'Is cross-platform play supported?',
      a: 'Yes — PC, console and mobile players all share the same matchmaking pool. Your progress syncs across every device.',
    },
    {
      q: 'What happens if I cancel my sub?',
      a: 'You keep access until the end of your billing period. Your saved data, achievements and cosmetics are preserved forever.',
    },
    {
      q: 'Do you run tournaments?',
      a: 'Every weekend we host ranked tournaments with real prize pools. Pro+ members are automatically eligible — no sign-up required.',
    },
  ];

  protected readonly footerCols = [
    { heading: 'GAMES', links: ['Action', 'Racing', 'RPG', 'Strategy', 'Puzzle'] },
    { heading: 'COMPANY', links: ['About', 'Careers', 'Press', 'Blog', 'Contact'] },
    { heading: 'SUPPORT', links: ['Help Center', 'Community', 'Status', 'Privacy', 'Terms'] },
  ];
  protected readonly socials = ['twitter', 'github', 'youtube', 'monitor'];
}
