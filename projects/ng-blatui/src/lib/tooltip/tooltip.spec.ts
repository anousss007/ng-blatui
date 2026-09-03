import { FocusMonitor } from '@angular/cdk/a11y';
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

  it('shows on keyboard focus but not on a focus the pointer caused', () => {
    const { fixture, button } = getButton();
    const focusMonitor = TestBed.inject(FocusMonitor);

    // The shape that left a tooltip stuck on screen: a dialog opened from this button restores
    // focus to it on close, with the pointer long gone and no `mouseleave` left to come.
    focusMonitor.focusVia(button, 'mouse');
    fixture.detectChanges();
    expect(document.activeElement).toBe(button); // the focus really landed
    expect(document.querySelector('[role="tooltip"]')).toBeNull();

    focusMonitor.focusVia(button, 'keyboard');
    fixture.detectChanges();
    expect(document.querySelector('[role="tooltip"]')?.textContent).toContain('Helpful hint');

    fixture.destroy();
  });
});
