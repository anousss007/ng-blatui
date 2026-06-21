import { Component, computed, ElementRef, inject, input, model, signal } from '@angular/core';

import { BuiCalendar } from '../calendar/calendar';
import { type ClassValue, cn } from '../utils/cn';

/** A date input that opens a calendar popover. */
@Component({
  selector: 'bui-date-picker',
  imports: [BuiCalendar],
  host: {
    'data-slot': 'date-picker',
    '[class]': 'computedClass()',
    '(document:click)': 'onDocumentClick($event)',
  },
  template: `
    <button
      type="button"
      class="flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      [attr.aria-expanded]="open()"
      (click)="open.set(!open())"
    >
      <svg
        class="size-4 text-muted-foreground"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M8 2v4M16 2v4M3 10h18" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
      </svg>
      <span [class]="value() ? '' : 'text-muted-foreground'">{{ display() }}</span>
    </button>
    @if (open()) {
      <div class="absolute z-50 mt-1 rounded-lg border bg-popover shadow-md">
        <bui-calendar
          [value]="value()"
          [minDate]="minDate()"
          [maxDate]="maxDate()"
          [weekStart]="weekStart()"
          [disabledDates]="disabledDates()"
          [disableWeekends]="disableWeekends()"
          [showWeekNumbers]="showWeekNumbers()"
          (valueChange)="onPick($event)"
        />
      </div>
    }
  `,
})
export class BuiDatePicker {
  readonly value = model('');
  readonly placeholder = input('Pick a date');
  readonly minDate = input('');
  readonly maxDate = input('');
  readonly weekStart = input(0);
  readonly disabledDates = input<readonly string[]>([]);
  readonly disableWeekends = input(false);
  readonly showWeekNumbers = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly open = signal(false);
  protected readonly display = computed(() => {
    const value = this.value();
    if (value === '') {
      return this.placeholder();
    }
    return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  });
  protected readonly computedClass = computed(() => cn('relative inline-block', this.userClass()));

  protected onPick(iso: string): void {
    this.value.set(iso);
    this.open.set(false);
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
