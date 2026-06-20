import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiContainer } from './container';

@Component({
  imports: [BuiContainer],
  template: `<div buiContainer size="sm">x</div>`,
})
class TestHost {}

describe('BuiContainer', () => {
  it('applies the max-width for the chosen size', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="container"]',
    )!;
    expect(element.className).toContain('max-w-3xl');
    expect(element.className).toContain('mx-auto');
  });
});
