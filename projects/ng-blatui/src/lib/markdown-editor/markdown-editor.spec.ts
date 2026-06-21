import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiMarkdownEditor } from './markdown-editor';

@Component({
  imports: [BuiMarkdownEditor],
  template: `<bui-markdown-editor [(value)]="md" />`,
})
class TestHost {
  readonly md = signal('# Title\n**bold** and `code`');
}

describe('BuiMarkdownEditor', () => {
  it('renders sanitized markdown in the preview tab', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    root.querySelectorAll<HTMLButtonElement>('button')[1].click(); // Preview
    fixture.detectChanges();
    const preview = root.querySelector('[data-slot="markdown-preview"]')!;
    expect(preview.innerHTML).toContain('<strong>bold</strong>');
    expect(preview.innerHTML).toContain('<h1>Title</h1>');
  });
});
