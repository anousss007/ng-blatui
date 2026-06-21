import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiAnimatedBeam } from './animated-beam';

@Component({
  imports: [BuiAnimatedBeam],
  template: `
    <bui-animated-beam from="#a" to="#b">
      <div id="a">A</div>
      <div id="b">B</div>
    </bui-animated-beam>
  `,
})
class TestHost {}

describe('BuiAnimatedBeam', () => {
  it('renders an SVG overlay above the projected nodes', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="animated-beam"]',
    )!;
    expect(element.querySelector('svg')).not.toBeNull();
    expect(element.querySelector('#a')).not.toBeNull();
    expect(element.querySelector('.bui-beam-line')).not.toBeNull();
  });
});
