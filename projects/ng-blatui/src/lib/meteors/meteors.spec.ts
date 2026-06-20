import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiMeteors } from './meteors';

@Component({
  imports: [BuiMeteors],
  template: `<bui-meteors [count]="5">Sky</bui-meteors>`,
})
class TestHost {}

describe('BuiMeteors', () => {
  it('renders the requested number of meteor streaks', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector('[data-slot="meteors"]')!;
    expect(element.querySelectorAll('.bui-meteor')).toHaveLength(5);
    expect(element.textContent).toContain('Sky');
  });
});
