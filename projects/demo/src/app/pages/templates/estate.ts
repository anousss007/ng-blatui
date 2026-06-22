import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { BuiAvatar, BuiBadge } from 'ng-blatui';

import { Lucide } from './lucide';

type Tone = 'success' | 'warning';

interface Listing {
  seed: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: string;
  badge: string;
  badgeTone: Tone;
}
interface Neighbourhood {
  key: string;
  label: string;
  desc: string;
  imgSeed: string;
  highlights: string[];
}
interface Testimonial {
  q: string;
  author: string;
  role: string;
  img: string;
}

/** Estate — "Maison Estates", an ultra-prime European luxury real-estate house (stone/charcoal + gold, Cormorant Garamond). Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-estate',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, BuiBadge, Lucide],
  templateUrl: './estate.html',
  styleUrl: './estate.css',
})
export class EstateTemplate {
  protected readonly nav = [
    { label: 'Properties', href: '#listings' },
    { label: 'Spotlight', href: '#spotlight' },
    { label: 'Neighbourhoods', href: '#neighbourhoods' },
    { label: 'Concierge', href: '#concierge' },
  ];

  protected readonly heroSpecs = [
    { icon: 'bed-double', label: '5 Bedrooms' },
    { icon: 'bath', label: '4 Bathrooms' },
    { icon: 'ruler', label: '6 800 sq ft' },
    { icon: 'map-pin', label: "Cap d'Antibes" },
  ];

  protected readonly listings: Listing[] = [
    {
      seed: 'estate-villa',
      title: 'Villa Aurore',
      location: "Côte d'Azur, France",
      price: '4 250 000',
      beds: 5,
      baths: 4,
      sqft: '6 800',
      badge: 'Exclusive',
      badgeTone: 'warning',
    },
    {
      seed: 'estate-townhouse',
      title: 'Maison Haussmann',
      location: 'Paris 8e, France',
      price: '2 890 000',
      beds: 4,
      baths: 3,
      sqft: '3 200',
      badge: 'New',
      badgeTone: 'success',
    },
    {
      seed: 'estate-chateau',
      title: 'Château de Miraval',
      location: 'Provence, France',
      price: '8 750 000',
      beds: 9,
      baths: 7,
      sqft: '14 200',
      badge: 'Exclusive',
      badgeTone: 'warning',
    },
    {
      seed: 'estate-penthouse',
      title: 'Penthouse Lumière',
      location: 'Monaco',
      price: '12 500 000',
      beds: 3,
      baths: 3,
      sqft: '4 100',
      badge: 'New',
      badgeTone: 'success',
    },
    {
      seed: 'estate-manor',
      title: 'The Manor House',
      location: 'Cotswolds, England',
      price: '3 475 000',
      beds: 7,
      baths: 5,
      sqft: '9 600',
      badge: 'Exclusive',
      badgeTone: 'warning',
    },
    {
      seed: 'estate-lakefront',
      title: 'Villa Lacustre',
      location: 'Lake Geneva, Switzerland',
      price: '6 200 000',
      beds: 6,
      baths: 5,
      sqft: '7 800',
      badge: 'New',
      badgeTone: 'success',
    },
  ];

  protected readonly gallery = [
    {
      src: 'https://picsum.photos/seed/est-gal1/1200/800',
      alt: 'Grand salon with floor-to-ceiling windows',
    },
    {
      src: 'https://picsum.photos/seed/est-gal2/1200/800',
      alt: "Chef's kitchen with marble island",
    },
    {
      src: 'https://picsum.photos/seed/est-gal3/1200/800',
      alt: 'Master suite with private terrace',
    },
    {
      src: 'https://picsum.photos/seed/est-gal4/1200/800',
      alt: 'Infinity pool overlooking the Mediterranean',
    },
    {
      src: 'https://picsum.photos/seed/est-gal5/1200/800',
      alt: 'Manicured formal gardens and parterre',
    },
    { src: 'https://picsum.photos/seed/est-gal6/1200/800', alt: 'Wine cellar and private cinema' },
  ];

  protected readonly specsTable = [
    { label: 'Living Area', value: '6 800 sq ft / 632 m²' },
    { label: 'Plot Size', value: '1.8 acres / 0.73 ha' },
    { label: 'Bedrooms', value: '5 (incl. 2 suites)' },
    { label: 'Bathrooms', value: '4 (3 en-suite)' },
    { label: 'Year Built', value: '1938 (fully restored 2022)' },
    { label: 'Energy Rating', value: 'A+' },
    { label: 'Parking', value: 'Triple garage + 4 exterior' },
    { label: 'Annual Service', value: 'EUR 38 400' },
  ];

  protected readonly amenities = [
    { icon: 'waves', label: 'Heated infinity pool' },
    { icon: 'flame', label: 'Home cinema & wine cellar' },
    { icon: 'dumbbell', label: 'Private gym & spa' },
    { icon: 'tree-pine', label: 'Formal gardens (landscape design)' },
    { icon: 'shield-check', label: '24/7 concierge & security' },
    { icon: 'sun', label: 'Smart home & solar array' },
    { icon: 'utensils', label: 'Summer kitchen & dining pavilion' },
    { icon: 'car', label: 'EV charging & helicopter pad' },
  ];

  protected readonly neighbourhoods: Neighbourhood[] = [
    {
      key: 'riviera',
      label: "Côte d'Azur",
      desc: "From Cap d'Antibes to Saint-Tropez, the French Riviera remains Europe's most coveted address — unrivalled sunshine, crystalline waters and a social calendar without equal.",
      imgSeed: 'estate-nb-riviera',
      highlights: [
        'Cannes Film Festival',
        'Monaco Grand Prix',
        'Nice International Airport 20 min',
        'Michelin-starred restaurants',
      ],
    },
    {
      key: 'paris8',
      label: 'Paris 8e',
      desc: "The golden triangle of haute couture and haute cuisine. Haussmann boulevards, the Arc de Triomphe and the finest private members' clubs in France.",
      imgSeed: 'estate-nb-paris',
      highlights: [
        'Avenue Montaigne',
        'Élysée Palace quarter',
        'Private schools & lycées',
        'Three-minute walk to the Bois de Boulogne',
      ],
    },
    {
      key: 'provence',
      label: 'Provence',
      desc: "Lavender plains, truffle forests and some of France's most acclaimed vineyards. Timeless villages, a luminous palette and an unhurried rhythm.",
      imgSeed: 'estate-nb-provence',
      highlights: [
        'Luberon Natural Park',
        'Les Baux de Provence',
        'Direct TGV to Paris (3h)',
        'Aix-en-Provence market',
      ],
    },
    {
      key: 'monaco',
      label: 'Monaco',
      desc: 'A sovereign principality where privacy, security and prestige converge on a single stunning kilometre of coast. Zero income tax. Absolute discretion.',
      imgSeed: 'estate-nb-monaco',
      highlights: [
        'Principauté de Monaco',
        'Monte-Carlo Casino',
        'Nice Airport 30 min',
        'World-class marina',
      ],
    },
  ];

  protected readonly stats = [
    { value: '€ 2.4B', label: 'Properties sold this year' },
    { value: '14', label: 'Avg days to close' },
    { value: '340+', label: 'Active listings' },
    { value: '98%', label: 'Client satisfaction' },
  ];

  protected readonly testimonials: Testimonial[] = [
    {
      q: 'Maison Estates handled every detail with extraordinary discretion. We found our Provençal estate in three viewings — a process that felt less like a transaction and more like a curated experience.',
      author: 'Isabelle Fontaine',
      role: 'Private client, Provence',
      img: 'https://picsum.photos/seed/client-isabelle/160/160',
    },
    {
      q: 'The level of market intelligence and personal attention surpassed anything we had encountered elsewhere in Europe. Our Monaco penthouse was delivered exactly as promised.',
      author: 'James Ashworth',
      role: 'Private client, Monaco',
      img: 'https://picsum.photos/seed/client-james/160/160',
    },
    {
      q: 'From the initial consultation to the notarial act, the team was impeccable. They understood that we were not buying a property — we were acquiring a legacy.',
      author: 'Sophia Laurent',
      role: "Private client, Côte d'Azur",
      img: 'https://picsum.photos/seed/client-sophia/160/160',
    },
  ];

  protected readonly agentPoints = [
    'Ultra-prime European markets since 2006',
    'Over €950M in closed transactions',
    'Fully bilingual team: English, French, German',
    'Discreet off-market access for registered clients',
  ];

  protected readonly faqs = [
    {
      q: 'What markets does Maison Estates cover?',
      a: "We operate exclusively in ultra-prime European markets — France (Paris, Côte d'Azur, Provence, Bordeaux), Monaco, the Swiss Riviera, the Cotswolds and select Balearic addresses. Our network extends to off-market introductions in over 40 countries through trusted correspondent brokers.",
    },
    {
      q: 'How are off-market properties accessed?',
      a: 'Over 60% of our mandates never appear on public portals. They are shared exclusively with qualified registered buyers after a confidential brief. To access the off-market portfolio, we invite you to complete a private client registration.',
    },
    {
      q: 'What is your buying-side service?',
      a: "Our acquisition consultants act solely on your behalf — never on the vendor's. We conduct discreet property searches, independent valuations, legal due-diligence introductions and price negotiation, culminating in a seamless notarial process.",
    },
    {
      q: 'Do you assist with financing and wealth structuring?',
      a: 'We work alongside a curated panel of private bankers, fiduciaires and family offices who understand the specific requirements of cross-border luxury acquisition — from SCI and SARL de famille structures to international mortgage solutions.',
    },
    {
      q: 'Is a private viewing available?',
      a: "All viewings are strictly private and arranged at the buyer's convenience, including evenings and weekends. For international clients we offer accompanied itineraries with helicopter transfers and bespoke accommodation. Contact our concierge to schedule.",
    },
  ];

  protected readonly propertyTypes = [
    'Villa / Maison de maître',
    'Château / Estate',
    'Apartment / Penthouse',
    'Chalet / Mountain retreat',
    'Island / Waterfront estate',
    'Other / Please advise',
  ];
  protected readonly budgetRanges = [
    '€1M – €3M',
    '€3M – €5M',
    '€5M – €10M',
    '€10M – €25M',
    '€25M+',
    'Prefer not to disclose',
  ];

  protected readonly footerCols = [
    {
      heading: 'Properties',
      links: ["Côte d'Azur", 'Paris & Île-de-France', 'Provence', 'Monaco & Riviera'],
    },
    {
      heading: 'Services',
      links: ['Buying', 'Selling', 'Private Valuations', 'Investment Advisory'],
    },
    { heading: 'Company', links: ['About Us', 'Our Concierge', 'Press', 'Contact'] },
  ];
  protected readonly footerLegal = ['Privacy Policy', 'Terms of Use', 'Cookie Notice', 'GDPR'];
  protected readonly socials = ['instagram', 'linkedin', 'twitter'];

  protected pad(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
}
