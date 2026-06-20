import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiStreamingText } from './streaming-text';

@Component({
  imports: [BuiStreamingText],
  template: `<bui-streaming-text text="Hello there, world." />`,
})
class TestHost {}

describe('BuiStreamingText', () => {
  it('carries the full passage in a live region', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const live = (fixture.nativeElement as HTMLElement).querySelector('[aria-live="polite"]');
    expect(live?.textContent).toContain('Hello there, world.');
    fixture.destroy();
  });
});
