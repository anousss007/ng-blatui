import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiGallery } from './gallery';

@Component({
  imports: [BuiGallery],
  template: `<bui-gallery [images]="images" [columns]="2" />`,
})
class TestHost {
  readonly images = ['/a.jpg', { src: '/b.jpg', alt: 'B' }];
}

describe('BuiGallery', () => {
  it('renders a thumbnail per image', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector('[data-slot="gallery"]')!;
    expect(element.querySelectorAll('img')).toHaveLength(2);
    expect(element.className).toContain('grid-cols-2');
  });
});
