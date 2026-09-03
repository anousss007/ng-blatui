/* eslint-disable sonarjs/no-floating-point-equality -- exactness is the assertion here:
   the rounding exists so a stepped value is the one the caller described, not one near it. */
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiNumberInput } from './number-input';

@Component({
  imports: [BuiNumberInput],
  template: `<bui-number-input [(value)]="count" [min]="0" [max]="5" />`,
})
class TestHost {
  readonly count = signal(0);
}

@Component({
  imports: [BuiNumberInput],
  template: `<bui-number-input [(value)]="price" [step]="0.1" />`,
})
class FractionalHost {
  readonly price = signal(1.1);
}

describe('BuiNumberInput', () => {
  it('steps within min/max bounds', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const buttons = root.querySelectorAll<HTMLButtonElement>('button');

    expect(buttons[0].disabled).toBe(true); // decrease disabled at min
    buttons[1].click(); // increase
    fixture.detectChanges();
    expect(fixture.componentInstance.count()).toBe(1);
    expect(buttons[0].disabled).toBe(false);
  });

  it('stays on the values a fractional step describes', () => {
    const fixture = TestBed.createComponent(FractionalHost);
    fixture.detectChanges();
    const increase = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(
      'button',
    )[1];

    for (let index = 0; index < 8; index++) {
      increase.click();
    }
    fixture.detectChanges();
    // Adding the raw step lands on 1.3666666666666667, and writes it into the bound model.
    expect(fixture.componentInstance.price()).toBe(1.9);
  });
});
