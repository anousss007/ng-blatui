import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiChart, type ChartSeries } from './chart';

@Component({
  imports: [BuiChart],
  template: `<bui-chart [type]="type" [series]="series" label="Sales" />`,
})
class TestHost {
  type: 'line' | 'bar' | 'area' = 'bar';
  readonly series: ChartSeries[] = [{ data: [5, 12, 8, 15] }];
}

describe('BuiChart', () => {
  it('renders one bar per data point', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const svg = (fixture.nativeElement as HTMLElement).querySelector('svg')!;
    expect(svg.getAttribute('aria-label')).toBe('Sales');
    expect(svg.querySelectorAll('rect')).toHaveLength(4);
  });

  it('renders a line path for line charts', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.type = 'line';
    fixture.detectChanges();
    const path = (fixture.nativeElement as HTMLElement).querySelector('svg path');
    expect(path?.getAttribute('d')?.startsWith('M')).toBe(true);
  });
});
