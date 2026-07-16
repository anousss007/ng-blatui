import { Component, LOCALE_ID, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideBuiLabels } from '../i18n/labels';

import { BuiTimeField, type TimeFieldHourCycle } from './time-field';

@Component({
  imports: [BuiTimeField],
  template: `<bui-time-field [(value)]="time" ariaLabel="Start time" />`,
})
class TestHost {
  readonly time = signal('09:30');
}

@Component({
  imports: [BuiTimeField],
  template: `
    <bui-time-field
      mode="select"
      [(value)]="time"
      [locale]="locale()"
      [hourCycle]="hourCycle()"
      [minuteStep]="30"
    />
  `,
})
class SelectHost {
  readonly time = signal('13:30');
  readonly locale = signal<string | undefined>(undefined);
  readonly hourCycle = signal<TimeFieldHourCycle | undefined>(undefined);
}

function hourOptions(fixture: { nativeElement: unknown }): { value: string; label: string }[] {
  const select = (fixture.nativeElement as HTMLElement).querySelector('select')!;
  return [...select.querySelectorAll('option')].map((o) => ({
    value: o.getAttribute('value')!,
    label: o.textContent.trim(),
  }));
}
function minuteLabels(fixture: { nativeElement: unknown }): string[] {
  const select = (fixture.nativeElement as HTMLElement).querySelectorAll('select')[1];
  return [...select.querySelectorAll('option')].map((o) => o.textContent.trim());
}

describe('BuiTimeField', () => {
  it('renders a time input bound to the value', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>(
      'input[type="time"]',
    )!;
    expect(input.value).toBe('09:30');
    expect(input.getAttribute('aria-label')).toBe('Start time');
  });

  it('renders a 12-hour clock with day periods in en-US', () => {
    const fixture = TestBed.createComponent(SelectHost);
    fixture.detectChanges();
    const options = hourOptions(fixture);
    // The value stays 24-hour data whatever the clock shows — the picker builds `${date}T${time}`.
    expect(options.at(0)).toEqual({ value: '00', label: '12 AM' });
    expect(options.at(13)).toEqual({ value: '13', label: '1 PM' });
    expect(options).toHaveLength(24);
  });

  it('renders a 24-hour clock in fr, without the locale "13 h" literal', () => {
    const fixture = TestBed.createComponent(SelectHost);
    fixture.componentInstance.locale.set('fr');
    fixture.detectChanges();
    const options = hourOptions(fixture);
    expect(options.at(0)).toEqual({ value: '00', label: '00' });
    expect(options.at(13)).toEqual({ value: '13', label: '13' });
    expect(options.at(13)?.label).not.toContain('h');
  });

  it('renders Arabic-Indic digits and day periods in ar-EG (RTL)', () => {
    const fixture = TestBed.createComponent(SelectHost);
    fixture.componentInstance.locale.set('ar-EG');
    fixture.detectChanges();
    const options = hourOptions(fixture);
    expect(options.at(13)).toEqual({ value: '13', label: '١ م' });
    // padStart(2, '0') would have produced the mixed "0٠" here.
    expect(minuteLabels(fixture)).toEqual(['٠٠', '٣٠']);
  });

  it('pads minutes to two digits in Latin locales', () => {
    const fixture = TestBed.createComponent(SelectHost);
    fixture.detectChanges();
    expect(minuteLabels(fixture)).toEqual(['00', '30']);
  });

  it('lets hourCycle override the locale clock', () => {
    const fixture = TestBed.createComponent(SelectHost);
    fixture.componentInstance.hourCycle.set('h23');
    fixture.detectChanges();
    expect(hourOptions(fixture).at(13)?.label).toBe('13');

    fixture.componentInstance.locale.set('fr');
    fixture.componentInstance.hourCycle.set('h12');
    fixture.detectChanges();
    expect(hourOptions(fixture).at(13)?.label).toContain('1');
    expect(hourOptions(fixture).at(13)?.label).not.toBe('13');
  });

  it('follows the app LOCALE_ID and reformats when the locale changes at runtime', () => {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'fr' }] });
    const fixture = TestBed.createComponent(SelectHost);
    fixture.detectChanges();
    expect(hourOptions(fixture).at(13)?.label).toBe('13');

    fixture.componentInstance.locale.set('en-US');
    fixture.detectChanges();
    expect(hourOptions(fixture).at(13)?.label).toBe('1 PM');
  });

  it('keeps writing 24-hour values when picking on a 12-hour clock', () => {
    const fixture = TestBed.createComponent(SelectHost);
    fixture.detectChanges();
    const select = (fixture.nativeElement as HTMLElement).querySelector('select')!;
    select.value = '13';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fixture.componentInstance.time()).toBe('13:30');
  });

  it('translates the select aria-labels, which were built from a hardcoded "Time"', () => {
    const bare = TestBed.createComponent(SelectHost);
    bare.detectChanges();
    const labels = (fixture: { nativeElement: unknown }): (string | null)[] =>
      [...(fixture.nativeElement as HTMLElement).querySelectorAll('select')].map((s) =>
        s.getAttribute('aria-label'),
      );
    expect(labels(bare)).toEqual(['Time hours', 'Time minutes']);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideBuiLabels({
          timeField: 'Heure',
          timeFieldHours: 'heures',
          timeFieldMinutes: 'minutes',
        }),
      ],
    });
    const translated = TestBed.createComponent(SelectHost);
    translated.detectChanges();
    expect(labels(translated)).toEqual(['Heure heures', 'Heure minutes']);
  });
});
