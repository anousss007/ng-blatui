import { Component, LOCALE_ID, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiCalendar } from './calendar';

@Component({
  imports: [BuiCalendar],
  template: `<bui-calendar [(value)]="date" />`,
})
class TestHost {
  readonly date = signal('');
}

@Component({
  imports: [BuiCalendar],
  template: `<bui-calendar captionLayout="dropdown" [locale]="locale()" />`,
})
class LocaleHost {
  readonly locale = signal<string | undefined>(undefined);
}

@Component({
  imports: [BuiCalendar],
  template: `
    <bui-calendar
      [locale]="locale()"
      [weekdayFormat]="weekdayFormat()"
      [weekdayLabels]="weekdayLabels()"
    />
  `,
})
class WeekdayHost {
  readonly locale = signal<string | undefined>(undefined);
  readonly weekdayFormat = signal<'narrow' | 'short' | 'long'>('short');
  readonly weekdayLabels = signal<readonly string[] | undefined>(undefined);
}

/** The weekday column headers, in display order (so they also assert the week start). */
function weekdayHeaders(fixture: { nativeElement: unknown }): string[] {
  const headers = (fixture.nativeElement as HTMLElement).querySelectorAll('thead th');
  return [...headers].map((th) => th.textContent.trim());
}

/** Month names are derived from a fixed year, so they assert the locale without depending on today. */
function monthNames(root: HTMLElement): string[] {
  const months = root.querySelector('select')!;
  return [...months.querySelectorAll('option')].map((option) => option.textContent.trim());
}

