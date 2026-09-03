import { Component } from '@angular/core';

import { CodeBlock } from '../ui/code-block';

@Component({
  selector: 'app-localization',
  imports: [CodeBlock],
  template: `
    <article class="max-w-3xl space-y-10">
      <header class="space-y-2">
        <h1 class="text-3xl font-bold tracking-tight">Localization</h1>
        <p class="text-muted-foreground">
          Two providers cover the whole library: one for the locale it formats dates, times and
          numbers in, one for its built-in strings. Both take a signal, so an app that switches
          language at runtime is covered — with any translation library, or none.
        </p>
      </header>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold">Locale</h2>
        <p class="text-sm text-muted-foreground">
          Dates, times, numbers, currencies, the first day of the week, which days are the weekend
          and how week numbers are counted all follow one BCP&nbsp;47 tag. Set it once:
        </p>
        <app-code [code]="locale" />
        <p class="text-sm text-muted-foreground">
          <strong>If you set nothing, you get <code>en-US</code></strong> — that is Angular's own
          default for <code>LOCALE_ID</code>, not a choice ng-blatui makes. It is the single most
          common reason pickers stay American in an app that is not.
        </p>
        <p class="text-sm text-muted-foreground">
          Resolution runs most-specific first: a component's own <code>[locale]</code> input →
          <code>provideBuiLocale()</code> → the app's <code>LOCALE_ID</code> → <code>en-US</code>.
          You never need <code>registerLocaleData()</code> for ng-blatui: it formats through
          <code>Intl</code>, which every browser already carries. That import is only for Angular's
          own <code>date</code> / <code>number</code> pipes.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold">Strings</h2>
        <p class="text-sm text-muted-foreground">
          Every user-facing string that is not already a component input — mostly
          <code>aria-label</code>s on icon-only controls, plus a little visible micro-copy — lives
          in one flat, typed <code>BuiLabels</code> interface. Override the keys you care about; the
          rest keep their English defaults.
        </p>
        <app-code [code]="labels" />
        <p class="text-sm text-muted-foreground">
          Any single label can also be set per instance, which wins over the app-wide map:
          <code>&lt;bui-file-upload removeLabel="Retirer" /&gt;</code>.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold">With a translation library</h2>
        <p class="text-sm text-muted-foreground">
          ng-blatui depends on no translation library and knows no translation format. It accepts a
          signal, which is the one thing every library can produce — directly, or through
          <code>toSignal()</code> over whatever its change notification is. A factory runs in an
          injection context, so the library's own service is reachable from inside it.
        </p>
        <app-code [code]="transloco" />
        <p class="text-sm text-muted-foreground">
          The same shape works for ngx-translate (<code>onLangChange</code>), a custom signal store,
          or anything else. What ng-blatui is handed is <em>already-resolved strings</em>, never
          keys and never a file to load — so your catalogue stays where it is, in your own library's
          format.
        </p>
        <p class="text-sm text-muted-foreground">
          With Angular's compile-time i18n (<code>$localize</code>), there is nothing reactive to
          bridge: each build is one language, so a plain map is exactly right.
        </p>
        <app-code [code]="localize" />
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold">Right-to-left</h2>
        <p class="text-sm text-muted-foreground">
          Layout is written in logical properties throughout, so RTL needs no locale wiring and no
          separate stylesheet — set the document direction and the whole library mirrors.
        </p>
        <app-code [code]="rtl" />
      </section>
    </article>
  `,
})
export class Localization {
  protected readonly locale = `import { provideBuiLocale } from 'ng-blatui';

export const appConfig: ApplicationConfig = {
  providers: [provideBuiLocale('fr-BE')],
};`;

  protected readonly labels = `import { provideBuiLabels } from 'ng-blatui';

providers: [
  provideBuiLabels({
    fileUploadDropzone: 'Cliquez ou déposez un fichier',
    fileUploadRemove: 'Supprimer le fichier',
    dataTableSearch: 'Rechercher',
  }),
];`;

  protected readonly transloco = `import { computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { provideBuiLabels, provideBuiLocale } from 'ng-blatui';
import { TranslocoService } from '@jsverse/transloco';

providers: [
  // The tag itself — a signal, so a language switch reformats every date on screen.
  provideBuiLocale(() =>
    toSignal(inject(TranslocoService).langChanges$, { initialValue: 'fr' }),
  ),

  // …and the strings, read from your own catalogue.
  provideBuiLabels(() => {
    const transloco = inject(TranslocoService);
    const lang = toSignal(transloco.langChanges$, { initialValue: transloco.getActiveLang() });
    return computed(() => {
      lang(); // re-read whenever the active language changes
      return {
        fileUploadRemove: transloco.translate('ui.file_upload.remove'),
        dataTableSearch: transloco.translate('ui.data_table.search'),
      };
    });
  }),
];`;

  protected readonly localize = `providers: [
  provideBuiLabels({ fileUploadRemove: $localize\`Remove file\` }),
];`;

  protected readonly rtl = `<html dir="rtl" lang="ar">`;
}
