import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiKbdGroup } from './kbd-group';

@Component({
  imports: [BuiKbdGroup],
  template: `<kbd buiKbdGroup><kbd>Ctrl</kbd><kbd>K</kbd></kbd>`,
})
class TestHost {}

describe('BuiKbdGroup', () => {
  it('groups keys inline', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="kbd-group"]',
    )!;
    expect(element.className).toContain('inline-flex');
    expect(element.textContent).toContain('Ctrl');
  });
});
