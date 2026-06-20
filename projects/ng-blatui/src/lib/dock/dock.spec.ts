import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiDock } from './dock';
import { BuiDockItem } from './dock-item';

@Component({
  imports: [BuiDock, BuiDockItem],
  template: `
    <bui-dock>
      <bui-dock-item [active]="true">A</bui-dock-item>
      <bui-dock-item>B</bui-dock-item>
    </bui-dock>
  `,
})
class TestHost {}

describe('BuiDock', () => {
  it('renders a dock landmark with items', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('nav[aria-label="Dock"]')).not.toBeNull();
    expect(root.querySelectorAll('[data-slot="dock-item"]')).toHaveLength(2);
  });
});
