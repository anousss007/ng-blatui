import { Component, computed, inject, Injectable, input, signal } from '@angular/core';

import { cn } from '../utils/cn';

export type ToastTone = 'default' | 'success' | 'error' | 'warning' | 'info';
export interface ToastOptions {
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
}
interface Toast extends ToastOptions {
  id: number;
}

/** Imperative toast store. Inject it and call `show(...)`; render a `<bui-sonner />` once. */
@Injectable({ providedIn: 'root' })
export class BuiToaster {
  readonly toasts = signal<readonly Toast[]>([]);
  private sequence = 0;

  show(options: ToastOptions): number {
    this.sequence += 1;
    const id = this.sequence;
    this.toasts.set([...this.toasts(), { ...options, id }]);
    const duration = options.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
    return id;
  }

  dismiss(id: number): void {
    this.toasts.set(this.toasts().filter((toast) => toast.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }
}

const POSITION: Record<string, string> = {
  'top-left': 'top-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'top-right': 'top-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-4 right-4 items-end',
};
const TONE: Record<ToastTone, string> = {
  default: 'bg-popover text-popover-foreground',
  success: 'border-transparent bg-emerald-600 text-white',
  error: 'bg-destructive border-transparent text-white',
  warning: 'border-transparent bg-amber-500 text-white',
  info: 'border-transparent bg-sky-600 text-white',
};

/** The toast viewport. Drives off the {@link BuiToaster} store. */
@Component({
  selector: 'bui-sonner',
  host: { 'data-slot': 'sonner' },
  template: `
    <div role="region" aria-label="Notifications" [class]="regionClass()">
      @for (toast of toaster.toasts(); track toast.id) {
        <div
          role="status"
          aria-live="polite"
          class="pointer-events-auto flex w-80 max-w-[90vw] items-start gap-2 rounded-lg border p-4 shadow-lg"
          [class]="toneClass(toast.tone)"
        >
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium">{{ toast.title }}</p>
            @if (toast.description) {
              <p class="text-sm opacity-90">{{ toast.description }}</p>
            }
          </div>
          <button
            type="button"
            class="shrink-0 opacity-70 hover:opacity-100"
            aria-label="Dismiss notification"
            (click)="toaster.dismiss(toast.id)"
          >
            <svg
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `,
})
export class BuiSonner {
  readonly position = input('bottom-right');
  protected readonly toaster = inject(BuiToaster);
  protected readonly regionClass = computed(() =>
    cn('pointer-events-none fixed z-[100] flex flex-col gap-2', POSITION[this.position()]),
  );

  protected toneClass(tone: ToastTone | undefined): string {
    return TONE[tone ?? 'default'];
  }
}
