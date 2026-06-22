import { _IdGenerator } from '@angular/cdk/a11y';
import { type ConnectedPosition, Overlay, type OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, computed, Directive, ElementRef, inject, input, signal } from '@angular/core';

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
 * BlatUI tooltip. Shows an accessible `role="tooltip"` bubble on hover/focus via the
 * Angular CDK overlay and wires `aria-describedby` on the host. SSR-safe (the overlay
 * is only created in the browser, on interaction). Configure the placement with `side`,
 * a hover delay with `delay`, and the bubble colour with `tooltipClass`.
 */
@Directive({
  selector: '[buiTooltip]',
  host: {
    '[attr.aria-describedby]': 'describedBy()',
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(focusin)': 'show()',
    '(focusout)': 'hide()',
  },
})
export class BuiTooltip {
  /** Tooltip text; bound via the `buiTooltip` attribute. */
  readonly text = input.required<string>({ alias: 'buiTooltip' });
  /** Preferred placement side relative to the host, with an automatic flip fallback. */
  readonly side = input<TooltipSide>('top');
  /** Delay in milliseconds before the tooltip appears on hover/focus. */
  readonly delay = input(0);
  /** Extra classes applied to the tooltip bubble (e.g. a semantic colour). */
  readonly tooltipClass = input<ClassValue>('');

  private readonly overlay = inject(Overlay);
  private readonly idGenerator = inject(_IdGenerator);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private overlayRef: OverlayRef | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  protected readonly describedBy = signal<string | null>(null);

  protected show(): void {
    if (this.overlayRef || !this.text()) {
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
}
