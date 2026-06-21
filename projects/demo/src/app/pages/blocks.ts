import { Component, computed, input } from '@angular/core';

import {
  BuiBadge,
  BuiButton,
  BuiCard,
  BuiCardContent,
  BuiCardDescription,
  BuiCardHeader,
  BuiCardTitle,
  BuiField,
  BuiFieldDescription,
  BuiFieldLabel,
  BuiInput,
  BuiSeparator,
} from 'ng-blatui';

export const BLOCKS = [
  'login-01',
  'login-02',
  'login-03',
  'login-04',
  'login-05',
  'signup-01',
  'signup-02',
  'signup-03',
  'marketing-01',
  'pricing-01',
];

const META: Record<string, { title: string; description: string }> = {
  'login-01': { title: 'Login 01', description: 'A centered card login form.' },
  'login-02': { title: 'Login 02', description: 'A split-screen login with a side panel.' },
  'login-03': { title: 'Login 03', description: 'A login card with social providers.' },
  'login-04': { title: 'Login 04', description: 'A two-column card with form and image.' },
  'login-05': { title: 'Login 05', description: 'An email + social sign-in stack.' },
  'signup-01': { title: 'Sign up 01', description: 'A create-account card form.' },
  'signup-02': { title: 'Sign up 02', description: 'A split-screen create-account form.' },
  'signup-03': { title: 'Sign up 03', description: 'A centered create-account card.' },
  'marketing-01': { title: 'Marketing 01', description: 'A landing hero with logos.' },
  'pricing-01': { title: 'Pricing 01', description: 'A three-tier pricing section.' },
};

/** Pre-composed BlatUI blocks (full sections built from ng-blatui components). */
@Component({
  selector: 'app-blocks',
  imports: [
    BuiBadge,
    BuiButton,
    BuiCard,
    BuiCardContent,
    BuiCardDescription,
    BuiCardHeader,
    BuiCardTitle,
    BuiField,
    BuiFieldDescription,
    BuiFieldLabel,
    BuiInput,
    BuiSeparator,
  ],
  templateUrl: './blocks.html',
})
export class BlocksPage {
  readonly slug = input('');
  protected readonly title = computed(() =>
    Object.hasOwn(META, this.slug()) ? META[this.slug()].title : this.slug(),
  );
  protected readonly description = computed(() =>
    Object.hasOwn(META, this.slug()) ? META[this.slug()].description : '',
  );
}
