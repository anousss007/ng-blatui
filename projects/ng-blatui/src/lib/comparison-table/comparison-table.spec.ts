import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiComparisonTable, type ComparisonRow } from './comparison-table';

@Component({
  imports: [BuiComparisonTable],
  template: `<bui-comparison-table [tiers]="tiers" [rows]="rows" [highlight]="1" />`,
})
class TestHost {
  readonly tiers = ['Free', 'Pro'];
  readonly rows: ComparisonRow[] = [{ feature: 'Projects', values: ['3', true] }];
}

describe('BuiComparisonTable', () => {
  it('renders tiers, rows, highlight and boolean cells', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const headers = element.querySelectorAll('thead th');
    expect(headers[2].textContent).toContain('Pro');
    expect(headers[2].className).toContain('text-primary'); // highlighted column
    expect(element.querySelector('tbody th')?.textContent).toContain('Projects');
    expect(element.querySelector('tbody svg[aria-label="Included"]')).not.toBeNull();
  });
});
