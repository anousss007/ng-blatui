import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import {
  BuiBadge,
  BuiButton,
  BuiCard,
  BuiCheckbox,
  BuiInputGroup,
  BuiInputGroupAddon,
  BuiInputGroupInput,
  BuiTable,
  BuiTableBody,
  BuiTableCell,
  BuiTableContainer,
  BuiTableHead,
  BuiTableHeader,
  BuiTableRow,
} from 'ng-blatui';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

/** A single validation rule: returns an error message, or null when valid. */
type Validator = (value: string) => string | null;

/**
 * Reactive state for one validated field. Tracks the current value plus
 * whether the user has interacted (blurred) and whether the surrounding form
 * has been submitted — error display is gated on those flags so messages only
 * appear after the user has had a chance to type.
 */
class Field {
  readonly value = signal('');
  readonly touched = signal(false);
  readonly submitted = signal(false);

  constructor(private readonly validate: Validator) {}

  /** First error message for the current value, or null when valid. */
  readonly error = computed(() => this.validate(this.value()));
  readonly valid = computed(() => this.error() === null);

  /** Show errors once the field was blurred or the form was submitted. */
  readonly showState = computed(() => this.touched() || this.submitted());
  readonly showError = computed(() => this.showState() && !this.valid());
  readonly showSuccess = computed(
    () => this.showState() && this.valid() && this.value().trim() !== '',
  );

  onInput(value: string): void {
    this.value.set(value);
  }
  onBlur(): void {
    this.touched.set(true);
  }
  markSubmitted(): void {
    this.submitted.set(true);
  }
  reset(): void {
    this.value.set('');
    this.touched.set(false);
    this.submitted.set(false);
  }
}

// ----- Reusable validators -------------------------------------------------

const required: Validator = (v) => (v.trim() === '' ? 'This field is required' : null);
const numericOnly: Validator = (v) => {
  if (v.trim() === '') return 'This field is required';
  return /^\d+$/.test(v) ? null : 'Must contain numbers only';
};
const alphaOnly: Validator = (v) => {
  if (v.trim() === '') return 'This field is required';
  return /^[a-zA-Z]+$/.test(v) ? null : 'Only alphabetic characters are allowed';
};
const password: Validator = (v) => {
  if (v === '') return 'This field is required';
  return v.length >= 8 ? null : 'Password must be at least 8 characters';
};
const minMaxLength: Validator = (v) => {
  if (v.trim() === '') return 'This field is required';
  return v.length >= 5 && v.length <= 10 ? null : 'Must be between 5 and 10 characters';
};
const email: Validator = (v) => {
  if (v.trim() === '') return 'This field is required';
  // Demo-only email shape check; regex kept verbatim to preserve exact validation.
  // eslint-disable-next-line sonarjs/super-linear-regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Must be a valid email address';
};
const numberRange: Validator = (v) => {
  if (v.trim() === '') return 'This field is required';
  const n = Number(v);
  if (!/^-?\d+(\.\d+)?$/.test(v) || Number.isNaN(n)) return 'Must be a number';
  return n >= 10 && n <= 20 ? null : 'Number must be between 10 and 20';
};
const regexNumbers: Validator = (v) => {
  if (v.trim() === '') return 'This field is required';
  return /^(\d+)$/.test(v) ? null : 'Must match: ^([0-9]+)$';
};
const exactLength3: Validator = (v) => {
  if (v.trim() === '') return 'This field is required';
  return v.length === 3 ? null : 'Length must be exactly 3 characters';
};
const digits3: Validator = (v) => {
  if (v.trim() === '') return 'This field is required';
  return /^\d{3}$/.test(v) ? null : 'Must be exactly 3 digits';
};
const alphanumericSymbols: Validator = (v) => {
  if (v.trim() === '') return 'This field is required';
  return /^[a-zA-Z0-9_-]+$/.test(v) ? null : 'Only letters, numbers, dashes or underscores';
};
const url: Validator = (v) => {
  if (v.trim() === '') return 'This field is required';
  return /^https?:\/\/[^\s.]+\.[^\s]{2,}$/.test(v.trim()) ? null : 'Must be a valid url';
};

