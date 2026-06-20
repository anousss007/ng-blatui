import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiButtonGroup, BuiButtonGroupText } from './button-group';

@Component({
  imports: [BuiButtonGroup, BuiButtonGroupText],
  template: `
    <div buiButtonGroup orientation="vertical">
      <button type="button">A</button>
      <div buiButtonGroupText>or</div>
    </div>
  `,
})
class TestHost {}

describe('BuiButtonGroup', () => {
  it('exposes role=group and reflects orientation', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const group = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="button-group"]',
    )!;
    expect(group.getAttribute('role')).toBe('group');
    expect(group.getAttribute('data-orientation')).toBe('vertical');
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[data-slot="button-group-text"]'),
    ).not.toBeNull();
  });
});
