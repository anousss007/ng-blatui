import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { BuiAvatar, BuiBadge, BuiSeparator } from 'ng-blatui';

import { Lucide } from './lucide';

interface Project {
  project: string;
  year: string;
  category: string;
  status: string;
  tone: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

/** Brut — "Stüdio Brut", a loud neo-brutalist creative studio. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-brut',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, BuiBadge, BuiSeparator, Lucide],
  templateUrl: './brut.html',
  styleUrl: './brut.css',
})
export class BrutTemplate {
  protected readonly nav = [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#team' },
    { label: 'Awards', href: '#awards' },
    { label: 'Contact', href: '#contact' },
  ];

  protected readonly services = [
    {
      icon: 'pen-tool',
      title: 'Brand Identity',
      desc: 'Logos, systems, guidelines — your visual DNA, built to last and built to scale.',
      accent: '#ff4d2e',
    },
    {
      icon: 'monitor',
      title: 'Web & Digital',
      desc: 'Pixel-perfect sites and apps that move as fast as your ambition.',
      accent: '#2b50ff',
    },
    {
      icon: 'film',
      title: 'Motion & Video',
      desc: 'Animation, trailers, social content — moving stories that demand attention.',
      accent: '#ffd400',
    },
    {
      icon: 'megaphone',
      title: 'Campaign Design',
      desc: 'OOH, digital, print — cohesive campaigns from concept to production.',
      accent: '#b6ff3c',
    },
    {
      icon: 'package',
      title: 'Packaging',
      desc: 'Shelf presence that sells before a single word is read.',
      accent: '#ff4d2e',
    },
    {
      icon: 'type',
      title: 'Editorial & Print',
      desc: 'Books, magazines, annual reports — typography as craft.',
      accent: '#2b50ff',
    },
  ];

  protected readonly work = [
    { seed: 'brut1', client: 'Vanta Foods', year: '2025', tags: ['Packaging', 'Identity'] },
    { seed: 'brut2', client: 'Vanta Foods', year: '2025', tags: ['Packaging', 'Identity'] },
    { seed: 'brut3', client: 'NRKL Studio', year: '2025', tags: ['Web', 'Motion'] },
    { seed: 'brut4', client: 'Orbit Sport', year: '2024', tags: ['Campaign', 'Brand'] },
    { seed: 'brut5', client: 'Lumio Records', year: '2024', tags: ['Identity', 'Print'] },
    { seed: 'brut6', client: 'Kroft Gin', year: '2024', tags: ['Packaging', 'Campaign'] },
  ];

  protected readonly stats: { value: string; unit?: string; label: string }[] = [
    { value: '14', unit: 'yrs', label: 'Making brands loud' },
    { value: '280+', label: 'Projects delivered' },
    { value: '3×', label: 'Cannes Lion winner' },
    { value: '100%', label: 'Independent studio' },
  ];

  protected readonly projects: Project[] = [
    {
      project: 'Vanta Foods — Full Rebrand',
      year: '2025',
      category: 'Brand + Packaging',
      status: 'completed',
      tone: 'success',
    },
    {
      project: 'NRKL Studio — Digital Presence',
      year: '2025',
      category: 'Web + Motion',
      status: 'live',
      tone: 'info',
    },
    {
      project: 'Orbit Sport — Campaign Series',
      year: '2025',
      category: 'Campaign',
      status: 'ongoing',
      tone: 'warning',
    },
    {
      project: 'Lumio Records — Visual Identity',
      year: '2024',
      category: 'Identity',
      status: 'completed',
      tone: 'success',
    },
    {
      project: 'Kroft Gin — Launch Campaign',
      year: '2024',
      category: 'Campaign + Pack',
      status: 'completed',
      tone: 'success',
    },
    {
      project: 'Méra Hotel — Brand System',
      year: '2024',
      category: 'Identity + Web',
      status: 'completed',
      tone: 'success',
    },
    {
      project: 'Durand Atelier — Editorial',
      year: '2023',
      category: 'Print + Web',
      status: 'archived',
      tone: 'neutral',
    },
  ];

  protected readonly awards = [
    { title: 'Cannes Lions — Gold, Brand Design', year: '2025', client: 'Vanta Foods' },
    { title: 'D&AD — Yellow Pencil, Packaging', year: '2025', client: 'Kroft Gin' },
    { title: 'Cannes Lions — Silver, Campaign', year: '2024', client: 'Orbit Sport' },
    { title: 'Awwwards — Site of the Year', year: '2024', client: 'NRKL Studio' },
    { title: 'Type Directors Club — Certificate', year: '2023', client: 'Durand Atelier' },
    { title: 'Cannes Lions — Bronze, Motion Design', year: '2023', client: 'Lumio Records' },
  ];

  protected readonly team = [
    { seed: 'team1', name: 'Ines Voss', role: 'Creative Director', accent: '#ff4d2e' },
    { seed: 'team2', name: 'Theo Brunet', role: 'Design Lead', accent: '#2b50ff' },
    { seed: 'team3', name: 'Mara Kuhn', role: 'Motion Director', accent: '#ffd400' },
    { seed: 'team4', name: 'Oscar Radin', role: 'Strategy', accent: '#b6ff3c' },
    { seed: 'team5', name: 'Yuki Tanaka', role: 'Brand Designer', accent: '#ff4d2e' },
    { seed: 'team6', name: 'Sara Pinto', role: 'Digital Lead', accent: '#2b50ff' },
  ];

  protected readonly tickerTop = [
    'DESIGN',
    'BRAND',
    'MOTION',
    'PACKAGING',
    'WEB',
    'IDENTITY',
    'CAMPAIGN',
  ];
  protected readonly tickerBottom = [
    'BOLD',
    'LOUD',
    'RAW',
    'PRECISE',
    'FEARLESS',
    'INDEPENDENT',
    'CREATIVE',
  ];

  protected readonly servicesSelect = [
    'Brand Identity',
    'Web & Digital',
    'Motion & Video',
    'Campaign Design',
    'Packaging',
    'Editorial & Print',
    'Multiple / Not sure',
  ];
  protected readonly budgetSelect = [
    'Under €10k',
    '€10k – €25k',
    '€25k – €75k',
    '€75k – €150k',
    '€150k+',
  ];

  protected readonly studioLinks = ['Work', 'Services', 'About', 'Awards', 'Careers'];
  protected readonly contactFooterLinks = [
    'Start a project',
    'Partnership',
    'Press',
    'Privacy policy',
  ];
  protected readonly social = ['instagram', 'twitter', 'linkedin', 'github'];

  protected pad(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
  protected initials(name: string): string {
    return name.slice(0, 2).toUpperCase();
  }
}
