import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiCollapsible, BuiCollapsibleContent, BuiCollapsibleTrigger } from './collapsible';

@Component({
  imports: [BuiCollapsible, BuiCollapsibleTrigger, BuiCollapsibleContent],
  template: `
    <div buiCollapsible>
      <button buiCollapsibleTrigger>Toggle</button>
      <div buiCollapsibleContent>Body</div>
    </div>
  `,
})
class TestHost {}

describe('Collapsible', () => {
  it('toggles content visibility and wires aria-controls', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const trigger = element.querySelector<HTMLButtonElement>('[data-slot="collapsible-trigger"]')!;
    const content = element.querySelector<HTMLElement>('[data-slot="collapsible-content"]')!;

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(content.hasAttribute('hidden')).toBe(true);
    expect(trigger.getAttribute('aria-controls')).toBe(content.id);

    trigger.click();
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(content.hasAttribute('hidden')).toBe(false);
  });
});
