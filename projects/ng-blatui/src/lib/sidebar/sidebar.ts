import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  Directive,
  inject,
  Injectable,
  input,
  model,
  PLATFORM_ID,
  signal,
} from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/**
 * Shared state for an inset sidebar layout, owned by {@link BuiSidebarProvider} and
 * injected by the sidebar, trigger and inset. Tracks the desktop expanded/rail state,
 * the mobile off-canvas drawer, and a `matchMedia` breakpoint (SSR-safe).
 */
@Injectable()
export class BuiSidebarState {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  /** Desktop: whether the sidebar is expanded (vs. an icon rail / hidden). */
  readonly open = signal(true);
  /** Mobile: whether the off-canvas drawer is open. */
  readonly mobileOpen = signal(false);
  /** Whether the viewport is below the `md` breakpoint. */
  readonly isMobile = signal(false);

  constructor() {
    if (!this.isBrowser || typeof globalThis.matchMedia !== 'function') {
      return;
    }
    const mql = globalThis.matchMedia('(max-width: 767px)');
    this.isMobile.set(mql.matches);
    mql.addEventListener('change', (event) => {
      this.isMobile.set(event.matches);
    });
  }

  /** Toggle the drawer on mobile, otherwise the desktop expanded state. */
  toggle(): void {
    if (this.isMobile()) {
      this.mobileOpen.update((value) => !value);
    } else {
      this.open.update((value) => !value);
    }
  }
}

/**
 * Layout wrapper for an inset sidebar shell. Provides {@link BuiSidebarState} to a
 * {@link BuiSidebar} + {@link BuiSidebarInset}, lays them out in a row, and renders the
 * mobile backdrop. Wrap a dashboard's sidebar and main content in this provider.
 */
@Component({
  selector: 'bui-sidebar-provider',
  providers: [BuiSidebarState],
  host: { 'data-slot': 'sidebar-provider', '[class]': 'computedClass()' },
  template: `
    <ng-content />
    @if (state.isMobile() && state.mobileOpen()) {
      <button
        type="button"
        aria-label="Close sidebar"
        class="fixed inset-0 z-40 bg-black/50 md:hidden"
        (click)="state.mobileOpen.set(false)"
      ></button>
    }
  `,
})
export class BuiSidebarProvider {
  protected readonly state = inject(BuiSidebarState);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn('flex min-h-svh w-full', this.userClass()));
}

/**
 * A collapsible vertical navigation sidebar. Standalone it toggles via the `open` model;
 * inside a {@link BuiSidebarProvider} it reads shared state and becomes a mobile off-canvas
 * drawer + desktop icon-rail automatically.
 */
@Component({
  selector: 'bui-sidebar',
  host: {
    'data-slot': 'sidebar',
    '[attr.data-state]': "expanded() ? 'expanded' : 'collapsed'",
    '[attr.data-side]': 'side()',
    '[class]': 'computedClass()',
  },
  template: `<ng-content />`,
})
export class BuiSidebar {
  private readonly state = inject(BuiSidebarState, { optional: true });
  /** Whether the sidebar is expanded. Two-way bindable with `[(open)]` (standalone use). */
  readonly open = model(true);
  /** Edge the sidebar is docked to, which sets its border side. */
  readonly side = input<'left' | 'right'>('left');
  /** Collapse behavior: hide entirely (`offcanvas`) or shrink to an icon rail (`icon`). */
  readonly collapsible = input<'offcanvas' | 'icon'>('offcanvas');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  /** Effective expanded state — provider-driven when present, else the local `open` model. */
  protected readonly expanded = computed(() => this.state?.open() ?? this.open());
  private readonly collapsedWidth = computed(() =>
    this.collapsible() === 'icon' ? 'w-14' : 'w-0 border-0 p-0',
  );
  protected readonly computedClass = computed(() => {
    const base =
      'group/sidebar flex h-full flex-col gap-2 overflow-hidden bg-card p-2 text-card-foreground transition-[width,transform] duration-200';
    const border = this.side() === 'left' ? 'border-r' : 'border-l';
    if (this.state) {
      // Inset shell mode: mobile off-canvas drawer + desktop expand/icon-rail. All
      // Tailwind classes are literals so the JIT scanner can see them.
      const dock =
        this.side() === 'left'
          ? 'left-0 -translate-x-full md:translate-x-0'
          : 'right-0 translate-x-full md:translate-x-0';
      const drawer = this.state.mobileOpen() ? 'max-md:translate-x-0' : '';
      const collapsedDesktop =
        this.collapsible() === 'icon' ? 'md:w-14' : 'md:w-0 md:border-0 md:p-0';
      const desktop = this.state.open() ? 'md:w-64' : collapsedDesktop;
      return cn(
        base,
        border,
        'fixed inset-y-0 z-50 w-64 md:static md:z-auto',
        dock,
        drawer,
        desktop,
        this.userClass(),
      );
    }
    return cn(base, border, this.expanded() ? 'w-64' : this.collapsedWidth(), this.userClass());
  });
}

/** The main content panel that sits beside a {@link BuiSidebar} inside a {@link BuiSidebarProvider}. */
@Directive({
  selector: '[buiSidebarInset]',
  host: { 'data-slot': 'sidebar-inset', '[class]': 'computedClass()' },
})
export class BuiSidebarInset {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('flex min-w-0 flex-1 flex-col', this.userClass()),
  );
}

/** A button that toggles the sidebar (desktop rail / mobile drawer) via {@link BuiSidebarState}. */
@Directive({
  selector: '[buiSidebarTrigger]',
  host: { 'data-slot': 'sidebar-trigger', type: 'button', '(click)': 'toggle()' },
})
export class BuiSidebarTrigger {
  private readonly state = inject(BuiSidebarState, { optional: true });
  toggle(): void {
    this.state?.toggle();
  }
}

/** A styled, accessible item button for a {@link BuiSidebar} menu. */
@Directive({
  selector: '[buiSidebarMenuButton]',
  host: {
    'data-slot': 'sidebar-menu-button',
    '[class]': 'computedClass()',
    '[attr.aria-current]': "isActive() ? 'page' : null",
  },
})
export class BuiSidebarMenuButton {
  /** Whether this item is the current page; sets active styling and `aria-current`. */
  readonly isActive = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(
      'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent',
      this.isActive() ? 'bg-accent font-medium' : '',
      this.userClass(),
    ),
  );
}
