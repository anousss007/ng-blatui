import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { BuiAvatar, BuiBadge, BuiMarquee, BuiRating, BuiSeparator } from 'ng-blatui';

import { Lucide } from './lucide';

interface Destination {
  name: string;
  country: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  badge: string | null;
  tone: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | null;
  seed: string;
}
interface Experience {
  icon: string;
  title: string;
  desc: string;
  seed: string;
  span: string;
}

/** Atlas — "Find your horizon", a cinematic small-group adventure travel agency. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-atlas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, BuiBadge, BuiMarquee, BuiRating, BuiSeparator, Lucide],
  templateUrl: './atlas.html',
  styleUrl: './atlas.css',
})
export class AtlasTemplate {
  protected readonly nav = [
    { label: 'Destinations', href: '#destinations' },
    { label: 'Trips', href: '#trips' },
    { label: 'Experiences', href: '#experiences' },
    { label: 'Book', href: '#booking' },
    { label: 'FAQ', href: '#faq' },
  ];

  protected readonly destinations: Destination[] = [
    {
      name: 'Patagonia',
      country: 'Argentina',
      category: 'wild',
      price: 2490,
      rating: 5,
      reviews: 143,
      badge: 'Top Pick',
      tone: 'warning',
      seed: 'patagonia1',
    },
    {
      name: 'Amalfi Coast',
      country: 'Italy',
      category: 'coast',
      price: 1890,
      rating: 5,
      reviews: 218,
      badge: 'Trending',
      tone: 'info',
      seed: 'amalfi2',
    },
    {
      name: 'Machu Picchu',
      country: 'Peru',
      category: 'mountains',
      price: 2100,
      rating: 5,
      reviews: 192,
      badge: 'UNESCO',
      tone: 'success',
      seed: 'machu3',
    },
    {
      name: 'Kyoto',
      country: 'Japan',
      category: 'cities',
      price: 1650,
      rating: 4,
      reviews: 307,
      badge: 'New Route',
      tone: 'info',
      seed: 'kyoto4',
    },
    {
      name: 'Lofoten Islands',
      country: 'Norway',
      category: 'coast',
      price: 3100,
      rating: 5,
      reviews: 87,
      badge: 'Exclusive',
      tone: 'danger',
      seed: 'lofoten5',
    },
    {
      name: 'Serengeti',
      country: 'Tanzania',
      category: 'wild',
      price: 3600,
      rating: 5,
      reviews: 155,
      badge: 'Wild',
      tone: 'warning',
      seed: 'serengeti6',
    },
    {
      name: 'Dolomites',
      country: 'Italy',
      category: 'mountains',
      price: 1420,
      rating: 4,
      reviews: 241,
      badge: null,
      tone: null,
      seed: 'dolom7',
    },
    {
      name: 'Marrakech',
      country: 'Morocco',
      category: 'cities',
      price: 980,
      rating: 4,
      reviews: 389,
      badge: 'Best Value',
      tone: 'success',
      seed: 'marrak8',
    },
  ];

  protected readonly destTabs = [
    { val: 'mountains', label: 'Mountains', icon: 'mountain' },
    { val: 'coast', label: 'Coast', icon: 'waves' },
    { val: 'cities', label: 'Cities', icon: 'building-2' },
    { val: 'wild', label: 'Wild', icon: 'trees' },
  ];

  protected readonly trips = [
    {
      title: 'Silk Road Odyssey',
      duration: '14 days',
      countries: 'Uzbekistan · Kyrgyzstan · Tajikistan',
      price: 3890,
      seed: 'silk1',
      highlight: 'Small group · max 12',
    },
    {
      title: 'Patagonia Traverse',
      duration: '10 days',
      countries: 'Chile · Argentina',
      price: 4200,
      seed: 'pata2',
      highlight: 'Guided trekking',
    },
    {
      title: 'African Safari Circuit',
      duration: '12 days',
      countries: 'Kenya · Tanzania · Rwanda',
      price: 5400,
      seed: 'safari3',
      highlight: 'Wildlife specialist',
    },
    {
      title: 'Norwegian Fjord Quest',
      duration: '8 days',
      countries: 'Norway',
      price: 2650,
      seed: 'fjord4',
      highlight: 'Private boat',
    },
    {
      title: 'Japan Deep Culture',
      duration: '11 days',
      countries: 'Japan',
      price: 2980,
      seed: 'japan5',
      highlight: 'Local hosts',
    },
  ];

  protected readonly experiences: Experience[] = [
    {
      icon: 'tent',
      title: 'Wild Camping',
      desc: 'Sleep under a sky unpolluted by light. We handle permits, gear and safety.',
      seed: 'camp1',
      span: 'col-span-1 row-span-1',
    },
    {
      icon: 'waves',
      title: 'Ocean Freediving',
      desc: 'Descend into blue silence with certified instructors on remote coral atolls.',
      seed: 'ocean2',
      span: 'col-span-1 row-span-2 atlas-bento-tall',
    },
    {
      icon: 'mountain',
      title: 'Summit Expeditions',
      desc: 'From trekking peaks to technical ascents — for every level of ambition.',
      seed: 'mount3',
      span: 'col-span-1 row-span-1',
    },
    {
      icon: 'utensils',
      title: 'Culinary Journeys',
      desc: 'Markets, farms, fire pits. Taste a country the way locals have for centuries.',
      seed: 'food4',
      span: 'col-span-2 row-span-1 atlas-bento-wide',
    },
  ];

  protected readonly testimonials = [
    {
      q: 'Atlas turned a vague dream into the most defining three weeks of my life. The Silk Road trip was flawlessly executed — every detail felt intentional.',
      a: 'Camille Fontaine',
      r: 'Travel writer, Lyon',
      seed: 'ava1',
    },
    {
      q: "I've booked eight trips through Atlas over six years. Each one raised the bar. The guides aren't just knowledgeable — they're obsessive about their landscape.",
      a: 'Ryo Tanaka',
      r: 'Photographer, Tokyo',
      seed: 'ava2',
    },
    {
      q: 'Completely solo traveller here, and I never once felt out of place. The small groups attract the kind of curious, open people you genuinely want to share a meal with.',
      a: 'Amara Diallo',
      r: 'Engineer, Accra',
      seed: 'ava3',
    },
  ];

  protected readonly stats = [
    { v: '89', l: 'Countries explored', icon: 'globe' },
    { v: '42k+', l: 'Adventurers guided', icon: 'users' },
    { v: '98%', l: 'Trip satisfaction', icon: 'heart' },
    { v: '12', l: 'Years of expertise', icon: 'award' },
  ];

  protected readonly gallery = [
    { seed: 'gal1', w: 400, h: 500, alt: 'Sunrise over misty peaks' },
    { seed: 'gal2', w: 400, h: 300, alt: 'Desert dune silhouettes at dusk' },
    { seed: 'gal3', w: 400, h: 300, alt: 'Dense jungle canopy' },
    { seed: 'gal4', w: 400, h: 500, alt: 'Icy blue glacier lagoon' },
    { seed: 'gal5', w: 400, h: 300, alt: 'Night sky over volcanic crater' },
    { seed: 'gal6', w: 400, h: 300, alt: 'Cobalt ocean cove' },
  ];

  protected readonly searchTags = ['Mountains', 'Coast', 'Cities', 'Wild'];
  protected readonly destinationOptions = [
    'Any destination',
    'Patagonia, Argentina',
    'Amalfi Coast, Italy',
    'Machu Picchu, Peru',
    'Kyoto, Japan',
    'Lofoten Islands, Norway',
    'Serengeti, Tanzania',
  ];
  protected readonly guestOptions = [
    '1 traveller',
    '2 travellers',
    '3 travellers',
    '4 travellers',
    '5+ travellers',
  ];
  protected readonly tripStyles = ['Guided Group', 'Self-guided', 'Bespoke Private'];
  protected readonly durations = ['7 days', '10 days', '14 days', '21 days'];
  protected readonly bookingSteps = ['Choose Trip', 'Travellers', 'Confirm'];

  protected readonly marqueePlaces = [
    'Patagonia',
    '✦',
    'Amalfi Coast',
    '✦',
    'Kyoto',
    '✦',
    'Serengeti',
    '✦',
    'Lofoten',
    '✦',
    'Machu Picchu',
    '✦',
    'Dolomites',
    '✦',
    'Marrakech',
    '✦',
    'Iceland',
    '✦',
    'Rajasthan',
    '✦',
    'Galápagos',
  ];

  protected readonly faqs = [
    {
      q: 'What experience level do I need?',
      a: 'Every trip is graded from "Easy walker" to "Technical". Most adventures require only reasonable fitness; the listing tells you exactly what to expect — elevation, daily km, terrain type.',
    },
    {
      q: 'Are flights included?',
      a: 'All land arrangements, accommodation, guides and most meals are included. Flights are optional add-ons — our travel team can bundle them at competitive rates or let you book independently.',
    },
    {
      q: 'How small are the small groups?',
      a: 'Typically 6–12 people. Some premium expeditions cap at 4. The listing always states the maximum.',
    },
    {
      q: "What's the cancellation policy?",
      a: 'Cancel free up to 60 days before departure for a full refund. Inside 60 days a credit is issued, valid 24 months. Travel insurance is strongly recommended.',
    },
    {
      q: 'Can I customise a trip for a private group?',
      a: 'Absolutely. Contact our Bespoke team to tailor any itinerary — dates, pace, accommodation tier and off-itinerary extensions are all on the table.',
    },
  ];

  protected readonly summary = [
    { k: 'Destination', v: 'Patagonia, Argentina' },
    { k: 'Trip style', v: 'Guided Group' },
    { k: 'Departure', v: 'Oct 12, 2026' },
    { k: 'Duration', v: '10 days' },
    { k: 'Travellers', v: '2' },
  ];

  protected readonly footer = [
    {
      heading: 'Explore',
      links: ['Destinations', 'Curated Trips', 'Experiences', 'Map View', 'New Routes'],
    },
    {
      heading: 'Company',
      links: ['Our Story', 'Guides & Crew', 'Sustainability', 'Press', 'Careers'],
    },
    {
      heading: 'Resources',
      links: ['Trip Guides', 'Packing Lists', 'Visa Help', 'Travel Insurance', 'Community'],
    },
    { heading: 'Legal', links: ['Privacy', 'Terms', 'Cookie Policy', 'Accessibility'] },
  ];

  protected readonly social = ['instagram', 'twitter', 'youtube', 'facebook'];

  protected mountainDestinations(): Destination[] {
    return this.destinations.filter((d) => d.category === 'mountains');
  }
}
