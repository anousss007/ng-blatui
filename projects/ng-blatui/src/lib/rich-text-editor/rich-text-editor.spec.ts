import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiRichTextEditor } from './rich-text-editor';

@Component({
  imports: [BuiRichTextEditor],
  template: `<bui-rich-text-editor [(value)]="value" />`,
})
class TestHost {
  readonly value = signal('');
}

describe('BuiRichTextEditor', () => {
  it('renders a toolbar and syncs edited content to the value', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('[role="toolbar"] button')).toHaveLength(6);

    const editor = root.querySelector<HTMLElement>('[contenteditable]')!;
    editor.innerHTML = '<strong>Hi</strong>';
    editor.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toContain('<strong>Hi</strong>');
  });
});
