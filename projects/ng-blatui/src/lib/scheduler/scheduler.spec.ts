import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiScheduler, type SchedulerEvent } from './scheduler';

@Component({
  imports: [BuiScheduler],
  template: `<bui-scheduler [events]="events" />`,
})
class TestHost {
  readonly events: SchedulerEvent[] = [
    { title: 'Standup', day: 0, start: '09:00', end: '10:00' },
    { title: 'Lunch', day: 2, start: '12:00', end: '13:00', color: 'bg-emerald-600' },
  ];
}

describe('BuiScheduler', () => {
  it('renders the week header and positions events', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Mon');
    expect(root.textContent).toContain('Sun');
    expect(root.textContent).toContain('Standup');
    const event = root.querySelector<HTMLElement>('[style*="top"]')!;
    expect(event.style.top).not.toBe('');
  });
});
