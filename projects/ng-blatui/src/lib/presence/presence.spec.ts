import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiPresence } from './presence';

@Component({
  imports: [BuiPresence],
  template: `<bui-presence status="busy" />`,
})
class TestHost {}

describe('BuiPresence', () => {
  it('renders the dot colour and an accessible label', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector('[data-slot="presence"]')!;
    expect(element.querySelector('.bg-red-500')).not.toBeNull();
    expect(element.querySelector('.sr-only')?.textContent).toContain('Busy');
  });
});
