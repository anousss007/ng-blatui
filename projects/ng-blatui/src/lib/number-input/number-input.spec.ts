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
});
