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

describe('BuiNotificationCenter', () => {
  it('shows the unread count and marks all read', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const bell = root.querySelector('button[aria-label="Notifications"]')!;
    expect(bell.textContent).toContain('1');

    root.querySelectorAll<HTMLButtonElement>('button')[1].click(); // "Mark all read"
    fixture.detectChanges();
    expect(bell.querySelector('span')).toBeNull(); // unread badge removed
  });
});
