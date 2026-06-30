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
        '[role="img"] [style*="background"]',
      ),
    ];
    expect(fills[1].style.background).toContain('rgb(99, 102, 241)');
    expect(fills[0].style.background).toContain('color-mix');
  });

  it('stacks every series into one bar per data point when stacked', () => {
    @Component({
      imports: [BuiChart],
      template: `<bui-chart type="bar" [stacked]="true" [series]="series" label="Stacked" />`,
    })
    class StackHost {
      readonly series: ChartSeries[] = [
        { data: [10, 20], color: '#f00' },
        { data: [5, 5], color: '#0f0' },
      ];
    }
    const fixture = TestBed.createComponent(StackHost);
    fixture.detectChanges();
    const group = (fixture.nativeElement as HTMLElement).querySelector('[role="img"]')!;
    // 2 data points → 2 columns
    expect(group.children).toHaveLength(2);
    // first column stacks 2 segments
    const segs = group
      .querySelector('[style*="height"]')!
      .querySelectorAll('[style*="background"]');
    expect(segs).toHaveLength(2);
  });

  it('draws a dot marker per point when dots is set', () => {
    @Component({
      imports: [BuiChart],
      template: `<bui-chart type="line" [dots]="true" [series]="series" label="Dots" />`,
    })
    class DotsHost {
      readonly series: ChartSeries[] = [{ data: [5, 12, 8, 15], color: '#6366f1' }];
    }
    const fixture = TestBed.createComponent(DotsHost);
    fixture.detectChanges();
    const dots = (fixture.nativeElement as HTMLElement).querySelectorAll('.rounded-full');
    expect(dots).toHaveLength(4);
  });

  it('renders a line path for line charts', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.type = 'line';
    fixture.detectChanges();
    const path = (fixture.nativeElement as HTMLElement).querySelector('svg path');
    expect(path?.getAttribute('d')?.startsWith('M')).toBe(true);
  });

  it('renders grouped side-by-side bars (one per series per slot)', () => {
    @Component({
      imports: [BuiChart],
      template: `<bui-chart type="bar" [grouped]="true" [series]="series" label="Grouped" />`,
    })
    class GroupHost {
      readonly series: ChartSeries[] = [
        { data: [10, 20], color: '#f00' },
        { data: [5, 8], color: '#0f0' },
      ];
    }
    const fixture = TestBed.createComponent(GroupHost);
    fixture.detectChanges();
    const group = (fixture.nativeElement as HTMLElement).querySelector('[role="img"]')!;
    expect(group.children).toHaveLength(2); // 2 slots
    // each slot holds 2 side-by-side sub-bars
    expect(group.firstElementChild!.querySelectorAll('[style*="background"]')).toHaveLength(2);
  });

  it('applies per-bar colors from barColors', () => {
    @Component({
      imports: [BuiChart],
      template: `<bui-chart type="bar" [series]="series" [barColors]="colors" label="PerBar" />`,
    })
    class PerBarHost {
      readonly series: ChartSeries[] = [{ data: [3, 6, 9] }];
      readonly colors = ['#111', '#222', '#333'];
    }
    const fixture = TestBed.createComponent(PerBarHost);
    fixture.detectChanges();
    const fills = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
        '[role="img"] [style*="background"]',
      ),
    ];
    expect(fills.map((f) => f.style.background)).toEqual([
      'rgb(17, 17, 17)',
      'rgb(34, 34, 34)',
      'rgb(51, 51, 51)',
    ]);
  });

  it('renders a half-ring gauge filled to the value share of max', () => {
    @Component({
      imports: [BuiChart],
      template: `<bui-chart type="gauge" [series]="series" [max]="100" label="Gauge"
        ><b>75%</b></bui-chart
      >`,
    })
    class GaugeHost {
      readonly series: ChartSeries[] = [{ data: [75], color: '#09f' }];
    }
    const fixture = TestBed.createComponent(GaugeHost);
    fixture.detectChanges();
    const arcs = (fixture.nativeElement as HTMLElement).querySelectorAll('svg path');
    expect(arcs).toHaveLength(2); // track + value arc
    const dash = arcs[1].getAttribute('stroke-dasharray')!;
    const [filled, gap] = dash.split(' ').map(Number);
    expect(filled / gap).toBeCloseTo(0.75, 2);
    expect((fixture.nativeElement as HTMLElement).querySelector('b')?.textContent).toBe('75%');
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
