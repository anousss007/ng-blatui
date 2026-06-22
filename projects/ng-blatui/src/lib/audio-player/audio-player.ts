import { Component, computed, type ElementRef, input, signal, viewChild } from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { type ClassValue, cn } from '../utils/cn';

/** A compact audio player around a native `<audio>`: play/pause, seek, time, mute. */
@Component({
  selector: 'bui-audio-player',
  host: { 'data-slot': 'audio-player', '[class]': 'computedClass()' },
  template: `
    <audio
      #a
      [src]="src() || null"
      preload="metadata"
      [autoplay]="autoplay()"
      class="sr-only"
      (timeupdate)="onTime()"
      (loadedmetadata)="onMeta()"
      (play)="playing.set(true)"
      (pause)="playing.set(false)"
      (ended)="playing.set(false)"
    ></audio>
    <button
      type="button"
      class="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
      [attr.aria-label]="playing() ? pauseText() : playText()"
      (click)="toggle()"
    >
      <svg class="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        @if (playing()) {
          <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
        } @else {
          <path d="M8 5v14l11-7z" />
        }
      </svg>
    </button>
    @if (title() && !compact()) {
      <div class="min-w-0">
        <div class="truncate text-sm font-medium">{{ title() }}</div>
        @if (artist()) {
          <div class="truncate text-xs text-muted-foreground">{{ artist() }}</div>
        }
      </div>
    }
    <span class="text-xs text-muted-foreground tabular-nums">{{ format(current()) }}</span>
    <input
      type="range"
      min="0"
      step="0.1"
      [max]="duration() || 0"
      [value]="current()"
      class="h-1 flex-1 accent-primary"
      [attr.aria-label]="seekText()"
      (input)="seek($event)"
    />
    <span class="text-xs text-muted-foreground tabular-nums">{{ format(duration()) }}</span>
    @if (!compact()) {
      <button
        type="button"
        class="shrink-0 text-muted-foreground hover:text-foreground"
        [attr.aria-label]="muted() ? unmuteText() : muteText()"
        (click)="toggleMute()"
      >
        <svg class="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          @if (muted()) {
            <path
              d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v2.2l2.45 2.45c.03-.21.05-.43.05-.65z"
            />
          } @else {
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4z" />
          }
        </svg>
      </button>
    }
  `,
})
export class BuiAudioPlayer {
  readonly src = input('');
  readonly title = input('');
  readonly artist = input('');
  readonly autoplay = input(false);
  /** Condensed layout: hides the title block and mute button. */
  readonly compact = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  readonly seekLabel = input<string>();
  readonly playLabel = input<string>();
  readonly pauseLabel = input<string>();
  readonly muteLabel = input<string>();
  readonly unmuteLabel = input<string>();

  protected readonly seekText = buiLabel('audioPlayerSeek', this.seekLabel);
  protected readonly playText = buiLabel('audioPlayerPlay', this.playLabel);
  protected readonly pauseText = buiLabel('audioPlayerPause', this.pauseLabel);
  protected readonly muteText = buiLabel('audioPlayerMute', this.muteLabel);
  protected readonly unmuteText = buiLabel('audioPlayerUnmute', this.unmuteLabel);
  private readonly a = viewChild<ElementRef<HTMLAudioElement>>('a');
  protected readonly playing = signal(false);
  protected readonly current = signal(0);
  protected readonly duration = signal(0);
  protected readonly muted = signal(false);
  protected readonly computedClass = computed(() =>
    cn('flex items-center gap-3 rounded-lg border bg-card p-3', this.userClass()),
  );

  protected toggle(): void {
    const element = this.a()?.nativeElement;
    if (!element) {
      return;
    }
    if (element.paused) {
      // eslint-disable-next-line sonarjs/no-try-promise -- jsdom throws synchronously
      try {
        void element.play();
      } catch {
        // playback unavailable
      }
    } else {
      element.pause();
    }
  }

  protected onTime(): void {
    this.current.set(this.a()?.nativeElement.currentTime ?? 0);
  }

  protected onMeta(): void {
    const value = this.a()?.nativeElement.duration ?? 0;
    this.duration.set(Number.isFinite(value) ? value : 0);
  }

  protected seek(event: Event): void {
    const time = Number((event.target as HTMLInputElement).value);
    const element = this.a()?.nativeElement;
    if (element) {
      element.currentTime = time;
    }
    this.current.set(time);
  }

  protected toggleMute(): void {
    const element = this.a()?.nativeElement;
    if (!element) {
      return;
    }
    element.muted = !element.muted;
    this.muted.set(element.muted);
  }

  protected format(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const rest = Math.floor(seconds % 60);
    return `${minutes}:${rest.toString().padStart(2, '0')}`;
  }
}
