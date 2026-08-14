import { Component, LOCALE_ID, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideBuiLabels } from '../i18n/labels';

import { BuiMiniCart, type CartItem } from './mini-cart';

@Component({
  imports: [BuiMiniCart],
  template: `<bui-mini-cart [items]="items" [open]="true" />`,
})
class TestHost {
  readonly items: CartItem[] = [{ name: 'T-shirt', price: 25, qty: 2 }];
}

/** The panel is portalled into the CDK overlay, so it is not under the fixture. */
function panelText(): string {
  return document.querySelector('.cdk-overlay-container [role="dialog"]')!.textContent;
}

describe('BuiMiniCart', () => {
  it('shows the item count and subtotal', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('button[aria-label="Cart"]')?.textContent).toContain('2');
    expect(panelText()).toContain('T-shirt');
    expect(panelText()).toContain('$50.00');
  });

  it('formats the subtotal in the app locale', () => {
    @Component({
      imports: [BuiMiniCart],
      template: `<bui-mini-cart [items]="items" [open]="true" [locale]="locale()" currency="€" />`,
    })
    class LocaleHost {
      readonly items: CartItem[] = [{ name: 'T-shirt', price: 1234.5, qty: 1 }];
      readonly locale = signal<string | undefined>(undefined);
    }

    const fixture = TestBed.createComponent(LocaleHost);
    fixture.detectChanges();
    expect(panelText()).toContain('€1,234.50');

    fixture.componentInstance.locale.set('fr');
    fixture.detectChanges();
    expect(panelText()).not.toContain('1,234.50');
    expect(panelText()).toContain(
      new Intl.NumberFormat('fr', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(1234.5),
    );
  });

  it('translates the panel copy via provideBuiLabels', () => {
    TestBed.configureTestingModule({
      providers: [
        provideBuiLabels({ miniCartTitle: 'Votre panier', miniCartSubtotal: 'Sous-total' }),
      ],
    });
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    expect(panelText()).toContain('Votre panier');
    expect(panelText()).toContain('Sous-total');
    expect(panelText()).not.toContain('Subtotal');
  });

  it('keeps the English panel copy by default', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    expect(panelText()).toContain('Your cart');
    expect(panelText()).toContain('Subtotal');
  });

  it('follows the app LOCALE_ID', () => {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }] });
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    expect(panelText()).toContain('50,00');
  });
});
