import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { BuiButton, BuiThemeCustomizer } from 'ng-blatui';

import { CATEGORIES, labelFor } from './pages/categories';

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
  /** Home is full-bleed (showcase). */
  protected readonly isHome = computed(() => this.url() === '/' || this.url() === '');
  /** Home + individual template pages render full-bleed (standalone, no sidebar). */
  protected readonly isFullBleed = computed(
    () => this.isHome() || this.url().startsWith('/templates/'),
  );
  /** Component routes (/components, /components/:slug) get the categorized docs sidebar. */
  protected readonly isComponentRoute = computed(() => this.url().startsWith('/components'));
  /** Docs routes (/docs/*) get the docs sidebar. */
  protected readonly isDocsRoute = computed(() => this.url().startsWith('/docs'));
  /** Mobile slide-over navigation (hamburger menu). */
  protected readonly mobileNavOpen = signal(false);

  constructor() {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }

      this.url.set(event.urlAfterRedirects.split('?', 1)[0]);
      this.mobileNavOpen.set(false);
    });
  }

  /** Top-level sections in the header, in BlatUI's order. */
  protected readonly sections: readonly NavLink[] = [
    { label: 'Docs', path: '/docs/installation' },
    { label: 'Components', path: '/components' },
    { label: 'Blocks', path: '/blocks' },
    { label: 'Templates', path: '/templates' },
    { label: 'Charts', path: '/charts' },
    { label: 'Themes', path: '/themes' },
  ];

  /** Docs sidebar links. */
  protected readonly docsLinks: readonly NavLink[] = [
    { label: 'Installation', path: '/docs/installation' },
    { label: 'Theming', path: '/docs/theming' },
    { label: 'AI & MCP', path: '/docs/ai' },
  ];

  /** Categorized component sidebar — mirrors BlatUI's docs sidebar (config/docs.php). */
  protected readonly componentGroups: readonly NavGroup[] = (() => {
    const present = new Set(COMPONENTS);
    const categorized = new Set(CATEGORIES.flatMap((c) => c.slugs));
    const groups: NavGroup[] = CATEGORIES.map((c) => ({
      title: c.label,
      links: c.slugs
        .filter((slug) => present.has(slug))
        .map((slug) => ({ label: labelFor(slug), path: `/components/${slug}` })),
    })).filter((g) => g.links.length > 0);
    const others = COMPONENTS.filter((slug) => !categorized.has(slug));
    if (others.length > 0) {
      groups.push({
        title: 'Other',
        links: others.map((slug) => ({ label: labelFor(slug), path: `/components/${slug}` })),
      });
    }
    return groups;
  })();
}
