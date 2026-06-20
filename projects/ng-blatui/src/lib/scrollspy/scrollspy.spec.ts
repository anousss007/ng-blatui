import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiScrollspy, type ScrollspyItem } from './scrollspy';

@Component({
  imports: [BuiScrollspy],
  template: `<bui-scrollspy [items]="items" />`,
})
class TestHost {
  readonly items: ScrollspyItem[] = [
    { href: '#intro', label: 'Intro' },
    { href: '#usage', label: 'Usage' },
  ];
}

describe('BuiScrollspy', () => {
  it('renders an on-this-page nav of links', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('nav[aria-label="On this page"]')).not.toBeNull();
    const links = root.querySelectorAll('a');
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute('href')).toBe('#intro');
  });
});
