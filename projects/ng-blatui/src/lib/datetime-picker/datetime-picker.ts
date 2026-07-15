import { type ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
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

const POPUP_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
];

/**
 * A combined date + time picker in a popover. Value is `YYYY-MM-DDTHH:mm`. The popover renders in a
 * CDK overlay, so it escapes any `overflow: hidden` ancestor (no clipping) and flips on-screen.
 */
@Component({
  selector: 'bui-datetime-picker',
  imports: [OverlayModule, BuiCalendar, BuiTimeField],
  host: {
    'data-slot': 'datetime-picker',
    '[class]': 'computedClass()',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BuiDatetimePicker), multi: true },
  ],
  template: `
    <button
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
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
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayPositions]="popupPositions"
      [cdkConnectedOverlayViewportMargin]="8"
      (overlayOutsideClick)="onOutsideClick($event)"
    >
      <div class="z-50 rounded-lg border bg-popover shadow-md">
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
    </ng-template>
  `,
})
export class BuiDatetimePicker implements ControlValueAccessor {
  /** Selected date-time (mode="single") as `YYYY-MM-DDTHH:mm`. Two-way bindable with `[(value)]`. */
  readonly value = model('');
  /** `single` (default) or `range`. */
  readonly mode = input<CalendarMode>('single');
  /** Selected range when mode="range" — start/end as `YYYY-MM-DDTHH:mm`, sharing one time. */
  readonly range = model<CalendarRange>({ start: '', end: '' });
  /** Month grids shown in the popover (handy for range). */
  readonly months = input(1);
  /** Text shown on the trigger when nothing is selected. */
  readonly placeholder = input('Pick date & time');
  /** Earliest selectable date (`yyyy-mm-dd`). */
  readonly minDate = input('');
  /** Latest selectable date (`yyyy-mm-dd`). */
  readonly maxDate = input('');
  /** `dropdown` swaps the month label for month + year selects. */
  readonly captionLayout = input<'label' | 'dropdown'>('label');
  /** Whether to include seconds in the time field. */
  readonly seconds = input(false);
  /** Whether the picker is disabled. Two-way bindable with `[(disabled)]`. */
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
  protected readonly popupPositions = POPUP_POSITIONS;
  protected readonly computedClass = computed(() => cn('inline-block', this.userClass()));

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

  // The popover is portalled into a CDK overlay (outside the host); rely on the overlay's own
  // outside-click signal. Clicks on the trigger stay inside the host and are ignored here.
  protected onOutsideClick(event: MouseEvent): void {
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
