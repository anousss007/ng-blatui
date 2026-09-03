import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiDataTable, BuiDataTableToolbar, type DataTableColumn } from './data-table';

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

@Component({
  imports: [BuiDataTable, BuiDataTableToolbar],
  template: `
    <bui-data-table
      [columns]="columns"
      [rows]="rows"
      [searchable]="false"
      [selectable]="false"
      [toggleableColumns]="true"
      [perPageOptions]="[2, 5]"
      [pageSize]="5"
    >
      <button buiDataTableToolbar type="button">Export</button>
    </bui-data-table>
  `,
})
class ToolbarHost {
  readonly columns: DataTableColumn[] = [
    { key: 'name', label: 'Name', hideable: false },
    { key: 'role', label: 'Role' },
  ];
  readonly rows = Array.from({ length: 8 }, (_, index) => ({
    name: `Person ${index}`,
    role: 'Member',
  }));
}

@Component({
  imports: [BuiDataTable],
  template: `<bui-data-table [columns]="columns" [rows]="[]" [searchable]="false" />`,
})
class BareHost {
  readonly columns: DataTableColumn[] = [{ key: 'name', label: 'Name' }];
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

  it('leaves the toolbar row out when nothing wants to be in it', () => {
    const fixture = TestBed.createComponent(BareHost);
    fixture.detectChanges();
    // jsdom carries no Tailwind, so the class is the assertion here; the e2e layout suite is
    // where the row's computed display is checked in a real browser.
    const toolbar = (fixture.nativeElement as HTMLElement).querySelector('div')!;
    expect(toolbar.className).toBe('hidden');
  });

  it('shows the toolbar for projected content and the built-in controls', () => {
    const fixture = TestBed.createComponent(ToolbarHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    const toolbar = root.querySelector<HTMLElement>(
      '[data-slot="data-table-toolbar"]',
    )!.parentElement!;
    expect(toolbar.className).not.toContain('hidden');
    expect(toolbar.textContent).toContain('Export');
    expect(toolbar.querySelector('select')).not.toBeNull();
  });

  it('re-pages the rows when the page size changes', () => {
    const fixture = TestBed.createComponent(ToolbarHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('tbody tr')).toHaveLength(5);

    const perPage = root.querySelector<HTMLSelectElement>('select')!;
    perPage.value = '2';
    perPage.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(root.querySelectorAll('tbody tr')).toHaveLength(2);
  });

  it('stops rendering a column the menu hides, and keeps a non-hideable one', () => {
    const fixture = TestBed.createComponent(ToolbarHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('thead th')).toHaveLength(2);

    const trigger = root.querySelector<HTMLButtonElement>('[aria-haspopup="true"]')!;
    trigger.click();
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    // Only the hideable column is on offer: `hideable: false` keeps Name out of the menu.
    const menu = document.querySelector<HTMLElement>('[role="group"]')!;
    const boxes = menu.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    expect(boxes).toHaveLength(1);
    expect(menu.textContent).toContain('Role');

    boxes[0].click();
    fixture.detectChanges();
    expect(root.querySelectorAll('thead th')).toHaveLength(1);
    // The cell is not rendered, not merely hidden.
    expect(root.querySelector('tbody tr')?.textContent).not.toContain('Member');

    fixture.destroy();
  });
});
