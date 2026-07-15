import { Menu } from '@angular/aria/menu';
import {
  type ConnectedPosition,
  Overlay,
  type OverlayRef,
  type ScrollStrategy,
} from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  PLATFORM_ID,
} from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/**
 * Dropdown menu styling on top of Angular Aria's menu primitives (re-exported below).
 * Behaviour, roving focus, typeahead and ARIA roles come from `ngMenu` / `ngMenuItem` /
 * `ngMenuTrigger`.
 *
 * While open, the menu element is portalled into a CDK overlay anchored to its trigger, so it
 * escapes any `overflow: hidden`/`clip` ancestor (no clipping), stacks above everything, and
 * flips/pushes to stay on-screen. No wrapping `relative` element is required.
 *
 * ```html
 * <button buiButton ngMenuTrigger [menu]="m">Open</button>
 * <div ngMenu #m="ngMenu" buiDropdownMenu>
 *   <div ngMenuItem value="edit" buiDropdownMenuItem>Edit</div>
 * </div>
 * ```
 */
export { Menu, MenuBar, MenuContent, MenuItem, MenuTrigger } from '@angular/aria/menu';

/** Placement of the menu relative to its trigger, in CDK preference order (first that fits wins). */
const DROPDOWN_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
  { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
  { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4 },
];

@Directive({
  selector: '[buiDropdownMenu]',
  host: {
    'data-slot': 'dropdown-menu',
    '[hidden]': '!menu.visible()',
    '[class]': 'computedClass()',
  },
})
export class BuiDropdownMenu implements OnDestroy {
  protected readonly menu = inject(Menu);
  private readonly overlay = inject(Overlay);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private overlayRef: OverlayRef | null = null;
  private portal: DomPortal | null = null;

  readonly userClass = input<ClassValue>('', { alias: 'class' });
  // No `absolute`/`mt-*` here: while open the overlay owns positioning; the menu keeps only its
  // box styling. `z-50` is harmless inside the overlay stacking context.
  protected readonly computedClass = computed(() =>
    cn(
      'z-50 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
      this.userClass(),
    ),
  );

  constructor() {
    // Mirror the aria menu's open/closed state into a CDK overlay. Runs browser-only; on the
    // server `visible()` stays false so no overlay is ever created (SSR-safe).
    effect(() => {
      const isVisible = this.menu.visible();
      if (isVisible) {
        this.attach();
      } else {
        this.detach();
      }
    });
  }

  private attach(): void {
    if (!this.isBrowser || this.overlayRef) {
      return;
    }
    // The trigger (or parent menu item, for a submenu) is the anchor. Fall back to the element's
    // original parent so a menu with no resolved parent still positions sensibly.
    const anchor =
      this.menu.parent()?.element ??
      this.host.nativeElement.parentElement ??
      this.host.nativeElement;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(anchor)
      .withPositions(DROPDOWN_POSITIONS)
      .withPush(true);
    const scrollStrategy: ScrollStrategy = this.overlay.scrollStrategies.reposition();
    const overlayReference = this.overlay.create({ positionStrategy, scrollStrategy });

    // Move the live menu element into the overlay (DomPortal restores it to the DOM on detach).
    this.portal = new DomPortal(this.host);
    overlayReference.attach(this.portal);

    // Close on a pointer press outside both the menu and its trigger (clicking the trigger is left
    // to the aria trigger's own toggle so the two don't fight).
    overlayReference.outsidePointerEvents().subscribe((event) => {
      const target = event.target as Node;
      if (!this.host.nativeElement.contains(target) && !anchor.contains(target)) {
        this.menu.close();
      }
    });
    this.overlayRef = overlayReference;
  }

  private detach(): void {
    // `dispose()` detaches the DomPortal (restoring the menu element to its original DOM position)
    // and tears down the overlay. Detaching the portal separately would double-detach and throw.
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.portal = null;
  }

  ngOnDestroy(): void {
    this.detach();
  }
}

@Directive({
  selector: '[buiDropdownMenuItem]',
  host: { 'data-slot': 'dropdown-menu-item', '[class]': 'computedClass()' },
})
export class BuiDropdownMenuItem {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[buiDropdownMenuLabel]',
  host: { 'data-slot': 'dropdown-menu-label', '[class]': 'computedClass()' },
})
export class BuiDropdownMenuLabel {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('px-2 py-1.5 text-sm font-medium', this.userClass()),
  );
}

@Directive({
  selector: '[buiDropdownMenuSeparator]',
  host: { 'data-slot': 'dropdown-menu-separator', role: 'separator', '[class]': 'computedClass()' },
})
export class BuiDropdownMenuSeparator {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('-mx-1 my-1 h-px bg-border', this.userClass()),
  );
}
