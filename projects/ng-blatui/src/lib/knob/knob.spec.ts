import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiKnob } from './knob';

@Component({
  imports: [BuiKnob],
  template: `<bui-knob [(value)]="level" [min]="0" [max]="100" />`,
})
class TestHost {
  readonly level = signal(50);
}

describe('BuiKnob', () => {
  it('is a slider that responds to arrow keys', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const dial = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '[role="slider"]',
    )!;
    expect(dial.getAttribute('aria-valuenow')).toBe('50');

    dial.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.level()).toBe(51);
  });
});
