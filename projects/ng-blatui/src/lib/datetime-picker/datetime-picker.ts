import {
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BuiCalendar, type CalendarMode, type CalendarRange } from '../calendar/calendar';
import { BuiTimeField } from '../time-field/time-field';
import { type ClassValue, cn } from '../utils/cn';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

/** A combined date + time picker in a popover. Value is `YYYY-MM-DDTHH:mm`. */
@Component({
  selector: 'bui-datetime-picker',
  imports: [BuiCalendar, BuiTimeField],
  host: {
    'data-slot': 'datetime-picker',
    '[class]': 'computedClass()',
    '(document:click)': 'onDocumentClick($event)',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BuiDatetimePicker), multi: true },
  ],
  template: `
    <button
      type="button"
      class="flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
      [attr.aria-expanded]="open()"
      [disabled]="disabled()"
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
      <span [class]="hasValue() ? '' : 'text-muted-foreground'">{{ display() }}</span>
    </button>
    @if (open()) {
      <div class="absolute z-50 mt-1 rounded-lg border bg-popover shadow-md">
        @if (mode() === 'range') {
          <bui-calendar
            mode="range"
            [months]="months()"
            [range]="calRange()"
            [minDate]="minDate()"
            [maxDate]="maxDate()"
            [captionLayout]="captionLayout()"
            (rangeChange)="onRange($event)"
          />
        } @else {
          <bui-calendar
            [value]="datePart()"
            [minDate]="minDate()"
            [maxDate]="maxDate()"
            [captionLayout]="captionLayout()"
            (valueChange)="onDate($event)"
          />
        }
        <div class="flex items-center gap-2 border-t p-2">
          <span class="text-xs text-muted-foreground">Time</span>
          <bui-time-field
            [value]="timePart()"
            [seconds]="seconds()"
            (valueChange)="onTime($event)"
          />
        </div>
      </div>
    }
  `,
})
export class BuiDatetimePicker implements ControlValueAccessor {
  readonly value = model('');
  /** `single` (default) or `range`. */
  readonly mode = input<CalendarMode>('single');
  /** Selected range when mode="range" — start/end as `YYYY-MM-DDTHH:mm`, sharing one time. */
  readonly range = model<CalendarRange>({ start: '', end: '' });
  /** Month grids shown in the popover (handy for range). */
  readonly months = input(1);
  readonly placeholder = input('Pick date & time');
  readonly minDate = input('');
  readonly maxDate = input('');
  readonly captionLayout = input<'label' | 'dropdown'>('label');
  readonly seconds = input(false);
  readonly disabled = model(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private onChange: (value: string) => void = noop;
  protected onTouched: () => void = noop;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly open = signal(false);
  protected readonly datePart = computed(() => this.value().split('T', 1).at(0) ?? '');
  protected readonly timePart = computed(() => {
    const source = this.mode() === 'range' ? this.range().start : this.value();
    return source.split('T', 2).at(1) ?? '12:00';
  });
  protected readonly calRange = computed<CalendarRange>(() => {
    const { start, end } = this.range();
    return { start: start.split('T', 1).at(0) ?? '', end: end.split('T', 1).at(0) ?? '' };
  });
  protected readonly hasValue = computed(
    () => (this.mode() === 'range' ? this.range().start : this.value()) !== '',
  );
  protected readonly display = computed(() => {
    if (this.mode() === 'range') {
      const { start, end } = this.range();
      if (start === '') {
        return this.placeholder();
      }
      return end === '' ? `${this.fmt(start)} – …` : `${this.fmt(start)} – ${this.fmt(end)}`;
    }
    const value = this.value();
    return value === '' ? this.placeholder() : this.fmt(value);
  });
  protected readonly computedClass = computed(() => cn('relative inline-block', this.userClass()));

  protected onDate(iso: string): void {
    this.value.set(`${iso}T${this.timePart()}`);
    this.onChange(this.value());
  }

  protected onRange(range: CalendarRange): void {
    const time = this.timePart();
    this.range.set({
      start: range.start === '' ? '' : `${range.start}T${time}`,
      end: range.end === '' ? '' : `${range.end}T${time}`,
    });
  }

  protected onTime(time: string): void {
    if (this.mode() === 'range') {
      const { start, end } = this.calRange();
      this.range.set({
        start: start === '' ? '' : `${start}T${time}`,
        end: end === '' ? '' : `${end}T${time}`,
      });
      return;
    }
    const date = this.datePart();
    this.value.set(`${date === '' ? this.todayIso() : date}T${time}`);
    this.onChange(this.value());
  }

  private fmt(value: string): string {
    return new Date(value).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (!(this.open() && !this.host.nativeElement.contains(event.target as Node))) {
      return;
    }

    this.open.set(false);
    this.onTouched();
  }

  writeValue(value: string | null | undefined): void {
    this.value.set(typeof value === 'string' ? value : '');
  }

  registerOnChange(callback: (value: string) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  private todayIso(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }
}
