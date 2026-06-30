import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiChart, type ChartSeries } from './chart';

@Component({
  imports: [BuiChart],
  template: `<bui-chart
    [type]="type"
    [series]="series"
    [barLabels]="barLabels"
    [activeIndex]="activeIndex"
    label="Sales"
  />`,
})
class TestHost {
  type: 'line' | 'bar' | 'area' | 'donut' = 'bar';
  barLabels: string[] = [];
  activeIndex: number | null = null;
  readonly series: ChartSeries[] = [{ data: [5, 12, 8, 15], color: '#6366f1' }];
}

describe('BuiChart', () => {
  it('renders one bar column per data point', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const group = (fixture.nativeElement as HTMLElement).querySelector('[role="img"]')!;
    expect(group.getAttribute('aria-label')).toBe('Sales');
    expect(group.children).toHaveLength(4);
  });

  it('shows the supplied value label above each bar', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.barLabels = ['5K', '12K', '8K', '15K'];
    fixture.detectChanges();
    const labels = (fixture.nativeElement as HTMLElement).querySelectorAll('[role="img"] span');
    expect([...labels].map((s) => s.textContent)).toEqual(['5K', '12K', '8K', '15K']);
  });

  it('tints inactive bars when activeIndex is set', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.activeIndex = 1;
    fixture.detectChanges();
    const fills = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
        '[role="img"] [style*="height"]',
      ),
    ];
    expect(fills[1].style.background).toContain('rgb(99, 102, 241)');
    expect(fills[0].style.background).toContain('color-mix');
  });

  it('renders a line path for line charts', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.type = 'line';
    fixture.detectChanges();
    const path = (fixture.nativeElement as HTMLElement).querySelector('svg path');
    expect(path?.getAttribute('d')?.startsWith('M')).toBe(true);
  });

  it('renders donut segments scaled against max', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.type = 'donut';
    fixture.detectChanges();
    const circles = (fixture.nativeElement as HTMLElement).querySelectorAll('svg circle');
    // one track circle + one segment per data point
    expect(circles).toHaveLength(5);
  });
});
