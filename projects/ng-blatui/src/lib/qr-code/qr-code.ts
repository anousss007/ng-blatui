import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

import { encodeQr } from './qr-encode';

/** Renders a value as a scannable QR code (SVG). Level M, byte mode. SSR-safe. */
@Component({
  selector: 'bui-qr-code',
  host: { 'data-slot': 'qr-code', '[class]': 'computedClass()' },
  template: `
    <svg
      [attr.viewBox]="viewBox()"
      [attr.width]="size()"
      [attr.height]="size()"
      role="img"
      [attr.aria-label]="label()"
      shape-rendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect [attr.width]="dimension()" [attr.height]="dimension()" [attr.fill]="background()" />
      <path [attr.d]="path()" [attr.fill]="foreground()" />
    </svg>
  `,
})
export class BuiQrCode {
  readonly value = input('');
  readonly size = input(160);
  readonly label = input('QR code');
  readonly foreground = input('currentColor');
  readonly background = input('transparent');
  readonly margin = input(2);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly matrix = computed(() => encodeQr(this.value()));
  protected readonly dimension = computed(() => this.matrix().length + this.margin() * 2);
  protected readonly viewBox = computed(() => `0 0 ${this.dimension()} ${this.dimension()}`);
  protected readonly path = computed(() => {
    const margin = this.margin();
    const parts: string[] = [];
    for (const [r, row] of this.matrix().entries()) {
      for (const [c, on] of row.entries()) {
        if (on) {
          parts.push(`M${c + margin} ${r + margin}h1v1h-1z`);
        }
      }
    }
    return parts.join('');
  });
  protected readonly computedClass = computed(() => cn('inline-block', this.userClass()));
}
