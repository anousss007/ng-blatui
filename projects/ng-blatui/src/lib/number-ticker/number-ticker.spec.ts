import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiNumberTicker } from './number-ticker';

@Component({
  imports: [BuiNumberTicker],
  template: `<bui-number-ticker [value]="1234" prefix="$" />`,
})
class TestHost {}

describe('BuiNumberTicker', () => {
  it('exposes the final formatted value to assistive tech', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="number-ticker"]',
    )!;
    expect(element.querySelector('.sr-only')?.textContent).toContain('$1,234');
  });
});
