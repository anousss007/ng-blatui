import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { Lucide } from './lucide';

interface Course {
  name: string;
  desc: string;
  price: string;
}
interface MenuSection {
  key: string;
  label: string;
  courses: Course[];
}

/** Terroir — "Maison Terroir", a two-Michelin-star fine-dining house. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-terroir',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Lucide],
  templateUrl: './terroir.html',
  styleUrl: './terroir.css',
})
export class TerroirTemplate {
  protected readonly navLinks = [
    { label: 'Philosophy', href: '#philosophy' },
    { label: 'Menu', href: '#menu' },
    { label: 'Chef', href: '#chef' },
    { label: 'Gallery', href: '#gallery' },
  ];

  protected readonly menu: MenuSection[] = [
    {
      key: 'starters',
      label: 'Starters',
      courses: [
        {
          name: 'Langoustine & Caviar',
          desc: 'Breton langoustine, Oscietra caviar, cucumber water, dill oil',
          price: '48',
        },
        {
          name: 'Foie Gras Torchon',
          desc: 'Terrine, brioche toast, Sauternes gelée, pickled black fig',
          price: '42',
        },
        {
          name: 'Beetroot Trilogy',
          desc: 'Roasted, compressed and raw Chioggia, goat curd, walnut crumble',
          price: '28',
        },
        {
          name: 'Scallop "En Coquille"',
          desc: 'Hand-dived Orkney scallop, truffle beurre blanc, chervil, sea herb',
          price: '38',
        },
      ],
    },
    {
      key: 'mains',
      label: 'Mains',
      courses: [
        {
          name: 'Dry-Aged Côte de Bœuf',
          desc: '45-day aged Galician beef, bone marrow jus, pomme soufflé, watercress',
          price: '68',
        },
        {
          name: 'Brittany Sole Meunière',
          desc: 'Whole Dover sole, brown butter, capers, lemon confit, samphire',
          price: '62',
        },
        {
          name: 'Pigeon Rôti',
          desc: 'Anjou pigeon, black garlic purée, celeriac fondant, sauce périgourdine',
          price: '58',
        },
        {
          name: 'Garden Tasting (V)',
          desc: 'Seven seasonal vegetables, fermented grains, smoked butter emulsion',
          price: '52',
        },
      ],
    },
    {
      key: 'desserts',
      label: 'Desserts',
      courses: [
        {
          name: 'Soufflé au Chocolat',
          desc: 'Valrhona Guanaja 70%, Tahitian vanilla ice cream, caramel crème',
          price: '22',
        },
        {
          name: 'Tarte Tatin Revisitée',
          desc: 'Pink Lady apple, almond frangipane, Calvados sabayon',
          price: '18',
        },
        {
          name: 'Île Flottante',
          desc: 'Soft meringue, crème anglaise, praline feuilletine, fleur de sel',
          price: '16',
        },
        {
          name: 'Selection de Fromages',
          desc: 'French farmhouse cheeses, honeycomb, quince, pain de campagne',
          price: '24',
        },
      ],
    },
    {
      key: 'wine',
      label: 'Wine',
      courses: [
        {
          name: 'Montrachet Grand Cru 2018',
          desc: 'Domaine de la Romanée-Conti, Burgundy — Chardonnay',
          price: '420',
        },
        {
          name: 'Château Pétrus 2015',
          desc: 'Pomerol, Bordeaux — Merlot, profound and velvety',
          price: '680',
        },
        {
          name: 'Côte-Rôtie "La Mouline" 2017',
          desc: 'E. Guigal, Rhône Valley — Syrah, iconic single vineyard',
          price: '185',
        },
        {
          name: 'Billecart-Salmon Blanc de Blancs NV',
          desc: 'Champagne — Chardonnay, minerality and elegance',
          price: '95',
        },
      ],
    },
  ];

  protected readonly gallery = [
    {
      thumb: 'https://picsum.photos/seed/plating1/600/400',
      alt: 'Duck confit with cherry reduction',
    },
    {
      thumb: 'https://picsum.photos/seed/dish-duck/600/400',
      alt: 'Pressed duck with foie gras sauce',
    },
    { thumb: 'https://picsum.photos/seed/vineyard/600/400', alt: 'Estate vineyard at golden hour' },
    { thumb: 'https://picsum.photos/seed/lobster/600/400', alt: 'Poached lobster with bisque' },
    {
      thumb: 'https://picsum.photos/seed/dessert1/600/400',
      alt: 'Chocolate soufflé fresh from the oven',
    },
    { thumb: 'https://picsum.photos/seed/cellar1/600/400', alt: 'The Maison wine cellar' },
  ];

  protected readonly press = [
    'Le Monde',
    'Le Figaro',
    'Vogue Paris',
    'The Guardian',
    'Financial Times',
    'Condé Nast',
  ];

  protected readonly reviews = [
    {
      quote: '"A masterclass in restraint. Every dish whispers, never shouts."',
      source: 'The Guardian, 2023',
    },
    {
      quote: '"Leblanc is the rare chef who improves with each passing year."',
      source: 'Gault & Millau Guide',
    },
    {
      quote: '"Paris has many temples; Terroir remains its most human."',
      source: 'Financial Times Weekend',
    },
  ];

  protected readonly chefBadges = [
    { icon: 'star', label: 'Michelin ★★' },
    { icon: 'award', label: 'Gault & Millau 19/20' },
    { icon: 'leaf', label: 'Green Star' },
    { icon: 'book-open', label: '3 Cookbooks' },
  ];

  protected readonly partySizes = [
    '1 guest',
    '2 guests',
    '3 guests',
    '4 guests',
    '5 guests',
    '6 guests',
    '7–8 guests',
    'Larger party',
  ];

  protected readonly faq = [
    {
      q: 'What is the dress code?',
      a: 'We ask guests to dress elegantly — smart casual is welcome; formal attire is encouraged for the Grand Tasting menu. Sports shoes and very casual dress are kindly asked to be reserved for other occasions.',
    },
    {
      q: 'Is parking available?',
      a: 'Valet parking is complimentary for all dinner reservations. Self-parking is also available in the private courtyard, accessible from Rue du Terroir.',
    },
    {
      q: 'Can you accommodate dietary needs?',
      a: 'Our kitchen crafts bespoke menus for all allergies and dietary preferences — vegetarian, vegan, gluten-free, and beyond. Please inform us at the time of booking so Chef Leblanc can prepare accordingly.',
    },
    {
      q: 'What is your cancellation policy?',
      a: "We hold reservations for 15 minutes. For cancellations, 48 hours' notice is required for tables of up to 6; 72 hours for larger parties and private dining events. Our concierge is always happy to reschedule.",
    },
    {
      q: 'Do you offer private dining?',
      a: 'The Bibliothèque private dining room accommodates 8–18 guests with a dedicated sommelier, bespoke menu and full AV facilities. Please contact our events team for availability.',
    },
  ];

  protected readonly footerCols = [
    {
      heading: 'Experience',
      links: ['The Menu', 'Grand Tasting', 'Wine Cellar', 'Private Dining'],
    },
    {
      heading: 'Visit',
      links: ['Reservations', 'Hours & Location', 'Dress Code', 'Gift Vouchers'],
    },
    { heading: 'The House', links: ['Our Story', 'The Team', 'Press', 'Careers'] },
  ];
  protected readonly footerLegal = ['Privacy', 'Legal', 'Cookies'];
  protected readonly socials = ['instagram', 'facebook'];
}
