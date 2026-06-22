import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { BuiAvatar, BuiBanner, BuiMarquee, BuiRating } from 'ng-blatui';

import { Lucide } from './lucide';

interface Destination {
  key: string;
  label: string;
  icon: string;
  title: string;
  desc: string;
  img: string;
  duration: string;
  altitude: string;
  crew: string;
  price: string;
}
interface Package {
  name: string;
  tag: string;
  price: string;
  rating: number;
  highlight: boolean;
  badge: string | null;
  img: string;
  features: string[];
}

/** Cosmos — "Orbital", a cinematic space-tourism landing page. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-cosmos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, BuiBanner, BuiMarquee, BuiRating, Lucide],
  templateUrl: './cosmos.html',
  styleUrl: './cosmos.css',
})
export class CosmosTemplate {
  protected readonly navLinks = [
    { label: 'Destinations', href: '#destinations' },
    { label: 'Experience', href: '#experience' },
    { label: 'Packages', href: '#packages' },
    { label: 'Crew', href: '#crew' },
    { label: 'FAQ', href: '#faq' },
  ];

  protected readonly partners = [
    'NASA Partners',
    'ESA Alumni',
    'SpaceX Crew',
    'MIT AeroAstro',
    'Blue Origin',
    'JAXA Collab',
    'Stanford SSI',
    'CNES France',
    'DLR Germany',
  ];

  /** Static launch countdown (Ares-1 · Nov 14 2026) — SSR-safe, no live timer. */
  protected readonly countdown = [
    { num: '145', label: 'Days' },
    { num: '06', label: 'Hours' },
    { num: '42', label: 'Min' },
    { num: '18', label: 'Sec' },
  ];

  protected readonly stats = [
    { v: '38', l: 'Crewed missions' },
    { v: '100%', l: 'Crew return rate' },
    { v: '147', l: 'Civilians flown' },
    { v: '3', l: 'Destinations' },
  ];

  protected readonly destinations: Destination[] = [
    {
      key: 'orbit',
      label: 'Low Orbit',
      icon: 'orbit',
      title: 'Earth from 400 km',
      desc: 'Spend 3 days aboard the Orbital Station, floating above the curvature of Earth with a view no photograph can capture. Witness 16 sunrises per day.',
      img: 'https://picsum.photos/seed/orbit-earth/900/500',
      duration: '3 days',
      altitude: '408 km',
      crew: '6 passengers',
      price: '$495,000',
    },
    {
      key: 'lunar',
      label: 'Lunar Gateway',
      icon: 'moon',
      title: 'Cislunar Space',
      desc: 'Join the Lunar Gateway crew 60,000 km beyond the Moon. No human has travelled this far since Apollo 17. You will be one of a handful who have.',
      img: 'https://picsum.photos/seed/lunar-gateway/900/500',
      duration: '8 days',
      altitude: '60,000 km',
      crew: '4 passengers',
      price: '$2.1M',
    },
    {
      key: 'mars',
      label: 'Mars Flyby',
      icon: 'globe',
      title: 'Red Planet Passage',
      desc: 'The ultimate voyage: a 210-day transit looping around Mars at 600 km. Close enough to see Olympus Mons with the naked eye.',
      img: 'https://picsum.photos/seed/mars-planet/900/500',
      duration: '210 days',
      altitude: '600 km',
      crew: '2 passengers',
      price: '$55M',
    },
  ];

  protected readonly experiences = [
    {
      icon: 'wind',
      title: 'Zero-G Adaptation',
      desc: 'Three days of pre-flight zero-gravity training in our parabolic aircraft — 30 seconds of weightlessness, repeated 20 times a session.',
      img: 'https://picsum.photos/seed/zerog-float/600/400',
      tag: 'Pre-flight',
    },
    {
      icon: 'eye',
      title: 'The Cupola Window',
      desc: 'A 360° panoramic dome 1.2 m wide. The largest window ever flown in space — designed for photography, reflection, and pure awe.',
      img: 'https://picsum.photos/seed/cupola-view/600/400',
      tag: 'On-board',
    },
    {
      icon: 'dumbbell',
      title: 'Astronaut Training',
      desc: 'Six months of Mission Readiness at our Houston campus: EVA simulation, emergency procedures, Russian language, and spacecraft systems.',
      img: 'https://picsum.photos/seed/astro-train/600/400',
      tag: 'Preparation',
    },
    {
      icon: 'sparkles',
      title: 'Spacewalk (EVA)',
      desc: 'Step outside. Premium packages include a fully supervised EVA — you, a pressurised suit, and the silent black of open space.',
      img: 'https://picsum.photos/seed/spacewalk-eva/600/400',
      tag: 'Add-on',
    },
  ];

  protected readonly gallery = [
    { img: 'https://picsum.photos/seed/cosmos-launch/900/600', alt: 'Rocket launch at night' },
    { img: 'https://picsum.photos/seed/cosmos-earth2/900/600', alt: 'Earth from orbit' },
    { img: 'https://picsum.photos/seed/cosmos-dock/900/600', alt: 'Orbital docking sequence' },
    { img: 'https://picsum.photos/seed/cosmos-suit/900/600', alt: 'Spacewalk EVA crew' },
    { img: 'https://picsum.photos/seed/cosmos-mars3/900/600', alt: 'Mars horizon flyby' },
  ];

  protected readonly packages: Package[] = [
    {
      name: 'Horizon',
      tag: 'Low Orbit · 3 days',
      price: '$495,000',
      rating: 4,
      highlight: false,
      badge: null,
      img: 'https://picsum.photos/seed/pkg-horizon/600/340',
      features: [
        'Orbital Station berth',
        'Zero-G training (3 days)',
        'Private cupola session',
        'Commemorative EVA suit',
      ],
    },
    {
      name: 'Selene',
      tag: 'Lunar Gateway · 8 days',
      price: '$2.1M',
      rating: 5,
      highlight: true,
      badge: 'Most popular',
      img: 'https://picsum.photos/seed/pkg-selene/600/340',
      features: [
        'Cislunar trajectory',
        'Full astronaut training',
        'Private sleeping quarters',
        'EVA add-on eligible',
        '24/7 mission support',
      ],
    },
    {
      name: 'Ares',
      tag: 'Mars Flyby · 210 days',
      price: '$55M',
      rating: 5,
      highlight: false,
      badge: 'Expedition',
      img: 'https://picsum.photos/seed/pkg-ares/600/340',
      features: [
        'Mars flyby trajectory',
        'Full crew integration',
        'Scientific payload slot',
        'Included EVA × 3',
        'Custom mission patch',
      ],
    },
  ];

  protected readonly steps = [
    {
      title: 'Choose your mission',
      desc: 'Browse our three destinations and select the package that matches your ambition and timeline. Our advisors are available 24/7.',
      icon: 'map-pin',
    },
    {
      title: 'Medical evaluation',
      desc: 'Complete a standard astronaut physical with our partner clinics worldwide. Most candidates qualify within 2 weeks.',
      icon: 'heart-pulse',
    },
    {
      title: 'Mission Readiness training',
      desc: 'Six-month programme at our Houston campus. Zero-G flights, EVA simulation, and spacecraft systems certification.',
      icon: 'graduation-cap',
    },
    {
      title: 'Secure your reservation',
      desc: 'A 10% deposit holds your berth. Balance due 90 days before launch. Finance options available.',
      icon: 'credit-card',
    },
    {
      title: 'Launch day',
      desc: 'Transfer to the launch facility 5 days prior. T-0 and you leave Earth behind.',
      icon: 'rocket',
    },
  ];

  protected readonly stepLabels = [
    'Choose Mission',
    'Medical Check',
    'Training',
    'Payment',
    'Launch',
  ];

  protected readonly readiness = [
    { label: 'Physical fitness', val: 82 },
    { label: 'Technical aptitude', val: 67 },
    { label: 'Psychological resilience', val: 91 },
    { label: 'Zero-G adaptation', val: 54 },
    { label: 'Mission systems knowledge', val: 73 },
  ];

  protected readonly crew = [
    { name: 'Cmdr. Nadia Voss', role: 'Mission Commander', flights: 4, seed: '10/80' },
    { name: 'Dr. Felix Obara', role: 'Chief Medical Officer', flights: 2, seed: '20/80' },
    { name: 'Yuki Tanaka', role: 'Flight Engineer', flights: 3, seed: '30/80' },
    { name: 'Sara Al-Rashid', role: 'Science Lead', flights: 1, seed: '40/80' },
    { name: 'Mikhail Petrov', role: 'EVA Specialist', flights: 5, seed: '50/80' },
    { name: 'Lena Hartmann', role: 'Propulsion Eng.', flights: 2, seed: '60/80' },
  ];

  protected readonly milestones = [
    {
      year: '2019',
      title: 'Founded',
      desc: 'Orbital established with a single ambition: safe, affordable commercial spaceflight.',
    },
    {
      year: '2021',
      title: 'First Uncrewed',
      desc: 'Aurora-1 completes 12 orbital laps and re-enters with a 0.0 m/s vert-velocity error.',
    },
    {
      year: '2023',
      title: 'First Civilians',
      desc: 'Horizon-1 carries 4 private passengers to the Orbital Station for 3 days.',
    },
    {
      year: '2025',
      title: 'Lunar Gateway',
      desc: 'Selene-1 becomes the first non-government vehicle to reach cislunar space.',
    },
    {
      year: '2028',
      title: 'Mars Flyby',
      desc: 'Ares-1 departs for Mars — the farthest any civilian has ever travelled.',
    },
  ];

  protected readonly faqs = [
    {
      q: 'Do I need prior flight experience?',
      a: 'No prior flight experience is required. Our six-month Mission Readiness programme is included in Selene and Ares packages — it is designed to prepare civilians with no background in aviation.',
    },
    {
      q: 'What are the health requirements?',
      a: 'Passengers must pass a standard astronaut medical evaluation (blood pressure, cardiovascular fitness, vestibular function). Most healthy adults aged 18–70 qualify. We work with leading aerospace physicians to support candidates near the thresholds.',
    },
    {
      q: 'How is my safety guaranteed?',
      a: 'Every Orbital vehicle has flown uncrewed and crewed test missions. We have a 100% crew-return record across 38 missions. Redundant life support, autonomous abort systems, and a dedicated flight surgeon on every mission.',
    },
    {
      q: 'Can I bring personal items?',
      a: 'Each passenger is allocated 2 kg of personal cargo. Items that have flown to space hold significant sentimental (and re-sale) value. Orbital provides a certified manifest and certificate of flight.',
    },
    {
      q: 'What does the price include?',
      a: 'All training, transportation to the launch site, pre-flight quarantine accommodation, the flight itself, post-flight medical evaluation, and a full-resolution mission media package. Horizon: excludes EVA. Selene / Ares: fully all-inclusive.',
    },
  ];

  protected readonly footer = [
    { heading: 'Missions', links: ['Low Orbit', 'Lunar Gateway', 'Mars Flyby', 'Custom Mission'] },
    { heading: 'Company', links: ['About Orbital', 'Careers', 'Press', 'Investors', 'Contact'] },
    {
      heading: 'Safety',
      links: ['Safety Record', 'Medical FAQ', 'Mission Readiness', 'Insurance'],
    },
    { heading: 'Legal', links: ['Privacy Policy', 'Terms', 'Liability Waiver', 'Cookies'] },
  ];

  protected readonly social = ['twitter', 'youtube', 'linkedin', 'github'];
  protected readonly ctaAvatars = ['crew-10/80', 'crew-20/80', 'crew-30/80', 'crew-40/80'];
}
