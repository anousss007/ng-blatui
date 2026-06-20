import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiVisuallyHidden } from './visually-hidden';

@Component({
  imports: [BuiVisuallyHidden],
  template: `<span buiVisuallyHidden>Skip to content</span>`,
})
class TestHost {}

describe('BuiVisuallyHidden', () => {
  it('applies sr-only', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="visually-hidden"]',
    )!;
    expect(element.className).toContain('sr-only');
    expect(element.textContent).toContain('Skip to content');
  });
});
