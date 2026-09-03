import {
  Component,
  inject,
  Injectable,
  LOCALE_ID,
  signal,
  type WritableSignal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiDatePicker } from '../date-picker/date-picker';

import { buiLocale, provideBuiLocale } from './locale';

/** Stands in for a translation library's service — ng-blatui knows nothing about its shape. */
@Injectable({ providedIn: 'root' })
class FakeTranslationService {
  readonly lang: WritableSignal<string> = signal('fr-BE');
}

@Component({
  imports: [BuiDatePicker],
  template: `<bui-date-picker value="2026-06-15" [locale]="locale()" />`,
})
class TestHost {
  readonly locale = signal<string | undefined>(undefined);
}

/** Resolve a locale the way a component's field initializer does. */
function resolve(override?: string): string {
  return TestBed.runInInjectionContext(() => buiLocale(signal(override)))();
}

describe('buiLocale', () => {
  it("falls back to the app's LOCALE_ID, and Angular's own default under that", () => {
    expect(resolve()).toBe('en-US');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'nl-BE' }] });
    expect(resolve()).toBe('nl-BE');
  });

  it('takes a plain tag from provideBuiLocale, over LOCALE_ID', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: LOCALE_ID, useValue: 'nl-BE' }, provideBuiLocale('fr-BE')],
    });
    expect(resolve()).toBe('fr-BE');
  });

  it("lets a component's own input win over both", () => {
    TestBed.configureTestingModule({ providers: [provideBuiLocale('fr-BE')] });
    expect(resolve('ar-EG')).toBe('ar-EG');
    // An unset input is `undefined`, an empty one is `''`; neither counts as a choice.
    expect(resolve('')).toBe('fr-BE');
  });

  it('follows a signal, so a language switched at runtime reformats', () => {
    const lang = signal('fr-BE');
    TestBed.configureTestingModule({ providers: [provideBuiLocale(lang)] });
    const resolved = TestBed.runInInjectionContext(() => buiLocale(signal(undefined)));

    expect(resolved()).toBe('fr-BE');
    lang.set('de-DE');
    expect(resolved()).toBe('de-DE');
  });

  it('runs a factory in an injection context, so any library can be reached', () => {
    TestBed.configureTestingModule({
      providers: [provideBuiLocale(() => inject(FakeTranslationService).lang)],
    });
    const resolved = TestBed.runInInjectionContext(() => buiLocale(signal(undefined)));
    expect(resolved()).toBe('fr-BE');

    TestBed.inject(FakeTranslationService).lang.set('en-GB');
    expect(resolved()).toBe('en-GB');
  });

  it('reaches a real component, without commandeering LOCALE_ID', () => {
    TestBed.configureTestingModule({ providers: [provideBuiLocale('fr-BE')] });
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const trigger = (fixture.nativeElement as HTMLElement).querySelector('button')!;

    // The default format is a medium date, so the month name is the tell: en-US reads "Jun 15".
    expect(trigger.textContent).toContain('15 juin 2026');

    fixture.componentInstance.locale.set('en-US');
    fixture.detectChanges();
    expect(trigger.textContent).toContain('Jun 15, 2026');
  });
});
