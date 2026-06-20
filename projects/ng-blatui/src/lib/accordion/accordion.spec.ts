import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AccordionContent,
  AccordionGroup,
  AccordionPanel,
  AccordionTrigger,
  BuiAccordion,
  BuiAccordionContent,
  BuiAccordionItem,
  BuiAccordionTrigger,
} from './accordion';

@Component({
  imports: [
    AccordionGroup,
    AccordionTrigger,
    AccordionPanel,
    AccordionContent,
    BuiAccordion,
    BuiAccordionItem,
    BuiAccordionTrigger,
    BuiAccordionContent,
  ],
  template: `
    <div ngAccordionGroup buiAccordion [multiExpandable]="false">
      <div buiAccordionItem>
        <h3 class="flex">
          <button ngAccordionTrigger buiAccordionTrigger [panel]="p1">Trigger 1</button>
        </h3>
        <div ngAccordionPanel #p1="ngAccordionPanel" buiAccordionContent>
          <ng-template ngAccordionContent><div class="pb-4">Panel 1 content</div></ng-template>
        </div>
      </div>
    </div>
  `,
})
class TestHost {}

describe('BuiAccordion (on Angular Aria)', () => {
  function setup() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const trigger = root.querySelector<HTMLButtonElement>('[data-slot="accordion-trigger"]')!;
    return { fixture, root, trigger };
  }

  it('wires the Aria ARIA contract and BlatUI styling', () => {
    const { root, trigger } = setup();
    expect(root.querySelector('[data-slot="accordion"]')).not.toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBeTruthy();
    expect(trigger.className).toContain('font-medium');
  });

  it('expands on click and renders the deferred panel content', () => {
    const { fixture, root, trigger } = setup();
    trigger.click();
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(root.textContent).toContain('Panel 1 content');
  });
});
