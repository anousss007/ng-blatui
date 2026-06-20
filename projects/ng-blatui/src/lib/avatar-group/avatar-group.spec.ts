import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiAvatarGroup, type GroupAvatar } from './avatar-group';

@Component({
  imports: [BuiAvatarGroup],
  template: `<bui-avatar-group [avatars]="people" [max]="2" />`,
})
class TestHost {
  readonly people: GroupAvatar[] = [
    { name: 'Ada Lovelace' },
    { name: 'Alan Turing' },
    { name: 'Grace Hopper' },
  ];
}

describe('BuiAvatarGroup', () => {
  it('shows up to max avatars plus an overflow counter', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const group = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="avatar-group"]',
    )!;
    expect(group.getAttribute('role')).toBe('list');

    const items = group.querySelectorAll('[role="listitem"]');
    expect(items).toHaveLength(3); // 2 shown + 1 overflow

    expect(group.textContent).toContain('AL'); // Ada Lovelace initials
    const more = group.querySelector('[aria-label="and 1 more"]');
    expect(more?.textContent).toContain('+1');
  });
});
