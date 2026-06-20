import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiTree, type TreeItem } from './tree';

@Component({
  imports: [BuiTree],
  template: `<bui-tree [items]="items" />`,
})
class TestHost {
  readonly items: TreeItem[] = [
    { label: 'src', expanded: true, children: [{ label: 'app.ts' }, { label: 'main.ts' }] },
    { label: 'README.md' },
  ];
}

describe('BuiTree', () => {
  it('renders a tree and shows expanded children', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[role="tree"]')).not.toBeNull();
    expect(root.querySelectorAll('[role="treeitem"]')).toHaveLength(4);
    expect(root.textContent).toContain('app.ts');
  });
});
