import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiLabel } from './label';

@Component({
  imports: [BuiLabel],
  template: `<label buiLabel class="custom-x">Name<input type="text" /></label>`,
})
class TestHost {}

describe('BuiLabel', () => {
  it('applies data-slot, base classes and merges user classes', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const element = root.querySelector<HTMLLabelElement>('label')!;
    expect(element.dataset['slot']).toBe('label');
    expect(element.className).toContain('font-medium');
    expect(element.className).toContain('custom-x');
  });
});
