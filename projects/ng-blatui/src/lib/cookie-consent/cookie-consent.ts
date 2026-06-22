import { afterNextRender, Component, computed, input, output, signal } from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { type ClassValue, cn } from '../utils/cn';

/** A GDPR cookie banner. Persists the choice in localStorage (skipped in `demo` mode). */
@Component({
  selector: 'bui-cookie-consent',
  host: {
    'data-slot': 'cookie-consent',
    role: 'region',
    '[attr.aria-label]': 'ariaLabelText()',
    '[class]': 'computedClass()',
    '[hidden]': '!visible()',
  },
  template: `
    <p class="text-sm text-muted-foreground">{{ message() }}</p>
    <div class="flex shrink-0 gap-2">
      <button
        type="button"
        class="inline-flex h-8 items-center rounded-md border border-input px-3 text-sm font-medium hover:bg-accent"
        (click)="decide(false)"
      >
        Decline
      </button>
      <button
        type="button"
        class="inline-flex h-8 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
        (click)="decide(true)"
      >
        Accept
      </button>
    </div>
  `,
})
export class BuiCookieConsent {
  readonly message = input('We use cookies to enhance your experience.');
  readonly demo = input(false);
  readonly storageKey = input('bui-cookie-consent');
  readonly decided = output<boolean>();
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  readonly ariaLabel = input<string>();

  protected readonly ariaLabelText = buiLabel('cookieConsent', this.ariaLabel);

  protected readonly visible = signal(false);
  protected readonly computedClass = computed(() =>
    cn(
      'flex flex-col items-start gap-3 rounded-lg border bg-card p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between',
      this.userClass(),
    ),
  );

  constructor() {
    afterNextRender(() => {
      if (this.demo()) {
        this.visible.set(true);
        return;
      }
      this.visible.set(globalThis.localStorage.getItem(this.storageKey()) === null);
    });
  }

  protected decide(isAccepted: boolean): void {
    if (!this.demo()) {
      globalThis.localStorage.setItem(this.storageKey(), isAccepted ? 'accepted' : 'declined');
    }
    this.visible.set(false);
    this.decided.emit(isAccepted);
  }
}
