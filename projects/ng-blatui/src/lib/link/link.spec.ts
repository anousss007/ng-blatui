import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiLink } from './link';

@Component({
  imports: [BuiLink],
  template: `<a buiLink href="https://example.com" [external]="true" variant="muted">Docs</a>`,
})
class TestHost {}

describe('BuiLink', () => {
  it('styles the anchor and sets safe external attributes', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const anchor = (fixture.nativeElement as HTMLElement).querySelector('a')!;
    expect(anchor.getAttribute('data-slot')).toBe('link');
    expect(anchor.className).toContain('text-muted-foreground');
    expect(anchor.getAttribute('target')).toBe('_blank');
    expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
