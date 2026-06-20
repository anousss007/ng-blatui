import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiScrollArea } from './scroll-area';

@Component({
  imports: [BuiScrollArea],
  template: `<bui-scroll-area class="h-32"><div>Scrollable content</div></bui-scroll-area>`,
})
class TestHost {}

describe('BuiScrollArea', () => {
  it('renders a focusable, scrollable viewport region', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const viewport = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="scroll-area-viewport"]',
    )!;
    expect(viewport.getAttribute('role')).toBe('region');
    expect(viewport.getAttribute('tabindex')).toBe('0');
    expect(viewport.className).toContain('overflow-auto');
    expect(viewport.textContent).toContain('Scrollable content');
  });
});
