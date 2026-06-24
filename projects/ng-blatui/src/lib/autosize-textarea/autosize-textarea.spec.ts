/* eslint-disable @typescript-eslint/no-deprecated, sonarjs/deprecation
   -- this suite intentionally exercises the deprecated buiAutosizeTextarea compatibility alias */
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiAutosizeTextarea } from './autosize-textarea';

@Component({
  imports: [BuiAutosizeTextarea],
  template: `<textarea
    buiAutosizeTextarea
    size="lg"
    [maxRows]="4"
    placeholder="Message"
  ></textarea>`,
})
class TestHost {}

describe('BuiAutosizeTextarea', () => {
  it('aliases buiTextarea: auto-grows, reflects size and caps at maxRows', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const textarea = (fixture.nativeElement as HTMLElement).querySelector('textarea')!;
    expect(textarea.getAttribute('data-slot')).toBe('autosize-textarea');
    expect(textarea.getAttribute('data-size')).toBe('lg');
    // Inherited from buiTextarea: CSS auto-grow, not a fixed resize handle.
    expect(textarea.className).toContain('field-sizing-content');
    expect(textarea.className).toContain('min-h-20');
    // maxRows caps the height (4 rows + lg vertical padding 1.25rem + 2px borders).
    const max = textarea.style.maxHeight;
    expect(max).toContain('4lh');
    expect(max).toContain('1.25rem');
    expect(max).toContain('2px');
    expect(textarea.style.overflowY).toBe('auto');
  });
});
