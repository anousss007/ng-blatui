import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiTooltip } from './tooltip';

@Component({
  imports: [BuiTooltip],
  template: `<button [buiTooltip]="'Helpful hint'">Hover me</button>`,
})
class TestHost {}

describe('BuiTooltip (on Angular CDK)', () => {
  function getButton() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      'button',
    )!;
    return { fixture, button };
  }

  it('shows a role=tooltip overlay on hover and wires aria-describedby', () => {
    const { fixture, button } = getButton();
    button.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    const tip = document.querySelector('[role="tooltip"]');
    expect(tip).not.toBeNull();
    expect(tip?.textContent).toContain('Helpful hint');
    expect(button.getAttribute('aria-describedby')).toBeTruthy();

    button.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });
});
