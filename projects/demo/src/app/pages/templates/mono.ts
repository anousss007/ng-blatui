import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { BuiAvatar } from 'ng-blatui';

import { Lucide } from './lucide';

/** Mono — black-and-white photography portfolio, Cormorant Garamond serif. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-mono',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, Lucide],
  templateUrl: './mono.html',
  styleUrl: './mono.css',
})
export class MonoTemplate {
  protected readonly nav = [
    { label: 'Work', href: '#work' },
    { label: 'Series', href: '#series' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  private readonly series = [
    { seed: 'mono01', label: 'Coastline I', alt: 'Coastal cliffs at golden hour' },
    { seed: 'mono02', label: 'Valley Fog', alt: 'Fog rolling over a mountain valley' },
    { seed: 'mono03', label: 'Study No. 3', alt: 'Portrait of a woman in soft light' },
    { seed: 'mono04', label: 'Open Road', alt: 'Deserted road through open plains' },
    { seed: 'mono05', label: 'Form I', alt: 'Architecture detail — shadow and concrete' },
    { seed: 'mono06', label: 'Stillness', alt: 'Still water at dawn' },
    { seed: 'mono07', label: 'Winter Silence', alt: 'Snow-dusted pine forest' },
    { seed: 'mono08', label: 'Dusk Market', alt: 'Market vendor at dusk' },
    { seed: 'mono09', label: 'Terraces', alt: 'Aerial view of terraced fields' },
    { seed: 'mono10', label: 'Light Study', alt: 'Empty chapel interior with raking light' },
    { seed: 'mono11', label: 'Night Rain', alt: 'Rain-slicked city street at night' },
    { seed: 'mono12', label: 'Geothermal', alt: 'Icelandic geothermal landscape' },
  ];

  protected readonly galleryImages = this.series.map((s) => ({
    thumb: `https://picsum.photos/seed/${s.seed}/800/534`,
    alt: s.alt,
    label: s.label,
  }));

  protected readonly seriesSlides = [
    { seed: 'series01', alt: 'Coastline at blue hour — series frame 01', num: '01' },
    { seed: 'series02', alt: 'Tide pools and volcanic rock — series frame 02', num: '02' },
    { seed: 'series03', alt: 'Sea mist over boulders — series frame 03', num: '03' },
    { seed: 'series04', alt: 'Silhouette against the setting sun — series frame 04', num: '04' },
    { seed: 'series05', alt: 'Long exposure waves on dark sand — series frame 05', num: '05' },
  ];

  protected readonly clients = [
    'Vogue',
    'National Geographic',
    'The Guardian',
    'Monocle',
    'Kinfolk',
    'Wallpaper*',
    'Le Monde',
    'Zeit Magazin',
    'Aperture',
    'AnOther',
  ];

  protected readonly approaches = [
    {
      n: '01',
      title: 'Observation',
      desc: 'Every assignment begins with prolonged looking — reading the light, the architecture, the quiet rhythms of a place before the lens cap comes off.',
    },
    {
      n: '02',
      title: 'Restraint',
      desc: 'I work with minimal equipment and natural light wherever possible. Less gear means more presence.',
    },
    {
      n: '03',
      title: 'Single Frame',
      desc: 'I rarely bracket. One carefully composed frame carries more conviction than a hundred alternatives.',
    },
    {
      n: '04',
      title: 'Post-treatment',
      desc: 'Retouching is a last resort. Tonal adjustments only — the photograph should earn its look in camera.',
    },
  ];

  protected readonly stats = [
    { v: '18 yrs', l: 'in practice' },
    { v: '34', l: 'solo exhibitions' },
    { v: '7', l: 'monographs published' },
    { v: '62+', l: 'editorial clients' },
  ];

  protected readonly categories = [
    { key: 'landscape', label: 'Landscape' },
    { key: 'portrait', label: 'Portrait' },
    { key: 'documentary', label: 'Documentary' },
  ];

  /** First (active) tab gallery — landscape. */
  protected readonly landscapeThumbs = ['lsc01', 'lsc02', 'lsc03', 'lsc04', 'lsc05', 'lsc06'].map(
    (seed) => ({
      thumb: `https://picsum.photos/seed/${seed}/700/480`,
      alt: `Landscape photograph — ${seed}`,
    }),
  );

  protected readonly contactDetails = ['editorial@elaravoss.com', 'Berlin, DE — Cape Town, ZA'];
  protected readonly socials = ['Instagram', 'Behance', 'LinkedIn'];
  protected readonly footerLinks = ['Privacy', 'Licensing', 'Colophon'];
}
