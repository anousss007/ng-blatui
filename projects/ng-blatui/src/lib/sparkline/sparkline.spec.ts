import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiSparkline } from './sparkline';

@Component({
  imports: [BuiSparkline],
  template: `<bui-sparkline [data]="[1, 5, 2, 8, 3]" ariaLabel="Sales" />`,
})
class TestHost {}

describe('BuiSparkline', () => {
  it('renders a line path from the data', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const svg = (fixture.nativeElement as HTMLElement).querySelector('svg')!;
    expect(svg.getAttribute('aria-label')).toBe('Sales');
    const line = svg.querySelector('path.stroke-primary');
    expect(line?.getAttribute('d')?.startsWith('M')).toBe(true);
  });
});
