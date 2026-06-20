import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiTerminal } from './terminal';

@Component({
  imports: [BuiTerminal],
  template: `<bui-terminal title="~/app — zsh"><span class="prompt">$</span> ls</bui-terminal>`,
})
class TestHost {}

describe('BuiTerminal', () => {
  it('renders a title bar with traffic lights and a body', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[data-slot="terminal-title"]')?.textContent).toContain('~/app');
    expect(element.querySelectorAll('[data-slot="terminal-bar"] span.size-3')).toHaveLength(3);
    expect(element.querySelector('[data-slot="terminal-body"]')?.textContent).toContain('ls');
  });
});
