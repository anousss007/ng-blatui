import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiGradientText } from './gradient-text';

@Component({
  imports: [BuiGradientText],
  template: `<bui-gradient-text preset="ocean">Hello</bui-gradient-text>`,
})
class TestHost {}

describe('BuiGradientText', () => {
  it('paints projected text with a gradient', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '[data-slot="gradient-text"]',
    )!;
    expect(element.textContent).toContain('Hello');
    expect(element.style.backgroundImage).toContain('linear-gradient');
  });
});
