import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiParallax } from './parallax';

@Component({
  imports: [BuiParallax],
  template: `<bui-parallax [speed]="0.4">Layer</bui-parallax>`,
})
class TestHost {}

describe('BuiParallax', () => {
  it('renders content with a transform', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '[data-slot="parallax"]',
    )!;
    expect(element.textContent).toContain('Layer');
    expect(element.style.transform).toContain('translateY');
  });
});
