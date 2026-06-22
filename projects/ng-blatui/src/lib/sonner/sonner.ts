import { Component, computed, inject, Injectable, input, signal } from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { cn } from '../utils/cn';

/** Color tone of a toast (`default | success | error | warning | info`). */
export type ToastTone = 'default' | 'success' | 'error' | 'warning' | 'info';
export interface ToastOptions {
  /** Main toast heading text. */
  title: string;
  /** Optional secondary line shown beneath the title. */
  description?: string;
  /** Color tone of the toast. */
  tone?: ToastTone;
  /** Auto-dismiss delay in milliseconds; `0` or less keeps it until dismissed. */
  duration?: number;
  /** Optional inline action button (e.g. Undo). */
  action?: { label: string; onClick?: () => void };
}
interface Toast extends ToastOptions {
  /** Unique auto-assigned id used to track and dismiss the toast. */
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
    <div role="region" [attr.aria-label]="ariaLabelText()" [class]="regionClass()">
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
            @if (toast.action) {
              <button
                type="button"
                class="mt-2 text-sm font-medium underline underline-offset-4 hover:opacity-80"
                (click)="runAction(toast)"
              >
                {{ toast.action.label }}
              </button>
            }
          </div>
          <button
            type="button"
            class="shrink-0 opacity-70 hover:opacity-100"
            [attr.aria-label]="dismissText()"
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
  /** Viewport corner where toasts stack (e.g. `top-left`, `bottom-right`). */
  readonly position = input('bottom-right');
  /** Overrides the localized accessible label for the toast region. */
  readonly ariaLabel = input<string>();
  /** Overrides the localized accessible label for each dismiss button. */
  readonly dismissLabel = input<string>();

  protected readonly ariaLabelText = buiLabel('sonner', this.ariaLabel);
  protected readonly dismissText = buiLabel('sonnerDismiss', this.dismissLabel);

  protected readonly toaster = inject(BuiToaster);
  protected readonly regionClass = computed(() =>
    cn('pointer-events-none fixed z-[100] flex flex-col gap-2', POSITION[this.position()]),
  );

  protected toneClass(tone: ToastTone | undefined): string {
    return TONE[tone ?? 'default'];
  }

  protected runAction(toast: Toast): void {
    toast.action?.onClick?.();
    this.toaster.dismiss(toast.id);
  }
}
