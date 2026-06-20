import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  BuiPagination,
  BuiPaginationContent,
  BuiPaginationEllipsis,
  BuiPaginationItem,
  BuiPaginationLink,
} from './pagination';

@Component({
  imports: [
    BuiPagination,
    BuiPaginationContent,
    BuiPaginationItem,
    BuiPaginationLink,
    BuiPaginationEllipsis,
  ],
  template: `
    <nav buiPagination>
      <ul buiPaginationContent>
        <li buiPaginationItem><a buiPaginationLink href="#">1</a></li>
        <li buiPaginationItem><a buiPaginationLink [active]="true" href="#">2</a></li>
        <li buiPaginationItem><bui-pagination-ellipsis /></li>
      </ul>
    </nav>
  `,
})
class TestHost {}

describe('Pagination', () => {
  it('marks the active page and exposes an accessible nav', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('nav')?.getAttribute('aria-label')).toBe('pagination');
    const active = element.querySelector('[data-active="true"]');
    expect(active?.getAttribute('aria-current')).toBe('page');
    const ellipsis = element.querySelector('[data-slot="pagination-ellipsis"]');
    expect(ellipsis?.getAttribute('aria-hidden')).toBe('true');
    expect(ellipsis?.querySelector('.sr-only')?.textContent).toContain('More pages');
  });
});
