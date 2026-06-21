import { type ConnectedPosition, Overlay, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  signal,
  type TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';

const POPOVER_POSITIONS: Record<PopoverSide, ConnectedPosition> = {
  bottom: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 4 },
  top: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -4 },
  right: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 4 },
  left: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -4 },
};
const POPOVER_FALLBACK: Record<PopoverSide, PopoverSide> = {
  bottom: 'top',
  top: 'bottom',
  right: 'left',
  left: 'right',
};

/**
 * Click-triggered popover on the Angular CDK overlay. Bind the content template:
 * `<button [buiPopover]="tpl">…</button>` with `<ng-template #tpl><div buiPopoverContent>…`.
 * Closes on outside click and Escape. SSR-safe (the overlay is browser-only, on click).
 */
@Directive({
  selector: '[buiPopover]',
  host: {
    'aria-haspopup': 'dialog',
    '[attr.aria-expanded]': 'isOpen()',
    '(click)': 'toggle()',
  },
})
export class BuiPopover implements OnDestroy {
  readonly content = input.required<TemplateRef<unknown>>({ alias: 'buiPopover' });
  readonly side = input<PopoverSide>('bottom');

  private readonly overlay = inject(Overlay);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private overlayRef: OverlayRef | null = null;
  protected readonly isOpen = signal(false);

  protected toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  private open(): void {
    const side = this.side();
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.host)
      .withPositions([POPOVER_POSITIONS[side], POPOVER_POSITIONS[POPOVER_FALLBACK[side]]]);
    const overlayReference = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
    overlayReference.attach(new TemplatePortal(this.content(), this.viewContainerRef));
    overlayReference.outsidePointerEvents().subscribe((event) => {
      if (!this.host.nativeElement.contains(event.target as Node)) {
        this.close();
      }
    });
    overlayReference.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape') {
        this.close();
      }
    });
    this.overlayRef = overlayReference;
    this.isOpen.set(true);
  }

  private close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.isOpen.set(false);
  }

  ngOnDestroy(): void {
    this.close();
  }
}

/** Styling + role for the popover content root (inside the bound template). */
@Directive({
  selector: '[buiPopoverContent]',
  host: {
    'data-slot': 'popover-content',
    role: 'dialog',
    tabindex: '-1',
    '[class]': 'computedClass()',
  },
})
export class BuiPopoverContent {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
      this.userClass(),
    ),
  );
}
