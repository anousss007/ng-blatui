import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { BuiAvatar, BuiBadge, BuiBanner, BuiMarquee, BuiRating } from 'ng-blatui';

import { Lucide } from './lucide';

interface Coffee {
  name: string;
  origin: string;
  process: string;
  roast: string;
  roastLevel: number;
  desc: string;
  price: number;
  rating: number;
  reviews: number;
  badge: string | null;
  seed: string;
  new: boolean;
}
interface BrewMethod {
  key: string;
  label: string;
  icon: string;
  ratio: string;
  grind: string;
  temp: string;
  time: string;
  steps: string[];
  img: string;
}

/** Brew — specialty coffee roasters, warm kraft/paper aesthetic. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-brew',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, BuiBadge, BuiBanner, BuiMarquee, BuiRating, Lucide],
  templateUrl: './brew.html',
  styleUrl: './brew.css',
})
export class BrewTemplate {
  protected readonly navLinks = [
    { label: 'Our Coffees', href: '#shop' },
    { label: 'Subscribe', href: '#subscribe' },
    { label: 'Origins', href: '#story' },
    { label: 'Brew Guide', href: '#guide' },
  ];

  protected readonly coffees: Coffee[] = [
    {
      name: 'Yirgacheffe Dawn',
      origin: 'Ethiopia',
      process: 'Washed',
      roast: 'Light',
      roastLevel: 20,
      desc: 'Jasmine florals, bergamot zest, lemon custard.',
      price: 18.5,
      rating: 5,
      reviews: 214,
      badge: 'Single Origin',
      seed: 'coffee1',
      new: true,
    },
    {
      name: 'Huila Honey',
      origin: 'Colombia',
      process: 'Honey',
      roast: 'Medium',
      roastLevel: 45,
      desc: 'Stone fruit, milk chocolate, brown sugar finish.',
      price: 17,
      rating: 5,
      reviews: 187,
      badge: 'Bestseller',
      seed: 'coffee2',
      new: false,
    },
    {
      name: 'Sumatra Mandheling',
      origin: 'Indonesia',
      process: 'Wet-hulled',
      roast: 'Dark',
      roastLevel: 80,
      desc: 'Dark cocoa, cedar smoke, earthy velvet body.',
      price: 16,
      rating: 4,
      reviews: 132,
      badge: null,
      seed: 'coffee3',
      new: false,
    },
    {
      name: 'Gesha Naturale',
      origin: 'Panama',
      process: 'Natural',
      roast: 'Light',
      roastLevel: 25,
      desc: 'Rose, tropical guava, cascading peach sweetness.',
      price: 32,
      rating: 5,
      reviews: 98,
      badge: 'Rare Find',
      seed: 'coffee4',
      new: true,
    },
    {
      name: 'Bourbon Classic',
      origin: 'Rwanda',
      process: 'Washed',
      roast: 'Medium',
      roastLevel: 55,
      desc: 'Red apple, toffee, gentle spice on the finish.',
      price: 15.5,
      rating: 4,
      reviews: 161,
      badge: null,
      seed: 'coffee5',
      new: false,
    },
    {
      name: 'Espresso Blend No.7',
      origin: 'Blend',
      process: 'Various',
      roast: 'Medium-Dark',
      roastLevel: 65,
      desc: 'Dark cherry, dark choc, crema that lingers.',
      price: 16.5,
      rating: 5,
      reviews: 309,
      badge: 'Blend',
      seed: 'coffee6',
      new: false,
    },
  ];

  protected readonly cart = [
    { name: 'Yirgacheffe Dawn', price: 18.5, qty: 1, seed: 'coffee1' },
    { name: 'Huila Honey', price: 17, qty: 2, seed: 'coffee2' },
  ];
  protected readonly cartSubtotal = '52.50';

  protected readonly brewMethods: BrewMethod[] = [
    {
      key: 'pour-over',
      label: 'Pour-Over',
      icon: 'droplets',
      ratio: '1:16',
      grind: 'Medium-Fine',
      temp: '93 °C',
      time: '3–4 min',
      steps: [
        'Rinse filter, discard water',
        'Bloom with 60 ml for 45 s',
        'Pour in slow concentric circles',
        'Total brew 450 ml',
        'Serve & enjoy immediately',
      ],
      img: 'brew-pour',
    },
    {
      key: 'espresso',
      label: 'Espresso',
      icon: 'zap',
      ratio: '1:2',
      grind: 'Fine',
      temp: '92 °C',
      time: '25–30 s',
      steps: [
        'Dial in 18 g dose',
        'Tamp level at 30 lb',
        'Lock and pre-infuse 5 s',
        'Pull 36 g in 28 s',
        'Taste, adjust grind if needed',
      ],
      img: 'brew-esp',
    },
    {
      key: 'french-press',
      label: 'French Press',
      icon: 'coffee',
      ratio: '1:12',
      grind: 'Coarse',
      temp: '96 °C',
      time: '4 min',
      steps: [
        'Add 30 g coarse grounds',
        'Pour 360 ml off-boil',
        'Stir gently, put lid on',
        'Steep 4 minutes',
        'Press slowly over 30 s',
      ],
      img: 'brew-fp',
    },
    {
      key: 'cold-brew',
      label: 'Cold Brew',
      icon: 'snowflake',
      ratio: '1:8',
      grind: 'Coarse',
      temp: 'Cold',
      time: '12–18 h',
      steps: [
        'Add 100 g coarse grounds to jar',
        'Pour 800 ml cold filtered water',
        'Stir, seal and refrigerate',
        'Steep 12–18 hours',
        'Strain through filter, serve over ice',
      ],
      img: 'brew-cb',
    },
  ];

  protected readonly methodParams = ['Ratio', 'Grind', 'Temp', 'Time'];

  protected readonly reviews = [
    {
      q: 'The Yirgacheffe Dawn changed how I think about light roasts. It brews like tea but drinks like a revelation.',
      a: 'Marta Osei',
      r: 'Home barista, Berlin',
      seed: 'face1',
      rating: 5,
    },
    {
      q: 'Subscription is seamless — fresh bag every two weeks, grind dialled to my espresso machine. Never going back to supermarket beans.',
      a: 'Tom Cavalier',
      r: 'Café owner, Lyon',
      seed: 'face2',
      rating: 5,
    },
    {
      q: 'The Gesha Naturale is worth every cent. I get compliments from guests every single time I serve it.',
      a: 'Priya Anand',
      r: 'Food blogger, Mumbai',
      seed: 'face3',
      rating: 5,
    },
    {
      q: 'Kraft packaging is genuinely resealable, beans arrive within days of roasting. This is the real deal.',
      a: 'James Fallon',
      r: 'Coffee enthusiast, Dublin',
      seed: 'face4',
      rating: 4,
    },
  ];

  protected readonly roastGuide = [
    { name: 'Yirgacheffe Dawn', level: 20 },
    { name: 'Gesha Naturale', level: 25 },
    { name: 'Huila Honey', level: 45 },
    { name: 'Bourbon Classic', level: 55 },
    { name: 'Espresso Blend No.7', level: 65 },
    { name: 'Sumatra Mandheling', level: 80 },
  ];

  protected readonly faqs = [
    {
      q: 'When do you roast?',
      a: 'Every Monday and Thursday. Bags are shipped the same day so you receive beans within 48 hours of leaving the drum.',
    },
    {
      q: 'Can I choose my grind?',
      a: 'Yes — whole bean, coarse (French Press / Cold Brew), medium, medium-fine (Pour-Over / AeroPress) or fine (Espresso / Moka Pot).',
    },
    {
      q: 'How does the subscription work?',
      a: 'Pick a coffee, bag size, grind and delivery frequency. Pause, skip or cancel any time from your account — no phone calls.',
    },
    {
      q: 'Is the packaging recyclable?',
      a: 'Our kraft bags are home-compostable and the tins are infinitely recyclable. We offset all shipping emissions.',
    },
    {
      q: 'Do you offer wholesale?',
      a: 'Yes — cafés and restaurants get preferred pricing, dedicated sourcing and a free cupping session. Email hello@brew.coffee.',
    },
  ];

  protected readonly values = [
    'Small-batch roasting',
    'Direct trade',
    'Carbon-neutral delivery',
    'Home-compostable packaging',
    'Freshness guarantee',
    'Farmer-first pricing',
    'Zero-waste lab',
    'Traceable to the farm',
  ];
  protected readonly origins = ['Ethiopia', 'Colombia', 'Panama', 'Rwanda', 'Indonesia'];

  protected readonly grindOptions = [
    'Whole Bean',
    'Coarse (French Press / Cold Brew)',
    'Medium (Drip / AeroPress)',
    'Medium-Fine (Pour-Over)',
    'Fine (Espresso / Moka Pot)',
  ];
  protected readonly sizeOptions = [
    '250 g — €16–€32',
    '500 g — €30–€60 (save 8%)',
    '1 kg — €55–€110 (save 14%)',
  ];
  protected readonly freqOptions = [
    'Every week',
    'Every 2 weeks (most popular)',
    'Every 3 weeks',
    'Every 4 weeks',
  ];
  protected readonly subSteps = ['1. Pick Coffee', '2. Grind & Size', '3. Schedule'];

  protected readonly gallery = [
    { thumb: 'https://picsum.photos/seed/brewg1/600/600', alt: 'Coffee farm at sunrise' },
    { thumb: 'https://picsum.photos/seed/brewg2/600/600', alt: 'Sorting coffee cherries by hand' },
    { thumb: 'https://picsum.photos/seed/brewg3/600/600', alt: 'Roasting drum interior' },
    { thumb: 'https://picsum.photos/seed/brewg4/600/600', alt: 'Freshly pulled espresso shot' },
    { thumb: 'https://picsum.photos/seed/brewg5/600/600', alt: 'Barista pouring latte art' },
    { thumb: 'https://picsum.photos/seed/brewg6/600/600', alt: 'Kraft bag sealed on roast-day' },
  ];

  protected readonly footerLinks = [
    {
      heading: 'Roastery',
      links: ['Our Story', 'The Roasters', 'Sourcing', 'Sustainability', 'Press'],
    },
    {
      heading: 'Shop',
      links: ['All Coffees', 'Subscriptions', 'Gift Cards', 'Merchandise', 'Sale'],
    },
    {
      heading: 'Brew Help',
      links: ['Brewing Guides', 'Grind Chart', 'Track Order', 'Returns', 'Contact'],
    },
  ];

  protected readonly social = ['instagram', 'twitter', 'youtube'];

  protected roastClass(roast: string): string {
    switch (roast.toLowerCase()) {
      case 'light': {
        return 'brew-badge-light';
      }
      case 'medium': {
        return 'brew-badge-medium';
      }
      case 'medium-dark': {
        return 'brew-badge-medium-dark';
      }
      default: {
        return 'brew-badge-dark';
      }
    }
  }
}
