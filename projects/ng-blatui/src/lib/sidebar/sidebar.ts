import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  Directive,
  effect,
  inject,
  Injectable,
  input,
  model,
  PLATFORM_ID,
  signal,
} from '@angular/core';

import { BuiTooltip } from '../tooltip/tooltip';
import { type ClassValue, cn } from '../utils/cn';

/** Width below which the sidebar becomes an off-canvas drawer — Tailwind's `md`, minus a pixel. */
const DEFAULT_MOBILE_BREAKPOINT = '767px';

/**
 * Vertical scrolling for a sidebar region, with the icon rail's scrollbar hidden rather
 * than given room: a classic (non-overlay) scrollbar takes ~16px out of a 3.5rem rail and
 * squeezes the buttons against its track, and widening the rail would move layout on the
 * many platforms where scrollbars are overlays and nothing was wrong.
 */
const SCROLL_Y = 'overflow-x-hidden overflow-y-auto';
const HIDE_RAIL_SCROLLBAR_SELF =
  'data-[state=collapsed]:[scrollbar-width:none] data-[state=collapsed]:[&::-webkit-scrollbar]:hidden';
const HIDE_RAIL_SCROLLBAR_NESTED =
  'group-data-[state=collapsed]/sidebar:[scrollbar-width:none] group-data-[state=collapsed]/sidebar:[&::-webkit-scrollbar]:hidden';

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
  /** Whether the viewport is at or below the configured mobile breakpoint. */
  readonly isMobile = signal(false);

  private mql: MediaQueryList | null = null;
  private readonly onBreakpointChange = (event: MediaQueryListEvent): void => {
    this.isMobile.set(event.matches);
    if (!event.matches) {
      // Dragging a window past the breakpoint closes the drawer rather than leaving it
      // floating over the rail that just docked.
      this.mobileOpen.set(false);
    }
  };

  constructor() {
    this.setMobileBreakpoint(DEFAULT_MOBILE_BREAKPOINT);
    inject(DestroyRef).onDestroy(() => {
      this.mql?.removeEventListener('change', this.onBreakpointChange);
    });
  }

  /**
   * Move the drawer breakpoint. A bare number is read as px; anything else is used as the
   * `max-width` value as written, so `'40em'` and `'1023px'` both work.
   */
  setMobileBreakpoint(width: string | number): void {
    if (!this.isBrowser || typeof globalThis.matchMedia !== 'function') {
      return;
    }
    this.mql?.removeEventListener('change', this.onBreakpointChange);
    const value = String(width).trim();
    const length = /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
    this.mql = globalThis.matchMedia(`(max-width: ${length})`);
    this.isMobile.set(this.mql.matches);
    this.mql.addEventListener('change', this.onBreakpointChange);
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
  exportAs: 'buiSidebar',
  providers: [BuiSidebarState],
  host: { 'data-slot': 'sidebar-provider', '[class]': 'computedClass()' },
  template: `
    <ng-content />
    @if (state.isMobile() && state.mobileOpen()) {
      <!-- Gated on isMobile itself, not on a md: class: a breakpoint above md must still
           get the backdrop at a width where CSS thinks the rail is docked. -->
      <button
        type="button"
        aria-label="Close sidebar"
        class="fixed inset-0 z-40 bg-black/50"
        (click)="state.mobileOpen.set(false)"
      ></button>
    }
  `,
})
export class BuiSidebarProvider {
  /** Shared sidebar state; exposed (via `exportAs="buiSidebar"`) for template access. */
  readonly state = inject(BuiSidebarState);
  /**
   * Viewport width below which the sidebar becomes an off-canvas drawer instead of an
   * icon rail. A bare number is read as px; anything else is used as written.
   */
  readonly mobileBreakpoint = input<string | number>(DEFAULT_MOBILE_BREAKPOINT);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn('flex min-h-svh w-full', this.userClass()));

  constructor() {
    effect(() => {
      this.state.setMobileBreakpoint(this.mobileBreakpoint());
    });
  }

  /** Close the mobile drawer (e.g. after a nav item is chosen). */
  closeMobile(): void {
    this.state.mobileOpen.set(false);
  }
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

  /**
   * The `md:` classes above are the no-JS default, so the docked rail paints with the page
   * instead of popping in after hydration. They are pinned to 768px, though, and
   * {@link BuiSidebarProvider.mobileBreakpoint} can put the drawer somewhere else — so
   * `isMobile` overrides them wherever the two disagree, which is the whole point of a
   * breakpoint other than `md`. At the default breakpoint CSS and JS always agree and both
   * branches below land on a width where their variant does not apply, i.e. a no-op.
   */
  private readonly breakpointOverride = computed(() => {
    if (!this.state) {
      return '';
    }
    if (this.state.isMobile()) {
      const offCanvas = this.side() === 'left' ? 'md:-translate-x-full!' : 'md:translate-x-full!';
      return cn(
        'md:fixed! md:inset-y-0! md:z-50! md:w-64!',
        this.state.mobileOpen() ? 'md:translate-x-0!' : offCanvas,
      );
    }
    const collapsedDocked =
      this.collapsible() === 'icon' ? 'max-md:w-14!' : 'max-md:w-0! max-md:border-0! max-md:p-0!';
    const docked = this.state.open() ? 'max-md:w-64!' : collapsedDocked;
    return cn('max-md:sticky! max-md:top-0! max-md:z-auto! max-md:translate-x-0!', docked);
  });
  protected readonly computedClass = computed(() => {
    // Only the horizontal axis is clipped — clipping both made the last menu items
    // unreachable as soon as they overflowed, rail or not.
    const base = cn(
      'group/sidebar flex flex-col gap-2 bg-card p-2 text-card-foreground transition-[width,transform] duration-200',
      SCROLL_Y,
      HIDE_RAIL_SCROLLBAR_SELF,
    );
    const border = this.side() === 'left' ? 'border-r' : 'border-l';
    if (this.state) {
      // Inset shell mode: mobile off-canvas drawer, desktop sticky expand/icon-rail.
      // All Tailwind classes are literals so the JIT scanner can see them.
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
        'fixed inset-y-0 z-50 h-svh w-64 md:sticky md:top-0 md:z-auto md:h-svh',
        dock,
        drawer,
        desktop,
        this.breakpointOverride(),
        this.userClass(),
      );
    }
    return cn(
      base,
      border,
      'h-full',
      this.expanded() ? 'w-64' : this.collapsedWidth(),
      this.userClass(),
    );
  });
}

