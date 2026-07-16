import { Component, LOCALE_ID, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideBuiLabels } from '../i18n/labels';

import { BuiDatetimePicker } from './datetime-picker';

@Component({
  imports: [BuiDatetimePicker],
  template: `<bui-datetime-picker [(value)]="value" />`,
})
class TestHost {
  readonly value = signal('');
}

@Component({
  imports: [BuiDatetimePicker],
  template: `<bui-datetime-picker value="2026-07-16T14:30" [locale]="locale()" />`,
})
class LocaleHost {
  readonly locale = signal<string | undefined>(undefined);
}

function triggerText(fixture: { nativeElement: unknown }): string {
  return (fixture.nativeElement as HTMLElement)
    .querySelector('button[aria-expanded]')!
    .textContent.trim();
}

describe('BuiDatetimePicker', () => {
  it('opens a calendar + time field and builds a datetime value', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    root.querySelector<HTMLButtonElement>('button[aria-expanded]')!.click();
    fixture.detectChanges();
    // The popover is portalled into the CDK overlay (attached to the document), not the host.
    expect(document.querySelector('bui-calendar')).not.toBeNull();
    expect(document.querySelector('bui-time-field')).not.toBeNull();

    document.querySelectorAll<HTMLButtonElement>('.cdk-overlay-container tbody button')[15].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toContain('T');
  });

  it('renders the pre-locale en-US format when nothing is configured', () => {
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.detectChanges();
    // Year-less by default — the reason the format lever is full Intl options, not dateStyle.
    expect(triggerText(fixture)).toBe('Jul 16, 2:30 PM');
  });

  it('formats the trigger in the given locale', () => {
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.componentInstance.locale.set('fr');
    fixture.detectChanges();
    expect(triggerText(fixture)).toBe(
      new Intl.DateTimeFormat('fr', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(new Date('2026-07-16T14:30')),
    );
  });

  it('accepts a dateStyle + timeStyle pattern', () => {
    @Component({
      imports: [BuiDatetimePicker],
      template: `
        <bui-datetime-picker
          value="2026-07-16T14:30"
          locale="fr"
          [dateFormat]="{ dateStyle: 'short', timeStyle: 'short' }"
        />
      `,
    })
    class StyleHost {}

    const fixture = TestBed.createComponent(StyleHost);
    fixture.detectChanges();
    expect(triggerText(fixture)).toContain('16/07/2026');
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
    expect(triggerText(fixture)).toBe('Jul 16, 2:30 PM');

    fixture.componentInstance.locale.set('ar');
    fixture.detectChanges();
    expect(triggerText(fixture)).not.toBe('Jul 16, 2:30 PM');
  });

  it('follows the app LOCALE_ID when no locale input is set', () => {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'fr' }] });
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.detectChanges();
    expect(triggerText(fixture)).toContain('juil.');
  });

  it('propagates the locale to the embedded time field in select mode', () => {
    @Component({
      imports: [BuiDatetimePicker],
      template: `<bui-datetime-picker value="2026-07-16T14:30" locale="ar-EG" timeMode="select" />`,
    })
    class TimeLocaleHost {}

    const fixture = TestBed.createComponent(TimeLocaleHost);
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button')!.click();
    fixture.detectChanges();
    // The picker forwarded locale to the calendar but not to the time field it also owns.
    const hours = document.querySelector('.cdk-overlay-container bui-time-field select')!;
    const labels = [...hours.querySelectorAll('option')].map((o) => o.textContent.trim());
    expect(labels).toContain('١ م');
  });

  it('keeps the native time input by default', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button')!.click();
    fixture.detectChanges();
    expect(document.querySelector('.cdk-overlay-container input[type="time"]')).not.toBeNull();
    expect(document.querySelector('.cdk-overlay-container bui-time-field select')).toBeNull();
  });

  it('translates the time label and placeholder via provideBuiLabels', () => {
    TestBed.configureTestingModule({
      providers: [
        provideBuiLabels({ datetimePickerTime: 'Heure', datetimePickerPlaceholder: 'Choisir' }),
      ],
    });
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    expect(triggerText(fixture)).toBe('Choisir');

    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('button[aria-expanded]')!
      .click();
    fixture.detectChanges();
    // Before this, "Time" was hardcoded in the template with no way out.
    const popover = document.querySelector('.cdk-overlay-container')!;
    expect(popover.textContent).toContain('Heure');
    expect(popover.textContent).not.toContain('Time');
  });

  it('defaults the time label and placeholder to English', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    expect(triggerText(fixture)).toBe('Pick date & time');

    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('button[aria-expanded]')!
      .click();
    fixture.detectChanges();
    expect(document.querySelector('.cdk-overlay-container')!.textContent).toContain('Time');
  });

  it('lets a timeLabel input win over the global label', () => {
    TestBed.configureTestingModule({
      providers: [provideBuiLabels({ datetimePickerTime: 'Heure' })],
    });

    @Component({
      imports: [BuiDatetimePicker],
      template: `<bui-datetime-picker timeLabel="Uhrzeit" />`,
    })
    class TimeHost {}

    const fixture = TestBed.createComponent(TimeHost);
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button')!.click();
    fixture.detectChanges();
    expect(document.querySelector('.cdk-overlay-container')!.textContent).toContain('Uhrzeit');
  });
});
