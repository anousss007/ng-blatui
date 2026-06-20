import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiTextarea, type TextareaSize } from './textarea';

@Component({
  imports: [BuiTextarea],
  template: `<textarea buiTextarea [size]="size()"></textarea>`,
})
class TestHost {
  readonly size = signal<TextareaSize>('default');
}

describe('BuiTextarea', () => {
  function setup() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const element = root.querySelector<HTMLTextAreaElement>('textarea')!;
    return { fixture, el: element };
  }

  it('applies slot and default size classes', () => {
    const { el } = setup();
    expect(el.dataset['slot']).toBe('textarea');
    expect(el.classList.contains('field-sizing-content')).toBe(true);
    expect(el.classList.contains('min-h-16')).toBe(true);
  });

  it('reflects the size input', () => {
    const { fixture, el } = setup();
    fixture.componentInstance.size.set('lg');
    fixture.detectChanges();
    expect(el.classList.contains('min-h-20')).toBe(true);
  });
});
