import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { BuiAvatar, BuiBadge, BuiSeparator } from 'ng-blatui';

import { Lucide } from './lucide';

interface Collection {
  title: string;
  artist: string;
  floor: string;
  items: number;
  seed: string;
  avatars: string[];
  tag: string;
}
interface Artist {
  name: string;
  handle: string;
  vol: string;
  works: number;
  seed: string;
  rank: string;
  pct: number;
}
interface Auction {
  title: string;
  artist: string;
  bid: string;
  bidder: string;
  bids: number;
  seed: string;
  aseed: string;
  h: string;
  m: string;
  s: string;
}

/** Prism — a holographic NFT / digital-art marketplace. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-prism',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, BuiBadge, BuiSeparator, Lucide],
  templateUrl: './prism.html',
  styleUrl: './prism.css',
})
export class PrismTemplate {
  protected readonly navLinks = [
    { label: 'Explore', href: '#explore' },
    { label: 'Collections', href: '#collections' },
    { label: 'Artists', href: '#artists' },
    { label: 'Auctions', href: '#auctions' },
  ];

  protected readonly categories = [
    { key: 'all', label: 'All Art' },
    { key: 'generative', label: 'Generative' },
    { key: 'photography', label: 'Photography' },
    { key: 'illustration', label: 'Illustration' },
    { key: '3d', label: '3D / Motion' },
  ];

  /** First category's grid (static first-tab render). */
  protected readonly categoryArt = [
    { name: 'Fragment #42', price: '0.14 ETH', seed: 'cat-all-a' },
    { name: 'Echo Series #5', price: '0.28 ETH', seed: 'cat-all-b' },
    { name: 'Drift #128', price: '0.62 ETH', seed: 'cat-all-c' },
    { name: 'Arc #244', price: '1.05 ETH', seed: 'cat-all-d' },
  ];

  protected readonly collections: Collection[] = [
    {
      title: 'Chromatic Dreams',
      artist: 'Nova Pixel',
      floor: '0.48 ETH',
      items: 120,
      seed: 'chroma1',
      avatars: ['av11', 'av12', 'av13'],
      tag: 'generative',
    },
    {
      title: 'Neon Phantoms',
      artist: 'Zeynep Alt',
      floor: '1.20 ETH',
      items: 88,
      seed: 'neon7',
      avatars: ['av21', 'av22', 'av23'],
      tag: 'illustration',
    },
    {
      title: 'Void Frequencies',
      artist: 'LMNOP Studio',
      floor: '0.72 ETH',
      items: 200,
      seed: 'voidf',
      avatars: ['av31', 'av32', 'av33'],
      tag: '3d',
    },
    {
      title: 'Sacred Geometry',
      artist: 'Orion Flux',
      floor: '2.05 ETH',
      items: 64,
      seed: 'sacred1',
      avatars: ['av41', 'av42', 'av43'],
      tag: 'generative',
    },
    {
      title: 'Urban Reverie',
      artist: 'Maren Cole',
      floor: '0.31 ETH',
      items: 150,
      seed: 'urban9',
      avatars: ['av51', 'av52', 'av53'],
      tag: 'photography',
    },
    {
      title: 'Data Blooms',
      artist: 'Kai Tanaka',
      floor: '0.95 ETH',
      items: 77,
      seed: 'bloom2',
      avatars: ['av61', 'av62', 'av63'],
      tag: '3d',
    },
  ];

  protected readonly artists: Artist[] = [
    {
      name: 'Nova Pixel',
      handle: '@novapixel',
      vol: '142.3 ETH',
      works: 312,
      seed: 'artist1',
      rank: '01',
      pct: 68,
    },
    {
      name: 'Zeynep Alt',
      handle: '@zeynep_alt',
      vol: '98.7 ETH',
      works: 89,
      seed: 'artist2',
      rank: '02',
      pct: 47,
    },
    {
      name: 'LMNOP Studio',
      handle: '@lmnop',
      vol: '210.1 ETH',
      works: 44,
      seed: 'artist3',
      rank: '03',
      pct: 100,
    },
    {
      name: 'Orion Flux',
      handle: '@orionflux',
      vol: '55.0 ETH',
      works: 190,
      seed: 'artist4',
      rank: '04',
      pct: 26,
    },
    {
      name: 'Maren Cole',
      handle: '@marencole',
      vol: '77.4 ETH',
      works: 130,
      seed: 'artist5',
      rank: '05',
      pct: 37,
    },
    {
      name: 'Kai Tanaka',
      handle: '@kai_t',
      vol: '186.8 ETH',
      works: 65,
      seed: 'artist6',
      rank: '06',
      pct: 89,
    },
  ];

  protected readonly carouselArt = [
    { title: 'Prismatic Loop #7', price: '0.62 ETH', seed: 'crs1' },
    { title: 'Spectral Entity', price: '1.40 ETH', seed: 'crs2' },
    { title: 'Gradient Rift', price: '0.88 ETH', seed: 'crs3' },
    { title: 'Holo Ghost', price: '2.10 ETH', seed: 'crs4' },
    { title: 'Refracted Light #3', price: '0.51 ETH', seed: 'crs5' },
  ];

  protected readonly auctions: Auction[] = [
    {
      title: 'Iridescent Being #001',
      artist: 'Nova Pixel',
      bid: '3.20 ETH',
      bidder: '0x8f3a…d1c9',
      bids: 24,
      seed: 'auc1',
      aseed: 'av11',
      h: '02',
      m: '01',
      s: '00',
    },
    {
      title: 'Hologram Reverie',
      artist: 'LMNOP Studio',
      bid: '1.85 ETH',
      bidder: '0x2b9e…f440',
      bids: 11,
      seed: 'auc2',
      aseed: 'av31',
      h: '05',
      m: '07',
      s: '10',
    },
    {
      title: 'Spectral Overture',
      artist: 'Kai Tanaka',
      bid: '0.97 ETH',
      bidder: '0x7d21…8b02',
      bids: 6,
      seed: 'auc3',
      aseed: 'av61',
      h: '01',
      m: '00',
      s: '10',
    },
  ];

  protected readonly bidsTable = [
    { from: '0x8f3a…d1c9', amount: '3.20 ETH', time: '2 min ago', flag: 'success' },
    { from: '0x7d21…8b02', amount: '2.95 ETH', time: '8 min ago', flag: 'neutral' },
    { from: '0x4ac7…e331', amount: '2.70 ETH', time: '15 min ago', flag: 'neutral' },
    { from: '0x1bf0…9924', amount: '2.40 ETH', time: '31 min ago', flag: 'neutral' },
  ];

  protected readonly howItWorks = [
    { title: 'Connect Wallet', desc: 'Link MetaMask, WalletConnect or any EVM wallet in seconds.' },
    {
      title: 'Discover & Bid',
      desc: 'Browse curated drops, trending collections and live auctions.',
    },
    {
      title: 'Mint or Purchase',
      desc: 'Bid, buy now, or mint directly from verified creator drops.',
    },
    {
      title: 'Own Your Art',
      desc: 'Receive your piece on-chain. Display, resell, or gift it anytime.',
    },
  ];

  protected readonly faqs = [
    {
      q: 'What wallets are supported?',
      a: 'Prism supports MetaMask, WalletConnect, Coinbase Wallet, and all major EVM-compatible wallets. More chains coming soon.',
    },
    {
      q: 'How are royalties handled?',
      a: 'Creators earn a configurable royalty (up to 10%) on every secondary sale, enforced on-chain.',
    },
    {
      q: 'Is curation editorial or algorithmic?',
      a: 'Both. Our editorial team hand-picks Featured Drops; Trending collections are ranked by on-chain activity.',
    },
    {
      q: 'What are the platform fees?',
      a: 'Prism takes a flat 2.5% fee on completed sales — one of the lowest in the market.',
    },
    {
      q: 'Can I sell photography or AI-assisted work?',
      a: 'Yes. Any digital work is welcome as long as you hold the rights. AI-assisted pieces must be disclosed in the listing.',
    },
  ];

  protected readonly creatorFeatures = [
    '2.5% platform fee',
    'Up to 10% royalties',
    'On-chain provenance',
    'Gas-optimised minting',
  ];

  protected readonly footerLinks = [
    {
      heading: 'Marketplace',
      links: ['Explore', 'Collections', 'Live Auctions', 'New Drops', 'Rankings'],
    },
    {
      heading: 'Creators',
      links: ['Apply to Create', 'Creator Hub', 'Royalties', 'Verify Identity', 'Brand Kit'],
    },
    { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Press', 'Contact'] },
    { heading: 'Legal', links: ['Terms', 'Privacy', 'Cookie Policy', 'DMCA', 'Accessibility'] },
  ];

  protected readonly social = ['twitter', 'youtube', 'linkedin', 'github'];
}
