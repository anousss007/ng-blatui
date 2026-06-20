import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiLoadingOverlay } from './loading-overlay';

@Component({
  imports: [BuiLoadingOverlay],
  template: `<bui-loading-overlay [show]="true" message="Saving…">Content</bui-loading-overlay>`,
})
class TestHost {}

describe('BuiLoadingOverlay', () => {
  it('shows a status veil while busy', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="loading-overlay"]',
    )!;
    expect(element.getAttribute('aria-busy')).toBe('true');
    expect(element.querySelector('[role="status"]')?.textContent).toContain('Saving…');
  });
});
