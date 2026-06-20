import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiButton, type ButtonVariant } from './button';

@Component({
  imports: [BuiButton],
  template: `<button buiButton [variant]="variant()" size="sm" class="extra-class">Click</button>`,
})
class TestHost {
  readonly variant = signal<ButtonVariant>('default');
}

describe('BuiButton', () => {
  function setup() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const element = root.querySelector<HTMLButtonElement>('button')!;
    return { fixture, el: element };
  }

  it('sets data-slot and merges base, size and user classes', () => {
    const { el } = setup();
    expect(el.dataset['slot']).toBe('button');
    expect(el.className).toContain('bg-primary');
    expect(el.className).toContain('h-8');
    expect(el.className).toContain('extra-class');
  });

  it('reflects the variant input reactively', () => {
    const { fixture, el } = setup();
    fixture.componentInstance.variant.set('destructive');
    fixture.detectChanges();
    expect(el.className).toContain('bg-destructive');
    expect(el.className).not.toContain('bg-primary');
  });
});
