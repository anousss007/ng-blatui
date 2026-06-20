import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiReasoning } from './reasoning';

@Component({
  imports: [BuiReasoning],
  template: `<bui-reasoning duration="3s">The detailed reasoning.</bui-reasoning>`,
})
class TestHost {}

describe('BuiReasoning', () => {
  it('toggles the reasoning body and shows the duration label', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const trigger = root.querySelector<HTMLButtonElement>('[data-slot="reasoning-trigger"]')!;
    expect(trigger.textContent).toContain('Thought for 3s');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    trigger.click();
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(root.textContent).toContain('The detailed reasoning.');
  });
});
