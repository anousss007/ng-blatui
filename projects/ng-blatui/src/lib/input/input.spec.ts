import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiInput, type InputSize } from './input';

@Component({
  imports: [BuiInput],
  template: `<input buiInput [size]="size()" />`,
})
class TestHost {
  readonly size = signal<InputSize>('default');
}

describe('BuiInput', () => {
  function setup() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const element = root.querySelector<HTMLInputElement>('input')!;
    return { fixture, el: element };
  }

  it('applies slot, size attribute and base classes', () => {
    const { el } = setup();
    expect(el.dataset['slot']).toBe('input');
    expect(el.dataset['size']).toBe('default');
    expect(el.classList.contains('border-input')).toBe(true);
    expect(el.classList.contains('h-9')).toBe(true);
  });

  it('reflects the size input', () => {
    const { fixture, el } = setup();
    fixture.componentInstance.size.set('lg');
    fixture.detectChanges();
    expect(el.dataset['size']).toBe('lg');
    expect(el.classList.contains('h-10')).toBe(true);
  });
});
