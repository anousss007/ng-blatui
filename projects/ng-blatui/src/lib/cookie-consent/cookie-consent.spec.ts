import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiCookieConsent } from './cookie-consent';

@Component({
  imports: [BuiCookieConsent],
  template: `<bui-cookie-consent [demo]="true" (decided)="choice = $event" />`,
})
class TestHost {
  choice: boolean | null = null;
}

describe('BuiCookieConsent', () => {
  it('shows in demo mode and reports the choice', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const banner = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="cookie-consent"]',
    )!;
    expect(banner.hasAttribute('hidden')).toBe(false);

    banner.querySelectorAll<HTMLButtonElement>('button')[1].click(); // Accept
    fixture.detectChanges();
    expect(fixture.componentInstance.choice).toBe(true);
    expect(banner.hasAttribute('hidden')).toBe(true);
  });
});
