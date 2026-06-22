import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { BuiAvatar } from 'ng-blatui';

import { Lucide } from './lucide';

/** Agency — "Studio Form" creative design & motion studio site: hero + services + work gallery + team + testimonial + contact. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-agency',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, Lucide],
  templateUrl: './agency.html',
  styleUrl: './agency.css',
})
export class AgencyTemplate {
  protected readonly nav = ['Work', 'Services', 'Studio', 'Journal'];
  protected readonly marqueeWords = [
    'Branding',
    'Web Design',
    'Motion',
    'Art Direction',
    'Strategy',
    'Identity',
    'Product',
    '3D',
  ];

  protected readonly services = [
    {
      icon: 'palette',
      title: 'Brand identity',
      desc: 'Naming, logo systems, type and the guidelines to keep it all consistent.',
    },
    {
      icon: 'monitor',
      title: 'Web & product',
      desc: 'Sites and apps designed and built to convert — fast, accessible, on-brand.',
    },
    {
      icon: 'clapperboard',
      title: 'Motion',
      desc: 'Launch films, product demos and the micro-interactions that bring UI to life.',
    },
    {
      icon: 'compass',
      title: 'Strategy',
      desc: 'Positioning, messaging and research that points the creative in the right direction.',
    },
  ];

  protected readonly work = [
    '1618005182384-a83a8bd57fbe',
    '1561070791-2526d30994b5',
    '1558655146-9f40138edfeb',
    '1545235617-9465d2a55698',
    '1620641788421-7a1c342ea42e',
    '1559028012-481c04fa702d',
  ];

  protected readonly stats: [string, string][] = [
    ['120+', 'Projects shipped'],
    ['18', 'Design awards'],
    ['40+', 'Happy clients'],
    ['12yrs', 'In business'],
  ];

  protected readonly team = [
    { n: 'Mara Quinn', r: 'Creative Director', i: 'MQ' },
    { n: 'Leo Fontaine', r: 'Design Lead', i: 'LF' },
    { n: 'Ines Park', r: 'Motion Designer', i: 'IP' },
    { n: 'Theo Vance', r: 'Engineer', i: 'TV' },
  ];

  protected img(id: string, w = 800): string {
    return `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
  }
}
