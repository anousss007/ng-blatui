import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  BuiSidebar,
  BuiSidebarInset,
  BuiSidebarMenuButton,
  BuiSidebarProvider,
  BuiSidebarTrigger,
} from './sidebar';

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

  it('inset shell: trigger toggles the provider-driven sidebar state', () => {
    @Component({
      imports: [BuiSidebarProvider, BuiSidebar, BuiSidebarInset, BuiSidebarTrigger],
      template: `
        <bui-sidebar-provider>
          <bui-sidebar collapsible="icon"><a href="#">Home</a></bui-sidebar>
          <main buiSidebarInset>
            <button buiSidebarTrigger aria-label="Toggle">≡</button>
          </main>
        </bui-sidebar-provider>
      `,
    })
    class ShellHost {}
    const fixture = TestBed.createComponent(ShellHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const aside = root.querySelector('[data-slot="sidebar"]')!;
    const inset = root.querySelector('[data-slot="sidebar-inset"]')!;
    expect(inset).not.toBeNull();
    // desktop expanded by default
    expect(aside.getAttribute('data-state')).toBe('expanded');
    expect(aside.className).toContain('md:w-64');
    // trigger collapses to the icon rail on desktop
    root.querySelector<HTMLButtonElement>('[buiSidebarTrigger]')!.click();
    fixture.detectChanges();
    expect(aside.getAttribute('data-state')).toBe('collapsed');
    expect(aside.className).toContain('md:w-14');
  });
});
