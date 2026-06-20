import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiCountdown } from './countdown';

@Component({
  imports: [BuiCountdown],
  template: `<bui-countdown [to]="target" />`,
})
class TestHost {
  readonly target = 4_102_444_800_000; // year 2100
}

describe('BuiCountdown', () => {
  it('renders a timer with day/hour/minute/second units', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[role="timer"]')).not.toBeNull();
    expect(element.querySelectorAll('[data-slot="countdown-unit"]')).toHaveLength(4);
    expect(element.querySelector('[data-slot="countdown-expired"]')).toBeNull();
    fixture.destroy();
  });
});
