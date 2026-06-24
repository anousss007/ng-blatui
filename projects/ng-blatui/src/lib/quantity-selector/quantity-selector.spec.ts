/* eslint-disable @typescript-eslint/no-deprecated, sonarjs/deprecation
   -- this suite intentionally exercises the deprecated BuiQuantitySelector compatibility shim */
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiQuantitySelector } from './quantity-selector';

@Component({
  imports: [BuiQuantitySelector],
  template: `<bui-quantity-selector [(value)]="qty" [min]="1" [max]="10" />`,
})
class TestHost {
  readonly qty = signal(3);
}

describe('BuiQuantitySelector', () => {
  function setup() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const decrease = root.querySelector<HTMLButtonElement>(
      'button[aria-label="Decrease quantity"]',
    )!;
    const increase = root.querySelector<HTMLButtonElement>(
      'button[aria-label="Increase quantity"]',
    )!;
    const input = root.querySelector<HTMLInputElement>('[role="spinbutton"]')!;
    return { fixture, decrease, increase, input };
  }

  it('exposes a spinbutton with aria range and steps the value', () => {
    const { fixture, decrease, increase, input } = setup();
    expect(input.getAttribute('aria-valuenow')).toBe('3');
    expect(input.getAttribute('aria-valuemin')).toBe('1');
    expect(input.getAttribute('aria-valuemax')).toBe('10');

    increase.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.qty()).toBe(4);

    decrease.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.qty()).toBe(3);
  });
});