// Registration form validators
const fullName: Validator = (v) => {
  if (v.trim() === '') return 'Full name is required';
  return v.trim().length >= 2 ? null : 'Name is too short';
};
const age: Validator = (v) => {
  if (v.trim() === '') return 'Age is required';
  const n = Number(v);
  if (!/^\d+$/.test(v) || Number.isNaN(n)) return 'Age must be a number';
  return n >= 18 ? null : 'You must be at least 18 years old';
};
const dateOfBirth: Validator = (v) => {
  if (v.trim() === '') return 'Date of birth is required';
  return /^\d{4}-\d{2}-\d{2}$/.test(v.trim()) ? null : 'Use the format YYYY-MM-DD';
};

/**
 * AdminCN — pixel-faithful clone of the shadcn admin "Form Validation" page,
 * now wired with real client-side validation. Every input is backed by a
 * signal-driven {@link Field}; the Validation Types form validates on blur and
 * on submit, the Validation Modes Demo cards each validate in their named mode,
 * and the Registration form's switches, checkboxes and radios toggle via
 * signals. Light mode, Geist font, responsive to mobile.
 */
@Component({
  selector: 'app-tpl-admincn-form-validation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    Lucide,
    AdmincnShell,
    BuiBadge,
    BuiButton,
    BuiCard,
    BuiCheckbox,
    BuiInputGroup,
    BuiInputGroupAddon,
    BuiInputGroupInput,
    BuiTable,
    BuiTableBody,
    BuiTableCell,
    BuiTableContainer,
    BuiTableHead,
    BuiTableHeader,
    BuiTableRow,
  ],
  templateUrl: './admincn-form-validation.html',
})
export class AdmincnFormValidation {
  // ----- Validation Types form -----
  readonly requiredField = new Field(required);
  readonly numeric = new Field(numericOnly);
  readonly alphabetic = new Field(alphaOnly);
  readonly password = new Field(password);
  readonly minMax = new Field(minMaxLength);
  readonly email = new Field(email);
  readonly numberRange = new Field(numberRange);
  readonly regex = new Field(regexNumbers);
  readonly exactLength = new Field(exactLength3);
  readonly digits = new Field(digits3);
  readonly alphanumeric = new Field(alphanumericSymbols);
  readonly url = new Field(url);

  readonly showPassword = signal(false);

  private readonly typeFields = [
    this.requiredField,
    this.numeric,
    this.alphabetic,
    this.password,
    this.minMax,
    this.email,
    this.numberRange,
    this.regex,
    this.exactLength,
    this.digits,
    this.alphanumeric,
    this.url,
  ];

  readonly typesSubmitted = signal(false);

  submitTypes(): void {
    for (const f of this.typeFields) f.markSubmitted();
    this.typesSubmitted.set(this.typeFields.every((f) => f.valid()));
  }
  resetTypes(): void {
    for (const f of this.typeFields) f.reset();
    this.typesSubmitted.set(false);
    this.showPassword.set(false);
  }

  // ----- Validation Modes Demo -----
  // Each demo field requires a minimum length of 3 chars; the difference is
  // *when* the error becomes visible.
  private readonly demoValidate: Validator = (v) => {
    if (v.trim() === '') return 'This field is required';
    return v.length >= 3 ? null : 'Must be at least 3 characters';
  };

  readonly onChange = new Field(this.demoValidate);
  readonly onBlur = new Field(this.demoValidate);
  readonly onSubmit = new Field(this.demoValidate);
  readonly onTouched = new Field(this.demoValidate);

  // onChange: error visible as soon as there is any input.
  readonly onChangeTyped = signal(false);
  readonly onChangeShowError = computed(() => this.onChangeTyped() && !this.onChange.valid());
  readonly onChangeShowSuccess = computed(
    () => this.onChangeTyped() && this.onChange.valid() && this.onChange.value() !== '',
  );

  // onBlur: error only after the field loses focus.
  readonly onBlurShowError = computed(() => this.onBlur.touched() && !this.onBlur.valid());
  readonly onBlurShowSuccess = computed(
    () => this.onBlur.touched() && this.onBlur.valid() && this.onBlur.value() !== '',
  );

  // onSubmit: error only after the card's Submit button is clicked.
  readonly onSubmitClicked = signal(false);
  readonly onSubmitShowError = computed(() => this.onSubmitClicked() && !this.onSubmit.valid());
  readonly onSubmitShowSuccess = computed(
    () => this.onSubmitClicked() && this.onSubmit.valid() && this.onSubmit.value() !== '',
  );

