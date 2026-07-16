import { computed, inject, LOCALE_ID, type Signal } from '@angular/core';

/**
 * Resolve the BCP 47 locale a component formats dates in, most-specific wins:
 * per-instance `locale` input → the app's `LOCALE_ID` → `'en-US'` (Angular's own default).
 *
 * Call from an injection context (a component field initializer):
 *
 * ```ts
 * readonly locale = input<string>();
 * protected readonly resolvedLocale = buiLocale(this.locale);
 * ```
 *
 * The input stays a signal on purpose: apps that switch language at runtime (transloco &
 * co.) need the display to reformat, which a statically-injected `LOCALE_ID` cannot do.
 */
export function buiLocale(override: Signal<string | undefined>): Signal<string> {
  const localeId = inject(LOCALE_ID);
  return computed(() => {
    const value = override();
    return value === undefined || value === '' ? localeId : value;
  });
}

/**
 * The calendar system ng-blatui's date grids are built on. They are computed from JavaScript
 * `Date`, so they are Gregorian, and every label that describes them is pinned to it — otherwise
 * a locale whose default era is not Gregorian (`th` → Buddhist 2569, `fa` → Persian 1405) would
 * name a month or year the grid is not showing.
 *
 * The pickers apply it as a *default* their `dateFormat` can override: pass
 * `[dateFormat]="{ calendar: 'persian' }"` to display a value in another calendar system.
 */
export const BUI_GRID_CALENDAR = 'gregory';

/** Which day starts the week, which days are the weekend, and how week 1 is picked. */
export interface BuiWeekInfo {
  /** First day of the week, `0` = Sunday. */
  firstDay: number;
  /** Days that form the local weekend, `0` = Sunday. */
  weekend: readonly number[];
  /**
   * How many days of January the year's first week must contain: `4` for the ISO-8601 rule most
   * of Europe uses, `1` in the US, where the week containing Jan 1 is always week 1. Comes from
   * a CLDR table, not `Intl` — see {@link ISO_WEEK_REGIONS}.
   */
  minimalDays: number;
}

/**
 * The runtime shape of `Intl.Locale`'s week data, which the type checker cannot describe here:
 * `lib.esnext.intl` declares `getWeekInfo()` as always present, this library targets ES2022
 * where it does not exist at all, and Safari exposes the same data as a `weekInfo` getter.
 * Both are optional on purpose — engines really do ship without them.
 */
interface LocaleWeekInfo {
  getWeekInfo?: () => { firstDay: number; weekend: readonly number[] };
  weekInfo?: { firstDay: number; weekend: readonly number[] };
}

/**
 * CLDR's `minDays` is 1 everywhere except these regions, which follow the ISO-8601 rule.
 *
 * It is a table rather than a lookup because `Intl`'s own `minimalDays` cannot be trusted: V8
 * dropped it, so it is absent in Chrome and Node 24 but still present in Node 22. Reading it
 * would number weeks differently depending on the engine — and yield `NaN` where it is gone.
 */
const ISO_WEEK_REGIONS = new Set([
  'AD',
  'AN',
  'AT',
  'AX',
  'BE',
  'BG',
  'CH',
  'CZ',
  'DE',
  'DK',
  'EE',
  'ES',
  'FI',
  'FJ',
  'FO',
  'FR',
  'GB',
  'GF',
  'GG',
  'GI',
  'GP',
  'GR',
  'HU',
  'IE',
  'IM',
  'IS',
  'IT',
  'JE',
  'LI',
  'LT',
  'LU',
  'MC',
  'MQ',
  'NL',
  'NO',
  'PL',
  'PT',
  'RE',
  'RU',
  'SE',
  'SJ',
  'SK',
  'SM',
  'VA',
]);

/** Anglo/Western default, used when the engine has no week data for the locale. */
const FALLBACK_WEEK_INFO: BuiWeekInfo = { firstDay: 0, weekend: [0, 6], minimalDays: 1 };

function minimalDaysFor(locale: string): number {
  try {
    const region = new Intl.Locale(locale).maximize().region;
    return region !== undefined && ISO_WEEK_REGIONS.has(region) ? 4 : 1;
  } catch {
    return FALLBACK_WEEK_INFO.minimalDays;
  }
}

/** `Intl` counts Monday=1..Sunday=7; the calendar counts Sunday=0..Saturday=6. */
function toSundayZero(day: number): number {
  return day % 7;
}

function readWeekInfo(locale: string): BuiWeekInfo {
  // Typed as `object` so the narrowing below is a real assertion under every `lib` setting.
  let resolved: object;
  try {
    resolved = new Intl.Locale(locale);
  } catch {
    // An unparseable locale tag is the caller's bug, but not worth breaking a calendar over.
    return FALLBACK_WEEK_INFO;
  }
  const source = resolved as LocaleWeekInfo;
  const info = source.getWeekInfo?.() ?? source.weekInfo;
  return info === undefined
    ? FALLBACK_WEEK_INFO
    : {
        firstDay: toSundayZero(info.firstDay),
        weekend: info.weekend.map((day) => toSundayZero(day)),
        minimalDays: minimalDaysFor(locale),
      };
}

/**
 * The locale's own week conventions, so a calendar is not silently US-shaped: `fr` starts the
 * week on Monday, `ar-EG` on Saturday with a Friday/Saturday weekend, `en-US` on Sunday with a
 * Saturday/Sunday weekend — the last being exactly the library's pre-locale behavior.
 *
 * Falls back to the US convention on engines without week data (rather than throwing), so this
 * only ever adds correctness.
 */
export function buiWeekInfo(locale: Signal<string>): Signal<BuiWeekInfo> {
  return computed(() => readWeekInfo(locale()));
}
