import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiGantt, type GanttTask } from './gantt';

@Component({
  imports: [BuiGantt],
  template: `<bui-gantt [tasks]="tasks" />`,
})
class TestHost {
  readonly tasks: GanttTask[] = [
    { name: 'Design', start: '2026-01-01', end: '2026-01-05', progress: 50 },
    { name: 'Build', start: '2026-01-05', end: '2026-01-12' },
  ];
}

describe('BuiGantt', () => {
  it('renders a positioned bar per task', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const bars = root.querySelectorAll<HTMLElement>('[style*="width"]');
    expect(bars.length).toBeGreaterThanOrEqual(2);
    expect(root.textContent).toContain('Design');
    expect(bars[0].style.left).toBe('0%');
  });
});
