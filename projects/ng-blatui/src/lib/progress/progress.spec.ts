import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiProgress } from './progress';

@Component({
  imports: [BuiProgress],
  template: `<bui-progress [value]="value()" [indeterminate]="indeterminate()" />`,
})
class TestHost {
  readonly value = signal(40);
  readonly indeterminate = signal(false);
}

describe('BuiProgress', () => {
  function setup() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const element = root.querySelector<HTMLElement>('bui-progress')!;
    return { fixture, el: element };
  }

  it('exposes the full progressbar ARIA contract', () => {
    const { el } = setup();
    expect(el.getAttribute('role')).toBe('progressbar');
    expect(el.getAttribute('aria-valuemin')).toBe('0');
    expect(el.getAttribute('aria-valuemax')).toBe('100');
    expect(el.getAttribute('aria-valuenow')).toBe('40');
    expect(el.getAttribute('aria-valuetext')).toBe('40%');
  });

  it('moves the indicator to match the value', () => {
    const { el } = setup();
    const indicator = el.querySelector<HTMLElement>('[data-slot="progress-indicator"]')!;
    expect(indicator.style.transform).toBe('translateX(-60%)');
  });

  it('drops aria-valuenow when indeterminate', () => {
    const { fixture, el } = setup();
    fixture.componentInstance.indeterminate.set(true);
    fixture.detectChanges();
    expect(el.getAttribute('aria-valuenow')).toBeNull();
  });
});