/**
 * The scrolling region of a {@link BuiSidebar}, between a pinned header and footer. Put the
 * menu in it when the sidebar has chrome that should stay put while the nav scrolls; a
 * sidebar without it scrolls as a whole.
 */
@Directive({
  selector: '[buiSidebarContent]',
  host: { 'data-slot': 'sidebar-content', '[class]': 'computedClass()' },
})
export class BuiSidebarContent {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'flex min-h-0 flex-1 flex-col gap-2',
      SCROLL_Y,
      HIDE_RAIL_SCROLLBAR_NESTED,
      this.userClass(),
    ),
  );
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
  hostDirectives: [
    {
      directive: BuiTooltip,
      inputs: ['buiTooltip: tooltip', 'side: tooltipSide', 'delay: tooltipDelay'],
    },
  ],
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

  private readonly state = inject(BuiSidebarState, { optional: true });
  private readonly tooltip = inject(BuiTooltip);

  constructor() {
    // Shrunk to the icon rail a menu button shows nothing but its icon, so `tooltip="Inbox"`
    // labels it there — and only there, where it would otherwise repeat the visible text.
    // It is a visual affordance: the label stays in the DOM when the button shrinks, so the
    // accessible name never depended on it.
    effect(() => {
      const isCollapsed = !!this.state && !this.state.open() && !this.state.isMobile();
      this.tooltip.disabled.set(!isCollapsed);
    });
  }

  protected readonly computedClass = computed(() =>
    cn(
      'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent',
      this.isActive() ? 'bg-accent font-medium' : '',
      this.userClass(),
    ),
  );
}
