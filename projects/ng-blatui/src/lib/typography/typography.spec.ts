import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiTypography } from './typography';

@Component({
  imports: [BuiTypography],
  template: `<h2 buiTypography variant="h2">Heading</h2>`,
})
class TestHost {}

describe('BuiTypography', () => {
  it('applies the variant classes', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="typography"]',
    )!;
    expect(element.getAttribute('data-variant')).toBe('h2');
    expect(element.className).toContain('text-3xl');
    expect(element.className).toContain('border-b');
  });
});
