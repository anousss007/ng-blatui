import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiTextReveal } from './text-reveal';

@Component({
  imports: [BuiTextReveal],
  template: `<bui-text-reveal text="one two three" />`,
})
class TestHost {}

describe('BuiTextReveal', () => {
  it('renders each word as a span', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="text-reveal"]',
    )!;
    expect(element.querySelectorAll('span')).toHaveLength(3);
    expect(element.textContent).toContain('three');
  });
});
