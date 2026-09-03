/* eslint-disable sonarjs/no-floating-point-equality -- exactness is the assertion here:
   the rounding exists so a stepped value is the one the caller described, not one near it. */
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

@Component({
  imports: [BuiKnob],
  template: `<bui-knob [(value)]="gain" [min]="0" [max]="2" [step]="0.1" />`,
})
class FractionalHost {
  readonly gain = signal(1.1);
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

  it('stays on the values a fractional step describes', () => {
    const fixture = TestBed.createComponent(FractionalHost);
    fixture.detectChanges();
    const dial = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '[role="slider"]',
    )!;

    for (let index = 0; index < 8; index++) {
      dial.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    }
    fixture.detectChanges();
    expect(fixture.componentInstance.gain()).toBe(1.9);
  });
});
