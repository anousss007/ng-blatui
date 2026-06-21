import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiDrawer } from './drawer';

@Component({
  imports: [BuiDrawer],
  template: `
    <bui-drawer [(open)]="open" direction="right">
      <h2>Settings</h2>
    </bui-drawer>
  `,
})
class TestHost {
  readonly open = signal(false);
}

describe('BuiDrawer', () => {
  it('renders the panel only when open and closes on overlay click', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[role="dialog"]')).toBeNull();

    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    expect(root.querySelector('[role="dialog"]')).not.toBeNull();
    expect(root.textContent).toContain('Settings');

    root.querySelector<HTMLElement>('.fixed.inset-0')!.click();
    fixture.detectChanges();
    expect(root.querySelector('[role="dialog"]')).toBeNull();
  });
});