  // onTouched: nothing until first blur, then live on every keystroke.
  readonly onTouchedShowError = computed(() => this.onTouched.touched() && !this.onTouched.valid());
  readonly onTouchedShowSuccess = computed(
    () => this.onTouched.touched() && this.onTouched.valid() && this.onTouched.value() !== '',
  );

  onChangeInput(v: string): void {
    this.onChange.onInput(v);
    this.onChangeTyped.set(true);
  }
  submitOnChange(): void {
    this.onChangeTyped.set(true);
  }
  resetOnChange(): void {
    this.onChange.reset();
    this.onChangeTyped.set(false);
  }

  submitOnBlur(): void {
    this.onBlur.onBlur();
  }
  resetOnBlur(): void {
    this.onBlur.reset();
  }

  submitOnSubmit(): void {
    this.onSubmitClicked.set(true);
  }
  resetOnSubmit(): void {
    this.onSubmit.reset();
    this.onSubmitClicked.set(false);
  }

  submitOnTouched(): void {
    this.onTouched.onBlur();
  }
  resetOnTouched(): void {
    this.onTouched.reset();
  }

  // ----- Registration form -----
  readonly regName = new Field(fullName);
  readonly regEmail = new Field(email);
  readonly regPassword = new Field(password);
  readonly regDob = new Field(dateOfBirth);
  readonly regAge = new Field(age);

  readonly showRegPassword = signal(false);

  // Pre-seed the two fields the static design showed as success/error so the
  // page still demonstrates both states on first paint.
  constructor() {
    this.regName.value.set('John Doe');
    this.regName.touched.set(true);
    this.regEmail.touched.set(true); // empty -> shows the error treatment
  }

  private readonly regFields = [
    this.regName,
    this.regEmail,
    this.regPassword,
    this.regDob,
    this.regAge,
  ];

  readonly registered = signal(false);

  // Switches
  readonly emailNotifications = signal(true);
  readonly marketingEmails = signal(false);
  readonly twoFactor = signal(false);

  toggleEmailNotifications(): void {
    this.emailNotifications.update((v) => !v);
  }
  toggleMarketing(): void {
    this.marketingEmails.update((v) => !v);
  }
  toggleTwoFactor(): void {
    this.twoFactor.update((v) => !v);
  }

  // Newsletter checkboxes
  readonly productUpdates = signal(false);
  readonly industryNews = signal(false);
  readonly tipsTricks = signal(false);

  toggleProductUpdates(): void {
    this.productUpdates.update((v) => !v);
  }
  toggleIndustryNews(): void {
    this.industryNews.update((v) => !v);
  }
  toggleTipsTricks(): void {
    this.tipsTricks.update((v) => !v);
  }

  // Account type radio
  readonly accountType = signal<'personal' | 'business' | 'enterprise'>('personal');
  selectAccountType(type: 'personal' | 'business' | 'enterprise'): void {
    this.accountType.set(type);
  }

  // Bio (for the character counter)
  readonly bio = signal('');
  readonly bioCount = computed(() => this.bio().length);
  onBioInput(v: string): void {
    this.bio.set(v.slice(0, 500));
  }

  register(): void {
    for (const f of this.regFields) f.markSubmitted();
    this.registered.set(this.regFields.every((f) => f.valid()));
  }
  resetRegistration(): void {
    for (const f of this.regFields) f.reset();
    this.registered.set(false);
    this.showRegPassword.set(false);
    this.bio.set('');
    this.emailNotifications.set(true);
    this.marketingEmails.set(false);
    this.twoFactor.set(false);
    this.productUpdates.set(false);
    this.industryNews.set(false);
    this.tipsTricks.set(false);
    this.accountType.set('personal');
  }

  // ----- Shared style helpers -----
  readonly green = '#16a34a';
  readonly destructive = 'var(--destructive)';

  /** Inline border colour for an input-group wrapper based on a Field's state. */
  borderColor(hasError: boolean, hasSuccess: boolean): string | null {
    if (hasError) return this.destructive;
    if (hasSuccess) return this.green;
    return null;
  }
}
