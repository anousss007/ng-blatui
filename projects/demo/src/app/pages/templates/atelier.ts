import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { BuiAvatar } from 'ng-blatui';

import { Lucide } from './lucide';

interface EditProduct {
  name: string;
  category: string;
  price: string;
  badge: string | null;
  seed: string;
}
interface CatItem {
  name: string;
  price: string;
  seed: string;
}
interface Category {
  key: string;
  label: string;
  items: CatItem[];
}

/** Atelier — "Maison Atelier", a minimal editorial high-fashion house (paper/ink + red). Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-atelier',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, Lucide],
  templateUrl: './atelier.html',
  styleUrl: './atelier.css',
})
export class AtelierTemplate {
  protected readonly fabrics = [
    'Boiled Wool',
    'Japanese Denim',
    'Duchess Satin',
    'Raw Silk',
    'Merino Jersey',
    'Washed Linen',
    'Technical Twill',
    'Cashmere Blend',
    'Organza',
    'Ponte Roma',
  ];
  protected readonly collections = [
    'Collection 01 — Umbra',
    'Collection 02 — Cendre',
    'Collection 03 — Ardoise',
    'Collection 04 — Ivoire',
    'Collection 05 — Craie',
  ];

  protected readonly teamAvatars = [
    { seed: 'atel-t1', name: 'Isabelle Moreau', role: 'Creative Director' },
    { seed: 'atel-t2', name: 'Jean-Paul Arènes', role: 'Head of Atelier' },
    { seed: 'atel-t3', name: 'Clémentine Voss', role: 'Head of Design' },
  ];

  protected readonly editProducts: EditProduct[] = [
    {
      name: 'Le Manteau Oversized',
      category: 'Outerwear',
      price: '€ 1 290',
      badge: 'New',
      seed: 'atel-p1',
    },
    { name: 'La Robe Tombée', category: 'Dresses', price: '€ 890', badge: null, seed: 'atel-p2' },
    {
      name: 'Le Blazer Strict',
      category: 'Tailoring',
      price: '€ 740',
      badge: 'Limited',
      seed: 'atel-p3',
    },
    { name: 'La Jupe Plissée', category: 'Bottoms', price: '€ 520', badge: null, seed: 'atel-p4' },
  ];

  protected readonly runwaySlides = [
    { seed: 'atel-rw1', caption: 'Look 01 — Umbra Opening' },
    { seed: 'atel-rw2', caption: 'Look 02 — Structured Volume' },
    { seed: 'atel-rw3', caption: 'Look 03 — Fluid Drape' },
    { seed: 'atel-rw4', caption: 'Look 04 — Evening Silhouette' },
    { seed: 'atel-rw5', caption: 'Look 05 — Final Exit' },
  ];

  protected readonly categories: Category[] = [
    {
      key: 'outerwear',
      label: 'Outerwear',
      items: [
        { name: 'Manteau Double-Faced', price: '€ 1 590', seed: 'atel-c1' },
        { name: 'Trench Technique', price: '€ 980', seed: 'atel-c2' },
        { name: 'Veste Boxy', price: '€ 640', seed: 'atel-c3' },
      ],
    },
    {
      key: 'tailoring',
      label: 'Tailoring',
      items: [
        { name: 'Blazer Croisé', price: '€ 890', seed: 'atel-c4' },
        { name: 'Pantalon Cigarette', price: '€ 490', seed: 'atel-c5' },
        { name: 'Gilet Structuré', price: '€ 370', seed: 'atel-c6' },
      ],
    },
    {
      key: 'essentials',
      label: 'Essentials',
      items: [
        { name: 'Top Minimal', price: '€ 220', seed: 'atel-c7' },
        { name: 'Robe Fourreau', price: '€ 560', seed: 'atel-c8' },
        { name: 'Blouse en Soie', price: '€ 410', seed: 'atel-c9' },
      ],
    },
  ];

  protected readonly lookbookThumbs = [
    'atel-lb1',
    'atel-lb2',
    'atel-lb3',
    'atel-lb4',
    'atel-lb5',
    'atel-lb6',
  ];
  protected readonly press = [
    'Le Monde',
    'Vogue Paris',
    'SYSTEM Mag',
    'AnOther',
    'Dazed',
    'i-D',
    'CR Fashion',
  ];

  protected readonly footerLinks = [
    { heading: 'Maison', links: ['Story', 'Atelier', 'Sustainability', 'Careers'] },
    { heading: 'Collections', links: ['Women', 'Men', 'Archive', 'Bespoke'] },
    { heading: 'Client', links: ['Sizing Guide', 'Care & Repair', 'Shipping', 'Returns'] },
    { heading: 'Contact', links: ['Press', 'Wholesale', 'Boutiques', 'Newsletter'] },
  ];
  protected readonly socials = ['instagram', 'twitter', 'youtube'];

  protected initials(name: string): string {
    return name.slice(0, 2).toUpperCase();
  }
}
