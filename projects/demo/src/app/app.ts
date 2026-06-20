import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { BuiButton, BuiThemeCustomizer } from 'ng-blatui';

interface NavLink {
  readonly label: string;
  readonly path: string;
  readonly fragment?: string;
}
interface NavGroup {
  readonly title: string;
  readonly links: readonly NavLink[];
}

const COMPONENTS = [
  'button',
  'badge',
  'card',
  'alert',
  'input',
  'textarea',
  'label',
  'separator',
  'skeleton',
  'avatar',
  'progress',
  'checkbox',
  'switch',
  'radio-group',
  'accordion',
  'tabs',
  'dialog',
  'tooltip',
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, BuiButton, BuiThemeCustomizer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly nav: readonly NavGroup[] = [
    {
      title: 'Getting started',
      links: [
        { label: 'Introduction', path: '/' },
        { label: 'Installation', path: '/docs/installation' },
        { label: 'Theming', path: '/docs/theming' },
      ],
    },
    {
      title: 'Components',
      links: COMPONENTS.map((slug) => ({
        label: slug.charAt(0).toUpperCase() + slug.slice(1),
        path: '/components',
        fragment: slug,
      })),
    },
  ];
}
