import { _IdGenerator } from '@angular/cdk/a11y';
import { Overlay, type OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, Directive, ElementRef, inject, input, signal } from '@angular/core';

/** Floating tooltip bubble rendered into a CDK overlay. */
@Component({
  selector: 'bui-tooltip-content',
  host: {
    role: 'tooltip',
    class:
      'bg-primary text-primary-foreground z-50 w-fit max-w-xs rounded-md px-3 py-1.5 text-xs shadow-md',
  },
  template: `{{ text() }}`,
})
export class BuiTooltipContent {
  readonly text = input('');
}

/**
 * BlatUI tooltip. Shows an accessible `role="tooltip"` bubble on hover/focus via the
 * Angular CDK overlay and wires `aria-describedby` on the host. SSR-safe (the overlay
 * is only created in the browser, on interaction).
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
  readonly text = input.required<string>({ alias: 'buiTooltip' });

  private readonly overlay = inject(Overlay);
  private readonly idGenerator = inject(_IdGenerator);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private overlayRef: OverlayRef | null = null;
  protected readonly describedBy = signal<string | null>(null);

  protected show(): void {
    if (this.overlayRef || !this.text()) {
      return;
    }
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.host)
      .withPositions([
        { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -6 },
        { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 6 },
      ]);
    this.overlayRef = this.overlay.create({ positionStrategy });
    const reference = this.overlayRef.attach(new ComponentPortal(BuiTooltipContent));
    reference.setInput('text', this.text());
    const id = this.idGenerator.getId('bui-tooltip-');
    (reference.location.nativeElement as HTMLElement).id = id;
    this.describedBy.set(id);
  }

  protected hide(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.describedBy.set(null);
  }
}
