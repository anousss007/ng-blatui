import { Component, LOCALE_ID, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideBuiLabels } from '../i18n/labels';

import { BuiDatePicker } from './date-picker';

@Component({
  imports: [BuiDatePicker],
  template: `<bui-date-picker [(value)]="date" placeholder="Pick a date" />`,
})
class TestHost {
  readonly date = signal('');
}

@Component({
  imports: [BuiDatePicker],
  template: `
    <bui-date-picker value="2026-07-16" [locale]="locale()" [dateFormat]="dateFormat()" />
  `,
})
class LocaleHost {
  readonly locale = signal<string | undefined>(undefined);
  readonly dateFormat = signal<Intl.DateTimeFormatOptions>({
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function triggerText(fixture: { nativeElement: unknown }): string {
  return (fixture.nativeElement as HTMLElement)
    .querySelector('button[aria-expanded]')!
    .textContent.trim();
}

describe('BuiDatePicker', () => {
  it('opens the calendar and selects a date', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const trigger = root.querySelector<HTMLButtonElement>('button[aria-expanded]')!;
    expect(trigger.textContent).toContain('Pick a date');

    trigger.click();
    fixture.detectChanges();
    // The calendar is portalled into the CDK overlay (attached to the document), not the host.
    expect(document.querySelector('bui-calendar')).not.toBeNull();

    document.querySelectorAll<HTMLButtonElement>('.cdk-overlay-container tbody button')[15].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.date()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(document.querySelector('bui-calendar')).toBeNull(); // closed after pick
  });

  it('renders the pre-locale en-US format when nothing is configured', () => {
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.detectChanges();
    expect(triggerText(fixture)).toBe('Jul 16, 2026');
  });

  it('renders dd/mm/yyyy with a French locale and a short pattern', () => {
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.componentInstance.locale.set('fr');
    fixture.componentInstance.dateFormat.set({ dateStyle: 'short' });
    fixture.detectChanges();
    expect(triggerText(fixture)).toBe('16/07/2026');
  });

  it('formats in Arabic (RTL) without mangling the value', () => {
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.componentInstance.locale.set('ar');
    fixture.componentInstance.dateFormat.set({ month: 'long', day: 'numeric', year: 'numeric' });
    fixture.detectChanges();
    expect(triggerText(fixture)).toContain('يوليو');
    expect(triggerText(fixture)).toContain('2026');
  });

  it('follows the app LOCALE_ID when no locale input is set', () => {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'fr' }] });
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.componentInstance.dateFormat.set({ dateStyle: 'short' });
    fixture.detectChanges();
    expect(triggerText(fixture)).toBe('16/07/2026');
  });

  it('reformats when the locale changes at runtime', () => {
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.componentInstance.dateFormat.set({ dateStyle: 'short' });
    fixture.componentInstance.locale.set('fr');
    fixture.detectChanges();
    expect(triggerText(fixture)).toBe('16/07/2026');

    fixture.componentInstance.locale.set('en-US');
    fixture.detectChanges();
    expect(triggerText(fixture)).toBe('7/16/26');
  });

  it('translates the placeholder via provideBuiLabels, per-instance input still winning', () => {
    TestBed.configureTestingModule({
      providers: [provideBuiLabels({ datePickerPlaceholder: 'Choisir une date' })],
    });

    @Component({
      imports: [BuiDatePicker],
      template: `<bui-date-picker />`,
    })
    class GlobalHost {}

    const global = TestBed.createComponent(GlobalHost);
    global.detectChanges();
    expect(triggerText(global)).toBe('Choisir une date');

    // The existing `placeholder` input keeps priority over the global label.
    const scoped = TestBed.createComponent(TestHost);
    scoped.detectChanges();
    expect(triggerText(scoped)).toBe('Pick a date');
  });

  it('keeps the English placeholder by default', () => {
    @Component({
      imports: [BuiDatePicker],
      template: `<bui-date-picker />`,
    })
    class BareHost {}

    const fixture = TestBed.createComponent(BareHost);
    fixture.detectChanges();
    expect(triggerText(fixture)).toBe('Pick a date');
  });

  it('keeps a Buddhist-era locale on the Gregorian grid, unless asked otherwise', () => {
    // th defaults to the Buddhist calendar: "16 ก.ค. 2569" on a trigger opening a July 2026 grid.
    expect(new Intl.DateTimeFormat('th').resolvedOptions().calendar).toBe('buddhist');

    const fixture = TestBed.createComponent(LocaleHost);
    fixture.componentInstance.locale.set('th');
    fixture.detectChanges();
    expect(triggerText(fixture)).toContain('2026');
    expect(triggerText(fixture)).not.toContain('2569');

    // The pin is a default, not a cage: asking for the Buddhist era still works.
    fixture.componentInstance.dateFormat.set({
      calendar: 'buddhist',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    fixture.detectChanges();
    expect(triggerText(fixture)).toContain('2569');
  });

  it('propagates the locale to the popover calendar', () => {
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.componentInstance.locale.set('fr');
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button')!.click();
    fixture.detectChanges();
    const caption = document.querySelector('.cdk-overlay-container [aria-live="polite"]')!;
    expect(caption.textContent.trim()).toBe(
      new Intl.DateTimeFormat('fr', { month: 'long', year: 'numeric' }).format(new Date()),
    );
  });
});
