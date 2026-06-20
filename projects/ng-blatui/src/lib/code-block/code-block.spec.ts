import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiCodeBlock } from './code-block';

@Component({
  imports: [BuiCodeBlock],
  template: `<bui-code-block filename="app.ts" code="const x = 1;" />`,
})
class TestHost {}

describe('BuiCodeBlock', () => {
  it('renders the filename, code and a copy button', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="code-block"]',
    )!;
    expect(element.textContent).toContain('app.ts');
    expect(element.querySelector('pre code')?.textContent).toContain('const x = 1;');
    expect(element.querySelector('button[aria-label="Copy code"]')).not.toBeNull();
  });
});
