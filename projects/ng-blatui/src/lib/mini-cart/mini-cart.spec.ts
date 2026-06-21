import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiMiniCart, type CartItem } from './mini-cart';

@Component({
  imports: [BuiMiniCart],
  template: `<bui-mini-cart [items]="items" [open]="true" />`,
})
class TestHost {
  readonly items: CartItem[] = [{ name: 'T-shirt', price: 25, qty: 2 }];
}

describe('BuiMiniCart', () => {
  it('shows the item count and subtotal', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('button[aria-label="Cart"]')?.textContent).toContain('2');
    const panel = root.querySelector('[role="dialog"]')!;
    expect(panel.textContent).toContain('T-shirt');
    expect(panel.textContent).toContain('$50.00');
  });
});
