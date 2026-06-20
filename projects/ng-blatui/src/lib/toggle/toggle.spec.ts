import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiToggle } from './toggle';

@Component({
  imports: [BuiToggle],
  template: `<button buiToggle aria-label="Bold">B</button>`,
})
class TestHost {}

describe('BuiToggle', () => {
  it('toggles aria-pressed and data-state on click', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.getAttribute('data-state')).toBe('off');

    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.getAttribute('data-state')).toBe('on');
  });
});
