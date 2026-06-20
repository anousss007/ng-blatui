import { Component } from '@angular/core';

import { CodeBlock } from '../ui/code-block';

@Component({
  selector: 'app-theming',
  imports: [CodeBlock],
  template: `
    <article class="max-w-3xl space-y-10">
      <header class="space-y-2">
        <h1 class="text-3xl font-bold tracking-tight">Theming</h1>
        <p class="text-muted-foreground">
          Every visual decision is a CSS variable. Override the tokens, flip data-attributes, or
          drive it all at runtime with <code>ThemeStore</code>.
        </p>
      </header>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold">Design tokens</h2>
        <p class="text-sm text-muted-foreground">
          Override any token under <code>:root</code> (and <code>.dark</code> for dark mode). Colors
          are oklch; the radius/spacing/shadow scales derive from a single value.
        </p>
        <app-code [code]="tokens" />
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold">Presets via data-attributes</h2>
        <p class="text-sm text-muted-foreground">
          Set <code>data-*</code> attributes on <code>&lt;html&gt;</code> to switch base color,
          accent, radius, fonts, etc. The bundled tokens ship rules for each.
        </p>
        <app-code [code]="attrs" />
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold">Runtime: ThemeStore</h2>
        <p class="text-sm text-muted-foreground">
          A signals-based, SSR-safe service that powers the <strong>Customize</strong> toolbar. Tune
          the theme in code and export a paste-ready stylesheet.
        </p>
        <app-code [code]="store" />
      </section>
    </article>
  `,
})
export class Theming {
  protected readonly tokens = `:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --radius: 0.625rem;
}
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}`;
  protected readonly attrs = `<html data-base="stone" data-theme="violet" data-radius="1" class="dark">`;
  protected readonly store = `import { inject } from '@angular/core';
import { ThemeStore } from 'ng-blatui';

const theme = inject(ThemeStore);
theme.setPreset('violet');   // accent
theme.setBase('stone');      // base color
theme.toggle();              // light <-> dark
const css = theme.exportCss(); // complete, paste-ready stylesheet`;
}
