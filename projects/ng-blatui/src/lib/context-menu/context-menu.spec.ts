import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiContextMenu, type ContextMenuItem } from './context-menu';

@Component({
  imports: [BuiContextMenu],
  template: `
    <bui-context-menu [items]="items" (selected)="picked = $event">
      <div class="area">Right-click me</div>
    </bui-context-menu>
  `,
})
class TestHost {
  picked: ContextMenuItem | null = null;
  readonly items: ContextMenuItem[] = [
    { label: 'Copy', value: 'copy' },
    { separator: true },
    { label: 'Delete', value: 'delete', danger: true },
  ];
}

describe('BuiContextMenu', () => {
  it('opens at the cursor and selects an item', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const host = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="context-menu"]',
    )!;

    host.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 10, clientY: 10 }));
    fixture.detectChanges();
    const menu = host.querySelector('[role="menu"]')!;
    expect(menu).not.toBeNull();
    expect(menu.querySelectorAll('[role="menuitem"]')).toHaveLength(2);

    menu.querySelector<HTMLButtonElement>('[role="menuitem"]')!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.picked?.value).toBe('copy');
  });
});
