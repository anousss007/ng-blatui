import { Component, computed, input } from '@angular/core';

import {
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

export const BLOCKS = ['login-01', 'login-02', 'login-03'];

const META: Record<string, { title: string; description: string }> = {
  'login-01': { title: 'Login 01', description: 'A centered card login form.' },
  'login-02': { title: 'Login 02', description: 'A split-screen login with a side panel.' },
  'login-03': { title: 'Login 03', description: 'A login card with social providers.' },
};

/** Pre-composed BlatUI blocks (full sections built from ng-blatui components). */
@Component({
  selector: 'app-blocks',
  imports: [
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
