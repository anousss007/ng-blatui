import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiAspectRatio } from './aspect-ratio';

@Component({
  imports: [BuiAspectRatio],
  template: `<bui-aspect-ratio ratio="16 / 9"><span>x</span></bui-aspect-ratio>`,
})
class TestHost {}

describe('BuiAspectRatio', () => {
  it('sets the aspect-ratio style', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      'bui-aspect-ratio',
    )!;
    expect(element.style.aspectRatio).toBe('16 / 9');
  });
});
