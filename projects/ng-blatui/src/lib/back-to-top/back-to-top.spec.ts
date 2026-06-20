import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiBackToTop } from './back-to-top';

@Component({
  imports: [BuiBackToTop],
  template: `<bui-back-to-top [threshold]="100" variant="subtle" />`,
})
class TestHost {}

describe('BuiBackToTop', () => {
  it('renders an accessible scroll-to-top button', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      '[data-slot="back-to-top"] button',
    )!;
    expect(button.getAttribute('aria-label')).toBe('Back to top');
    expect(button.querySelector('svg')).not.toBeNull();
  });
});
