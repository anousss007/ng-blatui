import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  BuiBreadcrumb,
  BuiBreadcrumbEllipsis,
  BuiBreadcrumbItem,
  BuiBreadcrumbLink,
  BuiBreadcrumbList,
  BuiBreadcrumbPage,
  BuiBreadcrumbSeparator,
} from './breadcrumb';

@Component({
  imports: [
    BuiBreadcrumb,
    BuiBreadcrumbList,
    BuiBreadcrumbItem,
    BuiBreadcrumbLink,
    BuiBreadcrumbPage,
    BuiBreadcrumbSeparator,
    BuiBreadcrumbEllipsis,
  ],
  template: `
    <nav buiBreadcrumb>
      <ol buiBreadcrumbList>
        <li buiBreadcrumbItem><a buiBreadcrumbLink href="/">Home</a></li>
        <li buiBreadcrumbSeparator></li>
        <li buiBreadcrumbItem><span buiBreadcrumbPage>Current</span></li>
        <li buiBreadcrumbEllipsis></li>
      </ol>
    </nav>
  `,
})
class TestHost {}

describe('Breadcrumb', () => {
  it('renders an accessible breadcrumb tree', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('nav')?.getAttribute('aria-label')).toBe('breadcrumb');
    expect(element.querySelector('[buiBreadcrumbPage]')?.getAttribute('aria-current')).toBe('page');

    const separator = element.querySelector('[data-slot="breadcrumb-separator"]');
    expect(separator?.getAttribute('aria-hidden')).toBe('true');
    expect(separator?.querySelector('svg')).not.toBeNull();

    expect(
      element.querySelector('[data-slot="breadcrumb-ellipsis"] .sr-only')?.textContent,
    ).toContain('More');
  });
});
