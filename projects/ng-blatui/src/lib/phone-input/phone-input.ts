import { Component, computed, input, model } from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { type ClassValue, cn } from '../utils/cn';

export interface PhoneCountry {
  /** ISO 3166-1 alpha-2 country code, used as the option value. */
  code: string;
  /** Human-readable country name. */
  name: string;
  /** International dialing prefix, including the leading plus. */
  dial: string;
  /** Flag emoji shown beside the dial code. */
  flag: string;
}

const COUNTRIES: PhoneCountry[] = [
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪' },
  { code: 'ES', name: 'Spain', dial: '+34', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', dial: '+39', flag: '🇮🇹' },
  { code: 'NL', name: 'Netherlands', dial: '+31', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', dial: '+32', flag: '🇧🇪' },
];

/** A phone number field with a country-code selector. */
@Component({
  selector: 'bui-phone-input',
  host: { 'data-slot': 'phone-input', '[class]': 'computedClass()' },
  template: `
    <select
      [value]="country()"
      class="h-9 rounded-md rounded-r-none border border-r-0 border-input bg-background ps-2 pe-1 text-sm outline-none focus-visible:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      [attr.aria-label]="countryText()"
      (change)="onCountry($event)"
    >
      @for (option of countries; track option.code) {
        <option [value]="option.code">{{ option.flag }} {{ option.dial }}</option>
      }
    </select>
    <input
      type="tel"
      [value]="value()"
      [placeholder]="placeholder()"
      [attr.name]="name() || null"
      [attr.id]="id() || null"
      [attr.aria-label]="numberText()"
      class="h-9 w-full min-w-0 rounded-md rounded-l-none border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      (input)="onNumber($event)"
    />
  `,
})
export class BuiPhoneInput {
  /** Entered phone number. Two-way bindable with `[(value)]`. */
  readonly value = model('');
  /** Selected country code. Two-way bindable with `[(country)]`. */
  readonly country = model('US');
  /** Name attribute applied to the number input for form submission. */
  readonly name = input('');
  /** Id attribute applied to the number input. */
  readonly id = input('');
  /** Placeholder text for the number input. */
  readonly placeholder = input('Phone number');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  /** Accessible label override for the country selector. */
  readonly countryLabel = input<string>();
  /** Accessible label override for the number input. */
  readonly numberLabel = input<string>();

  protected readonly countryText = buiLabel('phoneInputCountry', this.countryLabel);
  protected readonly numberText = buiLabel('phoneInputNumber', this.numberLabel);

  protected readonly countries = COUNTRIES;
  protected readonly computedClass = computed(() =>
    cn('flex w-full items-stretch', this.userClass()),
  );

  protected onCountry(event: Event): void {
    this.country.set((event.target as HTMLSelectElement).value);
  }

  protected onNumber(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
