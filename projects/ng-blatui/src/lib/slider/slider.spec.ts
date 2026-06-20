import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiSlider } from './slider';

@Component({
  imports: [BuiSlider],
  template: `<bui-slider [(value)]="value" ariaLabel="Volume" />`,
})
class TestHost {
  readonly value = signal(40);
}

describe('BuiSlider', () => {
  function setup() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const thumb = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '[role="slider"]',
    )!;
    return { fixture, thumb };
  }

  it('exposes role=slider with aria range and value', () => {
    const { thumb } = setup();
    expect(thumb.getAttribute('aria-label')).toBe('Volume');
    expect(thumb.getAttribute('aria-valuenow')).toBe('40');
    expect(thumb.getAttribute('aria-valuemin')).toBe('0');
    expect(thumb.getAttribute('aria-valuemax')).toBe('100');
  });

  it('increments the value on ArrowRight', () => {
    const { fixture, thumb } = setup();
    thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(41);
    expect(thumb.getAttribute('aria-valuenow')).toBe('41');
  });
});
