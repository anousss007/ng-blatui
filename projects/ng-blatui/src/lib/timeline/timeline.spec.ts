import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiTimeline } from './timeline';
import { BuiTimelineItem } from './timeline-item';

@Component({
  imports: [BuiTimeline, BuiTimelineItem],
  template: `
    <ol buiTimeline>
      <li buiTimelineItem time="Today" title="Created" [active]="true">Body text</li>
    </ol>
  `,
})
class TestHost {}

describe('BuiTimeline', () => {
  it('renders items with a dot, time and title', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[data-slot="timeline"]')).not.toBeNull();
    const item = element.querySelector('[data-slot="timeline-item"]')!;
    expect(item.querySelector('[data-slot="timeline-title"]')?.textContent).toContain('Created');
    expect(item.querySelector('[data-slot="timeline-time"]')?.textContent).toContain('Today');
    expect(item.textContent).toContain('Body text');
  });
});
