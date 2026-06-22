import { afterNextRender, Component, computed, input, type OnDestroy, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/**
 * Reveals a passage token-by-token (LLM-style) once. The streamed copy is `aria-hidden`;
 * an `aria-live` region carries the full passage up front. SSR-safe.
 */
@Component({
  selector: 'bui-streaming-text',
  host: { 'data-slot': 'streaming-text', '[class]': 'computedClass()' },
  template: `
    <span aria-hidden="true">{{ shown() }}</span>
    @if (caret() && streaming()) {
      <span
        class="ml-0.5 inline-block w-px animate-pulse self-stretch bg-current"
        aria-hidden="true"
      ></span>
    }
    <span class="sr-only" aria-live="polite">{{ text() }}</span>
  `,
})
export class BuiStreamingText implements OnDestroy {
  /** Full passage to reveal; also announced up front via an `aria-live` region. */
  readonly text = input('');
  /** Delay in milliseconds between each revealed token. */
  readonly speed = input(18);
  /** Delay in milliseconds before streaming begins. */
  readonly startDelay = input(0);
  /** Granularity of the reveal — one character or one word at a time. */
  readonly by = input<'char' | 'word'>('char');
  /** Whether to show a blinking caret while streaming. */
  readonly caret = input(true);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly shown = signal('');
  protected readonly streaming = signal(false);
  protected readonly computedClass = computed(() =>
    cn('inline-flex items-center', this.userClass()),
  );
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    afterNextRender(() => {
      this.start();
    });
  }

  ngOnDestroy(): void {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
    }
  }

  private start(): void {
    const full = this.text();
    if (full === '') {
      return;
    }
    this.shown.set('');
    this.streaming.set(true);
    const isByWord = this.by() === 'word';
    const words = isByWord ? full.split(' ') : [];
    const total = (isByWord ? words : full).length;
    let index = 0;
    const step = (): void => {
      index += 1;
      this.shown.set(isByWord ? words.slice(0, index).join(' ') : full.slice(0, index));
      if (index >= total) {
        this.streaming.set(false);
        return;
      }
      this.timer = setTimeout(step, this.speed());
    };
    this.timer = setTimeout(step, this.startDelay());
  }
}
