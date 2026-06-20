import { afterNextRender, Component, computed, input, type OnDestroy, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/**
 * Types and deletes a cycling list of words. The animated text is `aria-hidden`; an sr-only
 * span carries the full word list so assistive tech reads it once. SSR-safe.
 */
@Component({
  selector: 'bui-typewriter',
  host: { 'data-slot': 'typewriter', '[class]': 'computedClass()' },
  template: `
    <span aria-hidden="true">{{ text() }}</span>
    @if (cursor()) {
      <span
        class="ml-0.5 inline-block w-px animate-pulse self-stretch bg-current"
        aria-hidden="true"
      ></span>
    }
    <span class="sr-only">{{ words().join('. ') }}</span>
  `,
})
export class BuiTypewriter implements OnDestroy {
  readonly words = input<readonly string[]>([]);
  readonly typeSpeed = input(90);
  readonly deleteSpeed = input(40);
  readonly pause = input(1600);
  readonly loop = input(true);
  readonly cursor = input(true);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly text = signal('');
  protected readonly computedClass = computed(() =>
    cn('inline-flex items-center', this.userClass()),
  );
  private wordIndex = 0;
  private charIndex = 0;
  private deleting = false;
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    afterNextRender(() => {
      if (this.words().length > 0) {
        this.tick();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
    }
  }

  private tick(): void {
    const words = this.words();
    if (words.length === 0) {
      return;
    }
    const current = words[this.wordIndex];
    if (this.deleting) {
      this.charIndex -= 1;
      this.text.set(current.slice(0, this.charIndex));
      if (this.charIndex <= 0) {
        this.deleting = false;
        this.wordIndex = (this.wordIndex + 1) % words.length;
        if (!this.loop() && this.wordIndex === 0) {
          return;
        }
        this.schedule(this.typeSpeed());
        return;
      }
      this.schedule(this.deleteSpeed());
      return;
    }
    this.charIndex += 1;
    this.text.set(current.slice(0, this.charIndex));
    if (this.charIndex >= current.length) {
      if (!this.loop() && this.wordIndex === words.length - 1) {
        return;
      }
      this.deleting = true;
      this.schedule(this.pause());
      return;
    }
    this.schedule(this.typeSpeed());
  }

  private schedule(delay: number): void {
    this.timer = setTimeout(() => {
      this.tick();
    }, delay);
  }
}
