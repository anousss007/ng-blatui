import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';

import { BuiRating } from 'ng-blatui';

import { Lucide } from './lucide';

type Tone = 'primary' | 'danger' | 'warning';

interface Product {
  name: string;
  cat: string;
  price: number;
  old: number | null;
  rating: number;
  reviews: number;
  badge: string | null;
  tone: Tone | null;
  id: string;
}

/** Store — "Atelier" modern home-goods e-commerce: hero + category chips + filters + product grid + lookbook. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-store',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiRating, Lucide],
  templateUrl: './store.html',
  styleUrl: './store.css',
})
export class StoreTemplate {
  protected readonly nav = ['Shop', 'New in', 'Lighting', 'Sale'];
  protected readonly chips = ['All', 'Lighting', 'Seating', 'Tables', 'Decor', 'Textiles'];
  protected readonly activeChip = signal('All');

  protected readonly products: Product[] = [
    {
      name: 'Halo Floor Lamp',
      cat: 'Lighting',
      price: 189,
      old: null,
      rating: 5,
      reviews: 128,
      badge: 'New',
      tone: 'primary',
      id: '1507473885765-e6ed057f782c',
    },
    {
      name: 'Linen Lounge Chair',
      cat: 'Seating',
      price: 320,
      old: 420,
      rating: 4,
      reviews: 86,
      badge: 'Sale',
      tone: 'danger',
      id: '1567538096630-e0c55bd6374c',
    },
    {
      name: 'Oak Coffee Table',
      cat: 'Tables',
      price: 245,
      old: null,
      rating: 5,
      reviews: 54,
      badge: null,
      tone: null,
      id: '1533090481720-856c6e3c1fdc',
    },
    {
      name: 'Terra Vase Set',
      cat: 'Decor',
      price: 64,
      old: null,
      rating: 4,
      reviews: 210,
      badge: 'New',
      tone: 'primary',
      id: '1588345921523-c2dcdb7f1dcd',
    },
    {
      name: 'Wool Throw Blanket',
      cat: 'Textiles',
      price: 78,
      old: 99,
      rating: 5,
      reviews: 167,
      badge: 'Sale',
      tone: 'danger',
      id: '1600166898405-da9535204843',
    },
    {
      name: 'Arc Pendant Light',
      cat: 'Lighting',
      price: 142,
      old: null,
      rating: 4,
      reviews: 41,
      badge: null,
      tone: null,
      id: '1513506003901-1e6a229e2d15',
    },
    {
      name: 'Boucle Accent Stool',
      cat: 'Seating',
      price: 119,
      old: null,
      rating: 5,
      reviews: 73,
      badge: null,
      tone: null,
      id: '1503602642458-232111445657',
    },
    {
      name: 'Ceramic Mug Set',
      cat: 'Decor',
      price: 38,
      old: null,
      rating: 4,
      reviews: 305,
      badge: 'Bestseller',
      tone: 'warning',
      id: '1514228742587-6b1558fcca3d',
    },
  ];

  protected readonly filterCats: { name: string; count: number }[] = [
    { name: 'Lighting', count: 14 },
    { name: 'Seating', count: 9 },
    { name: 'Tables', count: 6 },
    { name: 'Decor', count: 22 },
    { name: 'Textiles', count: 11 },
  ];

  protected readonly sortOpts = [
    'Featured',
    'Newest',
    'Price: Low to High',
    'Price: High to Low',
    'Top rated',
  ];
  protected readonly lookbook = [
    '1616486338812-3dadae4b4ace',
    '1586023492125-27b2c045efd7',
    '1567016432779-094069958ea5',
    '1556228453-efd6c1ff04f6',
  ];
  protected readonly press = [
    'Vogue Living',
    'Dwell',
    'Architectural Digest',
    'Kinfolk',
    'Elle Decor',
    'Cereal',
  ];

  protected readonly footer = [
    { heading: 'Shop', links: ['New arrivals', 'Lighting', 'Furniture', 'Decor', 'Sale'] },
    { heading: 'Help', links: ['Shipping', 'Returns', 'Track order', 'Size guide', 'Contact'] },
    { heading: 'Company', links: ['Our story', 'Stores', 'Sustainability', 'Careers', 'Press'] },
  ];
  protected readonly socials = ['instagram', 'twitter', 'youtube'];
  protected readonly payIcons = ['credit-card', 'wallet', 'badge-dollar-sign'];

  protected img(id: string, w = 600): string {
    return `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
  }
}
