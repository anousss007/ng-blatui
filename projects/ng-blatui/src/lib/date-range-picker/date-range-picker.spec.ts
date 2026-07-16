import { Component, LOCALE_ID, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { type CalendarRange } from '../calendar/calendar';
import { provideBuiLabels } from '../i18n/labels';

import { BuiDateRangePicker, type DateRangePreset } from './date-range-picker';

const RANGE: CalendarRange = { start: '2026-07-16', end: '2026-07-20' };

@Component({
  imports: [BuiDateRangePicker],
  template: `<bui-date-range-picker [value]="range" [locale]="locale()" [presets]="[]" />`,
})
class LocaleHost {
  readonly range = RANGE;
  readonly locale = signal<string | undefined>(undefined);
}

function triggerText(fixture: { nativeElement: unknown }): string {
  return (fixture.nativeElement as HTMLElement).querySelector('button')!.textContent.trim();
}

@Component({
  imports: [BuiDateRangePicker],
  template: `<bui-date-range-picker [(value)]="range" [presets]="presets" />`,
})
class TestHost {
  readonly range = signal<CalendarRange>({ start: '', end: '' });
  readonly presets: DateRangePreset[] = [
    { label: 'Q1', range: { start: '2026-01-01', end: '2026-03-31' } },
    { label: 'Q2', range: { start: '2026-04-01', end: '2026-06-30' } },
  ];
}

describe('BuiDateRangePicker', () => {
  it('shows the placeholder until a range is chosen', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const trigger = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    expect(trigger.textContent).toContain('Pick a date range');
  });

  it('opens a dialog with the provided presets and applies one', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const trigger = (fixture.nativeElement as HTMLElement).querySelector('button')!;

    trigger.click();
    fixture.detectChanges();
    // The popover is portalled into the CDK overlay (attached to the document).
    const presetButtons = [
      ...document.querySelectorAll<HTMLElement>('.cdk-overlay-container button'),
    ];
    const q1 = presetButtons.find((b) => b.textContent.trim() === 'Q1');
    expect(q1).toBeTruthy();

    q1!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.range()).toEqual({ start: '2026-01-01', end: '2026-03-31' });
    // Applying a preset closes the popover.
    expect(document.querySelector('.cdk-overlay-container [role="dialog"]')).toBeNull();
  });

  it('formats the selected range on the trigger', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.range.set({ start: '2026-01-01', end: '2026-03-31' });
    fixture.detectChanges();
    const trigger = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    expect(trigger.textContent).toContain('–');
    expect(trigger.textContent).toContain('2026');
  });

  // Before locale support this component alone passed `undefined` to toLocaleDateString, i.e. the
  // browser locale — a third behavior, neither en-US nor configurable. It now matches its siblings.
  it('renders the en-US format when nothing is configured', () => {
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.detectChanges();
    expect(triggerText(fixture)).toBe('Jul 16, 2026 – Jul 20, 2026');
  });

  it('renders dd/mm/yyyy with a French locale and a short pattern', () => {
    @Component({
      imports: [BuiDateRangePicker],
      template: `
        <bui-date-range-picker
          [value]="range"
          locale="fr"
          [dateFormat]="{ dateStyle: 'short' }"
          [presets]="[]"
        />
      `,
    })
    class FormatHost {
      readonly range = RANGE;
    }

    const fixture = TestBed.createComponent(FormatHost);
    fixture.detectChanges();
    expect(triggerText(fixture)).toBe('16/07/2026 – 20/07/2026');
  });

  it('formats in Arabic (RTL)', () => {
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.componentInstance.locale.set('ar');
    fixture.detectChanges();
    expect(triggerText(fixture)).toContain('يوليو');
  });

  it('reformats when the locale changes at runtime', () => {
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.detectChanges();
    expect(triggerText(fixture)).toContain('Jul 16, 2026');

    fixture.componentInstance.locale.set('fr');
    fixture.detectChanges();
    expect(triggerText(fixture)).toContain('16 juil. 2026');
  });

  it('follows the app LOCALE_ID when no locale input is set', () => {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'fr' }] });
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.detectChanges();
    expect(triggerText(fixture)).toContain('16 juil. 2026');
  });

  it('translates the built-in presets via provideBuiLabels, keeping their date math', () => {
    TestBed.configureTestingModule({
      providers: [
        provideBuiLabels({
          dateRangePresetToday: "Aujourd'hui",
          dateRangePresetLast7Days: '7 derniers jours',
          dateRangePickerPlaceholder: 'Choisir une période',
        }),
      ],
    });

    @Component({
      imports: [BuiDateRangePicker],
      template: `<bui-date-range-picker />`,
    })
    class DefaultPresetHost {}

    const fixture = TestBed.createComponent(DefaultPresetHost);
    fixture.detectChanges();
    expect(triggerText(fixture)).toBe('Choisir une période');

    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button')!.click();
    fixture.detectChanges();
    const presets = [...document.querySelectorAll('.cdk-overlay-container li button')].map((b) =>
      b.textContent.trim(),
    );
    // Translating a label used to mean redefining the whole array *and* redoing the date math.
    expect(presets).toContain("Aujourd'hui");
    expect(presets).toContain('7 derniers jours');
    expect(presets).not.toContain('Today');
    // Untranslated keys keep their English default rather than disappearing.
    expect(presets).toContain('Last 30 days');
  });

  it('keeps the English preset labels by default', () => {
    @Component({
      imports: [BuiDateRangePicker],
      template: `<bui-date-range-picker />`,
    })
    class DefaultPresetHost {}

    const fixture = TestBed.createComponent(DefaultPresetHost);
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button')!.click();
    fixture.detectChanges();
    const presets = [...document.querySelectorAll('.cdk-overlay-container li button')].map((b) =>
      b.textContent.trim(),
    );
    expect(presets).toEqual(['Today', 'Last 7 days', 'Last 30 days', 'This month', 'Last month']);
  });

  it('propagates the locale to the popover calendar', () => {
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.componentInstance.locale.set('fr');
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement).querySelector('button')!.click();
    fixture.detectChanges();
    const captions = [...document.querySelectorAll('.cdk-overlay-container [aria-live="polite"]')];
    expect(captions.length).toBeGreaterThan(0);
    expect(captions[0].textContent.trim()).toMatch(
      /janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre/,
    );
  });
});
