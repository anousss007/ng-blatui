import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiEmpty, BuiEmptyMedia, BuiEmptyTitle } from './empty';

@Component({
  imports: [BuiEmpty, BuiEmptyMedia, BuiEmptyTitle],
  template: `
    <div buiEmpty>
      <div buiEmptyMedia variant="icon">i</div>
      <div buiEmptyTitle>Nothing here</div>
    </div>
  `,
})
class TestHost {}

describe('Empty', () => {
  it('renders the empty state with an icon media variant', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[data-slot="empty"]')).not.toBeNull();
    const media = element.querySelector('[data-slot="empty-media"]')!;
    expect(media.getAttribute('data-variant')).toBe('icon');
    expect(media.className).toContain('bg-muted');
  });
});
