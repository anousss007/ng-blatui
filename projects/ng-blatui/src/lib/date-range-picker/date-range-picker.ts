import { type ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BuiCalendar, type CalendarRange } from '../calendar/calendar';
import { type ClassValue, cn } from '../utils/cn';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

/** A named shortcut shown beside the calendar, e.g. "Last 7 days". */
export interface DateRangePreset {
  /** Text shown for the shortcut. */
  label: string;
  /** The range it applies, as `yyyy-mm-dd` bounds. */
  range: CalendarRange;
}

const POPUP_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
];

function pad(value: number): string {
  return String(value).padStart(2, '0');
}
function isoOf(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/**
 * A start→end date range picker: a trigger that opens a two-month calendar (in a CDK overlay, so
 * it is never clipped by an `overflow: hidden` ancestor) alongside quick-pick presets. Two-way
 * bind the range with `[(value)]` or use it as a form control.
 *
 * ```html
 * <bui-date-range-picker [(value)]="range" />
 * ```
 */
@Component({
  selector: 'bui-date-range-picker',
  host: { 'data-slot': 'date-range-picker', '[class]': 'computedClass()' },
  imports: [OverlayModule, BuiCalendar],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BuiDateRangePicker), multi: true },
  ],
  template: `
    <button
      #trigger
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      type="button"
      class="flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
      [attr.aria-label]="ariaLabel() || placeholder()"
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
      <div class="z-50 flex rounded-lg border bg-popover shadow-md" role="dialog">
        @if (resolvedPresets().length > 0) {
          <ul class="flex w-36 flex-col gap-1 border-r p-2">
            @for (preset of resolvedPresets(); track preset.label) {
              <li>
                <button
                  type="button"
                  class="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                  (click)="applyPreset(preset)"
                >
                  {{ preset.label }}
                </button>
              </li>
            }
          </ul>
        }
        <bui-calendar
          mode="range"
          [months]="months()"
          [range]="value()"
          [minDate]="minDate()"
          [maxDate]="maxDate()"
          (rangeChange)="onRange($event)"
        />
      </div>
    </ng-template>
  `,
})
export class BuiDateRangePicker implements ControlValueAccessor {
  /** Selected range as `yyyy-mm-dd` bounds. Two-way bindable with `[(value)]`. */
  readonly value = model<CalendarRange>({ start: '', end: '' });
  /** Month grids shown side by side in the popover. */
  readonly months = input(2);
  /** Earliest selectable date (`yyyy-mm-dd`). */
  readonly minDate = input('');
  /** Latest selectable date (`yyyy-mm-dd`). */
  readonly maxDate = input('');
  /** Text shown on the trigger when nothing is selected. */
  readonly placeholder = input('Pick a date range');
  /** Whether the picker is disabled. Two-way bindable with `[(disabled)]`. */
  readonly disabled = model(false);
  /** Quick-pick shortcuts. Pass `[]` to hide them; omit for a sensible default set. */
  readonly presets = input<DateRangePreset[] | null>(null);
  /** Accessible name applied to the trigger. */
  readonly ariaLabel = input<string>('', { alias: 'aria-label' });
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly open = signal(false);
  protected readonly popupPositions = POPUP_POSITIONS;
  private onChange: (value: CalendarRange) => void = noop;
  private onTouched: () => void = noop;

  protected readonly hasValue = computed(() => this.value().start !== '');
  protected readonly display = computed(() => {
    const { start, end } = this.value();
    if (start === '') {
      return this.placeholder();
    }
    return end === '' ? `${this.fmt(start)} – …` : `${this.fmt(start)} – ${this.fmt(end)}`;
  });
  protected readonly resolvedPresets = computed(() => this.presets() ?? this.defaultPresets());
  protected readonly computedClass = computed(() => cn('block', this.userClass()));

  protected onRange(range: CalendarRange): void {
    this.value.set(range);
    this.onChange(range);
    // Close once a full range is chosen, matching how native range pickers behave.
    if (range.start !== '' && range.end !== '') {
      this.open.set(false);
      this.onTouched();
    }
  }

  protected applyPreset(preset: DateRangePreset): void {
    this.value.set(preset.range);
    this.onChange(preset.range);
    this.open.set(false);
    this.onTouched();
  }

  protected onOutsideClick(event: MouseEvent): void {
    // The trigger toggles itself; ignore clicks on it so the two don't fight.
    if (
      event.target !== null &&
      (event.target as HTMLElement).closest('[data-slot="date-range-picker"]')
    ) {
      return;
    }
    if (this.open()) {
      this.open.set(false);
      this.onTouched();
    }
  }

  private fmt(iso: string): string {
    const [year, month, day] = iso.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  private defaultPresets(): DateRangePreset[] {
    const today = new Date();
    const iso = isoOf(today);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    return [
      { label: 'Today', range: { start: iso, end: iso } },
      { label: 'Last 7 days', range: { start: isoOf(addDays(today, -6)), end: iso } },
      { label: 'Last 30 days', range: { start: isoOf(addDays(today, -29)), end: iso } },
      { label: 'This month', range: { start: isoOf(startOfMonth), end: iso } },
      {
        label: 'Last month',
        range: { start: isoOf(startOfLastMonth), end: isoOf(endOfLastMonth) },
      },
    ];
  }

  writeValue(value: CalendarRange | null): void {
    this.value.set(value ?? { start: '', end: '' });
  }

  registerOnChange(callback: (value: CalendarRange) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
