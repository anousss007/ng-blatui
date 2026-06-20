import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiMarquee } from './marquee';

@Component({
  imports: [BuiMarquee],
  template: `<bui-marquee [items]="['Acme', 'Globex']" />`,
})
class TestHost {}

describe('BuiMarquee', () => {
  it('duplicates the items for a seamless loop', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector('[data-slot="marquee"]')!;
    // two groups × two items = four spans
    expect(element.querySelectorAll('span')).toHaveLength(4);
    expect(element.textContent).toContain('Acme');
  });
});
