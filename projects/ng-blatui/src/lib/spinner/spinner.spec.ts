import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiSpinner } from './spinner';

@Component({
  imports: [BuiSpinner],
  template: `<bui-spinner />`,
})
class TestHost {}

describe('BuiSpinner', () => {
  it('is an accessible, animated status indicator', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector('bui-spinner')!;
    expect(element.getAttribute('role')).toBe('status');
    expect(element.getAttribute('aria-label')).toBe('Loading');
    expect(element.className).toContain('animate-spin');
    expect(element.querySelector('svg')).not.toBeNull();
  });
});