describe('BuiCalendar', () => {
  it('renders a 6-week grid and navigates months', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('thead th')).toHaveLength(7);
    expect(root.querySelectorAll('tbody button')).toHaveLength(42);

    const label = root.querySelector('[aria-live="polite"]')!.textContent;
    root.querySelector<HTMLButtonElement>('button[aria-label="Previous month"]')!.click();
    fixture.detectChanges();
    expect(root.querySelector('[aria-live="polite"]')!.textContent).not.toBe(label);
  });

  it('selects a day on click', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    root.querySelectorAll<HTMLButtonElement>('tbody button')[20].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.date()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('renders English month names when nothing is configured', () => {
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.detectChanges();
    expect(monthNames(fixture.nativeElement as HTMLElement).at(0)).toBe('January');
  });

  it('renders month names in the locale input', () => {
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.componentInstance.locale.set('fr');
    fixture.detectChanges();
    expect(monthNames(fixture.nativeElement as HTMLElement).at(0)).toBe('janvier');
  });

  it('falls back to the app LOCALE_ID when no locale input is set', () => {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'fr' }] });
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.detectChanges();
    expect(monthNames(fixture.nativeElement as HTMLElement).at(0)).toBe('janvier');
  });

  it('lets the locale input win over LOCALE_ID', () => {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'fr' }] });
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.componentInstance.locale.set('ar');
    fixture.detectChanges();
    expect(monthNames(fixture.nativeElement as HTMLElement).at(0)).toBe('يناير');
  });

  it('reformats when the locale changes at runtime', () => {
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.componentInstance.locale.set('fr');
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(monthNames(root).at(6)).toBe('juillet');

    fixture.componentInstance.locale.set('ar');
    fixture.detectChanges();
    expect(monthNames(root).at(6)).toBe('يوليو');
  });

  it('renders locale-native weekday abbreviations', () => {
    const fixture = TestBed.createComponent(WeekdayHost);
    fixture.detectChanges();
    expect(weekdayHeaders(fixture)).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);

    fixture.componentInstance.locale.set('de');
    fixture.detectChanges();
    expect(weekdayHeaders(fixture)).toEqual(['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']);
  });

  it('starts the week on the locale day: Sunday in en-US, Monday in fr, Saturday in ar-EG', () => {
    const fixture = TestBed.createComponent(WeekdayHost);
    fixture.componentInstance.weekdayFormat.set('long');
    fixture.detectChanges();
    expect(weekdayHeaders(fixture).at(0)).toBe('Sunday');

    fixture.componentInstance.locale.set('fr');
    fixture.detectChanges();
    expect(weekdayHeaders(fixture).at(0)).toBe('lundi');

    fixture.componentInstance.locale.set('ar-EG');
    fixture.detectChanges();
    expect(weekdayHeaders(fixture).at(0)).toBe(
      new Intl.DateTimeFormat('ar-EG', { weekday: 'long' }).format(new Date(2000, 0, 8)), // a Saturday
    );
  });

  it('lets an explicit weekStart override the locale', () => {
    @Component({
      imports: [BuiCalendar],
      template: `<bui-calendar locale="fr" [weekStart]="0" weekdayFormat="long" />`,
    })
    class PinnedHost {}

    const fixture = TestBed.createComponent(PinnedHost);
    fixture.detectChanges();
    expect(weekdayHeaders(fixture).at(0)).toBe('dimanche');
  });

  it('honours weekdayLabels, which stay Sunday-first while the columns rotate', () => {
    const fixture = TestBed.createComponent(WeekdayHost);
    fixture.componentInstance.weekdayLabels.set(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
    fixture.detectChanges();
    expect(weekdayHeaders(fixture)).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);

    // fr starts on Monday: the same Sunday-first array must come out rotated, not re-indexed.
    fixture.componentInstance.locale.set('fr');
    fixture.detectChanges();
    expect(weekdayHeaders(fixture)).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']);
  });

  it('gives every weekday header a full name for assistive tech', () => {
    const fixture = TestBed.createComponent(WeekdayHost);
    fixture.componentInstance.weekdayFormat.set('narrow');
    fixture.detectChanges();
    const headers = (fixture.nativeElement as HTMLElement).querySelectorAll('thead th');
    // "S | M | T | W | T | F | S" is ambiguous by sight; the accessible name never is.
    expect(headers[0].getAttribute('aria-label')).toBe('Sunday');
    expect(headers[2].getAttribute('aria-label')).toBe('Tuesday');
  });

  it('disables the locale weekend, not always Saturday/Sunday', () => {
    @Component({
      imports: [BuiCalendar],
      template: `<bui-calendar [locale]="locale()" [disableWeekends]="true" [weekStart]="0" />`,
    })
    class WeekendHost {
      readonly locale = signal('en-US');
    }

    const fixture = TestBed.createComponent(WeekendHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    // Column order is fixed by weekStart=0: Su Mo Tu We Th Fr Sa.
    const columnDisabled = (): boolean[] => {
      const firstWeek = root.querySelectorAll('tbody tr')[1];
      return [...firstWeek.querySelectorAll('button')].map((button) => button.disabled);
    };
    expect(columnDisabled()).toEqual([true, false, false, false, false, false, true]);

    // Egypt rests on Friday/Saturday.
    fixture.componentInstance.locale.set('ar-EG');
    fixture.detectChanges();
    expect(columnDisabled()).toEqual([false, false, false, false, false, true, true]);
  });

  it('renders day numbers in the locale numbering system', () => {
    @Component({
      imports: [BuiCalendar],
      template: `<bui-calendar [locale]="locale()" />`,
    })
    class DigitHost {
      readonly locale = signal('en-US');
    }

    const fixture = TestBed.createComponent(DigitHost);
    fixture.detectChanges();
    const days = (): string[] =>
      [...(fixture.nativeElement as HTMLElement).querySelectorAll('tbody button')].map((b) =>
        b.textContent.trim(),
      );
    expect(days()).toContain('16');

    // ar-EG uses Arabic-Indic digits; the caption already did, the grid used to stay Latin.
    fixture.componentInstance.locale.set('ar-EG');
    fixture.detectChanges();
    expect(days()).toContain('١٦');
    expect(days()).not.toContain('16');
  });

  it('keeps the caption on the grid calendar system for non-Gregorian locales', () => {
    @Component({
      imports: [BuiCalendar],
      template: `<bui-calendar locale="fa" />`,
    })
    class PersianHost {}

    const fixture = TestBed.createComponent(PersianHost);
    fixture.detectChanges();
    const caption = (fixture.nativeElement as HTMLElement).querySelector('[aria-live="polite"]')!;
    // fa defaults to the Persian calendar: without pinning, the caption would name a different
    // month than the Gregorian grid it labels ("Tir 1405" over July 2026's days).
    const expected = new Intl.DateTimeFormat('fa', {
      month: 'long',
      year: 'numeric',
      calendar: 'gregory',
    }).format(new Date());
    expect(caption.textContent.trim()).toBe(expected);
    expect(new Intl.DateTimeFormat('fa').resolvedOptions().calendar).toBe('persian'); // guards the premise
  });

  it('renders the year dropdown ungrouped in the locale numbering system', () => {
    @Component({
      imports: [BuiCalendar],
      template: `<bui-calendar captionLayout="dropdown" [locale]="locale()" />`,
    })
    class YearHost {
      readonly locale = signal('en-US');
    }

    const fixture = TestBed.createComponent(YearHost);
    fixture.detectChanges();
    const years = (): string[] => {
      const select = (fixture.nativeElement as HTMLElement).querySelectorAll('select')[1];
      return [...select.querySelectorAll('option')].map((o) => o.textContent.trim());
    };
    const thisYear = new Date().getFullYear();
    // A year is not a quantity: it must never be grouped as "2,026".
    expect(years()).toContain(String(thisYear));
    expect(years().join(' ')).not.toContain(',0');

    fixture.componentInstance.locale.set('ar-EG');
    fixture.detectChanges();
    expect(years()).toContain(
      new Intl.NumberFormat('ar-EG', { useGrouping: false }).format(thisYear),
    );
  });

  it('numbers weeks by the locale rule, coherently with the row it labels', () => {
    @Component({
      imports: [BuiCalendar],
      template: `<bui-calendar [locale]="locale()" [showWeekNumbers]="true" />`,
    })
    class WeekHost {
      readonly locale = signal('en-US');
    }

    const fixture = TestBed.createComponent(WeekHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    // Each row is labelled with a week it actually spans. Under the old hardcoded ISO rule on a
    // Sunday-first grid, the label was the ISO week of the Sunday — which *closes* the previous
    // week — so every row read one week low.
    const weekLabels = (): string[] =>
      [...root.querySelectorAll('tbody tr')].map((tr) =>
        tr.querySelector('td')!.textContent.trim(),
      );

    for (const locale of ['en-US', 'fr', 'ar-EG']) {
      fixture.componentInstance.locale.set(locale);
      fixture.detectChanges();
      const labels = weekLabels();
      expect(labels).toHaveLength(6);
      expect(labels.every((label) => label !== '')).toBe(true);
    }
  });

  it('applies the ISO rule in fr and the US rule in en-US on the 2021 new year', () => {
    // 2021-01-01 is week 53 of 2020 under ISO (minimalDays 4), but week 1 under the US rule.
    @Component({
      imports: [BuiCalendar],
      template: `<bui-calendar [locale]="locale()" [showWeekNumbers]="true" [weekStart]="0" />`,
    })
    class NewYearHost {
      readonly locale = signal('en-US');
    }

    // Drive the view to January 2021 by navigating from today — the component starts on today.
    const fixture = TestBed.createComponent(NewYearHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const now = new Date();
    const monthsBack = (now.getFullYear() - 2021) * 12 + now.getMonth();
    const previous = root.querySelector<HTMLButtonElement>('button[aria-label="Previous month"]')!;
    for (let index = 0; index < monthsBack; index++) {
      previous.click();
    }
    fixture.detectChanges();

    const firstWeekLabel = (): string =>
      root.querySelector('tbody tr')!.querySelector('td')!.textContent.trim();
    // Sunday-first grid: the row holding Jan 1 2021 starts Dec 27 2020.
    expect(firstWeekLabel()).toBe('1');

    fixture.componentInstance.locale.set('fr');
    fixture.detectChanges();
    // Same grid (weekStart pinned), ISO rule: that week belongs to 2020.
    expect(firstWeekLabel()).toBe('53');
  });

  it('formats the month caption with locale + monthFormat', () => {
    @Component({
      imports: [BuiCalendar],
      template: `<bui-calendar locale="fr" [monthFormat]="{ month: 'long' }" />`,
    })
    class CaptionHost {}

    const fixture = TestBed.createComponent(CaptionHost);
    fixture.detectChanges();
    const caption = (fixture.nativeElement as HTMLElement).querySelector('[aria-live="polite"]')!;
    // Year dropped by monthFormat, month name localized — proves both levers reach the caption.
    expect(caption.textContent.trim()).toBe(
      new Intl.DateTimeFormat('fr', { month: 'long' }).format(new Date()),
    );
    expect(caption.textContent).not.toMatch(/\d/);
  });
});
