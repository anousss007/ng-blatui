import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiStepper } from './stepper';
import { BuiStepperItem } from './stepper-item';

@Component({
  imports: [BuiStepper, BuiStepperItem],
  template: `
    <bui-stepper [value]="2">
      <li buiStepperItem [step]="1">Account</li>
      <li buiStepperItem [step]="2">Profile</li>
      <li buiStepperItem [step]="3">Done</li>
    </bui-stepper>
  `,
})
class TestHost {}

describe('BuiStepper', () => {
  it('resolves completed/active/inactive states from the value', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const items = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-slot="stepper-item"]',
    );
    expect(items[0].getAttribute('data-state')).toBe('completed');
    expect(items[1].getAttribute('data-state')).toBe('active');
    expect(items[2].getAttribute('data-state')).toBe('inactive');
  });
});
