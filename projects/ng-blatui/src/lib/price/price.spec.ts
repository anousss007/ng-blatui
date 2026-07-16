import { Component, LOCALE_ID, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiPrice } from './price';

const DEFAULT_FORMAT: Intl.NumberFormatOptions = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

@Component({
  imports: [BuiPrice],
  template: `<bui-price [amount]="20" [compareAt]="25" />`,
})
class TestHost {}

describe('BuiPrice', () => {
  it('shows the amount, compare-at price and discount', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector('[data-slot="price"]')!;
    expect(element.textContent).toContain('$20.00');
    expect(element.querySelector('s')?.textContent).toContain('$25.00');
    expect(element.textContent).toContain('-20%');
  });

  it('formats amounts in the app locale', () => {
    @Component({
      imports: [BuiPrice],
      template: `<bui-price [amount]="1234.5" [locale]="locale()" currency="€" />`,
    })
    class LocaleHost {
      readonly locale = signal<string | undefined>(undefined);
    }

    const fixture = TestBed.createComponent(LocaleHost);
    fixture.detectChanges();
    const text = (): string =>
      (fixture.nativeElement as HTMLElement).querySelector('[data-slot="price"]')!.textContent;
    expect(text()).toContain('€1,234.50');

    // fr groups with a narrow no-break space and uses a comma decimal.
    fixture.componentInstance.locale.set('fr');
    fixture.detectChanges();
    expect(text()).toContain(new Intl.NumberFormat('fr', DEFAULT_FORMAT).format(1234.5));
    expect(text()).not.toContain('1,234.50');

    fixture.componentInstance.locale.set('ar-EG');
    fixture.detectChanges();
    expect(text()).toContain('١');
  });

  it('follows LOCALE_ID and accepts a numberFormat override', () => {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }] });

    @Component({
      imports: [BuiPrice],
      template: `<bui-price [amount]="1234.5" currency="" [numberFormat]="format" />`,
    })
    class CurrencyHost {
      readonly format: Intl.NumberFormatOptions = { style: 'currency', currency: 'EUR' };
    }

    const fixture = TestBed.createComponent(CurrencyHost);
    fixture.detectChanges();
    // Letting ICU own the currency puts the symbol where de-DE wants it: a suffix.
    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('1.234,50');
    expect(text).toContain('€');
  });
});
