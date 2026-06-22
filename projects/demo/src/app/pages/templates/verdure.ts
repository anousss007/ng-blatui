import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { BuiAvatar, BuiBadge, BuiChart, type ChartSeries } from 'ng-blatui';

import { Lucide } from './lucide';

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface Initiative {
  title: string;
  region: string;
  tag: string;
  tone: Tone;
  imgSeed: string;
  trees: string;
  desc: string;
}

/** Verdure — environmental / reforestation charity, earthy moss + cream palette. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-verdure',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, BuiBadge, BuiChart, Lucide],
  templateUrl: './verdure.html',
  styleUrl: './verdure.css',
})
export class VerdureTemplate {
  protected readonly nav = [
    { label: 'Mission', href: '#mission' },
    { label: 'Impact', href: '#impact' },
    { label: 'Initiatives', href: '#initiatives' },
    { label: 'FAQ', href: '#faq' },
  ];

  protected readonly impactStats = [
    { value: '4.2M', label: 'Trees planted', icon: 'tree-pine' },
    { value: '18,400 t', label: 'CO₂ removed', icon: 'wind' },
    { value: '96', label: 'Ecosystems restored', icon: 'globe' },
    { value: '230k+', label: 'Community members', icon: 'users' },
  ];

  protected readonly goals = [
    { label: 'Reforestation (2025 target)', value: 74 },
    { label: 'Carbon sequestration (annual)', value: 58 },
    { label: 'Wetland restoration (5-yr plan)', value: 41 },
    { label: 'Seed diversity preserved', value: 88 },
  ];

  protected readonly co2Series: ChartSeries[] = [
    {
      name: 'CO₂ Removed (t)',
      data: [
        820, 1240, 1580, 2100, 2750, 3410, 4200, 5050, 6300, 7800, 9400, 11_200, 13_800, 16_500,
        18_400,
      ],
    },
  ];
  protected readonly co2Labels = [
    "Q1'22",
    "Q2'22",
    "Q3'22",
    "Q4'22",
    "Q1'23",
    "Q2'23",
    "Q3'23",
    "Q4'23",
    "Q1'24",
    "Q2'24",
    "Q3'24",
    "Q4'24",
    "Q1'25",
    "Q2'25",
    "Q3'25",
  ];

  protected readonly values = [
    {
      icon: 'leaf',
      title: 'Regenerative by design',
      desc: 'Every initiative follows restorative principles — we give back more than we take, building living ecosystems that thrive for decades.',
    },
    {
      icon: 'flask-conical',
      title: 'Science-led',
      desc: 'Our programmes are peer-reviewed by ecologists and climate scientists. Measurable outcomes, independently verified.',
    },
    {
      icon: 'heart-handshake',
      title: 'Community-first',
      desc: 'Local stewards shape every project. We believe the people closest to the land are its best guardians.',
    },
    {
      icon: 'shield-check',
      title: 'Radical transparency',
      desc: 'Impact dashboards, annual audits, and live satellite data — every tonne of carbon, every tree, fully traceable.',
    },
    {
      icon: 'sun',
      title: 'Solar-powered ops',
      desc: 'Our field stations, cold chains and offices run on 100% renewable energy. We walk the talk.',
    },
    {
      icon: 'sprout',
      title: 'Seed sovereignty',
      desc: 'We maintain open-access seed libraries for 1,200 native species, free to local farmers and schools.',
    },
  ];

  protected readonly howItWorks = [
    {
      title: 'Choose your impact',
      desc: 'Browse verified reforestation, wetland, and soil projects. Filter by biome, community or carbon potential.',
    },
    {
      title: 'Pledge a contribution',
      desc: 'One-off or monthly giving. Your funds flow directly to on-the-ground stewards — 91 cents of every euro.',
    },
    {
      title: 'Track in real time',
      desc: 'Watch satellite imagery update as your trees grow. Receive a verified impact certificate each quarter.',
    },
    {
      title: 'Compound the effect',
      desc: 'Share your milestone with your network. Every referral unlocks an extra seedling planted in your name.',
    },
  ];

  protected readonly initiativeTabs = ['Forests', 'Wetlands & Peat', 'Soil & Seeds'];
  /** First (active) tab: the three forest initiatives. */
  protected readonly forests: Initiative[] = [
    {
      title: 'Atlantic Forest Revival',
      region: 'Brazil',
      tag: 'Reforestation',
      tone: 'success',
      imgSeed: 'verdure-brazil',
      trees: '1.2M',
      desc: "Restoring a corridor of the world's most biodiverse forest, linking fragmented habitats across 120 km of Atlantic coast.",
    },
    {
      title: 'Scottish Peatland Rewild',
      region: 'Scotland',
      tag: 'Carbon sink',
      tone: 'info',
      imgSeed: 'verdure-scotland',
      trees: '48k ha',
      desc: 'Rewetting 48,000 hectares of degraded peat — the most carbon-dense terrestrial ecosystem on Earth.',
    },
    {
      title: 'Sahel Green Wall',
      region: 'West Africa',
      tag: 'Agroforestry',
      tone: 'warning',
      imgSeed: 'verdure-sahel',
      trees: '860k',
      desc: 'Farmer-managed natural regeneration across six nations, restoring food security and halting desertification.',
    },
  ];

  protected readonly galleryImages = [
    {
      thumb: 'https://picsum.photos/seed/verd-g1/400/400',
      alt: 'Aerial view of reforested hillside',
    },
    { thumb: 'https://picsum.photos/seed/verd-g2/400/400', alt: 'Community tree planting event' },
    { thumb: 'https://picsum.photos/seed/verd-g3/400/400', alt: 'Mangrove coastal restoration' },
    {
      thumb: 'https://picsum.photos/seed/verd-g4/400/400',
      alt: 'Wetland birds returning after restoration',
    },
    {
      thumb: 'https://picsum.photos/seed/verd-g5/400/400',
      alt: 'Seed library and native species collection',
    },
    {
      thumb: 'https://picsum.photos/seed/verd-g6/400/400',
      alt: 'Field scientist measuring tree growth',
    },
    {
      thumb: 'https://picsum.photos/seed/verd-g7/400/400',
      alt: 'Solar-powered field station at dawn',
    },
    {
      thumb: 'https://picsum.photos/seed/verd-g8/400/400',
      alt: 'Children in reforestation education programme',
    },
  ];

  protected readonly partners = [
    'Earthwatch',
    'WWF',
    'IUCN',
    'Carbon Trust',
    'Rainforest Alliance',
    'GreenPeace',
    'The Nature Conservancy',
    'EcoAct',
    'Gold Standard',
    'Verra',
  ];

  protected readonly testimonials = [
    {
      q: 'Verdure gave our offsetting programme real teeth. Satellite updates, soil samples, community reports — we can show our board actual impact, not just a number.',
      a: 'Miriam van Houten',
      r: 'Head of Sustainability, Renova Group',
      img: 'https://picsum.photos/seed/verd-t1/160/160',
    },
    {
      q: "As a smallholder farmer in the Sahel, Verdure's agroforestry training changed everything. My yields doubled and the land is alive again.",
      a: 'Moussa Coulibaly',
      r: 'Community Steward, Mali',
      img: 'https://picsum.photos/seed/verd-t2/160/160',
    },
    {
      q: 'The science is impeccable. Independent verification, peer-reviewed methodology, transparent data. This is what serious climate action looks like.',
      a: 'Dr. Lin Zhao',
      r: 'Climate Researcher, ETH Zürich',
      img: 'https://picsum.photos/seed/verd-t3/160/160',
    },
  ];

  protected readonly faqs = [
    {
      q: 'How is my contribution used?',
      a: 'At least 91% of every pledge goes directly to on-the-ground project costs — labour, seedlings, equipment and community wages. The remainder covers auditing and operations.',
    },
    {
      q: 'Are the carbon figures independently verified?',
      a: "Yes. Every tonne reported is verified against Verra's VM0047 or Gold Standard protocols by accredited third-party auditors. Certificates are publicly downloadable.",
    },
    {
      q: 'Can my company sponsor an entire initiative?',
      a: "Absolutely. Corporate partners can co-brand and exclusively fund a project area from €12,000/yr. You'll receive branded impact reports, satellite imagery, and on-site plaque recognition.",
    },
    {
      q: 'What happens if a project underperforms?',
      a: 'We maintain a buffer pool of verified credits. If a site falls short of targets, buffer credits are automatically allocated so your reported impact is never compromised.',
    },
    {
      q: 'Can I visit a project site?',
      a: 'Yes — Verdure runs annual stewardship journeys for supporters. These are small-group, low-impact visits led by our local partners. Spaces are limited; apply via your dashboard.',
    },
  ];

  protected readonly footerLinks = [
    {
      heading: 'Restore',
      links: ['Reforestation', 'Wetlands', 'Peatlands', 'Agroforestry', 'Blue Carbon'],
    },
    {
      heading: 'Learn',
      links: ['Impact Reports', 'Science Hub', 'Field Stories', 'Glossary', 'Press Kit'],
    },
    {
      heading: 'Engage',
      links: ['Individual giving', 'Corporate plans', 'Schools', 'Events', 'Ambassador'],
    },
    { heading: 'About', links: ['Our mission', 'Team', 'Advisors', 'Careers', 'Contact'] },
  ];

  protected readonly heroBadges = [
    { n: '4.2M', l: 'trees' },
    { n: '18,400 t', l: 'CO₂' },
    { n: '96', l: 'ecosystems' },
  ];
  protected readonly heroAvatars = ['verd-av1', 'verd-av2', 'verd-av3', 'verd-av4'];
  protected readonly socials = ['instagram', 'twitter', 'linkedin', 'youtube'];
  protected readonly footerLegal = ['Privacy', 'Terms', 'Cookie policy'];

  protected pad(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
}
