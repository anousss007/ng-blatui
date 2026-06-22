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
import { type ClassValue, cn } from '../utils/cn';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

/** A date input that opens a calendar popover. */
@Component({
  selector: 'bui-date-picker',
  imports: [BuiCalendar],
  host: {
    'data-slot': 'date-picker',
    '[class]': 'computedClass()',
    '(document:click)': 'onDocumentClick($event)',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BuiDatePicker), multi: true },
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
        <bui-calendar
          [mode]="mode()"
          [months]="months()"
          [value]="value()"
          [range]="range()"
          [minDate]="minDate()"
          [maxDate]="maxDate()"
          [weekStart]="weekStart()"
          [disabledDates]="disabledDates()"
          [disableWeekends]="disableWeekends()"
          [showWeekNumbers]="showWeekNumbers()"
          [captionLayout]="captionLayout()"
          [hideOutsideDays]="hideOutsideDays()"
          (valueChange)="onPick($event)"
          (rangeChange)="onRange($event)"
        />
      </div>
    }
  `,
})
export class BuiDatePicker implements ControlValueAccessor {
  readonly value = model('');
  /** `single` (default) or `range`. */
  readonly mode = input<CalendarMode>('single');
  /** Selected range when mode="range". */
  readonly range = model<CalendarRange>({ start: '', end: '' });
  /** Month grids shown in the popover (handy for range). */
  readonly months = input(1);
  readonly placeholder = input('Pick a date');
  readonly minDate = input('');
  readonly maxDate = input('');
  readonly weekStart = input(0);
  readonly disabledDates = input<readonly string[]>([]);
  readonly disableWeekends = input(false);
  readonly showWeekNumbers = input(false);
  readonly captionLayout = input<'label' | 'dropdown'>('label');
  readonly hideOutsideDays = input(false);
  readonly disabled = model(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private onChange: (value: string) => void = noop;
  protected onTouched: () => void = noop;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly open = signal(false);
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

  protected onPick(iso: string): void {
    this.value.set(iso);
    this.onChange(iso);
    this.open.set(false);
    this.onTouched();
  }

  protected onRange(range: CalendarRange): void {
    this.range.set(range);
    if (range.start !== '' && range.end !== '') {
      this.open.set(false);
    }
  }

  private fmt(iso: string): string {
    return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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
}
