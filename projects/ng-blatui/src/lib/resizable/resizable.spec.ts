import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiResizableHandle } from './resizable-handle';
import { BuiResizablePanel } from './resizable-panel';
import { BuiResizablePanelGroup } from './resizable-panel-group';

@Component({
  imports: [BuiResizablePanelGroup, BuiResizablePanel, BuiResizableHandle],
  template: `
    <bui-resizable-panel-group [(size)]="size">
      <div buiResizablePanel [primary]="true">A</div>
      <bui-resizable-handle />
      <div buiResizablePanel>B</div>
    </bui-resizable-panel-group>
  `,
})
class TestHost {
  readonly size = signal(50);
}

describe('BuiResizable', () => {
  it('exposes a separator handle and nudges size with arrow keys', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const handle = root.querySelector<HTMLElement>('[role="separator"]')!;
    expect(handle.getAttribute('aria-valuenow')).toBe('50');

    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.size()).toBe(52);
  });
});
