import { Component, computed, input, model } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export interface PhoneCountry {
  code: string;
  name: string;
  dial: string;
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
      aria-label="Country code"
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
      aria-label="Phone number"
      class="h-9 w-full min-w-0 rounded-md rounded-l-none border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      (input)="onNumber($event)"
    />
  `,
})
export class BuiPhoneInput {
  readonly value = model('');
  readonly country = model('US');
  readonly name = input('');
  readonly id = input('');
  readonly placeholder = input('Phone number');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

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
