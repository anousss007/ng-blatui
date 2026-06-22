import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { type ClassValue, cn } from '../utils/cn';

/**
 * An NProgress-style top loading bar. Drive it with `start()` / `set(0..1)` / `done()`,
 * or with `top-progress:start` / `top-progress:set` / `top-progress:done` window events.
 */
@Component({
  selector: 'bui-top-progress',
  host: {
    'data-slot': 'top-progress',
    '[class]': 'computedClass()',
    '[style.height.px]': 'height()',
    role: 'progressbar',
    '[attr.aria-label]': 'ariaLabelText()',
    '[attr.aria-valuenow]': 'visible() ? round(progress() * 100) : null',
  },
  template: `
    <div
      class="h-full transition-all duration-200 ease-out"
      [style.width.%]="visible() ? progress() * 100 : 0"
      [style.opacity]="visible() ? 1 : 0"
      [style.background]="color()"
    ></div>
  `,
})
export class BuiTopProgress {
  /** CSS color (or gradient) used to fill the bar. */
  readonly color = input('var(--color-primary, #6366f1)');
  /** Bar thickness in pixels. */
  readonly height = input(2);
  /** When true, renders inline within its container instead of fixed at the top of the viewport. */
  readonly demo = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  /** Overrides the localized accessible progressbar label. */
  readonly ariaLabel = input<string>();

  protected readonly ariaLabelText = buiLabel('topProgressLoading', this.ariaLabel);

  protected readonly progress = signal(0);
  protected readonly visible = signal(false);
  private timer: ReturnType<typeof setInterval> | undefined;
  protected readonly computedClass = computed(() =>
    cn(
      this.demo()
        ? 'relative block w-full overflow-hidden'
        : 'fixed inset-x-0 top-0 z-[100] block overflow-hidden',
      this.userClass(),
    ),
  );

  constructor() {
    const lifecycleReference = inject(DestroyRef);
    afterNextRender(() => {
      const onStart = (): void => {
        this.start();
      };
      const onDone = (): void => {
        this.done();
      };
      const onSet = (event: Event): void => {
        const detail = (event as CustomEvent<{ value?: number }>).detail;
        this.set(detail.value ?? 0);
      };
      globalThis.addEventListener('top-progress:start', onStart);
      globalThis.addEventListener('top-progress:done', onDone);
      globalThis.addEventListener('top-progress:set', onSet);
      lifecycleReference.onDestroy(() => {
        globalThis.removeEventListener('top-progress:start', onStart);
        globalThis.removeEventListener('top-progress:done', onDone);
        globalThis.removeEventListener('top-progress:set', onSet);
        this.stop();
      });
    });
  }

  start(): void {
    this.visible.set(true);
    this.progress.set(0.08);
    this.stop();
    this.timer = setInterval(() => {
      const current = this.progress();
      if (current < 0.9) {
        this.progress.set(current + (0.9 - current) * 0.1);
      }
    }, 400);
  }

  set(value: number): void {
    this.visible.set(true);
    this.progress.set(Math.max(0, Math.min(1, value)));
  }

  done(): void {
    this.stop();
    this.progress.set(1);
    setTimeout(() => {
      this.visible.set(false);
      this.progress.set(0);
    }, 300);
  }

  protected round(value: number): number {
    return Math.round(value);
  }

  private stop(): void {
    if (this.timer === undefined) {
      return;
    }

    clearInterval(this.timer);
    this.timer = undefined;
  }
}
