import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiDataTable, type DataTableColumn } from './data-table';

@Component({
  imports: [BuiDataTable],
  template: `<bui-data-table [columns]="columns" [rows]="rows" [pageSize]="5" />`,
})
class TestHost {
  readonly columns: DataTableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
  ];
  readonly rows = Array.from({ length: 8 }, (_, index) => ({
    name: `Person ${index}`,
    role: 'Member',
  }));
}

describe('BuiDataTable', () => {
  it('paginates and searches rows', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('tbody tr')).toHaveLength(5); // page size

    const search = root.querySelector<HTMLInputElement>('input[type="search"]')!;
    search.value = 'Person 3';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(root.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(root.textContent).toContain('Person 3');
  });
});
