import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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

  it('clips only the horizontal axis, so an overflowing menu stays reachable', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const aside = (fixture.nativeElement as HTMLElement).querySelector('[data-slot="sidebar"]')!;
    expect(aside.className).toContain('overflow-y-auto');
    expect(aside.className).not.toContain('overflow-hidden');
  });

  it('mobileBreakpoint reaches matchMedia, a bare number read as px', () => {
    // jsdom ships no matchMedia — which is also what exercises the SSR guard elsewhere.
    const queries: string[] = [];
    vi.stubGlobal('matchMedia', (query: string) => {
      queries.push(query);
      return {
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      } as unknown as MediaQueryList;
    });

    @Component({
      imports: [BuiSidebarProvider, BuiSidebar],
      template: `
        <bui-sidebar-provider [mobileBreakpoint]="breakpoint()">
          <bui-sidebar />
        </bui-sidebar-provider>
      `,
    })
    class BreakpointHost {
      readonly breakpoint = signal<string | number>(1023);
    }
    const fixture = TestBed.createComponent(BreakpointHost);
    fixture.detectChanges();
    expect(queries.at(-1)).toBe('(max-width: 1023px)');

    fixture.componentInstance.breakpoint.set('40em');
    fixture.detectChanges();
    expect(queries.at(-1)).toBe('(max-width: 40em)');
    vi.unstubAllGlobals();
  });

  it('isMobile overrides the static md: classes when the two disagree', () => {
    @Component({
      imports: [BuiSidebarProvider, BuiSidebar],
      template: `
        <bui-sidebar-provider>
          <bui-sidebar collapsible="icon" />
        </bui-sidebar-provider>
      `,
    })
    class ShellHost {}
    const fixture = TestBed.createComponent(ShellHost);
    fixture.detectChanges();
    const provider = fixture.debugElement.query(By.directive(BuiSidebarProvider))
      .componentInstance as BuiSidebarProvider;
    const aside = (fixture.nativeElement as HTMLElement).querySelector('[data-slot="sidebar"]')!;

    // A breakpoint above md: JS says mobile at a width where the md: classes still dock
    // the rail, so the drawer has to win — this is what #17 got wrong upstream.
    provider.state.isMobile.set(true);
    fixture.detectChanges();
    expect(aside.className).toContain('md:-translate-x-full!');

    provider.state.mobileOpen.set(true);
    fixture.detectChanges();
    expect(aside.className).toContain('md:translate-x-0!');

    // …and the mirror case, a breakpoint below md.
    provider.state.isMobile.set(false);
    fixture.detectChanges();
    expect(aside.className).toContain('max-md:translate-x-0!');
  });

  it('labels a menu button on the collapsed rail, and nowhere else', () => {
    @Component({
      imports: [BuiSidebarProvider, BuiSidebar, BuiSidebarMenuButton],
      template: `
        <bui-sidebar-provider>
          <bui-sidebar collapsible="icon">
            <a buiSidebarMenuButton tooltip="Inbox" href="#">Inbox</a>
          </bui-sidebar>
        </bui-sidebar-provider>
      `,
    })
    class TooltipHost {}
    const fixture = TestBed.createComponent(TooltipHost);
    fixture.detectChanges();
    const provider = fixture.debugElement.query(By.directive(BuiSidebarProvider))
      .componentInstance as BuiSidebarProvider;
    const link = (fixture.nativeElement as HTMLElement).querySelector('a')!;
    const tooltip = (): Element | null =>
      document.querySelector('.cdk-overlay-container [role="tooltip"]');

    // Expanded: the label is already visible next to the icon.
    link.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(tooltip()).toBeNull();

    provider.state.open.set(false);
    fixture.detectChanges();
    link.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(tooltip()?.textContent).toContain('Inbox');

    link.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    expect(tooltip()).toBeNull();
  });
});
