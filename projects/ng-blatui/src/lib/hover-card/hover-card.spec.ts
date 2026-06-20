import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { BuiHoverCard, BuiHoverCardContent } from './hover-card';

@Component({
  imports: [BuiHoverCard, BuiHoverCardContent],
  template: `
    <span [buiHoverCard]="tpl">hover me</span>
    <ng-template #tpl><div buiHoverCardContent>Profile preview</div></ng-template>
  `,
})
class TestHost {}

describe('BuiHoverCard (on Angular CDK)', () => {
  it('opens on hover after the delay and closes on leave', () => {
    vi.useFakeTimers();
    try {
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const trigger = (fixture.nativeElement as HTMLElement).querySelector('span')!;

      trigger.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(400);
      fixture.detectChanges();
      expect(document.querySelector('[data-slot="hover-card-content"]')?.textContent).toContain(
        'Profile preview',
      );

      trigger.dispatchEvent(new MouseEvent('mouseleave'));
      vi.advanceTimersByTime(100);
      fixture.detectChanges();
      expect(document.querySelector('[data-slot="hover-card-content"]')).toBeNull();

      fixture.destroy();
    } finally {
      vi.useRealTimers();
    }
  });
});
