import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiBorderBeam } from './border-beam';

@Component({
  imports: [BuiBorderBeam],
  template: `<bui-border-beam [duration]="4">Beam content</bui-border-beam>`,
})
class TestHost {}

describe('BuiBorderBeam', () => {
  it('renders the beam ring and content', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="border-beam"]',
    )!;
    expect(element.querySelector('.bui-beam')).not.toBeNull();
    expect(element.textContent).toContain('Beam content');
  });
});
