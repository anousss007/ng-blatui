import { Component, DestroyRef, inject } from '@angular/core';

import {
  BuiCalendar,
  BuiDatePicker,
  BuiMoneyInput,
  BuiSelect,
  BuiTimeField,
  type SelectOption,
} from 'ng-blatui';

import { CodeBlock } from '../ui/code-block';
import { DEMO_DEFAULT_LOCALE, DemoLocale } from '../ui/demo-locale';

@Component({
  selector: 'app-localization',
  imports: [CodeBlock, BuiCalendar, BuiDatePicker, BuiMoneyInput, BuiSelect, BuiTimeField],
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

        <div class="rounded-lg border p-4">
          <div class="flex flex-wrap items-center gap-3">
            <label class="text-sm font-medium" for="demo-locale">This page's locale</label>
            <bui-select
              id="demo-locale"
              class="w-56"
              aria-label="Locale for the live example"
              [options]="locales"
              [value]="demoLocale.locale()"
              (valueChange)="setLocale($event)"
            />
            <span class="text-xs text-muted-foreground">
              Nothing below takes a <code>locale</code> input — they all read the provider.
            </span>
          </div>

          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <p class="text-xs font-medium text-muted-foreground">Date picker</p>
              <bui-date-picker value="2026-06-15" />
              <p class="text-xs font-medium text-muted-foreground">Time, in the locale's clock</p>
              <bui-time-field mode="select" value="18:30" />
              <p class="text-xs font-medium text-muted-foreground">Amount</p>
              <bui-money-input class="w-full" [value]="1234.5" currency="EUR" />
            </div>
            <div class="space-y-2">
              <p class="text-xs font-medium text-muted-foreground">
                Calendar — first day, weekend and week numbering follow the locale
              </p>
              <bui-calendar value="2026-06-15" [showWeekNumbers]="true" />
            </div>
          </div>
        </div>

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
        <p class="text-sm text-muted-foreground">
          The switcher above is not a trick for the docs — it is this site's own configuration:
        </p>
        <app-code [code]="siteWiring" />
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
  /** The site's own locale store — the live example writes it, and app.config reads it. */
  protected readonly demoLocale = inject(DemoLocale);
  protected readonly locales: readonly SelectOption[] = [
    { value: 'en-US', label: 'English (US) — en-US' },
    { value: 'fr-BE', label: 'Français (Belgique) — fr-BE' },
    { value: 'de-DE', label: 'Deutsch — de-DE' },
    { value: 'ja-JP', label: '日本語 — ja-JP' },
    { value: 'ar-EG', label: 'العربية (مصر) — ar-EG' },
  ];

  constructor() {
    // The store is app-wide, so the rest of the site does not keep whatever was picked here.
    inject(DestroyRef).onDestroy(() => {
      this.demoLocale.locale.set(DEMO_DEFAULT_LOCALE);
    });
  }

  protected setLocale(value: string | readonly string[]): void {
    this.demoLocale.locale.set(typeof value === 'string' ? value : DEMO_DEFAULT_LOCALE);
  }

  protected readonly locale = `import { provideBuiLocale } from 'ng-blatui';

export const appConfig: ApplicationConfig = {
  providers: [provideBuiLocale('fr-BE')],
};`;

  protected readonly siteWiring = `// This very site, in app.config.ts — a signal owned by a service,
// which is the same shape a translation library's service is reached in.
providers: [provideBuiLocale(() => inject(DemoLocale).locale)];`;

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
