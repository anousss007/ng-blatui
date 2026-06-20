import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiAutosizeTextarea } from './autosize-textarea';

@Component({
  imports: [BuiAutosizeTextarea],
  template: `<textarea buiAutosizeTextarea size="lg" placeholder="Message"></textarea>`,
})
class TestHost {}

describe('BuiAutosizeTextarea', () => {
  it('styles a textarea and reflects size, without resize handles', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const textarea = (fixture.nativeElement as HTMLElement).querySelector('textarea')!;
    expect(textarea.getAttribute('data-slot')).toBe('autosize-textarea');
    expect(textarea.getAttribute('data-size')).toBe('lg');
    expect(textarea.className).toContain('resize-none');
    expect(textarea.className).toContain('min-h-20');
  });
});
