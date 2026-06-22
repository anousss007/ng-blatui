import { Component } from '@angular/core';

import { CodeBlock } from '../ui/code-block';

@Component({
  selector: 'app-installation',
  imports: [CodeBlock],
  template: `
    <article class="max-w-3xl space-y-10">
      <header class="space-y-2">
        <h1 class="text-3xl font-bold tracking-tight">Installation</h1>
        <p class="text-muted-foreground">
          ng-blatui targets Angular 21 &amp; 22 with Tailwind CSS v4. Three short steps and you're
          ready.
        </p>
      </header>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold">1. Install the packages</h2>
        <p class="text-sm text-muted-foreground">
          The library plus its headless peers (Angular Aria &amp; the CDK).
        </p>
        <app-code [code]="install" />
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold">2. Add Tailwind CSS v4</h2>
        <p class="text-sm text-muted-foreground">Install Tailwind and the PostCSS plugin…</p>
        <app-code [code]="tailwindInstall" />
        <p class="text-sm text-muted-foreground">…then create <code>.postcssrc.json</code>:</p>
        <app-code [code]="postcss" />
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold">3. Import the design tokens</h2>
        <p class="text-sm text-muted-foreground">
          In your global <code>src/styles.css</code> — Tailwind, the ng-blatui tokens, and a
          <code>&#64;source</code> so Tailwind generates the utility classes the components use.
        </p>
        <app-code [code]="styles" />
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold">4. Use a component</h2>
        <p class="text-sm text-muted-foreground">
          Import the standalone directive/component and use it in any template.
        </p>
        <app-code [code]="usage" />
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-semibold">Next</h2>
        <p class="text-sm text-muted-foreground">
          See every component with live previews and copy-paste code on the
          <a class="text-primary underline-offset-4 hover:underline" href="/components"
            >Components</a
          >
          page, or tune the look from the <strong>Customize</strong> button (bottom-right).
        </p>
      </section>
    </article>
  `,
})
export class Installation {
  protected readonly install = 'npm i ng-blatui @angular/cdk @angular/aria';
  protected readonly tailwindInstall = 'npm i -D tailwindcss @tailwindcss/postcss';
  protected readonly postcss = `// .postcssrc.json
{
  "plugins": { "@tailwindcss/postcss": {} }
}`;
  protected readonly styles = `/* src/styles.css */
@import 'tailwindcss';
@import 'ng-blatui/foundations/blatui.css';

/* let Tailwind generate the utilities ng-blatui renders */
@source '../node_modules/ng-blatui';`;
  protected readonly usage = `import { Component } from '@angular/core';
import { BuiButton } from 'ng-blatui';

@Component({
  selector: 'app-demo',
  imports: [BuiButton],
  template: \`<button buiButton>Click me</button>\`,
})
export class Demo {}`;
}
