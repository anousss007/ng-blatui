import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiPrice } from './price';

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
});
