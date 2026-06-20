import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiProductCard } from './product-card';

@Component({
  imports: [BuiProductCard],
  template: `<bui-product-card title="Runner" image="/shoe.jpg" [price]="49.99" badge="Sale" />`,
})
class TestHost {}

describe('BuiProductCard', () => {
  it('renders the title, image, price and badge', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="product-card"]',
    )!;
    expect(element.querySelector('h3')?.textContent).toContain('Runner');
    expect(element.querySelector('img')?.getAttribute('src')).toBe('/shoe.jpg');
    expect(element.textContent).toContain('$49.99');
    expect(element.textContent).toContain('Sale');
  });
});
