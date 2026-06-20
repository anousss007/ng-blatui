import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiBanner } from './banner';

@Component({
  imports: [BuiBanner],
  template: `<bui-banner tone="success">Heads up!</bui-banner>`,
})
class TestHost {}

describe('BuiBanner', () => {
  it('is a labelled region that can be dismissed', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const banner = (fixture.nativeElement as HTMLElement).querySelector('bui-banner')!;
    expect(banner.getAttribute('role')).toBe('region');
    expect(banner.getAttribute('aria-label')).toBe('Announcement');
    expect(banner.hasAttribute('hidden')).toBe(false);

    const dismiss = banner.querySelector<HTMLButtonElement>('button[aria-label="Dismiss"]')!;
    dismiss.click();
    fixture.detectChanges();
    expect(banner.hasAttribute('hidden')).toBe(true);
  });
});
