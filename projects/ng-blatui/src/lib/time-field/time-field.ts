import { Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { buiLabel } from '../i18n/labels';
import { buiLocale } from '../i18n/locale';
import { type ClassValue, cn } from '../utils/cn';

/** How the time field renders: native input or hour/minute selects. */
export type TimeFieldMode = 'input' | 'select';

/** Which hours the clock runs through. `h12`/`h11` add a day period (AM/PM), `h23`/`h24` do not. */
export type TimeFieldHourCycle = 'h11' | 'h12' | 'h23' | 'h24';

/** An option whose `value` stays the 24-hour data, while `label` is what the locale reads. */
interface TimeOption {
  value: string;
  label: string;
}

/** A midday reference date; only the hour/minute matter for formatting. */
function timeOf(hour: number, minute = 0): Date {
  return new Date(2000, 0, 1, hour, minute);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

const SELECT_CLASS =
  'h-9 rounded-md border border-input bg-background px-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50';

/**
 * A styled time field: a native `<input type="time">`, or hour/minute selects in `select` mode.
 * The value is always 24-hour `HH:mm`, whatever the clock shown.
 *
 * **Locale:** `select` mode follows `locale` — it renders the locale's clock (1–12 with AM/PM in
 * `en-US`, 0–23 in `fr`) and its digits. `input` mode cannot: the browser renders native time
 * inputs in *its own* UI language, and neither `lang` nor any other attribute overrides that.
 * Use `mode="select"` when the clock must follow the app's locale rather than the user's browser.
 */
@Component({
  selector: 'bui-time-field',
  host: {
    'data-slot': 'time-field',
    '[class]': 'computedClass()',
    '(focusout)': 'onTouched()',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BuiTimeField), multi: true },
  ],
  template: `
    @if (mode() === 'select') {
      <div class="inline-flex items-center gap-1">
        <select
          [class]="selectClass"
          [value]="hourPart()"
          [disabled]="disabled()"
          [attr.aria-label]="hoursAria()"
          (change)="setHour($event)"
        >
          @for (hour of hours(); track hour.value) {
            <option [value]="hour.value">{{ hour.label }}</option>
          }
        </select>
        <span aria-hidden="true" class="text-muted-foreground">:</span>
        <select
          [class]="selectClass"
          [value]="minutePart()"
          [disabled]="disabled()"
          [attr.aria-label]="minutesAria()"
          (change)="setMinute($event)"
        >
          @for (minute of minutes(); track minute.value) {
            <option [value]="minute.value">{{ minute.label }}</option>
          }
        </select>
      </div>
    } @else {
      <input
        type="time"
        [value]="value()"
        [attr.name]="name() || null"
        [attr.id]="id() || null"
        [attr.min]="min() || null"
        [attr.max]="max() || null"
        [attr.step]="seconds() ? 1 : null"
        [disabled]="disabled()"
        [attr.aria-label]="ariaLabel() || null"
        class="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
        (input)="onInput($event)"
      />
    }
  `,
})
export class BuiTimeField implements ControlValueAccessor {
  /** Selected time as `HH:mm`. Two-way bindable with `[(value)]`. */
  readonly value = model('');
  /** Native `name` attribute for the input. */
  readonly name = input('');
  /** Native `id` attribute for the input. */
  readonly id = input('');
  /** Earliest allowed time (`HH:mm`) in `input` mode. */
  readonly min = input('');
  /** Latest allowed time (`HH:mm`) in `input` mode. */
  readonly max = input('');
  /** Whether to include seconds in `input` mode. */
  readonly seconds = input(false);
  /** Whether the field is disabled. Two-way bindable with `[(disabled)]`. */
  readonly disabled = model(false);
  /** `select` renders hour + minute dropdowns instead of a native time input. */
  readonly mode = input<TimeFieldMode>('input');
  /** Minute step used in `select` mode. */
  readonly minuteStep = input(5);
  /** Accessible label for the field. */
  readonly ariaLabel = input('');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  /**
   * BCP 47 locale driving `select` mode's clock and digits. Defaults to the app's `LOCALE_ID`.
   * It has no effect in `input` mode — see the class docs.
   */
  readonly locale = input<string>();
  /** Force a clock instead of the locale's own — `h12` gives 1–12 with AM/PM, `h23` gives 0–23. */
  readonly hourCycle = input<TimeFieldHourCycle>();

