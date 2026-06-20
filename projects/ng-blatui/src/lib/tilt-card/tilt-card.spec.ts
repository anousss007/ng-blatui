import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiTiltCard } from './tilt-card';

@Component({
  imports: [BuiTiltCard],
  template: `<bui-tilt-card>Tilt me</bui-tilt-card>`,
})
class TestHost {}

describe('BuiTiltCard', () => {
  it('renders content in a perspective wrapper', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="tilt-card"]',
    )!;
    expect(element.className).toContain('[perspective:1000px]');
    expect(element.textContent).toContain('Tilt me');
  });
});
