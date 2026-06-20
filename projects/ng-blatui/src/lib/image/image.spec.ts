import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiImage } from './image';

@Component({
  imports: [BuiImage],
  template: `<bui-image src="/photo.jpg" alt="A photo" ratio="16/9" />`,
})
class TestHost {}

describe('BuiImage', () => {
  it('renders the image with a skeleton placeholder', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector('[data-slot="image"]')!;
    const img = element.querySelector('img')!;
    expect(img.getAttribute('src')).toBe('/photo.jpg');
    expect(img.getAttribute('alt')).toBe('A photo');
    expect(element.querySelector('.animate-pulse')).not.toBeNull();
  });
});
