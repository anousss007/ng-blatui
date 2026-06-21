import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiOrgChart, type OrgNode } from './org-chart';
import { BuiOrgChartNode } from './org-chart-node';

@Component({
  imports: [BuiOrgChart, BuiOrgChartNode],
  template: `<bui-org-chart [node]="root" />`,
})
class TestHost {
  readonly root: OrgNode = {
    name: 'Ada Lovelace',
    title: 'CEO',
    children: [{ name: 'Grace Hopper' }, { name: 'Alan Turing' }],
  };
}

describe('BuiOrgChart', () => {
  it('renders the root and its children as nodes', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('[data-slot="org-chart-node"]')).toHaveLength(3);
    expect(element.textContent).toContain('Ada Lovelace');
    expect(element.textContent).toContain('Grace Hopper');
  });
});
