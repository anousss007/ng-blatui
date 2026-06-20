import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiDotPattern } from './dot-pattern';

@Component({
  imports: [BuiDotPattern],
  template: `<bui-dot-pattern [gap]="20" />`,
})
class TestHost {}

describe('BuiDotPattern', () => {
  it('is a decorative, absolutely-positioned dotted layer', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '[data-slot="dot-pattern"]',
    )!;
    expect(element.getAttribute('aria-hidden')).toBe('true');
    expect(element.className).toContain('absolute');
    expect(element.style.backgroundImage).toContain('radial-gradient');
  });
});
