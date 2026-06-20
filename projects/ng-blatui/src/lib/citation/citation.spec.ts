import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiCitation } from './citation';

@Component({
  imports: [BuiCitation],
  template: `<bui-citation [index]="1" title="The Source" url="https://www.example.com/article" />`,
})
class TestHost {}

describe('BuiCitation', () => {
  it('opens a source popover with the hostname', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const trigger = root.querySelector<HTMLButtonElement>('button')!;
    expect(trigger.getAttribute('aria-label')).toContain('The Source');

    trigger.click();
    fixture.detectChanges();
    const tip = root.querySelector('[role="tooltip"]')!;
    expect(tip.textContent).toContain('The Source');
    expect(tip.textContent).toContain('example.com');
    fixture.destroy();
  });
});
