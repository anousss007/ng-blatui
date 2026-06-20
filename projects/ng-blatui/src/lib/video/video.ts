import { Component, computed, type ElementRef, input, signal, viewChild } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A styled HTML5 video with a poster + play-button facade. */
@Component({
  selector: 'bui-video',
  host: {
    'data-slot': 'video',
    '[class]': 'computedClass()',
    '[style.aspect-ratio]': 'ratioValue()',
  },
  template: `
    <video
      #v
      [src]="src() || null"
      [poster]="poster() || null"
      [controls]="started() && controls()"
      [autoplay]="autoplay()"
      [loop]="loop()"
      [muted]="muted()"
      playsinline
      class="size-full object-cover"
      (play)="started.set(true)"
    >
      <ng-content />
    </video>
    @if (!started() && !autoplay()) {
      <button
        type="button"
        class="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
        aria-label="Play video"
        (click)="play()"
      >
        <span
          class="flex size-16 items-center justify-center rounded-full bg-white/90 text-black shadow-lg"
        >
          <svg class="ms-1 size-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>
    }
  `,
})
export class BuiVideo {
  readonly src = input('');
  readonly poster = input('');
  readonly aspect = input('video');
  readonly controls = input(true);
  readonly autoplay = input(false);
  readonly loop = input(false);
  readonly muted = input(false);
  readonly rounded = input('rounded-xl');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly v = viewChild<ElementRef<HTMLVideoElement>>('v');
  protected readonly started = signal(false);
  protected readonly ratioValue = computed(() => {
    const aspect = this.aspect();
    if (aspect === 'video') {
      return '16/9';
    }
    if (aspect === 'square') {
      return '1/1';
    }
    return aspect;
  });
  protected readonly computedClass = computed(() =>
    cn('relative block overflow-hidden bg-black', this.rounded(), this.userClass()),
  );

  protected play(): void {
    this.started.set(true);
    const element = this.v()?.nativeElement;
    if (!element) {
      return;
    }
    // eslint-disable-next-line sonarjs/no-try-promise -- jsdom throws synchronously; ignore unavailable playback
    try {
      void element.play();
    } catch {
      // playback unavailable (e.g. jsdom)
    }
  }
}
