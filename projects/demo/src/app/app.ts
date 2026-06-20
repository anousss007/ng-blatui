import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { BuiButton, BuiThemeCustomizer } from 'ng-blatui';

interface NavLink {
  readonly label: string;
  readonly path: string;
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
  'breadcrumb',
  'button-group',
  'kbd',
  'aspect-ratio',
  'collapsible',
  'empty',
  'field',
  'container',
  'toggle',
  'spinner',
  'copy-button',
  'banner',
  'table',
  'avatar-group',
  'pagination',
  'popover',
  'item',
  'scroll-area',
  'input-group',
  'meter',
  'stat',
  'visually-hidden',
  'hover-card',
  'code-block',
  'slider',
  'rating',
  'quantity-selector',
  'alert-dialog',
  'autosize-textarea',
  'dropdown-menu',
  'menubar',
  'typography',
  'segmented-control',
  'dot-pattern',
  'grid-pattern',
  'terminal',
  'comparison-table',
  'flip-card',
  'spotlight-card',
  'tilt-card',
  'select',
  'combobox',
  'back-to-top',
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
        label: slug
          .split('-')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' '),
        path: `/components/${slug}`,
      })),
    },
  ];
}
