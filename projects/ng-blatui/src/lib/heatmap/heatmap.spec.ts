import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiHeatmap } from './heatmap';

@Component({
  imports: [BuiHeatmap],
  template: `<bui-heatmap [data]="data" />`,
})
class TestHost {
  readonly data = [0, 1, 2, 3, 4, 5];
}

describe('BuiHeatmap', () => {
  it('renders one cell per data point', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector('[data-slot="heatmap"]')!;
    expect(element.querySelectorAll('span')).toHaveLength(6);
    expect(element.querySelector('span')?.className).toContain('bg-muted'); // first cell is 0
  });
});
