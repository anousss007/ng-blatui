import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiTagsInput } from './tags-input';

@Component({
  imports: [BuiTagsInput],
  template: `<bui-tags-input [(tags)]="tags" />`,
})
class TestHost {
  readonly tags = signal<string[]>(['ng']);
}

describe('BuiTagsInput', () => {
  it('adds a tag on Enter and removes via the chip button', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const input = root.querySelector<HTMLInputElement>('input')!;

    input.value = 'rxjs';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.tags()).toEqual(['ng', 'rxjs']);

    root.querySelector<HTMLButtonElement>('span button')!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.tags()).toEqual(['rxjs']);
  });
});
