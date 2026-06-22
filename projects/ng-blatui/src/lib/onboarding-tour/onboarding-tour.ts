import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  PLATFORM_ID,
  signal,
} from '@angular/core';

export interface TourStep {
  /** CSS selector of the element to spotlight for this step. */
  target: string;
  /** Heading shown in the step's popover. */
  title: string;
  /** Body text shown under the title. */
  body: string;
}

/** A guided product tour with a spotlight on each step's target element. SSR-safe. */
@Component({
  selector: 'bui-onboarding-tour',
  host: { 'data-slot': 'onboarding-tour', '(document:keydown.escape)': 'finish()' },
  template: `
    @if (open() && current()) {
      <div
        class="pointer-events-none fixed z-[60] rounded-md ring-2 ring-primary transition-all"
        style="box-shadow: 0 0 0 9999px rgba(0,0,0,0.6)"
        [style.left.px]="rect().left - 4"
        [style.top.px]="rect().top - 4"
        [style.width.px]="rect().width + 8"
        [style.height.px]="rect().height + 8"
        aria-hidden="true"
      ></div>
      <div
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="current()!.title"
        class="fixed z-[61] w-72 rounded-lg border bg-popover p-4 shadow-lg"
        [style.left.px]="cardLeft()"
        [style.top.px]="cardTop()"
      >
        <h2 class="text-sm font-semibold">{{ current()!.title }}</h2>
        <p class="mt-1 text-sm text-muted-foreground">{{ current()!.body }}</p>
        <div class="mt-4 flex items-center justify-between">
          <span class="text-xs text-muted-foreground">{{ step() + 1 }} / {{ steps().length }}</span>
          <div class="flex gap-2">
            <button
              type="button"
              class="rounded px-2 py-1 text-xs text-muted-foreground hover:underline"
              (click)="finish()"
            >
              Skip
            </button>
            @if (step() > 0) {
              <button type="button" class="rounded border px-2 py-1 text-xs" (click)="prev()">
                Back
              </button>
            }
            <button
              type="button"
              class="rounded bg-primary px-2 py-1 text-xs text-primary-foreground"
              (click)="next()"
            >
              {{ isLast() ? 'Finish' : 'Next' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class BuiOnboardingTour {
  /** Whether the tour is open. Two-way bindable with `[(open)]`. */
  readonly open = model(false);
  /** Ordered steps; each spotlights its `target` element in turn. */
  readonly steps = input<readonly TourStep[]>([]);

  protected readonly step = signal(0);
  protected readonly rect = signal({ top: 0, left: 0, width: 0, height: 0 });
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly current = computed(() => this.steps().at(this.step()) ?? null);
  protected readonly isLast = computed(() => this.step() === this.steps().length - 1);
  protected readonly cardTop = computed(() => this.rect().top + this.rect().height + 12);
  protected readonly cardLeft = computed(() => this.rect().left);

  constructor() {
    effect(() => {
      if (!(this.open() && isPlatformBrowser(this.platformId))) {
        return;
      }

      this.step();
      this.measure();
    });
  }

  protected next(): void {
    if (this.isLast()) {
      this.finish();
    } else {
      this.step.set(this.step() + 1);
    }
  }

  protected prev(): void {
    this.step.set(Math.max(0, this.step() - 1));
  }

  protected finish(): void {
    this.open.set(false);
    this.step.set(0);
  }

  private measure(): void {
    const selector = this.current()?.target;
    if (!selector) {
      return;
    }
    const element = document.querySelector(selector);
    if (element) {
      const box = element.getBoundingClientRect();
      this.rect.set({ top: box.top, left: box.left, width: box.width, height: box.height });
    }
  }
}
