import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiKbd } from './kbd';

@Component({
  imports: [BuiKbd],
  template: `<kbd buiKbd>Ctrl</kbd>`,
})
class TestHost {}

describe('BuiKbd', () => {
  it('applies the kbd styling to a native <kbd>', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const kbd = (fixture.nativeElement as HTMLElement).querySelector('kbd')!;
    expect(kbd.getAttribute('data-slot')).toBe('kbd');
    expect(kbd.className).toContain('bg-muted');
  });
});
