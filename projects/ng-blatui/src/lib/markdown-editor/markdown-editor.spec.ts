import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideBuiLabels } from '../i18n/labels';

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

  it('translates the write/preview tabs via provideBuiLabels', () => {
    const bare = TestBed.createComponent(TestHost);
    bare.detectChanges();
    expect((bare.nativeElement as HTMLElement).textContent).toContain('Write');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideBuiLabels({ markdownEditorWrite: 'Écrire', markdownEditorPreview: 'Aperçu' }),
      ],
    });
    const translated = TestBed.createComponent(TestHost);
    translated.detectChanges();
    const text = (translated.nativeElement as HTMLElement).textContent;
    expect(text).toContain('Écrire');
    expect(text).toContain('Aperçu');
    expect(text).not.toContain('Write');
  });
});
