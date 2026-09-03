import { Injectable, signal } from '@angular/core';

/** What the docs site formats in until a reader asks for something else. */
export const DEMO_DEFAULT_LOCALE = 'en-US';

/**
 * The docs site's own locale, handed to ng-blatui in `app.config.ts` through
 * `provideBuiLocale(() => inject(DemoLocale).locale)` — the same factory-plus-signal shape a
 * Transloco or ngx-translate app uses, with this store standing in for their service. The
 * Localization page writes it so its live example reformats, and puts it back on the way out.
 */
@Injectable({ providedIn: 'root' })
export class DemoLocale {
  readonly locale = signal(DEMO_DEFAULT_LOCALE);
}
