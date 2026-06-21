import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiOnboardingTour, type TourStep } from './onboarding-tour';

@Component({
  imports: [BuiOnboardingTour],
  template: `
    <div id="anchor">Target</div>
    <bui-onboarding-tour [(open)]="open" [steps]="steps" />
  `,
})
class TestHost {
  readonly open = signal(false);
  readonly steps: TourStep[] = [
    { target: '#anchor', title: 'Welcome', body: 'Start here' },
    { target: '#anchor', title: 'Step two', body: 'Then this' },
  ];
}

describe('BuiOnboardingTour', () => {
  it('steps through the tour', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[role="dialog"]')).toBeNull();

    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    expect(root.querySelector('[role="dialog"]')!.textContent).toContain('Welcome');

    const buttons = root.querySelectorAll<HTMLButtonElement>('[role="dialog"] button');
    buttons.item(buttons.length - 1).click(); // Next
    fixture.detectChanges();
    expect(root.querySelector('[role="dialog"]')!.textContent).toContain('Step two');
  });
});
