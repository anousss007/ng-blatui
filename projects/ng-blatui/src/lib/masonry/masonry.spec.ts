import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiMasonry } from './masonry';

@Component({
  imports: [BuiMasonry],
  template: `<div buiMasonry [columns]="2" gap="6"><div>a</div></div>`,
})
class TestHost {}

describe('BuiMasonry', () => {
  it('applies responsive column classes', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector('[data-slot="masonry"]')!;
    expect(element.className).toContain('sm:columns-2');
    expect(element.className).toContain('gap-6');
  });
});
