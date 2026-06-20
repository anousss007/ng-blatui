import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiConfetti } from './confetti';

@Component({
  imports: [BuiConfetti],
  template: `<bui-confetti [count]="12" />`,
})
class TestHost {}

describe('BuiConfetti', () => {
  it('spawns particles when the trigger is clicked', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('button')?.textContent).toContain('Celebrate');

    root.querySelector('button')!.click();
    fixture.detectChanges();
    expect(root.querySelectorAll('.bui-confetti-particle')).toHaveLength(12);
    fixture.destroy();
  });
});
