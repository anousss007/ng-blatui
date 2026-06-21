import { Component, computed, ElementRef, inject, input, model, signal } from '@angular/core';

import { BuiCalendar } from '../calendar/calendar';
import { BuiTimeField } from '../time-field/time-field';
import { type ClassValue, cn } from '../utils/cn';

/** A combined date + time picker in a popover. Value is `YYYY-MM-DDTHH:mm`. */
@Component({
  selector: 'bui-datetime-picker',
  imports: [BuiCalendar, BuiTimeField],
  host: {
    'data-slot': 'datetime-picker',
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
        <bui-calendar [value]="datePart()" (valueChange)="onDate($event)" />
        <div class="flex items-center gap-2 border-t p-2">
          <span class="text-xs text-muted-foreground">Time</span>
          <bui-time-field [value]="timePart()" (valueChange)="onTime($event)" />
        </div>
      </div>
    }
  `,
})
export class BuiDatetimePicker {
  readonly value = model('');
  readonly placeholder = input('Pick date & time');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly open = signal(false);
  protected readonly datePart = computed(() => this.value().split('T', 1).at(0) ?? '');
  protected readonly timePart = computed(() => this.value().split('T', 2).at(1) ?? '12:00');
  protected readonly display = computed(() => {
    const value = this.value();
    if (value === '') {
      return this.placeholder();
    }
    return new Date(value).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  });
  protected readonly computedClass = computed(() => cn('relative inline-block', this.userClass()));

  protected onDate(iso: string): void {
    this.value.set(`${iso}T${this.timePart()}`);
  }

  protected onTime(time: string): void {
    const date = this.datePart();
    this.value.set(`${date === '' ? this.todayIso() : date}T${time}`);
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  private todayIso(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }
}
