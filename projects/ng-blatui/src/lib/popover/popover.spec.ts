import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiPopover, BuiPopoverContent } from './popover';

@Component({
  imports: [BuiPopover, BuiPopoverContent],
  template: `
    <button [buiPopover]="tpl">Open</button>
    <ng-template #tpl><div buiPopoverContent>Popover body</div></ng-template>
  `,
})
class TestHost {}

describe('BuiPopover (on Angular CDK)', () => {
  it('opens a role=dialog overlay on click', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    expect(button.getAttribute('aria-haspopup')).toBe('dialog');
    expect(button.getAttribute('aria-expanded')).toBe('false');

    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    const content = document.querySelector('[data-slot="popover-content"]');
    expect(content?.getAttribute('role')).toBe('dialog');
    expect(content?.textContent).toContain('Popover body');

    fixture.destroy();
    expect(document.querySelector('[data-slot="popover-content"]')).toBeNull();
  });
});
