import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiTreeTable, type TreeTableColumn, type TreeTableRow } from './tree-table';

@Component({
  imports: [BuiTreeTable],
  template: `<bui-tree-table [columns]="columns" [rows]="rows" [copyable]="true" />`,
})
class TestHost {
  readonly tree = viewChild.required(BuiTreeTable);
  readonly columns: TreeTableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'size', label: 'Size' },
  ];
  readonly rows: TreeTableRow[] = [
    { name: 'src', size: '—', expanded: true, children: [{ name: 'app.ts', size: '2 KB' }] },
    { name: 'README.md', size: '1 KB' },
  ];
}

describe('BuiTreeTable', () => {
  it('shows expanded children and collapses on toggle', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('tbody tr')).toHaveLength(3);
    expect(root.textContent).toContain('app.ts');

    root.querySelector<HTMLButtonElement>('tbody button[aria-label="Toggle row"]')!.click();
    fixture.detectChanges();
    expect(root.querySelectorAll('tbody tr')).toHaveLength(2);
  });

  it('exports the full hierarchy as a markdown ASCII tree', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const tree = fixture.componentInstance.tree().toMarkdownTree();
    expect(tree).toBe(['src/', '└── app.ts', 'README.md'].join('\n'));
  });
});
