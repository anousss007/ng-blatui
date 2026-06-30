import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiIconTile } from './icon-tile';

@Component({
  imports: [BuiIconTile],
  template: `<bui-icon-tile tone="success" size="sm"><svg></svg></bui-icon-tile>`,
})
class TestHost {}

describe('BuiIconTile', () => {
  it('renders a tinted tile with the chosen tone + size and projects its icon', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const tile = (fixture.nativeElement as HTMLElement).querySelector('bui-icon-tile')!;
    expect(tile.getAttribute('data-slot')).toBe('icon-tile');
    expect(tile.className).toContain('bg-success/10');
    expect(tile.className).toContain('size-8');
    expect(tile.querySelector('svg')).not.toBeNull();
  });
});
