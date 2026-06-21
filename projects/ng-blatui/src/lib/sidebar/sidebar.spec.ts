import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiSidebar, BuiSidebarMenuButton } from './sidebar';

@Component({
  imports: [BuiSidebar, BuiSidebarMenuButton],
  template: `
    <bui-sidebar [(open)]="open">
      <a buiSidebarMenuButton [isActive]="true" href="#">Home</a>
    </bui-sidebar>
  `,
})
class TestHost {
  readonly open = signal(true);
}

describe('BuiSidebar', () => {
  it('collapses width and marks the active item', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const aside = root.querySelector('[data-slot="sidebar"]')!;
    expect(aside.className).toContain('w-64');
    expect(root.querySelector('[buiSidebarMenuButton]')!.getAttribute('aria-current')).toBe('page');

    fixture.componentInstance.open.set(false);
    fixture.detectChanges();
    expect(aside.className).toContain('w-0');
  });
});
