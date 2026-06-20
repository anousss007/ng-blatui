import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiAddToCart } from './add-to-cart';

@Component({
  imports: [BuiAddToCart],
  template: `<bui-add-to-cart (triggered)="hits = hits + 1" />`,
})
class TestHost {
  hits = 0;
}

describe('BuiAddToCart', () => {
  it('enters the busy state and emits on click', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    expect(button.textContent).toContain('Add to cart');

    button.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.hits).toBe(1);
    expect(button.disabled).toBe(true);
    fixture.destroy();
  });
});
