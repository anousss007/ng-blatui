import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiNotificationCenter, type NotificationItem } from './notification-center';

@Component({
  imports: [BuiNotificationCenter],
  template: `<bui-notification-center [notifications]="items" [(open)]="open" />`,
})
class TestHost {
  open = true;
  readonly items: NotificationItem[] = [
    { title: 'New comment', read: false },
    { title: 'Build passed', read: true },
  ];
}

/** The feed is portalled into the CDK overlay, so it is not under the fixture. */
function panel(): HTMLElement | null {
  return document.querySelector('.cdk-overlay-container [role="region"]');
}

describe('BuiNotificationCenter', () => {
  it('shows the unread count and marks all read', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const bell = (fixture.nativeElement as HTMLElement).querySelector(
      'button[aria-label="Notifications"]',
    )!;
    expect(bell.textContent).toContain('1');

    panel()!.querySelector('button')!.click(); // "Mark all read"
    fixture.detectChanges();
    expect(bell.querySelector('span')).toBeNull(); // unread badge removed
  });

  it('closes on an outside click but stays open on an inside click', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    expect(panel()).not.toBeNull();

    // A click inside the panel must not dismiss it.
    panel()!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(panel()).not.toBeNull();

    // A click outside the bell + panel closes it.
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(panel()).toBeNull();
  });
});
