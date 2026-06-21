import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { BuiButton, BuiThemeCustomizer } from 'ng-blatui';

import { BLOCKS } from './pages/blocks';
import { TEMPLATES } from './pages/templates';

interface NavLink {
  readonly label: string;
  readonly path: string;
}
interface NavGroup {
  readonly title: string;
  readonly links: readonly NavLink[];
}

export const COMPONENTS = [
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
  'countdown',
  'number-ticker',
  'link',
  'gradient-text',
  'page-header',
  'quote',
  'price',
  'stack',
  'accent',
  'kbd-group',
  'presence',
  'timeline',
  'description-list',
  'masonry',
  'bento-grid',
  'gallery',
  'loading-overlay',
  'number-input',
  'variant-selector',
  'sparkline',
  'add-to-cart',
  'password-strength',
  'product-card',
  'typewriter',
  'streaming-text',
  'border-beam',
  'meteors',
  'aurora',
  'marquee',
  'bottom-navigation',
  'text-reveal',
  'parallax',
  'scrollspy',
  'time-field',
  'toggle-group',
  'tags-input',
  'editable',
  'speed-dial',
  'knob',
  'image',
  'reasoning',
  'tool-call',
  'chat',
  'confetti',
  'stepper',
  'input-otp',
  'phone-input',
  'prompt-input',
  'heatmap',
  'citation',
  'resizable',
  'video',
  'color-picker',
  'cookie-consent',
  'infinite-scroll',
  'audio-player',
  'signature-pad',
  'dock',
  'tree',
  'repeater',
  'notification-center',
  'json-viewer',
  'org-chart',
  'mini-cart',
  'animated-beam',
  'diff-viewer',
  'tree-table',
  'markdown-editor',
  'calendar',
  'date-picker',
  'carousel',
  'command',
  'context-menu',
  'data-table',
  'chart',
  'datetime-picker',
  'autocomplete',
  'comparison-slider',
  'file-upload',
  'top-progress',
  'drawer',
  'input-mask',
  'sheet',
  'sonner',
  'navigation-menu',
  'mention-input',
  'map',
  'gantt',
  'scheduler',
  'kanban',
  'rich-text-editor',
  'sidebar',
  'onboarding-tour',
  'qr-code',
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, BuiButton, BuiThemeCustomizer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  private readonly url = signal('/');
  /** Home is full-bleed (showcase); every other route gets the docs sidebar layout. */
  protected readonly isHome = computed(() => this.url() === '/' || this.url() === '');

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url.set(event.urlAfterRedirects.split('?', 1)[0]);
      }
    });
  }

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
    {
      title: 'Blocks',
      links: BLOCKS.map((slug) => ({
        label: slug
          .split('-')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' '),
        path: `/blocks/${slug}`,
      })),
    },
    {
      title: 'Templates',
      links: TEMPLATES.map((slug) => ({
        label: slug
          .split('-')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' '),
        path: `/templates/${slug}`,
      })),
    },
  ];
}
