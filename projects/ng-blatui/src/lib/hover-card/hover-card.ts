import { FocusMonitor } from '@angular/cdk/a11y';
import { Overlay, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  PLATFORM_ID,
  type TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { type ClassValue, cn } from '../utils/cn';

/**
 * Hover-triggered card on the Angular CDK overlay. Opens after a delay on hover, and on focus
 * only when the focus came from the keyboard — a focus restored by a closing dialog is not the
 * user asking for a card. Stays open while the pointer is over the card. SSR-safe (browser-only,
 * on hover).
 */
@Directive({
  selector: '[buiHoverCard]',
  host: {
    '(mouseenter)': 'scheduleOpen()',
    '(mouseleave)': 'scheduleClose()',
  },
})
export class BuiHoverCard implements OnDestroy {
  /** Template rendered inside the card; bound via the `buiHoverCard` attribute. */
  readonly content = input.required<TemplateRef<unknown>>({ alias: 'buiHoverCard' });
  /** Delay in milliseconds before the card opens on hover/focus. */
  readonly openDelay = input(400);
  /** Delay in milliseconds before the card closes after the pointer leaves. */
  readonly closeDelay = input(100);

  private readonly overlay = inject(Overlay);
  private readonly focusMonitor = inject(FocusMonitor);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private overlayRef: OverlayRef | null = null;
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    if (!this.isBrowser) {
      return;
    }
    // Keyboard focus only: a dialog opened from this trigger restores focus to it on close, and
    // a plain `focusin` listener would read that as a hover and leave a card on screen with the
    // pointer somewhere else entirely.
    this.focusMonitor
      .monitor(this.host, true)
      .pipe(takeUntilDestroyed())
      .subscribe((origin) => {
        if (origin === 'keyboard') {
          this.scheduleOpen();
        } else if (origin === null) {
          this.scheduleClose();
        }
      });
  }

  protected scheduleOpen(): void {
    this.clearTimer();
    this.timer = setTimeout(() => {
      this.open();
    }, this.openDelay());
  }

  protected scheduleClose(): void {
    this.clearTimer();
    this.timer = setTimeout(() => {
      this.close();
    }, this.closeDelay());
  }

  private clearTimer(): void {
    if (this.timer === undefined) {
      return;
    }

    clearTimeout(this.timer);
    this.timer = undefined;
  }

  private open(): void {
    if (this.overlayRef) {
      return;
    }
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.host)
      .withPositions([
        { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 4 },
        { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -4 },
      ]);
    const overlayReference = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
    overlayReference.attach(new TemplatePortal(this.content(), this.viewContainerRef));
    overlayReference.overlayElement.addEventListener('mouseenter', () => {
      this.clearTimer();
    });
    overlayReference.overlayElement.addEventListener('mouseleave', () => {
      this.scheduleClose();
    });
    this.overlayRef = overlayReference;
  }

  private close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }

  ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.host);
    this.clearTimer();
    this.close();
  }
}

/** Styling for the hover-card content root (inside the bound template). */
@Directive({
  selector: '[buiHoverCardContent]',
  host: { 'data-slot': 'hover-card-content', tabindex: '-1', '[class]': 'computedClass()' },
})
export class BuiHoverCardContent {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
      this.userClass(),
    ),
  );
}
