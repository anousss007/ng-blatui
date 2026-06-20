import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  BuiTable,
  BuiTableBody,
  BuiTableCaption,
  BuiTableCell,
  BuiTableContainer,
  BuiTableHead,
  BuiTableHeader,
  BuiTableRow,
} from './table';

@Component({
  imports: [
    BuiTableContainer,
    BuiTable,
    BuiTableHeader,
    BuiTableBody,
    BuiTableRow,
    BuiTableHead,
    BuiTableCell,
    BuiTableCaption,
  ],
  template: `
    <div buiTableContainer variant="card">
      <table buiTable>
        <caption buiTableCaption>
          Users
        </caption>
        <thead buiTableHeader>
          <tr buiTableRow>
            <th buiTableHead>Name</th>
          </tr>
        </thead>
        <tbody buiTableBody>
          <tr buiTableRow>
            <td buiTableCell>Ada</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
class TestHost {}

describe('Table', () => {
  it('renders a semantic table with slots and a col-scoped head', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(
      element.querySelector('[data-slot="table-container"]')?.getAttribute('data-variant'),
    ).toBe('card');
    expect(element.querySelector('table[data-slot="table"]')).not.toBeNull();
    expect(element.querySelector('th[data-slot="table-head"]')?.getAttribute('scope')).toBe('col');
    expect(element.querySelector('caption[data-slot="table-caption"]')?.textContent).toContain(
      'Users',
    );
  });
});
