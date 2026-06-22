import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { BuiRating } from 'ng-blatui';

import { Lucide } from './lucide';

/** Product — "Halo Floor Lamp" single product-detail page: gallery + variants + add-to-cart + tabs + related. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-product',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiRating, Lucide],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class ProductTemplate {
  protected readonly shots = [
    '1507473885765-e6ed057f782c',
    '1513506003901-1e6a229e2d15',
    '1524758631624-e2822e304c36',
    '1618220179428-22790b461013',
  ];
  protected readonly images = this.shots.map((id) => this.img(id, 900));
  protected readonly active = signal(0);
  protected readonly mainImage = computed(() => this.images[this.active()]);

  protected readonly colors = [
    { name: 'Charcoal', bg: '#262626' },
    { name: 'Sand', bg: '#fde68a' },
    { name: 'Sage', bg: '#6ee7b7' },
    { name: 'Clay', bg: '#fdba74' },
  ];
  protected readonly color = signal('Charcoal');

  protected readonly sizes = ['Small', 'Medium', 'Large'];
  protected readonly size = signal('Medium');

  protected readonly qty = signal(1);

  protected readonly trust = [
    { icon: 'truck', label: 'Free shipping' },
    { icon: 'rotate-ccw', label: '30-day returns' },
    { icon: 'shield-check', label: '5-year warranty' },
  ];

  protected readonly specs = [
    { k: 'Materials', v: 'Powder-coated steel, FSC-certified oak base' },
    { k: 'Dimensions', v: '152 cm H × 28 cm Ø base' },
    { k: 'Bulb', v: 'E27, max 60W (LED recommended)' },
    { k: 'Cable', v: '2.5 m braided, in-line dimmer' },
    { k: 'Weight', v: '4.2 kg' },
    { k: 'Warranty', v: '5 years' },
  ];

  protected readonly accordion = [
    {
      key: 'ship',
      q: 'Shipping & returns',
      a: 'Free carbon-neutral shipping over $75, delivered in 2–4 business days. Return any item within 30 days for a full refund.',
    },
    {
      key: 'care',
      q: 'Care',
      a: 'Wipe the shade with a dry cloth. Treat the oak base with natural oil twice a year to keep its finish.',
    },
  ];

  protected readonly related = [
    { name: 'Arc Pendant Light', price: 142, id: '1513506003901-1e6a229e2d15' },
    { name: 'Linen Lounge Chair', price: 320, id: '1567538096630-e0c55bd6374c' },
    { name: 'Oak Coffee Table', price: 245, id: '1533090481720-856c6e3c1fdc' },
    { name: 'Wool Throw Blanket', price: 78, id: '1600166898405-da9535204843' },
  ];

  protected readonly tabs = [
    { key: 'desc', label: 'Description' },
    { key: 'specs', label: 'Specifications' },
    { key: 'reviews', label: 'Reviews' },
  ];

  protected img(id: string, w = 800): string {
    return `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
  }
}
