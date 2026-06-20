import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiCopyButton } from './copy-button';

@Component({
  imports: [BuiCopyButton],
  template: `<button buiCopyButton value="npm i ng-blatui" label="Copy command">Copy</button>`,
})
class TestHost {}

describe('BuiCopyButton', () => {
  it('exposes the copy label and an icon', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    expect(button.getAttribute('data-slot')).toBe('copy-button');
    expect(button.getAttribute('aria-label')).toBe('Copy command');
    expect(button.querySelector('svg')).not.toBeNull();
  });
});
