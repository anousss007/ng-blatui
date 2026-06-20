import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiAccent } from './accent';

@Component({
  imports: [BuiAccent],
  template: `<div buiAccent color="#ff0000">x</div>`,
})
class TestHost {}

describe('BuiAccent', () => {
  it('overrides the primary token locally', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector('[data-slot="accent"]')!;
    const style = element.getAttribute('style') ?? '';
    expect(style).toContain('--primary');
    expect(style).toContain('#ff0000');
  });
});
