import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiGridPattern } from './grid-pattern';

@Component({
  imports: [BuiGridPattern],
  template: `<bui-grid-pattern [gap]="24" />`,
})
class TestHost {}

describe('BuiGridPattern', () => {
  it('is a decorative, absolutely-positioned grid layer', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '[data-slot="grid-pattern"]',
    )!;
    expect(element.getAttribute('aria-hidden')).toBe('true');
    expect(element.className).toContain('absolute');
    expect(element.style.backgroundImage).toContain('linear-gradient');
  });
});