  protected readonly resolvedLocale = buiLocale(this.locale);
  private readonly timeText = buiLabel('timeField', signal(undefined));
  private readonly hoursText = buiLabel('timeFieldHours', signal(undefined));
  private readonly minutesText = buiLabel('timeFieldMinutes', signal(undefined));
  protected readonly hoursAria = computed(
    () => `${this.ariaLabel() || this.timeText()} ${this.hoursText()}`,
  );
  protected readonly minutesAria = computed(
    () => `${this.ariaLabel() || this.timeText()} ${this.minutesText()}`,
  );

  /** The locale's clock unless the caller pinned one. */
  private readonly resolvedHourCycle = computed<TimeFieldHourCycle>(() => {
    const pinned = this.hourCycle();
    if (pinned !== undefined) {
      return pinned;
    }
    const resolved = new Intl.DateTimeFormat(this.resolvedLocale(), {
      hour: 'numeric',
    }).resolvedOptions().hourCycle;
    return resolved ?? 'h23';
  });
  private readonly usesDayPeriod = computed(
    () => this.resolvedHourCycle() === 'h11' || this.resolvedHourCycle() === 'h12',
  );
  /** Two digits in the locale's own numbering system — `padStart` would mix `0` with `٠`. */
  private readonly paddedNumber = computed(
    () =>
      new Intl.NumberFormat(this.resolvedLocale(), {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }),
  );

  private onChange: (value: string) => void = noop;
  protected onTouched: () => void = noop;
  protected readonly selectClass = SELECT_CLASS;
  protected readonly hourPart = computed(() =>
    (this.value().split(':', 1)[0] || '12').padStart(2, '0'),
  );
  protected readonly minutePart = computed(() =>
    (this.value().split(':', 2)[1] || '00').padStart(2, '0'),
  );
  protected readonly hours = computed<TimeOption[]>(() => {
    // The value stays 24-hour `HH` whatever the clock: it is the data, not the display.
    const hourCycle = this.resolvedHourCycle();
    const label = this.usesDayPeriod()
      ? this.dayPeriodLabel(hourCycle)
      : (hour: number): string => this.paddedNumber().format(hour);
    return Array.from({ length: 24 }, (_, hour) => ({
      value: String(hour).padStart(2, '0'),
      label: label(hour),
    }));
  });
  protected readonly minutes = computed<TimeOption[]>(() => {
    const step = Math.max(1, this.minuteStep());
    const format = this.paddedNumber();
    return Array.from({ length: Math.ceil(60 / step) }, (_, index) => {
      const minute = index * step;
      return { value: String(minute).padStart(2, '0'), label: format.format(minute) };
    });
  });
  protected readonly computedClass = computed(() => cn('inline-block', this.userClass()));

  /**
   * "1 PM" / "١ م". Built from parts rather than the plain format so the locale's own literal
   * (French renders `13 h`) never leaks into a cell that already has its own `:` separator.
   */
  private dayPeriodLabel(hourCycle: TimeFieldHourCycle): (hour: number) => string {
    const format = new Intl.DateTimeFormat(this.resolvedLocale(), { hour: 'numeric', hourCycle });
    return (hour: number): string =>
      format
        .formatToParts(timeOf(hour))
        .filter((part) => part.type !== 'literal')
        .map((part) => part.value)
        .join(' ');
  }

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
    this.onChange(this.value());
  }

  protected setHour(event: Event): void {
    this.value.set(`${(event.target as HTMLSelectElement).value}:${this.minutePart()}`);
    this.onChange(this.value());
  }

  protected setMinute(event: Event): void {
    this.value.set(`${this.hourPart()}:${(event.target as HTMLSelectElement).value}`);
    this.onChange(this.value());
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
