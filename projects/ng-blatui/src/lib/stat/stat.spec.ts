import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiStat } from './stat';

@Component({
  imports: [BuiStat],
  template: `<bui-stat label="Revenue" value="$12,000" change="+12%" caption="vs last month" />`,
})
class TestHost {}

describe('BuiStat', () => {
  it('renders the KPI and colours the change by inferred trend', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Revenue');
    expect(element.textContent).toContain('$12,000');
    const change = element.querySelector('[data-slot="stat"] span span')!;
    expect(change.textContent).toContain('+12%');
    expect(change.className).toContain('text-emerald-600');
  });
});
