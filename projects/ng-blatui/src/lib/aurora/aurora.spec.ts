import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiAurora } from './aurora';

@Component({
  imports: [BuiAurora],
  template: `<bui-aurora>Hero</bui-aurora>`,
})
class TestHost {}

describe('BuiAurora', () => {
  it('renders a decorative aurora layer behind content', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector('[data-slot="aurora"]')!;
    expect(element.querySelector('.bui-aurora-layer')).not.toBeNull();
    expect(element.textContent).toContain('Hero');
  });
});
