import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiCarousel } from './carousel';

@Component({
  imports: [BuiCarousel],
  template: `
    <bui-carousel>
      <div>Slide 1</div>
      <div>Slide 2</div>
      <div>Slide 3</div>
    </bui-carousel>
  `,
})
class TestHost {}

describe('BuiCarousel', () => {
  it('renders a dot per slide and advances with the next arrow', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const previous = root.querySelector<HTMLButtonElement>('button[aria-label="Previous slide"]')!;
    const next = root.querySelector<HTMLButtonElement>('button[aria-label="Next slide"]')!;
    expect(root.querySelectorAll('button[aria-label^="Go to slide"]')).toHaveLength(3);
    expect(previous.disabled).toBe(true);

    next.click();
    fixture.detectChanges();
    expect(previous.disabled).toBe(false);
  });
});
