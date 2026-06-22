/* eslint-disable unicorn/name-replacements -- "docs" matches the BlatUI template slug + route */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { Lucide } from './lucide';

interface NavSection {
  heading: string;
  links: { label: string; active: boolean }[];
}

/** DocsSite — "Helix Docs" documentation page: sidebar nav + article (prose, code, callouts, table) + On-this-page TOC. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-docs-site',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Lucide],
  templateUrl: './docs-site.html',
  styleUrl: './docs-site.css',
})
export class DocsSiteTemplate {
  protected readonly sections: NavSection[] = [
    {
      heading: 'Getting Started',
      links: [
        { label: 'Introduction', active: true },
        { label: 'Installation', active: false },
        { label: 'Quick start', active: false },
        { label: 'Project structure', active: false },
      ],
    },
    {
      heading: 'Guides',
      links: [
        { label: 'Theming', active: false },
        { label: 'Dark mode', active: false },
        { label: 'Accessibility', active: false },
        { label: 'Forms', active: false },
        { label: 'Deployment', active: false },
      ],
    },
    {
      heading: 'Components',
      links: [
        { label: 'Overview', active: false },
        { label: 'Button', active: false },
        { label: 'Dialog', active: false },
        { label: 'Data table', active: false },
      ],
    },
    {
      heading: 'API',
      links: [
        { label: 'CLI reference', active: false },
        { label: 'Registry', active: false },
        { label: 'Configuration', active: false },
      ],
    },
  ];

  protected readonly toc = [
    { label: 'Overview', anchor: 'overview' },
    { label: 'Requirements', anchor: 'requirements' },
    { label: 'Install the package', anchor: 'install' },
    { label: 'Configuration', anchor: 'config' },
    { label: 'Next steps', anchor: 'next' },
  ];

  protected readonly installCmd = '$ npm install helix-ui @helix/core';

  protected readonly configRows = [
    { o: 'theme', t: 'string', d: '"system"' },
    { o: 'prefix', t: 'string', d: '"hx-"' },
    { o: 'strict', t: 'boolean', d: 'false' },
    { o: 'outDir', t: 'string', d: '"./dist"' },
  ];
}
