import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiSeparator, type SeparatorOrientation } from './separator';

@Component({
  imports: [BuiSeparator],
  template: `<div buiSeparator [orientation]="orientation()" [decorative]="decorative()"></div>`,
})
class TestHost {
  readonly orientation = signal<SeparatorOrientation>('horizontal');
  readonly decorative = signal(true);
}

describe('BuiSeparator', () => {
  function setup() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const element = root.querySelector<HTMLDivElement>('div')!;
    return { fixture, el: element };
  }

  it('is decorative by default (role=none, no aria-orientation)', () => {
    const { el } = setup();
    expect(el.dataset['slot']).toBe('separator');
    expect(el.getAttribute('role')).toBe('none');
    expect(el.getAttribute('aria-orientation')).toBeNull();
    expect(el.dataset['orientation']).toBe('horizontal');
  });

  it('exposes a semantic separator role with aria-orientation when not decorative', () => {
    const { fixture, el } = setup();
    fixture.componentInstance.decorative.set(false);
    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();
    expect(el.getAttribute('role')).toBe('separator');
    expect(el.getAttribute('aria-orientation')).toBe('vertical');
    expect(el.dataset['orientation']).toBe('vertical');
  });
});
