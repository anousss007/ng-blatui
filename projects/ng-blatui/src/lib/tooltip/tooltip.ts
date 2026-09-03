import { _IdGenerator, FocusMonitor } from '@angular/cdk/a11y';
import { type ConnectedPosition, Overlay, type OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  model,
  type OnDestroy,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { type ClassValue, cn } from '../utils/cn';

const CONTENT_BASE =
  'z-50 w-fit max-w-xs rounded-md px-3 py-1.5 text-xs shadow-md bg-primary text-primary-foreground';

/** Floating tooltip bubble rendered into a CDK overlay. */
@Component({
  selector: 'bui-tooltip-content',
  host: { role: 'tooltip', '[class]': 'computedClass()' },
  template: `{{ text() }}`,
})
export class BuiTooltipContent {
  /** Text rendered inside the tooltip bubble. */
  readonly text = input('');
  /** Extra classes (e.g. a colour override) merged over the base bubble styles. */
  readonly extraClass = input<ClassValue>('');
  protected readonly computedClass = computed(() => cn(CONTENT_BASE, this.extraClass()));
}

/** Side of the host the tooltip prefers to appear on. */
export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

const POSITIONS: Record<TooltipSide, ConnectedPosition> = {
  top: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -6 },
  bottom: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 6 },
  left: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -6 },
  right: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 6 },
};
const FALLBACK: Record<TooltipSide, TooltipSide> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

/**
 * BlatUI tooltip. Shows an accessible `role="tooltip"` bubble via the Angular CDK overlay and
 * wires `aria-describedby` on the host. It opens on hover, and on focus only when the focus came
 * from the keyboard — a focus restored by a closing dialog is not the user asking for a tooltip.
 * SSR-safe (the overlay is only created in the browser, on interaction). Configure the placement
 * with `side`, a hover delay with `delay`, and the bubble colour with `tooltipClass`.
 */
@Directive({
  selector: '[buiTooltip]',
  host: {
    '[attr.aria-describedby]': 'describedBy()',
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
  },
})
export class BuiTooltip implements OnDestroy {
  /** Tooltip text; bound via the `buiTooltip` attribute. Empty text shows nothing. */
  readonly text = input('', { alias: 'buiTooltip' });
  /**
   * Suppress the tooltip without removing the directive. Written by hosts that only
   * label themselves some of the time — a {@link BuiSidebarMenuButton} shows its
   * tooltip on the collapsed icon rail and nowhere else.
   */
  readonly disabled = model(false);
  /** Preferred placement side relative to the host, with an automatic flip fallback. */
  readonly side = input<TooltipSide>('top');
  /** Delay in milliseconds before the tooltip appears on hover/focus. */
  readonly delay = input(0);
  /** Extra classes applied to the tooltip bubble (e.g. a semantic colour). */
  readonly tooltipClass = input<ClassValue>('');

  private readonly overlay = inject(Overlay);
  private readonly idGenerator = inject(_IdGenerator);
  private readonly focusMonitor = inject(FocusMonitor);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private overlayRef: OverlayRef | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  protected readonly describedBy = signal<string | null>(null);

  constructor() {
    if (!this.isBrowser) {
      return;
    }
    // Focus shows the tooltip only when the browser attributes that focus to the keyboard.
    // Closing a dialog restores focus to the control that opened it — correct, and required for
    // keyboard users — but a plain `focusin` listener reads that restoration as "the user focused
    // this" and shows the tooltip with the pointer nowhere near it. `mouseleave` fired long ago,
    // so nothing is coming to take it down: it stays for good, and a stuck tooltip is a real
    // element that takes pointer events, so it can swallow the clicks meant for what it covers.
    // `checkChildren` is on because the directive is as often on a wrapper as on the control.
    this.focusMonitor
      .monitor(this.host, true)
      .pipe(takeUntilDestroyed())
      .subscribe((origin) => {
        if (origin === 'keyboard') {
          this.show();
        } else if (origin === null) {
          this.hide();
        }
      });
  }

  protected show(): void {
    if (this.overlayRef || !this.text() || this.disabled()) {
      return;
    }
    const open = (): void => {
      this.open();
    };
    if (this.delay() > 0) {
      this.timer = setTimeout(open, this.delay());
    } else {
      open();
    }
  }

  private open(): void {
    if (this.overlayRef) {
      return;
    }
    const side = this.side();
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.host)
      .withPositions([POSITIONS[side], POSITIONS[FALLBACK[side]]]);
    this.overlayRef = this.overlay.create({ positionStrategy });
    const reference = this.overlayRef.attach(new ComponentPortal(BuiTooltipContent));
    reference.setInput('text', this.text());
    reference.setInput('extraClass', this.tooltipClass());
    const id = this.idGenerator.getId('bui-tooltip-');
    (reference.location.nativeElement as HTMLElement).id = id;
    this.describedBy.set(id);
  }

  protected hide(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.describedBy.set(null);
  }

  ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.host);
    this.hide();
  }
}
