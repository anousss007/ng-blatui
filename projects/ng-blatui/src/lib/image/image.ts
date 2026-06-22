import {
  afterNextRender,
  Component,
  computed,
  type ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A lazy image with a blurred placeholder / skeleton and a graceful error state. */
@Component({
  selector: 'bui-image',
  host: {
    'data-slot': 'image',
    '[class]': 'computedClass()',
    '[style.aspect-ratio]': 'ratio() || null',
  },
  template: `
    @if (!loaded() && !error()) {
      @if (placeholder()) {
        <img
          [src]="placeholder()"
          alt=""
          aria-hidden="true"
          class="absolute inset-0 size-full scale-110 blur-xl"
          [class]="objectClass()"
        />
      } @else {
        <div aria-hidden="true" class="absolute inset-0 size-full animate-pulse bg-muted"></div>
      }
    }
    @if (error()) {
      <div
        class="absolute inset-0 flex items-center justify-center bg-muted text-xs text-muted-foreground"
      >
        Failed to load
      </div>
    } @else {
      <img
        #img
        [src]="src()"
        [alt]="alt()"
        loading="lazy"
        class="relative size-full transition-opacity duration-300"
        [class]="objectClass()"
        [style.opacity]="loaded() ? 1 : 0"
        (load)="loaded.set(true)"
        (error)="error.set(true)"
      />
    }
  `,
})
export class BuiImage {
  /** Source URL of the full image to load. */
  readonly src = input('');
  /** Alternative text for the image. */
  readonly alt = input('');
  /** CSS `aspect-ratio` reserved for the image (e.g. `16 / 9`). */
  readonly ratio = input('');
  /** URL of a low-res image shown blurred while the full image loads. */
  readonly placeholder = input('');
  /** Tailwind class controlling corner rounding. */
  readonly rounded = input('rounded-lg');
  /** How the image fills its box: `cover` crops, `contain` letterboxes. */
  readonly fit = input<'cover' | 'contain'>('cover');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly loaded = signal(false);
  protected readonly error = signal(false);
  private readonly img = viewChild<ElementRef<HTMLImageElement>>('img');
  protected readonly objectClass = computed(() =>
    this.fit() === 'contain' ? 'object-contain' : 'object-cover',
  );
  protected readonly computedClass = computed(() =>
    cn('relative block overflow-hidden', this.rounded(), this.userClass()),
  );

  constructor() {
    afterNextRender(() => {
      const element = this.img()?.nativeElement;
      if (element && element.complete && element.naturalWidth > 0) {
        this.loaded.set(true);
      }
    });
  }
}
