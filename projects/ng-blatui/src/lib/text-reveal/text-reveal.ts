import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/**
 * Dims its words, then brightens them one by one as the element scrolls up through the
 * viewport. Server-renders fully revealed (no-JS safe). SSR-safe.
 */
@Component({
  selector: 'bui-text-reveal',
  host: {
    'data-slot': 'text-reveal',
    '[class]': 'computedClass()',
    '(window:scroll)': 'update()',
    '(window:resize)': 'update()',
  },
  template: `
    @for (word of words(); track $index) {
      <span class="transition-opacity duration-200" [style.opacity]="$index < revealed() ? 1 : 0.2">
        {{ word }}
      </span>
      {{ ' ' }}
    }
  `,
})
export class BuiTextReveal {
  /** Text split into words that brighten one by one as it scrolls into view. */
  readonly text = input('');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly words = computed(() =>
    this.text()
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0),
  );
  protected readonly revealed = signal(Infinity);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly computedClass = computed(() =>
    cn('text-2xl leading-relaxed font-bold', this.userClass()),
  );

  constructor() {
    afterNextRender(() => {
      this.update();
    });
  }

  protected update(): void {
    const rect = this.host.nativeElement.getBoundingClientRect();
    const viewport = globalThis.innerHeight || 0;
    const start = viewport * 0.9;
    const end = viewport * 0.3;
    const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
    this.revealed.set(Math.round(progress * this.words().length));
  }
}
