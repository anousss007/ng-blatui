import { Component, computed, input, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/**
 * A card that flips to reveal its back. Default content is the front; project the back
 * with `[buiFlipBack]`. `trigger="hover"` (default) or `"click"` (keyboard-accessible).
 */
@Component({
  selector: 'bui-flip-card',
  host: {
    'data-slot': 'flip-card',
    '[class]': 'computedClass()',
    '[style.perspective]': "'1000px'",
    '[style.height]': 'height()',
    '[attr.role]': "trigger() === 'click' ? 'button' : null",
    '[attr.tabindex]': "trigger() === 'click' ? 0 : null",
    '[attr.aria-pressed]': "trigger() === 'click' ? flipped() : null",
    '(mouseenter)': 'onHover(true)',
    '(mouseleave)': 'onHover(false)',
    '(focusin)': 'onHover(true)',
    '(focusout)': 'onHover(false)',
    '(click)': 'onClick()',
    '(keydown)': 'onKeydown($event)',
  },
  template: `
    <div
      data-slot="flip-card-flipper"
      class="relative block size-full rounded-xl transition-transform duration-500 [transform-style:preserve-3d]"
      [class]="flipped() ? '[transform:rotateY(180deg)]' : ''"
    >
      <div
        data-slot="flip-card-front"
        class="absolute inset-0 flex flex-col overflow-hidden rounded-xl border bg-card p-6 text-card-foreground shadow-sm [backface-visibility:hidden]"
        [attr.aria-hidden]="flipped()"
      >
        <ng-content />
      </div>
      <div
        data-slot="flip-card-back"
        class="absolute inset-0 flex [transform:rotateY(180deg)] flex-col overflow-hidden rounded-xl border bg-card p-6 text-card-foreground shadow-sm [backface-visibility:hidden]"
        [attr.aria-hidden]="!flipped()"
      >
        <ng-content select="[buiFlipBack]" />
      </div>
    </div>
  `,
})
export class BuiFlipCard {
  /** What flips the card: hover/focus or click/keypress. */
  readonly trigger = input<'hover' | 'click'>('hover');
  /** Fixed card height as a CSS length. */
  readonly height = input('16rem');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly flipped = signal(false);
  protected readonly computedClass = computed(() => cn('relative block w-full', this.userClass()));

  protected onHover(shouldFlip: boolean): void {
    if (this.trigger() === 'hover') {
      this.flipped.set(shouldFlip);
    }
  }

  protected onClick(): void {
    if (this.trigger() === 'click') {
      this.flipped.update((value) => !value);
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!(this.trigger() === 'click' && (event.key === 'Enter' || event.key === ' '))) {
      return;
    }

    event.preventDefault();
    this.flipped.update((value) => !value);
  }
}
