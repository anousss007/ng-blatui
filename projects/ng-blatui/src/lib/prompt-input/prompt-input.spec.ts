import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiPromptInput } from './prompt-input';

@Component({
  imports: [BuiPromptInput],
  template: `<bui-prompt-input (submitted)="last = $event" />`,
})
class TestHost {
  last = '';
}

describe('BuiPromptInput', () => {
  it('emits the message on send and clears the field', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const textarea = root.querySelector<HTMLTextAreaElement>('textarea')!;

    textarea.value = 'Hello world';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    root.querySelector<HTMLButtonElement>('button[aria-label="Send"]')!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.last).toBe('Hello world');
    expect(textarea.value).toBe('');
  });
});
