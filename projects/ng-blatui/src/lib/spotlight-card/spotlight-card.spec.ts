import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiSpotlightCard } from './spotlight-card';

@Component({
  imports: [BuiSpotlightCard],
  template: `<bui-spotlight-card>Card content</bui-spotlight-card>`,
})
class TestHost {}

describe('BuiSpotlightCard', () => {
  it('renders content with a decorative glow overlay', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="spotlight-card"]',
    )!;
    expect(element.textContent).toContain('Card content');
    expect(element.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });
});
