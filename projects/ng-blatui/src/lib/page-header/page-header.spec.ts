import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiPageHeader } from './page-header';

@Component({
  imports: [BuiPageHeader],
  template: `<bui-page-header heading="Settings" description="Manage your account" />`,
})
class TestHost {}

describe('BuiPageHeader', () => {
  it('renders the heading and description', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent).toContain('Settings');
    expect(element.querySelector('p')?.textContent).toContain('Manage your account');
  });
});
